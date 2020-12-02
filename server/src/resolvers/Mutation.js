import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createAdmin(parent, args, {prisma}) {
    const password = await hashPassword(args.data.password);
    const admin = await prisma.createAdmin({
      ...args.data,
      password,
    });

    return admin;
  },

  async updateAdmin(parent, args, {prisma}, info) {
    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.updateAdmin(
      {
        ...args,
      },
      info,
    );
  },
  async createUser(parent, args, {prisma}) {
    const user = await prisma.createUser({
      ...args.data,
    });

    return user;
  },

  async updateUser(parent, args, {prisma}, info) {

    return prisma.updateUser(
      {
        where: {
          id: args.where.id,
        },
        data: args.data,
      },
      info,
    );
  },

  async createSchedule(parent, args, {prisma}) {
    const schedule = await prisma.createSchedule({
      ...args.data,
    });

    return schedule;
  },

  async updateSchedule(parent, args, {prisma}, info) {
    const schedule = await prisma.updateSchedule(
      {
        where: {
          id: args.where.id,
        },
        data: args.data,
      },
      info,
    );

    return schedule;
  },

  async deleteUser(parent, args, {prisma}, info) {
    const userDel = await prisma.updateAdmin(
      {
        where: {
          email: args.where.email,
        },
        data: {
          users: {
            delete: {
              id: args.where.id,
            },
          },
        },

      },
      info,
    );

    return userDel;
  },

  async deleteSchedule(parent, args, {prisma}, info) {
    console.log('deleteSchedule', args.where.id);
    const scheduleDel = await prisma.updateAdmin(
      {
        where: {
          email: args.where.email,
        },
        data: {
          schedules: {
            delete: {
              id: args.where.id,
            },
          },
        },
      },
      info,
    );

    return scheduleDel;
  },

  async deleteAdmin(parent, args, {prisma}, info) {
    console.log('deleteAdmin', args.where.email);
    const schedulesDel = await prisma.deleteManySchedules({
      owner: {
        email: args.where.email,
      },
    });

    const usersDel = await prisma.deleteManyUsers({
      owner: {
        email: args.where.email,
      },
    });

    const adminDel = await prisma.deleteAdmin(
      {
        email: args.where.email,
      },
      info,
    );

    const obj = {
      schedulesDel,
      usersDel,
      adminDel,
    };
    return obj;
  },
};

export {Mutation as default};
