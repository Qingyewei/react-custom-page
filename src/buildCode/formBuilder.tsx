import _ from "lodash";
import Store from "@/utils/store";
import {
  getAntdComonpentName,
  getAntdComponentStr,
} from "./utils";

function formBuilder() {
  const { list } = Store.getStateAll();
  const componentNames = getAntdComonpentName(list);
  let listStr = "";
  const initialValues: any = {};
  list.forEach((item: any) => {
    listStr += getAntdComponentStr(item);
    if (_.get(item, "options.defaultValue")) {
      initialValues[item.name] = _.get(item, "options.defaultValue");
    }
  });
  return `import { Button, Form, Space, ${componentNames.join(
    ", "
  )} } from 'antd';
    import React from 'react';
    
    const Index: React.FC = () => {
      const [form] = Form.useForm();
    
      const onFinish = (values: any) => {
        console.log(values);
      };
    
      const onReset = () => {
        form.resetFields();
      };
    
      return (
        <Form
            name="templateForm"
            form={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            ${
              Reflect.ownKeys(initialValues).length !== 0 &&
              `initialValues={${JSON.stringify(initialValues)}}`
            }
            onFinish={onFinish}
            autoComplete="off"
          >
            ${listStr}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Space wrap>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
      );
    };
    
    export default Index;`;
}
export default formBuilder;
