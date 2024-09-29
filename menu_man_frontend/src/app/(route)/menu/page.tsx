"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchMenuTree } from "@/lib/features/menu/menu.thunks";
import { selectMenuTrees } from "@/lib/features/menu/menu.selector";
import { useEffect } from "react";
import { Spin, Alert, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import TreeView from "@/app/components/shared/TreeView";
import { useRouter } from "next/navigation";

// Custom hook for encapsulating the menu page logic
const useMenuPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    menuTrees,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
  } = useAppSelector((state) => ({
    menuTrees: selectMenuTrees(state),
    isLoading: state.menuTree.isLoading,
    isSuccess: state.menuTree.isSuccess,
    isError: state.menuTree.isError,
    errorMessage: state.menuTree.errorMessage,
  }));

  useEffect(() => {
    dispatch(fetchMenuTree());
  }, [dispatch]);

  const handleAddMenu = () => {
    router.push("/menu/-1/add");
  };

  return {
    menuTrees,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    handleAddMenu,
  };
};

// Component for displaying menus
export default function MenuPage() {
  const {
    menuTrees,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    handleAddMenu,
  } = useMenuPage();

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

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <Alert
          message="Error"
          description={
            errorMessage || "Failed to load menus. Please try again later."
          }
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {/* Success state with menu data */}
      {isSuccess && menuTrees.length > 0 && (
        <TreeView treeData={menuTrees as TreeDataNode[]} />
      )}

      {/* Success state with no menu data */}
      {isSuccess && menuTrees.length === 0 && (
        <div className="mb-4">
          <Alert
            message="No Menus Available"
            description="There are no menus to display at the moment."
            type="info"
            showIcon
          />
          <Button
            type="primary"
            onClick={handleAddMenu}
            style={{ marginTop: "16px" }}
          >
            Add Menu
          </Button>
        </div>
      )}
    </div>
  );
}
