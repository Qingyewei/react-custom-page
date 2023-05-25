import Store, { connect } from "@/utils/store";
import { Cascader, Form, Input, Select, Space } from "antd";
import { memo, useEffect, useState } from "react";
import { WidgetForm } from "../../config/element";
const { Option } = Select;

interface stackType {
  node: any;
  parent: any;
  label: string;
  value: string;
}

function WidgetConfig(props: any) {
  const [widgetForm] = Form.useForm();
  const onValuesChange = (changedValues: any, allValues: any) => {
    Store.dispatch({ payload: allValues, type: "widgetFormCurrentSelect" });
  };

  useEffect(() => {
    const { widgetFormCurrentSelect } = props;

    if (widgetFormCurrentSelect) {
      widgetForm.setFieldsValue(widgetFormCurrentSelect);
    } else {
      widgetForm.resetFields();
    }
    widgetForm.setFieldValue("value-type", "dataSource");
  }, [props, widgetForm]);

  function transform(obj: any) {
    const result: any[] = [];
    const stack: any[] = [{ obj, result }];
    while (stack.length > 0) {
      const { obj, result } = stack.pop();
      for (const key in obj) {
        const item: any = { label: key, value: key, result: obj[key] };
        if (typeof obj[key] === "object" && obj[key] !== null) {
          item.children = [];
          stack.push({ obj: obj[key], result: item.children });
        }
        result.push(item);
      }
    }
    return result;
  }

  const dataSourcePage = () => {
    let { dataSource } = props;
    if (!dataSource) {
      dataSource = {};
    }
    const options = transform(dataSource);
    window.dataSourcePageValue = options;
    return (
      <Form.Item name="value" noStyle>
        <Cascader
          style={{ width: "65%" }}
          options={options}
          placeholder="请选择标签值"
        />
      </Form.Item>
    );
  };

  const getValueTypePage = () => {
    const type = widgetForm.getFieldValue("value-type");

    switch (type) {
      case "dataSource":
        return dataSourcePage();
      case "custom":
        return (
          <Form.Item name="value" noStyle>
            <Input placeholder="请输入自定义值" />
          </Form.Item>
        );
      default: {
        return dataSourcePage();
      }
    }
  };
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
      {props.page.type === "detail" ? (
        <Form.Item label="默认值">
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item name="value-type" noStyle>
              <Select
                placeholder="请选择默认方式"
                allowClear
                style={{ width: "35%" }}
              >
                <Option value="dataSource">数据源</Option>
                <Option value="custom">自定义</Option>
              </Select>
            </Form.Item>
            {getValueTypePage()}
          </Space.Compact>
        </Form.Item>
      ) : (
        <Form.Item name="name" label="标签名称">
          <Input placeholder="请输入标签名称" />
        </Form.Item>
      )}
    </Form>
  );
}

export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
  dataSource: state.dataSource,
  page: state.page,
}))(memo(WidgetConfig));
