import jwt from 'jsonwebtoken';

const generateToken = (adminId, adminEmail) => {
  return jwt.sign({adminId, adminEmail}, process.env.JWT_SECRET, {
    expiresIn: '10 days',
  });
};

export {generateToken as default};
