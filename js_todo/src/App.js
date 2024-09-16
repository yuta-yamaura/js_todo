import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { element, render } from "./view/html-util.js";


export class App {
    #todoListView = new TodoListView();
    // 1. TodoListModelの初期化
    #todoListModel = new TodoListModel([]);

    /**
     * Todoを追加するときに呼ばれるリスナー関数
     * @param {string} title
     */
    handleadd(title) {
        this.#todoListModel.addTodo(new TodoItemModel({ title, completed: false }));
    }
    /**
     * Todoの状態を更新したときに呼ばれるリスナー関数
     * @param {{ id:number, completed: boolean }}
     */
    handleUpdate({ id, completed }) {
        this.#todoListModel.updateTodo({ id, completed });
    }
    /**
     * Todoを削除したときに呼ばれるリスナー関数
     * @param {{ id: number }}
     */
    handleDelete({ id }) {
        this.#todoListModel.deleteTodo({ id });
    }

    mount() {
        const formElement = document.querySelector("#js-form");
        const inputElement = document.querySelector("#js-form-input");
        const containerElement = document.querySelector("#js-todo-list");
        const todoItemCountElement = document.querySelector("#js-todo-count");
        // 2. TodoListModelの状態が更新されたら表示を更新する
        this.#todoListModel.onChange(() => {
            const todoItems = this.#todoListModel.getTodoItems();
            const todoListView = new TodoListView();
            // todoItemsに対応するTodoListViewを作成する
            const todoListElement = todoListView.createElement(todoItems, {
                // Todoアイテムが更新イベントを発生したときに呼ばれるリスナー関数
                onUpdateTodo: ({ id, completed }) => {
                    this.#todoListModel.updateTodo({ id, completed });
                },
                // Todoアイテムが削除イベントを発生したときに呼ばれるリスナー関数
                onDeleteTodo: ({ id }) => {
                    this.#todoListModel.deleteTodo({ id });
                }
            });
            render(todoListElement, containerElement);
            todoItemCountElement.textContent = `Todoアイテム数: ${this.#todoListModel.getTotalCount()}`;
        });
        // 3. フォームを送信したら、新しいTodoItemModelを追加する
        formElement.addEventListener("submit", (e) => {
            // submitイベントの本来の動作を止める
            e.preventDefault();
            // 新しいTodoItemをTodoListへ追加する
            this.#todoListModel.addTodo(new TodoItemModel({
                title: inputElement.value,
                completed: false
            }));
            // 入力欄を空文字列にしてリセットする
            inputElement.value = "";
        });
    }
}