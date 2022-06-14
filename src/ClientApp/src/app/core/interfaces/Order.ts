export interface Order {
  id: number;
  number: string;
  date: string;
  about: string;
  filePath: string;
  orderCategoryId: number;
  orderCategoryName: string;
  orderCategory: OrderCategory;
}


export interface OrderCategory {
  id: number;
  name: string;
}
