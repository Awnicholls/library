let library = [];
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const status = document.querySelector("#status");
const tableBody = document.querySelector("#book-table-body");
const books_total_count = document.querySelector("#books-count");
const read_count = document.querySelector("#read-b-count");
const not_read_count = document.querySelector("#not-read-b-count");
const form = document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  addBookToLibrary();
  render();
  clearForm();
  updateTotalBooks();
});

//data to auto-populate the table if the visitor is new
const DEFAULT_DATA = [
  { title: "The Lord of the Rings", author: "Tolkien", status: "read" },
  { title: "Alice in Wonderland", author: "Lewis Caroll", status: "not read" },
];

//selects the table, adds event listners to the delete and read/not read button
const $table = document
  .querySelector("table")
  .addEventListener("click", (e) => {
    const currentTarget = e.target.parentNode.parentNode.childNodes[1];
    if (e.target.innerHTML == "Delete") {
      if (confirm(`Are you sure you want to delete "${currentTarget.innerText}"?`))
        deleteBook(findBook(library, currentTarget.innerText));
    }
    if (e.target.classList.contains("status-button")) {
      changeStatus(findBook(library, currentTarget.innerText));
    }
    updateTotalBooks();
    updateLocalStorage();
    render();
  });



class Book {
  constructor(title, author, status) {
    this.title = title;
    this.author = author;
    this.status = status;
  }
}



// capitalize first letter of any string
String.prototype.capitalize = function () {
  return this.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(" ");
};


// checks that the fields aren't empty, and then adds the book to localstorage and the table
function addBookToLibrary() {
  if (title.value.length === 0 || author.value.length === 0) {
    alert("Please fill all the fields");
    return;
  }
  const newBook = new Book(
    title.value.capitalize(),
    author.value.capitalize(),
    status.value
  );
  library.push(newBook);
  updateLocalStorage();
}

function changeStatus(book) {
  if (library[book].status === "read") {
    library[book].status = "not read";
  } else library[book].status = "read";
}

function deleteBook(currentBook) {
  library.splice(currentBook, 1);
}

function findBook(libraryArray, title) {
  if (libraryArray.length === 0 || libraryArray === null) {
    return;
  }
  for (book of libraryArray)
    if (book.title === title) {
      return libraryArray.indexOf(book);
    }
}

function clearForm() {
  title.value = "";
  author.value = "";
}

function updateLocalStorage() {
  localStorage.setItem("library", JSON.stringify(library));
}

function checkLocalStorage() {
  if (localStorage.getItem("library")) {
    library = JSON.parse(localStorage.getItem("library"));
  } else {
    library = DEFAULT_DATA;
  }
}

function updateTotalBooks() {
  books_total_count.textContent = library.length;
  const status = "read";
  const count = library.reduce(
    (acc, cur) => (cur.status === status ? ++acc : acc),
    0
  );
  read_count.textContent = count;
  not_read_count.textContent = library.length - count;
}

//checks if the user is new or not, populates table based on this with either DEFAULT-DATA or local storage
function render() {
  checkLocalStorage();
  tableBody.innerHTML = "";
  library.forEach((book) => {
    const htmlBook = `
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="status-button ${book.status}">${book.status.capitalize()}</button></td>
        <td><button class="delete-button">Delete</button></td>
      </tr>
      `;
    tableBody.insertAdjacentHTML("afterbegin", htmlBook);
  });
  updateTotalBooks();
}

render();