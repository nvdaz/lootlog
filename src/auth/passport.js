import passport from 'passport';
import strategy from './strategy';

passport.use(strategy);

export default passport;