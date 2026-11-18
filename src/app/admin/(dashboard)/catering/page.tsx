import { prisma } from "@/lib/prisma";
import CateringDesk from "./CateringDesk";

export const dynamic = "force-dynamic";

export type CateringRow = {
  id: string;
  reference: string;
  status: "INQUIRY" | "QUOTED" | "DEPOSIT_PAID" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  eventType: string;
  eventDate: string;
  guestCount: number;
  clientName: string | null;
  clientPhone: string | null;
  company: string | null;
  venue: string | null;
  address: string | null;
  menuItems: string | null;
  notes: string | null;
  quoteKobo: number | null;
  depositKobo: number | null;
  createdAt: string;
};

export default async function AdminCateringPage() {
  const bookings = await prisma.cateringBooking.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, phone: true } } },
  });

  const rows: CateringRow[] = bookings.map((b, i) => ({
    id: b.id,
    reference: b.reference ?? `CAT-${b.id.slice(-6).toUpperCase()}`,
    status: b.status,
    eventType: b.eventType,
    eventDate: b.eventDate.toISOString(),
    guestCount: b.guestCount,
    clientName: b.clientName ?? b.user?.name ?? "Organizer",
    clientPhone: b.clientPhone ?? b.user?.phone ?? null,
    company: b.company,
    venue: b.venue,
    address: b.address,
    menuItems: b.menuItems,
    notes: b.notes,
    quoteKobo: b.quoteKobo,
    depositKobo: b.depositKobo,
    createdAt: b.createdAt.toISOString(),
  }));

  return <CateringDesk bookings={rows} />;
}
