export interface PrivacySection { id: string; title: string; text: string }
export interface PrivacySettings { title: string; breadcrumb: string; intro: string; navigationLabel: string; sections: PrivacySection[]; revision: number; updatedAt: string | null }
