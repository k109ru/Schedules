import {adminOne, userOne, userTwo} from '../support/generate';

describe('creating new users', () => {
    beforeEach(() => {
        cy.visit('/')
      })
    
    it('can add new users', () => {
        cy.login(adminOne) 
        cy.reload()
        cy.findByLabelText(/main_page_users/i)
        .click()
        cy.findByLabelText(/users_page_add_user_button/i)
        .click()
        cy.findByLabelText(/form_input_fullname_add_user/i)
        .type(userOne.name)
        cy.findByLabelText(/form_input_rateOfWork_add_user/i)
        .type(userOne.rateOfWork)
        cy.findByLabelText(/form_input_namePosition_add_user/i)
        .type(userOne.nameOfPosition)
        cy.findByLabelText(/add_user_form_button_add_user/i)
        .click()
        cy.wait(1000) 
        cy.findByLabelText(/form_input_fullname_add_user/i)
        .type(userTwo.name)
        cy.findByLabelText(/form_input_rateOfWork_add_user/i)
        .type(userTwo.rateOfWork)
        cy.findByLabelText(/form_input_namePosition_add_user/i)
        .type(userTwo.nameOfPosition)
        cy.findByLabelText(/add_user_form_button_add_user/i)
        .click()
        cy.wait(1000)
        cy.findByLabelText(/modal_close_button_add_user/i)
        .click()
        cy.findByLabelText(/main_page_logout/i)
        .click()
    }); 
})