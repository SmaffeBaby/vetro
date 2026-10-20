export interface ObjectCategory { id: string; label: string }
export interface ObjectsSettings { title: string; buttonLabel: string; categories: ObjectCategory[]; revision: number; updatedAt: string | null }
export interface SiteObject { id: string; title: string; address: string; categoryId: string; sortOrder: number; published: boolean; subtitle: string; description: string; area: string; sinceYear: number | null; imagePath: string | null; imageFilename: string; serviceIds: string[]; revision: number; updatedAt: string | null; mediaCleanupPending?: boolean }
export interface ObjectsCatalog { settings: ObjectsSettings; objects: SiteObject[] }
