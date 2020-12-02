const adminOne = {
  id: '123',
  name: 'adminOne',
  email: 'admin_one@k109.ru',
};

let admins = {};
let currentAdmin = {};

const persist = () => {
  window.sessionStorage.setItem('email', currentAdmin.email);
  window.sessionStorage.setItem('name', currentAdmin.name);
  window.sessionStorage.setItem('signedIn', true);
};

// const load = () => {

//     const email = window.sessionStorage.getItem('email');
//     const name = window.sessionStorage.getItem('name');
//     const signedIn = window.sessionStorage.getItem('signedIn');

//     const admin = {
//        email,
//        name,
//        signedIn
//     }

//     return admin
// }

function validateLoginForm({email, password}) {
  if (!email) {
    const error = new Error('A email is required');
    error.status = 400;
    throw error;
  }
  if (!password) {
    const error = new Error('A password is required');
    error.status = 400;
    throw error;
  }
}

async function authenticate({email, password}) {

  validateLoginForm({email, password});

  const id = hash(email);

  const admin = admins[id] || {};

  if (admin.passwordHash === hash(password)) {
    return {...sanitizeAdmin(admin), token: btoa(admin.id)};
  }

  if (admin.passwordHash !== hash(password) && admin.email === email) {
    return {
      wrongPassword: true,
    };
  }

  if (admin.email !== email) {
    return {
      wrongEmail: true,
    };
  }
}

async function create({email, password, username}) {
  validateLoginForm({email, password});
  const id = hash(email);
  const passwordHash = hash(password);
  if (admins[id]) {
    const error = new Error(
      `Cannot create a new admin with the email "${email}"`,
    );
    error.status = 400;
    throw error;
  }
  admins[id] = {id, username, email, passwordHash};
  currentAdmin = {id, username, email, passwordHash};
  return read(id);
}

async function read(id) {
  validateAdmin(id);
  return sanitizeAdmin(admins[id]);
}

function sanitizeAdmin(admin) {
  const {...rest} = admin;
  return rest;
}

async function updatePassword(email, newpassword) {
  let id = hash(email);
  validateAdmin(id);
  const passwordHash = hash(newpassword);
  admins[id].passwordHash = passwordHash;
  persist();
  return read(id);
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id) {
  validateAdmin(id);
  delete admins[id];
  persist();
}

function validateAdmin(id) {
  if (!admins[id]) {
    const error = new Error(`No admin with the id "${id}"`);
    error.status = 404;
    throw error;
  }
}

function hash(str) {
  var hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
}

async function logout() {
  window.sessionStorage.setItem('email', null);
  window.sessionStorage.setItem('name', null);
  window.sessionStorage.setItem('signedIn', false);
}

async function reset() {
  admins = {};
  logout();
}

export {
  authenticate,
  create,
  read,
  updatePassword,
  remove,
  reset,
  persist,
  adminOne,
};
