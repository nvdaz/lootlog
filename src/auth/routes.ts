import { Router, Request, Response } from 'express';

import passport from './passport';
import { IUser } from '../models/user';

const router = Router();

router.get(
  '/discord',
  passport.authenticate('discord', { session: false, scope: ['identify'] }),
);

router.get(
  '/discord/redirect',
  passport.authenticate('discord', { failureRedirect: '/', session: false }),
  (req: Request, res: Response) => {
    if (!req.user) return res.redirect('/?error?error=auth');
    res.cookie('token', (req.user as IUser).generateAuthToken(), {
      maxAge: 6.048e8,
      httpOnly: true,
    });
    res.redirect('/');
  },
);

router.get('/logout', async (req: Request, res: Response) => {
  req.logout();
  res.cookie('token', null);
  res.redirect('/');
});

export default router;
