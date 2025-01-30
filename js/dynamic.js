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

const sideBarBtn = document.getElementById("btn-menu");
const sideBar = document.getElementById("side-bar");
sideBarBtn.addEventListener("click", ( e ) => toggleSideBar(e))

const toggleSideBar = (e) => {
    const button = e.target.closest("button"); // Get the closest button element
    if (!button) return;
    
    if (sideBar.classList.contains("-left-full")) {
        sideBarBtn.classList.remove("bg-[#0D1321]")
        sideBarBtn.classList.add("bg-white")
        sideBarBtn.classList.remove("text-white")
        sideBarBtn.classList.add("text-[#0D1321]")
        sideBar.classList.remove("-left-full")
        sideBar.classList.add("left-0")
    } else {
        if (sideBar.classList.contains("left-0")) {
            sideBarBtn.classList.remove("bg-white")
            sideBarBtn.classList.add("bg-[#0D1321]")
            sideBarBtn.classList.remove("text-[#0D1321]")
            sideBarBtn.classList.add("text-white")
            sideBar.classList.remove("left-0")
            sideBar.classList.add("-left-full")
        }
    }
}