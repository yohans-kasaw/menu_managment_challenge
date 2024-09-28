export class MenuItemModel {
  id: number;
  name: string;
  parentId?: number;
  depth?: number;
  createdAt: Date;
  updatedAt: Date;
  children?: MenuItemModel[];
}
