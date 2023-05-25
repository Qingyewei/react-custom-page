import { useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidget.module.less";
import Store from "@/utils/store";
import { element } from "../../config";
import { v4 as uuidv4 } from "uuid";
import Card from "./AntdWidgetCard";
import _ from "lodash";

export default function AntdWidget(props: any) {
  const [list, setList] = useState<any[]>([]);
  const [{ isOver }, drop] = useDrop({
    accept: "List",
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
      // console.log("targetList 发生变化",targetList)
      setList(()=>([...targetList]));
    });
    return () => unsubscribe();
  }, []);

  useEffect(()=>{
    // console.log("list 发生变化",list)
  },[list])

  const findCard = useCallback(
    (id: string) => {
      const card = list.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: list.indexOf(card),
      };
    },
    [list]
  );

  const moveCard = useCallback(
    (id: string, hoverIndex: number) => {
      const newList = _.cloneDeep(list);
      const { index: dragIndex } = findCard(id);
      let temp = newList[dragIndex];
      newList[dragIndex] = newList[hoverIndex];
      newList[hoverIndex] = temp;
      temp = null;
      setList(newList);
    },
    [list]
  );

  const renderCard = useCallback(
    (card: { id: string }) => {
      return (
        <Card
          key={card.id}
          id={card.id}
          content={card}
          moveCard={moveCard}
          findCard={findCard}
        />
      );
    },
    [list]
  );

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
      className={styles.AntdWidget}
    >
      {list.map((card) => renderCard(card))}
    </div>
  );
}
