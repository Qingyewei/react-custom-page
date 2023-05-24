import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidget.module.less";
import Store from "@/utils/store";
import { element } from "../../config";
import Components from "./components";
import { v4 as uuidv4 } from "uuid";

export default function AntdWidget(props: any) {
  const [list, setList] = useState<any[]>([]);
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
      const { list: targetList } = Store.getStateAll();
      const draggedCard = source.find((s) => s.type === item.id);
      const newCard = {
        ...draggedCard,
        id: `${item.id}_${uuidv4().substring(0, 8)}`,
      };
      Store.dispatch({ type: "listItem", payload: newCard });
      Store.dispatch({
        type: "widgetFormCurrentSelect",
        payload: newCard,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    const unsubscribe = Store.subscribe(() => {
      const { list: targetList = [] } = Store.getStateAll();
      console.log("targetList",targetList)
      setList(targetList);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
      className={styles.AntdWidget}
    >
      {list.map((item, i) => (
        <Components className="antdWidget-list" key={i} {...item} />
      ))}
    </div>
  );
}
