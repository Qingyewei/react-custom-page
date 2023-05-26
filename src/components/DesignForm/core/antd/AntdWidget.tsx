import { memo, useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidget.module.less";
import Store, { connect } from "@/utils/store";
import { element } from "../../config";
import { v4 as uuidv4 } from "uuid";
import Card from "./AntdWidgetCard";
import _ from "lodash";
import { Form } from "antd";
import { WidgetForm, basicComponents } from "../../config/element";

function AntdWidget(props: any) {
  const { page } = props;
  const [antdWidgetForm] = Form.useForm();
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

  const getInitFormValues = (list: any) => {
    const data: any = {};
    for (const i of list) {
      data[i.name || i.id] = _.get(i, "options.defaultValue");
    }
    antdWidgetForm.setFieldsValue(data);
  };

  useEffect(() => {
    const { list: targetList = [] } = props;
    // console.log("list 发生变化", targetList);
    getInitFormValues(targetList);
    setList(() => [...targetList]);
  }, [props.list]);

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
    [findCard, list]
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
    [findCard, moveCard]
  );

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
      className={styles.AntdWidget}
    >
      {page.type === "detail" ? (
        list.map((card) => renderCard(card))
      ) : (
        <Form
          name="AntdWidget"
          form={antdWidgetForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          {list.map((card) => renderCard(card))}
        </Form>
      )}
    </div>
  );
}

export default connect((state: WidgetForm) => ({
  page: state.page,
  list: state.list,
}))(memo(AntdWidget));
