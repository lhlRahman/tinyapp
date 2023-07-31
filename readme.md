# TinyApp Project

TinyApp is a full-stack web application built with Node.js and Express that allows users to shorten long URLs. It provides a simple and user-friendly interface for creating and managing short URLs, making it easier to share and access links.

## Final Product

![Login Page](docs/login.JPG)
![Register Page](docs/register.JPG)
![Created URLs Page](docs/urls.JPG)

## Dependencies

- [bcryptjs](https://www.npmjs.com/package/bcryptjs): A library to hash passwords securely.
- [cookie-session](https://www.npmjs.com/package/cookie-session): Middleware to handle cookie-based user sessions.
- [Express](https://expressjs.com/): A fast, unopinionated, minimalist web framework for Node.js.
- [EJS](https://ejs.co/): A simple templating engine for embedding JavaScript into HTML templates.
- [Node.js](https://nodejs.org/): An open-source, cross-platform JavaScript runtime environment.
- [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai) (for test cases): Testing frameworks to write and execute tests.

## Getting Started

To get started with the TinyApp project:

1. Clone this repository to your local machine using `git clone https://github.com/your-username/tinyapp.git`.
2. Install all dependencies by running `npm install` in the project's root directory.
3. Start the development web server with the command `npm start`.
4. You can run existing tests with `npm test` and add your own tests in the `tests` directory.
5. Open your web browser and go to `http://localhost:8080` to access the TinyApp application.
6. If you're a new user, click on "Register" to create an account and then log in.
7. Once logged in, you can shorten long URLs by clicking on "Create New URL".
8. Manage your shortened URLs on the "My URLs" page, where you can edit or delete them as needed.
9. Enjoy the convenience of TinyApp as you share and access your shortened URLs!
