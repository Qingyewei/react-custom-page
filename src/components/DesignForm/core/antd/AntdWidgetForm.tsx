import { memo, useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./AntdWidgetForm.module.less";
import Store, { connect } from "@/utils/store";
import { element } from "../../config";
import { v4 as uuidv4 } from "uuid";
import Card from "./AntdWidgetCard";
import _ from "lodash";
import { Form } from "antd";
import { WidgetForm } from "../../config/element";

interface AntdWidgetProps {
  page: any;
  widgetFormCurrentSelect: any;
  type: "basicComponents" | "dataDisplayComponents";
  list: any;
}

/**
 * 
 * 拖拽入表格，会有以下几个问题
 * 1、是否需要嵌入表单中
 * 2、一般的列表页面有一个form表单和表格、操作按钮，表格是不嵌入表单内的
 */

function useListDrop(props: any) {
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

  useEffect(() => {
    const { list: targetList = [] } = props;
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
      Store.dispatch({type:"list",payload:[...newList]});
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

  const DropRender = ({children}: any) => {
    return (
      <div
        ref={drop}
        style={{ backgroundColor: isOver ? "#eee" : "#fff" }}
        className={styles.AntdWidgetForm}
      >
        {children}
      </div>
    );
  };

  return {
    list,
    renderCard,
    DropRender,
  };
}

function AntdWidgetForm(props: AntdWidgetProps) {
  const { page, widgetFormCurrentSelect } = props;
  const [antdWidgetForm] = Form.useForm();
  const {
    list: listDrop,
    DropRender,
    renderCard,
  } = useListDrop({ list: props.list });

  const getInitFormValues = (list: any) => {
    const data: any = {};
    for (const i of list) {
      data[i.name || i.id] = _.get(i, "options.defaultValue");
    }
    antdWidgetForm.setFieldsValue(data);
  };

  useEffect(() => {
    console.log("重新渲染")
    getInitFormValues(listDrop);
  }, [listDrop]);

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
      listDrop.map((card) => renderCard(card))
    ) : (
      <Form
        name="AntdWidgetForm"
        form={antdWidgetForm}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
      >
        {listDrop.map((card) => renderCard(card))}
      </Form>
    );
  };

  return <DropRender>{getBaseRender()}</DropRender>;
}

export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
  page: state.page,
  list: state.list,
}))(memo(AntdWidgetForm));
