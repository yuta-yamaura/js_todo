const taskInput = document.getElementById("new-task"); //new-task
const addButton = document.getElementsByTagName("button")[0]; //first button
const incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
const completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks

const todoItemCountElement = document.querySelector("#js-todo-count");

// 完了タスクの要素をhtmlから取得
const completedCountElement = document.querySelector("#completed-tasks").getElementsByTagName("li");

// 未完了タスクの要素をhtmlから取得
const incompletedCountElement = document.querySelector("#incomplete-tasks").getElementsByTagName("li");

// Todoアイテム数
let items = [];

//New Task List Item
const createNewTaskElement = function(taskString) {
    //Create List Item
    const listItem = document.createElement("li");

    //input (checkbox)
    const checkBox = document.createElement("input"); // checkbox
    //label
    const label = document.createElement("label");
    //input (text)
    const editInput = document.createElement("input"); // text コメントアウト対象
    //button.edit
    const editButton = document.createElement("button");
    //button.delete
    const deleteButton = document.createElement("button");

    //Each element needs modifying

    checkBox.type = "checkbox";
    editInput.type = "text";
    editButton.innerText = "編集";
    editButton.className = "edit";
    deleteButton.innerText = "削除";
    deleteButton.className = "delete";

    label.innerText = taskString;

    //Each element needs appending
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
}

//Add a new task
const addTask = function() {
    console.log("Add task...");

    // 表示されてるテキストを更新する
    todoItemCountElement.textContent = `全てのタスク： ${items.length + 1} 完了済み：${completedCountElement.length} 未完了：${incompletedCountElement.length + 1}`;

    //Create a new list item with the text from #new-task:
    const listItem = createNewTaskElement(taskInput.value);

    //全てのタスクに個数を追加
    items.push(listItem);
    //Append listItem to incompleteTasksHolder
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    // タスク入力欄を空にする
    taskInput.value = "";
}

//Edit an existing task
const editTask = function() {
    console.log("Edit task...");

    const listItem = this.parentNode;

    // editボタンとdeleteボタンを非表示
    const editButton = listItem.querySelector(".edit");
    const deleteButton = listItem.querySelector(".delete");
    editButton.style.display = "none";
    deleteButton.style.display = "none";

    // const editInput = listItem.querySelector("input[type=text");
    const label = listItem.querySelector("label");

    // editInputを非表示
    label.style.display = "none";

    const editInput = document.createElement("input"); // text コメントアウト対象
    editInput.type = "text"; //コメントアウト対象
    editInput.value = label.innerText;
    listItem.appendChild(editInput);

    const keepButton = document.createElement("button");
    keepButton.innerText = "保存";
    keepButton.className = "keep";
    listItem.appendChild(keepButton);

    keepButton.addEventListener('click', keepTask);
}

//Keep an existing task
const keepTask = function() {
    console.log("Keep task...");

    const listItem = this.parentNode;

    // editInputを取得
    const editInput = listItem.querySelector("input[type='text']");

    // labelを取得
    const label = listItem.querySelector("label");

    // 編集内容をlabelに反映
    label.innerText = editInput.value;

    // editInputとKeepボタンを削除
    listItem.removeChild(editInput);
    const keepButton = listItem.querySelector(".keep");
    listItem.removeChild(keepButton);


    // タスクとeditボタンとdeleteボタンを再表示
    label.style.display = "inline-block";
    const editButton = listItem.querySelector(".edit");
    const deleteButton = listItem.querySelector(".delete");
    editButton.style.display = "inline-block";
    deleteButton.style.display = "inline-block";
}

//Delete an existing task
const deleteTask = function() {
    console.log("Delete task...");
    let listItem = this.parentNode;
    let ul = listItem.parentNode;

    // 削除する前に確認のポップアップを表示
    let result = confirm("本当に削除してもよろしいですか？");
    if (result) {
        console.log("削除しました");
        //各タスクを集計用の配列から削除
        items.pop(listItem);
        //Remove the parent list item from the ul
        ul.removeChild(listItem);
        // 表示されてるテキストを更新する
        todoItemCountElement.textContent = `全てのタスク： ${items.length} 完了済み：${completedCountElement.length} 未完了：${incompletedCountElement.length}`;
    } else {
        console.log("キャンセルしました");
    }
}

//Mark a task as complete
const taskCompleted = function() {
    console.log("Task complete...");

    // 表示されてるテキストを更新する
    todoItemCountElement.textContent = `全てのタスク： ${items.length} 完了済み：${completedCountElement.length + 1} 未完了：${incompletedCountElement.length - 1}`;

    //Append the task list item to the #completed-tasks
    let listItem = this.parentNode;

    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
}

//Mark a task as incomplete
const taskIncomplete = function() {
    console.log("Task incomplete...");

    // 表示されてるテキストを更新する
    todoItemCountElement.textContent = `全てのタスク： ${items.length} 完了済み：${completedCountElement.length - 1} 未完了：${incompletedCountElement.length + 1}`;

    //Append the task list item to the #incomplete-tasks
    let listItem = this.parentNode;

    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
}

const bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    console.log("Bind list item events");
    //select taskListItem's children
    const checkBox = taskListItem.querySelector("input[type=checkbox]");
    const editButton = taskListItem.querySelector("button.edit");
    const deleteButton = taskListItem.querySelector("button.delete");

    //bind editTask to edit button
    editButton.onclick = editTask;

    //bind deleteTask to delete button
    deleteButton.onclick = deleteTask;

    //bind checkBoxEventHandler to checkbox
    checkBox.onchange = checkBoxEventHandler;
}

//Set the click handler to the addTask function
addButton.addEventListener("click", addTask);

//cycle over incompleteTasksHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    //bind events to list item's children (taskCompleted)
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

//cycle over completedTasksHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
    //bind events to list item's children (taskIncomplete)
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}