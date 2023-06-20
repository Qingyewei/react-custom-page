import React, { memo } from "react";
// import Input from "./Input";
import { WidgetForm } from "@/components/DesignForm/config/element";
import { connect } from "@/utils/store";
import { Form, Input, Switch } from "antd";
import _ from "lodash";

function titleCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

const ComponentPage = memo((props: any) => {
  const {
    className,
    label,
    name,
    value,
    options={},
    dataSource,
    page,
    id,
    children,
    valuePropName,
    type
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

function Index(props: any) {
  const { type, label } = props;
  console.log("ssss",props)

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
            <Input.Password placeholder={_.get(props, "options.placeholder", "请输入")} />
          </ComponentPage>
        );
      case "Input.TextArea":
        return (
          <ComponentPage {...props}>
            <Input.TextArea placeholder={_.get(props, "options.placeholder", "请输入")} />
          </ComponentPage>
        );
      default:
        return <>{label}-{titleCase(type)}组件未定义，请及时联系工作人员</>;
    }
  };
  return getComponentsItem();
}

export default connect((state: WidgetForm) => ({
  dataSource: state.dataSource,
  page: state.page,
}))(memo(Index));
