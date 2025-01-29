const counter = document.querySelector(".counter-wrapper");
const mainTitle = document.querySelector(".main-title");
const filterWrapper = document.querySelector(".filter-wrapper")
const todoListWrapper = document.querySelector(".todo-list-wrapper")
const mainWrapper = document.querySelector(".main-wrapper")

const listSection = document.getElementById("list-section");
const formSection = document.getElementById("form-section");

const showAllTasksLink = document.getElementById("show-all-tasks")
const createTaskLink = document.getElementById("create-task")

const height = window.innerHeight - ((counter.offsetHeight + mainTitle.offsetHeight + filterWrapper.offsetHeight + 20) );

todoListWrapper.style.maxHeight = `${height}px`;
mainWrapper.style.height = `${window.innerHeight - counter.offsetHeight}px`;

showAllTasksLink.addEventListener("click", () => {
    listSection.style.display = "block";
    listSection.style.opacity = "1";
    formSection.style.display = "none";
    formSection.style.opacity = "0";
})

createTaskLink.addEventListener("click", () => {
    listSection.style.display = "none";
    listSection.style.opacity = "0";
    formSection.style.display = "block";
    formSection.style.opacity = "1";
})