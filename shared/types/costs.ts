export interface CostField { id: string; label: string; options: string[] }
export interface CostsSettings { fields: CostField[]; buttonLabel: string; revision: number; updatedAt: string | null }
export interface CostSelection { id: string; label: string; value: string }
