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

let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

// Validate forms
const isEmpty = ( field ) => field.value == "" ? {
        isError: true,
        message: `${field.dataset.fieldName} field is required`,
        inputIdError: field.dataset.errorId
} : null;

const isValidDate = ( field ) => {
    const regex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/

    return !regex.test( field.value ) ? {
        isError: true,
        message: `${field.dataset.fieldName} field is not a valid date`,
        inputIdError: field.dataset.errorId
    } : null;
}

const isValidText = ( field ) => {
    const regex = /^[a-zA-Z\s]+$/;

    return !regex.test( field.value ) ? {
        isError: true,
        message: `${field.dataset.fieldName} field is not a valid text`,
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
    let dateEmpty = isEmpty( taskDateInput );
    let dateValid = isValidDate( taskDateInput );
    let descriptionValid = isValidText( taskDescriptionArea );

    if ( nameEmpty != null ) errors.push(nameEmpty)
    if ( nameValid != null ) errors.push(nameValid)
    if ( dateEmpty != null ) errors.push(dateEmpty)
    if ( dateValid != null ) errors.push(dateValid)
    if ( descriptionValid != null ) errors.push(descriptionValid)
    
    if ( errors.length > 0 ) {
        errors.forEach(err => {
            document.getElementById(err.inputIdError).innerText = err.message
        });
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