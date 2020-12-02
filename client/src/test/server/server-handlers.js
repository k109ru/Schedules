import {rest, graphql} from 'msw';
import {parse} from 'querystring';
import * as adminsDB from '../data/admins';
import {createUser, getAllUsers, deleteUser, updateUser} from '../data/users';
import {
  createSchedule,
  getSchedule,
  getAllSchedules,
  getScheduleAndAllUsers,
  deleteSchedule,
  updateSchedule,
  deleteEmployee,
  scheduleFullForTest,
  fileDownloaded,
} from '../data/schedules';

const url = process.env.REACT_APP_API_URL;

let sleep = () => Promise.resolve();

const handlers = [
  rest.post(`${url}/login`, async (req, res, ctx) => {
    const {email, password} = parse(req.body);

    const admin = await adminsDB.authenticate({email, password});

    if (admin.wrongEmail) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Could not find account: ${email}`,
        }),
      );
    }

    if (admin.wrongPassword) {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          message: 'Incorrect credentials',
        }),
      );
    }

    return res(
      ctx.cookie('jwt', admin.token, {
        httpOnly: true,
      }),
      ctx.json({
        success: true,
        name: admin.username,
      }),
    );
  }),

  rest.post(`${url}/registration`, async (req, res, ctx) => {
    const {email, password, fullname: username} = parse(req.body);
    const adminFields = {email, password};
    let admin = await adminsDB.authenticate(adminFields);

    if (admin.wrongEmail) {
      await adminsDB.create({email, password, username});
      return res(
        ctx.status(200),
        ctx.json({
          create: true,
          message: `Admin ${email} is created`,
        }),
      );
    }

    return res(
      ctx.status(404),
      ctx.json({
        create: false,
        message: `Admin with account exists already: ${email}`,
      }),
    );
  }),

  rest.post(`${url}/delete`, async (req, res, ctx) => {
    const {email, password} = parse(req.body);
    const adminFields = {email, password};
    let admin = await adminsDB.authenticate(adminFields);
    if (admin.wrongEmail) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Could not find account: ${email}`,
        }),
      );
    }

    if (admin.wrongPassword) {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          message: 'Incorrect credentials',
        }),
      );
    }

    return res(
      ctx.cookie('jwt', 'null', {
        httpOnly: true,
      }),
      ctx.json({
        success: true,
        name: admin.username,
      }),
    );
  }),

  rest.post(`${url}/update-password`, async (req, res, ctx) => {
    const {email, password, newpassword} = parse(req.body);
    const adminFields = {email, password};
    let admin = await adminsDB.authenticate(adminFields);
    if (admin.wrongEmail) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Could not find account: ${email}`,
        }),
      );
    }

    if (admin.wrongPassword) {
      return res(
        ctx.status(401),
        ctx.json({
          success: false,
          message: 'Incorrect credentials',
        }),
      );
    }

    await adminsDB.updatePassword(email, newpassword);
    await adminsDB.authenticate(adminFields);

    return res(
      ctx.cookie('jwt', admin.token, {
        httpOnly: true,
      }),
      ctx.json({
        success: true,
        name: admin.username,
      }),
    );
  }),

  rest.post(`${url}/createdoc`, (req, res, ctx) => {
    const {idschedule, owner, lang} = parse(req.body);
    const schedule = getSchedule(idschedule);

    if (owner !== adminsDB.adminOne.email) {
      return res(ctx.status(401));
    }

    if ('en' !== lang) {
      return res(ctx.status(400));
    }

    if (schedule.id !== scheduleFullForTest.id) {
      return res(
        ctx.status(404),
        ctx.json({
          success: false,
          message: `Could not find Schedule: ${idschedule}`,
        }),
      );
    }

    fileDownloaded.getRequest = true;

    return res(
      ctx.json({
        created: true,
      }),
    );
  }),

  // rest.get(`${url}/download/schedule_${adminsDB.adminOne}.odt`, async (req, res, ctx) => {
  //   return res(
  //     ctx.status(200),
  //   );
  // }),

  //graphql
  graphql.query('Users', (req, res, ctx) => {
    return res(
      ctx.data({
        users: getAllUsers(),
      }),
    );
  }),

  graphql.query('Schedules', (req, res, ctx) => {
    return res(
      ctx.data({
        schedules: getAllSchedules(),
      }),
    );
  }),

  graphql.query('Schedule', (req, res, ctx) => {
    const {id} = req.variables;

    return res(
      ctx.data({
        schedule: getSchedule(id),
      }),
    );
  }),

  graphql.query('GetScheduleAndAllUsers', (req, res, ctx) => {
    return res(ctx.data(getScheduleAndAllUsers()));
  }),

  graphql.mutation('CreateUser', async (req, res, ctx) => {
    const {id} = createUser(req.variables);

    return res(
      ctx.data({
        createUser: {
          id,
          __typename: 'User',
        },
      }),
    );
  }),

  graphql.mutation('CreateSchedule', async (req, res, ctx) => {
    const {id} = createSchedule(req.variables);

    return res(
      ctx.data({
        createSchedule: {
          id,
          __typename: 'Schedule',
        },
      }),
    );
  }),

  graphql.mutation('DeleteSchedule', async (req, res, ctx) => {
    const {id} = deleteSchedule(req.variables);

    return res(
      ctx.data({
        updateAdmin: {
          id,
          __typename: 'Schedule',
        },
      }),
    );
  }),

  graphql.mutation('UpdateAdmin', (req, res, ctx) => {
    const {id} = req.variables;
    deleteUser(req.variables);

    return res(
      ctx.data({
        updateAdmin: {
          id,
          __typename: 'Admin',
        },
      }),
    );
  }),

  graphql.mutation('UpdateUser', (req, res, ctx) => {
    const {id} = req.variables;
    updateUser(req.variables);

    return res(
      ctx.data({
        updateUser: {
          id,
          __typename: 'User',
        },
      }),
    );
  }),

  graphql.mutation('UpdateSchedule', (req, res, ctx) => {
    const {id} = req.variables;

    updateSchedule(req.variables);

    return res(
      ctx.data({
        updateSchedule: {
          id,
          __typename: 'Schedule',
        },
      }),
    );
  }),

  graphql.mutation('DeleteEmployee', (req, res, ctx) => {
    const {idSchedule, idEmployee} = req.variables;

    deleteEmployee(idSchedule, idEmployee);

    return res(
      ctx.data({
        updateSchedule: {
          id: idSchedule,
          __typename: 'Schedule',
        },
      }),
    );
  }),
].map((handler) => {
  return {
    ...handler,
    async resolver(req, res, ctx) {
      try {
        if (shouldFail(req)) {
          throw new Error('Request failure (for testing purposes).');
        }
        const result = await handler.resolver(req, res, ctx);
        return result;
      } catch (error) {
        const status = error.status || 500;
        return res(
          ctx.status(status),
          ctx.json({status, message: error.message || 'Unknown Error'}),
        );
      } finally {
        await sleep();
      }
    },
  };
});

function shouldFail(req) {
  if (JSON.stringify(req.body)?.includes('FAIL')) return true;
  if (req.url.searchParams.toString()?.includes('FAIL')) return true;

  return false;
}

export {handlers};
