import React, { useEffect, useState } from "react";
import Create from "./Create";
import "./App.css";
import axios from "axios";
import {
  BsCircleFill,
  BsFillCheckCircleFill,
  BsFillTrashFill,
  BsPencil,
} from "react-icons/bs";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [updatetask, setUpdatetask] = useState("");
  const [taskid, setTaskid] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/get")
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  }, []);

  const edit = (id) => {
    axios
      .put(`http://localhost:5000/edit/${id}`)
      .then((result) => {
        console.log(result.data);
        const updatedTodos = todos.map((todo) => {
          if (todo._id === id) {
            return { ...todo, done: !todo.done };
          }
          return todo;
        });
        setTodos(updatedTodos);
      })
      .catch((err) => console.log(err));
  };

  const updateTask = (id, updatedTask) => {
    axios
      .put(`http://localhost:5000/update/${id}`, { task: updatedTask })
      .then((result) => {
        console.log(result.data);
        const updatedTodos = todos.map((todo) => {
          if (todo._id === id) {
            return { ...todo, task: updatedTask };
          }
          return todo;
        });
        setTodos(updatedTodos);
        setTaskid("");
        setUpdatetask("");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/delete/${id}`)
      .then((result) => {
        console.log(result.data);
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <header>
        <Create />
      </header>
      <main>
        <div className="task-container">
          {todos.length === 0 ? (
            <div className="task">No tasks found</div>
          ) : (
            todos.map((todo) => (
              <div className="task" key={todo._id}>
                <div className="checkbox">
                  {todo.done ? (
                    <BsFillCheckCircleFill className="icon" />
                  ) : (
                    <BsCircleFill
                      className="icon"
                      onClick={() => edit(todo._id)}
                    />
                  )}
                  {taskid === todo._id ? (
                    <input
                      type="text"
                      value={updatetask}
                      onChange={(e) => setUpdatetask(e.target.value)}
                    />
                  ) : (
                    <p className={todo.done ? "through" : "normal"}>
                      {todo.task}
                    </p>
                  )}
                </div>
                <div>
                  <span>
                    <BsPencil
                      className="icon"
                      onClick={() => {
                        if (taskid === todo._id) {
                          updateTask(todo._id, updatetask);
                        } else {
                          setTaskid(todo._id);
                          setUpdatetask(todo.task);
                        }
                      }}
                    />
                    <BsFillTrashFill
                      className="icon"
                      onClick={() => handleDelete(todo._id)}
                    />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
