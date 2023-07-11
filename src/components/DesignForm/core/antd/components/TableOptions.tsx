import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Input, Button, Form, Radio, FormInstance } from "antd";
import React, { memo, useEffect } from "react";
import styles from "./RadioOptions.module.less";
import _ from "lodash";

function RadioOptions(props: any) {
  // console.log("过滤了", props);
  const {
    form,
  }:{form:FormInstance} = props;

  return (
    <Form.Item name={["options", "defaultValue"]} label={props.label}>
      <Radio.Group>
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
                      <Radio
                        value={_.get(options, `${field.name}.value`, "")}
                      ></Radio>
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
                    增加
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Radio.Group>
    </Form.Item>
  );
}

export default RadioOptions;
// export default connect((state: WidgetForm) => ({
//   widgetFormCurrentSelect: state.widgetFormCurrentSelect,
// }))(memo(RadioOptions));
