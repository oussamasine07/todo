// GET DOM ELEMENTS
const createTaskForm = document.getElementById("create-task-form")
const taskNameInput = document.getElementById("task-name")
const taskPrioritySelect = document.getElementById("task-priority-select")
const taskDateInput = document.getElementById("task-date")
const taskDescriptionArea = document.getElementById("task-description");

const taskNameErrorSpan = document.getElementById("error-task-name")
const taskPriorityErrorSpan = document.getElementById("error-task-priority")
const taskNameDateSpan = document.getElementById("error-task-date")
const taskDescriptionErrorSpan = document.getElementById("error-task-description")

const tasksWrapper = document.getElementById("list-tasks")

let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

// Validate forms
const isEmpty = field => field.value == "" ? {
        isError: true,
        message: `${field.dataset.fieldName} field is required`,
        inputIdError: field.dataset.errorId
} : null;

const isValidDate = field => {
    const regex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/

    return !regex.test( field.value ) ? {
        isError: true,
        message: `${field.dataset.fieldName} field is not a valid date`,
        inputIdError: field.dataset.errorId
    } : null;
}

const isValidText = field => {
    const regex = /^[a-zA-Z\s]+$/;

    return !regex.test( field.value ) ? {
        isError: true,
        message: `${field.dataset.fieldName} field is not a valid text`,
        inputIdError: field.dataset.errorId
    } : null;
}

const isValidPriority = field  => {
    const priorities = ["low", "high", "meduim"]
    
    return !priorities.includes( field.value ) ? {
        isError: true,
        message: `invalid priority`,
        inputIdError: field.dataset.errorId
    } : null;

}


const showError = ( elemId, message ) => document.getElementById( elemId ).innerText = message;

taskNameInput.addEventListener("blur", e => blurInputNameField(e) )

const blurInputNameField = e  => {
    
    let nameEmpty = isEmpty( taskNameInput );
    let nameValid = isValidText( taskNameInput );
    
    if ( nameEmpty.isError ) {
        showError( e.target.dataset.errorId, nameEmpty.message );
    } else {
        if ( nameValid.isError ) {
            showError( e.target.dataset.errorId, nameValid.message );
        }
    }
}

taskDateInput.addEventListener("blur", e => blurInputDateField(e))

const blurInputDateField = e => {
    let dateEmpty = isEmpty( taskDateInput );
    let dateValid = isValidText( taskDateInput );
    
    if ( dateEmpty.isError ) {
        showError( e.target.dataset.errorId, dateEmpty.message );
    } else {
        if ( dateValid.isError ) {
            showError( e.target.dataset.errorId, dateValid.message );
        }
    }
}

taskDescriptionArea.addEventListener("blur", e => blurAreaDescriptionField(e));

const blurAreaDescriptionField = e => {
    
    let descriptionValid = isValidText( taskDescriptionArea );

    if ( descriptionValid.isError ) {
        showError( e.target.dataset.errorId, descriptionValid.message );
    }
    
}

// create new task
createTaskForm.addEventListener("submit", ( e ) => submitCreateForm(e))

const submitCreateForm = ( e ) => {
    e.preventDefault();
    let errors = []

    //make the validation 
    let nameEmpty = isEmpty( taskNameInput );
    let nameValid = isValidText( taskNameInput );
    let validPriority = isValidPriority( taskPrioritySelect )
    let dateEmpty = isEmpty( taskDateInput );
    let dateValid = isValidDate( taskDateInput );
    let descriptionValid = isValidText( taskDescriptionArea );

    console.log( validPriority )

    if ( nameEmpty != null ) errors.push(nameEmpty)
    if ( nameValid != null ) errors.push(nameValid)
    if ( validPriority != null ) errors.push( validPriority ) 
    if ( dateEmpty != null ) errors.push(dateEmpty)
    if ( dateValid != null ) errors.push(dateValid)
    if ( descriptionValid != null ) errors.push(descriptionValid)
    
    if ( errors.length > 0 ) {
        errors.forEach(err => document.getElementById(err.inputIdError).innerText = err.message);
        return;
    }
    
    const newTask = {
        id: tasks.length > 0 ? tasks[ tasks.length - 1 ].id + 1 : 1,
        name: taskNameInput.value,
        priority: taskPrioritySelect.value,
        date: taskDateInput.value,
        description: taskDescriptionArea.value,
        isDone: false
    }
    
    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    emptyAllFields();


}

const emptyAllFields = () => {
    taskNameInput.value = "";
    taskPrioritySelect.value = "";
    taskDateInput.value = "";
    taskDescriptionArea.value = "";
}

// READ ALL TASKS
const makeListElement = task => {
    const div = document.createElement("div");
    className = "rounded-md bg-white px-4 py-4 my-1.5 grid grid-cols-12 md:gap-4";
    div.id = `task-${ task.id }`;
    div.innerHTML = `
        <div class="col-span-6 md:col-span-8 flex items-center">
            <input type="checkbox" id="list-item-1" class="bg-[#D9D9D9] border text-gray-900 text-sm rounded-lg block w-4 h-4 py-1 px-2 cursor-pointer">
            <a href="#" class="ml-3">${ task.name }</a>
        </div>

        <div class="col-span-3 md:col-span-2 flex justify-center items-center">
            <span class="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-[#FB3640] ring-1 ring-inset ring-[#FB3640]">${ task.priority }</span>
        </div>

        <div class="col-span-3 md:col-span-2 flex justify-end items-center" >
            <button class="bg-yellow-500 border-2 border-yellow-500 transition ease-in-out delay-150 hover:bg-transparent hover:text-yellow-500 text-blue-950 font-bold text-sm px-2 md:px-4 rounded-md " onclick='editTask(${task})'>
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="bg-red-500 border-2 border-red-500 transition ease-in-out delay-150 hover:bg-transparent hover:text-red-500 text-blue-950 font-bold text-sm ml-3 px-2 md:px-4 rounded-md" onclick='deleteTask(${ task })'>
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `

    tasksWrapper.appendChild(div);

}

const showTasksList = ( tasksList ) => {
    tasksList.forEach(task => makeListElement( task ) )
}

showTasksList( tasks )