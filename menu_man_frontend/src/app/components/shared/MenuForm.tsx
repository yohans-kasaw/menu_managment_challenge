"use client";
import { Form, Input, Button, Tooltip, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { MenuItem } from "@/lib/types";

interface MenuFormProps {
  id: number;
  menu?: MenuItem;
  onSave: (parentId: number | null, name: string) => void;
  onDelete: (id: number) => void;
  formMode: "add" | "edit";
}

const MenuForm: React.FC<MenuFormProps> = ({
  menu,
  onSave,
  onDelete,
  formMode,
}) => {
  const [form] = Form.useForm();

  const handleSave = ({ name }: { name: string }) => {
    onSave(menu?.id ?? null, name);
  };

  const handleDelete = () => {
    if (menu?.id) {
      onDelete(menu.id);
    }
  };

  const title = formMode === "add" ? "Adding Menu" : "Edit Menu";
  const confirmMessage = "Are you sure you want to delete this item?";

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-thin text-gray-500">{title}</h2>
        {formMode === "edit" && (
          <Popconfirm
            title={confirmMessage}
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete" placement="top">
              <Button
                type="primary"
                shape="circle"
                icon={<DeleteOutlined />}
                className="hover:bg-blue-600 bg-blue-500 border-none"
              />
            </Tooltip>
          </Popconfirm>
        )}
      </div>

      <Form
        form={form}
        initialValues={menu}
        onFinish={handleSave}
        layout="vertical"
      >
        {formMode === "edit" && (
          <Form.Item name="id" label="Menu ID">
            <Input readOnly className="bg-gray-100 text-gray-500 rounded-lg text-base h-12 w-full px-4" />
          </Form.Item>
        )}
        
        <Form.Item name="depth" label="Depth">
          <Input readOnly className="bg-gray-100 text-gray-500 rounded-lg text-base h-12 w-full px-4" />
        </Form.Item>

        <Form.Item name="parentData" label="Parent Data">
          <Input readOnly className="bg-gray-100 text-gray-500 rounded-lg text-base h-12 w-full px-4" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: "Name is required" },
            {
              validator: (_, value) =>
                value.trim() ? Promise.resolve() : Promise.reject(new Error("Name cannot be empty")),
            },
          ]}
        >
          <Input placeholder="Enter name of new Menu" className="text-gray-500 rounded-lg text-base h-12 w-full px-4" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 text-white rounded-lg h-12 w-full text-base hover:bg-blue-700"
          >
            {formMode === "add" ? "Save" : "Update Menu"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MenuForm;
