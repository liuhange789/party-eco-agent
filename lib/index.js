export function profileEnterprise(e) {
  return `[Enterprise Profile] ${e.name} (ID: ${e.id})
  Industry: ${e.industry}
  Location: ${e.location}
  Scale: ${e.scale}
  Credit: ${e.creditLevel}`;
}
export function matchSupplyDemand(supplies, demands) {
  const results = [];
  for (const s of supplies) {
    for (const d of demands) {
      if (s.category === d.category && s.quantity >= d.quantity) {
        const score = Math.min(s.quantity, d.quantity) / Math.max(s.quantity, d.quantity);
        results.push({ supplyId: s.id, demandId: d.id, matchScore: Math.round(score * 100) / 100 });
      }
    }
  }
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
export function parsePolicy(raw) {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    docNumber: String(raw.docNumber ?? ''),
    category: String(raw.category ?? ''),
    content: String(raw.content ?? ''),
    effectiveDate: String(raw.effectiveDate ?? ''),
  };
}
export function dispatchGrievance(g) {
  const priorityMap = { urgent: 1, high: 3, medium: 7, low: 14 };
  const assigneeMap = { urgent: 'director', high: 'manager', medium: 'officer', low: 'clerk' };
  return { dispatched: true, assignee: assigneeMap[g.priority], estimatedDays: priorityMap[g.priority] };
}
export const name = '@liuhange/party-eco-agent';
export const version = '1.0.1';
export const inject = ['tools'];

export function apply(ctx) {
  ctx.tools.register({
    name: 'profile_enterprise',
    description: 'Enterprise profiling — generate formatted enterprise profile card with industry, location, scale, credit info',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Enterprise name' },
        id: { type: 'string', description: 'Enterprise ID' },
        industry: { type: 'string', description: 'Industry sector' },
        location: { type: 'string', description: 'Location' },
        scale: { type: 'string', description: 'Enterprise scale' },
        creditLevel: { type: 'string', description: 'Credit rating level' },
      },
      required: ['name', 'id'],
    },
    output: { schema: { type: 'object' }, render: { type: 'text' } },
    async execute(args) {
      try {
        return profileEnterprise(args);
      } catch (e) {
        return JSON.stringify({ error: 'PROFILE_ERROR', message: e.message });
      }
    },
  });

  ctx.tools.register({
    name: 'match_supply_demand',
    description: 'Supply-demand smart matching — match supply items with demand items by category, compute match scores',
    parameters: {
      type: 'object',
      properties: {
        supplies: { type: 'array', description: 'Supply items' },
        demands: { type: 'array', description: 'Demand items' },
      },
      required: ['supplies', 'demands'],
    },
    output: { schema: { type: 'object' }, render: { type: 'json' } },
    async execute(args) {
      try {
        return JSON.stringify(matchSupplyDemand(args.supplies, args.demands), null, 2);
      } catch (e) {
        return JSON.stringify({ error: 'MATCH_ERROR', message: e.message });
      }
    },
  });

  ctx.tools.register({
    name: 'parse_policy',
    description: 'Policy document parsing — extract structured policy metadata from raw policy text',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        docNumber: { type: 'string' },
        category: { type: 'string' },
        content: { type: 'string' },
        effectiveDate: { type: 'string' },
      },
      required: ['id', 'title'],
    },
    output: { schema: { type: 'object' }, render: { type: 'json' } },
    async execute(args) {
      try {
        return JSON.stringify(parsePolicy(args), null, 2);
      } catch (e) {
        return JSON.stringify({ error: 'POLICY_ERROR', message: e.message });
      }
    },
  });

  ctx.tools.register({
    name: 'dispatch_grievance',
    description: 'Grievance auto-dispatch — assign grievance to appropriate handler based on priority level',
    parameters: {
      type: 'object',
      properties: {
        priority: { type: 'string', enum: ['urgent', 'high', 'medium', 'low'], description: 'Priority level' },
      },
      required: ['priority'],
    },
    output: { schema: { type: 'object' }, render: { type: 'json' } },
    async execute(args) {
      try {
        return JSON.stringify(dispatchGrievance(args), null, 2);
      } catch (e) {
        return JSON.stringify({ error: 'DISPATCH_ERROR', message: e.message });
      }
    },
  });
}
