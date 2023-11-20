import { Button, Row, Space } from "antd";
import { Profiler, memo } from "react";
import PreviewMode from "./PreviewMode";
import ViewSourceCode from "./ViewSourceCode";

function OperatButton() {
  function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime){
    console.log(`Profiler [${id}] - ${phase} - ${actualDuration} ms`);
  }
  return (
    <Profiler id="operatButton" onRender={onRender}>
      <Row justify="end">
        <Space wrap>
          {/* 需要优化首屏加载事件 */}
          <PreviewMode />
          <ViewSourceCode />
        </Space>
      </Row>
    </Profiler>
  );
}

export default memo(OperatButton);
