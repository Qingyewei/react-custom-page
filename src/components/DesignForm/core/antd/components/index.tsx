import React, { memo } from "react";
import Input from "./Input";
import { WidgetForm } from "@/components/DesignForm/config/element";
import { connect } from "@/utils/store";

function titleCase(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function Index(props: any) {
  const { type } = props;
  const getComponentsItem = () => {
    switch (type) {
      case "input":
        return <Input {...props} />;
      default:
        return <>{titleCase(type)}组件未定义，请及时联系工作人员</>;
    }
  };
  return getComponentsItem();
}

export default connect((state: WidgetForm) => ({
  dataSource: state.dataSource,
  page: state.page,
}))(Index);
