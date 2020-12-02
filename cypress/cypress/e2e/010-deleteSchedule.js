import {adminOne} from '../support/generate';

describe('deleting schedule', () => {
    beforeEach(() => {
        cy.visit('/')
      })
    it('can delete schedule', () => {
        cy.login(adminOne) 
        cy.reload()
        cy.findByLabelText(/main_page_schedules/i)
        .click()
        cy.get(':nth-child(1) > .button > p')
        .click()
        cy.findByLabelText(/schedule_page_button_delete_schedule/i)
        .click()
        cy.findByLabelText(/schedule_modal_yes_button/i)
        .click()
        cy.wait(500) 
        cy.findByLabelText(/main_page_logout/i)
        .click()
    }); 
})