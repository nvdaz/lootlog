import { Router } from 'express';

import passport from './passport';

const router = new Router();

router.get(
  '/discord',
  passport.authenticate('discord', { session: false, scope: ['identify'] }),
);

router.get(
  '/discord/redirect',
  passport.authenticate('discord', { failureRedirect: '/', session: false }),
  (req, res) => {
    if (!req.user) return res.redirect('/?error?error=auth');
    res.cookie('token', req.user.generateAuthToken(), {
      maxAge: 6.048e8,
      httpOnly: true,
    });
    res.redirect('/');
  },
);

router.get('/logrout', async (req, res) => {
  req.logout();
  res.cookie('token', null);
  res.redirect('/');
});

export default router;
