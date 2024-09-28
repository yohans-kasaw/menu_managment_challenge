"use client";
import MenuForm from "@/app/components/shared/MenuForm";

const AddMenuPage: React.FC = () => {
  const initialMenu = {
    menuId: '56320ee9-6af6-11ed-a7ba-f220afe5e4a9',
    depth: 3,
    parentData: 'Systems',
    name: '',
  };

  const handleSave = (values: any) => {
    console.log('Form Values:', values);
    // Add logic to handle adding the new menu
  };

  return (
    <div className="">
      <MenuForm menu={initialMenu} onSave={handleSave}  formMode="add" />
    </div>
  );
};

export default AddMenuPage;
