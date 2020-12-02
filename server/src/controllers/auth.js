import {prisma} from '../../prisma/generated/prisma/index';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

exports.postRegistration = async (req, res) => {
  const {email, password, fullname, language} = req.body;

  const admin = await prisma.admin({email});

  if (admin) {
    res.status(404).send({
      create: false,
      message: `Admin with account exists already: ${email}`,
    });
    return;
  }
  if (!admin) {
    const passwordHash = await hashPassword(password);

    const admin = await prisma.createAdmin({
      name: fullname,
      email,
      password: passwordHash,
      language,
    });

    const token = generateToken(admin.id, admin.email);

    res.cookie('jwt', token, {
      httpOnly: true,
      //secure: true, //on HTTPS
      //domain: 'example.com', //set your domain
    });

    res.status(200).send({
      create: true,
      message: `Admin ${email} is created`,
    });

    return;
  }
};

exports.postLogin = async (req, res) => {
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

  const token = generateToken(admin.id, admin.email);

  res.cookie('jwt', token, {
    httpOnly: true,
    //secure: true, //on HTTPS
    //domain: 'example.com', //set your domain
  });

  // res.cookie('name', `${admin.name}`, {
  //   httpOnly: true,
  //   encode: String
  //   //secure: true, //on HTTPS
  //   //domain: 'example.com', //set your domain
  // })

  // res.cookie('email', admin.email, {
  //   httpOnly: true,
  //   encode: String
  //   //secure: true, //on HTTPS
  //   //domain: 'example.com', //set your domain
  // })

  // res.cookie('signedin', 'true', {
  //   httpOnly: true
  //   //secure: true, //on HTTPS
  //   //domain: 'example.com', //set your domain
  // })

  res.send({
    success: true,
    name: admin.name,
  });
};

exports.getLogout = (req, res) => {
  res.cookie('jwt', 'null', {
    httpOnly: true,
  });

  res.send({
    success: true,
  });
};
