const Schedule = {
  employees(parent, args, {prisma}) {
    return prisma.schedule({id: parent.id}).employees();
  },
  owner(parent, args, {prisma}) {
    return prisma.schedule({id: parent.id}).owner();
  },
};

export default Schedule;
