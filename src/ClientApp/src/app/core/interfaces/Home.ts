export interface HomeItem {
  orders: HomeOrders[];
  isoServices: HomeIsoServices[];
}

export interface HomeIsoServices {
  id: number;
  number: string;
  name: string;
  createdOn: string;
}


export interface HomeOrders {
  id: number;
  number: string;
  about: string;
  date: string;
}

export interface HomeListItems {
  id: number;
  title: string;
  text: string;
  date: string;
}