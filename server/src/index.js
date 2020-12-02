import '@babel/polyfill/noConflict';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import server from './server';

import adminRouters from './routes/admin';
import authRouters from './routes/auth';

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

server.express.use(cors(corsOptions));
server.express.use(cookieParser());
server.express.use(express.urlencoded({extended: true}));

server.express.use(
  '/download',
  express.static(__dirname + '/create_doc_odt/outputFile'),
);

server.express.use(adminRouters);
server.express.use(authRouters);

server.start(
  {
    port: process.env.PORT || 3000,
    endpoint: '/graphql',
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  async ({port}) => {
    // const usersData = await prisma.user({email: 'admin@k109.ru'});
    // const usersData = await prisma.users();
    // console.log(usersData);
    console.log(process.env.PRISMA_ENDPOINT);
    console.log(process.env.FRONTEND_URL);
    console.log(`The server is up! On port ${port}`);
  },
);
