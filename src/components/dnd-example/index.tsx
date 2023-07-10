import { Key, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemTypes = {
  LIST_ITEM: "listItem",
};

// 拖动钩子
export const DraggablePushItem = ({ content, children }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LIST_ITEM,
    item: { type: "add", content },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // onDrag(item.id, monitor.didDrop());
    },
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="draggableItem"
    >
      {children}
    </div>
  );
};

// 拖动钩子
const DraggableItem = ({ id, onDrag, children }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LIST_ITEM,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      // onDrag(item.id, monitor.didDrop());
    },
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="draggableItem"
    >
      {children}
    </div>
  );
};

// 放置钩子
export const DroppableArea = ({ onDrop, children, onAdd }: any) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.LIST_ITEM,
    drop: (item: any) => {
      if (item.type === "add") {
        console.log("当前时从另外一个列表过来的", item);
        onAdd(item.id, item.content);
      } else {
        onDrop(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? "lightblue" : "transparent";

  return (
    <div
      ref={drop}
      className="droppableArea"
      style={{ backgroundColor, width: "100%", height: "100%" }}
    >
      {children}
    </div>
  );
};

const List = ({ items, onItemMove, setItems }: any) => {
  const handleItemMove = (dragId: any, isDropped: any) => {
    onItemMove(dragId, isDropped);
  };

  const handleItemAdd = (
    dragId: number,
    dropId: number | undefined,
    item: any
  ) => {
    console.log("onItemAdd", { dragId, dropId, item });
    const isDrag = dragId === undefined;
    if (isDrag) {
      const dropIndex = items.findIndex((item: any) => item.id === dropId);
      const updatedItems = [...items];
      updatedItems.splice(dropIndex, 0, item);
      console.log("添加术后的", updatedItems);
      setItems(updatedItems);
    }
  };

  return (
    <>
      {items.map(
        (item: { id: Key | null | undefined; text: any }, index: number) => (
          <ListItem
            key={index}
            id={item.id}
            text={item.text}
            onMove={handleItemMove}
            onAdd={handleItemAdd}
          />
        )
      )}
    </>
  );
};

const ListItem = ({ id, text, onMove, onAdd }: any) => {
  const handleDrop = (dragId: any) => {
    onMove(dragId, id);
  };
  const handleApp = (dragId: any, item: any) => {
    onAdd(dragId, id, item);
  };

  return (
    <DroppableArea onDrop={handleDrop} onAdd={handleApp}>
      <DraggableItem id={id} onDrag={handleDrop}>
        <div>Drag Me: {text}</div>
      </DraggableItem>
    </DroppableArea>
  );
};

const App = (props: any) => {
  // const [items, setItems] = useState([
  //   { id: 1, text: "Item 1" },
  //   { id: 2, text: "Item 2" },
  //   { id: 3, text: "Item 3" },
  // ]);
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    setItems([...props.list]);
  }, [props.list]);

  const handleItemMove = (dragId: number, dropId: number | undefined) => {
    const isDropped = dropId !== undefined;
    if (isDropped) {
      console.log("Dropped", { dragId, dropId });
      const draggedItem = items.find((item: any) => item.id === dragId);
      const updatedItems = items.filter((item: any) => item.id !== dragId);
      const dropIndex = items.findIndex((item: any) => item.id === dropId);
      updatedItems.splice(dropIndex, 0, draggedItem);
      console.log("updatedItems", updatedItems);
      setItems(updatedItems);
    }
  };

  return (
    // <DndProvider backend={HTML5Backend}>
    <div>
      <h1>List Items</h1>
      <List items={items} onItemMove={handleItemMove} setItems={setItems} />
    </div>
    // </DndProvider>
  );
};

const Root = () => {
  const handleApp = (dragId: any, item: any) => {
    console.log("添加", { dragId, item });
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggablePushItem content={{ id: 5, text: "Item 5" }}>
        <div>Drag Me: Item 5</div>
      </DraggablePushItem>
      <App
        list={[
          { id: 1, text: "Item 1" },
          { id: 2, text: "Item 2" },
          { id: 3, text: "Item 3" },
          { id: 4, text: "Item 4" },
        ]}
      />
      <div style={{ height: "400px" }}>
        <h1>List Items</h1>
        <DroppableArea onAdd={handleApp}></DroppableArea>
      </div>
    </DndProvider>
  );
};

export default Root;
