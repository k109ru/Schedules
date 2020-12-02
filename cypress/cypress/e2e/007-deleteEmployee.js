import {adminOne, employeeTest} from '../support/generate';

describe('management first schedule', () => {

    it('can delete last emploee', () => {
        cy.visit('/')
        cy.login(adminOne)
        cy.reload()
        cy.findByLabelText(/main_page_schedules/i)
        .click()
        cy.get(':nth-child(1) > .button > p')
        .click()
        cy.findAllByLabelText(`schedule_page_button_delete_employee_${employeeTest.name}`)
        .first()
        .click()
        cy.wait(500)
        cy.findByLabelText(/main_page_logout/i)
        .click()
    })
})