import {adminOne, employeeTest} from '../support/generate';

describe('management first schedule', () => {

    it('can edit employees fields', () => {
        cy.visit('/')
        cy.login(adminOne)
        cy.reload()
        cy.findByLabelText(/main_page_schedules/i)
        .click()
        cy.get(':nth-child(1) > .button > p')
        .click()

        cy.findByLabelText(/schedule_page_button_select_all/i)
        .click()
        cy.findByLabelText(/schedule_page_button_edit_chosen_field/i)
        .click()

        cy.findByLabelText(/schedule_modal_params_work_firstStartWork/i)
        .type('{selectall}')
        .type('8.00')
        cy.findByLabelText(/schedule_modal_params_work_firstStopWork/i)
        .type('{selectall}')
        .type('16.00')
        cy.findByLabelText(/schedule_modal_submit_button/i)
        .click()

        cy.wait(500)
        cy.findByLabelText(/main_page_logout/i)
        .click()
    })
})