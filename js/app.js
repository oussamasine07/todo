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

// Validate forms
const inputError = {
    isError: false,
    message: ""
}

const isEmpty = ( field ) => {
    if ( field.value == "" ) {
        inputError.isError = true;
        inputError.message = `${field.dataset.fieldName} field is required`;
    }

    return inputError;
}

const isValidDate = ( field ) => {
    const regexDate = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/

    if ( !regexDate.test( field.value ) ) {
        inputError.isError = true;
        inputError.message = `${field.dataset.fieldName} field is not a valid date`
    }

    return inputError;
}

const isValidText = ( field ) => {
    const regexText = /^[a-zA-Z\s]+$/;

    if ( !regexText.test( field.value ) ) {
        inputError.isError = true;
        inputError.message = `${field.dataset.fieldName} field is not a valid text`
    }

    return inputError;
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
    console.log(taskDateInput.value)
}