import {v4 as uuidv4} from 'uuid';
import {adminOne} from './admins';

const templateOfUser = {
  id: '',
  fullname: '',
  owner: {
    name: adminOne.name,
    email: adminOne.email,
    __typename: 'Admin',
  },
  rateOfWork: 1,
  position: {
    namePosition: '',
    hoursOfWork: {
      startWork: '8.00',
      endWork: '15.42',
      __typename: 'WorkTime',
    },
    secondHoursOfWork: {
      startSecondWork: '0',
      endSecondWork: '0',
      __typename: 'SecondWorkTime',
    },
    lunch: {
      startLunch: '12.00',
      endLunch: '12.30',
      __typename: 'LunchTime',
    },
    secondLunch: {
      startSecondLunch: '0',
      endSecondLunch: '0',
      __typename: 'SecondLunchTime',
    },
    fulltime: true,
    longOfDay: '7.2',
    hoursOfMonth: null,
    __typename: 'Position',
  },
  __typename: 'User',
};

const userOne = {
  id: '5ec0f43de03dd80007ea39f0',
  fullname: 'userOne',
  owner: {
    name: adminOne.name,
    email: adminOne.email,
    __typename: 'Admin',
  },
  rateOfWork: 1,
  position: {
    namePosition: 'Doctor',
    hoursOfWork: {
      startWork: '8.00',
      endWork: '15.42',
      __typename: 'WorkTime',
    },
    secondHoursOfWork: {
      startSecondWork: '0',
      endSecondWork: '0',
      __typename: 'SecondWorkTime',
    },
    lunch: {
      startLunch: '12.00',
      endLunch: '12.30',
      __typename: 'LunchTime',
    },
    secondLunch: {
      startSecondLunch: '0',
      endSecondLunch: '0',
      __typename: 'SecondLunchTime',
    },
    fulltime: true,
    longOfDay: '7.2',
    hoursOfMonth: null,
    __typename: 'Position',
  },
  __typename: 'User',
};

const userTwo = {
  id: '5ec0f43de03dd80007ea39f1',
  fullname: 'userTwo',
  owner: {
    name: adminOne.name,
    email: adminOne.email,
    __typename: 'Admin',
  },
  rateOfWork: 1,
  position: {
    namePosition: 'Nurse',
    hoursOfWork: {
      startWork: '8.00',
      endWork: '15.42',
      __typename: 'WorkTime',
    },
    secondHoursOfWork: {
      startSecondWork: '0',
      endSecondWork: '0',
      __typename: 'SecondWorkTime',
    },
    lunch: {
      startLunch: '12.00',
      endLunch: '12.30',
      __typename: 'LunchTime',
    },
    secondLunch: {
      startSecondLunch: '0',
      endSecondLunch: '0',
      __typename: 'SecondLunchTime',
    },
    fulltime: true,
    longOfDay: '7.2',
    hoursOfMonth: null,
    __typename: 'Position',
  },
  __typename: 'User',
};

let usersDB = [userOne, userTwo];

function createUser(userData) {
  const newUser = templateOfUser;
  newUser.id = uuidv4();
  newUser.fullname = userData.fullname;
  newUser.position.namePosition = userData.namePosition;

  usersDB.push(newUser);

  return {
    id: newUser.id,
    __typename: 'User',
  };
}

function deleteUser(userData) {
  let index = usersDB.findIndex((user) => user.id === userData.id);

  usersDB.splice(index, 1);

  return {
    id: userData.id,
    __typename: 'User',
  };
}

function updateUser(userData) {
  let index = usersDB.findIndex((user) => user.id === userData.id);

  usersDB[index].fullname = userData.fullname;
  usersDB[index].position.namePosition = userData.position.namePosition;

  return {
    id: userData.id,
    __typename: 'User',
  };
}

function getAllUsers() {
  return usersDB;
}

function reset() {
  usersDB = [userOne, userTwo];
}

export {
  userOne,
  userTwo,
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  adminOne,
  reset,
};
