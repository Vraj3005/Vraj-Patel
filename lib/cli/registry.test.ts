import { describe, it, expect } from 'vitest';
import { parseCommand } from './registry';

describe('parseCommand', () => {
  it('should parse simple commands with no parameters', () => {
    const result = parseCommand('help');
    expect(result.commandName).toBe('help');
    expect(result.args).toEqual([]);
  });

  it('should parse multi-word commands correctly', () => {
    const result = parseCommand('project list');
    expect(result.commandName).toBe('project list');
    expect(result.args).toEqual([]);
  });

  it('should parse commands with single unquoted arguments', () => {
    const result = parseCommand('project open enermass-solar-calculator');
    expect(result.commandName).toBe('project open');
    expect(result.args).toEqual(['enermass-solar-calculator']);
  });

  it('should parse ask command with double-quoted string parameters', () => {
    const result = parseCommand('ask "How does Vraj solve database replication?"');
    expect(result.commandName).toBe('ask');
    expect(result.args).toEqual(['How does Vraj solve database replication?']);
  });

  it('should handle whitespaces gracefully', () => {
    const result = parseCommand('   clear   ');
    expect(result.commandName).toBe('clear');
    expect(result.args).toEqual([]);
  });

  it('should return empty result for blank inputs', () => {
    const result = parseCommand('   ');
    expect(result.commandName).toBe('');
    expect(result.args).toEqual([]);
  });
});
