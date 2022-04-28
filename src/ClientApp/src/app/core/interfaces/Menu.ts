import { IFileDocument } from "./FileDocument";

export interface Menu {
  id: number;
  text: string;
  icon: string;
  routerLink: string;
  parentId?: number;
  children?: Menu[];
  opacity?: number;
  document: IFileDocument;
}
