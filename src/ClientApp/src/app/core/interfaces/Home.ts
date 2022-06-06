export interface HomeItem {
  orders: HomeOrders[];
  isoServices: HomeIsoServices[];
}

export interface HomeIsoServices {
  id: number;
  name: string;
  number: string;
  createdOn: string;
}


export interface HomeOrders {
  id: number;
  number: string;
  date: string;
  about: string;
}