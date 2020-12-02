import faker from 'faker';

const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
const getEmail = faker.internet.email;


function buildReq({...overrides} = {}) {
  const req = {body: {}, params: {}, ...overrides};
  return req;
}

function buildRes(overrides = {}) {
  const res = {
    send: jest.fn(() => res).mockName('send'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  };
  return res;
}


export {
  buildReq,
  buildRes,
  getPassword,
  getEmail,
};
