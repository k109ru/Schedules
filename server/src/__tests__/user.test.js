import 'cross-fetch/polyfill';
import {prisma} from '../../prisma/generated/prisma/index';
import seedDatabase, {userOne, userTwo} from '../../tests/utils/seedDatabase';

beforeEach(seedDatabase);

test('Should create a new user for adminOne', async () => {
  const userThree = {
    data: {
      owner: {
        connect: {
          email: '1@1.ru',
        },
      },
      fullname: 'User Three',
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
  };

  const response = await prisma.createUser({
    ...userThree.data,
  });

  const exists = await prisma.$exists.user({
    id: response.id,
  });

  expect(exists).toBe(true);
});

test('Should expose userOne and userTwo profiles', async () => {
  const responseOne = await prisma.user({
    id: userOne.user.id,
  });

  const responseTwo = await prisma.user({
    id: userTwo.user.id,
  });

  //for userOne
  // expect(responseOne.length).toBe(1);
  expect(responseOne.id).toBe(userOne.user.id);
  expect(responseOne.fullname).toBe('User One');
  //for userTwo
  // expect(responseTwo.length).toBe(1);
  expect(responseTwo.id).toBe(userTwo.user.id);
  expect(responseTwo.fullname).toBe('User Two');
});

test('Should update userOne profile', async () => {
  const dataForUpdata = {
    where: {
      id: userOne.user.id,
    },
    data: {
      fullname: 'User One Updated',
      rateOfWork: 0.5,
      position: {
        update: {
          namePosition: 'Doctor Updated',
          hoursOfWork: {
            update: {
              startWork: '9.00',
              endWork: '17.00',
            },
          },
          fulltime: false,
          longOfDay: '8',
        },
      },
    },
  };

  const response = await prisma.updateUser(dataForUpdata);

  expect(response.fullname).toBe(dataForUpdata.data.fullname);
  expect(response.rateOfWork).toBe(dataForUpdata.data.rateOfWork);
  expect(response.position.hoursOfWork).toEqual(
    dataForUpdata.data.position.update.hoursOfWork.update,
  );
  expect(response.position.namePosition).toBe(
    dataForUpdata.data.position.update.namePosition,
  );
  expect(response.position.fulltime).toBeFalsy();
  expect(response.position.longOfDay).toBe(
    dataForUpdata.data.position.update.longOfDay,
  );
});

test('Should delete userOne', async () => {
  const response = await prisma.deleteUser({
    id: userOne.user.id,
  });

  const exists = await prisma.$exists.user({
    id: response.id,
  });

  expect(response.id).toBe(userOne.user.id);
  expect(exists).toBe(false);
});
