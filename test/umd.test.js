import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';
import { runParseAPNGSuite } from './fixtures/parse-apng-suite.js';

const require = createRequire(import.meta.url);
const umdModule = require('../lib/index.umd.js');

describe('UMD export', () => {
  describe('exports', () => {
    it('exposes parseAPNG as module.exports.default', () => {
      expect(typeof umdModule.default).toBe('function');
    });

    it('exposes isNotPNG as a named export', () => {
      expect(typeof umdModule.isNotPNG).toBe('function');
    });

    it('exposes isNotAPNG as a named export', () => {
      expect(typeof umdModule.isNotAPNG).toBe('function');
    });

    it('sets the __esModule flag so default interop works', () => {
      expect(umdModule.__esModule).toBe(true);
    });
  });

  runParseAPNGSuite(umdModule.default, umdModule.isNotPNG, umdModule.isNotAPNG);
});
