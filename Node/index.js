
require("dotenv").config();
//  frameworkexpress 
const express= require("express");
const mongoose = require("mongoose");
// database 
const database = require("./database/index");

// initializing express
const shapeAI= express();


// configuring server to use json obj data
shapeAI.use(express.json());

// database connection

mongoose.connect( process.env.MONGO_URL,

{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
)
.then(() => console.log("connection established!!!"));

/*
Route ---  /
desc       get all books
Access     PUBLIC 
Pramaters  None
Method     Get
*/
shapeAI.get("/", (req,res)=> {
    return res.json({
        books: database.books
    });
});

/*
Route ---  is
desc       get specifc book based on ISBN
Access     PUBLIC 
Pramaters  isbn
Method     Get
*/
shapeAI.get("/is/:isbn", (req,res) => {
    const getSpecificBook = database.books.filter((book)=> book.ISBN === req.params.isbn);

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook});
});

/*
Route ---  /category/ or /c
desc       get specific book by category 
Access     PUBLIC 
Pramaters  category
Method     Get
*/
shapeAI.get("/c/:category", (req,res) => {
    const getSpecificBooks = database.books.filter((book)=> book.category.includes(req.params.category));

    if(getSpecificBooks.length === 0){
        return res.json({error: `No book found for ${req.params.category}`});
    }

    return res.json({book: getSpecificBooks});
});

/*
Route ---  /author
desc       get all authors 
Access     PUBLIC 
Pramaters  author
Method     Get
*/
shapeAI.get("/author", (req,res)=> {
    return res.json({
        authors: database.authors
    });
});

/*
Route ---  /author
desc       get list of authors  based on book isbn
Access     PUBLIC 
Pramaters  isbn
Method     Get
*/

shapeAI.get("/author/:isbn", (req,res) => {
    const getSpecifiedAuthors = database.authors.filter(
        (author)=> author.books.includes (req.params.isbn)
    );

    if(getSpecifiedAuthors.length===0){
        return res.json({ error: `No author found for book ${req.params.isbn}`});
    }

    return res.json({author : getSpecifiedAuthors})
});

/*
Route ---  /publications
desc       get all publications 
Access     PUBLIC 
Pramaters  none
Method     Get
*/
shapeAI.get("/publications", (req,res)=> {
    return res.json({
        publications: database.publications
    });
});

/*
Route ---  /book/new
desc       add new books 
Access     PUBLIC 
Pramaters  none
Method     POST
*/
shapeAI.post("/book/new", (req,res)=> {
     const {newBook} = req.body;
     database.books.push(newBook);
     return res.json({books: database.books, message:"book was added!"});
});

/*
Route ---  /author/new
desc       add new authors
Access     PUBLIC 
Pramaters  none
Method     Post
*/

shapeAI.post("/author/new", (req,res)=> {
    const {newAuthor} = req.body;
    database.authors.push(newAuthor);
    return res.json({authors: database.authors, message:"author  was added!"});
});

// for updating title 
shapeAI.put("/book/update/:isbn", (req,res) => {
    database.books.forEach((book)=> {
      if(book.ISBN === req.params.isbn){
          book.title= req.body.bookTitle;
          return;
      }
    });

    return res.json({books: database.books});
});


shapeAI.put("/book/author/update/:isbn", (req,res) => {
    
    // updating database of book
    database.books.forEach((book)=> {
      if(book.ISBN === req.params.isbn){
          return book.authors.push(req.body.newAuthor);
      }
    });

    // updating database of author 
    database.authors.forEach((author)=> {
        if(author.id === req.body.newAuthor){
            return author.books.push(req.params.isbn);
        }
      });

    return res.json({books: database.books, authors : database.authors, message:"new author was added " });
});

/*
Route ---  /publication/update/book
desc       updatet /add new book to a publication
Access     PUBLIC 
Pramaters  isbn
Method     put
*/
shapeAI.put("/publication/update/book:isbn", (req,res) => {
    
    // updating database of publications
    database.publications.forEach((publication)=> {
      if(publication.id === req.body.pubId){
          return publications.books.push(req.params.isbn);
      }
    });

    // updating database of book 
    database.books.forEach((book)=> {
        if( book.ISBN === req.params.isbn){
           book.publication= req.body.pubId;
           return;
        }
      });

    return res.json({books: database.books, publications : database.publications, message:"successfully updated publication" });
});

/*
Route ---  /book/delete
desc       delete a book
Access     PUBLIC 
Pramaters  isbn
Method     DELETE
*/

shapeAI.delete("/book/delete/:isbn", (req,res) => {
     const updatedBookDatabase = database.books.filter(
         (book) => book.ISBN !== req.params.isbn
     );

     database.books = updatedBookDatabase;
     return res.json({ books: database.books});
});

/*
Route ---  /book/delete/author
desc       delete a author from a book
Access     PUBLIC 
Pramaters  isbn, author id
Method     DELETE
*/

shapeAI.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    // update book database foreach to modify only one elemnet
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
              (author) => author!== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }

    });

    database.authors.forEach((author) => {
        if(author.id === parseInt(req.params.authorId)){
            const newBookList = author.books.filter(
                (book) => book.ISBN !== req.params.isbn
            );

            author.books = newBookList;
            return;

        }
    });

    return res.json({
        books: database.books,
        authors: database.authors,

    })
});

/*
Route ---  /publication/delete/book
desc       delete a book from publication
Access     PUBLIC 
Pramaters  isbn, publication id
Method     DELETE
*/

shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req,res) => {

     // update publication  database 
      database.publications.forEach((publication) => {
         if(publication.id === parseInt(req.params.pubId)){
            const newBooksList = publication.books.filter(
                (book) => book != req.params.isbn
            );

            publication.books = newBooksList;
            return;

         }
      });

    // update book database here publication is not array
       database.books.forEach((book)=> {
          if(book.ISBN === req.params.isbn) {
              book.publication = 0;
              return;
          }

       });

       return res.json({books: database.books, publications: database.publications});
});




shapeAI.listen(3100, ()=> console.log(" server running"));
