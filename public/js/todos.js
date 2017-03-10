var todosContainer = document.querySelector('#todos')
var todoItem = document.querySelector('#todoItem')
var todoButton = document.querySelector('#todoButton')
var categories = document.querySelector('#categories')
var dueDate = document.querySelector('#dueDate')
var datePickerUI;



document.querySelector('body').addEventListener('click', function(e) {
    // console.log(e.target)
})


getTodos()

todoItem.addEventListener('keypress', handleKeyPressOnTodoItem)

todoButton.addEventListener('click', addTodo)


datePickerUI = new Pikaday(
    {
        field: document.querySelector('#dueDate'),
        firstDay: 1,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2020, 12, 31),
        yearRange: [2000,2020],
        onSelect: function() {
        }
    });    

    todosContainer.addEventListener('click', handleClickOnCheckbox)

function handleKeyPressOnTodoItem(e) {
    if (e.key === 'Enter') {
        addTodo()
    }
}

function handleClickOnCheckbox(e) {
    if (e.target.type === 'checkbox') {
        toggleTodoComplete(e.target.getAttribute('data-id'), e.target.checked)
    }
}

function toggleTodoComplete(todoId, isComplete) {

    if (isComplete) {
        fetch('/api/v1/todos/' + todoId + '/complete')
        .then(getTodos)
    } else {
        fetch('/api/v1/todos/' + todoId + '/incomplete')
        .then(getTodos)
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

    document.querySelector('#todoItem').value = ''
    document.querySelector('#dueDate').value = ''
    document.querySelector('#categories').value = 'none'
    }
}

function getTodos() {
    fetch('http://localhost:3000/api/v1/todos')
    .then(response => response.json())
    // .then(response => console.log(response))
    .then(loopTodos)
}

function loopTodos(todos) {
    console.log(todos)
    todosContainer.innerHTML = ''
    todos.forEach(showTodo)
}

function showTodo(todo) {
    var labelColor
    var isOlder
    var now = moment().format('MM/DD/YYYY')

     if (moment(todo.due_date).format('MM/DD/YYYY') > now) {
         isOlder = false
     } else {
         isOlder = true
     }


    switch(todo.category) {
        case 'Back-Burner':
            labelColor = 'label-info'
            break
        case 'Class':
            labelColor = 'label-success'
            break
        case 'Homework':
            labelColor = 'label-warning'
            break
        case 'Personal':
            labelColor = 'label-primary'
            break
        case 'Urgent':
            labelColor = 'label-danger'
            break
        default:
            labelColor = 'label-default'
    }

    


    var todoTemplate = `<li class="list-group-item">
                        <div class="row">
                            <div class="col-sm-6">
                                <input type="checkbox" data-id="${todo.id}" ${todo.completed === 'yes' ? 'checked' : ''}><span class="${todo.completed === 'yes' ? 'done' : ''}">${todo.todo}</span></input>
                            </div>
                            <div class="col-sm-6" style="text-align: right" data-id="${todo.id}">
                                <span class="label ${labelColor}">${todo.category}</span>
                                <span class="label ${isOlder ? 'label-danger' : 'label-success'}">${moment(todo.due_date).format('MM/DD/YYYY')}    </span>
                            </div>
                        </a>
                    </li>`



    todosContainer.innerHTML = todoTemplate + todosContainer.innerHTML;
}
