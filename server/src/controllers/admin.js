import {prisma} from '../../prisma/generated/prisma/index';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

import createDoc from '../create_doc_odt/createOdtDoc';

exports.postUpdatePasswordAdmin = async (req, res) => {
  const {email, password, newpassword} = req.body;
  const admin = await prisma.admin({email});

  if (!admin) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    });
    return;
  }

  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    });
    return;
  }

  let updatedPassword = await hashPassword(newpassword);

  const updatedAdmin = await prisma.updateAdmin({
    where: {
      email,
    },
    data: {
      password: updatedPassword,
    },
  });

  const token = generateToken(updatedAdmin.id, updatedAdmin.email);

  res.cookie('jwt', token, {
    httpOnly: true,
    //secure: true, //on HTTPS
    //domain: 'example.com', //set your domain
  });

  res.send({
    success: true,
    name: updatedAdmin.name,
  });
};

exports.postDeleteAdmin = async (req, res) => {
  const {email, password} = req.body;
  const admin = await prisma.admin({email});

  if (!admin) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    });
    return;
  }

  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    });
    return;
  }

  const deletedSchedules = await prisma.deleteManySchedules({
    owner: {
      email,
    },
  });

  const deletedUsers = await prisma.deleteManyUsers({
    owner: {
      email,
    },
  });

  const deletedAdmin = await prisma.deleteAdmin({email});

  res.cookie('jwt', 'null', {
    httpOnly: true,
  });

  if (deletedAdmin && deletedSchedules && deletedUsers) {
    res.send({
      success: true,
      name: admin.name,
    });
  } else {
    res.send({
      success: false,
    });
  }
};

exports.postCreateDoc = async (req, res) => {
  const {idschedule, owner, lang} = req.body;
  const schedule = await prisma.schedule({id: idschedule});

  if (!schedule) {
    res.status(404).send({
      success: false,
      message: `Could not find Schedule: ${idschedule}`,
    });
    return;
  }

  createDoc(schedule, owner, lang);

  res.send({
    created: true,
  });
};
