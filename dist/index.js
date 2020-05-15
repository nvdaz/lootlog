"use strict";require("dotenv/config");
var _http = _interopRequireDefault(require("http"));
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _path = _interopRequireDefault(require("path"));


var _database = _interopRequireDefault(require("./setup/database"));
var _apollo = require("./apollo");
var _auth = _interopRequireDefault(require("./auth"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // import * as Sentry from '@sentry/node';

// Sentry.init({ dsn: process.env.DSN });

(0, _database.default)();

const app = (0, _express.default)();

app.use((0, _morgan.default)('combined'));
app.use((0, _cookieParser.default)());
app.use(_bodyParser.default.json());
(0, _auth.default)(app);
// setupRoutes(app);
_apollo.apolloServer.applyMiddleware({ app, path: '/graphql' });

app.use(
_express.default.static(_path.default.join(__dirname, '..', 'client', 'dist'), {
  maxAge: 31536000000 }));



app.get('*', (req, res) => {
  res.sendFile(_path.default.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});

const httpServer = _http.default.createServer(app);

_apollo.apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(80, () => console.log('Server started!'));