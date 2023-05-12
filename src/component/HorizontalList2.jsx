import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import _ from "lodash";
import "./horizontallist.css";
import { v4 } from "uuid";

const item = {
  id: v4(),
  width: "20px",
  name: "tesName",
};
const item2 = {
  id: v4(),
  width: "100px",
  name: "tesName2",
};
const item3 = {
  id: v4(),
  width: "40px",
  name: "tesName3 ",
};

console.log(item);

function VerticalList() {
  const [text, setText] = useState("");
  const [state, setstate] = useState({
    todo: {
      title: "todo",

      items: [item, item2],
    },
    "in-progress": {
      title: "in Progress",
      items: [item3],
    },
    done: {
      title: "Completed",
      items: [],
    },
  });

  //to fix error Unable to find draggable with id: without disabled strict mode
  // const StrictModeDroppable = ({ children, ...props }) => {
  //   const [enabled, setEnabled] = useState(false);

  //   useEffect(() => {
  //     const animation = requestAnimationFrame(() => setEnabled(true));

  //     return () => {
  //       cancelAnimationFrame(animation);
  //       setEnabled(false);
  //     };
  //   }, []);

  //   if (!enabled) {
  //     return null;
  //   }

  //   return <Droppable {...props}>{children}</Droppable>;
  // };

  //to fix error Unable to find draggable with id: without disabled strict mode
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  //end to fix error Unable to find draggable with id: without disabled strict mode

  const handleDragEnd = ({ destination, source }) => {
    console.log("from", source);
    console.log("to", destination);

    //drag drop validation
    if (!destination) {
      console.log("not dropped in droppable");
      return;
    }

    if (destination.index === source.index && destination.droppableId == source.droppableId) {
      console.log("drop in same place");
      return;
    }
    //creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };
    setstate((prev) => {
      prev = { ...prev };
      //remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);
      //adding to new items array location
      prev[destination.droppableId].items.splice(destination.index, 0, itemCopy);
      return prev;
    });
  };

  const addItem = () => {
    setstate((prev) => {
      return {
        ...prev,
        todo: {
          title: "todo",
          items: [
            {
              id: v4(),
              name: text,
            },
            ...prev.todo.items,
          ],
        },
      };
    });

    setText("");
  };

  const tes = () => {
    console.log("clicked");
  };
  return (
    <div>
      <h1>Horizontal List</h1>
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button onClick={addItem}>add</button>
      </div>
      <div className="App">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className="column">
                <h3>{data.title}</h3>

                {isMounted ? (
                  <Droppable droppableId={key} direction="horizontal">
                    {(provided, snapshot) => {
                      // console.log(snapshot);
                      return (
                        <div className={"droppable-col"} ref={provided.innerRef} {...provided.droppableProps}>
                          {data.items.map((val, index) => {
                            return (
                              <Draggable key={val.id} index={index} draggableId={val.id}>
                                {(provided, snapshot) => {
                                  return (
                                    // className={`items ${snapshot.isDragging && "dragging"}`}
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                      <div onClick={tes} style={{ color: "white", padding: "2px", width: val.width, background: "orange", border: "1px solid black" }}>
                                        {val.name}
                                      </div>
                                      {/* {val.name} */}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                ) : null}
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default VerticalList;
