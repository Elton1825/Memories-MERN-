import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // 1. Check if the Authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // 2. Extract the token
    const token = req.headers.authorization.split(" ")[1];

    // 3. Check if it is a Custom Token or Google Token
    // Google tokens are very long (usually > 500 characters)
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      // === SCENARIO 1: Custom Token (Sign Up/Sign In) ===
      // Use .verify() because we signed it with our secret ('test')
      decodedData = jwt.verify(token, "test"); 
      
      req.userId = decodedData?.id;
    } else {
      // === SCENARIO 2: Google Token ===
      // Use .decode() instead of .verify()
      // We cannot verify Google's signature with a simple string secret
      decodedData = jwt.decode(token);

      // Google stores the specific user ID in 'sub'
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export default auth;