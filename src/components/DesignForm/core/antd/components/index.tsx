import React, { memo } from "react";
import Input from "./Input";
import { WidgetForm } from "@/components/DesignForm/config/element";
import { connect } from "@/utils/store";

function Index(props: any) {
  const { type } = props;
  const getComponentsItem = () => {
    switch (type) {
      case "input":
        return <Input {...props} />;
      default:
        return <>当前组件未定义，请及时联系工作人员</>;
    }
  };
  return getComponentsItem();
}

export default connect((state: WidgetForm) => ({
  dataSource: state.dataSource,
}))(Index);
