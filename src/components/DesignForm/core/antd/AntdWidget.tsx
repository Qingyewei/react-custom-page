import React from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidget.module.less";
import Stroe from "@/utils/store";
import { element } from "../../config";
import Components from "./components";

export default function AntdWidget(props: any) {
  const {list} = Stroe.getStateAll()
  const [{ isOver }, drop] = useDrop({
    accept: "ITEM",
    drop: (item: any) => {
      let source: any[] = [];

      // 组件类型
      switch (item.source) {
        case "basicComponents":
          source = element.basicComponents;
          break;
        default:
          break;
      }

      const data = source.find((s) => s.type === item.id);
      console.log("ssssss", item, data);
      Stroe.dispatch({ type: "list", payload: data });
      Stroe.dispatch({ type: "widgetFormCurrentSelect", payload: data });
      // return props.onDrop(item.id)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
      className={styles.AntdWidget}
    >
      {
        list.map((item,i)=> <Components className="antdWidget-list" key={i} {...item}/>)
      }
    </div>
  );
}
