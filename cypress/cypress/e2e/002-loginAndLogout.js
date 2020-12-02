import {adminOne} from '../support/generate';

describe('testing exist admin', () => {
    beforeEach(() => {
        cy.visit('/')
      })
    it('can make login and logout', () => {
      cy.findByLabelText(/main_page_signin/i)
      .click()
      cy.findByLabelText(/login_form_input_email/i)
      .type(adminOne.email)
      cy.findByLabelText(/login_form_input_password/i)
      .type(adminOne.password)
      cy.findByLabelText(/login_form_button/i)
      .click()
      cy.findByLabelText(/main_page_logout/i)
      .click() 
    })
})