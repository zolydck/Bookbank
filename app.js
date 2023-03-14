const container = document.querySelector('.container');
let currentPage = 1;
let booksPerPage = 24;
let allBooks = [];
let filteredBooks = [];

function shuffleBooks(books) {
    for (let i = books.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [books[i], books[j]] = [books[j], books[i]];
    }
    return books;
  }
  
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    allBooks = shuffleBooks(data.books);
    filteredBooks = allBooks;
    showPage(1, filteredBooks);
    const bookId = window.location.search.substring(6);
    const book = data.books.find(b => b.id == bookId);
    document.querySelector('#buy-amazon').href = book.amazon;
    // Find the current book index
    const currentBookId = window.location.search.substring(6);
    const currentBookIndex = allBooks.findIndex(b => b.id == currentBookId);
    // Disable the previous button if the current book is the first book
    if(currentBookIndex === 0) {
        document.querySelector('#prev-book-btn').disabled = true;
    }
    // Disable the next button if the current book is the last book
    if(currentBookIndex === allBooks.length - 1) {
        document.querySelector('#next-book-btn').disabled = true;
    }
    // Add click event listener to the previous button
    document.querySelector('#prev-book-btn').addEventListener('click', () => {
        const prevBook = allBooks[currentBookIndex - 1];
        window.location.href = `book-details.html?book=${prevBook.id}`;
    });
    // Add click event listener to the next button
    document.querySelector('#next-book-btn').addEventListener('click', () => {
        const nextBook = allBooks[currentBookIndex + 1];
        window.location.href = `book-details.html?book=${nextBook.id}`;
    });
})
.catch(error => console.log(error));

const filterBooks = () => {
const ratingFilter = document.querySelector('#rating-filter').value;
filteredBooks = allBooks.filter(book => book.rating >= ratingFilter);
showPage(1, filteredBooks);
}

document.querySelector('#rating-filter').addEventListener('change', filterBooks);

const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const pageNumber = document.querySelector('#page-number');

prevBtn.addEventListener('click', () => {
showPage(currentPage - 1, filteredBooks);
});

nextBtn.addEventListener('click', () => {
showPage(currentPage + 1, filteredBooks);
});

const showPage = (page, books) => {
currentPage = page;
const start = (currentPage - 1) * booksPerPage;
const end = start + booksPerPage;
const booksToShow = books.slice(start, end);

container.innerHTML = '';

booksToShow.forEach(book => {
  const div = document.createElement('div');
  div.classList.add('col-4');
  const img = document.createElement('img');
  img.src = book.img;
  img.alt = book.title;
  img.width = "100";
  img.height = "100";
  img.addEventListener('click', function() {
    window.location.href = "book-details.html?book=" + book.id;
  });

  const title = document.createElement('p');
  title.innerText = `${book.title}`;

  const author = document.createElement('p');
  author.innerText = `${book.author}`;

  const rating = document.createElement('div');
  rating.classList.add('rating');
  for (let i = 0; i <5; i++) {
    const star = document.createElement('i');
    star.classList.add('fas', 'fa-star');
    if (i < book.rating) {
      star.classList.add('checked');
    }
    rating.appendChild(star);
  }

  div.appendChild(img);
  div.appendChild(title);
  div.appendChild(author);
  div.appendChild(rating);
  container.appendChild(div);
});

pageNumber.innerText = currentPage;

if (currentPage === 1) {
  prevBtn.disabled = true;
} else {
  prevBtn.disabled = false;
}

if (currentPage === Math.ceil(books.length / booksPerPage)) {
  nextBtn.disabled = true;
} else {
  nextBtn.disabled = false;
}
}
