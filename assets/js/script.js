const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
const pageContentEl = document.querySelector("#page-content");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksCompletedEl = document.querySelector("#tasks-completed");
const statusChoices = ["To Do", "In Progress", "Completed"];

let tasks = [];
let taskIdCounter = 0;

const taskFormHandler = function(event) {
  
  event.preventDefault();
  
  const taskNameInput = document.querySelector("input[name='task-name']").value;
  const taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
    }

    formEl.reset();

    const isEdit = formEl. hasAttribute("data-task-id");

    if (isEdit) {
      const taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
      const taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };     
  
      createTaskEl(taskDataObj);  
  ``}
};

const completeEditTask = function(taskName, taskType, taskId) {
  const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].taskType = taskType;
    }
  }

  saveTasks();

  alert("Task Updated!");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";

}


const createTaskActions = function(taskId) {
  const actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  const editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  const deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  const statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    let statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
}

const createTaskEl = function (taskDataObj) {

  // create list item
  const listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  const taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();

  const taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskIdCounter++;
};

const editTask = function(taskId) {
  const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  const taskName = taskSelected.querySelector("h3.task-name").textContent;
  const taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  
  formEl.setAttribute("data-task-id", taskId);
}

const deleteTask = function(taskId) {
  const taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  const updatedTaskArr = [];

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }  
  }
  
  taskSelected.remove();
  tasks = updatedTaskArr;
  saveTasks();
}

const taskButtonHandler = function(event) {

  const targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    editTask(taskId);
  } 

  else if (event.target.matches(".delete-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};


const taskStatusChangeHandler = function (event) {
  const taskId = event.target.getAttribute("data-task-id");
  const statusValue = event.target.value.toLowerCase();
  const taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected)
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  saveTasks();
}

const saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

const loadTasks = function() {

  // Gets task items from localStorage.
  // Converts tasks from the string format back into an array of objects.
  // Iterates through a tasks array and creates task elements on the page from it.

  let data = localStorage.getItem("tasks");
  taskIdCounter = 0;

  if (data) {
    
    tasks = JSON.parse(data);
    
    for(let i = 0; i < tasks.length; i++) {
      tasks[i].id = taskIdCounter;
      
      // create list item
      const listItemEl = document.createElement("li");
      listItemEl.className = "task-item";

      // add task id as a custom attribute
      listItemEl.setAttribute("data-task-id", tasks[i].id);
      
      // create div to hold task info and add to list item
      const taskInfoEl = document.createElement("div");
      taskInfoEl.className = "task-info";
      taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
      listItemEl.appendChild(taskInfoEl);

      // create the task actions for the list item
      const taskActionsEl = createTaskActions(tasks[i].id);
      listItemEl.appendChild(taskActionsEl);

      console.log(listItemEl);

      if (tasks[i].status === "to do") {
        listItemEl.querySelector("select[name='status-change']").value = statusChoices[0];
        tasksToDoEl.appendChild(listItemEl)
      }
      else if (tasks[i].status === "in progress") {
        listItemEl.querySelector("select[name='status-change']").value = statusChoices[1];
        tasksInProgressEl.appendChild(listItemEl);
      }
      else if (tasks[i].status === "completed") {
        listItemEl.querySelector("select[name='status-change']").value = statusChoices[2];
        tasksCompletedEl.appendChild(listItemEl);
      }
        taskIdCounter++;
      }
    }
    else {
      debugger;
      return false;
  }
}

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

// Currently starting 4.3.10


