import getAdminId from '../utils/getAdminId';

const Query = {
  users(parent, args, {prisma, request}) {

    return prisma.users({
      where: {
        owner: {
          id: getAdminId(request),
        },
      },
    });
  },

  admins(parent, args, {prisma}, info) {
    return prisma.admins(args, info);
  },

  async schedule(parent, args, {prisma, request}) {
    const schedules = await prisma.schedules({
      where: {
        id: args.where.id,
        owner: {
          id: getAdminId(request),
        },
      },
    });

    if (schedules.length === 0) {
      throw new Error('Schedule not found');
    }

    return schedules[0];
  },

  schedules(parent, args, {prisma, request}, info) {
    return prisma.schedules(
      {
        where: {
          year: args.where.year,
          owner: {
            id: getAdminId(request),
          },
          AND: {
            month: {
              nameOfMonth: args.where.AND[0].month.nameOfMonth,
            },
          },
        },
      },
      info,
    );
  },

  admin(parent, args, {prisma}, info) {
    console.log('admin');
    return prisma.admin(args.where, info);
  },
};

export {Query as default};
