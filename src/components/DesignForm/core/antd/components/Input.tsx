import Stroe from "@/utils/store";
import React from "react";
import { Input as AntdInput } from "antd";
import "./Input.less"

export default function Input(props: any) {
  console.log("props Input",props)
  const { className,label } = props;
  const { page } = Stroe.getStateAll();
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
