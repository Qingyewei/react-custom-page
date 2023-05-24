import Store from "@/utils/store";
import { Form, Input } from "antd";
import { memo, useEffect } from "react";

function WidgetConfig(props: any) {
  const [widgetForm] = Form.useForm();
  const onValuesChange = (changedValues: any, allValues: any) => {
    Store.dispatch({ payload: allValues, type: "widgetFormCurrentSelect" });
  };

  const getData = () => {
    const { widgetFormCurrentSelect } = Store.getStateAll();
    widgetForm.setFieldsValue(
      widgetFormCurrentSelect ? widgetFormCurrentSelect : {}
    );
  };

  useEffect(() => {
    const unsubscribe = Store.subscribe(() => {
      getData();
    });
    return () => unsubscribe();
  }, []);
  return (
    <Form
      name="basic"
      layout="vertical"
      form={widgetForm}
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      <Form.Item name="id" label="唯一标识符">
        <Input disabled />
      </Form.Item>
      <Form.Item name="label" label="标签">
        <Input placeholder="请输入标签" />
      </Form.Item>
    </Form>
  );
}

export default memo(WidgetConfig);
