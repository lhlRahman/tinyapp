const getUserByEmail = function(registerEmail, users) {
  for (let userId in users) {
    if (users[userId].email === registerEmail) {
      return users[userId];
    }
  }
  return null;
};

const generateRandomString = function(urlDatabase) {
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

const idLookup = function(id, users) {
  for (let userId in users) {
    if (users[userId].id === id) {
      return users[userId];
    }
  }
  return null;
};

const urlsForUser = function(cookieID, urlDatabase) {
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

module.exports = { getUserByEmail, generateRandomString, idLookup, urlsForUser};