const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let  password = req.body.password;

    if(!username || !password){
        return res.status(400).json({message: "Please provide username and password"});
    }
    else if(users[username]){
        return res.json({message: "User already exists"});
    }
    else{
        users.push({"username":username, "password":password});
        return res.send('User registered successfully');
    }
});

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    console.log(users);
    res.send(JSON.stringify(books,null, 4));
});
*/

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    new Promise((resolve, reject) => {
        res.send(JSON.stringify(books,null,4));
      }).then((successMessage) => {
        res.send(successMessage);
      }).catch((error) => {
        res.send(error);
      });
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let book = books[req.params.isbn]
  if(book){
    return res.status(200).send(JSON.stringify(book, null, 4));
  }
  else{
    return res.status(300).json({message: "Yet to be implemented"});
  }
 });
*/

// Get book details based on ISBN (Async)
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let book = books[req.params.isbn]

    if(book){
        new Promise((resolve, reject) =>{
            res.send(book)
        }).then((successMessage) =>{
            res.send(successMessage)
        }).catch((err) =>{
            res.send(err);
        })
    }
   });
/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;

    for(let key in books){
      if(books[key].author === author){
          return res.send(JSON.stringify(books[key], null, 4));
      }
  }
});
*/

// Get book details based on author (Async)
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;

    new Promise((resolve, reject) => {
        for(let key in books){
            if(books[key].author === author){
                return res.send(JSON.stringify(books[key], null, 4));
            }
        }
    }).then((successMessage) =>{
        res.send(successMessage)
    }).catch((err) =>{
        res.send(err);
    })
});

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;

    for(let key in books){
      if(books[key].title === title){
          return res.send("Book: "+ books[key].title + " By: "+ books[key].author);
      }
  }
});
*/

// Get all books based on title (Async)
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    new Promise((resolve, reject) => {
        for(let key in books){
            if(books[key].title === title){
                return res.send("Book: "+ books[key].title + " By: "+ books[key].author);
            }
        }
    }).then((successMessage) =>{
        res.send(successMessage)
    }).catch((err) =>{
        res.send(err);
    })
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if(book){
      return res.send("Book Review: "+ JSON.stringify(book.reviews, null, 2));
  }
});

module.exports.general = public_users;
