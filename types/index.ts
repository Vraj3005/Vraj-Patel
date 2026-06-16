export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectChallenge {
  problem: string;
  solution: string;
}

export interface UIScreen {
  title: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  category: 'Client Software' | 'ERP Systems' | 'E-commerce' | 'AI Automation' | 'Quant Research' | 'Websites' | 'Dashboards';
  shortDescription: string;
  description: string;
  technologies: string[];
  status: 'Live' | 'Private' | 'In Development';
  year: string;
  image: string; // Featured image or relative path
  githubUrl?: string;
  liveUrl?: string;
  role: string;
  period: string;
  client?: string;
  metrics: ProjectMetric[];
  
  // Case Study Sections:
  problem: string;
  whyBuilt: string;
  solution: string;
  features: string[];
  architecture: string;
  dbBackendLogic: string;
  uiScreens: UIScreen[];
  challenges: ProjectChallenge[];
  whatILearned: string;
  futureImprovements: string[];
  featured: boolean;
}

export interface LabItem {
  id: string;
  title: string;
  description: string;
  category: 'Quant Research' | 'ERP Widget' | 'AI Integration' | 'Interactive UI';
  technologies: string[];
  status: 'beta' | 'experimental' | 'stable';
  demoType: 'solar' | 'quant' | 'email' | 'other';
  metrics?: { label: string; value: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

export interface TechSkill {
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
  category: 'frontend' | 'backend' | 'database' | 'ai-devops' | 'quant-finance';
}
