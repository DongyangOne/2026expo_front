export type TabletClassificationStatus = 'ALLOWED' | 'REJECTED' | 'WAITING';

export interface TabletClassificationData {
  clientId: string;
  completed: boolean;
  status: TabletClassificationStatus;
  wasteType: string;
  wasteTypeLabel: string;
  message: string | null;
  guidanceCode?: string | null;
  guideVideoUrl?: string | null;
  level: number | null;
  earnedExp: number | null;
  totalExp: number | null;
  userCharacterId: number | null;
  characterId: number | null;
  characterName: string | null;
  characterImageUrl: string | null;
  evolutionStage: number | null;
  beforeLevel: number | null;
  beforeExp: number | null;
  currentLevel: number | null;
  currentExp: number | null;
  levelUp: boolean;
  maxExp: number | null;
  expPercent: number | null;
  remainingExp: number | null;
}
