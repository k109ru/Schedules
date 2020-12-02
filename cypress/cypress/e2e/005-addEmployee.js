import {adminOne, scheduleOne} from '../support/generate';

describe('management first schedule', () => {

    it('can add first employee', () => {
        cy.visit('/')
        cy.login(adminOne)
        cy.reload()
        cy.findByLabelText(/main_page_schedules/i)
        .click()
        cy.get(':nth-child(1) > .button > p')
        .click()
        cy.findByLabelText(/schedule_page_button_add_employee/i)
        .click()
        cy.get(':nth-child(1) > .parent-button > .button')
        .click()
        cy.findByLabelText(/schedule_modal_add_employee_close_button/i)
        .click()
        cy.wait(500)
        cy.findByLabelText(/main_page_logout/i)
        .click()
    })
})