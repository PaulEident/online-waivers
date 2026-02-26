import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.event.findUnique({
    where: { slug: "candlelight-snowshoe-2026" },
  });

  if (!existing) {
    const event = await prisma.event.create({
      data: {
        name: "Candlelight Snowshoe 2026",
        slug: "candlelight-snowshoe-2026",
        description:
          "Annual candlelight snowshoe event on the Iron County trails.",
        date: new Date("2026-02-28T18:00:00"),
        location: "Iron County Trails",
        active: true,
      },
    });

    const updated = await prisma.waiver.updateMany({
      where: { eventId: null },
      data: { eventId: event.id },
    });

    console.log(
      `Created event "${event.name}" and linked ${updated.count} existing waivers.`
    );
  } else {
    // Still backfill any orphaned waivers
    const updated = await prisma.waiver.updateMany({
      where: { eventId: null },
      data: { eventId: existing.id },
    });
    if (updated.count > 0) {
      console.log(`Linked ${updated.count} orphaned waivers to "${existing.name}".`);
    } else {
      console.log("Seed event already exists. No orphaned waivers. Skipping.");
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
