import type { CSSProperties, FC } from "react";
import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import Components from "./components";
import SvgIcon from "@@/icons/component/SvgIcon";
import Store from "@/utils/store";

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

  const opacity = isDragging ? 0.5 : 1;
  return (
    <div
      ref={drop}
      style={{ ...style, opacity }}
      className="antdWidget-list"
      onClick={changeHandleCurrentSelect}
    >
      <Components className="antdWidget-c" {...content} />
      <div className="antdWidget-drag" ref={drag}>
        <SvgIcon name="move" class="m-mover" />
      </div>
    </div>
  );
});

export default Card;
