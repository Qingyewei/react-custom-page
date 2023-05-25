import Store from "@/utils/store";
import { memo } from "react";
import { Input as AntdInput } from "antd";
import "./Input.less";

import _ from "lodash";

function Input(props: any) {
  const { className, label, value, dataSource } = props;
  const { page } = Store.getStateAll();
  const getDeatilRender = () => {
    return (
      <div className={`${className} cf-input`}>
        <div className="label">{label}</div>
        <div className="text">{_.get(dataSource, value && value.join("."), "")}</div>
      </div>
    );
  };
  const getFormRender = () => <AntdInput placeholder="Basic usage" />;
  return <>{page.type === "detail" ? getDeatilRender() : getFormRender()}</>;
}

export default memo(Input)
