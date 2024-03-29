import { Express } from 'express';
import passport from './passport';
import routes from './routes';
import { jwtParser, handleJwtError } from './middleware';

export default function apply(app: Express): void {
  app.use(jwtParser, handleJwtError);
  app.use(passport.initialize());
  app.use('/auth', routes);
  app.use('/graphql', jwtParser, handleJwtError);
}
