import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';
import { createMinimalPNG, createMinimalAPNG } from './fixtures/create-apng.js';

// Load the pre-built CJS output directly so we exercise the CommonJS bundle.
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

  describe('parseAPNG()', () => {
    const { default: parseAPNG, isNotPNG, isNotAPNG } = cjsModule;

    it('returns an error for arbitrary (non-PNG) data', () => {
      const result = parseAPNG(new ArrayBuffer(32));
      expect(result).toBeInstanceOf(Error);
      expect(isNotPNG(result)).toBe(true);
      expect(isNotAPNG(result)).toBe(false);
    });

    it('returns an error for a valid PNG that is not animated', () => {
      const result = parseAPNG(createMinimalPNG());
      expect(result).toBeInstanceOf(Error);
      expect(isNotAPNG(result)).toBe(true);
      expect(isNotPNG(result)).toBe(false);
    });

    it('returns an APNG object for a valid APNG buffer', () => {
      const result = parseAPNG(createMinimalAPNG());
      expect(result).not.toBeInstanceOf(Error);
      expect(result.width).toBe(1);
      expect(result.height).toBe(1);
      expect(result.numPlays).toBe(0);
      expect(Array.isArray(result.frames)).toBe(true);
      expect(result.frames).toHaveLength(1);
    });

    it('populates frame metadata correctly', () => {
      const apng   = parseAPNG(createMinimalAPNG());
      const [frame] = apng.frames;
      expect(frame.width).toBe(1);
      expect(frame.height).toBe(1);
      expect(frame.left).toBe(0);
      expect(frame.top).toBe(0);
      expect(frame.delay).toBe(100); // 1/10 s -> 100 ms
    });

    it('attaches a Blob as imageData to every frame', () => {
      const apng   = parseAPNG(createMinimalAPNG());
      const [frame] = apng.frames;
      expect(frame.imageData).toBeInstanceOf(Blob);
      expect(frame.imageData.type).toBe('image/png');
    });

    it('exposes createImages() and getPlayer() on the APNG object', () => {
      const apng = parseAPNG(createMinimalAPNG());
      expect(typeof apng.createImages).toBe('function');
      expect(typeof apng.getPlayer).toBe('function');
    });
  });

  describe('isNotPNG / isNotAPNG helpers', () => {
    const { default: parseAPNG, isNotPNG, isNotAPNG } = cjsModule;

    it('isNotPNG returns false for a not-APNG error', () => {
      const notApng = parseAPNG(createMinimalPNG());
      expect(isNotPNG(notApng)).toBe(false);
    });

    it('isNotAPNG returns false for a not-PNG error', () => {
      const notPng = parseAPNG(new ArrayBuffer(32));
      expect(isNotAPNG(notPng)).toBe(false);
    });

    it('neither helper returns true for an unrelated Error', () => {
      const err = new Error('unrelated');
      expect(isNotPNG(err)).toBe(false);
      expect(isNotAPNG(err)).toBe(false);
    });
  });
});
