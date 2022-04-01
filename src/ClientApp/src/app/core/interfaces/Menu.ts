////export interface IMenu {
////  id: number;
////  parentId: number;
////  title: string;
////  action: string;
////  description: string;
////  subMenus?: IMenu[];
////}


export interface Menu {
  id: number;
  text: string;
  icon: string;
  routerLink: string;
  parentId?: number;
  children?: Menu[];
  opacity: number;
}
