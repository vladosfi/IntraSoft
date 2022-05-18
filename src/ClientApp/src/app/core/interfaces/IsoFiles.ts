import { IIsoFileCategory } from "./IsoFileCategory";

export interface IIsoFiles {
  id: number;
  filePath: string;
  isoFileCategory: IIsoFileCategory;
  categoryName: string;
}
