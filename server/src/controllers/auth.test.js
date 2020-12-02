import {postRegistration, postLogin, getLogout} from './auth';
import {
  buildRes,
  buildReq,
  getEmail,
  getPassword,
} from '../../tests/utils/ganerate';
import seedDatabase, {adminOne} from '../../tests/utils/seedDatabase';

describe('Registration testing', () => {
  beforeEach(seedDatabase);

  test('Should create new admin "adminThree"', async () => {
    const body = {
      email: getEmail(),
      password: getPassword(),
      fullname: 'adminThree',
    };

    const req = buildReq({body});

    const res = buildRes({
      cookie: jest.fn(() => res).mockName('cookie'),
    });

    await postRegistration(req, res);

    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      create: true,
      message: `Admin ${body.email} is created`,
    });
  });

  test('Should not create new admin, email exists already (trying adminOne email)', async () => {
    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: getPassword(),
        fullname: 'adminThree',
      },
    });

    const res = buildRes();

    await postRegistration(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      create: false,
      message: `Admin with account exists already: ${adminOne.admin.email}`,
    });
  });
});

describe('Login testing', () => {
  beforeEach(seedDatabase);

  test('Should login with right credentials adminOne', async () => {
    const req = buildReq({
      body: {
        email: adminOne.admin.email,
        password: adminOne.password,
      },
    });

    const res = buildRes({
      cookie: jest.fn(() => res).mockName('cookie'),
    });

    await postLogin(req, res);

    expect(res.status).not.toHaveBeenCalledWith(401);
    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({
      success: true,
      name: adminOne.admin.name,
    });
  });

  test('Should not login with wrong email', async () => {
    const body = {
      email: getEmail(),
      password: adminOne.password,
    };

    const req = buildReq({body});
    const res = buildRes();

    await postLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: `Could not find account: ${body.email}`,
    });
  });

  test('Should not login with wrong password', async () => {
    const body = {
      email: adminOne.admin.email,
      password: getPassword(),
    };

    const req = buildReq({body});
    const res = buildRes();

    await postLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      success: false,
      message: 'Incorrect credentials',
    });
  });
});

describe('Logout testing', () => {
  beforeEach(seedDatabase);

  test('Should logout adminOne', async () => {
    const req = buildReq();
    const res = buildRes({
      cookie: jest.fn(() => res).mockName('cookie'),
    });

    await getLogout(req, res);

    expect(res.cookie).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith('jwt', 'null', {
      httpOnly: true,
    });
    expect(res.send).toHaveBeenCalledWith({
      success: true,
    });
  });
});
