// jsdom does not expose these Web APIs; React Router needs them when its module loads.
const { TextDecoder, TextEncoder } = require('node:util');

Object.assign(globalThis, { TextDecoder, TextEncoder });
