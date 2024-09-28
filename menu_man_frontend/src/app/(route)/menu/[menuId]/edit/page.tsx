"use client";
import MenuForm from "@/app/components/shared/MenuForm";

const EditMenuPage: React.FC = () => {
  const initialMenu = {
    menuId: "56320ee9-6af6-11ed-a7ba-f220afe5e4a9",
    depth: 3,
    parentData: "Systems",
    name: "System Code",
  };

  const handleSave = (values: any) => {
    console.log("Updated Values:", values);
    // Add logic to handle updating the menu
  };
  const handleDelete = () => {
    console.log("Delete menu");
    // Add logic to handle deleting the menu
  };

  return (
    <div className="">
      <MenuForm menu={initialMenu} onSave={handleSave} formMode="edit" onDelete={handleDelete} />
    </div>
  );
};

export default EditMenuPage;
