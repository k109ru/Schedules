import Query from './Query';
import Mutation from './Mutation';
import Schedule from './Schedule';
import Admin from './Admin';
// import Subscription from './Subscription';
import User from './User';

const resolvers = {
  Query,
  Mutation,
  Admin,
  Schedule,
  // Subscription,
  User,
};

export {resolvers};
