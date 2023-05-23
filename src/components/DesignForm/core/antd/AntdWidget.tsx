import { useEffect } from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidget.module.less";
import Store from "@/utils/store";
import { element } from "../../config";
import Components from "./components";
import { v4 as uuidv4 } from "uuid";

export default function AntdWidget(props: any) {
  const { list } = Store.getStateAll();
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
      data.id = `${item.id}_${uuidv4().substring(0, 8)}`;
      console.log("z这里执行了", item, data);
      Store.dispatch({ type: "list", payload: data });
      Store.dispatch({
        type: "widgetFormCurrentSelect",
        payload: data,
      });
      // return props.onDrop(item.id)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    // console.log("list发生变化", list);
  }, [list]);

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
      className={styles.AntdWidget}
    >
      {list.map((item,i) => (
        <Components className="antdWidget-list" key={i} {...item} />
      ))}
    </div>
  );
}
