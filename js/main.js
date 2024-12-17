const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'storage-key';
const RENDER_EVENT = 'render-event';
const books = [];

function isStorageExist() {
  if (typeof(Storage) != 'undefined') {
    return true;
  } else {
    alert('Browser anda tidak mendukung local storage');
    return false;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.getElementById('bookForm');
  submitForm.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });
});


function generateId() {
  return +new Date();
}

function clearForm() {
  document.getElementById('bookFormTitle').value = '';
  document.getElementById('bookFormAuthor').value = '';
  document.getElementById('bookFormYear').value = '';
  document.getElementById('bookFormIsComplete').checked = false;
}

function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const generatedId = generateId();
  const bookObject = generateBookObject(generatedId, title, author, parseInt(year), isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  clearForm();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

document.addEventListener(RENDER_EVENT, function(){
  const uncompletedBookList = document.getElementById('incompleteBookList');
  uncompletedBookList.innerHTML = '';

  const completedBookList = document.getElementById('completeBookList');
  completedBookList.innerHTML = '';
  
  for (const bookitem of books) {
    const bookElement = createBook(bookitem);
    if (!bookitem.isComplete) 
      uncompletedBookList.append(bookElement);
    else
      completedBookList.append(bookElement);
  }
});

function createBook(bookObject) {

const bookTitle = document.createElement('h3');
bookTitle.innerText = bookObject.title;
bookTitle.setAttribute('data-testid', 'bookItemTitle');

const bookAuthor = document.createElement('p');
bookAuthor.innerText = `Penulis: ${bookObject.author}`;
bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

const bookYear = document.createElement('p');
bookYear.innerText = `Tahun: ${bookObject.year}`;
bookYear.setAttribute('data-testid', 'bookItemYear');

const completeButton = document.createElement('button');
completeButton.innerText = 'Selesai dibaca';
completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');

const deleteButton = document.createElement('button');
deleteButton.innerText = 'Hapus Buku';
deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');

const editButton = document.createElement('button');
editButton.innerText = 'Edit Buku';
editButton.setAttribute('data-testid', 'bookItemEditButton');

const buttonContainer = document.createElement('div');
buttonContainer.append(completeButton, deleteButton, editButton);

const container = document.createElement('div');
container.setAttribute('data-bookid', bookObject.id);
container.setAttribute('data-testid', 'bookItem');
container.append(bookTitle, bookAuthor, bookYear, buttonContainer);

const completeBookList = document.getElementById('completeBookList');
completeBookList.append(container);

deleteButton.addEventListener('click', function () {
  removeBook(bookObject.id);
});

editButton.addEventListener('click', function() {
    window.location.href = `edit.html?id=${bookObject.id}`;
});

  if (bookObject.isComplete) {
    completeButton.innerText = 'Belum Selesai Dibaca';
    completeButton.addEventListener('click', function() {
      undoBookFromComplete(bookObject.id);
    });
  } else {
    completeButton.innerText = 'Selesai Dibaca';
    completeButton.addEventListener('click', function(){
      addBookToComplete(bookObject.id);
    });
  }

  return container;
}

function addBookToComplete(bookId) {
  const bookTarget = findBookId(bookId);
  
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookId(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function undoBookFromComplete(bookId) {
  const bookTarget = findBookId(bookId);

  if (bookTarget == null) return;
  
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if(books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if(data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function(){
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});


const searchInput = document.querySelector('#searchBookTitle');
const searchButton = document.querySelector('#searchSubmit');

function searchBooks() {
  const searchQuery = searchInput.value.toLowerCase(); 
  const bookArray = books;   

  const filteredBooks = bookArray.filter(book => 
      book.title.toLowerCase().includes(searchQuery) 
  );

  displayBooks(filteredBooks);
}

searchButton.addEventListener('click', function (event) {
  event.preventDefault(); 
  searchBooks(); 
});

function displayBooks(bookArray) {
  const uncompletedBookList = document.getElementById('incompleteBookList');
  const completedBookList = document.getElementById('completeBookList');
  
  uncompletedBookList.innerHTML = '';
  completedBookList.innerHTML = '';
  
  for (const book of bookArray) {
      const bookElement = createBook(book); 
      if (book.isComplete) {
          completedBookList.append(bookElement);
      } else {
          uncompletedBookList.append(bookElement);
      }
  }
}