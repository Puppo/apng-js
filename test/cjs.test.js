import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';
import { runParseAPNGSuite } from './fixtures/parse-apng-suite.js';

const require = createRequire(import.meta.url);
const cjsModule = require('../lib/index.js');

describe('CJS export', () => {
  describe('exports', () => {
    it('exposes parseAPNG as module.exports.default', () => {
      expect(typeof cjsModule.default).toBe('function');
    });

    it('exposes isNotPNG as a named export', () => {
      expect(typeof cjsModule.isNotPNG).toBe('function');
    });

    it('exposes isNotAPNG as a named export', () => {
      expect(typeof cjsModule.isNotAPNG).toBe('function');
    });
  });

  runParseAPNGSuite(cjsModule.default, cjsModule.isNotPNG, cjsModule.isNotAPNG);
});
