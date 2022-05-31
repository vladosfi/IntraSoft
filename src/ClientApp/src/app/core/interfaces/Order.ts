export interface Order {
  id: number;
  number: string;
  date: string;
  about: string;
  filePath: string;
  category: OrderCategory;
}


export interface OrderCategory {
  name: string;
}
