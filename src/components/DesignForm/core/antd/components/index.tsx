import React, { memo } from "react";
// import Input from "./Input";
import { WidgetForm } from "@/components/DesignForm/config/element";
import { connect } from "@/utils/store";
import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Table,
  TimePicker,
} from "antd";
import _ from "lodash";
import CheckboxOptions from "./CheckboxOptions";
import RadioOptions from "./RadioOptions";
import "./Input.less";

function titleCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function separatePropsByType(props: any) {
  const formProps: any = {};
  const controlProps: any = {};

  for (const propName in props) {
    if (isFormProp(propName)) {
      formProps[propName] = props[propName];
    } else {
      controlProps[propName] = props[propName];
    }
  }

  return {
    formProps,
    controlProps,
  };
}

function isFormProp(propName: string) {
  // 在这里根据属性的特征判断它是表单属性还是控件属性
  // 返回 true 表示是表单属性，返回 false 表示是控件属性
  return ["name", "label", "valuePropName", "rules"].includes(propName);
}

const ComponentPage = memo((props: any) => {
  const {
    className,
    label,
    name,
    value,
    options = {},
    dataSource,
    page,
    id,
    children,
    valuePropName,
    type,
  } = props;
  const getDeatilRender = () => {
    return (
      <div className={`${className} cf-input`}>
        <div className="label">{label}</div>
        <div className="text">
          {_.get(dataSource, value && value.join("."), "")}
        </div>
      </div>
    );
  };
  const getFormRender = () => (
    <Form.Item
      name={name}
      label={label}
      rules={[options.rules]}
      valuePropName={valuePropName}
    >
      {children}
    </Form.Item>
  );
  return <>{page.type === "detail" ? getDeatilRender() : getFormRender()}</>;
});

const Index: React.FC<any> = (props: any) => {
  const { type, label, render } = props;
  // const { formProps, controlProps } = separatePropsByType(props);
  // console.log('{ formProps, controlProps }',{ formProps, controlProps })
  if (render) {
    return render(props);
  }
  const getComponentsItem = () => {
    switch (type) {
      case "input":
        return (
          <ComponentPage {...props}>
            <Input
              placeholder={_.get(props, "options.placeholder", "请输入")}
            />
          </ComponentPage>
        );
      case "switch":
        return (
          <ComponentPage {...props}>
            <Switch />
          </ComponentPage>
        );
      case "Input.Password":
        return (
          <ComponentPage {...props}>
            <Input.Password
              placeholder={_.get(props, "options.placeholder", "请输入")}
            />
          </ComponentPage>
        );
      case "Input.TextArea":
        return (
          <ComponentPage {...props}>
            <Input.TextArea
              placeholder={_.get(props, "options.placeholder", "请输入")}
            />
          </ComponentPage>
        );
      case "InputNumber":
        return (
          <ComponentPage {...props}>
            <InputNumber />
          </ComponentPage>
        );
      case "Radio": {
        const options = _.get(props, "options.options", []);
        return (
          <ComponentPage {...props}>
            <Radio.Group>
              {options.map(
                (item: any, index: any) =>
                  item && (
                    <Radio key={index} value={item.value}>
                      {item.label}
                    </Radio>
                  )
              )}
            </Radio.Group>
          </ComponentPage>
        );
      }
      case "Select": {
        const options = _.get(props, "options.options", []);
        const mode = _.get(props, "options.mode", "");
        const allowClear = _.get(props, "options.allowClear", true);
        return (
          <ComponentPage {...props}>
            <Select options={options} mode={mode} allowClear={allowClear} />
          </ComponentPage>
        );
      }
      case "Checkbox": {
        const options = _.get(props, "options.options", []);
        return (
          <ComponentPage {...props}>
            <Checkbox.Group options={options} />
          </ComponentPage>
        );
      }
      case "CheckboxOptions": {
        return <CheckboxOptions {...props} />;
      }
      case "TimePicker": {
        const placeholder = _.get(
          props,
          "options.placeholder",
          "请选择默认时间"
        );
        const isRangePicker =
          _.get(props, "options.isRangePicker", false) ||
          _.get(props, "widgetFormCurrentSelect.options.isRangePicker", false);
        return (
          <ComponentPage {...props}>
            {isRangePicker ? (
              <TimePicker.RangePicker />
            ) : (
              <TimePicker placeholder={placeholder} />
            )}
          </ComponentPage>
        );
      }
      case "DatePicker": {
        const placeholder = _.get(
          props,
          "options.placeholder",
          "请选择默认日期"
        );
        const isRangePicker =
          _.get(props, "options.isRangePicker", false) ||
          _.get(props, "widgetFormCurrentSelect.options.isRangePicker", false);
        return (
          <ComponentPage {...props}>
            {isRangePicker ? (
              <DatePicker.RangePicker />
            ) : (
              <DatePicker placeholder={placeholder} />
            )}
          </ComponentPage>
        );
      }
      case "SelectOptions": {
        console.log("SelectOptions", props);
        const mode = _.get(props, "options.mode", "");
        return mode === "" ? (
          <RadioOptions {...props} />
        ) : (
          <CheckboxOptions {...props} />
        );
      }
      case "Slider":
        return (
          <ComponentPage {...props}>
            <Slider />
          </ComponentPage>
        );
      case "Text": {
        const { className, options } = props;
        console.log("默认值", props);
        return (
          <div className={`${className} cf-input`}>
            <div className="label">{label}</div>
            <div className="text">{_.get(options, "defaultValue", "")}</div>
          </div>
        );
      }
      case "Table": {
        const {columns,dataSource} = props.widgetProperties
        return (
          <ComponentPage {...props}>
            <Table columns={columns} dataSource={dataSource}/>
          </ComponentPage>
        );
      }
      default:
        return (
          <>
            {label}-{titleCase(type)}组件未定义，请及时联系工作人员
          </>
        );
    }
  };
  return getComponentsItem();
};

export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
  dataSource: state.dataSource,
  page: state.page,
}))(memo(Index));
