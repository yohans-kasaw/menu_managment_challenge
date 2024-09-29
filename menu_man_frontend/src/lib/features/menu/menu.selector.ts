import { createSelector } from "reselect";
import { RootState } from "@/lib/store";
import { TreeDataNode } from "antd";
import { MenuItem } from "@/lib/types";

// Recursive function to build tree nodes
const buildTreeNodes = (items: MenuItem[]): TreeDataNode[] => {
  return items.map((item, index) => ({
    key: item.id.toString(),
    title: item.name,
    children: item.children ? buildTreeNodes(item.children) : [],
  }));
};

// Selector to transform menu items to TreeDataNode format
export const selectMenuTrees = createSelector(
  (state: RootState) => state.menuTree.items,
  (items): TreeDataNode[] => buildTreeNodes(items),
);
