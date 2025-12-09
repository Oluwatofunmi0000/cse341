// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    message: 'Authentication required. Please log in via /auth/google' 
  });
}

module.exports = { isAuthenticated };
