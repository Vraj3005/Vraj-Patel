export const PROJECT_CATEGORIES = [
  'client_software',
  'erp_system',
  'ecommerce',
  'ai_automation',
  'quant_research',
  'website',
  'dashboard'
] as const;

export type CanonicalProjectCategory = typeof PROJECT_CATEGORIES[number];
