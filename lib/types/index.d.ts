export interface Enterprise {
    id: string;
    name: string;
    industry: string;
    location: string;
    scale: 'micro' | 'small' | 'medium' | 'large';
    creditLevel: 'A' | 'B' | 'C' | 'D';
}
export interface SupplyDemandItem {
    id: string;
    type: 'supply' | 'demand';
    enterpriseId: string;
    category: string;
    description: string;
    quantity: number;
    unit: string;
}
export interface PolicyItem {
    id: string;
    title: string;
    docNumber: string;
    category: string;
    content: string;
    effectiveDate: string;
}
export interface GrievanceItem {
    id: string;
    enterpriseId: string;
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'processing' | 'resolved';
    createdAt: string;
}
export declare function profileEnterprise(e: Enterprise): string;
export declare function matchSupplyDemand(supplies: SupplyDemandItem[], demands: SupplyDemandItem[]): {
    supplyId: string;
    demandId: string;
    matchScore: number;
}[];
export declare function parsePolicy(raw: Record<string, unknown>): PolicyItem;
export declare function dispatchGrievance(g: GrievanceItem): {
    dispatched: boolean;
    assignee: string;
    estimatedDays: number;
};
export declare const name = "@liuhange/party-eco-agent";
export declare const version = "1.0.2";
export declare const inject: readonly ["tools"];
export declare function apply(ctx: {
    tools: {
        register: (tool: unknown) => void;
    };
}): void;
