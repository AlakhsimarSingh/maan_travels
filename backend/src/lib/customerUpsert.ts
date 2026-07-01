// backend/src/lib/customerUpsert.ts
//
// Single source of truth for finding-or-creating a customer.
// Deduplicates by phone (primary), falling back to email.
// Avoids creating duplicate rows when the same person books multiple times.

import prisma from "../prisma";

export async function findOrCreateCustomer(data: {
  name: string;
  phone: string;
  email?: string | null;
}) {
  const { name, phone, email } = data;

  // 1. Match by phone (most reliable — everyone enters the same phone)
  const byPhone = phone
    ? await prisma.customer.findFirst({ where: { phone } })
    : null;

  if (byPhone) {
    // Update name/email if they've changed or were missing
    const needsUpdate =
      (name && byPhone.name !== name) ||
      (email && byPhone.email !== email);

    if (needsUpdate) {
      return prisma.customer.update({
        where: { id: byPhone.id },
        data: {
          name: name || byPhone.name,
          email: email || byPhone.email,
        },
      });
    }
    return byPhone;
  }

  // 2. Match by email as fallback (phone may differ — typo, changed number)
  if (email) {
    const byEmail = await prisma.customer.findFirst({ where: { email } });
    if (byEmail) {
      return prisma.customer.update({
        where: { id: byEmail.id },
        data: {
          name: name || byEmail.name,
          phone: phone || byEmail.phone,
        },
      });
    }
  }

  // 3. Genuinely new customer
  return prisma.customer.create({
    data: { name, phone, email: email || null },
  });
}