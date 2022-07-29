export interface HomeItem {
  orders: HomeOrder[];
  isoServices: HomeIsoService[];
  stateNewspapers: HomeStateNewspapers[];
  content: string;
}

export interface HomeIsoService {
  id: number;
  number: string;
  name: string;
  createdOn: string;
}

export interface HomeStateNewspapers {
  id: number;
  title: string;
  content: string;
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
