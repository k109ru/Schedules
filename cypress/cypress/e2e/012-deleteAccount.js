import {adminOne} from '../support/generate';

describe('deleting account', () => {
    beforeEach(() => {
        cy.visit('/')
      })
    it('can delete your current account ', () => {
        cy.login(adminOne) 
        cy.reload()
        cy.findByLabelText(/main_page_account/i)
        .click()
        cy.findByLabelText(/admin_page_delete_button/i)
        .click()
        cy.findByLabelText(/modal_password_input_delete_admin/i)
        .type(adminOne.password)
        cy.findByLabelText(/modal_button_yes_delete_admin/i)
        .click()
        cy.wait(1000) 
    }); 
})