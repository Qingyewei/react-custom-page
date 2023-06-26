import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Input, Button, Form, Radio } from "antd";
import React, { memo, useEffect } from "react";
import styles from "./RadioOptions.module.less";
import _ from "lodash";

/**
 * 问题总结：
 * 1、无法移除：key错乱
 * 2、添加后设置默认值无效
 */

function RadioOptions(props: any) {
  // console.log("过滤了", props);
  const {
    form,
    options: { options },
  } = props;
  console.log("当前页面的options", options);

  useEffect(() => {
    console.log("更新了", props);
  }, [props]);

  return (
    <Form.Item name={["options", "defaultValue"]} label={props.label}>
      <Radio.Group>
        <Form.List name={props.name}>
          {(fields, { add, remove }) => {
            console.log("fields",fields)
            return (
              <>
                {fields.map((field) => {
                  return (
                    <Radio
                      key={"FormListRadio_" + field.key}
                      className={styles.formListRadio}
                      value={_.get(options, `${field.name}.value`, "")}
                    >
                      <Space align="baseline">
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
  
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    </Radio>
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
                    Add sights
                  </Button>
                </Form.Item>
              </>
            )
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
