const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Authentication]
 *     summary: Initiate Google OAuth login
 *     description: Redirects to Google for authentication
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: Google OAuth callback
 *     description: Handles the redirect from Google after authentication
 *     responses:
 *       302:
 *         description: Redirect to home or dashboard after successful login
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login/failed' }),
  (req, res) => {
    res.redirect('/auth/login/success');
  }
);

/**
 * @swagger
 * /auth/login/success:
 *   get:
 *     tags: [Authentication]
 *     summary: Login success page
 *     description: Displays successful login message with user info
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: req.user
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

/**
 * @swagger
 * /auth/login/failed:
 *   get:
 *     tags: [Authentication]
 *     summary: Login failure page
 *     description: Displays login failure message
 *     responses:
 *       401:
 *         description: Authentication failed
 */
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Login failed'
  });
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags: [Authentication]
 *     summary: Logout current user
 *     description: Logs out the currently authenticated user
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     tags: [Authentication]
 *     summary: Check authentication status
 *     description: Returns current user info if authenticated
 *     responses:
 *       200:
 *         description: Authentication status
 */
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.status(200).json({
      authenticated: false
    });
  }
});

module.exports = router;
