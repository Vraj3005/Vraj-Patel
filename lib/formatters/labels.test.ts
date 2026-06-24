import { describe, it, expect } from 'vitest';
import { getCategoryLabel, getStatusLabel, getSkillLevelLabel } from './labels';
import { projects } from '../data/projects';

describe('getCategoryLabel', () => {
  it('should map categories correctly', () => {
    expect(getCategoryLabel('client_software')).toBe('Client Software');
    expect(getCategoryLabel('erp_system')).toBe('ERP Systems');
    expect(getCategoryLabel('ecommerce')).toBe('E-commerce');
    expect(getCategoryLabel('ai_automation')).toBe('AI Automation');
    expect(getCategoryLabel('quant_research')).toBe('Quant Research');
    expect(getCategoryLabel('website')).toBe('Websites');
    expect(getCategoryLabel('dashboard')).toBe('Dashboards');
    expect(getCategoryLabel('unknown')).toBe('unknown');
  });
});

describe('getStatusLabel', () => {
  it('should map contact statuses correctly', () => {
    expect(getStatusLabel('new')).toBe('New');
    expect(getStatusLabel('reviewed')).toBe('Reviewed');
    expect(getStatusLabel('replied')).toBe('Replied');
    expect(getStatusLabel('archived')).toBe('Archived');
    expect(getStatusLabel('unknown')).toBe('unknown');
  });
});

describe('getSkillLevelLabel', () => {
  it('should format skill levels to Title Case correctly', () => {
    expect(getSkillLevelLabel('beginner')).toBe('Beginner');
    expect(getSkillLevelLabel('intermediate')).toBe('Intermediate');
    expect(getSkillLevelLabel('advanced')).toBe('Advanced');
    expect(getSkillLevelLabel('expert')).toBe('Expert');
    // Case-insensitivity tests
    expect(getSkillLevelLabel('EXPERT')).toBe('Expert');
    expect(getSkillLevelLabel('intermediate')).toBe('Intermediate');
  });
});

describe('Project filtering', () => {
  it('should filter projects correctly using canonical category identifiers', () => {
    // Asserting we have projects in the seed data
    expect(projects.length).toBeGreaterThan(0);
    
    // Filter by erp_system
    const erpProjects = projects.filter(p => p.category === 'erp_system');
    expect(erpProjects.length).toBe(2); // Enermass and Bhagwati Interior
    expect(erpProjects.every(p => p.category === 'erp_system')).toBe(true);

    // Filter by quant_research
    const quantProjects = projects.filter(p => p.category === 'quant_research');
    expect(quantProjects.length).toBe(3); // MSPE, NF-LRD, and BTC-ALGO
    expect(quantProjects.every(p => p.category === 'quant_research')).toBe(true);
  });
});
