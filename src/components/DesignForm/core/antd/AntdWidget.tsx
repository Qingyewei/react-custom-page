import { memo, useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidget.module.less";
import Store, { connect } from "@/utils/store";
import { element } from "../../config";
import { v4 as uuidv4 } from "uuid";
import Card from "./AntdWidgetCard";
import _ from "lodash";
import { Form, Modal, message } from "antd";
import { WidgetForm, basicComponents } from "../../config/element";

interface AntdWidgetProps {
  page: any;
  widgetFormCurrentSelect: any;
  type: "basicComponents" | "dataDisplayComponents";
  list: any;
}

function AntdWidget(props: AntdWidgetProps) {
  const { page, widgetFormCurrentSelect } = props;
  const [antdWidgetForm] = Form.useForm();
  const [list, setList] = useState<any[]>([]);
  const [widgetType, setWidgetType] = useState<
    "basicComponents" | "dataDisplayComponents"
  >("basicComponents");

  const [{ isOver }, drop] = useDrop({
    accept: "List",
    drop: (item: any) => {
      let source: any[] = [];
      if (item.source !== widgetType) {
        Modal.warning({
          title: "提示",
          content: "组件不相同，将会被清空",
        });

        Store.dispatch({ type: "list", payload: [] });
      }
      setWidgetType(item.source);
      // 组件类型
      switch (item.source) {
        case "basicComponents":
          source = element.basicComponents;
          break;
        case "dataDisplayComponents":
          source = element.dataDisplayComponents;
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
    props.type === "basicComponents" && getInitFormValues(targetList);
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

  const onValuesChange = (changedValues: any, allValues: any) => {
    for (const i of Object.keys(changedValues)) {
      if (i === widgetFormCurrentSelect.name) {
        console.log("onValuesChange", {
          changedValues,
          allValues,
          widgetFormCurrentSelect,
        });
        const newWidgetFormCurrentSelect = _.cloneDeep(widgetFormCurrentSelect);
        newWidgetFormCurrentSelect.options.defaultValue = changedValues[i];
        Store.dispatch({
          payload: newWidgetFormCurrentSelect,
          type: "widgetFormCurrentSelect",
        });
      }
    }
  };
  const onFinish = (fieldsValue: any) => {
    console.log("Received values of form: ", fieldsValue);
  };
  const onFinishFailed = ({ values, errorFields, outOfDate }: any) => {
    console.log("onFinishFailed: ", { values, errorFields, outOfDate });
  };

  const getBaseRender = () => {
    return page.type === "detail" ? (
      list.map((card) => renderCard(card))
    ) : (
      <Form
        name="AntdWidget"
        form={antdWidgetForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        {list.map((card) => renderCard(card))}
      </Form>
    );
  };

  const widgetTypeMap = {
    basicComponents: getBaseRender(),
    dataDisplayComponents: "ddd",
  };

  return (
    <div
      ref={drop}
      style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
      className={styles.AntdWidget}
    >
      {widgetTypeMap[widgetType]}
    </div>
  );
}

export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
  page: state.page,
  list: state.list,
}))(memo(AntdWidget));
