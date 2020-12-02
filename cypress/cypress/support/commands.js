// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Cypress.Commands.add('createUser', overrides => {
//     const admin = userBuilder(overrides)
//     return cy
//       .request({
//         url: 'http://localhost:3001/registration',
//         method: 'POST',
//         body: admin,
//       })
//       .then(({body}) => body.user)
//   })


  Cypress.Commands.add('login', admin => {
    return cy
      .request({
        url: 'http://schedules-server-local.k109.local:31009/login',
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `email=${admin.email}&password=${admin.password}`,
      }).then((body) => {
          sessionStorage.setItem('email', admin.email);
          sessionStorage.setItem('name', admin.username);
          sessionStorage.setItem('signedIn', true);
      })
  })