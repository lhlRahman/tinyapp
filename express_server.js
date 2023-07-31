const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const { getUserByEmail, generateRandomString, idLookup, urlsForUser} = require("./helpers");
const cookieSession = require("cookie-session");
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"],
}));

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
  userID: {
    id: "userID",
    email: "user1@example.com",
    password: bcrypt.hashSync("123", 10),
  },
  user2ID: {
    id: "user2ID",
    email: "user2@example.com",
    password: bcrypt.hashSync("test", 10)
  },
};




app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.clearCookie("session.sig");
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  const tempVariables = {
    email: null,
  };

  if (idLookup(req.session.userid, users) !== null) {
    tempVariables.email = users[req.session.userid].email;
    res.redirect("/urls");
  }
  res.render("urls_login", tempVariables);
});
  
app.post("/login", (req, res) => {
  const {loginEmail, loginPassword} = req.body;
  const loginCheck = getUserByEmail(loginEmail, users);

  if (loginCheck && bcrypt.compareSync(loginPassword, loginCheck.password)) {
    req.session.userid = loginCheck.id;
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
  if (idLookup(req.session.userid, users) !== null) {
    tempVariables.email = req.session.userid;
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
  const shortURL = generateRandomString(urlDatabase);
  const formattedURL = longURL && longURL.includes("https://") ? longURL : `https://${longURL}`;

  if (longURL !== "") {
    urlDatabase[shortURL] = {
      longURL: formattedURL,
      userID: req.session.userid,
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(204).send("No Content, Make Sure You Type A URL Before Submitting!");
  }
});


app.get("/urls", (req, res) => {
  const userId = req.session.userid;
  const tempVariables = {
    urls: null,
    email: null,
  };
  if (userId && users[userId]) {
    tempVariables.urls = urlsForUser(userId, urlDatabase);
    tempVariables.email = users[userId].email;
  }

  res.render("urls_index", tempVariables);
});



app.get("/urls/new", (req, res) => {
  const tempVariables = {
    email: null,
  };
  const userId = req.session.userid;
  if (!userId || !users[userId]) {
    res.redirect("/login");
  } else {
    tempVariables.email = users[userId].email;
    res.render("urls_new", tempVariables);
  }
});


app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.userid;
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
  const userId = req.session.userid;
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
  const userId = req.session.userid;
  const shortURL = req.params.id;
  const longURL = req.body.longURL;

  if (!userId || !users[userId]) {
    res.status(401).send("You need to be logged in to edit URLs.");
  } else if (!urlDatabase[shortURL]) {
    res.status(404).send("URL not found!");
  } else if (urlDatabase[shortURL].userID !== userId) {
    res.status(403).send("You do not have permission to edit this URL.");
  } else {
    if (longURL !== "") {
      const formattedURL = longURL && longURL.includes("https://") ? longURL : `https://${longURL}`;
      urlDatabase[shortURL].longURL = formattedURL;
      res.redirect(`/urls`);
    } else {
      res.status(204).send("No Content, Make Sure You Type A URL Before Submitting!");
    }
  }
});


app.post("/login", (req, res) => {
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const {registerEmail, registerPassword} = req.body;
  const id = generateRandomString(urlDatabase);
  if (registerEmail !== "" &&  registerPassword !== "" && getUserByEmail(registerEmail, users) === null) {
    users[id] = {
      id,
      email: registerEmail,
      password: bcrypt.hashSync(registerPassword, 10)
    };
    req.session.userid = id;
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});