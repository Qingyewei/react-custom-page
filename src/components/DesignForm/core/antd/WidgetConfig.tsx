import Store, { connect } from "@/utils/store";
import {
  Cascader,
  Form,
  FormInstance,
  Input,
  Select,
  Space,
  Switch,
} from "antd";
import { memo, useEffect, useRef, useState } from "react";
import { WidgetForm, basicComponents } from "../../config/element";
import Components from "./components";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import RadioOptions from "./components/RadioOptions";
import { parseExpression } from "../../utils";
const { Option } = Select;

interface CrudFormItem {
  id?: string;
  name: string | string[];
  label: string;
  type: string;
  options?: {
    placeholder?: string;
    defaultValue?: string;
    options?: {
      label: string;
      value: string;
    }[];
  };
  valuePropName?: string;
  isHidden?: string;
  render?: (props: any) => any;
}

const crudFormItem: CrudFormItem[] = [
  {
    name: "name",
    label: "字段名",
    type: "input",
    options: {
      placeholder: "请输入字段名",
    },
  },
  {
    name: ["options", "placeholder"],
    label: "占位文本",
    type: "input",
    options: {
      placeholder: "请输入占位文本",
    },
  },
  {
    name: ["options", "defaultValue"],
    label: "默认值",
    type: "input",
    options: {
      placeholder: "请输入默认值",
    },
  },
  {
    name: ["options", "rules", "required"],
    label: "是否为必填项",
    type: "switch",
    valuePropName: "checked",
  },
  {
    name: ["options", "rules", "required"],
    label: "是否隐藏-hidden",
    isHidden: "{{ 1 === 0 ? true : false}}",
    type: "switch",
    valuePropName: "checked",
  },
  {
    name: ["options", "options"],
    label: "选项设置",
    type: "Radio",
    isHidden: "{{formData.type !== 'Radio'}}",
    options: {
      options: _.get(
        _.find(
          basicComponents,
          (item: basicComponents) => item.type == "Radio"
        ),
        "options.options"
      ),
    },
    render: (props: any) => {
      return <RadioOptions {...props} />;
    },
  },
];

// type AddcrudFormItemId<T extends any[]> = {
//   [K in keyof T]: T[K] & { id?: string; valuePropName?: string };
// };
// type crudFormItemId = AddcrudFormItemId<typeof crudFormItem>;

function WidgetConfig(props: any) {
  const [widgetForm] = Form.useForm<any>();
  const widgetFormRef = useRef<FormInstance>(null);

  const [crudFormList, setCrudFormList] =
    useState<CrudFormItem[]>(crudFormItem);

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log("onValuesChange", changedValues, allValues);
    Store.dispatch({
      payload: _.cloneDeep(allValues),
      type: "widgetFormCurrentSelect",
    });
  };

  const formatCrudFormList = () => {
    const { widgetFormCurrentSelect } = props;
    console.log("filterCrudFormList", widgetFormCurrentSelect);
    // 这里可能会出现ID丢失问题
    const initList: CrudFormItem[] = _.defaultsDeep(crudFormList, crudFormItem);
    const list = initList
      .map((item) => {
        if (item.isHidden) {
          // item.isHidden = parseExpression(item.isHidden,widgetFormCurrentSelect,'')
          console.log(
            `${item.isHidden}`,
            parseExpression(item.isHidden, widgetFormCurrentSelect, "")
          );
        }

        if (item.label === "默认值") {
          item = {
            ...item,
            type: "input",
            options: {
              placeholder: "请输入默认值",
            },
          };
        }
        if (
          widgetFormCurrentSelect?.type === "Radio" &&
          item.label === "默认值"
        ) {
          item.type = "Select";
          item.options = {};
          item.options.options = _.get(
            widgetFormCurrentSelect,
            "options.options",
            {}
          );
        }
        if (!item.id) {
          item.id = `${item.type}_${uuidv4().substring(0, 8)}`;
        }
        return item;
      })
      .filter(
        (item) => !parseExpression(item.isHidden, widgetFormCurrentSelect, "")
      );
    console.log("最后输出的结果", list);
    setCrudFormList(list);
  };

  useEffect(() => {
    const { widgetFormCurrentSelect, page } = props;
    if (
      page.type === "crud" &&
      widgetFormCurrentSelect &&
      !widgetFormCurrentSelect.name
    ) {
      widgetFormCurrentSelect.name = widgetFormCurrentSelect.id;
    }
    if (widgetFormRef.current) {
      if (widgetFormCurrentSelect) {
        formatCrudFormList();
        widgetForm.setFieldsValue(widgetFormCurrentSelect);
      } else {
        widgetForm.resetFields();
        if (page.type === "detail") {
          widgetForm.setFieldValue("value-type", "dataSource");
        }
      }
    }
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
    const type =
      widgetFormRef.current && widgetForm.getFieldValue("value-type");

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

  const getFormPage = () => {
    return (
      <Form
        name="widgetConfig"
        layout="vertical"
        form={widgetForm}
        ref={widgetFormRef}
        autoComplete="off"
        onValuesChange={onValuesChange}
      >
        <Form.Item name="id" label="唯一标识符">
          <Input disabled />
        </Form.Item>
        <Form.Item name="label" label="标签文本">
          <Input placeholder="请输入标签文本" />
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
          <>
            {crudFormList.map((content, index) => {
              return (
                <Components
                  key={index}
                  className="viewForm-c"
                  {...content}
                  form={widgetForm}
                />
              );
            })}
            {/* <Form.Item name="name" label="字段名">
              <Input placeholder="请输入字段名" />
            </Form.Item>
            <Form.Item name={["options", "placeholder"]} label="占位文本">
              <Input placeholder="请输入占位文本" />
            </Form.Item>
            <Form.Item name={["options", "defaultValue"]} label="默认值">
              <Input placeholder="请输入默认值" />
            </Form.Item>
            <Form.Item
              name={["options", "rules", "required"]}
              label="是否为必填项"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item> */}
          </>
        )}
      </Form>
    );
  };
  return props.widgetFormCurrentSelect ? (
    getFormPage()
  ) : (
    <>从左侧拖拽来添加字段</>
  );
}

export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
  dataSource: state.dataSource,
  page: state.page,
}))(memo(WidgetConfig));
