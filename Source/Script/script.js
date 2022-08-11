let $ = document;

////////////////////////////


// variables /////////////////////////
const body = $.body;
const todoContainer = $.querySelector(".todoContainer");
const inputElem = $.querySelector(".form-control");
const addTodoBtn = $.querySelector(".addTodoBtn");
const clearTodoListBtn = $.querySelector(".clearListBtn");
let todosArray = [];


// fucntions ////////////////////////

// to update the minheight of user browser
function liveUserScreenHeightUpdater() {
  let liveScreenHeight = visualViewport.height + "px";
  body.style.minHeight = liveScreenHeight;
}

// to focus on the input by pressing the Enter Btn on keyboard
function inputFocus(event) {
  if (event.key === "Enter") {
    inputElem.focus();
  }
}

// to validate that if Enter Btn is pressed or not
function keyValidation(event) {
  if (event.key === "Enter") {
    inputValidation();
  }
}

// to validate input value lenght and give access to creat a new todo
function inputValidation(event) {
  const allTodoTexts = $.querySelectorAll(".todoText");
  let isThisTodoExist = false;

  allTodoTexts.forEach(function (todoText) {
    if (todoText.innerHTML === inputElem.value.trim()) {
      isThisTodoExist = true;
    }
  });

  if (isThisTodoExist) {
    showAlert(".repeatedTodoAlert");
  } else if (
    inputElem.value.trim().length > 2 &&
    inputElem.value.trim().length < 30
  ) {
    addTodo();
  } else {
    showAlert(".inputValidationAlert");
  }
}

// to show alerts by adding stles to elements
function showAlert(alertClassName) {
  let alert = $.querySelector(alertClassName);
  alert.style.display = "block";
  setTimeout(function () {
    alert.style.transform = "translateX(0px)";
    alert.style.opacity = "1";
  }, 1);
  setTimeout(function () {
    alert.style.transform = "translateX(-400px)";
    alert.style.opacity = "0";
  }, 5001);
  setTimeout(function () {
    alert.style.display = "none";
  }, 5700);

  inputElem.value = "";
  inputElem.focus()
}

// to add new todo info to main todo array and call local fucntion
function addTodo() {
  newTodoInfo = {
    id: todosArray.length,
    content: inputElem.value,
    status: "false",
  };
  todosArray.push(newTodoInfo);

  setLocalstorage(todosArray);
  todoGenerate(todosArray);

  inputElem.value = "";
  inputElem.focus();
}

// to set the todos array on the local storage
function setLocalstorage(todosArray) {
  localStorage.setItem("todos", JSON.stringify(todosArray));
}

// to creat a template for todos and push it on the dom 
function todoGenerate(todoList) {
  todoContainer.innerHTML = "";

  todoList.forEach(function (todo) {
    let todoElem = $.createElement("div");
    let todoText = $.createElement("todoText");
    let deleteBtn = $.createElement("button");
    let trashIcon = $.createElement("i");
    let changeStatusBtn = $.createElement("button");
    let statusIcon = $.createElement("i");

    todoElem.className = "todo d-flex shadow mb-3";

    todoText.className = "todoText";
    todoText.innerHTML = todo.content;

    deleteBtn.className = "delete btn btn-danger";
    trashIcon.className = "fas fa-trash-can";
    deleteBtn.append(trashIcon);
    deleteBtn.setAttribute("onclick", "removeTodo(" + todo.id + ")");

    changeStatusBtn.className = "status btn btn-success me-2";
    changeStatusBtn.append(statusIcon);
    changeStatusBtn.setAttribute("onclick", "changeStatusBtn(" + todo.id + ")");

    if (todo.status) {
      statusIcon.className = "fas fa-check";
      todoText.classList.remove("done");
    } else {
      statusIcon.className = "fas fa-xmark";
      todoText.classList.add("done");
    }

    todoElem.append(todoText);
    todoElem.append(changeStatusBtn);
    todoElem.append(deleteBtn);

    todoContainer.append(todoElem);
  });
}

// to get todo infos from local storage
function getLocalStorage() {
  let localStorageInfos = JSON.parse(localStorage.getItem("todos"));

  if (localStorageInfos) {
    todosArray = localStorageInfos;
  } else {
    todosArray = [];
  }

  todoGenerate(todosArray);
}

// to remove all todos from local and dom by pressing on "clear all todos btn"
function removeAllTodos(event) {
  todosArray = [];

  todoContainer.innerHTML = "";

  localStorage.removeItem("todos");

  event.target.blur();
}

// to remove a specific todo from dom by clicking on trash icon
function removeTodo(todoId) {
  let localStorageInfos = JSON.parse(localStorage.getItem("todos"));
  todosArray = localStorageInfos;

  let selecetedTodoIndex = todosArray.findIndex(function (todo) {
    return todo.id === todoId;
  });

  todosArray.splice(selecetedTodoIndex, 1);

  setLocalstorage(todosArray);
  todoGenerate(todosArray);
}

// to change the todo status by clicking on status icon
function changeStatusBtn(todoId) {
  let localStorageInfos = JSON.parse(localStorage.getItem("todos"));
  todosArray = localStorageInfos;

  todosArray.forEach(function (todo) {
    if (todo.id === todoId) {
      todo.status = !todo.status;
    }
  });

  setLocalstorage(todosArray);
  todoGenerate(todosArray);
}

// eventListeners ///////////////////
setInterval(liveUserScreenHeightUpdater, 100);
window.addEventListener("load", getLocalStorage);
body.addEventListener("keydown", inputFocus);
inputElem.addEventListener("keydown", keyValidation);
addTodoBtn.addEventListener("click", inputValidation);
clearTodoListBtn.addEventListener("click", removeAllTodos);