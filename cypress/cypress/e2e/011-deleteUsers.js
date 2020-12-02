import {adminOne} from '../support/generate';

describe('deleting users', () => {
    beforeEach(() => {
        cy.visit('/')
      })
    it('can delete users', () => {
        cy.login(adminOne) 
        cy.reload()
        cy.findByLabelText(/main_page_users/i)
        .click()
        cy.findByLabelText(/users_page_delete_button_userOne/i)
        .click()
        cy.wait(1000)
        cy.findByLabelText(/modal_button_yes_delete_user/i)
        .click()
        cy.wait(1000) 
        cy.findByLabelText(/users_page_delete_button_userTwo/i)
        .click()
        cy.wait(1000)
        cy.findByLabelText(/modal_button_yes_delete_user/i)
        .click()
        cy.wait(1000) 
        cy.findByLabelText(/main_page_logout/i)
        .click()
    }); 
})