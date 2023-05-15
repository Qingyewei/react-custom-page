import { Button, Form, Input, Select, Space } from "antd";
import React, { useState } from "react";
import Stroe from "@/utils/store";
const { Option } = Select;

import AceEditor from "react-ace";
import ace from "ace-builds";
// 参考 https://github.com/securingsincity/react-ace/blob/main/example/index.js
// https://github.com/ajaxorg/ace/issues/4060
// https://www.npmjs.com/package/vue3-ace-editor
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/snippets/json";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-language_tools";
import workerJavascriptUrl from "ace-builds/src-noconflict/worker-javascript?url";
ace.config.setModuleUrl("ace/mode/javascript_worker", workerJavascriptUrl);
const defaultValue = `function onLoad(editor) {
  console.log("i've loaded");
}`;
const JsonInput = () => {
  const [state, setState] = useState({
    value: defaultValue,
    placeholder: "Placeholder Text",
    theme: "github",
    mode: "json",
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: true,
    fontSize: 14,
    showGutter: true,
    showPrintMargin: true,
    highlightActiveLine: true,
    enableSnippets: false,
    showLineNumbers: true,
  });
  function onLoad() {
    // console.log("i've loaded");
  }
  function onChange(newValue: any) {
    console.log("change", newValue);
  }
  function onSelectionChange(newValue: any, event: any) {
    // console.log("select-change", newValue);
    // console.log("select-change-event", event);
  }

  function onCursorChange(newValue: any, event: any) {
    // console.log("cursor-change", newValue);
    // console.log("cursor-change-event", event);
  }

  function onValidate(annotations: any) {
    // console.log("onValidate", annotations);
  }
  return (
    <AceEditor
      placeholder={state.placeholder}
      mode={state.mode}
      theme={state.theme}
      name="UNIQUE_ID_OF_DIV"
      onLoad={onLoad}
      onChange={onChange}
      onSelectionChange={onSelectionChange}
      onCursorChange={onCursorChange}
      onValidate={onValidate}
      value={state.value}
      fontSize={state.fontSize}
      showPrintMargin={state.showPrintMargin}
      showGutter={state.showGutter}
      highlightActiveLine={state.highlightActiveLine}
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: state.enableBasicAutocompletion,
        enableLiveAutocompletion: state.enableLiveAutocompletion,
        enableSnippets: state.enableSnippets,
        showLineNumbers: state.showLineNumbers,
        tabSize: 2,
      }}
    />
  );
};

export default function AntdAdvancedConfig() {
  const { page } = Stroe.getStateAll();
  const onValuesChange = (changedValues: any, allValues: any) => {
    Stroe.dispatch({ payload: allValues, type: "page" });
  };
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={page}
      autoComplete="off"
      onValuesChange={onValuesChange}
    >
      <Form.Item name="showType" label="页面展示类型">
        <Select placeholder="请选择页面展示类型" allowClear>
          <Option value="page">页面</Option>
          <Option value="model">弹窗</Option>
          <Option value="tab">新标签页</Option>
        </Select>
      </Form.Item>
      <Form.Item name="type" label="页面类型">
        <Select placeholder="请选择页面类型" allowClear>
          <Option value="detail">详情</Option>
          <Option value="curd">CRUD表单</Option>
        </Select>
      </Form.Item>
      <Form.Item label="请求接口">
        <Space.Compact style={{ width: "100%" }}>
          <Form.Item name="api_type" noStyle>
            <Select
              placeholder="请选择请求接口方式"
              allowClear
              style={{ width: "50%" }}
            >
              <Option value="POST">POST</Option>
              <Option value="GET">GET</Option>
            </Select>
          </Form.Item>
          <Form.Item name="api_url" noStyle>
            <Input />
          </Form.Item>
          <Button type="primary">运行</Button>
        </Space.Compact>
      </Form.Item>
      <Form.Item label="接口配置参数">
        {/* <JsonInput /> */}
      </Form.Item>
    </Form>
  );
}
