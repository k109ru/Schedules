// import hashPassowrd from '../utils/hashPassword';
import {prisma} from '../../prisma/generated/prisma/index';
import {postUpdatePasswordAdmin, postDeleteAdmin, postCreateDoc} from './admin';
import {
  buildRes,
  buildReq,
  getEmail,
  getPassword,
} from '../../tests/utils/ganerate';
import seedDatabase, {
  adminOne,
  scheduleOne,
} from '../../tests/utils/seedDatabase';

describe('Update password admin request testing', () => {
  beforeEach(seedDatabase);

  test('Should update adminOne password', async () => {
    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: adminOne.password,
        newpassword: 'Admin01!updated',
      },
    });

    const res = buildRes({
      cookie: jest.fn(() => res).mockName('cookie'),
    });

    await postUpdatePasswordAdmin(req, res);

    expect(res.status).not.toHaveBeenCalledWith(401);
    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      name: adminOne.admin.name,
    });
  });

  test('Should not update password with invalid admin email', async () => {
    const fakeEmail = getEmail();

    const req = buildReq({
      body: {
        email: fakeEmail,
      },
    });

    const res = buildRes();

    await postUpdatePasswordAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: `Could not find account: ${fakeEmail}`,
    });
  });

  test('Should not update password with invalid admin old password', async () => {
    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: getPassword(),
      },
    });

    const res = buildRes();

    await postUpdatePasswordAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: `Incorrect credentials`,
    });
  });
});

describe('Delete admin profile testing', () => {
  beforeEach(seedDatabase);

  test('Should delete adminOne profile', async () => {
    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: adminOne.password,
      },
    });

    const res = buildRes({
      cookie: jest.fn(() => res).mockName('cookie'),
    });

    await postDeleteAdmin(req, res);

    expect(res.status).not.toHaveBeenCalledWith(401);
    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      name: adminOne.admin.name,
    });
  });

  test('Should not delete admin with invalid admin email', async () => {
    const fakeEmail = getEmail();

    const req = buildReq({
      body: {
        email: fakeEmail,
      },
    });

    const res = buildRes();

    await postDeleteAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: `Could not find account: ${fakeEmail}`,
    });
  });

  test('Should not delete admin with invalid password', async () => {
    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: getPassword(),
      },
    });

    const res = buildRes();

    await postDeleteAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: `Incorrect credentials`,
    });
  });

  test('Should not delete admin with not correct execute prisma.deleteAdmin', async () => {
    const originalDeleteAdmin = prisma.deleteAdmin;

    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: adminOne.password,
      },
    });

    const res = buildRes({
      cookie: jest.fn(() => res).mockName('cookie'),
    });

    prisma.deleteAdmin = jest.fn().mockResolvedValue(false);

    await postDeleteAdmin(req, res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'null', {
      httpOnly: true,
    });
    expect(res.send).toHaveBeenCalledWith({
      success: false,
    });

    prisma.deleteAdmin = originalDeleteAdmin;
  });
});

describe('Create document testing', () => {
  beforeEach(seedDatabase);

  test('Should create document for scheduleOne', async () => {
    const req = buildReq({
      body: {
        idschedule: scheduleOne.schedule.id,
        owner: adminOne.admin.email,
        lang: 'en',
      },
    });

    const res = buildRes();

    await postCreateDoc(req, res);

    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      created: true,
    });
  });

  test('Should not create document with invalid schedule id', async () => {
    const fakeId = '1111d64fe03dd80007ff1111';

    const req = buildReq({
      body: {
        idschedule: fakeId,
      },
    });

    const res = buildRes();

    await postCreateDoc(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: `Could not find Schedule: ${fakeId}`,
    });
  });
});
