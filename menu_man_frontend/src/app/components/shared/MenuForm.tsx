"use client";
import { Form, Input, Button } from "antd";
import { FormInstance } from "antd/lib/form";
import { DeleteOutlined } from "@ant-design/icons"; // Import the delete icon
import { Tooltip, Popconfirm } from "antd";

interface MenuFormProps {
  menu?: {
    menuId: string;
    depth: number;
    parentData: string;
    name: string;
  };
  onSave: (values: any) => void;
  onDelete?: () => void; // Add onDelete prop
  formMode: "add" | "edit";
}

const MenuForm: React.FC<MenuFormProps> = ({
  menu,
  onSave,
  onDelete,
  formMode,
}) => {
  const [form] = Form.useForm<FormInstance>();

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-lg max-w-md">
      {/* Header with Title and Delete Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-thin text-gray-500">
          {formMode === "add" ? "Adding Menu" : "Edit menu"}
        </h2>
        {formMode === "edit" && onDelete && (
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={onDelete}
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
        onFinish={onSave}
        layout="vertical"
      >
        {/* Menu ID */}
        <Form.Item name="menuId" label="Menu ID">
          <Input
            readOnly
            className="bg-gray-100 text-gray-500 rounded-lg text-base h-12 w-full px-4"
          />
        </Form.Item>

        {/* Depth */}
        <Form.Item name="depth" label="Depth">
          <Input
            readOnly
            className="bg-gray-100 text-gray-500 rounded-lg text-base h-12 w-full px-4"
          />
        </Form.Item>

        {/* Parent Data */}
        <Form.Item name="parentData" label="Parent Data">
          <Input
            readOnly
            className="bg-gray-100 text-gray-500 rounded-lg text-base h-12 w-full px-4"
          />
        </Form.Item>

        {/* Name */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input className="rounded-lg text-base h-12 w-full px-4" />
        </Form.Item>

        {/* Save Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 text-white rounded-lg h-12 w-full text-base hover:bg-blue-700"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MenuForm;
