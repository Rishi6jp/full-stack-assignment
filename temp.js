const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json);

let users = {};

app.post("/signup", function(req, res){
    const { username, email, password } = req.body;

    if(users[email]) {
        return res.status(400).json({ message: "User already exists" });
    }

    users[email] = { username, email, password }; 

    res.status(201).json({ message: "User registered successfully"});
})

app.listen(3000, () => console.log("Server running on port 3000"));
