"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Spin, Alert, notification } from "antd";
import MenuForm from "@/app/components/shared/MenuForm";
import { findMenuItemById } from "@/lib/util";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { createMenuItem } from "@/lib/features/menu/menu.thunks";
import { resetMenuAddState } from "@/lib/features/menu/menu.add.slice";
import { fetchMenuTree } from "@/lib/features/menu/menu.thunks";

// Custom hook to encapsulate the AddMenuPage logic
const useAddMenuPage = (menuId: string) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const menuTrees = useAppSelector((state) => state.menuTree.items);
  const isLoading = useAppSelector((state) => state.menuTree.isLoading);
  const isSuccess = useAppSelector((state) => state.menuTree.isSuccess);
  const isError = useAppSelector((state) => state.menuTree.isError);
  const errorMessage = useAppSelector((state) => state.menuTree.errorMessage);

  useEffect(() => {
    dispatch(fetchMenuTree());
  }, [dispatch]);

  const menuItem = useMemo(() => {
    if (menuId !== "-1" && menuTrees) {
      return findMenuItemById(menuTrees, parseInt(menuId, 10));
    }
    return null;
  }, [menuId, menuTrees]);

  const parentMenuItem = useMemo(() => {
    if (menuItem) {
      return {
        id: menuItem.id,
        name: "",
        parentData: menuItem.name,
        depth: (menuItem.depth ?? 0) + 1,
      };
    }
    return {
      id: null,
      name: "",
      parentData: "",
      depth: 0,
    };
  }, [menuItem]);

  const handleSave = (parentId: number | null, name: string) => {
    if (!name) {
      notification.error({
        message: "Validation Error",
        description: "Name is required",
      });
      return;
    }
    dispatch(createMenuItem({ parentId, name }));
  };

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: "Success",
        description: "Menu item added successfully",
      });
      dispatch(resetMenuAddState());
      router.push("/menu");
    }
  }, [isSuccess, dispatch, router]);

  return {
    parentMenuItem,
    isLoading,
    isError,
    errorMessage,
    handleSave,
    menuItem,
  };
};

const AddMenuPage: React.FC<{ params: { menuId: string } }> = ({ params }) => {
  const {
    parentMenuItem,
    isLoading,
    isError,
    errorMessage,
    handleSave,
    menuItem,
  } = useAddMenuPage(params.menuId);

  if (!menuItem && params.menuId !== "-1") {
    return (
      <Alert
        message="Error"
        description="Menu not found"
        type="error"
        showIcon
      />
    );
  }

  if (isLoading) {
    return (
      <Spin size="large" tip="Loading...">
        <div style={{ height: "100vh", width: "100%" }} />
      </Spin>
    );
  }

  if (isError) {
    return (
      <Alert message="Error" description={errorMessage} type="error" showIcon />
    );
  }

  return (
    <div className="add-menu-page">
      <MenuForm menu={parentMenuItem} onSave={handleSave} formMode="add" />
    </div>
  );
};

export default AddMenuPage;
