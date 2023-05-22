import React, { memo, useEffect, useState } from "react";
import { JSONTree } from "react-json-tree";

// 所有主题内容：https://github.com/reduxjs/redux-devtools/tree/75322b15ee7ba03fddf10ac3399881e302848874/src/react/themes
const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};
interface ViewJsonProps {
  value?: any;
  onChange?: (value: any) => void;
}
export function ViewJson(props: ViewJsonProps) {
  const { value } = props;
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    console.log("传入值发生变化", value);
    setJsonData(value);
  }, [value]);

  const handleJsonDataChange = (value: any) => {
    console.log("handleJsonDataChange", value);
    // setJsonData(value.jsObject);
  };

  return (
    <div>
      <JSONTree data={jsonData} theme={theme} hideRoot />
    </div>
  );
}

export default memo(ViewJson);
