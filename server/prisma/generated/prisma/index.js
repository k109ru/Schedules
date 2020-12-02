'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var prisma_lib_1 = require('prisma-client-lib');
var typeDefs = require('./prisma-schema').typeDefs;

var models = [
  {
    name: 'Admin',
    embedded: false,
  },
  {
    name: 'Schedule',
    embedded: false,
  },
  {
    name: 'Employee',
    embedded: true,
  },
  {
    name: 'PositionOfEmployee',
    embedded: true,
  },
  {
    name: 'WorkTimeE',
    embedded: true,
  },
  {
    name: 'SecondWorkTimeE',
    embedded: true,
  },
  {
    name: 'LunchTimeE',
    embedded: true,
  },
  {
    name: 'SecondLunchTimeE',
    embedded: true,
  },
  {
    name: 'DayOfEmployee',
    embedded: true,
  },
  {
    name: 'Kind',
    embedded: true,
  },
  {
    name: 'Month',
    embedded: true,
  },
  {
    name: 'Weekday',
    embedded: true,
  },
  {
    name: 'Weekend',
    embedded: true,
  },
  {
    name: 'Holiday',
    embedded: true,
  },
  {
    name: 'BeforeHoliday',
    embedded: true,
  },
  {
    name: 'Day',
    embedded: true,
  },
  {
    name: 'User',
    embedded: false,
  },
  {
    name: 'Position',
    embedded: true,
  },
  {
    name: 'WorkTime',
    embedded: true,
  },
  {
    name: 'SecondWorkTime',
    embedded: true,
  },
  {
    name: 'LunchTime',
    embedded: true,
  },
  {
    name: 'SecondLunchTime',
    embedded: true,
  },
  {
    name: 'KindOfDay',
    embedded: true,
  },
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env['PRISMA_ENDPOINT']}`,
  secret: `${process.env['PRISMA_SECRET']}`,
});
exports.prisma = new exports.Prisma();
