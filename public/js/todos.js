var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoItem')
var todoButton = document.querySelector('#todoButton')
var categories = document.querySelector('#categories')
var dueDate = document.querySelector('#dueDate')


getTodos()

todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)

todoButton.addEventListener('click', addTodo)

function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function addTodo() {
    var todoTask = todoItem.value
    var categoryValue = categories.value
    var dueDateValue = dueDate.value

    if (categoryValue === 'none') {
        alert('You must choose a category')
    } else if (dueDateValue === '') {
        alert('You must enter a due date')
    } else if (todoTask === '') {
        alert('You must enter a task')
    } else {

    var body = {
        todo: todoTask,
        completed: false,
        category: categoryValue,
        due_date: dueDateValue
    }

    console.log(body)

    fetch('http://localhost:3000/api/v1/todos', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(showTodo)
}

    document.querySelector('#todoItem').value = ''
    document.querySelector('#dueDate').value = ''
    document.querySelector('#categories').value = 'none'
}

function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
    .then(response => response.json())
    .then(loopTodos)
}

function loopTodos(todos) {
    todosContainer.innerHTML = ''
    todos.forEach(showTodo)
}

function showTodo(todo) {
    var todoTemplate = `<li class="list-group-item">
                        <input type="checkbox" id="cbox1" value="first_checkbox"></input>
                        ${todo.todo}
                        <span class="badge badge-pill badge-primary" id="categoryBadge">${todo.category}</span>
                        <span class="badge badge-pill badge-success" id="dateBadge">${todo.due_date}    </span>
                    </li>`
    todosContainer.innerHTML = todoTemplate + todosContainer.innerHTML
}