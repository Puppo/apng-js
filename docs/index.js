(function () {
  'use strict';

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
    }
    table[i] = c;
  }

  /**
   *
   * @param {Uint8Array} bytes
   * @param {number} start
   * @param {number} length
   * @return {number}
   */
  function crc32 (bytes, start = 0, length = bytes.length - start) {
    let crc = -1;
    for (let i = start, l = start + length; i < l; i++) {
      crc = crc >>> 8 ^ table[(crc ^ bytes[i]) & 0xFF];
    }
    return crc ^ -1;
  }

  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var events = {exports: {}};

  var hasRequiredEvents;
  function requireEvents() {
    if (hasRequiredEvents) return events.exports;
    hasRequiredEvents = 1;
    var R = typeof Reflect === 'object' ? Reflect : null;
    var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === 'function') {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
      return value !== value;
    };
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    events.exports = EventEmitter;
    events.exports.once = once;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
      enumerable: true,
      get: function () {
        return defaultMaxListeners;
      },
      set: function (arg) {
        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter.init = function () {
      if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || undefined;
    };

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === 'error';
      var events = this._events;
      if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

      // If there is no 'error' event listener then throw.
      if (doError) {
        var er;
        if (args.length > 0) er = args[0];
        if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
        }
        // At least give some kind of context to the user
        var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
        err.context = er;
        throw err; // Unhandled 'error' event
      }
      var handler = events[type];
      if (handler === undefined) return false;
      if (typeof handler === 'function') {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
          target.emit('newListener', type, listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          // If we've already got an array, just append.
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }

        // Check for listener leak
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          // No error code for this since it is a Warning
          // eslint-disable-next-line no-restricted-syntax
          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0) return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = {
        fired: false,
        wrapFn: undefined,
        target: target,
        type: type,
        listener: listener
      };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter.prototype.once = function once(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

    // Emits a 'removeListener' event if and only if the listener was removed.
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === undefined) return this;
      list = events[type];
      if (list === undefined) return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0) this._events = Object.create(null);else {
          delete events[type];
          if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0) return this;
        if (position === 0) list.shift();else {
          spliceOne(list, position);
        }
        if (list.length === 1) events[type] = list[0];
        if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === undefined) return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === undefined) return [];
      var evlistener = events[type];
      if (evlistener === undefined) return [];
      if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter.listenerCount = function (emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== undefined) {
        var evlistener = events[type];
        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener !== undefined) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i) copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++) list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function (resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === 'function') {
            emitter.removeListener('error', errorListener);
          }
          resolve([].slice.call(arguments));
        }
        eventTargetAgnosticAddListener(emitter, name, resolver, {
          once: true
        });
        if (name !== 'error') {
          addErrorHandlerIfEventEmitter(emitter, errorListener, {
            once: true
          });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === 'function') {
        eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === 'function') {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === 'function') {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen for `error` events here.
        emitter.addEventListener(name, function wrapListener(arg) {
          // IE does not have builtin `{ once: true }` support so we
          // have to do it manually.
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
    return events.exports;
  }

  var eventsExports = requireEvents();
  var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventsExports);

  class Player extends EventEmitter {
    /**
     * @param {APNG} apng
     * @param {CanvasRenderingContext2D} context
     * @param {boolean} autoPlay
     */
    constructor(apng, context, autoPlay) {
      super();
      /** @type {CanvasRenderingContext2D} */
      _defineProperty(this, "context", void 0);
      /** @type {number} */
      _defineProperty(this, "playbackRate", 1.0);
      /** @type {APNG} */
      _defineProperty(this, "_apng", void 0);
      /** @type {Frame} */
      _defineProperty(this, "_prevFrame", void 0);
      /** @type {ImageData} */
      _defineProperty(this, "_prevFrameData", void 0);
      /** @type {number} */
      _defineProperty(this, "_currentFrameNumber", 0);
      /** @type {boolean} */
      _defineProperty(this, "_ended", false);
      /** @type {boolean} */
      _defineProperty(this, "_paused", true);
      /** @type {number} */
      _defineProperty(this, "_numPlays", 0);
      /** @type {number|null} */
      _defineProperty(this, "_rafId", null);
      this._apng = apng;
      this.context = context;
      this.stop();
      if (autoPlay) {
        this.play();
      }
    }

    /**
     *
     * @return {number}
     */
    get currentFrameNumber() {
      return this._currentFrameNumber;
    }

    /**
     *
     * @return {Frame}
     */
    get currentFrame() {
      return this._apng.frames[this._currentFrameNumber];
    }
    renderNextFrame() {
      this._currentFrameNumber = (this._currentFrameNumber + 1) % this._apng.frames.length;
      if (this._currentFrameNumber === this._apng.frames.length - 1) {
        this._numPlays++;
        if (this._apng.numPlays !== 0 && this._numPlays >= this._apng.numPlays) {
          this._ended = true;
          this._paused = true;
        }
      }
      if (this._prevFrame && this._prevFrame.disposeOp == 1) {
        this.context.clearRect(this._prevFrame.left, this._prevFrame.top, this._prevFrame.width, this._prevFrame.height);
      } else if (this._prevFrame && this._prevFrame.disposeOp == 2) {
        this.context.putImageData(this._prevFrameData, this._prevFrame.left, this._prevFrame.top);
      }
      const frame = this.currentFrame;
      this._prevFrame = frame;
      this._prevFrameData = null;
      if (frame.disposeOp == 2) {
        this._prevFrameData = this.context.getImageData(frame.left, frame.top, frame.width, frame.height);
      }
      if (frame.blendOp == 0) {
        this.context.clearRect(frame.left, frame.top, frame.width, frame.height);
      }
      this.context.drawImage(frame.imageElement, frame.left, frame.top);
      this.emit('frame', this._currentFrameNumber);
      if (this._ended) {
        this.emit('end');
      }
    }

    // playback

    get paused() {
      return this._paused;
    }
    get ended() {
      return this._ended;
    }
    play() {
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
      }
      this.emit('play');
      if (this._ended) {
        this.stop();
      }
      this._paused = false;
      let nextRenderTime = performance.now() + this.currentFrame.delay / this.playbackRate;
      const tick = now => {
        if (this._ended || this._paused) {
          return;
        }
        if (now >= nextRenderTime) {
          while (now - nextRenderTime >= this._apng.playTime / this.playbackRate) {
            nextRenderTime += this._apng.playTime / this.playbackRate;
            this._numPlays++;
          }
          do {
            this.renderNextFrame();
            nextRenderTime += this.currentFrame.delay / this.playbackRate;
          } while (!this._ended && !this._paused && now > nextRenderTime);
        }
        this._rafId = requestAnimationFrame(tick);
      };
      this._rafId = requestAnimationFrame(tick);
    }
    pause() {
      if (!this._paused) {
        if (this._rafId) {
          cancelAnimationFrame(this._rafId);
          this._rafId = null;
        }
        this.emit('pause');
        this._paused = true;
      }
    }
    stop() {
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
      this.emit('stop');
      this._numPlays = 0;
      this._ended = false;
      this._paused = true;
      // render first frame
      this._currentFrameNumber = -1;
      this.context.clearRect(0, 0, this._apng.width, this._apng.height);
      this.renderNextFrame();
    }
  }

  /**
   * @property {number} currFrameNumber
   * @property {Frame} currFrame
   * @property {boolean} paused
   * @property {boolean} ended
   */
  class APNG {
    constructor() {
      /** @type {number} */
      _defineProperty(this, "width", 0);
      /** @type {number} */
      _defineProperty(this, "height", 0);
      /** @type {number} */
      _defineProperty(this, "numPlays", 0);
      /** @type {number} */
      _defineProperty(this, "playTime", 0);
      /** @type {Frame[]} */
      _defineProperty(this, "frames", []);
    }
    /**
     *
     * @return {Promise.<*>}
     */
    createImages() {
      return Promise.all(this.frames.map(f => f.createImage()));
    }

    /**
     *
     * @param {CanvasRenderingContext2D} context
     * @param {boolean} autoPlay
     * @return {Promise.<Player>}
     */
    getPlayer(context, autoPlay = false) {
      return this.createImages().then(() => new Player(this, context, autoPlay));
    }
  }
  class Frame {
    constructor() {
      /** @type {number} */
      _defineProperty(this, "left", 0);
      /** @type {number} */
      _defineProperty(this, "top", 0);
      /** @type {number} */
      _defineProperty(this, "width", 0);
      /** @type {number} */
      _defineProperty(this, "height", 0);
      /** @type {number} */
      _defineProperty(this, "delay", 0);
      /** @type {number} */
      _defineProperty(this, "disposeOp", 0);
      /** @type {number} */
      _defineProperty(this, "blendOp", 0);
      /** @type {Blob} */
      _defineProperty(this, "imageData", null);
      /** @type {HTMLImageElement} */
      _defineProperty(this, "imageElement", null);
    }
    createImage() {
      if (this.imageElement) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(this.imageData);
        this.imageElement = document.createElement('img');
        this.imageElement.onload = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        this.imageElement.onerror = () => {
          URL.revokeObjectURL(url);
          this.imageElement = null;
          reject(new Error("Image creation error"));
        };
        this.imageElement.src = url;
      });
    }
  }

  const errNotPNG = new Error('Not a PNG');
  const errNotAPNG = new Error('Not an animated PNG');

  // '\x89PNG\x0d\x0a\x1a\x0a'
  const PNGSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  /**
   * Parse APNG data
   * @param {ArrayBuffer} buffer
   * @return {APNG|Error}
   */
  function parseAPNG(buffer) {
    const bytes = new Uint8Array(buffer);
    if (Array.prototype.some.call(PNGSignature, (b, i) => b !== bytes[i])) {
      return errNotPNG;
    }

    // fast animation test
    let isAnimated = false;
    eachChunk(bytes, type => !(isAnimated = type === 'acTL'));
    if (!isAnimated) {
      return errNotAPNG;
    }
    const preDataParts = [],
      postDataParts = [];
    let headerDataBytes = null,
      frame = null,
      frameNumber = 0,
      apng = new APNG();
    eachChunk(bytes, (type, bytes, off, length) => {
      const dv = new DataView(bytes.buffer);
      switch (type) {
        case 'IHDR':
          headerDataBytes = bytes.subarray(off + 8, off + 8 + length);
          apng.width = dv.getUint32(off + 8);
          apng.height = dv.getUint32(off + 12);
          break;
        case 'acTL':
          apng.numPlays = dv.getUint32(off + 8 + 4);
          break;
        case 'fcTL':
          if (frame) {
            apng.frames.push(frame);
            frameNumber++;
          }
          frame = new Frame();
          frame.width = dv.getUint32(off + 8 + 4);
          frame.height = dv.getUint32(off + 8 + 8);
          frame.left = dv.getUint32(off + 8 + 12);
          frame.top = dv.getUint32(off + 8 + 16);
          var delayN = dv.getUint16(off + 8 + 20);
          var delayD = dv.getUint16(off + 8 + 22);
          if (delayD === 0) {
            delayD = 100;
          }
          frame.delay = 1000 * delayN / delayD;
          // https://bugzilla.mozilla.org/show_bug.cgi?id=125137
          // https://bugzilla.mozilla.org/show_bug.cgi?id=139677
          // https://bugzilla.mozilla.org/show_bug.cgi?id=207059
          if (frame.delay <= 10) {
            frame.delay = 100;
          }
          apng.playTime += frame.delay;
          frame.disposeOp = dv.getUint8(off + 8 + 24);
          frame.blendOp = dv.getUint8(off + 8 + 25);
          frame.dataParts = [];
          if (frameNumber === 0 && frame.disposeOp === 2) {
            frame.disposeOp = 1;
          }
          break;
        case 'fdAT':
          if (frame) {
            frame.dataParts.push(bytes.subarray(off + 8 + 4, off + 8 + length));
          }
          break;
        case 'IDAT':
          if (frame) {
            frame.dataParts.push(bytes.subarray(off + 8, off + 8 + length));
          }
          break;
        case 'IEND':
          postDataParts.push(subBuffer(bytes, off, 12 + length));
          break;
        default:
          preDataParts.push(subBuffer(bytes, off, 12 + length));
      }
    });
    if (frame) {
      apng.frames.push(frame);
    }
    if (apng.frames.length == 0) {
      return errNotAPNG;
    }
    const preBlob = new Blob(preDataParts),
      postBlob = new Blob(postDataParts);
    apng.frames.forEach(frame => {
      var bb = [];
      bb.push(PNGSignature);
      headerDataBytes.set(makeDWordArray(frame.width), 0);
      headerDataBytes.set(makeDWordArray(frame.height), 4);
      bb.push(makeChunkBytes('IHDR', headerDataBytes));
      bb.push(preBlob);
      frame.dataParts.forEach(p => bb.push(makeChunkBytes('IDAT', p)));
      bb.push(postBlob);
      frame.imageData = new Blob(bb, {
        'type': 'image/png'
      });
      delete frame.dataParts;
      bb = null;
    });
    return apng;
  }

  /**
   * @param {Uint8Array} bytes
   * @param {function(string, Uint8Array, int, int): boolean} callback
   */
  function eachChunk(bytes, callback) {
    const dv = new DataView(bytes.buffer);
    let off = 8,
      type,
      length,
      res;
    do {
      length = dv.getUint32(off);
      type = readString(bytes, off + 4, 4);
      res = callback(type, bytes, off, length);
      off += 12 + length;
    } while (res !== false && type != 'IEND' && off < bytes.length);
  }

  /**
   *
   * @param {Uint8Array} bytes
   * @param {number} off
   * @param {number} length
   * @return {string}
   */
  function readString(bytes, off, length) {
    const chars = Array.prototype.slice.call(bytes.subarray(off, off + length));
    return String.fromCharCode.apply(String, chars);
  }

  /**
   *
   * @param {string} x
   * @return {Uint8Array}
   */
  function makeStringArray(x) {
    const res = new Uint8Array(x.length);
    for (let i = 0; i < x.length; i++) {
      res[i] = x.charCodeAt(i);
    }
    return res;
  }

  /**
   * @param {Uint8Array} bytes
   * @param {int} start
   * @param {int} length
   * @return {Uint8Array}
   */
  function subBuffer(bytes, start, length) {
    const a = new Uint8Array(length);
    a.set(bytes.subarray(start, start + length));
    return a;
  }

  /**
   * @param {string} type
   * @param {Uint8Array} dataBytes
   * @return {Uint8Array}
   */
  var makeChunkBytes = function (type, dataBytes) {
    const crcLen = type.length + dataBytes.length;
    const bytes = new Uint8Array(crcLen + 8);
    const dv = new DataView(bytes.buffer);
    dv.setUint32(0, dataBytes.length);
    bytes.set(makeStringArray(type), 4);
    bytes.set(dataBytes, 8);
    var crc = crc32(bytes, 4, crcLen);
    dv.setUint32(crcLen + 4, crc);
    return bytes;
  };
  var makeDWordArray = function (x) {
    return new Uint8Array([x >>> 24 & 0xff, x >>> 16 & 0xff, x >>> 8 & 0xff, x & 0xff]);
  };

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
    if (typeof document === 'undefined') {
      return;
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".apng-info,\n.apng-frames {\n    max-height: 600px;\n    overflow:   auto;\n}\n\n.apng-frames > div {\n    float:            left;\n    margin:           1px 1px 8px 8px;\n    box-shadow:       0 0 0 1px;\n    position:         relative;\n    background:       linear-gradient(45deg, #fff 25%, transparent 26%, transparent 75%, #fff 76%),\n                      linear-gradient(-45deg, #fff 25%, transparent 26%, transparent 75%, #fff 76%);\n    background-color: #eee;\n    background-size:  20px 20px;\n}\n\n.apng-frames > div > img {\n    position:   absolute;\n    box-shadow: 0 0 0 1px rgba(255, 0, 0, 0.75);\n}\n\n#playback-rate {\n    width:   12em;\n    display: inline-block;\n}\n\n.apng-log {\n    height: 10em;\n}";
  styleInject(css_248z);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/png';
  document.getElementById('choose-btn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      processFile(fileInput.files[0]);
    }
    fileInput.value = '';
  });
  let player = null;
  document.getElementById('play-pause-btn').addEventListener('click', () => {
    if (player) {
      if (player.paused) {
        player.play();
      } else {
        player.pause();
      }
    }
  });
  document.getElementById('stop-btn').addEventListener('click', () => player && player.stop());
  let playbackRate = 1.0;
  document.getElementById('playback-rate').addEventListener('change', e => {
    playbackRate = parseFloat(e.target.value);
    document.getElementById('playback-rate-display').innerHTML = playbackRate.toString();
    if (player) {
      player.playbackRate = playbackRate;
    }
  });
  function processFile(file) {
    const resultBlock = document.querySelector('.apng-result');
    const errorBlock = document.querySelector('.apng-error');
    const errDiv = errorBlock.querySelector('.alert');
    const infoDiv = document.querySelector('.apng-info');
    const framesDiv = document.querySelector('.apng-frames');
    const canvasDiv = document.querySelector('.apng-ani');
    const logDiv = document.querySelector('.apng-log');
    resultBlock.classList.add('hidden');
    errorBlock.classList.add('hidden');
    emptyEl(infoDiv);
    emptyEl(framesDiv);
    emptyEl(canvasDiv);
    emptyEl(errDiv);
    emptyEl(logDiv);
    if (player) {
      player.stop();
    }
    const log = [];
    const reader = new FileReader();
    reader.onload = () => {
      const apng = parseAPNG(reader.result);
      if (apng instanceof Error) {
        errDiv.appendChild(document.createTextNode(apng.message));
        errorBlock.classList.remove('hidden');
        return;
      }
      apng.createImages().then(() => {
        infoDiv.appendChild(document.createTextNode(JSON.stringify(apng, null, '  ')));
        apng.frames.forEach(f => {
          const div = framesDiv.appendChild(document.createElement('div'));
          div.appendChild(f.imageElement);
          div.style.width = `${apng.width}px`;
          div.style.height = `${apng.height}px`;
          f.imageElement.style.left = `${f.left}px`;
          f.imageElement.style.top = `${f.top}px`;
        });
        const canvas = document.createElement('canvas');
        canvas.width = apng.width;
        canvas.height = apng.height;
        canvasDiv.appendChild(canvas);
        apng.getPlayer(canvas.getContext('2d')).then(p => {
          player = p;
          player.playbackRate = playbackRate;
          const em = player.emit;
          player.emit = (event, ...args) => {
            log.unshift({
              event,
              args
            });
            if (log.length > 10) {
              log.splice(10, log.length - 10);
            }
            logDiv.textContent = log.map(({
              event,
              args
            }) => `${event}: ${JSON.stringify(args)}`).join("\n");
            em.call(player, event, ...args);
          };
          player.play();
        });
      });
      resultBlock.classList.remove('hidden');
    };
    reader.readAsArrayBuffer(file);
  }
  function emptyEl(el) {
    let c;
    while ((c = el.firstChild) !== null) {
      el.removeChild(c);
    }
  }

})();
