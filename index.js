const express = require('express')
const crypto = require('crypto');

const app = express();

app.use(express.json());

const port = 3001;

const USERS = [];
const TOKENS = {};
const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSIONS = [

]

app.post('/signup', function(req, res) {
  // Add logic to decode body
  
  // body should have email and password
  const { email, password} = req.body;

  if (!email ||!password){
    return res.status(400).json({ message: "Email and password are required"});
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if(!USERS.find(user => user.email === email)){
    USERS.push({email, password });
    return res.status(200).json({ message: "User registered successfully"});
  // return back 200 status code to the client
  } else {
    return res.status(400).json({message: "User already exists"});
  }
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if( !email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  const user = USERS.find(u => u.email === email);

  if(user && user.password === password){
      // If the password is the same, return back 200 status code to the client
      const token = crypto.randomBytes(16).toString("hex");
      TOKENS[token] = email;
      return res.status(200).json({ message: "User Exists", token });
  } else {
      // If the password is not the same, return back 401 status code to the client

    return res.status(401).json({ message: "Password Not Mached" });
  }


  // Also send back a token (any random string will do for now)
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
    res.status(200).json(QUESTIONS);
  

})

app.get("/submissions", function(req, res) {
   // return the users submissions for this problem
   const userEmail = req.query.email;

   if (userEmail) {
    const userSubmissions = SUBMISSIONS.filter(sub => sub.email === userEmail);
    return res.json(userSubmissions)
   }
  res.json(SUBMISSIONS);
});


app.post("/submissions", function(req, res) {
   // let the user submit a problem, randomly accept or reject the solution
   const { email, questionId, answer} = req.body;

   if (!email || !questionId || !answer){
    return res.status(400).json({ message: "All field are required" });
   }

   const isAccepted = Math.random() <0.5; // 50% chance

   // Store the submission in the SUBMISSION array above
   SUBMISSIONS.push({ email, questionId, answer, status: isAccepted ? "Accepted": "Rejected" });

   res.status(201).json({ message: `Submission ${isAccepted ? "Accepted": "Rejected"}`});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})