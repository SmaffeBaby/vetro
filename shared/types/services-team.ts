export interface TeamCard { id: string; sortOrder: number; name: string; position: string; description: string; imagePath: string | null; imageFilename: string }
export interface ServicesTeamSettings { title: string; description: string; cards: TeamCard[]; revision: number; updatedAt: string | null; mediaCleanupPending?: boolean }
