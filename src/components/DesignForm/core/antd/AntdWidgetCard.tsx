import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import Components from "./components";
import SvgIcon from "@@/icons/component/SvgIcon";
import Store from "@/utils/store";
import { v4 as uuidv4 } from "uuid";

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
    Store.dispatch({
      type: "widgetFormCurrentSelect",
      payload: content,
    });
  };

  const handleCopyClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const newCard = {
      ...content,
      id: `${content.type}_${uuidv4().substring(0, 8)}`,
    };
    Store.dispatch({ type: "listItemCopy", payload: newCard });
  };

  const handleDeleteClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    Store.dispatch({ type: "listItemDelete", payload: content.id });
  }

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
        <SvgIcon name="delete" className="svg-icon" onClick={handleDeleteClick} />
      </div>
      <div className="antdWidget-drag" ref={drag}>
        <SvgIcon name="move" className="svg-icon" />
      </div>
    </div>
  );
});

export default Card;
