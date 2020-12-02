import {adminOne} from '../support/generate';

describe('testing registration', () => {
    beforeEach(() => {
        cy.visit('/')
      })
    it('can make registration ---> logout', () => {
            cy.findByLabelText(/main_nav_button_eng_on/i)
            .click()
            cy.findByLabelText(/main_page_signup/i).click()
            cy.findAllByLabelText(/registration_form_button/i)
            .should('have.attr', 'disabled')
            cy.findByLabelText(/registration_form_input_name/i)
            .type(adminOne.username)
            cy.findByLabelText(/registration_form_input_email/i)
            .type(adminOne.email)
            cy.findByLabelText(/registration_form_input_password/i)
            .type(adminOne.password)
            cy.findByLabelText(/registration_form_input_confirm_password/i)
            .type(adminOne.password)
            cy.findByLabelText(/registration_form_button/i)
            .click()
            cy.wait(2000)
            cy.findByLabelText(/main_page_logout/i)
            .click() 
    })
})