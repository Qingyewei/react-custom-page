import Store from "@/utils/store";
import React, { memo } from "react";
import { Input as AntdInput } from "antd";
import "./Input.less"

function Input(props: any) {
  console.log("props Input",props)
  const { className,label } = props;
  const { page } = Store.getStateAll();
  const getDeatilRender = () => {
    return (
      <div className={`${className} cf-input`}>
        <div className="label">{label}</div>
        <div className="text"></div>
      </div>
    );
  };
  const getFormRender = () => <AntdInput placeholder="Basic usage" />;
  return <>{page.type === "detail" ? getDeatilRender() : getFormRender()}</>;
}

export default memo(Input)