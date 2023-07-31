const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "123",
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
    email: null,
  };
  if (idLookup(req.cookies.userid) !== null) {
    tempVariables.email = users[req.cookies.userid].email;
    res.redirect("/urls");
  }
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
    email: null,
  };
  if (idLookup(req.cookies.userid) !== null) {
    tempVariables.email = req.cookies.userid;
    res.redirect("/urls");
  }
  
  res.render("urls_register", tempVariables);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/u/:id", (req, res) => {
  let longURL = null;
  if (urlDatabase[req.params.id]) {
    longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send('URL Not Found!');
  }
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const formattedURL = longURL && longURL.includes("https://") ? longURL : `https://${longURL}`;

  urlDatabase[shortURL] = {
    longURL: formattedURL,
    userID: req.cookies.userid,

  };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies.userid;
  const tempVariables = {
    urls: null,
    email: null,
  };
  if (userId && users[userId]) {
    tempVariables.urls = urlsForUser(userId);
    tempVariables.email = users[userId].email;
  }

  res.render("urls_index", tempVariables);
});



app.get("/urls/new", (req, res) => {
  const tempVariables = {
    email: null,
  };
  const userId = req.cookies.userid;
  if (!userId || !users[userId]) {
    res.redirect("/login");
  } else {
    tempVariables.email = users[userId].email;
    res.render("urls_new", tempVariables);
  }
});


app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies.userid;
  const shortURL = req.params.id;

  if (!userId || !users[userId]) {
    res.status(401).send("You need to be logged in to delete URLs.");
  } else if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found!");
  } else if (urlDatabase[shortURL].userID !== userId) {
    res.status(403).send("You do not have permission to delete this URL.");
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL] ? urlDatabase[shortURL].longURL : null;
  const userId = req.cookies.userid;
  const templateVars = {
    id: shortURL,
    longURL,
    email: null,
  };
  if (userId && users[userId]) {
    templateVars.email = users[userId].email;
  }

  if (longURL) {
    res.render("urls_show", templateVars);
  } else {
    res.status(404).send('URL Not Found!');
  }
});


app.post("/urls/:id", (req, res) => {
  const userId = req.cookies.userid;
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  
  if (!userId || !users[userId]) {
    res.status(401).send("You need to be logged in to edit URLs.");
  } else if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found!");
  } else if (urlDatabase[shortURL].userID !== userId) {
    res.status(403).send("You do not have permission to edit this URL.");
  } else {
    const formattedURL = longURL && longURL.includes("https://") ? longURL : `https://${longURL}`;
    urlDatabase[shortURL].longURL = formattedURL;
    res.redirect(`/urls`);
  }
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
  urlDatabase[req.params.id].longURL = newURL.includes("https://") ? newURL : `https://${newURL}`;
  res.redirect(`/urls`);
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

const idLookup = function(id) {
  for (let userId in users) {
    if (users[userId].id === id) {
      return users[userId];
    }
  }
  return null;
};

const urlsForUser = function(cookieID) {
  let urlsForUser = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === cookieID) {
      urlsForUser[url] = {
        longURL: urlDatabase[url].longURL,
        userID: urlDatabase[url].userID,
      };
    }
  }
  return urlsForUser;
};



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});