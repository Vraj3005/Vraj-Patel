import { projects } from '@/lib/data/projects';
import { DATA_FLOWS } from '@/lib/visualizer/flow-data';

export interface CommandDefinition {
  name: string;
  category: 'general' | 'project' | 'category' | 'ai' | 'navigation' | 'advanced';
  description: string;
  usage: string;
  params?: string[]; // e.g. ['slug']
}

export const COMMANDS: CommandDefinition[] = [
  // General
  { name: 'help', category: 'general', description: 'Show all available commands categorized with usage instructions.', usage: 'help' },
  { name: 'clear', category: 'general', description: 'Wipe all log feeds from the terminal screen.', usage: 'clear' },
  { name: 'whoami', category: 'general', description: 'Display background profile summary of Vraj Patel.', usage: 'whoami' },
  { name: 'about', category: 'general', description: 'View Vraj Patel\'s core competencies, academics, and goals.', usage: 'about' },
  { name: 'contact', category: 'general', description: 'Output direct communication coordinates (email, phone, location).', usage: 'contact' },
  { name: 'resume', category: 'general', description: 'Retrieve interactive CV options and print directives.', usage: 'resume' },
  { name: 'github', category: 'general', description: 'Display link to Vraj Patel\'s main GitHub profile.', usage: 'github' },
  { name: 'projects', category: 'general', description: 'Overview summary of Vraj Patel\'s engineering portfolio.', usage: 'projects' },
  { name: 'skills', category: 'general', description: 'View complete full-stack, AI, and quantitative skillset matrices.', usage: 'skills' },

  // Project specific
  { name: 'project list', category: 'project', description: `List all ${projects.length} real portfolio projects with slugs.`, usage: 'project list' },
  { name: 'project open', category: 'project', description: 'Navigate directly to a project\'s details page.', usage: 'project open <slug>', params: ['slug'] },
  { name: 'project tech', category: 'project', description: 'View the technical stack utilized in a project.', usage: 'project tech <slug>', params: ['slug'] },
  { name: 'project features', category: 'project', description: 'List the key functional features of a project.', usage: 'project features <slug>', params: ['slug'] },
  { name: 'project architecture', category: 'project', description: 'Inspect the system architecture layers of a project.', usage: 'project architecture <slug>', params: ['slug'] },
  { name: 'project flow', category: 'project', description: 'View transaction data flow pipeline mapping for a project.', usage: 'project flow <slug>', params: ['slug'] },
  { name: 'project links', category: 'project', description: 'Retrieve live deployment and source code links for a project.', usage: 'project links <slug>', params: ['slug'] },

  // Categories
  { name: 'projects --client', category: 'category', description: 'Filter and display client-commissioned ERP and calculated products.', usage: 'projects --client' },
  { name: 'projects --erp', category: 'category', description: 'List enterprise ERP and administration systems Vraj has built.', usage: 'projects --erp' },
  { name: 'projects --quant', category: 'category', description: 'Display volatility engines, backtesters, and trading signal dashboards.', usage: 'projects --quant' },
  { name: 'projects --ai', category: 'category', description: 'Filter systems incorporating Google Gemini API integrations.', usage: 'projects --ai' },
  { name: 'projects --dashboard', category: 'category', description: 'Show administrative control panels and charts systems.', usage: 'projects --dashboard' },
  { name: 'projects --website', category: 'category', description: 'Filter editorial storefronts, portfolios, and presentation portals.', usage: 'projects --website' },

  // AI & Recruitment
  { name: 'ask', category: 'ai', description: 'Stream AI assistant answers to arbitrary questions.', usage: 'ask "<question>"', params: ['question'] },
  { name: 'recruiter-summary', category: 'ai', description: 'Retrieve a high-impact synthesis targeting recruitment profiles.', usage: 'recruiter-summary' },
  { name: 'role-fit fullstack', category: 'ai', description: 'Analyze Vraj Patel\'s fit for Full-Stack Developer roles.', usage: 'role-fit fullstack' },
  { name: 'role-fit ai', category: 'ai', description: 'Analyze Vraj Patel\'s credentials for AI Automation Engineer roles.', usage: 'role-fit ai' },
  { name: 'role-fit quant', category: 'ai', description: 'Evaluate credentials for Quantitative Developer/Researcher roles.', usage: 'role-fit quant' },

  // Route navigation
  { name: 'open /projects', category: 'navigation', description: 'Navigate web browser to the projects directory.', usage: 'open /projects' },
  { name: 'open /ask-vraj', category: 'navigation', description: 'Route user to the dedicated Ask Vraj AI chat thread.', usage: 'open /ask-vraj' },
  { name: 'open /resume', category: 'navigation', description: 'Navigate user to Vraj Patel\'s Interactive CV.', usage: 'open /resume' },
  { name: 'open /contact', category: 'navigation', description: 'Route browser to the communication form page.', usage: 'open /contact' },
  { name: 'open /inbox', category: 'navigation', description: 'Navigate user to the secure contact inquiries inbox.', usage: 'open /inbox' },

  // Advanced telemetry/systems visualizers
  { name: 'show metrics', category: 'advanced', description: 'Render high-fidelity operational metrics blocks.', usage: 'show metrics' },
  { name: 'show heatmap', category: 'advanced', description: 'Generate active code contributions heat grid.', usage: 'show heatmap' },
  { name: 'show security', category: 'advanced', description: 'Run secure checklist audit matching project parameters.', usage: 'show security <slug>', params: ['slug'] },
  { name: 'show trace', category: 'advanced', description: 'Trace pipeline transaction events matching flow logs.', usage: 'show trace <flow-name>', params: ['flow-name'] }
];

/**
 * Parses raw input string into commands and arguments.
 * Handles quoted arguments correctly (e.g. ask "What projects did Vraj build?")
 */
export function parseCommand(inputStr: string): { commandName: string; args: string[]; fullInput: string } {
  const trimmed = inputStr.trim();
  if (!trimmed) {
    return { commandName: '', args: [], fullInput: '' };
  }

  // Check prefix matches for multi-word commands or special commands
  const lower = trimmed.toLowerCase();
  
  // Custom parsing for ask "prompt"
  if (lower.startsWith('ask ')) {
    const promptText = getQuotedArg(trimmed);
    return {
      commandName: 'ask',
      args: [promptText],
      fullInput: trimmed
    };
  }

  // Match commands fromCOMMANDS registry starting with multi-word commands
  const matchedCommand = COMMANDS
    .slice()
    .sort((a, b) => b.name.length - a.name.length) // sort by length desc to match 'project list' before 'project'
    .find(c => lower.startsWith(c.name.toLowerCase() + ' ') || lower === c.name.toLowerCase());

  if (matchedCommand) {
    const cmdName = matchedCommand.name;
    const argStr = trimmed.substring(cmdName.length).trim();
    
    // Parse arguments, keeping quoted strings intact
    const args: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < argStr.length; i++) {
      const char = argStr[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          args.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current) {
      args.push(current);
    }

    return {
      commandName: cmdName,
      args,
      fullInput: trimmed
    };
  }

  // Default fallback to first word
  const parts = trimmed.split(/\s+/);
  return {
    commandName: parts[0].toLowerCase(),
    args: parts.slice(1),
    fullInput: trimmed
  };
}

function getQuotedArg(str: string): string {
  const firstQuoteIdx = str.indexOf('"');
  const lastQuoteIdx = str.lastIndexOf('"');
  
  if (firstQuoteIdx !== -1 && lastQuoteIdx !== -1 && firstQuoteIdx < lastQuoteIdx) {
    return str.substring(firstQuoteIdx + 1, lastQuoteIdx);
  }
  
  const firstSingleQuoteIdx = str.indexOf("'");
  const lastSingleQuoteIdx = str.lastIndexOf("'");
  if (firstSingleQuoteIdx !== -1 && lastSingleQuoteIdx !== -1 && firstSingleQuoteIdx < lastSingleQuoteIdx) {
    return str.substring(firstSingleQuoteIdx + 1, lastSingleQuoteIdx);
  }

  // Strip 'ask ' prefix
  return str.substring(4).trim();
}

/**
 * Returns autocomplete suggestions based on partial input.
 */
export function getSuggestions(partialInput: string): string[] {
  const val = partialInput.trim().toLowerCase();
  if (!val) return [];

  const suggestions: string[] = [];

  // Suggest matching commands from COMMANDS
  COMMANDS.forEach((cmd) => {
    if (cmd.name.toLowerCase().startsWith(val)) {
      suggestions.push(cmd.name);
    }
  });

  // Suggest project slugs if command starts with 'project '
  if (val.startsWith('project ') || val.startsWith('show security ')) {
    const slugQuery = val.split(' ').pop() || '';
    const projectSlugs = projects.map(p => p.slug);
    
    projectSlugs.forEach(slug => {
      if (slug.startsWith(slugQuery)) {
        if (val.startsWith('project tech ')) suggestions.push(`project tech ${slug}`);
        else if (val.startsWith('project features ')) suggestions.push(`project features ${slug}`);
        else if (val.startsWith('project architecture ')) suggestions.push(`project architecture ${slug}`);
        else if (val.startsWith('project flow ')) suggestions.push(`project flow ${slug}`);
        else if (val.startsWith('project links ')) suggestions.push(`project links ${slug}`);
        else if (val.startsWith('project open ')) suggestions.push(`project open ${slug}`);
        else if (val.startsWith('show security ')) suggestions.push(`show security ${slug}`);
        else if (val.startsWith('project ')) suggestions.push(`project list`);
      }
    });
  }

  // Suggest flow names if command starts with 'show trace '
  if (val.startsWith('show trace ')) {
    const traceQuery = val.replace('show trace ', '').trim();
    const flowIds = DATA_FLOWS.map(f => f.id);
    
    flowIds.forEach(id => {
      if (id.startsWith(traceQuery)) {
        suggestions.push(`show trace ${id}`);
      }
    });
  }

  return [...new Set(suggestions)].slice(0, 5); // Unique items up to 5
}
