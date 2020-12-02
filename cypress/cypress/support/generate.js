import {build, fake} from 'test-data-bot'


const userBuilder = build('User').fields({
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  })
  
  const adminOne = {
    username: 'adminOne',
    password: 'testPa$$word55',
    email: 'user_one@k109.ru',
  }

  const userOne = {
    name: 'userOne',
    rateOfWork: '1',
    nameOfPosition: 'testName'
  } 

  const userTwo = {
    name: 'userTwo',
    rateOfWork: 1,
    nameOfPosition: 'testName'
  }
  
  const scheduleOne = {
    nameOfSchedule: 'scheduleOne',
    titleOfTable: 'tableOne',
    amountOfWorkingHours: '150'
  }

  const employeeTest = {
    name: 'userThree'
  }
  
  export {userBuilder, adminOne, userOne, userTwo, scheduleOne, employeeTest}
