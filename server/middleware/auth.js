import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decodedData = jwt.verify(token, 'YOUR_SECRET_KEY'); // same secret as token creation
    req.userId = decodedData?.id || decodedData?.sub; // Google OAuth uses 'sub'

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth;
