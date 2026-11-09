export interface Enterprise {
  id: string
  name: string
  industry: string
  location: string
  scale: 'micro' | 'small' | 'medium' | 'large'
  creditLevel: 'A' | 'B' | 'C' | 'D'
}

export interface SupplyDemandItem {
  id: string
  type: 'supply' | 'demand'
  enterpriseId: string
  category: string
  description: string
  quantity: number
  unit: string
}

export interface PolicyItem {
  id: string
  title: string
  docNumber: string
  category: string
  content: string
  effectiveDate: string
}

export interface GrievanceItem {
  id: string
  enterpriseId: string
  category: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'processing' | 'resolved'
  createdAt: string
}

export function profileEnterprise(e: Enterprise): string {
  return `[Enterprise Profile] ${e.name} (ID: ${e.id})
  Industry: ${e.industry}
  Location: ${e.location}
  Scale: ${e.scale}
  Credit: ${e.creditLevel}`
}

export function matchSupplyDemand(supplies: SupplyDemandItem[], demands: SupplyDemandItem[]): { supplyId: string; demandId: string; matchScore: number }[] {
  const results: { supplyId: string; demandId: string; matchScore: number }[] = []
  for (const s of supplies) {
    for (const d of demands) {
      if (s.category === d.category && s.quantity >= d.quantity) {
        const score = Math.min(s.quantity, d.quantity) / Math.max(s.quantity, d.quantity)
        results.push({ supplyId: s.id, demandId: d.id, matchScore: Math.round(score * 100) / 100 })
      }
    }
  }
  return results.sort((a, b) => b.matchScore - a.matchScore)
}

export function parsePolicy(raw: Record<string, unknown>): PolicyItem {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    docNumber: String(raw.docNumber ?? ''),
    category: String(raw.category ?? ''),
    content: String(raw.content ?? ''),
    effectiveDate: String(raw.effectiveDate ?? ''),
  }
}

export function dispatchGrievance(g: GrievanceItem): { dispatched: boolean; assignee: string; estimatedDays: number } {
  const priorityMap = { urgent: 1, high: 3, medium: 7, low: 14 }
  const assigneeMap = { urgent: 'director', high: 'manager', medium: 'officer', low: 'clerk' }
  return {
    dispatched: true,
    assignee: assigneeMap[g.priority],
    estimatedDays: priorityMap[g.priority],
  }
}

export const name = '@liuhange/party-eco-agent'
export const version = '1.0.2'
export const inject = ['tools'] as const

const jsonOutput = {
  schema: { type: 'object', additionalProperties: true },
  render: (_args: Record<string, unknown>, value: unknown) => [
    { type: 'text', text: JSON.stringify(value, null, 2) },
  ],
}

export function apply(ctx: { tools: { register: (tool: unknown) => void } }) {
  ctx.tools.register({
    name: 'profile_enterprise',
    description:
      'Enterprise profiling — generate formatted enterprise profile card with industry, location, scale, credit info',
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
    output: jsonOutput,
    async execute(args: Record<string, unknown>) {
      try {
        return { profile: profileEnterprise(args as unknown as Enterprise) }
      } catch (e) {
        return { error: 'PROFILE_ERROR', message: (e as Error).message }
      }
    },
  })

  ctx.tools.register({
    name: 'match_supply_demand',
    description:
      'Supply-demand smart matching — match supply items with demand items by category, compute match scores',
    parameters: {
      type: 'object',
      properties: {
        supplies: { type: 'array', description: 'Supply items' },
        demands: { type: 'array', description: 'Demand items' },
      },
      required: ['supplies', 'demands'],
    },
    output: jsonOutput,
    async execute(args: Record<string, unknown>) {
      try {
        return {
          matches: matchSupplyDemand(
            args.supplies as SupplyDemandItem[],
            args.demands as SupplyDemandItem[],
          ),
        }
      } catch (e) {
        return { error: 'MATCH_ERROR', message: (e as Error).message }
      }
    },
  })

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
    output: jsonOutput,
    async execute(args: Record<string, unknown>) {
      try {
        return { policy: parsePolicy(args) }
      } catch (e) {
        return { error: 'POLICY_ERROR', message: (e as Error).message }
      }
    },
  })

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
    output: jsonOutput,
    async execute(args: Record<string, unknown>) {
      try {
        return dispatchGrievance(args as unknown as GrievanceItem)
      } catch (e) {
        return { error: 'DISPATCH_ERROR', message: (e as Error).message }
      }
    },
  })
}
