import jwt from 'jsonwebtoken';

const getAdminId = (request, requireAuth = true) => {
  const token = request.cookies.jwt;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.adminId;
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }

  return null;
};

export {getAdminId as default};
