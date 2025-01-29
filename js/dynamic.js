const counter = document.querySelector(".counter-wrapper");
const mainTitle = document.querySelector(".main-title");
const filterWrapper = document.querySelector(".filter-wrapper")
const todoListWrapper = document.querySelector(".todo-list-wrapper")

const height = window.innerHeight - ((counter.offsetHeight + mainTitle.offsetHeight + filterWrapper.offsetHeight + 20) );
console.log(todoListWrapper);

todoListWrapper.style.maxHeight = `${height}px`;
