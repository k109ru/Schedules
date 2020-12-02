const User = {
  owner(parent, args, {prisma}) {
    return prisma.user({id: parent.id}).owner();
  },
};

export default User;
