"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchMenuTree } from "@/lib/features/menu/menu.thunks";
import { useEffect, useState } from "react";
import { Spin, Alert, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import TreeView from "@/app/components/shared/TreeView";
import { useRouter } from "next/navigation";
import { makeMenuTreeDataNode } from "@/lib/util";
import { useMemo } from "react";

const useMenuPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { menuTrees, isLoading, isSuccess, isError, errorMessage } =
    useAppSelector((state) => ({
      menuTrees: state.menuTree.items,
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

export default function MenuPage() {
  const {
    menuTrees,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    handleAddMenu,
  } = useMenuPage();
  const [isClient, setIsClient] = useState(false);

  // Trigger the client-only rendering flag after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const menuTreeDataNode = useMemo(
    () => (isClient ? makeMenuTreeDataNode(menuTrees) : []),
    [menuTrees, isClient],
  );

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

      {isLoading && (
        <Alert
          message="Important Notice"
          description="If this is your first time using the application, loading the menus may take over 2 minutes. This delay is due to the backend being hosted on free trial servers. Please click on the menu items to update or delete them."
          type="info"
          showIcon
          className="mb-4"
        />
      )}

      {isLoading && (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      )}

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

      {isClient && isSuccess && (menuTrees?.length ?? 0) > 0 && (
        <TreeView treeData={menuTreeDataNode} />
      )}

      {isClient && isSuccess && (menuTrees?.length ?? 0) === 0 && (
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
