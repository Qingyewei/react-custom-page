import Stroe from "@/utils/store";
import { Form, FormInstance, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";

export default function WidgetConfig() {
  const [formData, setFormData] = useState({});

  const widgetRef = useRef<FormInstance>(null);
  const onValuesChange = (changedValues: any, allValues: any) => {
    // Stroe.dispatch({ payload: allValues, type: "page" });
  };
  useEffect(() => {
    const unsubscribe = Stroe.subscribe(() => {
      const { widgetFormCurrentSelect } = Stroe.getStateAll();
      console.log("数据发送了变化", widgetFormCurrentSelect);
      const data = {
        label: widgetFormCurrentSelect?.label,
      };
      setFormData(data);
    });
    return () => unsubscribe();
  }, []);
  return (
    <Form
      name="basic"
      layout="vertical"
      ref={widgetRef}
      initialValues={formData}
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      <Form.Item name="label" label="标签">
        <Input placeholder="请输入标签" />
      </Form.Item>
    </Form>
  );
}
