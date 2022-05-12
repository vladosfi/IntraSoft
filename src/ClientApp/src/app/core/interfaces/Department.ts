import { IIsoService } from "./IsoService";

export interface Department {
  id: number;
  name: string;
  description: string;
  isoServices: IIsoService[];
}

