import { CanonicalProjectCategory } from '../constants/categories';
import { CanonicalContactStatus } from '../constants/status';

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'client_software':
      return 'Client Software';
    case 'erp_system':
      return 'ERP Systems';
    case 'ecommerce':
      return 'E-commerce';
    case 'ai_automation':
      return 'AI Automation';
    case 'quant_research':
      return 'Quant Research';
    case 'website':
      return 'Websites';
    case 'dashboard':
      return 'Dashboards';
    default:
      return category;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'new':
      return 'New';
    case 'reviewed':
      return 'Reviewed';
    case 'replied':
      return 'Replied';
    case 'archived':
      return 'Archived';
    default:
      return status;
  }
}

export function getSkillLevelLabel(level: string): string {
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'Beginner';
    case 'intermediate':
      return 'Intermediate';
    case 'advanced':
      return 'Advanced';
    case 'expert':
      return 'Expert';
    default:
      return level;
  }
}
