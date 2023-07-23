const form = document.querySelector("#new-task-form");
const input = document.querySelector("#new-task-input");
const date = document.querySelector("#new-task-date");
const priority_el = document.querySelector("#new-task-priority");
const category_el = document.querySelector("#new-task-category");
const list_el = document.querySelector("#tasks");
const draggables = document.querySelector('.draggable');
const search = document.querySelector('#search');
let todos = [];

window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("todos"))||[]
  todos.map(item => createList(item))
  search.addEventListener('input', (e)=> searchTask(e));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    

    const task = input.value;
    const dueDate = date.value;
    if (task) {
      let task_obj = {
        completed: false,
        id: todos.length + 1,
        title: task,
        userId: 1,
        dueDate: dueDate,
        priority: priority_el.value,
        category:category_el.value
      };
      todos.push(task_obj);
      createList(task_obj);
      console.log(todos);
      localStorage.setItem("todos", JSON.stringify(todos));
    } else {
      alert("Please enter your task");
    }
  });
});

function createList(task) {
  const task_el = document.createElement("div");
  task_el.classList.add("task");
  const check = document.createElement("input");
  check.type = "checkbox";
  check.name = "name";
  check.checked = task.completed;

  const task_content_el = document.createElement("div");
  task_content_el.appendChild(check);
  task_content_el.classList.add("content");

  task_el.appendChild(task_content_el);

  const task_input_el = document.createElement("input");
  task_input_el.classList.add("text");
  task_input_el.type = "text";
  task_input_el.value = task.title;
  task_input_el.setAttribute("readonly", "readonly");
  task_content_el.appendChild(task_input_el);
  const task_date_el = document.createElement("input");

  task_date_el.classList.add("text");
  task_date_el.classList.add("date");
  task_date_el.type = "date";
  task_date_el.value = task.dueDate;
  task_date_el.setAttribute("readonly", "readonly");

  task_content_el.appendChild(task_date_el);

  const task_priority_el = document.createElement("select");
  

  const lowPriority = document.createElement("option");
  lowPriority.innerHTML = "Low";
  lowPriority.setAttribute("value", "1");
  task_priority_el.appendChild(lowPriority);

  const medPriority = document.createElement("option");
  medPriority.innerHTML = "Medium";
  medPriority.setAttribute("value", "2");
  task_priority_el.appendChild(medPriority);

  const highPriority = document.createElement("option");
  highPriority.innerHTML = "High";
  highPriority.setAttribute("value", "3");
  task_priority_el.appendChild(highPriority);

  task_priority_el.classList.add("text");
  task_priority_el.classList.add("priority");
  task_priority_el.value = task.priority;
  task_priority_el.setAttribute("disabled", "true");

  task_content_el.appendChild(task_priority_el);

  const task_category_el = document.createElement("select");
  

  const personal = document.createElement("option");
  personal.innerHTML = "Personal";
  personal.setAttribute("value", "1");
  task_category_el.appendChild(personal);

  const education = document.createElement("option");
  education.innerHTML = "Education";
  education.setAttribute("value", "2");
  task_category_el.appendChild(education);

  const business = document.createElement("option");
  business.innerHTML = "Business";
  business.setAttribute("value", "3");
  task_category_el.appendChild(business);

  task_category_el.classList.add("text");
  task_category_el.classList.add("priority");
  task_category_el.value = task.priority;
  task_category_el.setAttribute("disabled", "true");

  task_content_el.appendChild(task_category_el);

  const task_actions_el = document.createElement("div");
  task_actions_el.classList.add("actions");

  const task_edit_el = document.createElement("button");
  task_edit_el.classList.add("edit");
  task_edit_el.innerText = "Edit";

  if (task.completed) {
    task_input_el.style.textDecoration = "line-through";
    task_edit_el.style.display = "none";
  }

  const task_delete_el = document.createElement("button");
  task_delete_el.classList.add("delete");
  task_delete_el.innerText = "Delete";

  task_actions_el.appendChild(task_edit_el);
  task_actions_el.appendChild(task_delete_el);

  task_el.appendChild(task_actions_el);

  list_el.appendChild(task_el);

  input.value = "";
  date.value = null;

  task_edit_el.addEventListener("click", (e) => {
    if (task_edit_el.innerText.toLowerCase() == "edit") {
      task_edit_el.innerText = "Save";
      task_input_el.removeAttribute("readonly");
      task_date_el.removeAttribute("readonly");
      task_priority_el.removeAttribute("disabled", "true");
      task_category_el.removeAttribute("disabled", "true");
      task_input_el.focus();
    } else {
      task_edit_el.innerText = "Edit";
      task.title = task_input_el.value;
      task.dueDate = task_date_el.value;
	    task.priority = task_priority_el.value;
      task.category = task_category_el.value;
      task_input_el.setAttribute("readonly", "readonly");
	    task_priority_el.setAttribute("disabled", "true");
      task_category_el.setAttribute("disabled", "true");
      task_date_el.setAttribute("readonly", "readonly");
    }
    updateTask(task);
    console.log(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  });

  check.addEventListener("click", (e) => {
    task.completed = e.target.checked;
    if (e.target.checked) {
      task_input_el.style.textDecoration = "line-through";
      task_edit_el.style.display = "none";
    } else {
      task_input_el.style.textDecoration = "unset";
      task_edit_el.style.display = "block";
    }
    updateTask(task);
    console.log(todos);

    localStorage.setItem("todos", JSON.stringify(todos));
  });
  task_delete_el.addEventListener("click", (e) => {
    list_el.removeChild(task_el);
    todos = todos.filter((item) => item.id !== task.id);

    localStorage.setItem("todos", JSON.stringify(todos));
  });
}

function updateTask(task) {
  todos.forEach((item) => {
    console.log(item, task);
    if (task.id == item.id) {
      item = task;
    }
  });
}

function sort() {
	let sortType = document.getElementById('new-task-sort').value;
	console.log(sortType, todos)
	todos.sort((a, b) => a[sortType] - b[sortType])
	list_el.innerHTML = null;	
	todos.map(item => createList(item))
}

function filter() {
  let n = document.getElementById('new-task-filter').value;
  resetFilter();
	todos = todos.filter(item => item.priority == n)
	list_el.innerHTML = null;	
	todos.map(item => createList(item))
}

function resetFilter(){
  list_el.innerHTML = null;
  todos = JSON.parse(localStorage.getItem("todos"))||[]
  todos.map(item => createList(item))
} 

// draggables.forEach(draggable => {
//   draggable.addEventListener('dragstart', () => {
//     draggable.classList.add('dragging')
//   })

//   draggable.addEventListener('dragend', () => {
//     draggable.classList.remove('dragging')
//   })
// })

// list_el.forEach(lst => {
//   lst.addEventListener('dragover', e => {
//     e.preventDefault()
//     const afterElement = getDragAfterElement(lst, e.clientY)
//     const draggable = document.querySelector('.dragging')
//     if (afterElement == null) {
//       lst.appendChild(draggable)
//     } else {
//       lst.insertBefore(draggable, afterElement)
//     }
//   })
// })

// function getDragAfterElement(list_el, y) {
//   const draggableElements = [...list_el.querySelectorAll('.draggable:not(.dragging)')]

//   return draggableElements.reduce((closest, child) => {
//     const box = child.getBoundingClientRect()
//     const offset = y - box.top - box.height / 2
//     if (offset < 0 && offset > closest.offset) {
//       return { offset: offset, element: child }
//     } else {
//       return closest
//     }
//   }, { offset: Number.NEGATIVE_INFINITY }).element
// }

function searchTask(event){
  console.log(event.target.value);
  resetFilter();
  todos = todos.filter(item => item.title.includes(event.target.value));
  list_el.innerHTML = null;	
  todos.map(item => createList(item));
}
