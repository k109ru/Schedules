import 'cross-fetch/polyfill';
import {prisma} from '../../prisma/generated/prisma/index';
import seedDatabase, {
  adminOne,
  adminTwo,
  userOne,
  userTwo,
  scheduleOne,
  scheduleTwo,
} from '../../tests/utils/seedDatabase';

beforeEach(seedDatabase);

test('Should create a new admin', async () => {
  const adminThree = {
    data: {
      name: 'Admin Three',
      email: '3@3.ru',
      password: 'Admin03!test',
    },
  };

  const response = await prisma.createAdmin({
    ...adminThree.data,
  });

  const exists = await prisma.$exists.admin({
    id: response.id,
  });

  expect(exists).toBe(true);
});

test('Should expose adminOne users and adminTwo users', async () => {
  const responseOne = await prisma.users({
    where: {
      owner: {
        id: adminOne.admin.id,
      },
    },
  });

  const responseTwo = await prisma.users({
    where: {
      owner: {
        id: adminTwo.admin.id,
      },
    },
  });

  //for adminOne
  expect(responseOne.length).toBe(1);
  expect(responseOne[0].id).toBe(userOne.user.id);
  expect(responseOne[0].fullname).toBe('User One');
  //for adminTwo
  expect(responseTwo.length).toBe(1);
  expect(responseTwo[0].id).toBe(userTwo.user.id);
  expect(responseTwo[0].fullname).toBe('User Two');
});

test('Should expose adminOne schedules and adminTwo schedules', async () => {
  const responseOne = await prisma.schedules({
    where: {
      owner: {
        id: adminOne.admin.id,
      },
    },
  });

  const responseTwo = await prisma.schedules({
    where: {
      owner: {
        id: adminTwo.admin.id,
      },
    },
  });

  //for adminOne
  expect(responseOne.length).toBe(1);
  expect(responseOne[0].id).toBe(scheduleOne.schedule.id);
  expect(responseOne[0].nameSchedule).toBe('scheduleOne');
  //for adminTwo
  expect(responseTwo.length).toBe(1);
  expect(responseTwo[0].id).toBe(scheduleTwo.schedule.id);
  expect(responseTwo[0].nameSchedule).toBe('scheduleTwo');
});

test('Should update adminOne profile', async () => {
  const dataForUpdate = {
    where: {
      id: adminOne.admin.id,
    },
    data: {
      name: 'User One Updated',
      email: 'updated@1.ru',
    },
  };

  const response = await prisma.updateAdmin(dataForUpdate);

  expect(response.name).toBe(dataForUpdate.data.name);
  expect(response.email).toBe(dataForUpdate.data.email);
});

test('Should delete adminOne', async () => {
  await prisma.deleteManySchedules({
    owner: {
      email: adminOne.admin.email,
    },
  });

  await prisma.deleteManyUsers({
    owner: {
      email: adminOne.admin.email,
    },
  });

  const response = await prisma.deleteAdmin({email: adminOne.admin.email});

  const exists = await prisma.$exists.admin({
    id: response.id,
  });

  expect(response.email).toBe(adminOne.admin.email);
  expect(exists).toBe(false);
});
