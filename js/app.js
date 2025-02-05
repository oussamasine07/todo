
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

const deleteBulk = document.getElementById("delete-bulk");
const deleteAllCheckbox = document.getElementById("delete-all");

const timerWrapper = document.getElementById("timer-wrapper")
const timerTaskName = document.getElementById("timer-task-name");

const setCustomPomodoroBtn = document.getElementById("set-custom-pomodoro")

const currentTaskName = document.getElementById("current-task-name")
const navTaskState = document.getElementById("nav-task-state")

currentTaskName.innerText = localStorage.getItem("currentTask") ? JSON.parse(localStorage.getItem("currentTask")).task.name : "No Task Selected";
navTaskState.innerText = localStorage.getItem("currentTask") ? JSON.parse(localStorage.getItem("currentTask")).state : "";




const submitTaskBtn = document.getElementById("submit-task-btn");

const customPomodoroBtns = document.getElementById("custom-pomodoro-btns");

let tasks = localStorage.getItem("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];

let taskState = "create";
let taskId = null;

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
    
    const priorities = [ "high", "meduim", "low" ]
    
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

    if ( nameEmpty != null ) {
        showError( e.target.dataset.errorId, nameEmpty.message );
    } else {
        if ( nameValid != null ) {
            showError( e.target.dataset.errorId, nameValid.message );
        }
    }
}

taskDateInput.addEventListener("blur", e => blurInputDateField(e))

const blurInputDateField = e => {
    let dateEmpty = isEmpty( taskDateInput );
    let dateValid = isValidDate( taskDateInput );
    
    if ( dateEmpty != null ) {
        showError( e.target.dataset.errorId, dateEmpty.message );
    } else {
        if ( dateValid != null ) {
            showError( e.target.dataset.errorId, dateValid.message );
        }
    }
}

taskDescriptionArea.addEventListener("blur", e => blurAreaDescriptionField(e));

const blurAreaDescriptionField = e => {
    
    let descriptionValid = isValidText( taskDescriptionArea );

    if ( descriptionValid != null ) {
        showError( e.target.dataset.errorId, descriptionValid.message );
    }
    
}


const validateAllFields = () => {
    let errors = []

    //make the validation 
    let nameEmpty = isEmpty( taskNameInput );
    let nameValid = isValidText( taskNameInput );
    let validPriority = isValidPriority( taskPrioritySelect )
    let dateEmpty = isEmpty( taskDateInput );
    let dateValid = isValidDate( taskDateInput );
    let descriptionValid = isValidText( taskDescriptionArea );

    if ( nameEmpty != null ) errors.push(nameEmpty)
    if ( nameValid != null ) errors.push(nameValid)
    if ( validPriority != null ) errors.push( validPriority ) 
    if ( dateEmpty != null ) errors.push(dateEmpty)
    if ( dateValid != null ) errors.push(dateValid)
    if ( descriptionValid != null ) errors.push(descriptionValid)
    
    return errors;
}

// create new task
createTaskForm.addEventListener("submit", ( e ) => submitCreateForm(e))

const submitCreateForm = ( e ) => {
    e.preventDefault();

    let errors = validateAllFields();
    
    if ( errors.length > 0 ) {
        errors.forEach(err => document.getElementById(err.inputIdError).innerText = err.message);
        return;
    }

    switch ( taskState ) {
        case "create":
            const newTask = {
                id: tasks.length > 0 ? tasks[ tasks.length - 1 ].id + 1 : 1,
                name: taskNameInput.value,
                priority: taskPrioritySelect.value,
                date: taskDateInput.value,
                description: taskDescriptionArea.value,
                isDone: false,
                cycleCounts: 0
            }
            
            tasks.push(newTask);
        
            localStorage.setItem("tasks", JSON.stringify(tasks));
        
            emptyAllFields();
        
            makeListElement( newTask )
            break;

        case "update":
            const updatedTask = {
                name: taskNameInput.value,
                priority: taskPrioritySelect.value,
                date: taskDateInput.value,
                description: taskDescriptionArea.value,
                isDone: false
            }

            tasks = tasks.map(task => task.id == taskId ? { ...task, ...updatedTask } : task);

            localStorage.setItem("tasks", JSON.stringify(tasks));
            emptyAllFields();
            taskState = "create";


            const spanClass = updatedTask.priority == "high" ? "inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-[#FB3640] ring-1 ring-inset ring-[#FB3640]" : updatedTask.priority == "meduim" ? "inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-yellow-300 ring-1 ring-inset ring-yellow-500" : "inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium text-blue-500 ring-1 ring-inset ring-blue-500";

            // update ui
            document.getElementById(`task-name-${ taskId }`).innerText = updatedTask.name;
            document.getElementById(`task-proirity-${ taskId }`).innerText = updatedTask.priority;
            document.getElementById(`task-proirity-${ taskId }`).className = spanClass;


            listSection.style.display = "block";
            listSection.style.opacity = "1";
            formSection.style.display = "none";
            formSection.style.opacity = "0";

            break;
    }

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
    div.className = "rounded-md bg-white px-4 py-4 my-1.5 grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-4";
    div.id = `task-${ task.id }`;
    
    div.innerHTML = `
        <div class="col-span-full md:col-span-5 flex items-center">
            <input data-id='${ task.id }' type="checkbox" id="list-item-2" class="task-checkbox bg-[#D9D9D9] border text-gray-900 text-sm rounded-lg block w-4 h-4 py-1 px-2 cursor-pointer">
            <a href="#" class="ml-3" id='task-name-${ task.id }'>${ task.name }</a>
        </div>

        <div class="col-span-full md:col-span-3 flex justify-center items-center">  
            <button class="bg-blue-300 border-2 border-blue-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-blue-500 text-blue-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer mx-3" data-task-id='${ task.id }' onclick="showPomodoro(event)">
                Set Pomodoro <i class="fa-solid fa-stopwatch"></i>
            </button>

            <span class="inline-flex items-center rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-slate-700" id='task-cycles-${ task.id }'>${ task.cycleCounts } Cycles</span>
        </div>

        <div class="col-span-1 md:col-span-2 flex justify-center items-center">
            <span class="inline-flex items-center rounded-md bg-transparent px-2 py-1 text-xs font-medium ${
                task.priority == "high" ? 'text-[#FB3640] ring-1 ring-inset ring-[#FB3640]' : task.priority == 'meduim' ? 'text-yellow-300 ring-1 ring-inset ring-yellow-500' : 'text-blue-500 ring-1 ring-inset ring-blue-500'
            } " id='task-proirity-${ task.id }'>${ task.priority }</span>
        </div>

        <div class="col-span-2 md:col-span-2 flex justify-end items-center" >
            <button class="bg-yellow-500 border-2 border-yellow-500 transition ease-in-out delay-150 hover:bg-transparent hover:text-yellow-500 text-blue-950 font-bold text-sm px-2 md:px-4 rounded-md cursor-pointer" onclick='editTask(${ task.id })'>
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="border-2 transition ease-in-out delay-150 text-green-950 font-bold text-sm ml-3 px-2 md:px-4 rounded-md ${task.isDone ? 'cursor-not-allowed bg-green-800 border-green-800' : 'cursor-pointer bg-green-500 border-green-500 hover:bg-transparent hover:text-green-500'}" onclick='setIsDone(event, ${ task.id })' ${task.isDone ? 'disabled' : ''}>
                <i class="fa-solid fa-check-double"></i>
            </button>
            <button class="bg-red-500 border-2 border-red-500 transition ease-in-out delay-150 hover:bg-transparent hover:text-red-500 text-blue-950 font-bold text-sm ml-3 px-2 md:px-4 rounded-md cursor-pointer" onclick='deleteTask(${ task.id })'>
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `

    tasksWrapper.appendChild(div);

}

const showTasksList = tasksList => tasksList.forEach(task => makeListElement( task ) )

showTasksList( tasks )

// UPDATE TASK
const editTask = id => {

    taskId = id;
    taskState = "update";

    // find the task in tasks list
    const {
        name,
        priority,
        date,
        description
    } = tasks.find( task => task.id == id);

    listSection.style.display = "none";
    listSection.style.opacity = "0";
    formSection.style.display = "block";
    formSection.style.opacity = "1";

    // show show the input field
    taskNameInput.value = name;
    taskPrioritySelect.value = priority;
    taskDateInput.value = date;
    taskDescriptionArea.value = description;

    submitTaskBtn.innerText = taskState;

}

// DELETE TASK
const deleteTask = id => {
    taskId = id;
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify( tasks ));

    document.getElementById(`task-${ id }`).remove();
    
}

deleteBulk.addEventListener("click", () => deleteManyTasks())

const deleteManyTasks = () => {
    const taskCheckboxes = document.querySelectorAll(".task-checkbox");
    
    taskCheckboxes.forEach(task => {
        if ( task.checked ) {
            const id = parseInt(task.dataset.id);
            deleteTask( id );
        }
    });
}

const setIsDone = (e, id) => {
    tasks = tasks.map(task => task.id == id ? { ...task, isDone: true } : task)
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // update the ui
    e.target.className = "border-2 transition ease-in-out delay-150 text-green-950 font-bold text-sm ml-3 px-2 md:px-4 rounded-md cursor-not-allowed bg-green-800 border-green-800"
}

deleteAllCheckbox.addEventListener("click", e => selectAllTasks( e ));

const selectAllTasks = e => {
    const taskCheckboxes = document.querySelectorAll(".task-checkbox");
    taskCheckboxes.forEach(task => task.checked = e.target.checked ? true : false );
}

// POMODORO
let currentTask = null;
const showPomodoro = e => {
    const id = parseInt( e.target.dataset.taskId );
    currentTask = tasks.find(task => task.id == id);
    timerTaskName.innerText = currentTask.name;
    // show time setter
    timerWrapper.classList.remove("hidden")
}

const closeTimerBox = document.getElementById("close-timer-box")

closeTimerBox.addEventListener("click", () => closePomodorBox())

const closePomodorBox = () => timerWrapper.classList.add("hidden")

let second = 5;
let pomodoroMinites; 
let pomodoroRemider;
let breakMinites; 
let breakReminder;
let setPomodoroTimer;
let setBreakTimer;

const setCustomPomodoro = () => {
    const pomoDuration = parseInt(document.getElementById("pomo-custom-minites").value);
    
    setPomoTime(pomoDuration)
}

const setPomoTime = pomoDuration => {
    pomodoroMinites = pomoDuration; 
    pomodoroRemider = pomoDuration; 
    breakMinites = parseInt(document.getElementById("break-mins").value)
    breakReminder = parseInt(document.getElementById("break-mins").value)
    
    setPomodoroTimer = setInterval(countPomodoro, 1000)

    const current = {
        task: currentTask,
        state: "doing"
    }

    currentTaskName.innerText = current.task.name;
    navTaskState.innerText = current.state;

    localStorage.setItem("currentTask", JSON.stringify(current))

    customPomodoroBtns.innerHTML = `
        <div class="col-span-full">
            <button onclick="clearPomodoro()" class="bg-yellow-300 border-2 border-yellow-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-yellow-500 text-yellow-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer w-full">
                Stop Pomodoro Timer <i class="fa-solid fa-circle-stop"></i>
            </button>
        </div>
    ` 

}

const countPomodoro = () => {
    second--;
    if (second <= 0) {
        second = 5;
        pomodoroMinites--;
    } 
    
    document.getElementById("nav-timer").innerText = `${String(pomodoroMinites).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    document.getElementById("box-timer").innerText = `${String(pomodoroMinites).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    
    if (pomodoroMinites === 0 && second === 1) {
        
        clearInterval(setPomodoroTimer)
        pomodoroMinites = pomodoroRemider
        setBreakTimer = setInterval(countBreak, 1000)

        const current = {
            task: currentTask,
            state: "break"
        }

        currentTaskName.innerText = current.task.name;
        navTaskState.innerText = current.state;
    
        localStorage.setItem("currentTask", JSON.stringify(current))

        tasks = tasks.map(task => task.id == current.task.id ? { ...task, cycleCounts: task.cycleCounts + 1 } : task)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        document.getElementById(`task-cycles-${ currentTask.id }`).innerText = `${currentTask.cycleCounts + 1} Cycles`
    }
    
}

const countBreak = () => {
    second--;
    if (second <= 0) {
        second = 5;
        breakMinites--;
    } 

    document.getElementById("nav-timer").innerText = `${String(breakMinites).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    document.getElementById("box-timer").innerText = `${String(breakMinites).padStart(2, '0')}:${String(second).padStart(2, '0')}`
    
    if (breakMinites === 0 && second === 1) {
        clearInterval(setBreakTimer)
        breakMinites = breakReminder
        setPomodoroTimer = setInterval(countPomodoro, 1000)
        const current = {
            task: currentTask,
            state: "doing"
        }

        currentTaskName.innerText = current.task.name;
        navTaskState.innerText = current.state;
        localStorage.setItem("currentTask", JSON.stringify(current))
    }
}

const navBtnTimer = document.getElementById("nav-btn-timer")
navBtnTimer.addEventListener("click", () => timerWrapper.classList.remove("hidden"))


customPomodoroBtns.innerHTML = localStorage.getItem("currentTask") ? `
    <div class="col-span-full">
        <button onclick="clearPomodoro()" class="bg-yellow-300 border-2 border-yellow-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-yellow-500 text-yellow-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer w-full">
            Stop Pomodoro Timer <i class="fa-solid fa-circle-stop"></i>
        </button>
    </div>
` 
: 
`
<div class="col-span-3 grid grid-cols-3 gap-2">
    <div class="col-span-full">
        <button id="set-default-timer" class="bg-blue-300 border-2 border-blue-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-blue-500 text-blue-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer w-full" onclick="setPomoTime(5)">
            Default 25 mins <i class="fa-solid fa-stopwatch"></i>
        </button>
    </div>
    <div class="col-span-full flex justify-center items-center">
        <div class="line w-20 h-0.5 bg-[#D9D9D9]"></div>
        <div class="mx-4 text-[#D9D9D9]">OR</div>
        <div class="line w-20 h-0.5 bg-[#D9D9D9]"></div>
    </div>
    <div class="col-span-full grid grid-cols-3 gap-2">
        <div class="col-span-2">
            <button id="set-custom-pomodoro" class="bg-blue-300 border-2 border-blue-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-blue-500 text-blue-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer w-full" onclick="setCustomPomodoro()">
                Set Custom <i class="fa-solid fa-pen"></i>
            </button>
        </div>
        <div class="col-span-1">
            <input type="text" class="w-full border border-[#d9d9d9] text-sm py-1 px-2 rounded-md" id="pomo-custom-minites" placeholder="how long" />
        </div>
    </div>
</div>

<div class="col-span-1">
    <select id="break-mins" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="5">short</option>
        <option value="15">long</option>
    </select>
</div>
`;

const clearPomodoro = () => {
    clearInterval(setPomodoroTimer)
    clearInterval(setBreakTimer)
    localStorage.removeItem("currentTask");
    customPomodoroBtns.innerHTML = `
        <div class="col-span-3 grid grid-cols-3 gap-2">
            <div class="col-span-full">
                <button id="set-default-timer" class="bg-blue-300 border-2 border-blue-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-blue-500 text-blue-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer w-full" onclick="setPomoTime(2)">
                    Default 25 mins <i class="fa-solid fa-stopwatch"></i>
                </button>
            </div>
            <div class="col-span-full flex justify-center items-center">
                <div class="line w-20 h-0.5 bg-[#D9D9D9]"></div>
                <div class="mx-4 text-[#D9D9D9]">OR</div>
                <div class="line w-20 h-0.5 bg-[#D9D9D9]"></div>
            </div>
            <div class="col-span-full grid grid-cols-3 gap-2">
                <div class="col-span-2">
                    <button id="set-custom-pomodoro" class="bg-blue-300 border-2 border-blue-300 transition ease-in-out delay-150 hover:bg-transparent hover:text-blue-500 text-blue-950 font-bold text-sm px-2 py-1 md:px-2 rounded-md cursor-pointer w-full">
                        Set Custom <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
                <div class="col-span-1">
                    <input type="text" class="w-full border border-[#d9d9d9] text-sm py-1 px-2 rounded-md" id="pomo-custom-minites" placeholder="how long" />
                </div>
            </div>
        </div>

        <div class="col-span-1">
            <select id="break-mins" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-1 px-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="5">short</option>
                <option value="15">long</option>
            </select>
        </div>
    `;
}
