import 'cross-fetch/polyfill';
import {prisma} from '../../prisma/generated/prisma/index';
import seedDatabase, {
  scheduleOne,
  scheduleTwo,
  daysForSeed,
  daysForEmployeeSeed,
} from '../../tests/utils/seedDatabase';

beforeEach(seedDatabase);

test('Should create a new schedule for adminOne', async () => {
  const scheduleThree = {
    data: {
      nameSchedule: 'scheduleThree',
      owner: {
        connect: {
          email: '1@1.ru',
        },
      },
      year: 2020,
      amountOfWorkingHours: 166.0,
      typeOfWeek: 8.0,
      theader: 'test',
      month: {
        create: {
          nameOfMonth: 'June',
          daysAmount: 30,
          weekdays: {
            create: daysForSeed(30),
          },
          weekends: {
            create: daysForSeed(30),
          },
          holidays: {
            create: daysForSeed(30),
          },
          beforeHolidays: {
            create: daysForSeed(30),
          },
        },
      },
      employees: {
        create: [
          {
            fullname: 'User One',
            rateOfWork: 1.0,
            positionOfEmployee: {
              create: {
                namePosition: 'Doctor',
                hoursOfWork: {
                  create: {
                    startWork: '8.00',
                    endWork: '16.00',
                  },
                },
                fulltime: true,
                longOfDay: '7.2',
              },
            },
            daysOfEmployee: {
              create: daysForEmployeeSeed(30),
            },
          },
        ],
      },
    },
  };

  const response = await prisma.createSchedule({
    ...scheduleThree.data,
  });

  const exists = await prisma.$exists.schedule({
    id: response.id,
  });

  expect(exists).toBe(true);
});

test('Should expose scheduleOne and scheduleTwo profiles', async () => {
  const responseOne = await prisma.schedule({
    id: scheduleOne.schedule.id,
  });

  const responseTwo = await prisma.schedule({
    id: scheduleTwo.schedule.id,
  });

  //for userOne
  // expect(responseOne.length).toBe(1);
  expect(responseOne.id).toBe(scheduleOne.schedule.id);
  expect(responseOne.nameSchedule).toBe('scheduleOne');
  //for userTwo
  // expect(responseTwo.length).toBe(1);
  expect(responseTwo.id).toBe(scheduleTwo.schedule.id);
  expect(responseTwo.nameSchedule).toBe('scheduleTwo');
});

test('Should update scheduleOne profile', async () => {
  const dataForUpdata = {
    where: {
      id: scheduleOne.schedule.id,
    },
    data: {
      nameSchedule: 'scheduleOne updated',
      year: 2020,
      amountOfWorkingHours: 166.0,
      typeOfWeek: 8.0,
      theader: 'test updated',
    },
  };

  const response = await prisma.updateSchedule(dataForUpdata);

  expect(response.nameSchedule).toBe(dataForUpdata.data.nameSchedule);
  expect(response.theader).toBe(dataForUpdata.data.theader);
});

test('Should delete scheduleOne', async () => {
  const response = await prisma.deleteSchedule({
    id: scheduleOne.schedule.id,
  });

  const exists = await prisma.$exists.schedule({
    id: response.id,
  });

  expect(response.id).toBe(scheduleOne.schedule.id);
  expect(exists).toBe(false);
});
