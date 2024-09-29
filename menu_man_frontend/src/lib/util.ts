import { TreeDataNode } from "antd";
import { MenuItem } from "./types";

export const findMenuItemById = (
  items: MenuItem[],
  id: number | undefined | null,
): MenuItem | undefined => {
  for (const item of items) {
    if (String(item.id) === String(id)) {
      return item;
    }
    if (item.children) {
      const found = findMenuItemById(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};


export const uniqueKeyValidator = (treeData: TreeDataNode[]): void => {
  const keys = new Set<React.Key>();
  const checkKeys = (nodes: TreeDataNode[]) => {
    nodes.forEach((node) => {
      if (keys.has(node.key)) {
        console.error(`Duplicate key found: ${node.key}`);
        throw new Error(`Duplicate key found: ${node.key}`); // Optionally throw an error to stop execution
      }
      keys.add(node.key);
      if (node.children) {
        checkKeys(node.children);
      }
    });
  };
  checkKeys(treeData);
};

export const flattenTree = (data: TreeDataNode[]): React.Key[] => {
  const keys: React.Key[] = [];
  const stack: TreeDataNode[] = [...data];
  while (stack.length) {
    const node = stack.pop()!;
    keys.push(node.key);
    if (node.children) {
      stack.push(...node.children);
    }
  }
  return keys;
};
