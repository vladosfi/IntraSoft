export interface HomeItem {
  orders: HomeOrder[];
  isoServices: HomeIsoService[];
}

export interface HomeIsoService {
  id: number;
  number: string;
  name: string;
  createdOn: string;
}


export interface HomeOrder {
  id: number;
  number: string;
  about: string;
  date: string;
}

export interface HomeListItem {
  id: number;
  title: string;
  text: string;
  date: string;
}