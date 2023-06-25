import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Select, Input, Button, Form } from "antd";
import React from "react";

const { Option } = Select;

function RadioOptions(props: any) {
  console.log("过滤了", props);
  const { form } = props;

  return (
    <Form.List name="sights">
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space key={field.key} align="baseline">
              <Form.Item
                {...field}
                label="Sight"
                name={[field.name, "sight"]}
                rules={[{ required: true, message: "Missing sight" }]}
              >
                <Select
                  style={{ width: 130 }}
                >
                  <Option key="0" value="0">
                    0
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                {...field}
                label="Price"
                name={[field.name, "price"]}
                rules={[{ required: true, message: "Missing price" }]}
              >
                <Input />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}

          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add sights
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}

export default RadioOptions;
