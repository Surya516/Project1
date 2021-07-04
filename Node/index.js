
require("dotenv").config();
//  frameworkexpress 
const express= require("express");
const mongoose = require("mongoose");


// database 
const database = require("./database/index");

//Models
const BookModels = require("./database/book");
const AuthorModels = require("./database/author");
const PublicationModels = require("./database/publication");
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");


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
shapeAI.get("/", async (req,res)=> {
    const getAllBooks = await BookModel.find()
    return res.json(getAllBooks);
});

/*
Route ---  is
desc       get specifc book based on ISBN
Access     PUBLIC 
Pramaters  isbn
Method     Get
*/
shapeAI.get("/is/:isbn", async (req,res) => {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

    if(!getSpecificBook){
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
shapeAI.get("/c/:category", async (req,res) => {
    const getSpecificBooks = await BookModel.findOne({category: req.params.category});

    if(!getSpecificBooks){
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
shapeAI.get("/author", async (req,res)=> {
    const getAllAuthors = await AuthorModel.find();
    return res.json({
        authors: getAllAuthors
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
     const addNewBook = BookModel.create(newBook);
     return res.json({ message:"book was added!"});
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
    AuthorModel.create(newAuthor);
    return res.json({ message:"author  was added!"});
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
