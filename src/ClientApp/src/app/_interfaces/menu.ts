export interface IMenu {
  id: number;
  parentId: number;
  title: string;
  action: string;
  description: string;
  subMenus?: IMenu[];
}
