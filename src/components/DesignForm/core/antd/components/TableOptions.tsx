import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Space,
  Input,
  Button,
  Form,
  FormInstance,
  Checkbox,
} from "antd";
import _ from "lodash";

function TableOptions(props: any) {
  const { form }: { form: FormInstance } = props;


  return (
    <Form.Item name={["options", "defaultValue"]} label={props.label}>
      <Checkbox.Group>
        <Form.List name={props.name}>
          {(fields, { add, remove }) => {
            const options = form.getFieldValue(props.name);
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
                        value={_.get(options, `${field.name}.dataIndex`, "")}
                      ></Checkbox>
                      <Form.Item
                        name={[field.name, "dataIndex"]}
                        rules={[{ required: true, message: "Missing sight" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "title"]}
                        rules={[{ required: true, message: "Missing price" }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, "key"]}
                        hidden
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
                          title: "Option" + (fields.length + 1),
                          dataIndex: "Option" + (fields.length + 1),
                          key: "Option" + (fields.length + 1),
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

export default TableOptions;
// export default connect((state: WidgetForm) => ({
//   widgetFormCurrentSelect: state.widgetFormCurrentSelect,
// }))(memo(TableOptions));
