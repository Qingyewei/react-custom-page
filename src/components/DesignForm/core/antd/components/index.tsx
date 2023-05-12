import React from "react";
import Input from "./Input";

export default function Index(props: any) {
  const { type } = props;
  const getComponentsItem = () => {
    switch (type) {
      case "input":
        return <Input {...props}/>;
      default:
        return <>当前组件未定义，请及时联系工作人员</>
    }
  };
  return getComponentsItem();
}
