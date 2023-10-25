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
import _, { isArray } from "lodash";
import RadioOptions from "./components/RadioOptions";
import { parseExpression } from "../../utils";
import crudFormItem, {
  CrudFormItem,
  tableFormItem,
} from "../../config/crudFormItem";
const { Option } = Select;

function WidgetConfig(props: any) {
  const [widgetForm] = Form.useForm<any>();
  const widgetFormRef = useRef<FormInstance>(null);

  const [crudFormList, setCrudFormList] = useState<CrudFormItem[]>();

  const onValuesChange = (changedValues: any, allValues: any) => {
    console.log("onValuesChange", changedValues, allValues);
    const newAllValues = {...allValues};
    if (
      _.get(props, "widgetFormCurrentSelect.type") === "Select" &&
      _.get(props, "widgetFormCurrentSelect.options.mode") !==
        _.get(newAllValues, "options.mode")
    ) {
      if (_.get(newAllValues, "options.mode") === "") {
        newAllValues!.options!.defaultValue = "";
      } else {
        if (!isArray(_.get(newAllValues, "options.defaultValue"))) {
          newAllValues!.options!.defaultValue = [];
        }
      }
    }

    Store.dispatch({
      payload: newAllValues,
      type: "widgetFormCurrentSelect",
    });
  };

  const formatCrudFormList = () => {
    const { widgetFormCurrentSelect } = props;
    // 后续可以考虑直接将widgetFormCurrentSelect转换成所需要的crudFormList
    // 这里可能会出现ID丢失问题
    // 慎用 defaultsDeep
    // const initList: CrudFormItem[] = _.defaultsDeep(crudFormList, crudFormItem);
    // console.log("initList", initList)
    const list: CrudFormItem[] = [];
    const formItem: CrudFormItem[] = [...crudFormItem];
    if (widgetFormCurrentSelect.type === "Table") {
      formItem.push(...tableFormItem);
    }
    formItem.forEach((item) => {
      if (parseExpression(item.isHidden, widgetFormCurrentSelect, "")) {
        // newItem.isHidden = parseExpression(newItem.isHidden,widgetFormCurrentSelect,'')
        // console.log(
        //   `${newItem.isHidden}`,
        //   widgetFormCurrentSelect?.type,
        //   parseExpression(newItem.isHidden, widgetFormCurrentSelect, "")
        // );
        return;
      }

      const newItem = _.cloneDeep(item);

      if (_.isFunction(_.get(newItem, "options.options"))) {
        const optionsFun: any = _.get(newItem, "options.options", null);
        if (_.get(newItem, "options.options", "") && optionsFun) {
          // console.log(
          //   "optionsFun",
          //   newItem,
          //   optionsFun?.(widgetFormCurrentSelect)
          // );
          newItem.options!.options = optionsFun?.(widgetFormCurrentSelect);
        }
      }
      if (_.isFunction(_.get(newItem, "options.mode"))) {
        const modeFun: any = _.get(newItem, "options.mode", null);
        if (_.get(newItem, "options.mode", "") && modeFun) {
          // console.log("modeFun", newItem, modeFun?.(widgetFormCurrentSelect));
          newItem.options!.mode = modeFun?.(widgetFormCurrentSelect);
        }
      }

      if (_.get(newItem, "dependenciesName", "")) {
        let dependenciesName = _.get(newItem, "dependenciesName", "");
        if (isArray(dependenciesName)) {
          dependenciesName = dependenciesName.join(".");
        }
        newItem.options!.options = _.get(
          widgetFormCurrentSelect,
          dependenciesName
        );
      }

      if (!newItem.id) {
        newItem.id = `${newItem.type}_${uuidv4().substring(0, 8)}`;
      } else {
        const currentItem = crudFormList?.find(
          (c) => c.type === item.type && c.label === item.label
        );
        if (currentItem) {
          newItem.id = currentItem.id;
        }
      }
      list.push(newItem);
    });
    // console.log("最后输出的结果", list);
    setCrudFormList(list);
  };

  useEffect(() => {
    const { widgetFormCurrentSelect, page } = props;
    if (
      page.type === "form" &&
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
            {crudFormList?.map((content, index) => {
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
