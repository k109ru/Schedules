import {adminOne, employeeTest} from '../support/generate';

describe('management first schedule', () => {

    it('can edit last emploee', () => {
        cy.visit('/')
        cy.login(adminOne)
        cy.reload()
        cy.findByLabelText(/main_page_schedules/i)
        .click()
        cy.get(':nth-child(1) > .button > p')
        .click()
        cy.get('.schedule-tables__employee--edit').last()
        .click()
        cy.findByLabelText(/schedule_modal_edit_employee_field_fullname/i)
        .type('{selectall}')
        .type(employeeTest.name)
        cy.findByLabelText(/schedule_modal_edit_employee_field_hoursOfMonth/i)
        .type('{selectall}')
        .type('150')
        cy.findByLabelText(/schedule_modal_edit_employee_submit_button/i)
        .click()
        cy.wait(500)
        cy.findByLabelText(/main_page_logout/i)
        .click()
    })
})