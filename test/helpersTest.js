const { assert } = require("chai");

const { getUserByEmail } = require("../helpers");

const testUsers = {
  userID: {
    id: "userID",
    email: "user1@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2ID: {
    id: "user2ID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUserByEmail", function() {
  it("should return a user with valid email", function() {
    const user = getUserByEmail("user1@example.com", testUsers);
    const expectedUserID = "userID";
    assert.equal(user.id, expectedUserID); // Fix the assertion here
  });

  it("should return undefined with non-existent email", function() {
    const user = getUserByEmail("invalidEmail@example.com", testUsers);
    assert.isNull(user);
  });
});
