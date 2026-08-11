export interface ProcessInfo {
  radicado: string;
  processType: string;
  court: string;
  city: string;
  filedAt?: string;
}

export interface PartyInfo {
  person: string;
  processRole: string;
}

export interface FinancialInfo {
  capital?: number;
  obligations?: string;
  fngFag?: boolean;
}

export interface MeasuresInfo {
  embargo?: boolean;
  embargoDate?: string;
  remanentEmbargo?: boolean;
  remanentEntity?: string;
}

export interface StagesInfo {
  paymentOrder?: boolean;
  personalNotification?: boolean;
  personalNotificationDate?: string;
  firstInstanceSentence?: boolean;
  firstInstanceDate?: string;
  secondInstance?: boolean;
  secondInstanceDate?: string;
  [key: string]: any; // Para agregar otros campos dinámicos si hace falta
}

export interface AuctionInfo {
  appraisalStatus?: string; // SI, NO, SOLICITADO, N/A
  appraisalDate?: string;
  appraisalValue?: number;
  auctionStatus?: string;
  auctionDate?: string;
  awarded?: boolean;
  awardDate?: string;
}

export interface ClosureInfo {
  terminationDate?: string;
  terminationReason?: string;
  titlesStatus?: string;
  delivery?: boolean;
  deliveryDate?: string;
  fileReturnStatus?: string;
  fileReturnDate?: string;
}

export interface Case {
  id: number;
  createdAt?: string;
  demandanteRoleId: string;
  demandanteRoleName?: string;
  process: ProcessInfo;
  partiesInfo: PartyInfo[];
  financialInfo?: FinancialInfo;
  measures?: MeasuresInfo;
  stages?: StagesInfo;
  auction?: AuctionInfo;
  closure?: ClosureInfo;
  processStages?: CaseProcessStage[];
  proceduralNotes?: CaseProceduralNote[];
}

export interface CaseProcessStage {
  id: number;
  createdAt: string;
  stageName: string;
  subStageName: string;
  observation?: string;
}

export interface CaseProceduralNote {
  id: number;
  createdAt: string;
  text: string;
}
