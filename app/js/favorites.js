const suggestions = document.querySelector('.suggestions');

document.querySelector("li").style.display = 'none';

const data = localStorage;

let characters = [];

const paginationElement = document.getElementById('pagination');

let currentPage = 1;
let rows = 5;

for (let item in data){
    if (item == "length") break;
    characters.push(item);
}

displayList(characters, suggestions, rows, currentPage);
setupPagination(characters, paginationElement, rows);

function displayList(characters, wrapper, rowsPerPage, page) {
    wrapper.innerHTML = "";
    page--;

    let loopStart = rowsPerPage * page;
    for (let i = loopStart; i < loopStart + rowsPerPage; i++) {
        if ((characters[i]) !== undefined) {
            let character = characters[i];

            const li = document.createElement("li");
            const image = document.createElement("img");
            image.classList.add("character-image");
            image.src = data[character];
            li.innerHTML = character;
            wrapper.appendChild(li);
            li.appendChild(image);
        }
    }
}

function setupPagination(items, wrapper, rowsPerPage) {
    wrapper.innerHTML = "";

    let pageCount = Math.ceil(items.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
    }
}

function paginationButton(page, items) {
    let button = document.createElement('button');
    button.innerText = page;

    if (currentPage == page) button.classList.add('active');

    button.addEventListener('click', function () {
        currentPage = page;
        displayList(items, suggestions, rows, currentPage);

        let current_btn = document.querySelector('.pagenumbers button.active');
        current_btn.classList.remove('active');

        button.classList.add('active');
    });

    return button;
}
