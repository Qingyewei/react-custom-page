import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Space, Input, Button, Form, Radio, FormInstance } from "antd";
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
                        // className={styles.formListRadio}
                        value={_.get(options, `${field.name}.value`, "")}
                      ></Radio>
                      <Button>
                        {"ss" + _.get(options, `${field.name}.value`, "")}
                      </Button>

                      {/* <Radio
                        // className={styles.formListRadio}
                        value={_.get(
                          props,
                          `widgetFormCurrentSelect.options.options.${field.name}.value`,
                          ""
                        )}
                      ></Radio> */}
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
                    Add sights
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
