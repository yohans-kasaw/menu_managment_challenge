"use client";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin, Alert, notification } from "antd";
import MenuForm from "@/app/components/shared/MenuForm";
import { findMenuItemById } from "@/lib/util";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { deleteMenuItem, updateMenuItem } from "@/lib/features/menu/menu.thunks";
import { resetMenuDeleteState } from "@/lib/features/menu/menu.delete.slice";
import { resetMenuUpdateState } from "@/lib/features/menu/menu.update.slice";
import { RootState } from "@/lib/store";

// Custom hook to encapsulate the EditMenuPage logic
const useEditMenuPage = (menuId: string) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    menuTrees,
    isLoading,
    isSuccess,
    isError,
    errorMessage,
    deleteIsLoading,
    deleteIsSuccess,
    deleteIsError,
    deleteErrorMessage,
  } = useAppSelector((state: RootState) => ({
    menuTrees: state.menuTree.items,
    isLoading: state.menuUpdate.isLoading,
    isSuccess: state.menuUpdate.isSuccess,
    isError: state.menuUpdate.isError,
    errorMessage: state.menuUpdate.errorMessage,
    deleteIsLoading: state.menuDelete.isLoading,
    deleteIsSuccess: state.menuDelete.isSuccess,
    deleteIsError: state.menuDelete.isError,
    deleteErrorMessage: state.menuDelete.errorMessage,
  }));

  const menuItem = useMemo(() => {
    if (menuTrees) {
      const item = findMenuItemById(menuTrees, parseInt(menuId, 10));
      return item
        ? { ...item, parentData: findMenuItemById(menuTrees, item.parentId)?.name }
        : null;
    }
    return null;
  }, [menuId, menuTrees]);

  const handleUpdate = (parentId: number, name: string) => {
    if (!name) {
      notification.error({ message: "Validation Error", description: "Name is required" });
      return;
    }
    dispatch(updateMenuItem({ id: menuItem?.id ?? 0, updates: { name } }));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteMenuItem(id));
  };

  useEffect(() => {
    if (isSuccess) {
      notification.success({ message: "Success", description: "Menu item updated successfully" });
      dispatch(resetMenuUpdateState());
      router.push("/menu");
    }

    if (deleteIsSuccess) {
      notification.success({ message: "Success", description: "Menu item deleted successfully" });
      dispatch(resetMenuDeleteState());
      router.push("/menu");
    }
  }, [isSuccess, deleteIsSuccess, dispatch, router]);

  return {
    menuItem,
    isLoading: isLoading || deleteIsLoading,
    isError: isError || deleteIsError,
    errorMessage: errorMessage || deleteErrorMessage,
    handleUpdate,
    handleDelete,
  };
};

const EditMenuPage: React.FC<{ params: { menuId: string } }> = ({ params }) => {
  const { menuItem, isLoading, isError, errorMessage, handleUpdate, handleDelete } = useEditMenuPage(params.menuId);

  if (!menuItem) {
    return <Alert message="Error" description="Menu not found" type="error" showIcon />;
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
      <Alert message="Error" description={errorMessage} type="error" showIcon closable />
    );
  }

  return (
    <div className="edit-menu-page">
      <MenuForm
        menu={menuItem}
        onSave={handleUpdate}
        onDelete={handleDelete}
        formMode="edit"
      />
    </div>
  );
};

export default EditMenuPage;
