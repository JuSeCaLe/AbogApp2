import { CatalogItem } from "./catalog-item.model";

export interface Person {
  id: number;
  fullName: string;
  document: string;
  personRole: CatalogItem;
}
