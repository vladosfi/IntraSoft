////export interface IMenu {
////  id: number;
////  parentId: number;
////  title: string;
////  action: string;
////  description: string;
////  subMenus?: IMenu[];
////}


export interface Menu {
  text: string,
  icon: string,
  routerLink?: string;
  children: Menu[]
}
