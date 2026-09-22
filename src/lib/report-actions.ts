"use server";

import { prisma } from "./prisma";
import { requireRole } from "./actions";

// ──────────────────────────────────────────
// Platform reports (super admin)
// ──────────────────────────────────────────

type OrgUsageRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  members: bigint;
  events: bigint;
  waivers: bigint;
  volunteerWaivers: bigint;
  lastWaiverAt: Date | null;
};

/**
 * Total signed waivers. Counted directly rather than summed from users, because
 * Waiver.userId is nullable — waivers signed without an account have no user.
 */
export async function getWaiverCount() {
  await requireRole(["SUPER_ADMIN"]);
  return prisma.waiver.count();
}

export async function getPlatformReport() {
  await requireRole(["SUPER_ADMIN"]);

  const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Waivers hang off Events, so per-org usage needs a join. COUNT(DISTINCT …) is
  // required because the member/event/waiver joins multiply rows against each other.
  const [orgs, users, events, waivers, waivers30, guestWaivers, orgRows] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.event.count(),
    prisma.waiver.count(),
    prisma.waiver.count({ where: { signedAt: { gte: last30 } } }),
    prisma.waiver.count({ where: { userId: null } }),
    prisma.$queryRaw<OrgUsageRow[]>`
      SELECT
        o.id,
        o.name,
        o.slug,
        o."createdAt",
        COUNT(DISTINCT m.id) AS members,
        COUNT(DISTINCT e.id) AS events,
        COUNT(DISTINCT w.id) AS waivers,
        COUNT(DISTINCT w.id) FILTER (WHERE w."isVolunteer") AS "volunteerWaivers",
        MAX(w."signedAt") AS "lastWaiverAt"
      FROM "Organization" o
      LEFT JOIN "OrgMember" m ON m."orgId" = o.id
      LEFT JOIN "Event" e ON e."orgId" = o.id
      LEFT JOIN "Waiver" w ON w."eventId" = e.id
      GROUP BY o.id, o.name, o.slug, o."createdAt"
      ORDER BY COUNT(DISTINCT w.id) DESC, o."createdAt" DESC
    `,
  ]);

  // Postgres COUNT() returns bigint, which cannot cross the server/client boundary.
  const organizations = orgRows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.createdAt,
    members: Number(row.members),
    events: Number(row.events),
    waivers: Number(row.waivers),
    volunteerWaivers: Number(row.volunteerWaivers),
    lastWaiverAt: row.lastWaiverAt,
  }));

  return {
    totals: {
      orgs,
      users,
      events,
      waivers,
      waivers30,
      guestWaivers,
      activeOrgs: organizations.filter((o) => o.waivers > 0).length,
    },
    organizations,
  };
}
