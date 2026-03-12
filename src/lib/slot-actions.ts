"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { requireOrgAccess } from "./actions";
import {
  sendShiftSignupConfirmationEmail,
  sendWaitlistNotificationEmail,
  sendWaitlistPromotionEmail,
  sendShiftCancellationEmail,
} from "./email";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

// Type available via: Awaited<ReturnType<typeof getEventShifts>>[number]

// ──────────────────────────────────────────
// Admin Actions
// ──────────────────────────────────────────

export async function createShift(
  eventId: string,
  data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    defaultMaxVolunteers: number;
  }
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { orgId: true },
  });
  if (!event) return { error: "Event not found" };
  await requireOrgAccess(event.orgId);

  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if (end <= start) return { error: "End time must be after start time" };
  if (data.slotDurationMinutes <= 0) return { error: "Slot duration must be positive" };
  if (data.defaultMaxVolunteers < 1) return { error: "Need at least 1 volunteer per slot" };

  const totalMinutes = (end.getTime() - start.getTime()) / 60000;
  const slotCount = Math.floor(totalMinutes / data.slotDurationMinutes);

  if (slotCount === 0) return { error: "Duration too short for even one slot" };

  const slots = Array.from({ length: slotCount }, (_, i) => {
    const slotStart = new Date(start.getTime() + i * data.slotDurationMinutes * 60000);
    const slotEnd = new Date(slotStart.getTime() + data.slotDurationMinutes * 60000);
    return {
      startTime: slotStart,
      endTime: slotEnd,
      maxVolunteers: data.defaultMaxVolunteers,
    };
  });

  const shift = await prisma.$transaction(async (tx) => {
    const created = await tx.volunteerShift.create({
      data: {
        eventId,
        title: data.title,
        description: data.description || null,
        startTime: start,
        endTime: end,
        slotDurationMinutes: data.slotDurationMinutes,
        defaultMaxVolunteers: data.defaultMaxVolunteers,
        slots: { create: slots },
      },
      include: { slots: true },
    });
    return created;
  });

  revalidatePath(`/admin/org/${event.orgId}/events/${eventId}`);
  return { success: true, shift };
}

export async function createShiftsForDays(
  eventId: string,
  data: {
    title: string;
    description?: string;
    startTimeOfDay: string; // "HH:MM"
    endTimeOfDay: string; // "HH:MM"
    slotDurationMinutes: number;
    defaultMaxVolunteers: number;
  },
  dates: string[] // ISO date strings "YYYY-MM-DD"
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { orgId: true },
  });
  if (!event) return { error: "Event not found" };
  await requireOrgAccess(event.orgId);

  if (data.slotDurationMinutes <= 0) return { error: "Slot duration must be positive" };
  if (data.defaultMaxVolunteers < 1) return { error: "Need at least 1 volunteer per slot" };
  if (dates.length === 0) return { error: "Select at least one date" };

  const shifts = await prisma.$transaction(async (tx) => {
    const created = [];
    for (const dateStr of dates) {
      const start = new Date(`${dateStr}T${data.startTimeOfDay}`);
      const end = new Date(`${dateStr}T${data.endTimeOfDay}`);

      if (end <= start) continue;

      const totalMinutes = (end.getTime() - start.getTime()) / 60000;
      const slotCount = Math.floor(totalMinutes / data.slotDurationMinutes);
      if (slotCount === 0) continue;

      const slots = Array.from({ length: slotCount }, (_, i) => {
        const slotStart = new Date(start.getTime() + i * data.slotDurationMinutes * 60000);
        const slotEnd = new Date(slotStart.getTime() + data.slotDurationMinutes * 60000);
        return {
          startTime: slotStart,
          endTime: slotEnd,
          maxVolunteers: data.defaultMaxVolunteers,
        };
      });

      const shift = await tx.volunteerShift.create({
        data: {
          eventId,
          title: data.title,
          description: data.description || null,
          startTime: start,
          endTime: end,
          slotDurationMinutes: data.slotDurationMinutes,
          defaultMaxVolunteers: data.defaultMaxVolunteers,
          slots: { create: slots },
        },
        include: { slots: true },
      });
      created.push(shift);
    }
    return created;
  });

  revalidatePath(`/admin/org/${event.orgId}/events/${eventId}`);
  return { success: true, shifts };
}

export async function updateShift(
  shiftId: string,
  data: { title?: string; description?: string }
) {
  const shift = await prisma.volunteerShift.findUnique({
    where: { id: shiftId },
    include: { event: { select: { orgId: true, id: true } } },
  });
  if (!shift) return { error: "Shift not found" };
  await requireOrgAccess(shift.event.orgId);

  await prisma.volunteerShift.update({
    where: { id: shiftId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description || null }),
    },
  });

  revalidatePath(`/admin/org/${shift.event.orgId}/events/${shift.event.id}`);
  return { success: true };
}

export async function deleteShift(shiftId: string) {
  const shift = await prisma.volunteerShift.findUnique({
    where: { id: shiftId },
    include: {
      event: { select: { orgId: true, id: true, name: true, org: { select: { name: true, slug: true } } } },
      slots: {
        include: {
          signups: {
            where: { status: { not: "CANCELLED" } },
            select: { volunteerEmail: true, volunteerName: true, slotId: true },
          },
        },
      },
    },
  });
  if (!shift) return { error: "Shift not found" };
  await requireOrgAccess(shift.event.orgId);

  // Prefetch signup data for cancellation emails
  const affectedSignups = shift.slots.flatMap((slot) =>
    slot.signups.map((s) => ({
      email: s.volunteerEmail,
      name: s.volunteerName,
      slotStartTime: slot.startTime,
      slotEndTime: slot.endTime,
    }))
  );

  await prisma.volunteerShift.delete({ where: { id: shiftId } });

  // Send cancellation emails non-blockingly
  for (const signup of affectedSignups) {
    try {
      await sendShiftCancellationEmail(
        signup.email,
        signup.name,
        shift.title,
        shift.event.name,
        shift.event.org.name,
        signup.slotStartTime,
        signup.slotEndTime,
        shift.event.org.slug
      );
    } catch (e) {
      console.error("Shift cancellation email error:", e);
    }
  }

  revalidatePath(`/admin/org/${shift.event.orgId}/events/${shift.event.id}`);
  return { success: true };
}

export async function updateSlot(
  slotId: string,
  data: { maxVolunteers?: number; startTime?: string; endTime?: string }
) {
  const slot = await prisma.volunteerSlot.findUnique({
    where: { id: slotId },
    include: {
      shift: { include: { event: { select: { orgId: true, id: true } } } },
      _count: { select: { signups: true } },
    },
  });
  if (!slot) return { error: "Slot not found" };
  await requireOrgAccess(slot.shift.event.orgId);

  if (data.maxVolunteers !== undefined) {
    const confirmedCount = await prisma.volunteerSlotSignup.count({
      where: { slotId, status: "CONFIRMED" },
    });
    if (data.maxVolunteers < confirmedCount) {
      return { error: `Cannot reduce capacity below ${confirmedCount} confirmed signups` };
    }
  }

  await prisma.volunteerSlot.update({
    where: { id: slotId },
    data: {
      ...(data.maxVolunteers !== undefined && { maxVolunteers: data.maxVolunteers }),
      ...(data.startTime !== undefined && { startTime: new Date(data.startTime) }),
      ...(data.endTime !== undefined && { endTime: new Date(data.endTime) }),
    },
  });

  revalidatePath(`/admin/org/${slot.shift.event.orgId}/events/${slot.shift.event.id}`);
  return { success: true };
}

export async function deleteSlot(slotId: string) {
  const slot = await prisma.volunteerSlot.findUnique({
    where: { id: slotId },
    include: {
      shift: {
        include: {
          event: { select: { orgId: true, id: true, name: true, org: { select: { name: true, slug: true } } } },
        },
      },
      signups: {
        where: { status: { not: "CANCELLED" } },
        select: { volunteerEmail: true, volunteerName: true },
      },
    },
  });
  if (!slot) return { error: "Slot not found" };
  await requireOrgAccess(slot.shift.event.orgId);

  // Prefetch affected signups
  const affectedSignups = slot.signups.map((s) => ({
    email: s.volunteerEmail,
    name: s.volunteerName,
  }));

  await prisma.volunteerSlot.delete({ where: { id: slotId } });

  // Send cancellation emails non-blockingly
  for (const signup of affectedSignups) {
    try {
      await sendShiftCancellationEmail(
        signup.email,
        signup.name,
        slot.shift.title,
        slot.shift.event.name,
        slot.shift.event.org.name,
        slot.startTime,
        slot.endTime,
        slot.shift.event.org.slug
      );
    } catch (e) {
      console.error("Slot cancellation email error:", e);
    }
  }

  revalidatePath(`/admin/org/${slot.shift.event.orgId}/events/${slot.shift.event.id}`);
  return { success: true };
}

export async function getEventShifts(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { orgId: true },
  });
  if (!event) return [];
  await requireOrgAccess(event.orgId);

  return prisma.volunteerShift.findMany({
    where: { eventId },
    include: {
      slots: {
        include: {
          signups: {
            orderBy: { createdAt: "asc" },
          },
          _count: {
            select: { signups: true },
          },
        },
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: { startTime: "asc" },
  });
}

// ──────────────────────────────────────────
// Volunteer Actions (public, no auth)
// ──────────────────────────────────────────

export async function getEventShiftsPublic(eventId: string) {
  const shifts = await prisma.volunteerShift.findMany({
    where: { eventId },
    include: {
      slots: {
        include: {
          _count: {
            select: { signups: true },
          },
          signups: {
            where: { status: { not: "CANCELLED" } },
            select: { status: true },
          },
        },
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: { startTime: "asc" },
  });

  // Map to public-safe data (no PII)
  return shifts.map((shift) => ({
    id: shift.id,
    eventId: shift.eventId,
    title: shift.title,
    description: shift.description,
    startTime: shift.startTime,
    endTime: shift.endTime,
    slotDurationMinutes: shift.slotDurationMinutes,
    slots: shift.slots.map((slot) => ({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxVolunteers: slot.maxVolunteers,
      confirmedCount: slot.signups.filter((s) => s.status === "CONFIRMED").length,
      waitlistCount: slot.signups.filter((s) => s.status === "WAITLISTED").length,
    })),
  }));
}

export async function signupForSlot(
  slotId: string,
  email: string,
  volunteerName: string,
  familyMemberName: string = ""
) {
  const slot = await prisma.volunteerSlot.findUnique({
    where: { id: slotId },
    include: {
      shift: {
        include: {
          event: {
            select: {
              id: true,
              orgId: true,
              name: true,
              org: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  });
  if (!slot) return { error: "Slot not found" };

  // Verify org-level waiver exists
  const waiverCount = await prisma.waiver.count({
    where: { email: email.toLowerCase(), event: { orgId: slot.shift.event.orgId } },
  });
  if (waiverCount === 0) {
    return { error: "No waiver on file. You need a signed waiver to sign up for shifts." };
  }

  // Reject past slots
  if (slot.startTime < new Date()) {
    return { error: "This slot has already started" };
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // Check for existing non-cancelled signup
        const existing = await tx.volunteerSlotSignup.findUnique({
          where: {
            slotId_volunteerEmail_familyMemberName: {
              slotId,
              volunteerEmail: email.toLowerCase(),
              familyMemberName,
            },
          },
        });
        if (existing && existing.status !== "CANCELLED") {
          throw new Error("Already signed up for this slot");
        }

        // If there's a cancelled signup, delete it so we can create a fresh one
        if (existing && existing.status === "CANCELLED") {
          await tx.volunteerSlotSignup.delete({ where: { id: existing.id } });
        }

        const confirmedCount = await tx.volunteerSlotSignup.count({
          where: { slotId, status: "CONFIRMED" },
        });

        if (confirmedCount < slot.maxVolunteers) {
          // Confirmed
          const signup = await tx.volunteerSlotSignup.create({
            data: {
              slotId,
              volunteerEmail: email.toLowerCase(),
              volunteerName,
              familyMemberName,
              status: "CONFIRMED",
            },
          });
          return { signup, status: "CONFIRMED" as const };
        } else {
          // Waitlisted
          const maxPos = await tx.volunteerSlotSignup.aggregate({
            where: { slotId, status: "WAITLISTED" },
            _max: { waitlistPosition: true },
          });
          const position = (maxPos._max.waitlistPosition ?? 0) + 1;

          const signup = await tx.volunteerSlotSignup.create({
            data: {
              slotId,
              volunteerEmail: email.toLowerCase(),
              volunteerName,
              familyMemberName,
              status: "WAITLISTED",
              waitlistPosition: position,
            },
          });
          return { signup, status: "WAITLISTED" as const };
        }
      },
      { isolationLevel: "Serializable" }
    );

    // Send email after transaction
    try {
      if (result.status === "CONFIRMED") {
        await sendShiftSignupConfirmationEmail(
          email,
          volunteerName,
          slot.shift.title,
          slot.shift.event.name,
          slot.shift.event.org.name,
          slot.startTime,
          slot.endTime,
          slot.shift.event.org.slug
        );
      } else {
        await sendWaitlistNotificationEmail(
          email,
          volunteerName,
          slot.shift.title,
          slot.shift.event.name,
          slot.shift.event.org.name,
          slot.startTime,
          slot.endTime,
          slot.shift.event.org.slug
        );
      }
    } catch (e) {
      console.error("Shift signup email error:", e);
    }

    revalidatePath(`/volunteer`);
    return { success: true, status: result.status };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Signup failed";
    if (message.includes("Already signed up") || message.includes("Unique constraint")) {
      return { error: "Already signed up for this slot" };
    }
    return { error: message };
  }
}

export async function cancelSlotSignup(signupId: string, email: string) {
  const signup = await prisma.volunteerSlotSignup.findUnique({
    where: { id: signupId },
    include: {
      slot: {
        include: {
          shift: {
            include: {
              event: {
                select: {
                  name: true,
                  org: { select: { name: true, slug: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!signup) return { error: "Signup not found" };
  if (signup.volunteerEmail !== email.toLowerCase()) {
    return { error: "Not authorized to cancel this signup" };
  }
  if (signup.status === "CANCELLED") {
    return { error: "Already cancelled" };
  }

  const wasConfirmed = signup.status === "CONFIRMED";
  const slotNotStarted = signup.slot.startTime > new Date();

  const result = await prisma.$transaction(async (tx) => {
    // Cancel the signup
    await tx.volunteerSlotSignup.update({
      where: { id: signupId },
      data: { status: "CANCELLED", cancelledAt: new Date(), waitlistPosition: null },
    });

    let promoted = null;

    // Promote from waitlist if was confirmed and slot hasn't started
    if (wasConfirmed && slotNotStarted) {
      const firstWaitlisted = await tx.volunteerSlotSignup.findFirst({
        where: { slotId: signup.slotId, status: "WAITLISTED" },
        orderBy: { waitlistPosition: "asc" },
      });

      if (firstWaitlisted) {
        await tx.volunteerSlotSignup.update({
          where: { id: firstWaitlisted.id },
          data: { status: "CONFIRMED", waitlistPosition: null },
        });

        // Decrement waitlist positions for remaining waitlisted signups
        await tx.volunteerSlotSignup.updateMany({
          where: {
            slotId: signup.slotId,
            status: "WAITLISTED",
            waitlistPosition: { gt: firstWaitlisted.waitlistPosition! },
          },
          data: { waitlistPosition: { decrement: 1 } },
        });

        promoted = firstWaitlisted;
      }
    }

    return { promoted };
  });

  // Send promotion email
  if (result.promoted) {
    try {
      await sendWaitlistPromotionEmail(
        result.promoted.volunteerEmail,
        result.promoted.volunteerName,
        signup.slot.shift.title,
        signup.slot.shift.event.name,
        signup.slot.shift.event.org.name,
        signup.slot.startTime,
        signup.slot.endTime,
        signup.slot.shift.event.org.slug
      );
    } catch (e) {
      console.error("Waitlist promotion email error:", e);
    }
  }

  revalidatePath(`/volunteer`);
  return { success: true };
}

export async function getVolunteerSlotSignups(orgId: string, email: string) {
  return prisma.volunteerSlotSignup.findMany({
    where: {
      volunteerEmail: email.toLowerCase(),
      status: { not: "CANCELLED" },
      slot: {
        shift: {
          event: {
            orgId,
            date: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Include events from yesterday
          },
        },
      },
    },
    include: {
      slot: {
        include: {
          shift: {
            include: {
              event: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { slot: { startTime: "asc" } },
  });
}

export async function getOrgUpcomingShifts(orgId: string) {
  return prisma.volunteerShift.findMany({
    where: {
      event: { orgId },
      slots: {
        some: {
          startTime: { gt: new Date() },
        },
      },
    },
    include: {
      event: { select: { id: true, name: true, date: true, endDate: true } },
      slots: {
        where: { startTime: { gt: new Date() } },
        include: {
          signups: {
            where: { status: { not: "CANCELLED" } },
            select: {
              id: true,
              status: true,
              volunteerEmail: true,
              familyMemberName: true,
              waitlistPosition: true,
            },
          },
        },
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: { startTime: "asc" },
  });
}

