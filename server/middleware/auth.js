import { sendError } from '../utils/responseFormatter.js';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // For a production app, we would verify the Firebase token here.
  // Example: admin.auth().verifyIdToken(token)
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, "Unauthorized - Missing or invalid token", 401);
  }

  const token = authHeader.split(' ')[1];
  
  // Basic mock check for now
  if (!token) {
    return sendError(res, "Unauthorized - Token required", 401);
  }
  
  // In a real implementation, you would attach the user to req
  // req.user = decodedToken;
  
  next();
};
