"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = exports.GOLEM_ADDED = exports.DRAGON_ADDED = exports.SLAYER_ADDED = void 0;var _apolloServerExpress = require("apollo-server-express");

const SLAYER_ADDED = 'SLAYER_ADDED';exports.SLAYER_ADDED = SLAYER_ADDED;
const DRAGON_ADDED = 'DRAGON_ADDED';exports.DRAGON_ADDED = DRAGON_ADDED;
const GOLEM_ADDED = 'GOLEM_ADDED';exports.GOLEM_ADDED = GOLEM_ADDED;var _default =

new _apolloServerExpress.PubSub();exports.default = _default;