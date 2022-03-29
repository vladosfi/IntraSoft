export interface Menu {
  id: number;
  parentId: number;
  title: string;
  action: string;
  description: string;
  subMenus?: Menu[];
}
