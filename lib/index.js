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
export const version = '1.0.0';
