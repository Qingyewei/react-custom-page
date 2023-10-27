import AceEditor from "react-ace";
import ace from "ace-builds";
// 参考 https://github.com/securingsincity/react-ace/blob/main/example/index.js
// https://github.com/ajaxorg/ace/issues/4060
// https://www.npmjs.com/package/vue3-ace-editor
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/snippets/json";

import "ace-builds/src-noconflict/mode-tsx";
import "ace-builds/src-noconflict/snippets/tsx";

import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/snippets/jsx";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";
import workerJavascriptUrl from "ace-builds/src-noconflict/worker-javascript?url";
import { memo, useEffect, useRef, useState } from "react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

ace.config.setModuleUrl("ace/mode/javascript_worker", workerJavascriptUrl);
// const defaultValue = `function onLoad(editor) {
//   console.log("i've loaded");
// }`;
interface jsonInputType {
  name: string;
  mode: "json" | "javascript" | "tsx" | "jsx";
  readOnly?: boolean;
  defaultValue?: string;
  height?: string;
  width?: string;
  theme?: "monokai" | "github";
  getRef?: (ref: any) => void;
  onFocus?: (event: any) => void;
  onChange?: (event: any) => void;
}
const AceEditorPage = (props: jsonInputType) => {
  const {
    name,
    mode = "javascript",
    readOnly = true,
    defaultValue = "",
    height = "150px",
    width = "100%",
    theme = "github",
    getRef,
    onFocus,
  } = props;

  const [state, setState] = useState({
    value: "",
    placeholder: "Placeholder Text",
    theme: "github",
    mode,
    readOnly,
    enableBasicAutocompletion: false,
    enableLiveAutocompletion: true,
    fontSize: 14,
    showGutter: true,
    showPrintMargin: true,
    highlightActiveLine: true,
    enableSnippets: false,
    showLineNumbers: true,
  });
  const aceEditorRef = useRef<AceEditor>(null);
  useEffect(() => {
    if (!["tsx", "jsx", "json"].includes(mode)) {
      window.ace
        .require("ace/ext/beautify")
        .beautify(aceEditorRef.current?.editor.session);
    }
  }, [state.value]);

  useEffect(() => {
    if (defaultValue) {
      const currentValue =
        typeof defaultValue === "string"
          ? defaultValue
          : JSON.stringify(defaultValue);
      if (state.value !== currentValue) {
        let formattedCode = currentValue;
        if (mode === "json") {
          formattedCode = prettier.format(currentValue, {
            parser: mode,
            printWidth: 60,
            plugins: [parserBabel],
          });
        }
        if (mode === "tsx") {
          formattedCode = prettier.format(currentValue, {
            parser: "babel-ts",
            printWidth: 60,
            plugins: [parserBabel],
          });
        }
        if (["jsx"].includes(mode)) {
          formattedCode = prettier.format(currentValue, {
            parser: "babel",
            printWidth: 60,
            plugins: [parserBabel],
          });
        }
        setState((state) => ({
          ...state,
          value: formattedCode,
        }));
      }
      if (state.theme !== theme) {
        setState((state) => ({
          ...state,
          theme: theme,
        }));
      }
    }
  }, [defaultValue, theme]);

  useEffect(() => {
    getRef && getRef(aceEditorRef.current);
  }, [aceEditorRef]);
  function onLoad() {
    // console.log("i've loaded");
  }
  function onChange(newValue: any) {
    let str = "";
    // 找到最后一个分号的索引
    const lastSemicolonIndex = newValue.lastIndexOf(";");

    // 使用 slice() 方法裁剪分号之后的部分
    str = newValue.slice(0, lastSemicolonIndex);
    // console.log("change", str);
    // console.log("change", {newValue,b:JSON.parse(newValue),type:typeof newValue,a:eval(newValue)});
    props.onChange && props.onChange(newValue);
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
  function onChangeFocus(event: any) {
    // console.log("onChangeFocus", event);
    onFocus && onFocus(event);
  }
  return (
    <AceEditor
      ref={aceEditorRef}
      placeholder={state.placeholder}
      mode={state.mode}
      theme={state.theme}
      readOnly={state.readOnly}
      width={width}
      height={height}
      name={name}
      onFocus={onChangeFocus}
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
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        useWorker: false,
        enableBasicAutocompletion: state.enableBasicAutocompletion,
        enableLiveAutocompletion: state.enableLiveAutocompletion,
        enableSnippets: state.enableSnippets,
        showLineNumbers: state.showLineNumbers,
        tabSize: 2,
        // useSoftTabs: true,
        // wrap: true,
      }}
    />
  );
};

export default memo(AceEditorPage);
