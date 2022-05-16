import { IIsoFiles } from "./IsoFiles";

export interface IIsoService {
  id: number;
  name: string;
  number: string;
  departmentId: number;
  isoFiles: IIsoFiles[];
}
