import "./App.css";
import { useState, useRef } from "react";
import TodoList from "./TodoList";
import { v4 as uuidv4 } from "uuid";

function App() {
  // useState()：変数を監視・管理するために使うフック
  // [オブジェクトの変数, オブジェクトを更新する関数] = useState([変数に格納する初期値]);
  const [todos, setTodos] = useState([]);

  // useRef()：要素の情報を取得するために使うフック
  const todoNameRef = useRef();

  // タスク追加の関数
  const handleAddTodo = (e) => {
    // inputの文字列を取得
    const name = todoNameRef.current.value;
    // 空の文字列だったらここで終了
    if (name === "") return;
    setTodos((prevTodos) => {
      // すでにある配列に新しく追加
      // スプレッド構文：配列を展開してくれる
      return [...prevTodos, { id: uuidv4(), name: name, completed: false }];
    });
    todoNameRef.current.value = null;
  };

  // チェックボックスの判定
  const toggleTodo = (id) => {
    // todosの配列をコピー
    const newTodos = [...todos];
    // todoリストのidと引数で渡されたidが一致したら、completedの値を反転させる
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    // 新しく作成したtodosを格納する
    setTodos(newTodos);
  };

  // 完了タスクの削除
  const handleClear = () => {
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  };

  return (
    <div>
      {/* useStateの変数の値をpropsでTodoListへ渡す
          渡す時の名前 = {渡す変数} */}
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input type="text" ref={todoNameRef}></input>
      <button onClick={handleAddTodo}>タスクを追加</button>
      <button onClick={handleClear}>完了したタスクの削除</button>
      <div>残りのタスク:{todos.filter((todo) => !todo.completed).length}</div>
    </div>
  );
}

export default App;
