import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import Components from "./components";
import SvgIcon from "@@/icons/component/SvgIcon";
import Store, { connect } from "@/utils/store";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { WidgetForm, basicComponents } from "../../config/element";

const style: CSSProperties = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

export interface CardProps {
  id: string;
  content: any;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
  widgetFormCurrentSelect: basicComponents & { id: string };
}

interface Item {
  id: string;
  originalIndex: number;
}

const Card: FC<CardProps> = memo(function Card({
  id,
  content,
  moveCard,
  findCard,
  widgetFormCurrentSelect,
}) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "AntdWidgetCard",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "AntdWidgetCard",
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );

  const changeHandleCurrentSelect = () => {
    // 这里有问题，content是在闭包内的，值没有去更新还是旧的值
    // 导致像select、TimerPicker这类的组件，再点击选择时
    // 会冒泡执行到这个方法，导致值无法时最新的
    // 暂时只想到利用Store中的widgetFormCurrentSelect与这里的content比较
    // 如果时同一个就不去替换，不是同一个采取执行该方法
    if (widgetFormCurrentSelect.id !== content.id) {
      console.log("changeHandleCurrentSelect", {
        a: widgetFormCurrentSelect.id,
        b: content.id,
        C: content.options.defaultValue,
      });
      Store.dispatch({
        type: "widgetFormCurrentSelect",
        payload: _.cloneDeep(content),
      });
    }
  };

  const handleCopyClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const newCard = {
      ...content,
      id: `${content.type}_${uuidv4().substring(0, 8)}`,
    };
    Store.dispatch({ type: "listItemCopy", payload: newCard });
  };

  const handleDeleteClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    Store.dispatch({ type: "listItemDelete", payload: content.id });
  };

  return (
    <div
      ref={drop}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="antdWidget-list"
      onClick={changeHandleCurrentSelect}
    >
      <Components className="antdWidget-c" {...content} />
      <div className="antdwidgetFormItem-action">
        <SvgIcon name="copy" className="svg-icon" onClick={handleCopyClick} />
        <SvgIcon
          name="delete"
          className="svg-icon"
          onClick={handleDeleteClick}
        />
      </div>
      <div className="antdWidget-drag" ref={drag}>
        <SvgIcon name="move" className="svg-icon" />
      </div>
    </div>
  );
});
export default connect((state: WidgetForm) => ({
  widgetFormCurrentSelect: state.widgetFormCurrentSelect,
}))(Card);
// export default Card;
