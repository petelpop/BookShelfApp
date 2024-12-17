const STORAGE_KEY = 'storage-key';
let books = [];

function loadBooksFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        books = data;
    }
}

function findBookById(bookId) {
    return books.find(book => book.id == bookId);
}

function findBookIndex(bookId) {
    return books.findIndex(book => book.id == bookId);
}

function saveBooksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

document.addEventListener('DOMContentLoaded', function () {
    loadBooksFromStorage();

    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');
    const bookToEdit = findBookById(bookId);

    if (!bookToEdit) {
        alert('Buku tidak ditemukan!');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('bookFormTitle').value = bookToEdit.title;
    document.getElementById('bookFormAuthor').value = bookToEdit.author;
    document.getElementById('bookFormYear').value = bookToEdit.year;
    document.getElementById('bookFormIsComplete').checked = bookToEdit.isComplete;

    const saveButton = document.getElementById('editBookForm');
    saveButton.addEventListener('click', function (event) {
        event.preventDefault(); 
        
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('id');
        const bookIndex = findBookIndex(bookId);

        console.log(bookIndex);
        
    
        if (bookIndex === -1) {
            alert('Buku tidak ditemukan!');
            window.location.href = 'index.html';
            return;
        }
    
        const bookToEdit = books[bookIndex];
    
        bookToEdit.title = document.getElementById('bookFormTitle').value;
        bookToEdit.author = document.getElementById('bookFormAuthor').value;
        bookToEdit.year = document.getElementById('bookFormYear').value;
        bookToEdit.isComplete = document.getElementById('bookFormIsComplete').checked;
        
        saveBooksToStorage();
        window.location.href = 'index.html';
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () {
          x.className = x.className.replace("show", "");
        }, 3000);
    });

    const cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});