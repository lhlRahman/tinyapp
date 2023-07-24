const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const tempVariables = {urls: urlDatabase};
  res.render("urls_index", tempVariables);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const templateVars = {
    id: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

const generateRandomString = function() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let finalString = "";
  for(let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    finalString += chars.charAt(randomIndex);
  }
  return finalString;
};


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});