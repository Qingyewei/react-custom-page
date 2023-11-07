import {
  Button,
  Cascader,
  Drawer,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import AceEditorPage from "../AceEditorPage";
import _ from "lodash";
import Store from "@/utils/store";
import { NamePath } from "antd/es/form/interface";

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

type DataSourceOptions = {
  form: FormInstance;
  name: NamePath;
  label: string;
  dataSource: any[];
  widgetFormCurrentSelect: any;
};

function DataSourceOptions(props: DataSourceOptions) {
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
  const defaultValue =
    _.get(props, "widgetFormCurrentSelect.widgetProperties.dataSource", []) ||
    [];
  const widgetPropertiesDataSource = Form.useWatch(props.name, widgetForm);

  useEffect(() => {
    const type = widgetForm.getFieldValue("value-type");
    if (type === "custom") {
      setDataSource({
        ...dataSource,
        data:
          _.get(
            props,
            "widgetFormCurrentSelect.widgetProperties.dataSource",
            []
          ) || [],
      });
    } else if (type === "dataSource") {
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
    }
  }, [props]);

  // useEffect(() => {

  // }, [widgetPropertiesDataSource]);

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

  const onValueTypeChange = (type: string) => {
    if (type === "custom") {
      widgetForm.setFieldValue(props.name, dataSource.data);
    } else if (type === "dataSource") {
      const valueStr = widgetForm.getFieldValue("value-str");
      if (valueStr) {
        let currentData = _.get(props, valueStr.join("."), []);
        currentData = currentData.map((item: any, index: any) => {
          item.key = index;
          return item;
        });
        widgetForm.setFieldValue(props.name, currentData);
      } else {
        widgetForm.setFieldValue(props.name, dataSource.data);
      }
    }
  };
  const onAceEditorPageChange = (value: string) => {
    widgetForm.setFieldValue(props.name, JSON.parse(value));
    setDataSource((state) => ({
      ...state,
      data: JSON.parse(value),
    }));
  };

  const handleOnClose = () => {
    setDataSource((state) => ({
      ...state,
      data: defaultValue,
      isDrawerStatus: false,
    }));
  };
  const handleOnConfirm = () => {
    const widgetFormCurrentSelect = _.get(props, "widgetFormCurrentSelect");
    const newAllValues = { ...widgetFormCurrentSelect };
    _.set(
      newAllValues,
      "widgetProperties.dataSource",
      widgetPropertiesDataSource
    );
    Store.dispatch({
      payload: newAllValues,
      type: "widgetFormCurrentSelect",
    });
    setDataSource((state) => ({
      ...state,
      data: widgetPropertiesDataSource,
      isDrawerStatus: false,
    }));
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
        onClose={handleOnClose}
        open={dataSource.isDrawerStatus}
        extra={
          <Space>
            <Button onClick={handleOnClose}>取消</Button>
            <Button type="primary" onClick={handleOnConfirm}>
              确定
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
          defaultValue={dataSource.data}
        />
      </Drawer>
    </>
  );
}

export default DataSourceOptions;
