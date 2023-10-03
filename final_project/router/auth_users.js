const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let validUser = users.find((user) => user.username === username);
    if(validUser){
        return true
    }else{
        return false
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let loginUser = users.find((user)=>{
        return (user.username === username && user.password === password)
    });
    //if user with given credentials is found
    if(loginUser){
        return true
    }
    else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let  password = req.body.password;

    if(!username || !password){
        return res.status(400).json({message: "Please provide username and password"});
    }
    else if(!isValid(username)){
        return res.status(401).json({message: "INVALID USERNAME"});
    }
    else if (authenticatedUser(username,password)) {
        const token = jwt.sign({username: username }, "secret_key");
            
        //Save the user's credentials in the session
        req.session.user = {
        username: username,
        token: token,
        };
            
        return res.status(200).json({ message: "Successfully logged in.", token: token });
    }else{
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.user.username;
    const isbn = req.params.isbn;
    const review = req.query.review;
    if (!review) {
      return res.status(400).json({message: "Please provide a review"});
    }
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      return res.json({message: "Review updated successfully"});
    }
    books[isbn].reviews[username] = review;
    return res.json({message: "Review added successfully"});
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.user.username;
  
    if (!username) {
      return res.status(401).json({message: "Unauthorized"});
    }
  
    if (!books[isbn]) {
      return res.status(400).json({message: "Invalid ISBN"});
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(400).json({message: "Review not found for the given ISBN and username"});
    }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
