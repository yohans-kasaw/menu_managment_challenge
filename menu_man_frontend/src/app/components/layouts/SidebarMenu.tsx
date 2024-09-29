import React, { useState } from "react";
import {
  FolderOpenOutlined,
  FolderFilled,
  UserOutlined,
  TrophyOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

interface SidebarMenuItemType {
  key: string;
  label: string;
  icon: React.ReactNode;
  children?: SidebarMenuItemType[];
}

const sidebarMenuItems: SidebarMenuItemType[] = [
  {
    key: "systems",
    label: "Systems",
    icon: <FolderOpenOutlined />,
    children: [
      { key: "system-code", label: "System Code", icon: <FolderFilled /> },
      { key: "properties", label: "Properties", icon: <FolderFilled /> },
      { key: "menus", label: "Menus", icon: <FolderOpenOutlined /> },
      { key: "api-list", label: "API List", icon: <FolderFilled /> },
    ],
  },
  { key: "users-group", label: "Users & Group", icon: <UserOutlined /> },
  { key: "competition", label: "Competition", icon: <TrophyOutlined /> },
];

const SidebarMenu: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["systems"]),
  );

  const toggleItem = (key: string): void => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const renderMenuItems = (
    items: SidebarMenuItemType[],
    depth: number = 0,
  ): React.ReactNode => {
    return items.map((item) => {
      const isExpanded = expandedItems.has(item.key);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.key} className={`text-sm ${depth > 0 ? "ml-4" : ""}`}>
          <button
            onClick={() => hasChildren && toggleItem(item.key)}
            className={`flex items-center w-full py-2 px-4 hover:bg-gray-700 rounded-md ${item.key === "menus" ? "bg-[#ADFF2F] text-gray-700 font-bold" : ""}`}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
            {hasChildren &&
              (isExpanded ? (
                <DownOutlined className="ml-auto" />
              ) : (
                <RightOutlined className="ml-auto" />
              ))}
          </button>
          {hasChildren && isExpanded && (
            <div className="mt-2">
              {renderMenuItems(item.children ?? [], depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return <div>{renderMenuItems(sidebarMenuItems)}</div>;
};

export default SidebarMenu;
