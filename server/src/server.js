import {GraphQLServer} from 'graphql-yoga';
import {AuthenticationError} from 'apollo-server-core';
import jwt from 'jsonwebtoken';
import {resolvers} from './resolvers/index';
import {prisma} from '../prisma/generated/prisma/index';
import {typeDefs} from '../prisma/generated/prisma/prisma-schema';



const server = new GraphQLServer({
  typeDefs,
  resolvers,
  // //It needs for security access server
  context({request}) {
    const token = request.cookies['jwt'] || '';

    try {
      const {id, email} = jwt.verify(token, process.env.JWT_SECRET);
      return {
        id,
        email,
        prisma,
        request,
      };
    } catch (e) {
      throw new AuthenticationError(
        'Authentication token is invalid, please log in',
      );
    }
  },

  //Without authentication and authorization
  // context({request}) {
  //     return {
  //         prisma,
  //         request
  //     }
  // },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

export {server as default};
