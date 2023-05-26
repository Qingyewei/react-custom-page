import { memo } from "react";
import { Input as AntdInput, Form } from "antd";
import "./Input.less";

import _ from "lodash";

function Input(props: any) {
  const { className, label, name, value, options, dataSource, page, id } = props;
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
    <Form.Item name={name} label={label}>
      <AntdInput placeholder={_.get(options,'placeholder','请输入')} disabled />
    </Form.Item>
  );
  return <>{page.type === "detail" ? getDeatilRender() : getFormRender()}</>;
}

export default memo(Input);
