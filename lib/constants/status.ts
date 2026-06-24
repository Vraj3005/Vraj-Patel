export const CONTACT_STATUSES = [
  'new',
  'reviewed',
  'replied',
  'archived'
] as const;

export type CanonicalContactStatus = typeof CONTACT_STATUSES[number];
