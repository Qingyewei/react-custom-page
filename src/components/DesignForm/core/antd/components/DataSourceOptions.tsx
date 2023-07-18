import { Button, Cascader, Drawer, Form, Input, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import AceEditorPage from "../AceEditorPage";
import _ from "lodash";
import Store from "@/utils/store";
import { dataDisplayComponents } from "@/components/DesignForm/config/element";

function transform(obj: any) {
  const result: any[] = [];
  const stack: any[] = [{ obj, result }];
  while (stack.length > 0) {
    const { obj, result } = stack.pop();
    for (const key in obj) {
      const item: any = { label: key, value: key, result: obj[key] };
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        item.children = [];
        stack.push({ obj: obj[key], result: item.children });
      }
      result.push(item);
    }
  }
  return result;
}

function DataSourceOptions(props: any) {
  const [dataSource, setDataSource] = useState<{
    loading: boolean;
    data: any;
    isDrawerStatus: boolean;
  }>({
    loading: false,
    data: null,
    isDrawerStatus: false,
  });
  const { form: widgetForm } = props;
  const defaultDataSource = dataDisplayComponents.find(
    (item) => item.type === "Table"
  )?.widgetProperties.dataSource;
  useEffect(() => {
    let transformData = {};
    if (props.dataSource) {
      transformData = {
        dataSource: props.dataSource,
      };
    }
    const options = transform(transformData);
    window.dataSourcePageValue = options;
    setDataSource({
      ...dataSource,
      data: options,
    });
  }, [props]);

  const ValueTypePage = (valueProps: any) => {
    const type = widgetForm.getFieldValue("value-type");
    const onChange = (value: any) => {
      let currentData = _.get(props, value.join("."), []);
      currentData = currentData.map((item: any, index: any) => {
        item.key = index;
        return item;
      });
      widgetForm.setFieldValue(["widgetProperties", "dataSource"], currentData);
      valueProps?.onChange(value);
    };
    let COM = <Input disabled value="请先选择数据来源方式" />;
    if (type === "custom") {
      COM = (
        <Button
          type="primary"
          onClick={() =>
            setDataSource((state) => ({ ...state, isDrawerStatus: true }))
          }
        >
          查看数据源
        </Button>
      );
    } else if (type === "dataSource") {
      COM = (
        <Cascader
          style={{ width: "65%" }}
          options={dataSource.data}
          placeholder="请选择标签值"
          onChange={onChange}
          value={valueProps.value}
        />
      );
    }
    return <>{COM}</>;
  };

  const onValueTypeChange = (type: string, ...args: any) => {
    const widgetFormCurrentSelect = Store.getState("widgetFormCurrentSelect");
    const newAllValues = { ...widgetFormCurrentSelect };
    if (type === "custom") {
      _.set(newAllValues, "widgetProperties.dataSource", defaultDataSource);
    } else if (type === "dataSource") {
      const valueStr = widgetForm.getFieldValue("value-str");
      if (valueStr) {
        let currentData = _.get(props, valueStr.join("."), []);
        currentData = currentData.map((item: any, index: any) => {
          item.key = index;
          return item;
        });
        _.set(newAllValues, "widgetProperties.dataSource", currentData);
      } else {
        _.set(newAllValues, "widgetProperties.dataSource", []);
      }
    }
    Store.dispatch({
      payload: newAllValues,
      type: "widgetFormCurrentSelect",
    });
  };
  const onAceEditorPageChange = (value: string) => {
    const widgetFormCurrentSelect = Store.getState("widgetFormCurrentSelect");
    const newAllValues = { ...widgetFormCurrentSelect };
    // _.set(newAllValues, "widgetProperties.dataSource", JSON.parse(value));
    console.log("onAceEditorPageChange", {
      newAllValues,
      value: JSON.parse(JSON.stringify(value)),
      type: typeof value,
    });
    // Store.dispatch({
    //   payload: JSON.parse(value),
    //   type: "widgetFormCurrentSelect",
    // });
  };
  return (
    <>
      <Form.Item label={props.label}>
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name="value-type" noStyle>
            <Select
              placeholder="请选择默认方式"
              allowClear
              style={{ width: "35%" }}
              onChange={onValueTypeChange}
            >
              <Select.Option value="dataSource">数据源</Select.Option>
              <Select.Option value="custom">自定义</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="value-str" noStyle>
            <ValueTypePage />
          </Form.Item>
          <Form.Item name={["widgetProperties", "dataSource"]} hidden noStyle>
            <Input.TextArea />
          </Form.Item>
        </Space.Compact>
      </Form.Item>
      <Drawer
        title="Drawer with extra actions"
        placement="right"
        width={500}
        onClose={() =>
          setDataSource((state) => ({ ...state, isDrawerStatus: false }))
        }
        open={dataSource.isDrawerStatus}
        extra={
          <Space>
            <Button
              onClick={() =>
                setDataSource((state) => ({ ...state, isDrawerStatus: false }))
              }
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() =>
                setDataSource((state) => ({ ...state, isDrawerStatus: false }))
              }
            >
              OK
            </Button>
          </Space>
        }
      >
        <AceEditorPage
          name={"DataSourceOptions"}
          mode="json"
          readOnly={false}
          height="100%"
          onChange={onAceEditorPageChange}
          defaultValue={JSON.stringify(defaultDataSource)}
        />
      </Drawer>
    </>
  );
}

export default DataSourceOptions;
