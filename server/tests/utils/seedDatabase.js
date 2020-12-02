import {prisma} from '../../prisma/generated/prisma/index';
import bcrypt from 'bcryptjs';
// import generateToken from '../utils/generateToken';
// import hashPassword from '../utils/hashPassword';

const daysForSeed = (numOfDays) => {
  let emptyArray = [...Array(numOfDays).keys()];
  let arrayOfDays = emptyArray.map((item, index) => {
    return {
      num: index + 1,
      id: `${index + 1}`,
      isChecked: false,
    };
  });

  // console.log(emptyArray);
  return arrayOfDays;
};

const daysForEmployeeSeed = (numberOfDays) => {
  let emptyArray = [...Array(numberOfDays).keys()];
  let arrayOfDays = emptyArray.map((item, index) => {
    return {
      number: index + 1,
      weekday: true,
      weekend: false,
      holiday: false,
      beforeHoliday: false,
      firstStartWork: '8.00',
      firstStopWork: '16.00',
      secondStartWork: '0',
      secondStopWork: '0',
      kind: {
        create: {
          businessTrip: false,
          study: false,
          studyAdd: false,
          unknown: false,
          absenteeism: false,
          goverment: false,
          holiday: false,
          disease: false,
          vacation: false,
          childCare: false,
          admVacation: false,
          overTime: false,
          nightTime: false,
          working: true,
        },
      },
    };
  });

  // console.log(emptyArray);
  return arrayOfDays;
};
// console.log(daysForEmployeeSeed(30))
// console.log(daysForSeed(30));
//
const adminOne = {
  input: {
    name: 'Admin One',
    email: '1@1.ru',
    password: bcrypt.hashSync('Admin01!test', 12),
  },
  admin: undefined,
  password: 'Admin01!test',
};

const adminTwo = {
  input: {
    name: 'Admin Two',
    email: '2@2.ru',
    password: bcrypt.hashSync('Admin02!test', 12),
  },
  admin: undefined,
  password: 'Admin02!test',
};

const userOne = {
  input: {
    owner: {
      connect: {
        email: '1@1.ru',
      },
    },
    fullname: 'User One',
    rateOfWork: 1.0,
    position: {
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
  },
  user: undefined,
};

const userTwo = {
  input: {
    owner: {
      connect: {
        email: '2@2.ru',
      },
    },
    fullname: 'User Two',
    rateOfWork: 1.0,
    position: {
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
  },
  user: undefined,
};

const scheduleOne = {
  input: {
    nameSchedule: 'scheduleOne',
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
              lunch: {
                create: {
                  startLunch: '12.00',
                  endLunch: '12.30',
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
  schedule: undefined,
};

const scheduleTwo = {
  input: {
    nameSchedule: 'scheduleTwo',
    owner: {
      connect: {
        email: '2@2.ru',
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
          fullname: 'User Two',
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
  schedule: undefined,
};

// const scheduleTwo = {

// };

const seedDatabase = async () => {
  //Delete test data
  await prisma.deleteManySchedules();
  await prisma.deleteManyUsers();
  await prisma.deleteManyAdmins();

  // console.log(process.env.PRISMA_ENDPOINT);
  //Create data
  adminOne.admin = await prisma.createAdmin({
    ...adminOne.input,
  });

  adminTwo.admin = await prisma.createAdmin({
    ...adminTwo.input,
  });

  userOne.user = await prisma.createUser({
    ...userOne.input,
  });

  // console.log(userOne.user)

  userTwo.user = await prisma.createUser({
    ...userTwo.input,
  });

  scheduleOne.schedule = await prisma.createSchedule({
    ...scheduleOne.input,
  });

  scheduleTwo.schedule = await prisma.createSchedule({
    ...scheduleTwo.input,
  });
};

export {
  seedDatabase as default,
  adminOne,
  adminTwo,
  userOne,
  userTwo,
  scheduleOne,
  scheduleTwo,
  daysForSeed,
  daysForEmployeeSeed,
};
