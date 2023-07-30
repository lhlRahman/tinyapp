const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/logout", (req, res) => {
  res.clearCookie("userid");
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  const tempVariables = {
    email: req.cookies.userid ? users[req.cookies.userid].email : null,
  };
  res.render("urls_login", tempVariables);
});
  
app.post("/login", (req, res) => {
  const {loginEmail, loginPassword} = req.body;
  const loginCheck = userLookup(loginEmail);

  if (loginCheck && loginCheck.password === loginPassword) {
    res.cookie("userid", loginCheck.id);
    res.redirect("urls");
  } else {
    if (loginCheck) {
      res.status(403).send('Incorrect Password');
    } else {
      res.status(403).send('Incorrect Email Or Email Not Exist');
    }
  }

});

app.get("/register", (req, res) => {
  const tempVariables = {
    email: req.cookies.userid ? users[req.cookies.userid].email : null,
  };
  
  res.render("urls_register", tempVariables);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const tempVariables = {
    urls: urlDatabase,
    email: null,
  };

  const userId = req.cookies.userid;
  if (userId && users[userId]) {
    tempVariables.email = users[userId].email;
  }

  res.render("urls_index", tempVariables);
});



app.get("/urls/new", (req, res) => {
  const tempVariables = {
    email: req.cookies.userid ? users[req.cookies.userid].email : null,
    userid: req.cookies.userid
  };
  res.render("urls_new", tempVariables);
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const templateVars = {
    id: shortURL,
    longURL: urlDatabase[shortURL],
    email: null
  };

  const userId = req.cookies.userid;
  console.log(userId);
  if (userId && users[userId]) {
    templateVars.email = users[userId].email;
  }


  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const formattedURL = longURL && longURL.includes("https://") ? longURL : `https://${longURL}`;

  urlDatabase[shortURL] = formattedURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  res.redirect("/urls");
});

app.post("/register", (req, res) => {

  const {registerEmail, registerPassword} = req.body;
  const id = generateRandomString();
  if (registerEmail !== "" &&  registerPassword !== "" && userLookup(registerEmail) === null) {
    users[id] = {
      id,
      email: registerEmail,
      password: registerPassword};
    res.cookie("userid", id);
    res.redirect("/urls");
  } else {
    res.status(400).send('Email Already Exists or No Input For Email And/Or Password');
  }
});

app.post("/urls/:id", (req, res) => {
  const newURL = req.body.longURL;
  urlDatabase[req.params.id] = newURL.includes("https://") ? newURL : `https://${newURL}`;
  res.redirect(`/urls`);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

const generateRandomString = function() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let finalString = "";
  let isUnique = false;

  while (!isUnique) {
    finalString = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      finalString += chars.charAt(randomIndex);
    }

    if (!urlDatabase[finalString]) {
      isUnique = true;
    }
  }

  return finalString;
};

const userLookup = function(registerEmail) {
  for (let userId in users) {
    if (users[userId].email === registerEmail) {
      return users[userId];
    }
  }
  return null;
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});