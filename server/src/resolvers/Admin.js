const Admin = {
  users(parent, args, {prisma}) {
    return prisma.admin({id: parent.id}).users();
  },

  schedules(parent, args, {prisma}) {
    return prisma.admin({id: parent.id}).schedules();
  },
};

export default Admin;
