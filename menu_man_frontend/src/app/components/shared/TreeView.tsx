"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tree, Button } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import type { DataNode, EventDataNode } from "antd/lib/tree";

// Define the expected props type
interface TreeViewProps {
  treeData?: TreeDataNode[];
}

export default function TreeView({ treeData = [] }: TreeViewProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [hoveredKey, setHoveredKey] = useState<React.Key | null>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null); // New state to track active button

  const router = useRouter();

  // Validate treeData and ensure keys are unique
  useEffect(() => {
    const keys = new Set();
    const checkKeys = (nodes: TreeDataNode[]) => {
      nodes.forEach((node) => {
        if (keys.has(node.key)) {
          console.error(`Duplicate key found: ${node.key}`);
        } else {
          keys.add(node.key);
        }
        if (node.children) {
          checkKeys(node.children);
        }
      });
    };
    checkKeys(treeData);
  }, [treeData]);

  // Helper function to get all keys (to expand all)
  const getAllKeys = (data: TreeDataNode[]): React.Key[] => {
    const keys: React.Key[] = [];
    const stack = [...data];
    while (stack.length) {
      const node = stack.pop()!;
      keys.push(node.key);
      if (node.children) {
        stack.push(...node.children);
      }
    }
    return keys;
  };

  const allKeys = useMemo(() => getAllKeys(treeData), [treeData]);

  // Check if all nodes are expanded
  const areAllNodesExpanded = expandedKeys.length === allKeys.length;
  // Check if no nodes are expanded
  const areNoNodesExpanded = expandedKeys.length === 0;

  // Expand all nodes
  const handleExpandAll = () => {
    setExpandedKeys(allKeys);
    setActiveButton("expand");
  };

  // Collapse all nodes
  const handleCollapseAll = () => {
    setExpandedKeys([]);
    setActiveButton("collapse");
  };

  // Custom rendering for tree nodes
  const titleRender: TreeProps["titleRender"] = (node) => {
    const isHovered = node.key === hoveredKey;

    return (
      <div
        onMouseEnter={() => setHoveredKey(node.key)}
        onMouseLeave={() => setHoveredKey(null)}
        className="tree-node"
      >
        <span className="node-title">{node.title}</span>
        {isHovered && (
          <a
            className="ml-2"
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(node);
            }}
            aria-label="Add"
            title="Add"
          ></a>
        )}
      </div>
    );
  };

  const handleNodeSelect = (
    selectedKeys: React.Key[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode<React.Key>;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    },
  ) => {
    if (info.node.key !== undefined && info.node.key !== null) {
      router.push(`/menu/${info.node.key}/edit`);
    } else {
      console.error("Node key is invalid:", info.node);
    }
  };

  const handleAdd = (node: TreeDataNode) => {
    if (node.key !== undefined && node.key !== null) {
      router.push(`/menu/${node.key}/add`);
    } else {
      console.error("Node key is invalid:", node);
    }
  };

  // Update the active button state when individual nodes are expanded/collapsed
  const handleTreeExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);

    if (newExpandedKeys.length === allKeys.length) {
      setActiveButton("expand");
    } else if (newExpandedKeys.length === 0) {
      setActiveButton("collapse");
    } else {
      setActiveButton(null);
    }
  };

  // Initialize expandedKeys to root node keys
  useEffect(() => {
    const rootKeys = treeData.map((node) => node.key);
    setExpandedKeys(rootKeys);
  }, [treeData]);

  return (
    <div>
      <Button
        onClick={handleExpandAll}
        style={{
          marginRight: 8,
          backgroundColor: areAllNodesExpanded ? "black" : undefined,
          color: areAllNodesExpanded ? "white" : undefined,
        }}
      >
        Expand All
      </Button>
      <Button
        onClick={handleCollapseAll}
        style={{
          backgroundColor: areNoNodesExpanded ? "black" : undefined,
          color: areNoNodesExpanded ? "white" : undefined,
        }}
      >
        Collapse All
      </Button>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        onExpand={handleTreeExpand}
        treeData={treeData}
        titleRender={titleRender}
        onSelect={handleNodeSelect}
      />
    </div>
  );
}
