import { Col, Row } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 } from "uuid";
import { DeleteOutlined } from "@ant-design/icons";

function Todo() {
  const [text, setText] = useState("");
  const [dataList, setDataList] = useState({
    todo: {
      title: "Todo",
      items: [],
    },
    "in-progress": {
      title: "In Progress",
      items: [],
    },
    completed: {
      title: "Completed",
      items: [],
    },
  });

  const handleDragDrop = ({ destination, source }) => {
    if (!destination) {
      return console.log("not dropped in droppable");
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return console.log("dropped in same place");
    }

    //copy draggable item
    const itemCopy = { ...dataList[source.droppableId].items[source.index] };

    //removing dragged item from array
    setDataList((prev) => {
      prev = { ...prev };
      prev[source.droppableId].items.splice(source.index, 1);

      //adding items to another array location
      prev[destination.droppableId].items.splice(source.index, 0, itemCopy);
      return prev;
    });
  };

  const handleNewTodo = () => {
    setDataList((prev) => {
      return {
        ...prev,
        todo: {
          title: prev.todo.title,
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

  const handleDelete = (id) => {
    let arr = _.map(dataList, (o) => {
      return _.filter(o.items, (el) => {
        return el.id !== id;
      });
    });

    setDataList((prev) => {
      return {
        ...prev,
        todo: {
          title: prev.todo.title,
          items: arr[0],
        },
        "in-progress": {
          title: prev["in-progress"].title,
          items: arr[1],
        },
        completed: {
          title: prev.completed.title,
          items: arr[2],
        },
      };
    });

    setText("");
  };

  useEffect(() => {
    if (dataList.todo.items.length > 0) {
      localStorage.setItem("itemsLists", JSON.stringify(dataList));
    }
  }, [dataList]);

  useEffect(() => {
    if (localStorage) {
      setDataList(
        JSON.parse(localStorage.getItem("itemsLists"))
          ? JSON.parse(localStorage.getItem("itemsLists"))
          : dataList
      );
    }
  }, []);

  return (
    <Row gutter={[1, 24]} justify="center" className="todo-ui">
      <Col xs={24} md={12}>
        <label>Enter New Todo: </label>
        <input
          type="text"
          name="name"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleNewTodo}>+ Add</button>
      </Col>
      <Col xs={24} align="middle">
        <DragDropContext onDragEnd={handleDragDrop}>
          <Row gutter={24}>
            {_.map(dataList, (data, key) => {
              return (
                <Col xs={24} md={8} key={key}>
                  <h2>{data.title}</h2>
                  <Droppable droppableId={key} key={key}>
                    {(provided, n) => {
                      return (
                        <div
                          className="drag-card"
                          key={n}
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {data.items.map((el, index) => (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.name}
                            >
                              {(provided, idx) => {
                                return (
                                  <div
                                    className="drag-item"
                                    key={idx}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {el.name}
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: 35,
                                      }}
                                    >
                                      <DeleteOutlined
                                        onClick={(e) => handleDelete(el.id)}
                                        style={{
                                          color: "#C70000",
                                          cursor: "default",
                                        }}
                                      />{" "}
                                    </span>
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </Col>
              );
            })}
          </Row>
        </DragDropContext>
      </Col>
    </Row>
  );
}

export default Todo;
