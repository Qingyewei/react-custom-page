import React from "react";
import styles from "./ComponentGroup.module.less";
import { useDrag } from "react-dnd";
import SvgIcon from "../../icons/component/SvgIcon";
import { Row, Col } from "antd";

function ComponentGroupItem(props: any) {
  const { dataSource, type } = props;
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { id: props.id, source: type},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="element"
    >
      <SvgIcon name={dataSource.type} />
      <div className="element-label">{dataSource.label}</div>
    </div>
  );
}

export default function ComponentGroup(props: any) {
  const { title, list, type } = props;
  return (
    <div className={styles.ComponentGroup}>
      <div className="ComponentGroup-title">{title}</div>
      <div className="ComponentGroup-list">
        <Row gutter={16}>
          {list.map((item: any) => {
            return (
              <Col className="gutter-row" span={8} key={item.type}>
                <ComponentGroupItem id={item.type} dataSource={item} type={type}/>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
