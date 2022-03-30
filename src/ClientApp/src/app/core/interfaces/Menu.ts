////export interface Menu {
////  id: number;
////  parentId: number;
////  title: string;
////  action: string;
////  description: string;
////  subMenus?: Menu[];
////}


export interface Menu {
  text: string,
  icon: string,
  routerLink?: string;
  children: Menu[]
}
