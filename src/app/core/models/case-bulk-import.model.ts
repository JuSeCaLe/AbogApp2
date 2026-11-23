export interface CaseBulkImportRowResult {
  rowNumber: number;
  folderNumber: string | null;
  demandado: string;
  ok: boolean;
  errors: string[];
  stagesCount: number;
}

export interface CaseBulkImportReport {
  committed: boolean;
  totalCases: number;
  validCases: number;
  invalidCases: number;
  rows: CaseBulkImportRowResult[];
}
