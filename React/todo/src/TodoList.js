import React from "react";
import Todo from "./Todo";

// 引数にpropsを指定すると、変数の値を受け取ることができる。
// 一般的にはpropsと書かずに{props名}と指定する。
const TodoList = ({ todos, toggleTodo }) => {
  return todos.map((todo) => <Todo todo={todo} key={todo.id} toggleTodo={toggleTodo} />);
};

export default TodoList;
