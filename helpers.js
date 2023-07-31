/**
 * Retrieves a user object based on their email.
 *
 * @param {string} registerEmail - The email to search for in the users database.
 * @param {object} users - The object representing the users database.
 * @returns {object|null} - The user object if found, or null if not found.
 */
const getUserByEmail = function(registerEmail, users) {
  for (let userId in users) {
    if (users[userId].email === registerEmail) {
      return users[userId];
    }
  }
  return null;
};

/**
 * Generates a random alphanumeric string of length 6 that is not already in the urlDatabase.
 *
 * @param {object} urlDatabase - The object representing the urlDatabase.
 * @returns {string} - The generated random string.
 */
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

/**
 * Retrieves a user object based on their id.
 *
 * @param {string} id - The id to search for in the users database.
 * @param {object} users - The object representing the users database.
 * @returns {object|null} - The user object if found, or null if not found.
 */
const idLookup = function(id, users) {
  for (let userId in users) {
    if (users[userId].id === id) {
      return users[userId];
    }
  }
  return null;
};

/**
 * Retrieves all URLs associated with a given cookieID from the urlDatabase.
 *
 * @param {string} cookieID - The id of the user's cookie.
 * @param {object} urlDatabase - The object representing the urlDatabase.
 * @returns {object} - An object containing the URLs associated with the given cookieID.
 */
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

module.exports = { getUserByEmail, generateRandomString, idLookup, urlsForUser };
