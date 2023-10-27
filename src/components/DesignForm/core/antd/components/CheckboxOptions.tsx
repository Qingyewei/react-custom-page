import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Input, Button, Form, Radio, FormInstance, Checkbox } from "antd";
import React, { memo, useEffect } from "react";
import styles from "./CheckboxOptions.module.less";
import _ from "lodash";

function CheckboxOptions(props: any) {
  // console.log("过滤了", props);
  const {
    form,
  }:{form:FormInstance} = props;

  const onRemove = (event: any, index: number) => {
    event.stopPropagation();
    const new_options = form
      .getFieldValue(props.name)
      .filter((item: any, i: any) => i !== index);
    form.setFieldValue(props.name, new_options);
    console.log(new_options);
  };

  return (
    <Form.Item name={["options", "defaultValue"]} label={props.label}>
      <Checkbox.Group>
        <Form.List name={props.name}>
          {(fields, { add, remove }) => {
            const options = form.getFieldValue(props.name)
            return (
              <>
                {fields.map((field) => {
                  return (
                    <Space
                      size={8}
                      key={"FormListRadio_" + field.key}
                      align="baseline"
                    >
                      <Checkbox
                        value={_.get(options, `${field.name}.value`, "")}
                      ></Checkbox>
                      <Form.Item
                        name={[field.name, "value"]}
                        rules={[{ required: true, message: "Missing sight" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "label"]}
                        rules={[{ required: true, message: "Missing price" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={(e) => remove(field.name)}
                        />
                      </Form.Item>
                    </Space>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add(
                        {
                          value: "Option " + (fields.length + 1),
                          label: "Option " + (fields.length + 1),
                        },
                        fields.length
                      )
                    }
                    block
                    icon={<PlusOutlined />}
                  >
                    增加选项
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Checkbox.Group>
    </Form.Item>
  );
}

export default CheckboxOptions;
