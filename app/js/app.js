const suggestions = document.querySelector('.suggestions');
const searchInput = document.querySelector('.search');
let search = '';

const heartFill = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>';

const characters = await getAllCharacters();

document.querySelector("li").style.display = 'none';

searchInput.addEventListener('input', onInput);

const paginationElement = document.getElementById('pagination');

let currentPage = 1;
let rows = 5;

async function getAllCharacters() {
    const maxId = 83;
    const characters = [];
    for (let id = 1; id <= maxId; id++) {
        const url = "https://swapi.dev/api/people/" + id;
        await axios.get(url)
            .then(res => {
                res.data.image = "https://starwars-visualguide.com/assets/img/characters/" + id + ".jpg";
                characters.push(res.data);
            })
            .catch(e => {
                console.log(e);
            })
    }
    return characters;
}

function onInput(event) {
    search = event.target.value;
    updateContent();
}

function updateContent() {

    const filteredСhars = filterData(characters);
    let currentPage = 1;
    displayList(filteredСhars, suggestions, rows, currentPage);
    setupPagination(filteredСhars, paginationElement, rows);

}

function filterData(characters) {
    const regex = new RegExp(search, 'i');
    let result = [];
    for (let character of characters) {
        if (regex.test(character.name)) {
            result.push(character)
        }
    }
    return result;
}

function highlightedName(name) {
    const regex = new RegExp(search, 'i')
    const newName = name.replace(regex, `<mark>${search}</mark>`);
    return `<span>${newName}</span>`
}


function displayList(characters, wrapper, rowsPerPage, page) {
    wrapper.innerHTML = "";
    page--;

    let loopStart = rowsPerPage * page;
    for (let i = loopStart; i < loopStart + rowsPerPage; i++) {
        if ((characters[i]) !== undefined) {
            let character = characters[i];

            const li = document.createElement("li");
            const image = document.createElement("img");
            const div = document.createElement("div");
            div.innerHTML = heartFill;
            div.classList.add("fav");
            image.classList.add("character-image");
            image.src = character.image;
            li.innerHTML = highlightedName(character.name);
            wrapper.appendChild(li);
            li.appendChild(div);
            li.appendChild(image);
        }
    }
    setListeners();
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

function setListeners(){
    const buttons = document.querySelectorAll(".fav");
    for (let button of buttons) {
        button.addEventListener('click', (e) => {
            let name = button.parentElement.innerText;
            let img = button.parentElement.lastElementChild.currentSrc;
            window.localStorage.setItem(name, img);
        });
    }
}


displayList(characters, suggestions, rows, currentPage);
setupPagination(characters, paginationElement, rows);

