const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrPaise = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatInr(amount: number | null | undefined): string {
  const value = Number(amount ?? 0);
  if (!Number.isFinite(value)) {
    return inrWhole.format(0);
  }
  const hasPaise = Math.round(Math.abs(value) * 100) % 100 !== 0;
  return hasPaise ? inrPaise.format(value) : inrWhole.format(value);
}

export function parseAmount(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  const cleaned = raw.replace(/[₹,\s]/g, '').trim();
  if (!cleaned) {
    return null;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
