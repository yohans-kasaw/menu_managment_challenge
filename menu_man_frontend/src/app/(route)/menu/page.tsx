import TreeView from "@/app/components/shared/TreeView";
import type { TreeDataNode } from "antd";

import { AppstoreOutlined } from "@ant-design/icons";

export default function MenuPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
          <AppstoreOutlined
            className="text-white"
            style={{ fontSize: "24px" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-700">Menus</h1>
      </div>

      <TreeView treeData={treeData} />
    </div>
  );
}

const treeData: TreeDataNode[] = [
  {
    title: "System Management",
    key: "0-0",
    children: [
      {
        title: "Systems",
        key: "0-0-0",
        children: [
          {
            title: "System Code",
            key: "0-0-0-0",
            children: [
              {
                title: "Code Registration",
                key: "0-0-0-0-0",
              },
              {
                title: "Code Registration - 2",
                key: "0-0-0-0-1",
              },
              {
                title: "Properties",
                key: "0-0-0-0-2",
              },
            ],
          },
          {
            title: "Menus",
            key: "0-0-0-1",
            children: [
              {
                title: "Menu Registration",
                key: "0-0-0-1-0",
              },
            ],
          },
          {
            title: "API List",
            key: "0-0-0-2",
            children: [
              {
                title: "API Registration",
                key: "0-0-0-2-0",
              },
              {
                title: "API Edit",
                key: "0-0-0-2-1",
              },
            ],
          },
        ],
      },
      {
        title: "Users & Groups",
        key: "0-0-1",
        children: [
          {
            title: "Users",
            key: "0-0-1-0",
            children: [
              {
                title: "User Account Registration",
                key: "0-0-1-0-0",
              },
            ],
          },
          {
            title: "Groups",
            key: "0-0-1-1",
            children: [
              {
                title: "User Group Registration",
                key: "0-0-1-1-0",
              },
            ],
          },
        ],
      },
      {
        title: "사용자 승인",
        key: "0-0-2",
        children: [
          {
            title: "사용자 승인 상세",
            key: "0-0-2-0",
          },
        ],
      },
    ],
  },
];
