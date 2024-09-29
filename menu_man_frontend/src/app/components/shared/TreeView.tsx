"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tree, Button } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { uniqueKeyValidator, flattenTree } from '@/lib/util'; // Assume utility functions are defined elsewhere
import { TreeDataNode } from "antd";

// Define the expected props type
interface TreeViewProps {
  treeData?: TreeDataNode[];
}

export default function TreeView({ treeData = [] }: TreeViewProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [hoveredKey, setHoveredKey] = useState<React.Key | null>(null);
  const router = useRouter();

  // Validate treeData keys for uniqueness on mount and treeData update
  useEffect(() => {
    uniqueKeyValidator(treeData);
  }, [treeData]);

  // Initialize expandedKeys to root node keys
  useEffect(() => {
    setExpandedKeys(treeData.map(node => node.key));
  }, [treeData]);

  const allKeys = useMemo(() => flattenTree(treeData), [treeData]);
  const areAllNodesExpanded = expandedKeys.length === allKeys.length;
  const areNoNodesExpanded = expandedKeys.length === 0;

  const handleExpandCollapse = (expand: boolean) => {
    setExpandedKeys(expand ? allKeys : []);
  };

  const handleNodeHover = (key: React.Key | null) => {
    setHoveredKey(key);
  };

  const handleNodeAction = (node: TreeDataNode, action: string) => {
    const route = `/menu/${node.key}/${action}`;
    if (node.key) {
      router.push(route);
    } else {
      console.error("Invalid node key:", node);
    }
  };

  const titleRender: TreeProps["titleRender"] = (node) => (
    <div
      onMouseEnter={() => handleNodeHover(node.key)}
      onMouseLeave={() => handleNodeHover(null)}
      className="flex items-center"
    >
      <span className="text-sm">{node.title}</span>
      {String(node.key) === String(hoveredKey) && (
        <Button
          className="ml-2 p-1 rounded-full bg-blue-500 hover:bg-blue-700 text-white"
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleNodeAction(node, 'add');
          }}
          aria-label="Add Node"
          title="Add Node"
        />
      )}
    </div>
  );

  return (
    <div className="p-4">
      <Button
        className={`mr-2 ${areAllNodesExpanded ? 'bg-black text-white' : 'text-black'} p-4 rounded-lg mb-4`}
        onClick={() => handleExpandCollapse(true)}
      >
        Expand All
      </Button>
      <Button
        className={`mr-2 ${areNoNodesExpanded ? 'bg-black text-white' : 'text-black'} p-4 rounded-lg mb-4`}
        onClick={() => handleExpandCollapse(false)}
      >
        Collapse All
      </Button>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        treeData={treeData}
        titleRender={titleRender}
        onSelect={(keys, info) => handleNodeAction(info.node, 'edit')}
      />
    </div>
  );
}
