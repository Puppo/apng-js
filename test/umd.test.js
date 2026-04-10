import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';
import { createMinimalPNG, createMinimalAPNG } from './fixtures/create-apng.js';

// The UMD bundle is CommonJS-compatible, so we load it via require.
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

  describe('parseAPNG()', () => {
    const { default: parseAPNG, isNotPNG, isNotAPNG } = umdModule;

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
      const apng    = parseAPNG(createMinimalAPNG());
      const [frame] = apng.frames;
      expect(frame.width).toBe(1);
      expect(frame.height).toBe(1);
      expect(frame.left).toBe(0);
      expect(frame.top).toBe(0);
      expect(frame.delay).toBe(100);
    });

    it('attaches a Blob as imageData to every frame', () => {
      const apng    = parseAPNG(createMinimalAPNG());
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
    const { default: parseAPNG, isNotPNG, isNotAPNG } = umdModule;

    it('isNotPNG returns false for a not-APNG error', () => {
      expect(isNotPNG(parseAPNG(createMinimalPNG()))).toBe(false);
    });

    it('isNotAPNG returns false for a not-PNG error', () => {
      expect(isNotAPNG(parseAPNG(new ArrayBuffer(32)))).toBe(false);
    });

    it('neither helper returns true for an unrelated Error', () => {
      const err = new Error('unrelated');
      expect(isNotPNG(err)).toBe(false);
      expect(isNotAPNG(err)).toBe(false);
    });
  });
});
