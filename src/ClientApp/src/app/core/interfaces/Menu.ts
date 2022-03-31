export interface Menu {
  id: number;
  parentId: number;
  title: string;
  action: string;
  description: string;
  subMenus?: Menu[];
}


export interface IMenu {
  text: string,
  icon: string,
  routerLink?: string;
  children: IMenuItem[]
}
export interface IMenuItem {
  text: string,
  icon: string,
  routerLink: string;
}
