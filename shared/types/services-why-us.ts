export interface ServiceWhyUsCard { id: string; description: string }
export interface ServiceWhyUsMetric { id: string; title: string; caption: string; description: string }
export interface ServicesWhyUsSettings { title: string; cards: ServiceWhyUsCard[]; metricsTitle: string; metrics: ServiceWhyUsMetric[]; revision: number; updatedAt: string | null }
