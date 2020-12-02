import {adminOne, scheduleOne} from '../support/generate';

describe('creating new schedule', () => {
    beforeEach(() => {
        cy.visit('/')
      })

    it('can add new schedule', () => {
        cy.login(adminOne)
        cy.reload()
        cy.findByLabelText(/main_page_schedules/i)
        .click()
        cy.get('.button--add').as('addScheduleBtn')
        cy.get('@addScheduleBtn').click()
        cy.findByLabelText(/add_schedule_feature_header_nameSchedule/i)
        .type(scheduleOne.nameOfSchedule)
        cy.findByLabelText(/add_schedule_feature_header_theader/i)
        .type(scheduleOne.titleOfTable)
        cy.findByLabelText(/add_schedule_feature_header_typeOfWeek/i) 
        .select('7.8')
        cy.findByLabelText(/add_schedule_feature_header_amountOfWorkingHours/i)
        .clear()
        .type(scheduleOne.amountOfWorkingHours)
        cy.findByLabelText(/add_schedule_button_add_schedule/i)
        .click()
        cy.findByLabelText(/main_page_logout/i)
        .click()
    })
})