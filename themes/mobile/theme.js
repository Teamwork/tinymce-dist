(function () {
var mobile = (function () {
  'use strict';

  var noop = function () {
  };
  var noarg = function (f) {
    return function () {
      return f();
    };
  };
  var compose = function (fa, fb) {
    return function () {
      return fa(fb.apply(null, arguments));
    };
  };
  var constant = function (value) {
    return function () {
      return value;
    };
  };
  var identity = function (x) {
    return x;
  };
  var tripleEquals = function (a, b) {
    return a === b;
  };
  var curry = function (f) {
    var args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++)
      args[i - 1] = arguments[i];
    return function () {
      var newArgs = new Array(arguments.length);
      for (var j = 0; j < newArgs.length; j++)
        newArgs[j] = arguments[j];
      var all = args.concat(newArgs);
      return f.apply(null, all);
    };
  };
  var not = function (f) {
    return function () {
      return !f.apply(null, arguments);
    };
  };
  var die = function (msg) {
    return function () {
      throw new Error(msg);
    };
  };
  var apply = function (f) {
    return f();
  };
  var call = function (f) {
    f();
  };
  var never = constant(false);
  var always = constant(true);
  var $_aoet5bwbjd24rmfz = {
    noop: noop,
    noarg: noarg,
    compose: compose,
    constant: constant,
    identity: identity,
    tripleEquals: tripleEquals,
    curry: curry,
    not: not,
    die: die,
    apply: apply,
    call: call,
    never: never,
    always: always
  };

  var never$1 = $_aoet5bwbjd24rmfz.never;
  var always$1 = $_aoet5bwbjd24rmfz.always;
  var none = function () {
    return NONE;
  };
  var NONE = function () {
    var eq = function (o) {
      return o.isNone();
    };
    var call = function (thunk) {
      return thunk();
    };
    var id = function (n) {
      return n;
    };
    var noop = function () {
    };
    var me = {
      fold: function (n, s) {
        return n();
      },
      is: never$1,
      isSome: never$1,
      isNone: always$1,
      getOr: id,
      getOrThunk: call,
      getOrDie: function (msg) {
        throw new Error(msg || 'error: getOrDie called on none.');
      },
      or: id,
      orThunk: call,
      map: none,
      ap: none,
      each: noop,
      bind: none,
      flatten: none,
      exists: never$1,
      forall: always$1,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray: function () {
        return [];
      },
      toString: $_aoet5bwbjd24rmfz.constant('none()')
    };
    if (Object.freeze)
      Object.freeze(me);
    return me;
  }();
  var some = function (a) {
    var constant_a = function () {
      return a;
    };
    var self = function () {
      return me;
    };
    var map = function (f) {
      return some(f(a));
    };
    var bind = function (f) {
      return f(a);
    };
    var me = {
      fold: function (n, s) {
        return s(a);
      },
      is: function (v) {
        return a === v;
      },
      isSome: always$1,
      isNone: never$1,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      or: self,
      orThunk: self,
      map: map,
      ap: function (optfab) {
        return optfab.fold(none, function (fab) {
          return some(fab(a));
        });
      },
      each: function (f) {
        f(a);
      },
      bind: bind,
      flatten: constant_a,
      exists: bind,
      forall: bind,
      filter: function (f) {
        return f(a) ? me : NONE;
      },
      equals: function (o) {
        return o.is(a);
      },
      equals_: function (o, elementEq) {
        return o.fold(never$1, function (b) {
          return elementEq(a, b);
        });
      },
      toArray: function () {
        return [a];
      },
      toString: function () {
        return 'some(' + a + ')';
      }
    };
    return me;
  };
  var from = function (value) {
    return value === null || value === undefined ? NONE : some(value);
  };
  var $_asi680wajd24rmfv = {
    some: some,
    none: none,
    from: from
  };

  var rawIndexOf = function () {
    var pIndexOf = Array.prototype.indexOf;
    var fastIndex = function (xs, x) {
      return pIndexOf.call(xs, x);
    };
    var slowIndex = function (xs, x) {
      return slowIndexOf(xs, x);
    };
    return pIndexOf === undefined ? slowIndex : fastIndex;
  }();
  var indexOf = function (xs, x) {
    var r = rawIndexOf(xs, x);
    return r === -1 ? $_asi680wajd24rmfv.none() : $_asi680wajd24rmfv.some(r);
  };
  var contains = function (xs, x) {
    return rawIndexOf(xs, x) > -1;
  };
  var exists = function (xs, pred) {
    return findIndex(xs, pred).isSome();
  };
  var range = function (num, f) {
    var r = [];
    for (var i = 0; i < num; i++) {
      r.push(f(i));
    }
    return r;
  };
  var chunk = function (array, size) {
    var r = [];
    for (var i = 0; i < array.length; i += size) {
      var s = array.slice(i, i + size);
      r.push(s);
    }
    return r;
  };
  var map = function (xs, f) {
    var len = xs.length;
    var r = new Array(len);
    for (var i = 0; i < len; i++) {
      var x = xs[i];
      r[i] = f(x, i, xs);
    }
    return r;
  };
  var each = function (xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var eachr = function (xs, f) {
    for (var i = xs.length - 1; i >= 0; i--) {
      var x = xs[i];
      f(x, i, xs);
    }
  };
  var partition = function (xs, pred) {
    var pass = [];
    var fail = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      var arr = pred(x, i, xs) ? pass : fail;
      arr.push(x);
    }
    return {
      pass: pass,
      fail: fail
    };
  };
  var filter = function (xs, pred) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        r.push(x);
      }
    }
    return r;
  };
  var groupBy = function (xs, f) {
    if (xs.length === 0) {
      return [];
    } else {
      var wasType = f(xs[0]);
      var r = [];
      var group = [];
      for (var i = 0, len = xs.length; i < len; i++) {
        var x = xs[i];
        var type = f(x);
        if (type !== wasType) {
          r.push(group);
          group = [];
        }
        wasType = type;
        group.push(x);
      }
      if (group.length !== 0) {
        r.push(group);
      }
      return r;
    }
  };
  var foldr = function (xs, f, acc) {
    eachr(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var foldl = function (xs, f, acc) {
    each(xs, function (x) {
      acc = f(acc, x);
    });
    return acc;
  };
  var find = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_asi680wajd24rmfv.some(x);
      }
    }
    return $_asi680wajd24rmfv.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_asi680wajd24rmfv.some(i);
      }
    }
    return $_asi680wajd24rmfv.none();
  };
  var slowIndexOf = function (xs, x) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (xs[i] === x) {
        return i;
      }
    }
    return -1;
  };
  var push = Array.prototype.push;
  var flatten = function (xs) {
    var r = [];
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (!Array.prototype.isPrototypeOf(xs[i]))
        throw new Error('Arr.flatten item ' + i + ' was not an array, input: ' + xs);
      push.apply(r, xs[i]);
    }
    return r;
  };
  var bind = function (xs, f) {
    var output = map(xs, f);
    return flatten(output);
  };
  var forall = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      var x = xs[i];
      if (pred(x, i, xs) !== true) {
        return false;
      }
    }
    return true;
  };
  var equal = function (a1, a2) {
    return a1.length === a2.length && forall(a1, function (x, i) {
      return x === a2[i];
    });
  };
  var slice = Array.prototype.slice;
  var reverse = function (xs) {
    var r = slice.call(xs, 0);
    r.reverse();
    return r;
  };
  var difference = function (a1, a2) {
    return filter(a1, function (x) {
      return !contains(a2, x);
    });
  };
  var mapToObject = function (xs, f) {
    var r = {};
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      r[String(x)] = f(x, i);
    }
    return r;
  };
  var pure = function (x) {
    return [x];
  };
  var sort = function (xs, comparator) {
    var copy = slice.call(xs, 0);
    copy.sort(comparator);
    return copy;
  };
  var head = function (xs) {
    return xs.length === 0 ? $_asi680wajd24rmfv.none() : $_asi680wajd24rmfv.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? $_asi680wajd24rmfv.none() : $_asi680wajd24rmfv.some(xs[xs.length - 1]);
  };
  var $_3vsestw9jd24rmfo = {
    map: map,
    each: each,
    eachr: eachr,
    partition: partition,
    filter: filter,
    groupBy: groupBy,
    indexOf: indexOf,
    foldr: foldr,
    foldl: foldl,
    find: find,
    findIndex: findIndex,
    flatten: flatten,
    bind: bind,
    forall: forall,
    exists: exists,
    contains: contains,
    equal: equal,
    reverse: reverse,
    chunk: chunk,
    difference: difference,
    mapToObject: mapToObject,
    pure: pure,
    sort: sort,
    range: range,
    head: head,
    last: last
  };

  var global = typeof window !== 'undefined' ? window : Function('return this;')();

  var path = function (parts, scope) {
    var o = scope !== undefined && scope !== null ? scope : global;
    for (var i = 0; i < parts.length && o !== undefined && o !== null; ++i)
      o = o[parts[i]];
    return o;
  };
  var resolve = function (p, scope) {
    var parts = p.split('.');
    return path(parts, scope);
  };
  var step = function (o, part) {
    if (o[part] === undefined || o[part] === null)
      o[part] = {};
    return o[part];
  };
  var forge = function (parts, target) {
    var o = target !== undefined ? target : global;
    for (var i = 0; i < parts.length; ++i)
      o = step(o, parts[i]);
    return o;
  };
  var namespace = function (name, target) {
    var parts = name.split('.');
    return forge(parts, target);
  };
  var $_3pup6ywejd24rmg6 = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_3pup6ywejd24rmg6.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_2au6sowdjd24rmg4 = { getOrDie: getOrDie };

  var node = function () {
    var f = $_2au6sowdjd24rmg4.getOrDie('Node');
    return f;
  };
  var compareDocumentPosition = function (a, b, match) {
    return (a.compareDocumentPosition(b) & match) !== 0;
  };
  var documentPositionPreceding = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_PRECEDING);
  };
  var documentPositionContainedBy = function (a, b) {
    return compareDocumentPosition(a, b, node().DOCUMENT_POSITION_CONTAINED_BY);
  };
  var $_8n1loswcjd24rmg3 = {
    documentPositionPreceding: documentPositionPreceding,
    documentPositionContainedBy: documentPositionContainedBy
  };

  var cached = function (f) {
    var called = false;
    var r;
    return function () {
      if (!called) {
        called = true;
        r = f.apply(null, arguments);
      }
      return r;
    };
  };
  var $_4myblwwhjd24rmgb = { cached: cached };

  var firstMatch = function (regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s))
        return x;
    }
    return undefined;
  };
  var find$1 = function (regexes, agent) {
    var r = firstMatch(regexes, agent);
    if (!r)
      return {
        major: 0,
        minor: 0
      };
    var group = function (i) {
      return Number(agent.replace(r, '$' + i));
    };
    return nu(group(1), group(2));
  };
  var detect = function (versionRegexes, agent) {
    var cleanedAgent = String(agent).toLowerCase();
    if (versionRegexes.length === 0)
      return unknown();
    return find$1(versionRegexes, cleanedAgent);
  };
  var unknown = function () {
    return nu(0, 0);
  };
  var nu = function (major, minor) {
    return {
      major: major,
      minor: minor
    };
  };
  var $_65t85bwkjd24rmgg = {
    nu: nu,
    detect: detect,
    unknown: unknown
  };

  var edge = 'Edge';
  var chrome = 'Chrome';
  var ie = 'IE';
  var opera = 'Opera';
  var firefox = 'Firefox';
  var safari = 'Safari';
  var isBrowser = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$1 = function () {
    return nu$1({
      current: undefined,
      version: $_65t85bwkjd24rmgg.unknown()
    });
  };
  var nu$1 = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isEdge: isBrowser(edge, current),
      isChrome: isBrowser(chrome, current),
      isIE: isBrowser(ie, current),
      isOpera: isBrowser(opera, current),
      isFirefox: isBrowser(firefox, current),
      isSafari: isBrowser(safari, current)
    };
  };
  var $_92a2mwjjd24rmgd = {
    unknown: unknown$1,
    nu: nu$1,
    edge: $_aoet5bwbjd24rmfz.constant(edge),
    chrome: $_aoet5bwbjd24rmfz.constant(chrome),
    ie: $_aoet5bwbjd24rmfz.constant(ie),
    opera: $_aoet5bwbjd24rmfz.constant(opera),
    firefox: $_aoet5bwbjd24rmfz.constant(firefox),
    safari: $_aoet5bwbjd24rmfz.constant(safari)
  };

  var windows = 'Windows';
  var ios = 'iOS';
  var android = 'Android';
  var linux = 'Linux';
  var osx = 'OSX';
  var solaris = 'Solaris';
  var freebsd = 'FreeBSD';
  var isOS = function (name, current) {
    return function () {
      return current === name;
    };
  };
  var unknown$2 = function () {
    return nu$2({
      current: undefined,
      version: $_65t85bwkjd24rmgg.unknown()
    });
  };
  var nu$2 = function (info) {
    var current = info.current;
    var version = info.version;
    return {
      current: current,
      version: version,
      isWindows: isOS(windows, current),
      isiOS: isOS(ios, current),
      isAndroid: isOS(android, current),
      isOSX: isOS(osx, current),
      isLinux: isOS(linux, current),
      isSolaris: isOS(solaris, current),
      isFreeBSD: isOS(freebsd, current)
    };
  };
  var $_63jcglwljd24rmgh = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_aoet5bwbjd24rmfz.constant(windows),
    ios: $_aoet5bwbjd24rmfz.constant(ios),
    android: $_aoet5bwbjd24rmfz.constant(android),
    linux: $_aoet5bwbjd24rmfz.constant(linux),
    osx: $_aoet5bwbjd24rmfz.constant(osx),
    solaris: $_aoet5bwbjd24rmfz.constant(solaris),
    freebsd: $_aoet5bwbjd24rmfz.constant(freebsd)
  };

  function DeviceType (os, browser, userAgent) {
    var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true;
    var isiPhone = os.isiOS() && !isiPad;
    var isAndroid3 = os.isAndroid() && os.version.major === 3;
    var isAndroid4 = os.isAndroid() && os.version.major === 4;
    var isTablet = isiPad || isAndroid3 || isAndroid4 && /mobile/i.test(userAgent) === true;
    var isTouch = os.isiOS() || os.isAndroid();
    var isPhone = isTouch && !isTablet;
    var iOSwebview = browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false;
    return {
      isiPad: $_aoet5bwbjd24rmfz.constant(isiPad),
      isiPhone: $_aoet5bwbjd24rmfz.constant(isiPhone),
      isTablet: $_aoet5bwbjd24rmfz.constant(isTablet),
      isPhone: $_aoet5bwbjd24rmfz.constant(isPhone),
      isTouch: $_aoet5bwbjd24rmfz.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_aoet5bwbjd24rmfz.constant(iOSwebview)
    };
  }

  var detect$1 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_3vsestw9jd24rmfo.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$1(browsers, userAgent).map(function (browser) {
      var version = $_65t85bwkjd24rmgg.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$1(oses, userAgent).map(function (os) {
      var version = $_65t85bwkjd24rmgg.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_c3jg13wnjd24rmgm = {
    detectBrowser: detectBrowser,
    detectOs: detectOs
  };

  var addToStart = function (str, prefix) {
    return prefix + str;
  };
  var addToEnd = function (str, suffix) {
    return str + suffix;
  };
  var removeFromStart = function (str, numChars) {
    return str.substring(numChars);
  };
  var removeFromEnd = function (str, numChars) {
    return str.substring(0, str.length - numChars);
  };
  var $_2t562rwqjd24rmh1 = {
    addToStart: addToStart,
    addToEnd: addToEnd,
    removeFromStart: removeFromStart,
    removeFromEnd: removeFromEnd
  };

  var first = function (str, count) {
    return str.substr(0, count);
  };
  var last$1 = function (str, count) {
    return str.substr(str.length - count, str.length);
  };
  var head$1 = function (str) {
    return str === '' ? $_asi680wajd24rmfv.none() : $_asi680wajd24rmfv.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? $_asi680wajd24rmfv.none() : $_asi680wajd24rmfv.some(str.substring(1));
  };
  var $_18sniqwrjd24rmh2 = {
    first: first,
    last: last$1,
    head: head$1,
    tail: tail
  };

  var checkRange = function (str, substr, start) {
    if (substr === '')
      return true;
    if (str.length < substr.length)
      return false;
    var x = str.substr(start, start + substr.length);
    return x === substr;
  };
  var supplant = function (str, obj) {
    var isStringOrNumber = function (a) {
      var t = typeof a;
      return t === 'string' || t === 'number';
    };
    return str.replace(/\${([^{}]*)}/g, function (a, b) {
      var value = obj[b];
      return isStringOrNumber(value) ? value : a;
    });
  };
  var removeLeading = function (str, prefix) {
    return startsWith(str, prefix) ? $_2t562rwqjd24rmh1.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_2t562rwqjd24rmh1.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_2t562rwqjd24rmh1.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_2t562rwqjd24rmh1.addToEnd(str, prefix);
  };
  var contains$1 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_18sniqwrjd24rmh2.head(str).bind(function (head) {
      return $_18sniqwrjd24rmh2.tail(str).map(function (tail) {
        return head.toUpperCase() + tail;
      });
    }).getOr(str);
  };
  var startsWith = function (str, prefix) {
    return checkRange(str, prefix, 0);
  };
  var endsWith = function (str, suffix) {
    return checkRange(str, suffix, str.length - suffix.length);
  };
  var trim = function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  };
  var lTrim = function (str) {
    return str.replace(/^\s+/g, '');
  };
  var rTrim = function (str) {
    return str.replace(/\s+$/g, '');
  };
  var $_cgnhvywpjd24rmgz = {
    supplant: supplant,
    startsWith: startsWith,
    removeLeading: removeLeading,
    removeTrailing: removeTrailing,
    ensureLeading: ensureLeading,
    ensureTrailing: ensureTrailing,
    endsWith: endsWith,
    contains: contains$1,
    trim: trim,
    lTrim: lTrim,
    rTrim: rTrim,
    capitalize: capitalize
  };

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/;
  var checkContains = function (target) {
    return function (uastring) {
      return $_cgnhvywpjd24rmgz.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_cgnhvywpjd24rmgz.contains(uastring, 'edge/') && $_cgnhvywpjd24rmgz.contains(uastring, 'chrome') && $_cgnhvywpjd24rmgz.contains(uastring, 'safari') && $_cgnhvywpjd24rmgz.contains(uastring, 'applewebkit');
        return monstrosity;
      }
    },
    {
      name: 'Chrome',
      versionRegexes: [
        /.*?chrome\/([0-9]+)\.([0-9]+).*/,
        normalVersionRegex
      ],
      search: function (uastring) {
        return $_cgnhvywpjd24rmgz.contains(uastring, 'chrome') && !$_cgnhvywpjd24rmgz.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_cgnhvywpjd24rmgz.contains(uastring, 'msie') || $_cgnhvywpjd24rmgz.contains(uastring, 'trident');
      }
    },
    {
      name: 'Opera',
      versionRegexes: [
        normalVersionRegex,
        /.*?opera\/([0-9]+)\.([0-9]+).*/
      ],
      search: checkContains('opera')
    },
    {
      name: 'Firefox',
      versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
      search: checkContains('firefox')
    },
    {
      name: 'Safari',
      versionRegexes: [
        normalVersionRegex,
        /.*?cpu os ([0-9]+)_([0-9]+).*/
      ],
      search: function (uastring) {
        return ($_cgnhvywpjd24rmgz.contains(uastring, 'safari') || $_cgnhvywpjd24rmgz.contains(uastring, 'mobile/')) && $_cgnhvywpjd24rmgz.contains(uastring, 'applewebkit');
      }
    }
  ];
  var oses = [
    {
      name: 'Windows',
      search: checkContains('win'),
      versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'iOS',
      search: function (uastring) {
        return $_cgnhvywpjd24rmgz.contains(uastring, 'iphone') || $_cgnhvywpjd24rmgz.contains(uastring, 'ipad');
      },
      versionRegexes: [
        /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
        /.*cpu os ([0-9]+)_([0-9]+).*/,
        /.*cpu iphone os ([0-9]+)_([0-9]+).*/
      ]
    },
    {
      name: 'Android',
      search: checkContains('android'),
      versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'OSX',
      search: checkContains('os x'),
      versionRegexes: [/.*?os\ x\ ?([0-9]+)_([0-9]+).*/]
    },
    {
      name: 'Linux',
      search: checkContains('linux'),
      versionRegexes: []
    },
    {
      name: 'Solaris',
      search: checkContains('sunos'),
      versionRegexes: []
    },
    {
      name: 'FreeBSD',
      search: checkContains('freebsd'),
      versionRegexes: []
    }
  ];
  var $_dr44vnwojd24rmgp = {
    browsers: $_aoet5bwbjd24rmfz.constant(browsers),
    oses: $_aoet5bwbjd24rmfz.constant(oses)
  };

  var detect$2 = function (userAgent) {
    var browsers = $_dr44vnwojd24rmgp.browsers();
    var oses = $_dr44vnwojd24rmgp.oses();
    var browser = $_c3jg13wnjd24rmgm.detectBrowser(browsers, userAgent).fold($_92a2mwjjd24rmgd.unknown, $_92a2mwjjd24rmgd.nu);
    var os = $_c3jg13wnjd24rmgm.detectOs(oses, userAgent).fold($_63jcglwljd24rmgh.unknown, $_63jcglwljd24rmgh.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_4fyq84wijd24rmgc = { detect: detect$2 };

  var detect$3 = $_4myblwwhjd24rmgb.cached(function () {
    var userAgent = navigator.userAgent;
    return $_4fyq84wijd24rmgc.detect(userAgent);
  });
  var $_1616jcwgjd24rmg9 = { detect: detect$3 };

  var fromHtml = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    if (!div.hasChildNodes() || div.childNodes.length > 1) {
      console.error('HTML does not have a single root node', html);
      throw 'HTML must have a single root node';
    }
    return fromDom(div.childNodes[0]);
  };
  var fromTag = function (tag, scope) {
    var doc = scope || document;
    var node = doc.createElement(tag);
    return fromDom(node);
  };
  var fromText = function (text, scope) {
    var doc = scope || document;
    var node = doc.createTextNode(text);
    return fromDom(node);
  };
  var fromDom = function (node) {
    if (node === null || node === undefined)
      throw new Error('Node cannot be null or undefined');
    return { dom: $_aoet5bwbjd24rmfz.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return $_asi680wajd24rmfv.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_ei6gqxwtjd24rmh8 = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_ewuxfvwujd24rmhb = {
    ATTRIBUTE: 2,
    CDATA_SECTION: 4,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    ELEMENT: 1,
    TEXT: 3,
    PROCESSING_INSTRUCTION: 7,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    NOTATION: 12
  };

  var ELEMENT = $_ewuxfvwujd24rmhb.ELEMENT;
  var DOCUMENT = $_ewuxfvwujd24rmhb.DOCUMENT;
  var is = function (element, selector) {
    var elem = element.dom();
    if (elem.nodeType !== ELEMENT)
      return false;
    else if (elem.matches !== undefined)
      return elem.matches(selector);
    else if (elem.msMatchesSelector !== undefined)
      return elem.msMatchesSelector(selector);
    else if (elem.webkitMatchesSelector !== undefined)
      return elem.webkitMatchesSelector(selector);
    else if (elem.mozMatchesSelector !== undefined)
      return elem.mozMatchesSelector(selector);
    else
      throw new Error('Browser lacks native selectors');
  };
  var bypassSelector = function (dom) {
    return dom.nodeType !== ELEMENT && dom.nodeType !== DOCUMENT || dom.childElementCount === 0;
  };
  var all = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? [] : $_3vsestw9jd24rmfo.map(base.querySelectorAll(selector), $_ei6gqxwtjd24rmh8.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? $_asi680wajd24rmfv.none() : $_asi680wajd24rmfv.from(base.querySelector(selector)).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var $_afm3pxwsjd24rmh3 = {
    all: all,
    is: is,
    one: one
  };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_3vsestw9jd24rmfo.exists(elements, $_aoet5bwbjd24rmfz.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_8n1loswcjd24rmg3.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = $_1616jcwgjd24rmg9.detect().browser;
  var contains$2 = browser.isIE() ? ieContains : regularContains;
  var $_237cqww8jd24rmfh = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains$2,
    is: $_afm3pxwsjd24rmh3.is
  };

  var isSource = function (component, simulatedEvent) {
    return $_237cqww8jd24rmfh.eq(component.element(), simulatedEvent.event().target());
  };
  var $_3i0tdiw7jd24rmff = { isSource: isSource };

  var $_1tcfm9wxjd24rmhk = {
    contextmenu: $_aoet5bwbjd24rmfz.constant('contextmenu'),
    touchstart: $_aoet5bwbjd24rmfz.constant('touchstart'),
    touchmove: $_aoet5bwbjd24rmfz.constant('touchmove'),
    touchend: $_aoet5bwbjd24rmfz.constant('touchend'),
    gesturestart: $_aoet5bwbjd24rmfz.constant('gesturestart'),
    mousedown: $_aoet5bwbjd24rmfz.constant('mousedown'),
    mousemove: $_aoet5bwbjd24rmfz.constant('mousemove'),
    mouseout: $_aoet5bwbjd24rmfz.constant('mouseout'),
    mouseup: $_aoet5bwbjd24rmfz.constant('mouseup'),
    mouseover: $_aoet5bwbjd24rmfz.constant('mouseover'),
    focusin: $_aoet5bwbjd24rmfz.constant('focusin'),
    keydown: $_aoet5bwbjd24rmfz.constant('keydown'),
    input: $_aoet5bwbjd24rmfz.constant('input'),
    change: $_aoet5bwbjd24rmfz.constant('change'),
    focus: $_aoet5bwbjd24rmfz.constant('focus'),
    click: $_aoet5bwbjd24rmfz.constant('click'),
    transitionend: $_aoet5bwbjd24rmfz.constant('transitionend'),
    selectstart: $_aoet5bwbjd24rmfz.constant('selectstart')
  };

  var alloy = { tap: $_aoet5bwbjd24rmfz.constant('alloy.tap') };
  var $_9am11ywwjd24rmhg = {
    focus: $_aoet5bwbjd24rmfz.constant('alloy.focus'),
    postBlur: $_aoet5bwbjd24rmfz.constant('alloy.blur.post'),
    receive: $_aoet5bwbjd24rmfz.constant('alloy.receive'),
    execute: $_aoet5bwbjd24rmfz.constant('alloy.execute'),
    focusItem: $_aoet5bwbjd24rmfz.constant('alloy.focus.item'),
    tap: alloy.tap,
    tapOrClick: $_1616jcwgjd24rmg9.detect().deviceType.isTouch() ? alloy.tap : $_1tcfm9wxjd24rmhk.click,
    longpress: $_aoet5bwbjd24rmfz.constant('alloy.longpress'),
    sandboxClose: $_aoet5bwbjd24rmfz.constant('alloy.sandbox.close'),
    systemInit: $_aoet5bwbjd24rmfz.constant('alloy.system.init'),
    windowScroll: $_aoet5bwbjd24rmfz.constant('alloy.system.scroll'),
    attachedToDom: $_aoet5bwbjd24rmfz.constant('alloy.system.attached'),
    detachedFromDom: $_aoet5bwbjd24rmfz.constant('alloy.system.detached'),
    changeTab: $_aoet5bwbjd24rmfz.constant('alloy.change.tab'),
    dismissTab: $_aoet5bwbjd24rmfz.constant('alloy.dismiss.tab')
  };

  var typeOf = function (x) {
    if (x === null)
      return 'null';
    var t = typeof x;
    if (t === 'object' && Array.prototype.isPrototypeOf(x))
      return 'array';
    if (t === 'object' && String.prototype.isPrototypeOf(x))
      return 'string';
    return t;
  };
  var isType = function (type) {
    return function (value) {
      return typeOf(value) === type;
    };
  };
  var $_cbf8cdwzjd24rmhn = {
    isString: isType('string'),
    isObject: isType('object'),
    isArray: isType('array'),
    isNull: isType('null'),
    isBoolean: isType('boolean'),
    isUndefined: isType('undefined'),
    isFunction: isType('function'),
    isNumber: isType('number')
  };

  var shallow = function (old, nu) {
    return nu;
  };
  var deep = function (old, nu) {
    var bothObjects = $_cbf8cdwzjd24rmhn.isObject(old) && $_cbf8cdwzjd24rmhn.isObject(nu);
    return bothObjects ? deepMerge(old, nu) : nu;
  };
  var baseMerge = function (merger) {
    return function () {
      var objects = new Array(arguments.length);
      for (var i = 0; i < objects.length; i++)
        objects[i] = arguments[i];
      if (objects.length === 0)
        throw new Error('Can\'t merge zero objects');
      var ret = {};
      for (var j = 0; j < objects.length; j++) {
        var curObject = objects[j];
        for (var key in curObject)
          if (curObject.hasOwnProperty(key)) {
            ret[key] = merger(ret[key], curObject[key]);
          }
      }
      return ret;
    };
  };
  var deepMerge = baseMerge(deep);
  var merge = baseMerge(shallow);
  var $_4x4s83wyjd24rmhm = {
    deepMerge: deepMerge,
    merge: merge
  };

  var keys = function () {
    var fastKeys = Object.keys;
    var slowKeys = function (o) {
      var r = [];
      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          r.push(i);
        }
      }
      return r;
    };
    return fastKeys === undefined ? slowKeys : fastKeys;
  }();
  var each$1 = function (obj, f) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      f(x, i, obj);
    }
  };
  var objectMap = function (obj, f) {
    return tupleMap(obj, function (x, i, obj) {
      return {
        k: i,
        v: f(x, i, obj)
      };
    });
  };
  var tupleMap = function (obj, f) {
    var r = {};
    each$1(obj, function (x, i) {
      var tuple = f(x, i, obj);
      r[tuple.k] = tuple.v;
    });
    return r;
  };
  var bifilter = function (obj, pred) {
    var t = {};
    var f = {};
    each$1(obj, function (x, i) {
      var branch = pred(x, i) ? t : f;
      branch[i] = x;
    });
    return {
      t: t,
      f: f
    };
  };
  var mapToArray = function (obj, f) {
    var r = [];
    each$1(obj, function (value, name) {
      r.push(f(value, name));
    });
    return r;
  };
  var find$2 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return $_asi680wajd24rmfv.some(x);
      }
    }
    return $_asi680wajd24rmfv.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_2hhb0ax0jd24rmhp = {
    bifilter: bifilter,
    each: each$1,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$2,
    keys: keys,
    values: values,
    size: size
  };

  var emit = function (component, event) {
    dispatchWith(component, component.element(), event, {});
  };
  var emitWith = function (component, event, properties) {
    dispatchWith(component, component.element(), event, properties);
  };
  var emitExecute = function (component) {
    emit(component, $_9am11ywwjd24rmhg.execute());
  };
  var dispatch = function (component, target, event) {
    dispatchWith(component, target, event, {});
  };
  var dispatchWith = function (component, target, event, properties) {
    var data = $_4x4s83wyjd24rmhm.deepMerge({ target: target }, properties);
    component.getSystem().triggerEvent(event, target, $_2hhb0ax0jd24rmhp.map(data, $_aoet5bwbjd24rmfz.constant));
  };
  var dispatchEvent = function (component, target, event, simulatedEvent) {
    component.getSystem().triggerEvent(event, target, simulatedEvent.event());
  };
  var dispatchFocus = function (component, target) {
    component.getSystem().triggerFocus(target, component.element());
  };
  var $_eljod2wvjd24rmhc = {
    emit: emit,
    emitWith: emitWith,
    emitExecute: emitExecute,
    dispatch: dispatch,
    dispatchWith: dispatchWith,
    dispatchEvent: dispatchEvent,
    dispatchFocus: dispatchFocus
  };

  var generate = function (cases) {
    if (!$_cbf8cdwzjd24rmhn.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_3vsestw9jd24rmfo.each(cases, function (acase, count) {
      var keys = $_2hhb0ax0jd24rmhp.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_cbf8cdwzjd24rmhn.isArray(value)) {
        throw new Error('case arguments must be an array');
      }
      constructors.push(key);
      adt[key] = function () {
        var argLength = arguments.length;
        if (argLength !== value.length) {
          throw new Error('Wrong number of arguments to case ' + key + '. Expected ' + value.length + ' (' + value + '), got ' + argLength);
        }
        var args = new Array(argLength);
        for (var i = 0; i < args.length; i++)
          args[i] = arguments[i];
        var match = function (branches) {
          var branchKeys = $_2hhb0ax0jd24rmhp.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_3vsestw9jd24rmfo.forall(constructors, function (reqKey) {
            return $_3vsestw9jd24rmfo.contains(branchKeys, reqKey);
          });
          if (!allReqd)
            throw new Error('Not all branches were specified when using match. Specified: ' + branchKeys.join(', ') + '\nRequired: ' + constructors.join(', '));
          return branches[key].apply(null, args);
        };
        return {
          fold: function () {
            if (arguments.length !== cases.length) {
              throw new Error('Wrong number of arguments to fold. Expected ' + cases.length + ', got ' + arguments.length);
            }
            var target = arguments[count];
            return target.apply(null, args);
          },
          match: match,
          log: function (label) {
            console.log(label, {
              constructors: constructors,
              constructor: key,
              params: args
            });
          }
        };
      };
    });
    return adt;
  };
  var $_45w193x4jd24rmi8 = { generate: generate };

  var adt = $_45w193x4jd24rmi8.generate([
    { strict: [] },
    { defaultedThunk: ['fallbackThunk'] },
    { asOption: [] },
    { asDefaultedOptionThunk: ['fallbackThunk'] },
    { mergeWithThunk: ['baseThunk'] }
  ]);
  var defaulted = function (fallback) {
    return adt.defaultedThunk($_aoet5bwbjd24rmfz.constant(fallback));
  };
  var asDefaultedOption = function (fallback) {
    return adt.asDefaultedOptionThunk($_aoet5bwbjd24rmfz.constant(fallback));
  };
  var mergeWith = function (base) {
    return adt.mergeWithThunk($_aoet5bwbjd24rmfz.constant(base));
  };
  var $_a33fuhx3jd24rmi5 = {
    strict: adt.strict,
    asOption: adt.asOption,
    defaulted: defaulted,
    defaultedThunk: adt.defaultedThunk,
    asDefaultedOption: asDefaultedOption,
    asDefaultedOptionThunk: adt.asDefaultedOptionThunk,
    mergeWith: mergeWith,
    mergeWithThunk: adt.mergeWithThunk
  };

  var value = function (o) {
    var is = function (v) {
      return o === v;
    };
    var or = function (opt) {
      return value(o);
    };
    var orThunk = function (f) {
      return value(o);
    };
    var map = function (f) {
      return value(f(o));
    };
    var each = function (f) {
      f(o);
    };
    var bind = function (f) {
      return f(o);
    };
    var fold = function (_, onValue) {
      return onValue(o);
    };
    var exists = function (f) {
      return f(o);
    };
    var forall = function (f) {
      return f(o);
    };
    var toOption = function () {
      return $_asi680wajd24rmfv.some(o);
    };
    return {
      is: is,
      isValue: $_aoet5bwbjd24rmfz.constant(true),
      isError: $_aoet5bwbjd24rmfz.constant(false),
      getOr: $_aoet5bwbjd24rmfz.constant(o),
      getOrThunk: $_aoet5bwbjd24rmfz.constant(o),
      getOrDie: $_aoet5bwbjd24rmfz.constant(o),
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: each,
      bind: bind,
      exists: exists,
      forall: forall,
      toOption: toOption
    };
  };
  var error = function (message) {
    var getOrThunk = function (f) {
      return f();
    };
    var getOrDie = function () {
      return $_aoet5bwbjd24rmfz.die(message)();
    };
    var or = function (opt) {
      return opt;
    };
    var orThunk = function (f) {
      return f();
    };
    var map = function (f) {
      return error(message);
    };
    var bind = function (f) {
      return error(message);
    };
    var fold = function (onError, _) {
      return onError(message);
    };
    return {
      is: $_aoet5bwbjd24rmfz.constant(false),
      isValue: $_aoet5bwbjd24rmfz.constant(false),
      isError: $_aoet5bwbjd24rmfz.constant(true),
      getOr: $_aoet5bwbjd24rmfz.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_aoet5bwbjd24rmfz.noop,
      bind: bind,
      exists: $_aoet5bwbjd24rmfz.constant(false),
      forall: $_aoet5bwbjd24rmfz.constant(true),
      toOption: $_asi680wajd24rmfv.none
    };
  };
  var $_b2qdiox8jd24rmj0 = {
    value: value,
    error: error
  };

  var comparison = $_45w193x4jd24rmi8.generate([
    {
      bothErrors: [
        'error1',
        'error2'
      ]
    },
    {
      firstError: [
        'error1',
        'value2'
      ]
    },
    {
      secondError: [
        'value1',
        'error2'
      ]
    },
    {
      bothValues: [
        'value1',
        'value2'
      ]
    }
  ]);
  var partition$1 = function (results) {
    var errors = [];
    var values = [];
    $_3vsestw9jd24rmfo.each(results, function (result) {
      result.fold(function (err) {
        errors.push(err);
      }, function (value) {
        values.push(value);
      });
    });
    return {
      errors: errors,
      values: values
    };
  };
  var compare = function (result1, result2) {
    return result1.fold(function (err1) {
      return result2.fold(function (err2) {
        return comparison.bothErrors(err1, err2);
      }, function (val2) {
        return comparison.firstError(err1, val2);
      });
    }, function (val1) {
      return result2.fold(function (err2) {
        return comparison.secondError(val1, err2);
      }, function (val2) {
        return comparison.bothValues(val1, val2);
      });
    });
  };
  var $_fhfrs2x9jd24rmj2 = {
    partition: partition$1,
    compare: compare
  };

  var mergeValues = function (values, base) {
    return $_b2qdiox8jd24rmj0.value($_4x4s83wyjd24rmhm.deepMerge.apply(undefined, [base].concat(values)));
  };
  var mergeErrors = function (errors) {
    return $_aoet5bwbjd24rmfz.compose($_b2qdiox8jd24rmj0.error, $_3vsestw9jd24rmfo.flatten)(errors);
  };
  var consolidateObj = function (objects, base) {
    var partitions = $_fhfrs2x9jd24rmj2.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : mergeValues(partitions.values, base);
  };
  var consolidateArr = function (objects) {
    var partitions = $_fhfrs2x9jd24rmj2.partition(objects);
    return partitions.errors.length > 0 ? mergeErrors(partitions.errors) : $_b2qdiox8jd24rmj0.value(partitions.values);
  };
  var $_3vm2b3x7jd24rmiu = {
    consolidateObj: consolidateObj,
    consolidateArr: consolidateArr
  };

  var narrow = function (obj, fields) {
    var r = {};
    $_3vsestw9jd24rmfo.each(fields, function (field) {
      if (obj[field] !== undefined && obj.hasOwnProperty(field))
        r[field] = obj[field];
    });
    return r;
  };
  var indexOnKey = function (array, key) {
    var obj = {};
    $_3vsestw9jd24rmfo.each(array, function (a) {
      var keyValue = a[key];
      obj[keyValue] = a;
    });
    return obj;
  };
  var exclude = function (obj, fields) {
    var r = {};
    $_2hhb0ax0jd24rmhp.each(obj, function (v, k) {
      if (!$_3vsestw9jd24rmfo.contains(fields, k)) {
        r[k] = v;
      }
    });
    return r;
  };
  var $_91ir9gxajd24rmj4 = {
    narrow: narrow,
    exclude: exclude,
    indexOnKey: indexOnKey
  };

  var readOpt = function (key) {
    return function (obj) {
      return obj.hasOwnProperty(key) ? $_asi680wajd24rmfv.from(obj[key]) : $_asi680wajd24rmfv.none();
    };
  };
  var readOr = function (key, fallback) {
    return function (obj) {
      return readOpt(key)(obj).getOr(fallback);
    };
  };
  var readOptFrom = function (obj, key) {
    return readOpt(key)(obj);
  };
  var hasKey = function (obj, key) {
    return obj.hasOwnProperty(key) && obj[key] !== undefined && obj[key] !== null;
  };
  var $_evqlq2xbjd24rmj7 = {
    readOpt: readOpt,
    readOr: readOr,
    readOptFrom: readOptFrom,
    hasKey: hasKey
  };

  var wrap = function (key, value) {
    var r = {};
    r[key] = value;
    return r;
  };
  var wrapAll = function (keyvalues) {
    var r = {};
    $_3vsestw9jd24rmfo.each(keyvalues, function (kv) {
      r[kv.key] = kv.value;
    });
    return r;
  };
  var $_7mfiz2xcjd24rmj9 = {
    wrap: wrap,
    wrapAll: wrapAll
  };

  var narrow$1 = function (obj, fields) {
    return $_91ir9gxajd24rmj4.narrow(obj, fields);
  };
  var exclude$1 = function (obj, fields) {
    return $_91ir9gxajd24rmj4.exclude(obj, fields);
  };
  var readOpt$1 = function (key) {
    return $_evqlq2xbjd24rmj7.readOpt(key);
  };
  var readOr$1 = function (key, fallback) {
    return $_evqlq2xbjd24rmj7.readOr(key, fallback);
  };
  var readOptFrom$1 = function (obj, key) {
    return $_evqlq2xbjd24rmj7.readOptFrom(obj, key);
  };
  var wrap$1 = function (key, value) {
    return $_7mfiz2xcjd24rmj9.wrap(key, value);
  };
  var wrapAll$1 = function (keyvalues) {
    return $_7mfiz2xcjd24rmj9.wrapAll(keyvalues);
  };
  var indexOnKey$1 = function (array, key) {
    return $_91ir9gxajd24rmj4.indexOnKey(array, key);
  };
  var consolidate = function (objs, base) {
    return $_3vm2b3x7jd24rmiu.consolidateObj(objs, base);
  };
  var hasKey$1 = function (obj, key) {
    return $_evqlq2xbjd24rmj7.hasKey(obj, key);
  };
  var $_bzffwwx6jd24rmit = {
    narrow: narrow$1,
    exclude: exclude$1,
    readOpt: readOpt$1,
    readOr: readOr$1,
    readOptFrom: readOptFrom$1,
    wrap: wrap$1,
    wrapAll: wrapAll$1,
    indexOnKey: indexOnKey$1,
    hasKey: hasKey$1,
    consolidate: consolidate
  };

  var json = function () {
    return $_2au6sowdjd24rmg4.getOrDie('JSON');
  };
  var parse = function (obj) {
    return json().parse(obj);
  };
  var stringify = function (obj, replacer, space) {
    return json().stringify(obj, replacer, space);
  };
  var $_eur0xxfjd24rmjj = {
    parse: parse,
    stringify: stringify
  };

  var formatObj = function (input) {
    return $_cbf8cdwzjd24rmhn.isObject(input) && $_2hhb0ax0jd24rmhp.keys(input).length > 100 ? ' removed due to size' : $_eur0xxfjd24rmjj.stringify(input, null, 2);
  };
  var formatErrors = function (errors) {
    var es = errors.length > 10 ? errors.slice(0, 10).concat([{
        path: [],
        getErrorInfo: function () {
          return '... (only showing first ten failures)';
        }
      }]) : errors;
    return $_3vsestw9jd24rmfo.map(es, function (e) {
      return 'Failed path: (' + e.path.join(' > ') + ')\n' + e.getErrorInfo();
    });
  };
  var $_cjs1ebxejd24rmje = {
    formatObj: formatObj,
    formatErrors: formatErrors
  };

  var nu$3 = function (path, getErrorInfo) {
    return $_b2qdiox8jd24rmj0.error([{
        path: path,
        getErrorInfo: getErrorInfo
      }]);
  };
  var missingStrict = function (path, key, obj) {
    return nu$3(path, function () {
      return 'Could not find valid *strict* value for "' + key + '" in ' + $_cjs1ebxejd24rmje.formatObj(obj);
    });
  };
  var missingKey = function (path, key) {
    return nu$3(path, function () {
      return 'Choice schema did not contain choice key: "' + key + '"';
    });
  };
  var missingBranch = function (path, branches, branch) {
    return nu$3(path, function () {
      return 'The chosen schema: "' + branch + '" did not exist in branches: ' + $_cjs1ebxejd24rmje.formatObj(branches);
    });
  };
  var unsupportedFields = function (path, unsupported) {
    return nu$3(path, function () {
      return 'There are unsupported fields: [' + unsupported.join(', ') + '] specified';
    });
  };
  var custom = function (path, err) {
    return nu$3(path, function () {
      return err;
    });
  };
  var toString = function (error) {
    return 'Failed path: (' + error.path.join(' > ') + ')\n' + error.getErrorInfo();
  };
  var $_gc4pexxdjd24rmjb = {
    missingStrict: missingStrict,
    missingKey: missingKey,
    missingBranch: missingBranch,
    unsupportedFields: unsupportedFields,
    custom: custom,
    toString: toString
  };

  var typeAdt = $_45w193x4jd24rmi8.generate([
    {
      setOf: [
        'validator',
        'valueType'
      ]
    },
    { arrOf: ['valueType'] },
    { objOf: ['fields'] },
    { itemOf: ['validator'] },
    {
      choiceOf: [
        'key',
        'branches'
      ]
    }
  ]);
  var fieldAdt = $_45w193x4jd24rmi8.generate([
    {
      field: [
        'name',
        'presence',
        'type'
      ]
    },
    { state: ['name'] }
  ]);
  var $_1sho49xgjd24rmjk = {
    typeAdt: typeAdt,
    fieldAdt: fieldAdt
  };

  var adt$1 = $_45w193x4jd24rmi8.generate([
    {
      field: [
        'key',
        'okey',
        'presence',
        'prop'
      ]
    },
    {
      state: [
        'okey',
        'instantiator'
      ]
    }
  ]);
  var output = function (okey, value) {
    return adt$1.state(okey, $_aoet5bwbjd24rmfz.constant(value));
  };
  var snapshot = function (okey) {
    return adt$1.state(okey, $_aoet5bwbjd24rmfz.identity);
  };
  var strictAccess = function (path, obj, key) {
    return $_evqlq2xbjd24rmj7.readOptFrom(obj, key).fold(function () {
      return $_gc4pexxdjd24rmjb.missingStrict(path, key, obj);
    }, $_b2qdiox8jd24rmj0.value);
  };
  var fallbackAccess = function (obj, key, fallbackThunk) {
    var v = $_evqlq2xbjd24rmj7.readOptFrom(obj, key).fold(function () {
      return fallbackThunk(obj);
    }, $_aoet5bwbjd24rmfz.identity);
    return $_b2qdiox8jd24rmj0.value(v);
  };
  var optionAccess = function (obj, key) {
    return $_b2qdiox8jd24rmj0.value($_evqlq2xbjd24rmj7.readOptFrom(obj, key));
  };
  var optionDefaultedAccess = function (obj, key, fallback) {
    var opt = $_evqlq2xbjd24rmj7.readOptFrom(obj, key).map(function (val) {
      return val === true ? fallback(obj) : val;
    });
    return $_b2qdiox8jd24rmj0.value(opt);
  };
  var cExtractOne = function (path, obj, field, strength) {
    return field.fold(function (key, okey, presence, prop) {
      var bundle = function (av) {
        return prop.extract(path.concat([key]), strength, av).map(function (res) {
          return $_7mfiz2xcjd24rmj9.wrap(okey, strength(res));
        });
      };
      var bundleAsOption = function (optValue) {
        return optValue.fold(function () {
          var outcome = $_7mfiz2xcjd24rmj9.wrap(okey, strength($_asi680wajd24rmfv.none()));
          return $_b2qdiox8jd24rmj0.value(outcome);
        }, function (ov) {
          return prop.extract(path.concat([key]), strength, ov).map(function (res) {
            return $_7mfiz2xcjd24rmj9.wrap(okey, strength($_asi680wajd24rmfv.some(res)));
          });
        });
      };
      return function () {
        return presence.fold(function () {
          return strictAccess(path, obj, key).bind(bundle);
        }, function (fallbackThunk) {
          return fallbackAccess(obj, key, fallbackThunk).bind(bundle);
        }, function () {
          return optionAccess(obj, key).bind(bundleAsOption);
        }, function (fallbackThunk) {
          return optionDefaultedAccess(obj, key, fallbackThunk).bind(bundleAsOption);
        }, function (baseThunk) {
          var base = baseThunk(obj);
          return fallbackAccess(obj, key, $_aoet5bwbjd24rmfz.constant({})).map(function (v) {
            return $_4x4s83wyjd24rmhm.deepMerge(base, v);
          }).bind(bundle);
        });
      }();
    }, function (okey, instantiator) {
      var state = instantiator(obj);
      return $_b2qdiox8jd24rmj0.value($_7mfiz2xcjd24rmj9.wrap(okey, strength(state)));
    });
  };
  var cExtract = function (path, obj, fields, strength) {
    var results = $_3vsestw9jd24rmfo.map(fields, function (field) {
      return cExtractOne(path, obj, field, strength);
    });
    return $_3vm2b3x7jd24rmiu.consolidateObj(results, {});
  };
  var value$1 = function (validator) {
    var extract = function (path, strength, val) {
      return validator(val).fold(function (err) {
        return $_gc4pexxdjd24rmjb.custom(path, err);
      }, $_b2qdiox8jd24rmj0.value);
    };
    var toString = function () {
      return 'val';
    };
    var toDsl = function () {
      return $_1sho49xgjd24rmjk.typeAdt.itemOf(validator);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var getSetKeys = function (obj) {
    var keys = $_2hhb0ax0jd24rmhp.keys(obj);
    return $_3vsestw9jd24rmfo.filter(keys, function (k) {
      return $_bzffwwx6jd24rmit.hasKey(obj, k);
    });
  };
  var objOnly = function (fields) {
    var delegate = obj(fields);
    var fieldNames = $_3vsestw9jd24rmfo.foldr(fields, function (acc, f) {
      return f.fold(function (key) {
        return $_4x4s83wyjd24rmhm.deepMerge(acc, $_bzffwwx6jd24rmit.wrap(key, true));
      }, $_aoet5bwbjd24rmfz.constant(acc));
    }, {});
    var extract = function (path, strength, o) {
      var keys = $_cbf8cdwzjd24rmhn.isBoolean(o) ? [] : getSetKeys(o);
      var extra = $_3vsestw9jd24rmfo.filter(keys, function (k) {
        return !$_bzffwwx6jd24rmit.hasKey(fieldNames, k);
      });
      return extra.length === 0 ? delegate.extract(path, strength, o) : $_gc4pexxdjd24rmjb.unsupportedFields(path, extra);
    };
    return {
      extract: extract,
      toString: delegate.toString,
      toDsl: delegate.toDsl
    };
  };
  var obj = function (fields) {
    var extract = function (path, strength, o) {
      return cExtract(path, o, fields, strength);
    };
    var toString = function () {
      var fieldStrings = $_3vsestw9jd24rmfo.map(fields, function (field) {
        return field.fold(function (key, okey, presence, prop) {
          return key + ' -> ' + prop.toString();
        }, function (okey, instantiator) {
          return 'state(' + okey + ')';
        });
      });
      return 'obj{\n' + fieldStrings.join('\n') + '}';
    };
    var toDsl = function () {
      return $_1sho49xgjd24rmjk.typeAdt.objOf($_3vsestw9jd24rmfo.map(fields, function (f) {
        return f.fold(function (key, okey, presence, prop) {
          return $_1sho49xgjd24rmjk.fieldAdt.field(key, presence, prop);
        }, function (okey, instantiator) {
          return $_1sho49xgjd24rmjk.fieldAdt.state(okey);
        });
      }));
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var arr = function (prop) {
    var extract = function (path, strength, array) {
      var results = $_3vsestw9jd24rmfo.map(array, function (a, i) {
        return prop.extract(path.concat(['[' + i + ']']), strength, a);
      });
      return $_3vm2b3x7jd24rmiu.consolidateArr(results);
    };
    var toString = function () {
      return 'array(' + prop.toString() + ')';
    };
    var toDsl = function () {
      return $_1sho49xgjd24rmjk.typeAdt.arrOf(prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var setOf = function (validator, prop) {
    var validateKeys = function (path, keys) {
      return arr(value$1(validator)).extract(path, $_aoet5bwbjd24rmfz.identity, keys);
    };
    var extract = function (path, strength, o) {
      var keys = $_2hhb0ax0jd24rmhp.keys(o);
      return validateKeys(path, keys).bind(function (validKeys) {
        var schema = $_3vsestw9jd24rmfo.map(validKeys, function (vk) {
          return adt$1.field(vk, vk, $_a33fuhx3jd24rmi5.strict(), prop);
        });
        return obj(schema).extract(path, strength, o);
      });
    };
    var toString = function () {
      return 'setOf(' + prop.toString() + ')';
    };
    var toDsl = function () {
      return $_1sho49xgjd24rmjk.typeAdt.setOf(validator, prop);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var anyValue = value$1($_b2qdiox8jd24rmj0.value);
  var arrOfObj = $_aoet5bwbjd24rmfz.compose(arr, obj);
  var $_1csme2x5jd24rmic = {
    anyValue: $_aoet5bwbjd24rmfz.constant(anyValue),
    value: value$1,
    obj: obj,
    objOnly: objOnly,
    arr: arr,
    setOf: setOf,
    arrOfObj: arrOfObj,
    state: adt$1.state,
    field: adt$1.field,
    output: output,
    snapshot: snapshot
  };

  var strict = function (key) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.strict(), $_1csme2x5jd24rmic.anyValue());
  };
  var strictOf = function (key, schema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.strict(), schema);
  };
  var strictFunction = function (key) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.strict(), $_1csme2x5jd24rmic.value(function (f) {
      return $_cbf8cdwzjd24rmhn.isFunction(f) ? $_b2qdiox8jd24rmj0.value(f) : $_b2qdiox8jd24rmj0.error('Not a function');
    }));
  };
  var forbid = function (key, message) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.asOption(), $_1csme2x5jd24rmic.value(function (v) {
      return $_b2qdiox8jd24rmj0.error('The field: ' + key + ' is forbidden. ' + message);
    }));
  };
  var strictArrayOf = function (key, prop) {
    return strictOf(key, prop);
  };
  var strictObjOf = function (key, objSchema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.strict(), $_1csme2x5jd24rmic.obj(objSchema));
  };
  var strictArrayOfObj = function (key, objFields) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.strict(), $_1csme2x5jd24rmic.arrOfObj(objFields));
  };
  var option = function (key) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.asOption(), $_1csme2x5jd24rmic.anyValue());
  };
  var optionOf = function (key, schema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.asOption(), schema);
  };
  var optionObjOf = function (key, objSchema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.asOption(), $_1csme2x5jd24rmic.obj(objSchema));
  };
  var optionObjOfOnly = function (key, objSchema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.asOption(), $_1csme2x5jd24rmic.objOnly(objSchema));
  };
  var defaulted$1 = function (key, fallback) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.defaulted(fallback), $_1csme2x5jd24rmic.anyValue());
  };
  var defaultedOf = function (key, fallback, schema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.defaulted(fallback), schema);
  };
  var defaultedObjOf = function (key, fallback, objSchema) {
    return $_1csme2x5jd24rmic.field(key, key, $_a33fuhx3jd24rmi5.defaulted(fallback), $_1csme2x5jd24rmic.obj(objSchema));
  };
  var field = function (key, okey, presence, prop) {
    return $_1csme2x5jd24rmic.field(key, okey, presence, prop);
  };
  var state = function (okey, instantiator) {
    return $_1csme2x5jd24rmic.state(okey, instantiator);
  };
  var $_w7f5sx2jd24rmi1 = {
    strict: strict,
    strictOf: strictOf,
    strictObjOf: strictObjOf,
    strictArrayOf: strictArrayOf,
    strictArrayOfObj: strictArrayOfObj,
    strictFunction: strictFunction,
    forbid: forbid,
    option: option,
    optionOf: optionOf,
    optionObjOf: optionObjOf,
    optionObjOfOnly: optionObjOfOnly,
    defaulted: defaulted$1,
    defaultedOf: defaultedOf,
    defaultedObjOf: defaultedObjOf,
    field: field,
    state: state
  };

  var chooseFrom = function (path, strength, input, branches, ch) {
    var fields = $_bzffwwx6jd24rmit.readOptFrom(branches, ch);
    return fields.fold(function () {
      return $_gc4pexxdjd24rmjb.missingBranch(path, branches, ch);
    }, function (fs) {
      return $_1csme2x5jd24rmic.obj(fs).extract(path.concat(['branch: ' + ch]), strength, input);
    });
  };
  var choose = function (key, branches) {
    var extract = function (path, strength, input) {
      var choice = $_bzffwwx6jd24rmit.readOptFrom(input, key);
      return choice.fold(function () {
        return $_gc4pexxdjd24rmjb.missingKey(path, key);
      }, function (chosen) {
        return chooseFrom(path, strength, input, branches, chosen);
      });
    };
    var toString = function () {
      return 'chooseOn(' + key + '). Possible values: ' + $_2hhb0ax0jd24rmhp.keys(branches);
    };
    var toDsl = function () {
      return $_1sho49xgjd24rmjk.typeAdt.choiceOf(key, branches);
    };
    return {
      extract: extract,
      toString: toString,
      toDsl: toDsl
    };
  };
  var $_dvgssaxijd24rmjs = { choose: choose };

  var anyValue$1 = $_1csme2x5jd24rmic.value($_b2qdiox8jd24rmj0.value);
  var arrOfObj$1 = function (objFields) {
    return $_1csme2x5jd24rmic.arrOfObj(objFields);
  };
  var arrOfVal = function () {
    return $_1csme2x5jd24rmic.arr(anyValue$1);
  };
  var arrOf = $_1csme2x5jd24rmic.arr;
  var objOf = $_1csme2x5jd24rmic.obj;
  var objOfOnly = $_1csme2x5jd24rmic.objOnly;
  var setOf$1 = $_1csme2x5jd24rmic.setOf;
  var valueOf = function (validator) {
    return $_1csme2x5jd24rmic.value(validator);
  };
  var extract = function (label, prop, strength, obj) {
    return prop.extract([label], strength, obj).fold(function (errs) {
      return $_b2qdiox8jd24rmj0.error({
        input: obj,
        errors: errs
      });
    }, $_b2qdiox8jd24rmj0.value);
  };
  var asStruct = function (label, prop, obj) {
    return extract(label, prop, $_aoet5bwbjd24rmfz.constant, obj);
  };
  var asRaw = function (label, prop, obj) {
    return extract(label, prop, $_aoet5bwbjd24rmfz.identity, obj);
  };
  var getOrDie$1 = function (extraction) {
    return extraction.fold(function (errInfo) {
      throw new Error(formatError(errInfo));
    }, $_aoet5bwbjd24rmfz.identity);
  };
  var asRawOrDie = function (label, prop, obj) {
    return getOrDie$1(asRaw(label, prop, obj));
  };
  var asStructOrDie = function (label, prop, obj) {
    return getOrDie$1(asStruct(label, prop, obj));
  };
  var formatError = function (errInfo) {
    return 'Errors: \n' + $_cjs1ebxejd24rmje.formatErrors(errInfo.errors) + '\n\nInput object: ' + $_cjs1ebxejd24rmje.formatObj(errInfo.input);
  };
  var choose$1 = function (key, branches) {
    return $_dvgssaxijd24rmjs.choose(key, branches);
  };
  var $_bdtykhxhjd24rmjn = {
    anyValue: $_aoet5bwbjd24rmfz.constant(anyValue$1),
    arrOfObj: arrOfObj$1,
    arrOf: arrOf,
    arrOfVal: arrOfVal,
    valueOf: valueOf,
    setOf: setOf$1,
    objOf: objOf,
    objOfOnly: objOfOnly,
    asStruct: asStruct,
    asRaw: asRaw,
    asStructOrDie: asStructOrDie,
    asRawOrDie: asRawOrDie,
    getOrDie: getOrDie$1,
    formatError: formatError,
    choose: choose$1
  };

  var nu$4 = function (parts) {
    if (!$_bzffwwx6jd24rmit.hasKey(parts, 'can') && !$_bzffwwx6jd24rmit.hasKey(parts, 'abort') && !$_bzffwwx6jd24rmit.hasKey(parts, 'run'))
      throw new Error('EventHandler defined by: ' + $_eur0xxfjd24rmjj.stringify(parts, null, 2) + ' does not have can, abort, or run!');
    return $_bdtykhxhjd24rmjn.asRawOrDie('Extracting event.handler', $_bdtykhxhjd24rmjn.objOfOnly([
      $_w7f5sx2jd24rmi1.defaulted('can', $_aoet5bwbjd24rmfz.constant(true)),
      $_w7f5sx2jd24rmi1.defaulted('abort', $_aoet5bwbjd24rmfz.constant(false)),
      $_w7f5sx2jd24rmi1.defaulted('run', $_aoet5bwbjd24rmfz.noop)
    ]), parts);
  };
  var all$1 = function (handlers, f) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return $_3vsestw9jd24rmfo.foldl(handlers, function (acc, handler) {
        return acc && f(handler).apply(undefined, args);
      }, true);
    };
  };
  var any = function (handlers, f) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      return $_3vsestw9jd24rmfo.foldl(handlers, function (acc, handler) {
        return acc || f(handler).apply(undefined, args);
      }, false);
    };
  };
  var read = function (handler) {
    return $_cbf8cdwzjd24rmhn.isFunction(handler) ? {
      can: $_aoet5bwbjd24rmfz.constant(true),
      abort: $_aoet5bwbjd24rmfz.constant(false),
      run: handler
    } : handler;
  };
  var fuse = function (handlers) {
    var can = all$1(handlers, function (handler) {
      return handler.can;
    });
    var abort = any(handlers, function (handler) {
      return handler.abort;
    });
    var run = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      $_3vsestw9jd24rmfo.each(handlers, function (handler) {
        handler.run.apply(undefined, args);
      });
    };
    return nu$4({
      can: can,
      abort: abort,
      run: run
    });
  };
  var $_47bwnvx1jd24rmhs = {
    read: read,
    fuse: fuse,
    nu: nu$4
  };

  var derive = $_bzffwwx6jd24rmit.wrapAll;
  var abort = function (name, predicate) {
    return {
      key: name,
      value: $_47bwnvx1jd24rmhs.nu({ abort: predicate })
    };
  };
  var can = function (name, predicate) {
    return {
      key: name,
      value: $_47bwnvx1jd24rmhs.nu({ can: predicate })
    };
  };
  var preventDefault = function (name) {
    return {
      key: name,
      value: $_47bwnvx1jd24rmhs.nu({
        run: function (component, simulatedEvent) {
          simulatedEvent.event().prevent();
        }
      })
    };
  };
  var run = function (name, handler) {
    return {
      key: name,
      value: $_47bwnvx1jd24rmhs.nu({ run: handler })
    };
  };
  var runActionExtra = function (name, action, extra) {
    return {
      key: name,
      value: $_47bwnvx1jd24rmhs.nu({
        run: function (component) {
          action.apply(undefined, [component].concat(extra));
        }
      })
    };
  };
  var runOnName = function (name) {
    return function (handler) {
      return run(name, handler);
    };
  };
  var runOnSourceName = function (name) {
    return function (handler) {
      return {
        key: name,
        value: $_47bwnvx1jd24rmhs.nu({
          run: function (component, simulatedEvent) {
            if ($_3i0tdiw7jd24rmff.isSource(component, simulatedEvent))
              handler(component, simulatedEvent);
          }
        })
      };
    };
  };
  var redirectToUid = function (name, uid) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByUid(uid).each(function (redirectee) {
        $_eljod2wvjd24rmhc.dispatchEvent(redirectee, redirectee.element(), name, simulatedEvent);
      });
    });
  };
  var redirectToPart = function (name, detail, partName) {
    var uid = detail.partUids()[partName];
    return redirectToUid(name, uid);
  };
  var runWithTarget = function (name, f) {
    return run(name, function (component, simulatedEvent) {
      component.getSystem().getByDom(simulatedEvent.event().target()).each(function (target) {
        f(component, target, simulatedEvent);
      });
    });
  };
  var cutter = function (name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.cut();
    });
  };
  var stopper = function (name) {
    return run(name, function (component, simulatedEvent) {
      simulatedEvent.stop();
    });
  };
  var $_g9t26pw6jd24rmfc = {
    derive: derive,
    run: run,
    preventDefault: preventDefault,
    runActionExtra: runActionExtra,
    runOnAttached: runOnSourceName($_9am11ywwjd24rmhg.attachedToDom()),
    runOnDetached: runOnSourceName($_9am11ywwjd24rmhg.detachedFromDom()),
    runOnInit: runOnSourceName($_9am11ywwjd24rmhg.systemInit()),
    runOnExecute: runOnName($_9am11ywwjd24rmhg.execute()),
    redirectToUid: redirectToUid,
    redirectToPart: redirectToPart,
    runWithTarget: runWithTarget,
    abort: abort,
    can: can,
    cutter: cutter,
    stopper: stopper
  };

  var markAsBehaviourApi = function (f, apiName, apiFunction) {
    return f;
  };
  var markAsExtraApi = function (f, extraName) {
    return f;
  };
  var markAsSketchApi = function (f, apiFunction) {
    return f;
  };
  var getAnnotation = $_asi680wajd24rmfv.none;
  var $_6r3rc2xjjd24rmjw = {
    markAsBehaviourApi: markAsBehaviourApi,
    markAsExtraApi: markAsExtraApi,
    markAsSketchApi: markAsSketchApi,
    getAnnotation: getAnnotation
  };

  function Immutable () {
    var fields = arguments;
    return function () {
      var values = new Array(arguments.length);
      for (var i = 0; i < values.length; i++)
        values[i] = arguments[i];
      if (fields.length !== values.length)
        throw new Error('Wrong number of arguments to struct. Expected "[' + fields.length + ']", got ' + values.length + ' arguments');
      var struct = {};
      $_3vsestw9jd24rmfo.each(fields, function (name, i) {
        struct[name] = $_aoet5bwbjd24rmfz.constant(values[i]);
      });
      return struct;
    };
  }

  var sort$1 = function (arr) {
    return arr.slice(0).sort();
  };
  var reqMessage = function (required, keys) {
    throw new Error('All required keys (' + sort$1(required).join(', ') + ') were not specified. Specified keys were: ' + sort$1(keys).join(', ') + '.');
  };
  var unsuppMessage = function (unsupported) {
    throw new Error('Unsupported keys for object: ' + sort$1(unsupported).join(', '));
  };
  var validateStrArr = function (label, array) {
    if (!$_cbf8cdwzjd24rmhn.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_3vsestw9jd24rmfo.each(array, function (a) {
      if (!$_cbf8cdwzjd24rmhn.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_3vsestw9jd24rmfo.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_mr7rxxpjd24rmki = {
    sort: sort$1,
    reqMessage: reqMessage,
    unsuppMessage: unsuppMessage,
    validateStrArr: validateStrArr,
    invalidTypeMessage: invalidTypeMessage,
    checkDupes: checkDupes
  };

  function MixedBag (required, optional) {
    var everything = required.concat(optional);
    if (everything.length === 0)
      throw new Error('You must specify at least one required or optional field.');
    $_mr7rxxpjd24rmki.validateStrArr('required', required);
    $_mr7rxxpjd24rmki.validateStrArr('optional', optional);
    $_mr7rxxpjd24rmki.checkDupes(everything);
    return function (obj) {
      var keys = $_2hhb0ax0jd24rmhp.keys(obj);
      var allReqd = $_3vsestw9jd24rmfo.forall(required, function (req) {
        return $_3vsestw9jd24rmfo.contains(keys, req);
      });
      if (!allReqd)
        $_mr7rxxpjd24rmki.reqMessage(required, keys);
      var unsupported = $_3vsestw9jd24rmfo.filter(keys, function (key) {
        return !$_3vsestw9jd24rmfo.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_mr7rxxpjd24rmki.unsuppMessage(unsupported);
      var r = {};
      $_3vsestw9jd24rmfo.each(required, function (req) {
        r[req] = $_aoet5bwbjd24rmfz.constant(obj[req]);
      });
      $_3vsestw9jd24rmfo.each(optional, function (opt) {
        r[opt] = $_aoet5bwbjd24rmfz.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? $_asi680wajd24rmfv.some(obj[opt]) : $_asi680wajd24rmfv.none());
      });
      return r;
    };
  }

  var $_ws57hxmjd24rmkd = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var nu$5 = $_ws57hxmjd24rmkd.immutableBag(['tag'], [
    'classes',
    'attributes',
    'styles',
    'value',
    'innerHtml',
    'domChildren',
    'defChildren'
  ]);
  var defToStr = function (defn) {
    var raw = defToRaw(defn);
    return $_eur0xxfjd24rmjj.stringify(raw, null, 2);
  };
  var defToRaw = function (defn) {
    return {
      tag: defn.tag(),
      classes: defn.classes().getOr([]),
      attributes: defn.attributes().getOr({}),
      styles: defn.styles().getOr({}),
      value: defn.value().getOr('<none>'),
      innerHtml: defn.innerHtml().getOr('<none>'),
      defChildren: defn.defChildren().getOr('<none>'),
      domChildren: defn.domChildren().fold(function () {
        return '<none>';
      }, function (children) {
        return children.length === 0 ? '0 children, but still specified' : String(children.length);
      })
    };
  };
  var $_3hxy2nxljd24rmka = {
    nu: nu$5,
    defToStr: defToStr,
    defToRaw: defToRaw
  };

  var fields = [
    'classes',
    'attributes',
    'styles',
    'value',
    'innerHtml',
    'defChildren',
    'domChildren'
  ];
  var nu$6 = $_ws57hxmjd24rmkd.immutableBag([], fields);
  var derive$1 = function (settings) {
    var r = {};
    var keys = $_2hhb0ax0jd24rmhp.keys(settings);
    $_3vsestw9jd24rmfo.each(keys, function (key) {
      settings[key].each(function (v) {
        r[key] = v;
      });
    });
    return nu$6(r);
  };
  var modToStr = function (mod) {
    var raw = modToRaw(mod);
    return $_eur0xxfjd24rmjj.stringify(raw, null, 2);
  };
  var modToRaw = function (mod) {
    return {
      classes: mod.classes().getOr('<none>'),
      attributes: mod.attributes().getOr('<none>'),
      styles: mod.styles().getOr('<none>'),
      value: mod.value().getOr('<none>'),
      innerHtml: mod.innerHtml().getOr('<none>'),
      defChildren: mod.defChildren().getOr('<none>'),
      domChildren: mod.domChildren().fold(function () {
        return '<none>';
      }, function (children) {
        return children.length === 0 ? '0 children, but still specified' : String(children.length);
      })
    };
  };
  var clashingOptArrays = function (key, oArr1, oArr2) {
    return oArr1.fold(function () {
      return oArr2.fold(function () {
        return {};
      }, function (arr2) {
        return $_bzffwwx6jd24rmit.wrap(key, arr2);
      });
    }, function (arr1) {
      return oArr2.fold(function () {
        return $_bzffwwx6jd24rmit.wrap(key, arr1);
      }, function (arr2) {
        return $_bzffwwx6jd24rmit.wrap(key, arr2);
      });
    });
  };
  var merge$1 = function (defnA, mod) {
    var raw = $_4x4s83wyjd24rmhm.deepMerge({
      tag: defnA.tag(),
      classes: mod.classes().getOr([]).concat(defnA.classes().getOr([])),
      attributes: $_4x4s83wyjd24rmhm.merge(defnA.attributes().getOr({}), mod.attributes().getOr({})),
      styles: $_4x4s83wyjd24rmhm.merge(defnA.styles().getOr({}), mod.styles().getOr({}))
    }, mod.innerHtml().or(defnA.innerHtml()).map(function (innerHtml) {
      return $_bzffwwx6jd24rmit.wrap('innerHtml', innerHtml);
    }).getOr({}), clashingOptArrays('domChildren', mod.domChildren(), defnA.domChildren()), clashingOptArrays('defChildren', mod.defChildren(), defnA.defChildren()), mod.value().or(defnA.value()).map(function (value) {
      return $_bzffwwx6jd24rmit.wrap('value', value);
    }).getOr({}));
    return $_3hxy2nxljd24rmka.nu(raw);
  };
  var $_g169haxkjd24rmjy = {
    nu: nu$6,
    derive: derive$1,
    merge: merge$1,
    modToStr: modToStr,
    modToRaw: modToRaw
  };

  var executeEvent = function (bConfig, bState, executor) {
    return $_g9t26pw6jd24rmfc.runOnExecute(function (component) {
      executor(component, bConfig, bState);
    });
  };
  var loadEvent = function (bConfig, bState, f) {
    return $_g9t26pw6jd24rmfc.runOnInit(function (component, simulatedEvent) {
      f(component, bConfig, bState);
    });
  };
  var create = function (schema, name, active, apis, extra, state) {
    var configSchema = $_bdtykhxhjd24rmjn.objOfOnly(schema);
    var schemaSchema = $_w7f5sx2jd24rmi1.optionObjOf(name, [$_w7f5sx2jd24rmi1.optionObjOfOnly('config', schema)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var createModes = function (modes, name, active, apis, extra, state) {
    var configSchema = modes;
    var schemaSchema = $_w7f5sx2jd24rmi1.optionObjOf(name, [$_w7f5sx2jd24rmi1.optionOf('config', modes)]);
    return doCreate(configSchema, schemaSchema, name, active, apis, extra, state);
  };
  var wrapApi = function (bName, apiFunction, apiName) {
    var f = function (component) {
      var args = arguments;
      return component.config({ name: $_aoet5bwbjd24rmfz.constant(bName) }).fold(function () {
        throw new Error('We could not find any behaviour configuration for: ' + bName + '. Using API: ' + apiName);
      }, function (info) {
        var rest = Array.prototype.slice.call(args, 1);
        return apiFunction.apply(undefined, [
          component,
          info.config,
          info.state
        ].concat(rest));
      });
    };
    return $_6r3rc2xjjd24rmjw.markAsBehaviourApi(f, apiName, apiFunction);
  };
  var revokeBehaviour = function (name) {
    return {
      key: name,
      value: undefined
    };
  };
  var doCreate = function (configSchema, schemaSchema, name, active, apis, extra, state) {
    var getConfig = function (info) {
      return $_bzffwwx6jd24rmit.hasKey(info, name) ? info[name]() : $_asi680wajd24rmfv.none();
    };
    var wrappedApis = $_2hhb0ax0jd24rmhp.map(apis, function (apiF, apiName) {
      return wrapApi(name, apiF, apiName);
    });
    var wrappedExtra = $_2hhb0ax0jd24rmhp.map(extra, function (extraF, extraName) {
      return $_6r3rc2xjjd24rmjw.markAsExtraApi(extraF, extraName);
    });
    var me = $_4x4s83wyjd24rmhm.deepMerge(wrappedExtra, wrappedApis, {
      revoke: $_aoet5bwbjd24rmfz.curry(revokeBehaviour, name),
      config: function (spec) {
        var prepared = $_bdtykhxhjd24rmjn.asStructOrDie(name + '-config', configSchema, spec);
        return {
          key: name,
          value: {
            config: prepared,
            me: me,
            configAsRaw: $_4myblwwhjd24rmgb.cached(function () {
              return $_bdtykhxhjd24rmjn.asRawOrDie(name + '-config', configSchema, spec);
            }),
            initialConfig: spec,
            state: state
          }
        };
      },
      schema: function () {
        return schemaSchema;
      },
      exhibit: function (info, base) {
        return getConfig(info).bind(function (behaviourInfo) {
          return $_bzffwwx6jd24rmit.readOptFrom(active, 'exhibit').map(function (exhibitor) {
            return exhibitor(base, behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr($_g169haxkjd24rmjy.nu({}));
      },
      name: function () {
        return name;
      },
      handlers: function (info) {
        return getConfig(info).bind(function (behaviourInfo) {
          return $_bzffwwx6jd24rmit.readOptFrom(active, 'events').map(function (events) {
            return events(behaviourInfo.config, behaviourInfo.state);
          });
        }).getOr({});
      }
    });
    return me;
  };
  var $_a3lv5fw5jd24rmf0 = {
    executeEvent: executeEvent,
    loadEvent: loadEvent,
    create: create,
    createModes: createModes
  };

  var base = function (handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: $_cbf8cdwzjd24rmhn.isFunction,
      label: 'function'
    });
  };
  var baseWith = function (handleUnsupported, required, pred) {
    if (required.length === 0)
      throw new Error('You must specify at least one required field.');
    $_mr7rxxpjd24rmki.validateStrArr('required', required);
    $_mr7rxxpjd24rmki.checkDupes(required);
    return function (obj) {
      var keys = $_2hhb0ax0jd24rmhp.keys(obj);
      var allReqd = $_3vsestw9jd24rmfo.forall(required, function (req) {
        return $_3vsestw9jd24rmfo.contains(keys, req);
      });
      if (!allReqd)
        $_mr7rxxpjd24rmki.reqMessage(required, keys);
      handleUnsupported(required, keys);
      var invalidKeys = $_3vsestw9jd24rmfo.filter(required, function (key) {
        return !pred.validate(obj[key], key);
      });
      if (invalidKeys.length > 0)
        $_mr7rxxpjd24rmki.invalidTypeMessage(invalidKeys, pred.label);
      return obj;
    };
  };
  var handleExact = function (required, keys) {
    var unsupported = $_3vsestw9jd24rmfo.filter(keys, function (key) {
      return !$_3vsestw9jd24rmfo.contains(required, key);
    });
    if (unsupported.length > 0)
      $_mr7rxxpjd24rmki.unsuppMessage(unsupported);
  };
  var allowExtra = $_aoet5bwbjd24rmfz.noop;
  var $_bayyntxsjd24rmkn = {
    exactly: $_aoet5bwbjd24rmfz.curry(base, handleExact),
    ensure: $_aoet5bwbjd24rmfz.curry(base, allowExtra),
    ensureWith: $_aoet5bwbjd24rmfz.curry(baseWith, allowExtra)
  };

  var BehaviourState = $_bayyntxsjd24rmkn.ensure(['readState']);

  var init = function () {
    return BehaviourState({
      readState: function () {
        return 'No State required';
      }
    });
  };
  var $_6n4e0bxqjd24rmkk = { init: init };

  var derive$2 = function (capabilities) {
    return $_bzffwwx6jd24rmit.wrapAll(capabilities);
  };
  var simpleSchema = $_bdtykhxhjd24rmjn.objOfOnly([
    $_w7f5sx2jd24rmi1.strict('fields'),
    $_w7f5sx2jd24rmi1.strict('name'),
    $_w7f5sx2jd24rmi1.defaulted('active', {}),
    $_w7f5sx2jd24rmi1.defaulted('apis', {}),
    $_w7f5sx2jd24rmi1.defaulted('extra', {}),
    $_w7f5sx2jd24rmi1.defaulted('state', $_6n4e0bxqjd24rmkk)
  ]);
  var create$1 = function (data) {
    var value = $_bdtykhxhjd24rmjn.asRawOrDie('Creating behaviour: ' + data.name, simpleSchema, data);
    return $_a3lv5fw5jd24rmf0.create(value.fields, value.name, value.active, value.apis, value.extra, value.state);
  };
  var modeSchema = $_bdtykhxhjd24rmjn.objOfOnly([
    $_w7f5sx2jd24rmi1.strict('branchKey'),
    $_w7f5sx2jd24rmi1.strict('branches'),
    $_w7f5sx2jd24rmi1.strict('name'),
    $_w7f5sx2jd24rmi1.defaulted('active', {}),
    $_w7f5sx2jd24rmi1.defaulted('apis', {}),
    $_w7f5sx2jd24rmi1.defaulted('extra', {}),
    $_w7f5sx2jd24rmi1.defaulted('state', $_6n4e0bxqjd24rmkk)
  ]);
  var createModes$1 = function (data) {
    var value = $_bdtykhxhjd24rmjn.asRawOrDie('Creating behaviour: ' + data.name, modeSchema, data);
    return $_a3lv5fw5jd24rmf0.createModes($_bdtykhxhjd24rmjn.choose(value.branchKey, value.branches), value.name, value.active, value.apis, value.extra, value.state);
  };
  var $_9vyb2vw4jd24rmen = {
    derive: derive$2,
    revoke: $_aoet5bwbjd24rmfz.constant(undefined),
    noActive: $_aoet5bwbjd24rmfz.constant({}),
    noApis: $_aoet5bwbjd24rmfz.constant({}),
    noExtra: $_aoet5bwbjd24rmfz.constant({}),
    noState: $_aoet5bwbjd24rmfz.constant($_6n4e0bxqjd24rmkk),
    create: create$1,
    createModes: createModes$1
  };

  function Toggler (turnOff, turnOn, initial) {
    var active = initial || false;
    var on = function () {
      turnOn();
      active = true;
    };
    var off = function () {
      turnOff();
      active = false;
    };
    var toggle = function () {
      var f = active ? off : on;
      f();
    };
    var isOn = function () {
      return active;
    };
    return {
      on: on,
      off: off,
      toggle: toggle,
      isOn: isOn
    };
  }

  var name = function (element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function (element) {
    return element.dom().nodeType;
  };
  var value$2 = function (element) {
    return element.dom().nodeValue;
  };
  var isType$1 = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_ewuxfvwujd24rmhb.COMMENT || name(element) === '#comment';
  };
  var isElement = isType$1($_ewuxfvwujd24rmhb.ELEMENT);
  var isText = isType$1($_ewuxfvwujd24rmhb.TEXT);
  var isDocument = isType$1($_ewuxfvwujd24rmhb.DOCUMENT);
  var $_5fvhg7xxjd24rmkz = {
    name: name,
    type: type,
    value: value$2,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var rawSet = function (dom, key, value) {
    if ($_cbf8cdwzjd24rmhn.isString(value) || $_cbf8cdwzjd24rmhn.isBoolean(value) || $_cbf8cdwzjd24rmhn.isNumber(value)) {
      dom.setAttribute(key, value + '');
    } else {
      console.error('Invalid call to Attr.set. Key ', key, ':: Value ', value, ':: Element ', dom);
      throw new Error('Attribute value was not simple');
    }
  };
  var set = function (element, key, value) {
    rawSet(element.dom(), key, value);
  };
  var setAll = function (element, attrs) {
    var dom = element.dom();
    $_2hhb0ax0jd24rmhp.each(attrs, function (v, k) {
      rawSet(dom, k, v);
    });
  };
  var get = function (element, key) {
    var v = element.dom().getAttribute(key);
    return v === null ? undefined : v;
  };
  var has = function (element, key) {
    var dom = element.dom();
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false;
  };
  var remove = function (element, key) {
    element.dom().removeAttribute(key);
  };
  var hasNone = function (element) {
    var attrs = element.dom().attributes;
    return attrs === undefined || attrs === null || attrs.length === 0;
  };
  var clone = function (element) {
    return $_3vsestw9jd24rmfo.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne = function (source, destination, attr) {
    if (has(source, attr) && !has(destination, attr))
      set(destination, attr, get(source, attr));
  };
  var transfer = function (source, destination, attrs) {
    if (!$_5fvhg7xxjd24rmkz.isElement(source) || !$_5fvhg7xxjd24rmkz.isElement(destination))
      return;
    $_3vsestw9jd24rmfo.each(attrs, function (attr) {
      transferOne(source, destination, attr);
    });
  };
  var $_dxjq1vxwjd24rmkv = {
    clone: clone,
    set: set,
    setAll: setAll,
    get: get,
    has: has,
    remove: remove,
    hasNone: hasNone,
    transfer: transfer
  };

  var read$1 = function (element, attr) {
    var value = $_dxjq1vxwjd24rmkv.get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add = function (element, attr, id) {
    var old = read$1(element, attr);
    var nu = old.concat([id]);
    $_dxjq1vxwjd24rmkv.set(element, attr, nu.join(' '));
  };
  var remove$1 = function (element, attr, id) {
    var nu = $_3vsestw9jd24rmfo.filter(read$1(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0)
      $_dxjq1vxwjd24rmkv.set(element, attr, nu.join(' '));
    else
      $_dxjq1vxwjd24rmkv.remove(element, attr);
  };
  var $_g7tj26xzjd24rml3 = {
    read: read$1,
    add: add,
    remove: remove$1
  };

  var supports = function (element) {
    return element.dom().classList !== undefined;
  };
  var get$1 = function (element) {
    return $_g7tj26xzjd24rml3.read(element, 'class');
  };
  var add$1 = function (element, clazz) {
    return $_g7tj26xzjd24rml3.add(element, 'class', clazz);
  };
  var remove$2 = function (element, clazz) {
    return $_g7tj26xzjd24rml3.remove(element, 'class', clazz);
  };
  var toggle = function (element, clazz) {
    if ($_3vsestw9jd24rmfo.contains(get$1(element), clazz)) {
      remove$2(element, clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var $_26wgjsxyjd24rml1 = {
    get: get$1,
    add: add$1,
    remove: remove$2,
    toggle: toggle,
    supports: supports
  };

  var add$2 = function (element, clazz) {
    if ($_26wgjsxyjd24rml1.supports(element))
      element.dom().classList.add(clazz);
    else
      $_26wgjsxyjd24rml1.add(element, clazz);
  };
  var cleanClass = function (element) {
    var classList = $_26wgjsxyjd24rml1.supports(element) ? element.dom().classList : $_26wgjsxyjd24rml1.get(element);
    if (classList.length === 0) {
      $_dxjq1vxwjd24rmkv.remove(element, 'class');
    }
  };
  var remove$3 = function (element, clazz) {
    if ($_26wgjsxyjd24rml1.supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else
      $_26wgjsxyjd24rml1.remove(element, clazz);
    cleanClass(element);
  };
  var toggle$1 = function (element, clazz) {
    return $_26wgjsxyjd24rml1.supports(element) ? element.dom().classList.toggle(clazz) : $_26wgjsxyjd24rml1.toggle(element, clazz);
  };
  var toggler = function (element, clazz) {
    var hasClasslist = $_26wgjsxyjd24rml1.supports(element);
    var classList = element.dom().classList;
    var off = function () {
      if (hasClasslist)
        classList.remove(clazz);
      else
        $_26wgjsxyjd24rml1.remove(element, clazz);
    };
    var on = function () {
      if (hasClasslist)
        classList.add(clazz);
      else
        $_26wgjsxyjd24rml1.add(element, clazz);
    };
    return Toggler(off, on, has$1(element, clazz));
  };
  var has$1 = function (element, clazz) {
    return $_26wgjsxyjd24rml1.supports(element) && element.dom().classList.contains(clazz);
  };
  var $_c8qis7xujd24rmks = {
    add: add$2,
    remove: remove$3,
    toggle: toggle$1,
    toggler: toggler,
    has: has$1
  };

  var swap = function (element, addCls, removeCls) {
    $_c8qis7xujd24rmks.remove(element, removeCls);
    $_c8qis7xujd24rmks.add(element, addCls);
  };
  var toAlpha = function (component, swapConfig, swapState) {
    swap(component.element(), swapConfig.alpha(), swapConfig.omega());
  };
  var toOmega = function (component, swapConfig, swapState) {
    swap(component.element(), swapConfig.omega(), swapConfig.alpha());
  };
  var clear = function (component, swapConfig, swapState) {
    $_c8qis7xujd24rmks.remove(component.element(), swapConfig.alpha());
    $_c8qis7xujd24rmks.remove(component.element(), swapConfig.omega());
  };
  var isAlpha = function (component, swapConfig, swapState) {
    return $_c8qis7xujd24rmks.has(component.element(), swapConfig.alpha());
  };
  var isOmega = function (component, swapConfig, swapState) {
    return $_c8qis7xujd24rmks.has(component.element(), swapConfig.omega());
  };
  var $_2k771qxtjd24rmkp = {
    toAlpha: toAlpha,
    toOmega: toOmega,
    isAlpha: isAlpha,
    isOmega: isOmega,
    clear: clear
  };

  var SwapSchema = [
    $_w7f5sx2jd24rmi1.strict('alpha'),
    $_w7f5sx2jd24rmi1.strict('omega')
  ];

  var Swapping = $_9vyb2vw4jd24rmen.create({
    fields: SwapSchema,
    name: 'swapping',
    apis: $_2k771qxtjd24rmkp
  });

  var toArray = function (target, f) {
    var r = [];
    var recurse = function (e) {
      r.push(e);
      return f(e);
    };
    var cur = f(target);
    do {
      cur = cur.bind(recurse);
    } while (cur.isSome());
    return r;
  };
  var $_blpkwry4jd24rmlo = { toArray: toArray };

  var owner = function (element) {
    return $_ei6gqxwtjd24rmh8.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_ei6gqxwtjd24rmh8.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_ei6gqxwtjd24rmh8.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return $_asi680wajd24rmfv.from(dom.parentNode).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var findIndex$1 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_3vsestw9jd24rmfo.findIndex(kin, function (elem) {
        return $_237cqww8jd24rmfh.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_cbf8cdwzjd24rmhn.isFunction(isRoot) ? isRoot : $_aoet5bwbjd24rmfz.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_ei6gqxwtjd24rmh8.fromDom(rawParent);
      ret.push(parent);
      if (stop(parent) === true)
        break;
      else
        dom = rawParent;
    }
    return ret;
  };
  var siblings = function (element) {
    var filterSelf = function (elements) {
      return $_3vsestw9jd24rmfo.filter(elements, function (x) {
        return !$_237cqww8jd24rmfh.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return $_asi680wajd24rmfv.from(dom.offsetParent).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return $_asi680wajd24rmfv.from(dom.previousSibling).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return $_asi680wajd24rmfv.from(dom.nextSibling).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var prevSiblings = function (element) {
    return $_3vsestw9jd24rmfo.reverse($_blpkwry4jd24rmlo.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_blpkwry4jd24rmlo.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_3vsestw9jd24rmfo.map(dom.childNodes, $_ei6gqxwtjd24rmh8.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return $_asi680wajd24rmfv.from(children[index]).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var firstChild = function (element) {
    return child(element, 0);
  };
  var lastChild = function (element) {
    return child(element, element.dom().childNodes.length - 1);
  };
  var childNodesCount = function (element) {
    return element.dom().childNodes.length;
  };
  var hasChildNodes = function (element) {
    return element.dom().hasChildNodes();
  };
  var spot = $_ws57hxmjd24rmkd.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_5on3koy3jd24rmlg = {
    owner: owner,
    defaultView: defaultView,
    documentElement: documentElement,
    parent: parent,
    findIndex: findIndex$1,
    parents: parents,
    siblings: siblings,
    prevSibling: prevSibling,
    offsetParent: offsetParent,
    prevSiblings: prevSiblings,
    nextSibling: nextSibling,
    nextSiblings: nextSiblings,
    children: children,
    child: child,
    firstChild: firstChild,
    lastChild: lastChild,
    childNodesCount: childNodesCount,
    hasChildNodes: hasChildNodes,
    leaf: leaf
  };

  var before = function (marker, element) {
    var parent = $_5on3koy3jd24rmlg.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function (marker, element) {
    var sibling = $_5on3koy3jd24rmlg.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_5on3koy3jd24rmlg.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_5on3koy3jd24rmlg.firstChild(parent);
    firstChild.fold(function () {
      append(parent, element);
    }, function (v) {
      parent.dom().insertBefore(element.dom(), v.dom());
    });
  };
  var append = function (parent, element) {
    parent.dom().appendChild(element.dom());
  };
  var appendAt = function (parent, element, index) {
    $_5on3koy3jd24rmlg.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };
  var wrap$2 = function (element, wrapper) {
    before(element, wrapper);
    append(wrapper, element);
  };
  var $_a7pwway2jd24rmlf = {
    before: before,
    after: after,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap$2
  };

  var before$1 = function (marker, elements) {
    $_3vsestw9jd24rmfo.each(elements, function (x) {
      $_a7pwway2jd24rmlf.before(marker, x);
    });
  };
  var after$1 = function (marker, elements) {
    $_3vsestw9jd24rmfo.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_a7pwway2jd24rmlf.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_3vsestw9jd24rmfo.each(elements.slice().reverse(), function (x) {
      $_a7pwway2jd24rmlf.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_3vsestw9jd24rmfo.each(elements, function (x) {
      $_a7pwway2jd24rmlf.append(parent, x);
    });
  };
  var $_5ijnivy6jd24rmlw = {
    before: before$1,
    after: after$1,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_3vsestw9jd24rmfo.each($_5on3koy3jd24rmlg.children(element), function (rogue) {
      remove$4(rogue);
    });
  };
  var remove$4 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_5on3koy3jd24rmlg.children(wrapper);
    if (children.length > 0)
      $_5ijnivy6jd24rmlw.before(wrapper, children);
    remove$4(wrapper);
  };
  var $_edcoi8y5jd24rmlu = {
    empty: empty,
    remove: remove$4,
    unwrap: unwrap
  };

  var inBody = function (element) {
    var dom = $_5fvhg7xxjd24rmkz.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_4myblwwhjd24rmgb.cached(function () {
    return getBody($_ei6gqxwtjd24rmh8.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_ei6gqxwtjd24rmh8.fromDom(body);
  };
  var $_fqsltgy7jd24rmlz = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var fireDetaching = function (component) {
    $_eljod2wvjd24rmhc.emit(component, $_9am11ywwjd24rmhg.detachedFromDom());
    var children = component.components();
    $_3vsestw9jd24rmfo.each(children, fireDetaching);
  };
  var fireAttaching = function (component) {
    var children = component.components();
    $_3vsestw9jd24rmfo.each(children, fireAttaching);
    $_eljod2wvjd24rmhc.emit(component, $_9am11ywwjd24rmhg.attachedToDom());
  };
  var attach = function (parent, child) {
    attachWith(parent, child, $_a7pwway2jd24rmlf.append);
  };
  var attachWith = function (parent, child, insertion) {
    parent.getSystem().addToWorld(child);
    insertion(parent.element(), child.element());
    if ($_fqsltgy7jd24rmlz.inBody(parent.element()))
      fireAttaching(child);
    parent.syncComponents();
  };
  var doDetach = function (component) {
    fireDetaching(component);
    $_edcoi8y5jd24rmlu.remove(component.element());
    component.getSystem().removeFromWorld(component);
  };
  var detach = function (component) {
    var parent = $_5on3koy3jd24rmlg.parent(component.element()).bind(function (p) {
      return component.getSystem().getByDom(p).fold($_asi680wajd24rmfv.none, $_asi680wajd24rmfv.some);
    });
    doDetach(component);
    parent.each(function (p) {
      p.syncComponents();
    });
  };
  var detachChildren = function (component) {
    var subs = component.components();
    $_3vsestw9jd24rmfo.each(subs, doDetach);
    $_edcoi8y5jd24rmlu.empty(component.element());
    component.syncComponents();
  };
  var attachSystem = function (element, guiSystem) {
    $_a7pwway2jd24rmlf.append(element, guiSystem.element());
    var children = $_5on3koy3jd24rmlg.children(guiSystem.element());
    $_3vsestw9jd24rmfo.each(children, function (child) {
      guiSystem.getByDom(child).each(fireAttaching);
    });
  };
  var detachSystem = function (guiSystem) {
    var children = $_5on3koy3jd24rmlg.children(guiSystem.element());
    $_3vsestw9jd24rmfo.each(children, function (child) {
      guiSystem.getByDom(child).each(fireDetaching);
    });
    $_edcoi8y5jd24rmlu.remove(guiSystem.element());
  };
  var $_41u2roy1jd24rml7 = {
    attach: attach,
    attachWith: attachWith,
    detach: detach,
    detachChildren: detachChildren,
    attachSystem: attachSystem,
    detachSystem: detachSystem
  };

  var fromHtml$1 = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return $_5on3koy3jd24rmlg.children($_ei6gqxwtjd24rmh8.fromDom(div));
  };
  var fromTags = function (tags, scope) {
    return $_3vsestw9jd24rmfo.map(tags, function (x) {
      return $_ei6gqxwtjd24rmh8.fromTag(x, scope);
    });
  };
  var fromText$1 = function (texts, scope) {
    return $_3vsestw9jd24rmfo.map(texts, function (x) {
      return $_ei6gqxwtjd24rmh8.fromText(x, scope);
    });
  };
  var fromDom$1 = function (nodes) {
    return $_3vsestw9jd24rmfo.map(nodes, $_ei6gqxwtjd24rmh8.fromDom);
  };
  var $_4aae6oycjd24rmmg = {
    fromHtml: fromHtml$1,
    fromTags: fromTags,
    fromText: fromText$1,
    fromDom: fromDom$1
  };

  var get$2 = function (element) {
    return element.dom().innerHTML;
  };
  var set$1 = function (element, content) {
    var owner = $_5on3koy3jd24rmlg.owner(element);
    var docDom = owner.dom();
    var fragment = $_ei6gqxwtjd24rmh8.fromDom(docDom.createDocumentFragment());
    var contentElements = $_4aae6oycjd24rmmg.fromHtml(content, docDom);
    $_5ijnivy6jd24rmlw.append(fragment, contentElements);
    $_edcoi8y5jd24rmlu.empty(element);
    $_a7pwway2jd24rmlf.append(element, fragment);
  };
  var getOuter = function (element) {
    var container = $_ei6gqxwtjd24rmh8.fromTag('div');
    var clone = $_ei6gqxwtjd24rmh8.fromDom(element.dom().cloneNode(true));
    $_a7pwway2jd24rmlf.append(container, clone);
    return get$2(container);
  };
  var $_bewbr4ybjd24rmmf = {
    get: get$2,
    set: set$1,
    getOuter: getOuter
  };

  var clone$1 = function (original, deep) {
    return $_ei6gqxwtjd24rmh8.fromDom(original.dom().cloneNode(deep));
  };
  var shallow$1 = function (original) {
    return clone$1(original, false);
  };
  var deep$1 = function (original) {
    return clone$1(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_ei6gqxwtjd24rmh8.fromTag(tag);
    var attributes = $_dxjq1vxwjd24rmkv.clone(original);
    $_dxjq1vxwjd24rmkv.setAll(nu, attributes);
    return nu;
  };
  var copy = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_5on3koy3jd24rmlg.children(deep$1(original));
    $_5ijnivy6jd24rmlw.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_a7pwway2jd24rmlf.before(original, nu);
    var children = $_5on3koy3jd24rmlg.children(original);
    $_5ijnivy6jd24rmlw.append(nu, children);
    $_edcoi8y5jd24rmlu.remove(original);
    return nu;
  };
  var $_cghyi2ydjd24rmmj = {
    shallow: shallow$1,
    shallowAs: shallowAs,
    deep: deep$1,
    copy: copy,
    mutate: mutate
  };

  var getHtml = function (element) {
    var clone = $_cghyi2ydjd24rmmj.shallow(element);
    return $_bewbr4ybjd24rmmf.getOuter(clone);
  };
  var $_24gzubyajd24rmmc = { getHtml: getHtml };

  var element = function (elem) {
    return $_24gzubyajd24rmmc.getHtml(elem);
  };
  var $_3r5kv7y9jd24rmmb = { element: element };

  var cat = function (arr) {
    var r = [];
    var push = function (x) {
      r.push(x);
    };
    for (var i = 0; i < arr.length; i++) {
      arr[i].each(push);
    }
    return r;
  };
  var findMap = function (arr, f) {
    for (var i = 0; i < arr.length; i++) {
      var r = f(arr[i], i);
      if (r.isSome()) {
        return r;
      }
    }
    return $_asi680wajd24rmfv.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return $_asi680wajd24rmfv.none();
      }
    }
    return $_asi680wajd24rmfv.some(f.apply(null, r));
  };
  var $_dq6bfmyejd24rmml = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var unknown$3 = 'unknown';
  var debugging = true;
  var CHROME_INSPECTOR_GLOBAL = '__CHROME_INSPECTOR_CONNECTION_TO_ALLOY__';
  var eventsMonitored = [];
  var path$1 = [
    'alloy/data/Fields',
    'alloy/debugging/Debugging'
  ];
  var getTrace = function () {
    if (debugging === false)
      return unknown$3;
    var err = new Error();
    if (err.stack !== undefined) {
      var lines = err.stack.split('\n');
      return $_3vsestw9jd24rmfo.find(lines, function (line) {
        return line.indexOf('alloy') > 0 && !$_3vsestw9jd24rmfo.exists(path$1, function (p) {
          return line.indexOf(p) > -1;
        });
      }).getOr(unknown$3);
    } else {
      return unknown$3;
    }
  };
  var logHandler = function (label, handlerName, trace) {
  };
  var ignoreEvent = {
    logEventCut: $_aoet5bwbjd24rmfz.noop,
    logEventStopped: $_aoet5bwbjd24rmfz.noop,
    logNoParent: $_aoet5bwbjd24rmfz.noop,
    logEventNoHandlers: $_aoet5bwbjd24rmfz.noop,
    logEventResponse: $_aoet5bwbjd24rmfz.noop,
    write: $_aoet5bwbjd24rmfz.noop
  };
  var monitorEvent = function (eventName, initialTarget, f) {
    var logger = debugging && (eventsMonitored === '*' || $_3vsestw9jd24rmfo.contains(eventsMonitored, eventName)) ? function () {
      var sequence = [];
      return {
        logEventCut: function (name, target, purpose) {
          sequence.push({
            outcome: 'cut',
            target: target,
            purpose: purpose
          });
        },
        logEventStopped: function (name, target, purpose) {
          sequence.push({
            outcome: 'stopped',
            target: target,
            purpose: purpose
          });
        },
        logNoParent: function (name, target, purpose) {
          sequence.push({
            outcome: 'no-parent',
            target: target,
            purpose: purpose
          });
        },
        logEventNoHandlers: function (name, target) {
          sequence.push({
            outcome: 'no-handlers-left',
            target: target
          });
        },
        logEventResponse: function (name, target, purpose) {
          sequence.push({
            outcome: 'response',
            purpose: purpose,
            target: target
          });
        },
        write: function () {
          if ($_3vsestw9jd24rmfo.contains([
              'mousemove',
              'mouseover',
              'mouseout',
              $_9am11ywwjd24rmhg.systemInit()
            ], eventName))
            return;
          console.log(eventName, {
            event: eventName,
            target: initialTarget.dom(),
            sequence: $_3vsestw9jd24rmfo.map(sequence, function (s) {
              if (!$_3vsestw9jd24rmfo.contains([
                  'cut',
                  'stopped',
                  'response'
                ], s.outcome))
                return s.outcome;
              else
                return '{' + s.purpose + '} ' + s.outcome + ' at (' + $_3r5kv7y9jd24rmmb.element(s.target) + ')';
            })
          });
        }
      };
    }() : ignoreEvent;
    var output = f(logger);
    logger.write();
    return output;
  };
  var inspectorInfo = function (comp) {
    var go = function (c) {
      var cSpec = c.spec();
      return {
        '(original.spec)': cSpec,
        '(dom.ref)': c.element().dom(),
        '(element)': $_3r5kv7y9jd24rmmb.element(c.element()),
        '(initComponents)': $_3vsestw9jd24rmfo.map(cSpec.components !== undefined ? cSpec.components : [], go),
        '(components)': $_3vsestw9jd24rmfo.map(c.components(), go),
        '(bound.events)': $_2hhb0ax0jd24rmhp.mapToArray(c.events(), function (v, k) {
          return [k];
        }).join(', '),
        '(behaviours)': cSpec.behaviours !== undefined ? $_2hhb0ax0jd24rmhp.map(cSpec.behaviours, function (v, k) {
          return v === undefined ? '--revoked--' : {
            config: v.configAsRaw(),
            'original-config': v.initialConfig,
            state: c.readState(k)
          };
        }) : 'none'
      };
    };
    return go(comp);
  };
  var getOrInitConnection = function () {
    if (window[CHROME_INSPECTOR_GLOBAL] !== undefined)
      return window[CHROME_INSPECTOR_GLOBAL];
    else {
      window[CHROME_INSPECTOR_GLOBAL] = {
        systems: {},
        lookup: function (uid) {
          var systems = window[CHROME_INSPECTOR_GLOBAL].systems;
          var connections = $_2hhb0ax0jd24rmhp.keys(systems);
          return $_dq6bfmyejd24rmml.findMap(connections, function (conn) {
            var connGui = systems[conn];
            return connGui.getByUid(uid).toOption().map(function (comp) {
              return $_bzffwwx6jd24rmit.wrap($_3r5kv7y9jd24rmmb.element(comp.element()), inspectorInfo(comp));
            });
          });
        }
      };
      return window[CHROME_INSPECTOR_GLOBAL];
    }
  };
  var registerInspector = function (name, gui) {
    var connection = getOrInitConnection();
    connection.systems[name] = gui;
  };
  var $_e4133ky8jd24rmm3 = {
    logHandler: logHandler,
    noLogger: $_aoet5bwbjd24rmfz.constant(ignoreEvent),
    getTrace: getTrace,
    monitorEvent: monitorEvent,
    isDebugging: $_aoet5bwbjd24rmfz.constant(debugging),
    registerInspector: registerInspector
  };

  var Cell = function (initial) {
    var value = initial;
    var get = function () {
      return value;
    };
    var set = function (v) {
      value = v;
    };
    var clone = function () {
      return Cell(get());
    };
    return {
      get: get,
      set: set,
      clone: clone
    };
  };

  function ClosestOrAncestor (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? $_asi680wajd24rmfv.some(scope) : $_cbf8cdwzjd24rmhn.isFunction(isRoot) && isRoot(scope) ? $_asi680wajd24rmfv.none() : ancestor(scope, a, isRoot);
  }

  var first$1 = function (predicate) {
    return descendant($_fqsltgy7jd24rmlz.body(), predicate);
  };
  var ancestor = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_cbf8cdwzjd24rmhn.isFunction(isRoot) ? isRoot : $_aoet5bwbjd24rmfz.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_ei6gqxwtjd24rmh8.fromDom(element);
      if (predicate(el))
        return $_asi680wajd24rmfv.some(el);
      else if (stop(el))
        break;
    }
    return $_asi680wajd24rmfv.none();
  };
  var closest = function (scope, predicate, isRoot) {
    var is = function (scope) {
      return predicate(scope);
    };
    return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot);
  };
  var sibling = function (scope, predicate) {
    var element = scope.dom();
    if (!element.parentNode)
      return $_asi680wajd24rmfv.none();
    return child$1($_ei6gqxwtjd24rmh8.fromDom(element.parentNode), function (x) {
      return !$_237cqww8jd24rmfh.eq(scope, x) && predicate(x);
    });
  };
  var child$1 = function (scope, predicate) {
    var result = $_3vsestw9jd24rmfo.find(scope.dom().childNodes, $_aoet5bwbjd24rmfz.compose(predicate, $_ei6gqxwtjd24rmh8.fromDom));
    return result.map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var descendant = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_ei6gqxwtjd24rmh8.fromDom(element.childNodes[i])))
          return $_asi680wajd24rmfv.some($_ei6gqxwtjd24rmh8.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return $_asi680wajd24rmfv.none();
    };
    return descend(scope.dom());
  };
  var $_en3fpayijd24rmmt = {
    first: first$1,
    ancestor: ancestor,
    closest: closest,
    sibling: sibling,
    child: child$1,
    descendant: descendant
  };

  var any$1 = function (predicate) {
    return $_en3fpayijd24rmmt.first(predicate).isSome();
  };
  var ancestor$1 = function (scope, predicate, isRoot) {
    return $_en3fpayijd24rmmt.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest$1 = function (scope, predicate, isRoot) {
    return $_en3fpayijd24rmmt.closest(scope, predicate, isRoot).isSome();
  };
  var sibling$1 = function (scope, predicate) {
    return $_en3fpayijd24rmmt.sibling(scope, predicate).isSome();
  };
  var child$2 = function (scope, predicate) {
    return $_en3fpayijd24rmmt.child(scope, predicate).isSome();
  };
  var descendant$1 = function (scope, predicate) {
    return $_en3fpayijd24rmmt.descendant(scope, predicate).isSome();
  };
  var $_dpiwpgyhjd24rmmr = {
    any: any$1,
    ancestor: ancestor$1,
    closest: closest$1,
    sibling: sibling$1,
    child: child$2,
    descendant: descendant$1
  };

  var focus = function (element) {
    element.dom().focus();
  };
  var blur = function (element) {
    element.dom().blur();
  };
  var hasFocus = function (element) {
    var doc = $_5on3koy3jd24rmlg.owner(element).dom();
    return element.dom() === doc.activeElement;
  };
  var active = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    return $_asi680wajd24rmfv.from(doc.activeElement).map($_ei6gqxwtjd24rmh8.fromDom);
  };
  var focusInside = function (element) {
    var doc = $_5on3koy3jd24rmlg.owner(element);
    var inside = active(doc).filter(function (a) {
      return $_dpiwpgyhjd24rmmr.closest(a, $_aoet5bwbjd24rmfz.curry($_237cqww8jd24rmfh.eq, element));
    });
    inside.fold(function () {
      focus(element);
    }, $_aoet5bwbjd24rmfz.noop);
  };
  var search = function (element) {
    return active($_5on3koy3jd24rmlg.owner(element)).filter(function (e) {
      return element.dom().contains(e.dom());
    });
  };
  var $_9uflcdygjd24rmmn = {
    hasFocus: hasFocus,
    focus: focus,
    blur: blur,
    active: active,
    search: search,
    focusInside: focusInside
  };

  var ThemeManager = tinymce.util.Tools.resolve('tinymce.ThemeManager');

  var DOMUtils = tinymce.util.Tools.resolve('tinymce.dom.DOMUtils');

  var openLink = function (target) {
    var link = document.createElement('a');
    link.target = '_blank';
    link.href = target.href;
    link.rel = 'noreferrer noopener';
    var nuEvt = document.createEvent('MouseEvents');
    nuEvt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    document.body.appendChild(link);
    link.dispatchEvent(nuEvt);
    document.body.removeChild(link);
  };
  var $_6xjq0uymjd24rmn3 = { openLink: openLink };

  var isSkinDisabled = function (editor) {
    return editor.settings.skin === false;
  };
  var $_24galiynjd24rmn4 = { isSkinDisabled: isSkinDisabled };

  var formatChanged = 'formatChanged';
  var orientationChanged = 'orientationChanged';
  var dropupDismissed = 'dropupDismissed';
  var $_11cbmdyojd24rmn5 = {
    formatChanged: $_aoet5bwbjd24rmfz.constant(formatChanged),
    orientationChanged: $_aoet5bwbjd24rmfz.constant(orientationChanged),
    dropupDismissed: $_aoet5bwbjd24rmfz.constant(dropupDismissed)
  };

  var chooseChannels = function (channels, message) {
    return message.universal() ? channels : $_3vsestw9jd24rmfo.filter(channels, function (ch) {
      return $_3vsestw9jd24rmfo.contains(message.channels(), ch);
    });
  };
  var events = function (receiveConfig) {
    return $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.receive(), function (component, message) {
        var channelMap = receiveConfig.channels();
        var channels = $_2hhb0ax0jd24rmhp.keys(channelMap);
        var targetChannels = chooseChannels(channels, message);
        $_3vsestw9jd24rmfo.each(targetChannels, function (ch) {
          var channelInfo = channelMap[ch]();
          var channelSchema = channelInfo.schema();
          var data = $_bdtykhxhjd24rmjn.asStructOrDie('channel[' + ch + '] data\nReceiver: ' + $_3r5kv7y9jd24rmmb.element(component.element()), channelSchema, message.data());
          channelInfo.onReceive()(component, data);
        });
      })]);
  };
  var $_cddr1syrjd24rmnk = { events: events };

  var menuFields = [
    $_w7f5sx2jd24rmi1.strict('menu'),
    $_w7f5sx2jd24rmi1.strict('selectedMenu')
  ];
  var itemFields = [
    $_w7f5sx2jd24rmi1.strict('item'),
    $_w7f5sx2jd24rmi1.strict('selectedItem')
  ];
  var schema = $_bdtykhxhjd24rmjn.objOfOnly(itemFields.concat(menuFields));
  var itemSchema = $_bdtykhxhjd24rmjn.objOfOnly(itemFields);
  var $_3czimuyujd24rmo1 = {
    menuFields: $_aoet5bwbjd24rmfz.constant(menuFields),
    itemFields: $_aoet5bwbjd24rmfz.constant(itemFields),
    schema: $_aoet5bwbjd24rmfz.constant(schema),
    itemSchema: $_aoet5bwbjd24rmfz.constant(itemSchema)
  };

  var initSize = $_w7f5sx2jd24rmi1.strictObjOf('initSize', [
    $_w7f5sx2jd24rmi1.strict('numColumns'),
    $_w7f5sx2jd24rmi1.strict('numRows')
  ]);
  var itemMarkers = function () {
    return $_w7f5sx2jd24rmi1.strictOf('markers', $_3czimuyujd24rmo1.itemSchema());
  };
  var menuMarkers = function () {
    return $_w7f5sx2jd24rmi1.strictOf('markers', $_3czimuyujd24rmo1.schema());
  };
  var tieredMenuMarkers = function () {
    return $_w7f5sx2jd24rmi1.strictObjOf('markers', [$_w7f5sx2jd24rmi1.strict('backgroundMenu')].concat($_3czimuyujd24rmo1.menuFields()).concat($_3czimuyujd24rmo1.itemFields()));
  };
  var markers = function (required) {
    return $_w7f5sx2jd24rmi1.strictObjOf('markers', $_3vsestw9jd24rmfo.map(required, $_w7f5sx2jd24rmi1.strict));
  };
  var onPresenceHandler = function (label, fieldName, presence) {
    var trace = $_e4133ky8jd24rmm3.getTrace();
    return $_w7f5sx2jd24rmi1.field(fieldName, fieldName, presence, $_bdtykhxhjd24rmjn.valueOf(function (f) {
      return $_b2qdiox8jd24rmj0.value(function () {
        $_e4133ky8jd24rmm3.logHandler(label, fieldName, trace);
        return f.apply(undefined, arguments);
      });
    }));
  };
  var onHandler = function (fieldName) {
    return onPresenceHandler('onHandler', fieldName, $_a33fuhx3jd24rmi5.defaulted($_aoet5bwbjd24rmfz.noop));
  };
  var onKeyboardHandler = function (fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, $_a33fuhx3jd24rmi5.defaulted($_asi680wajd24rmfv.none));
  };
  var onStrictHandler = function (fieldName) {
    return onPresenceHandler('onHandler', fieldName, $_a33fuhx3jd24rmi5.strict());
  };
  var onStrictKeyboardHandler = function (fieldName) {
    return onPresenceHandler('onKeyboardHandler', fieldName, $_a33fuhx3jd24rmi5.strict());
  };
  var output$1 = function (name, value) {
    return $_w7f5sx2jd24rmi1.state(name, $_aoet5bwbjd24rmfz.constant(value));
  };
  var snapshot$1 = function (name) {
    return $_w7f5sx2jd24rmi1.state(name, $_aoet5bwbjd24rmfz.identity);
  };
  var $_62w1klytjd24rmnt = {
    initSize: $_aoet5bwbjd24rmfz.constant(initSize),
    itemMarkers: itemMarkers,
    menuMarkers: menuMarkers,
    tieredMenuMarkers: tieredMenuMarkers,
    markers: markers,
    onHandler: onHandler,
    onKeyboardHandler: onKeyboardHandler,
    onStrictHandler: onStrictHandler,
    onStrictKeyboardHandler: onStrictKeyboardHandler,
    output: output$1,
    snapshot: snapshot$1
  };

  var ReceivingSchema = [$_w7f5sx2jd24rmi1.strictOf('channels', $_bdtykhxhjd24rmjn.setOf($_b2qdiox8jd24rmj0.value, $_bdtykhxhjd24rmjn.objOfOnly([
      $_62w1klytjd24rmnt.onStrictHandler('onReceive'),
      $_w7f5sx2jd24rmi1.defaulted('schema', $_bdtykhxhjd24rmjn.anyValue())
    ])))];

  var Receiving = $_9vyb2vw4jd24rmen.create({
    fields: ReceivingSchema,
    name: 'receiving',
    active: $_cddr1syrjd24rmnk
  });

  var updateAriaState = function (component, toggleConfig) {
    var pressed = isOn(component, toggleConfig);
    var ariaInfo = toggleConfig.aria();
    ariaInfo.update()(component, ariaInfo, pressed);
  };
  var toggle$2 = function (component, toggleConfig, toggleState) {
    $_c8qis7xujd24rmks.toggle(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var on = function (component, toggleConfig, toggleState) {
    $_c8qis7xujd24rmks.add(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var off = function (component, toggleConfig, toggleState) {
    $_c8qis7xujd24rmks.remove(component.element(), toggleConfig.toggleClass());
    updateAriaState(component, toggleConfig);
  };
  var isOn = function (component, toggleConfig) {
    return $_c8qis7xujd24rmks.has(component.element(), toggleConfig.toggleClass());
  };
  var onLoad = function (component, toggleConfig, toggleState) {
    var api = toggleConfig.selected() ? on : off;
    api(component, toggleConfig, toggleState);
  };
  var $_7y359myxjd24rmo8 = {
    onLoad: onLoad,
    toggle: toggle$2,
    isOn: isOn,
    on: on,
    off: off
  };

  var exhibit = function (base, toggleConfig, toggleState) {
    return $_g169haxkjd24rmjy.nu({});
  };
  var events$1 = function (toggleConfig, toggleState) {
    var execute = $_a3lv5fw5jd24rmf0.executeEvent(toggleConfig, toggleState, $_7y359myxjd24rmo8.toggle);
    var load = $_a3lv5fw5jd24rmf0.loadEvent(toggleConfig, toggleState, $_7y359myxjd24rmo8.onLoad);
    return $_g9t26pw6jd24rmfc.derive($_3vsestw9jd24rmfo.flatten([
      toggleConfig.toggleOnExecute() ? [execute] : [],
      [load]
    ]));
  };
  var $_f779rgywjd24rmo6 = {
    exhibit: exhibit,
    events: events$1
  };

  var updatePressed = function (component, ariaInfo, status) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'aria-pressed', status);
    if (ariaInfo.syncWithExpanded())
      updateExpanded(component, ariaInfo, status);
  };
  var updateSelected = function (component, ariaInfo, status) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'aria-selected', status);
  };
  var updateChecked = function (component, ariaInfo, status) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'aria-checked', status);
  };
  var updateExpanded = function (component, ariaInfo, status) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'aria-expanded', status);
  };
  var tagAttributes = {
    button: ['aria-pressed'],
    'input:checkbox': ['aria-checked']
  };
  var roleAttributes = {
    'button': ['aria-pressed'],
    'listbox': [
      'aria-pressed',
      'aria-expanded'
    ],
    'menuitemcheckbox': ['aria-checked']
  };
  var detectFromTag = function (component) {
    var elem = component.element();
    var rawTag = $_5fvhg7xxjd24rmkz.name(elem);
    var suffix = rawTag === 'input' && $_dxjq1vxwjd24rmkv.has(elem, 'type') ? ':' + $_dxjq1vxwjd24rmkv.get(elem, 'type') : '';
    return $_bzffwwx6jd24rmit.readOptFrom(tagAttributes, rawTag + suffix);
  };
  var detectFromRole = function (component) {
    var elem = component.element();
    if (!$_dxjq1vxwjd24rmkv.has(elem, 'role'))
      return $_asi680wajd24rmfv.none();
    else {
      var role = $_dxjq1vxwjd24rmkv.get(elem, 'role');
      return $_bzffwwx6jd24rmit.readOptFrom(roleAttributes, role);
    }
  };
  var updateAuto = function (component, ariaInfo, status) {
    var attributes = detectFromRole(component).orThunk(function () {
      return detectFromTag(component);
    }).getOr([]);
    $_3vsestw9jd24rmfo.each(attributes, function (attr) {
      $_dxjq1vxwjd24rmkv.set(component.element(), attr, status);
    });
  };
  var $_3sxyp6yzjd24rmoe = {
    updatePressed: updatePressed,
    updateSelected: updateSelected,
    updateChecked: updateChecked,
    updateExpanded: updateExpanded,
    updateAuto: updateAuto
  };

  var ToggleSchema = [
    $_w7f5sx2jd24rmi1.defaulted('selected', false),
    $_w7f5sx2jd24rmi1.strict('toggleClass'),
    $_w7f5sx2jd24rmi1.defaulted('toggleOnExecute', true),
    $_w7f5sx2jd24rmi1.defaultedOf('aria', { mode: 'none' }, $_bdtykhxhjd24rmjn.choose('mode', {
      'pressed': [
        $_w7f5sx2jd24rmi1.defaulted('syncWithExpanded', false),
        $_62w1klytjd24rmnt.output('update', $_3sxyp6yzjd24rmoe.updatePressed)
      ],
      'checked': [$_62w1klytjd24rmnt.output('update', $_3sxyp6yzjd24rmoe.updateChecked)],
      'expanded': [$_62w1klytjd24rmnt.output('update', $_3sxyp6yzjd24rmoe.updateExpanded)],
      'selected': [$_62w1klytjd24rmnt.output('update', $_3sxyp6yzjd24rmoe.updateSelected)],
      'none': [$_62w1klytjd24rmnt.output('update', $_aoet5bwbjd24rmfz.noop)]
    }))
  ];

  var Toggling = $_9vyb2vw4jd24rmen.create({
    fields: ToggleSchema,
    name: 'toggling',
    active: $_f779rgywjd24rmo6,
    apis: $_7y359myxjd24rmo8
  });

  var format = function (command, update) {
    return Receiving.config({
      channels: $_bzffwwx6jd24rmit.wrap($_11cbmdyojd24rmn5.formatChanged(), {
        onReceive: function (button, data) {
          if (data.command === command) {
            update(button, data.state);
          }
        }
      })
    });
  };
  var orientation = function (onReceive) {
    return Receiving.config({ channels: $_bzffwwx6jd24rmit.wrap($_11cbmdyojd24rmn5.orientationChanged(), { onReceive: onReceive }) });
  };
  var receive = function (channel, onReceive) {
    return {
      key: channel,
      value: { onReceive: onReceive }
    };
  };
  var $_xzzzbz0jd24rmol = {
    format: format,
    orientation: orientation,
    receive: receive
  };

  var prefix = 'tinymce-mobile';
  var resolve$1 = function (p) {
    return prefix + '-' + p;
  };
  var $_4i0vdoz1jd24rmoo = {
    resolve: resolve$1,
    prefix: $_aoet5bwbjd24rmfz.constant(prefix)
  };

  var exhibit$1 = function (base, unselectConfig) {
    return $_g169haxkjd24rmjy.nu({
      styles: {
        '-webkit-user-select': 'none',
        'user-select': 'none',
        '-ms-user-select': 'none',
        '-moz-user-select': '-moz-none'
      },
      attributes: { 'unselectable': 'on' }
    });
  };
  var events$2 = function (unselectConfig) {
    return $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.abort($_1tcfm9wxjd24rmhk.selectstart(), $_aoet5bwbjd24rmfz.constant(true))]);
  };
  var $_dajir8z4jd24rmow = {
    events: events$2,
    exhibit: exhibit$1
  };

  var Unselecting = $_9vyb2vw4jd24rmen.create({
    fields: [],
    name: 'unselecting',
    active: $_dajir8z4jd24rmow
  });

  var focus$1 = function (component, focusConfig) {
    if (!focusConfig.ignore()) {
      $_9uflcdygjd24rmmn.focus(component.element());
      focusConfig.onFocus()(component);
    }
  };
  var blur$1 = function (component, focusConfig) {
    if (!focusConfig.ignore()) {
      $_9uflcdygjd24rmmn.blur(component.element());
    }
  };
  var isFocused = function (component) {
    return $_9uflcdygjd24rmmn.hasFocus(component.element());
  };
  var $_kqrlrz8jd24rmp9 = {
    focus: focus$1,
    blur: blur$1,
    isFocused: isFocused
  };

  var exhibit$2 = function (base, focusConfig) {
    if (focusConfig.ignore())
      return $_g169haxkjd24rmjy.nu({});
    else
      return $_g169haxkjd24rmjy.nu({ attributes: { 'tabindex': '-1' } });
  };
  var events$3 = function (focusConfig) {
    return $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.focus(), function (component, simulatedEvent) {
        $_kqrlrz8jd24rmp9.focus(component, focusConfig);
        simulatedEvent.stop();
      })]);
  };
  var $_3ugdnsz7jd24rmp7 = {
    exhibit: exhibit$2,
    events: events$3
  };

  var FocusSchema = [
    $_62w1klytjd24rmnt.onHandler('onFocus'),
    $_w7f5sx2jd24rmi1.defaulted('ignore', false)
  ];

  var Focusing = $_9vyb2vw4jd24rmen.create({
    fields: FocusSchema,
    name: 'focusing',
    active: $_3ugdnsz7jd24rmp7,
    apis: $_kqrlrz8jd24rmp9
  });

  var $_vz8vfzejd24rmpw = {
    BACKSPACE: $_aoet5bwbjd24rmfz.constant([8]),
    TAB: $_aoet5bwbjd24rmfz.constant([9]),
    ENTER: $_aoet5bwbjd24rmfz.constant([13]),
    SHIFT: $_aoet5bwbjd24rmfz.constant([16]),
    CTRL: $_aoet5bwbjd24rmfz.constant([17]),
    ALT: $_aoet5bwbjd24rmfz.constant([18]),
    CAPSLOCK: $_aoet5bwbjd24rmfz.constant([20]),
    ESCAPE: $_aoet5bwbjd24rmfz.constant([27]),
    SPACE: $_aoet5bwbjd24rmfz.constant([32]),
    PAGEUP: $_aoet5bwbjd24rmfz.constant([33]),
    PAGEDOWN: $_aoet5bwbjd24rmfz.constant([34]),
    END: $_aoet5bwbjd24rmfz.constant([35]),
    HOME: $_aoet5bwbjd24rmfz.constant([36]),
    LEFT: $_aoet5bwbjd24rmfz.constant([37]),
    UP: $_aoet5bwbjd24rmfz.constant([38]),
    RIGHT: $_aoet5bwbjd24rmfz.constant([39]),
    DOWN: $_aoet5bwbjd24rmfz.constant([40]),
    INSERT: $_aoet5bwbjd24rmfz.constant([45]),
    DEL: $_aoet5bwbjd24rmfz.constant([46]),
    META: $_aoet5bwbjd24rmfz.constant([
      91,
      93,
      224
    ]),
    F10: $_aoet5bwbjd24rmfz.constant([121])
  };

  var cycleBy = function (value, delta, min, max) {
    var r = value + delta;
    if (r > max)
      return min;
    else
      return r < min ? max : r;
  };
  var cap = function (value, min, max) {
    if (value <= min)
      return min;
    else
      return value >= max ? max : value;
  };
  var $_83gqzezjjd24rmqg = {
    cycleBy: cycleBy,
    cap: cap
  };

  var all$2 = function (predicate) {
    return descendants($_fqsltgy7jd24rmlz.body(), predicate);
  };
  var ancestors = function (scope, predicate, isRoot) {
    return $_3vsestw9jd24rmfo.filter($_5on3koy3jd24rmlg.parents(scope, isRoot), predicate);
  };
  var siblings$1 = function (scope, predicate) {
    return $_3vsestw9jd24rmfo.filter($_5on3koy3jd24rmlg.siblings(scope), predicate);
  };
  var children$1 = function (scope, predicate) {
    return $_3vsestw9jd24rmfo.filter($_5on3koy3jd24rmlg.children(scope), predicate);
  };
  var descendants = function (scope, predicate) {
    var result = [];
    $_3vsestw9jd24rmfo.each($_5on3koy3jd24rmlg.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants(x, predicate));
    });
    return result;
  };
  var $_4zhq0vzljd24rmqi = {
    all: all$2,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var all$3 = function (selector) {
    return $_afm3pxwsjd24rmh3.all(selector);
  };
  var ancestors$1 = function (scope, selector, isRoot) {
    return $_4zhq0vzljd24rmqi.ancestors(scope, function (e) {
      return $_afm3pxwsjd24rmh3.is(e, selector);
    }, isRoot);
  };
  var siblings$2 = function (scope, selector) {
    return $_4zhq0vzljd24rmqi.siblings(scope, function (e) {
      return $_afm3pxwsjd24rmh3.is(e, selector);
    });
  };
  var children$2 = function (scope, selector) {
    return $_4zhq0vzljd24rmqi.children(scope, function (e) {
      return $_afm3pxwsjd24rmh3.is(e, selector);
    });
  };
  var descendants$1 = function (scope, selector) {
    return $_afm3pxwsjd24rmh3.all(selector, scope);
  };
  var $_dew4q4zkjd24rmqh = {
    all: all$3,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  var first$2 = function (selector) {
    return $_afm3pxwsjd24rmh3.one(selector);
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_en3fpayijd24rmmt.ancestor(scope, function (e) {
      return $_afm3pxwsjd24rmh3.is(e, selector);
    }, isRoot);
  };
  var sibling$2 = function (scope, selector) {
    return $_en3fpayijd24rmmt.sibling(scope, function (e) {
      return $_afm3pxwsjd24rmh3.is(e, selector);
    });
  };
  var child$3 = function (scope, selector) {
    return $_en3fpayijd24rmmt.child(scope, function (e) {
      return $_afm3pxwsjd24rmh3.is(e, selector);
    });
  };
  var descendant$2 = function (scope, selector) {
    return $_afm3pxwsjd24rmh3.one(selector, scope);
  };
  var closest$2 = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_afm3pxwsjd24rmh3.is, ancestor$2, scope, selector, isRoot);
  };
  var $_56vfpvzmjd24rmql = {
    first: first$2,
    ancestor: ancestor$2,
    sibling: sibling$2,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var dehighlightAll = function (component, hConfig, hState) {
    var highlighted = $_dew4q4zkjd24rmqh.descendants(component.element(), '.' + hConfig.highlightClass());
    $_3vsestw9jd24rmfo.each(highlighted, function (h) {
      $_c8qis7xujd24rmks.remove(h, hConfig.highlightClass());
      component.getSystem().getByDom(h).each(function (target) {
        hConfig.onDehighlight()(component, target);
      });
    });
  };
  var dehighlight = function (component, hConfig, hState, target) {
    var wasHighlighted = isHighlighted(component, hConfig, hState, target);
    $_c8qis7xujd24rmks.remove(target.element(), hConfig.highlightClass());
    if (wasHighlighted)
      hConfig.onDehighlight()(component, target);
  };
  var highlight = function (component, hConfig, hState, target) {
    var wasHighlighted = isHighlighted(component, hConfig, hState, target);
    dehighlightAll(component, hConfig, hState);
    $_c8qis7xujd24rmks.add(target.element(), hConfig.highlightClass());
    if (!wasHighlighted)
      hConfig.onHighlight()(component, target);
  };
  var highlightFirst = function (component, hConfig, hState) {
    getFirst(component, hConfig, hState).each(function (firstComp) {
      highlight(component, hConfig, hState, firstComp);
    });
  };
  var highlightLast = function (component, hConfig, hState) {
    getLast(component, hConfig, hState).each(function (lastComp) {
      highlight(component, hConfig, hState, lastComp);
    });
  };
  var highlightAt = function (component, hConfig, hState, index) {
    getByIndex(component, hConfig, hState, index).fold(function (err) {
      throw new Error(err);
    }, function (firstComp) {
      highlight(component, hConfig, hState, firstComp);
    });
  };
  var highlightBy = function (component, hConfig, hState, predicate) {
    var items = $_dew4q4zkjd24rmqh.descendants(component.element(), '.' + hConfig.itemClass());
    var itemComps = $_dq6bfmyejd24rmml.cat($_3vsestw9jd24rmfo.map(items, function (i) {
      return component.getSystem().getByDom(i).toOption();
    }));
    var targetComp = $_3vsestw9jd24rmfo.find(itemComps, predicate);
    targetComp.each(function (c) {
      highlight(component, hConfig, hState, c);
    });
  };
  var isHighlighted = function (component, hConfig, hState, queryTarget) {
    return $_c8qis7xujd24rmks.has(queryTarget.element(), hConfig.highlightClass());
  };
  var getHighlighted = function (component, hConfig, hState) {
    return $_56vfpvzmjd24rmql.descendant(component.element(), '.' + hConfig.highlightClass()).bind(component.getSystem().getByDom);
  };
  var getByIndex = function (component, hConfig, hState, index) {
    var items = $_dew4q4zkjd24rmqh.descendants(component.element(), '.' + hConfig.itemClass());
    return $_asi680wajd24rmfv.from(items[index]).fold(function () {
      return $_b2qdiox8jd24rmj0.error('No element found with index ' + index);
    }, component.getSystem().getByDom);
  };
  var getFirst = function (component, hConfig, hState) {
    return $_56vfpvzmjd24rmql.descendant(component.element(), '.' + hConfig.itemClass()).bind(component.getSystem().getByDom);
  };
  var getLast = function (component, hConfig, hState) {
    var items = $_dew4q4zkjd24rmqh.descendants(component.element(), '.' + hConfig.itemClass());
    var last = items.length > 0 ? $_asi680wajd24rmfv.some(items[items.length - 1]) : $_asi680wajd24rmfv.none();
    return last.bind(component.getSystem().getByDom);
  };
  var getDelta = function (component, hConfig, hState, delta) {
    var items = $_dew4q4zkjd24rmqh.descendants(component.element(), '.' + hConfig.itemClass());
    var current = $_3vsestw9jd24rmfo.findIndex(items, function (item) {
      return $_c8qis7xujd24rmks.has(item, hConfig.highlightClass());
    });
    return current.bind(function (selected) {
      var dest = $_83gqzezjjd24rmqg.cycleBy(selected, delta, 0, items.length - 1);
      return component.getSystem().getByDom(items[dest]);
    });
  };
  var getPrevious = function (component, hConfig, hState) {
    return getDelta(component, hConfig, hState, -1);
  };
  var getNext = function (component, hConfig, hState) {
    return getDelta(component, hConfig, hState, +1);
  };
  var $_g5svjyzijd24rmq6 = {
    dehighlightAll: dehighlightAll,
    dehighlight: dehighlight,
    highlight: highlight,
    highlightFirst: highlightFirst,
    highlightLast: highlightLast,
    highlightAt: highlightAt,
    highlightBy: highlightBy,
    isHighlighted: isHighlighted,
    getHighlighted: getHighlighted,
    getFirst: getFirst,
    getLast: getLast,
    getPrevious: getPrevious,
    getNext: getNext
  };

  var HighlightSchema = [
    $_w7f5sx2jd24rmi1.strict('highlightClass'),
    $_w7f5sx2jd24rmi1.strict('itemClass'),
    $_62w1klytjd24rmnt.onHandler('onHighlight'),
    $_62w1klytjd24rmnt.onHandler('onDehighlight')
  ];

  var Highlighting = $_9vyb2vw4jd24rmen.create({
    fields: HighlightSchema,
    name: 'highlighting',
    apis: $_g5svjyzijd24rmq6
  });

  var dom = function () {
    var get = function (component) {
      return $_9uflcdygjd24rmmn.search(component.element());
    };
    var set = function (component, focusee) {
      component.getSystem().triggerFocus(focusee, component.element());
    };
    return {
      get: get,
      set: set
    };
  };
  var highlights = function () {
    var get = function (component) {
      return Highlighting.getHighlighted(component).map(function (item) {
        return item.element();
      });
    };
    var set = function (component, element) {
      component.getSystem().getByDom(element).fold($_aoet5bwbjd24rmfz.noop, function (item) {
        Highlighting.highlight(component, item);
      });
    };
    return {
      get: get,
      set: set
    };
  };
  var $_8odkg5zgjd24rmq2 = {
    dom: dom,
    highlights: highlights
  };

  var inSet = function (keys) {
    return function (event) {
      return $_3vsestw9jd24rmfo.contains(keys, event.raw().which);
    };
  };
  var and = function (preds) {
    return function (event) {
      return $_3vsestw9jd24rmfo.forall(preds, function (pred) {
        return pred(event);
      });
    };
  };
  var is$1 = function (key) {
    return function (event) {
      return event.raw().which === key;
    };
  };
  var isShift = function (event) {
    return event.raw().shiftKey === true;
  };
  var isControl = function (event) {
    return event.raw().ctrlKey === true;
  };
  var $_7ssp51zpjd24rmqu = {
    inSet: inSet,
    and: and,
    is: is$1,
    isShift: isShift,
    isNotShift: $_aoet5bwbjd24rmfz.not(isShift),
    isControl: isControl,
    isNotControl: $_aoet5bwbjd24rmfz.not(isControl)
  };

  var basic = function (key, action) {
    return {
      matches: $_7ssp51zpjd24rmqu.is(key),
      classification: action
    };
  };
  var rule = function (matches, action) {
    return {
      matches: matches,
      classification: action
    };
  };
  var choose$2 = function (transitions, event) {
    var transition = $_3vsestw9jd24rmfo.find(transitions, function (t) {
      return t.matches(event);
    });
    return transition.map(function (t) {
      return t.classification;
    });
  };
  var $_dc1a40zojd24rmqo = {
    basic: basic,
    rule: rule,
    choose: choose$2
  };

  var typical = function (infoSchema, stateInit, getRules, getEvents, getApis, optFocusIn) {
    var schema = function () {
      return infoSchema.concat([
        $_w7f5sx2jd24rmi1.defaulted('focusManager', $_8odkg5zgjd24rmq2.dom()),
        $_62w1klytjd24rmnt.output('handler', me),
        $_62w1klytjd24rmnt.output('state', stateInit)
      ]);
    };
    var processKey = function (component, simulatedEvent, keyingConfig, keyingState) {
      var rules = getRules(component, simulatedEvent, keyingConfig, keyingState);
      return $_dc1a40zojd24rmqo.choose(rules, simulatedEvent.event()).bind(function (rule) {
        return rule(component, simulatedEvent, keyingConfig, keyingState);
      });
    };
    var toEvents = function (keyingConfig, keyingState) {
      var otherEvents = getEvents(keyingConfig, keyingState);
      var keyEvents = $_g9t26pw6jd24rmfc.derive(optFocusIn.map(function (focusIn) {
        return $_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.focus(), function (component, simulatedEvent) {
          focusIn(component, keyingConfig, keyingState, simulatedEvent);
          simulatedEvent.stop();
        });
      }).toArray().concat([$_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.keydown(), function (component, simulatedEvent) {
          processKey(component, simulatedEvent, keyingConfig, keyingState).each(function (_) {
            simulatedEvent.stop();
          });
        })]));
      return $_4x4s83wyjd24rmhm.deepMerge(otherEvents, keyEvents);
    };
    var me = {
      schema: schema,
      processKey: processKey,
      toEvents: toEvents,
      toApis: getApis
    };
    return me;
  };
  var $_bwztiazfjd24rmpy = { typical: typical };

  var cyclePrev = function (values, index, predicate) {
    var before = $_3vsestw9jd24rmfo.reverse(values.slice(0, index));
    var after = $_3vsestw9jd24rmfo.reverse(values.slice(index + 1));
    return $_3vsestw9jd24rmfo.find(before.concat(after), predicate);
  };
  var tryPrev = function (values, index, predicate) {
    var before = $_3vsestw9jd24rmfo.reverse(values.slice(0, index));
    return $_3vsestw9jd24rmfo.find(before, predicate);
  };
  var cycleNext = function (values, index, predicate) {
    var before = values.slice(0, index);
    var after = values.slice(index + 1);
    return $_3vsestw9jd24rmfo.find(after.concat(before), predicate);
  };
  var tryNext = function (values, index, predicate) {
    var after = values.slice(index + 1);
    return $_3vsestw9jd24rmfo.find(after, predicate);
  };
  var $_2oj7qzzqjd24rmqy = {
    cyclePrev: cyclePrev,
    cycleNext: cycleNext,
    tryPrev: tryPrev,
    tryNext: tryNext
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_djk3kgztjd24rmrb = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_cbf8cdwzjd24rmhn.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_djk3kgztjd24rmrb.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_djk3kgztjd24rmrb.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set$2 = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function (element, css) {
    var dom = element.dom();
    $_2hhb0ax0jd24rmhp.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_2hhb0ax0jd24rmhp.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get$3 = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_fqsltgy7jd24rmlz.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_djk3kgztjd24rmrb.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return $_asi680wajd24rmfv.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_djk3kgztjd24rmrb.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_ei6gqxwtjd24rmh8.fromTag(tag);
    set$2(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove$5 = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_dxjq1vxwjd24rmkv.has(element, 'style') && $_cgnhvywpjd24rmgz.trim($_dxjq1vxwjd24rmkv.get(element, 'style')) === '') {
      $_dxjq1vxwjd24rmkv.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_dxjq1vxwjd24rmkv.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_dxjq1vxwjd24rmkv.remove : $_dxjq1vxwjd24rmkv.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy$1 = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_djk3kgztjd24rmrb.isSupported(sourceDom) && $_djk3kgztjd24rmrb.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne$1 = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set$2(destination, style, value);
    });
  };
  var transfer$1 = function (source, destination, styles) {
    if (!$_5fvhg7xxjd24rmkz.isElement(source) || !$_5fvhg7xxjd24rmkz.isElement(destination))
      return;
    $_3vsestw9jd24rmfo.each(styles, function (style) {
      transferOne$1(source, destination, style);
    });
  };
  var $_ayz4w9zsjd24rmr3 = {
    copy: copy$1,
    set: set$2,
    preserve: preserve,
    setAll: setAll$1,
    setOptions: setOptions,
    remove: remove$5,
    get: get$3,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer$1
  };

  function Dimension (name, getOffset) {
    var set = function (element, h) {
      if (!$_cbf8cdwzjd24rmhn.isNumber(h) && !h.match(/^[0-9]+$/))
        throw name + '.set accepts only positive integer values. Value was ' + h;
      var dom = element.dom();
      if ($_djk3kgztjd24rmrb.isSupported(dom))
        dom.style[name] = h + 'px';
    };
    var get = function (element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = $_ayz4w9zsjd24rmr3.get(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function (element, properties) {
      return $_3vsestw9jd24rmfo.foldl(properties, function (acc, property) {
        var val = $_ayz4w9zsjd24rmr3.get(element, property);
        var value = val === undefined ? 0 : parseInt(val, 10);
        return isNaN(value) ? acc : acc + value;
      }, 0);
    };
    var max = function (element, value, properties) {
      var cumulativeInclusions = aggregate(element, properties);
      var absoluteMax = value > cumulativeInclusions ? value - cumulativeInclusions : 0;
      return absoluteMax;
    };
    return {
      set: set,
      get: get,
      getOuter: getOuter,
      aggregate: aggregate,
      max: max
    };
  }

  var api = Dimension('height', function (element) {
    return $_fqsltgy7jd24rmlz.inBody(element) ? element.dom().getBoundingClientRect().height : element.dom().offsetHeight;
  });
  var set$3 = function (element, h) {
    api.set(element, h);
  };
  var get$4 = function (element) {
    return api.get(element);
  };
  var getOuter$1 = function (element) {
    return api.getOuter(element);
  };
  var setMax = function (element, value) {
    var inclusions = [
      'margin-top',
      'border-top-width',
      'padding-top',
      'padding-bottom',
      'border-bottom-width',
      'margin-bottom'
    ];
    var absMax = api.max(element, value, inclusions);
    $_ayz4w9zsjd24rmr3.set(element, 'max-height', absMax + 'px');
  };
  var $_duiw2pzrjd24rmr1 = {
    set: set$3,
    get: get$4,
    getOuter: getOuter$1,
    setMax: setMax
  };

  var create$2 = function (cyclicField) {
    var schema = [
      $_w7f5sx2jd24rmi1.option('onEscape'),
      $_w7f5sx2jd24rmi1.option('onEnter'),
      $_w7f5sx2jd24rmi1.defaulted('selector', '[data-alloy-tabstop="true"]'),
      $_w7f5sx2jd24rmi1.defaulted('firstTabstop', 0),
      $_w7f5sx2jd24rmi1.defaulted('useTabstopAt', $_aoet5bwbjd24rmfz.constant(true)),
      $_w7f5sx2jd24rmi1.option('visibilitySelector')
    ].concat([cyclicField]);
    var isVisible = function (tabbingConfig, element) {
      var target = tabbingConfig.visibilitySelector().bind(function (sel) {
        return $_56vfpvzmjd24rmql.closest(element, sel);
      }).getOr(element);
      return $_duiw2pzrjd24rmr1.get(target) > 0;
    };
    var findInitial = function (component, tabbingConfig) {
      var tabstops = $_dew4q4zkjd24rmqh.descendants(component.element(), tabbingConfig.selector());
      var visibles = $_3vsestw9jd24rmfo.filter(tabstops, function (elem) {
        return isVisible(tabbingConfig, elem);
      });
      return $_asi680wajd24rmfv.from(visibles[tabbingConfig.firstTabstop()]);
    };
    var findCurrent = function (component, tabbingConfig) {
      return tabbingConfig.focusManager().get(component).bind(function (elem) {
        return $_56vfpvzmjd24rmql.closest(elem, tabbingConfig.selector());
      });
    };
    var isTabstop = function (tabbingConfig, element) {
      return isVisible(tabbingConfig, element) && tabbingConfig.useTabstopAt()(element);
    };
    var focusIn = function (component, tabbingConfig, tabbingState) {
      findInitial(component, tabbingConfig).each(function (target) {
        tabbingConfig.focusManager().set(component, target);
      });
    };
    var goFromTabstop = function (component, tabstops, stopIndex, tabbingConfig, cycle) {
      return cycle(tabstops, stopIndex, function (elem) {
        return isTabstop(tabbingConfig, elem);
      }).fold(function () {
        return tabbingConfig.cyclic() ? $_asi680wajd24rmfv.some(true) : $_asi680wajd24rmfv.none();
      }, function (target) {
        tabbingConfig.focusManager().set(component, target);
        return $_asi680wajd24rmfv.some(true);
      });
    };
    var go = function (component, simulatedEvent, tabbingConfig, cycle) {
      var tabstops = $_dew4q4zkjd24rmqh.descendants(component.element(), tabbingConfig.selector());
      return findCurrent(component, tabbingConfig).bind(function (tabstop) {
        var optStopIndex = $_3vsestw9jd24rmfo.findIndex(tabstops, $_aoet5bwbjd24rmfz.curry($_237cqww8jd24rmfh.eq, tabstop));
        return optStopIndex.bind(function (stopIndex) {
          return goFromTabstop(component, tabstops, stopIndex, tabbingConfig, cycle);
        });
      });
    };
    var goBackwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic() ? $_2oj7qzzqjd24rmqy.cyclePrev : $_2oj7qzzqjd24rmqy.tryPrev;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var goForwards = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      var navigate = tabbingConfig.cyclic() ? $_2oj7qzzqjd24rmqy.cycleNext : $_2oj7qzzqjd24rmqy.tryNext;
      return go(component, simulatedEvent, tabbingConfig, navigate);
    };
    var execute = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEnter().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var exit = function (component, simulatedEvent, tabbingConfig, tabbingState) {
      return tabbingConfig.onEscape().bind(function (f) {
        return f(component, simulatedEvent);
      });
    };
    var getRules = $_aoet5bwbjd24rmfz.constant([
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isShift,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
      ]), goBackwards),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB()), goForwards),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ESCAPE()), exit),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isNotShift,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ENTER())
      ]), execute)
    ]);
    var getEvents = $_aoet5bwbjd24rmfz.constant({});
    var getApis = $_aoet5bwbjd24rmfz.constant({});
    return $_bwztiazfjd24rmpy.typical(schema, $_6n4e0bxqjd24rmkk.init, getRules, getEvents, getApis, $_asi680wajd24rmfv.some(focusIn));
  };
  var $_4hqwarzdjd24rmpl = { create: create$2 };

  var AcyclicType = $_4hqwarzdjd24rmpl.create($_w7f5sx2jd24rmi1.state('cyclic', $_aoet5bwbjd24rmfz.constant(false)));

  var CyclicType = $_4hqwarzdjd24rmpl.create($_w7f5sx2jd24rmi1.state('cyclic', $_aoet5bwbjd24rmfz.constant(true)));

  var inside = function (target) {
    return $_5fvhg7xxjd24rmkz.name(target) === 'input' && $_dxjq1vxwjd24rmkv.get(target, 'type') !== 'radio' || $_5fvhg7xxjd24rmkz.name(target) === 'textarea';
  };
  var $_fpdsjvzxjd24rmrm = { inside: inside };

  var doDefaultExecute = function (component, simulatedEvent, focused) {
    $_eljod2wvjd24rmhc.dispatch(component, focused, $_9am11ywwjd24rmhg.execute());
    return $_asi680wajd24rmfv.some(true);
  };
  var defaultExecute = function (component, simulatedEvent, focused) {
    return $_fpdsjvzxjd24rmrm.inside(focused) && $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE())(simulatedEvent.event()) ? $_asi680wajd24rmfv.none() : doDefaultExecute(component, simulatedEvent, focused);
  };
  var $_evk953zyjd24rmrp = { defaultExecute: defaultExecute };

  var schema$1 = [
    $_w7f5sx2jd24rmi1.defaulted('execute', $_evk953zyjd24rmrp.defaultExecute),
    $_w7f5sx2jd24rmi1.defaulted('useSpace', false),
    $_w7f5sx2jd24rmi1.defaulted('useEnter', true),
    $_w7f5sx2jd24rmi1.defaulted('useControlEnter', false),
    $_w7f5sx2jd24rmi1.defaulted('useDown', false)
  ];
  var execute = function (component, simulatedEvent, executeConfig, executeState) {
    return executeConfig.execute()(component, simulatedEvent, component.element());
  };
  var getRules = function (component, simulatedEvent, executeConfig, executeState) {
    var spaceExec = executeConfig.useSpace() && !$_fpdsjvzxjd24rmrm.inside(component.element()) ? $_vz8vfzejd24rmpw.SPACE() : [];
    var enterExec = executeConfig.useEnter() ? $_vz8vfzejd24rmpw.ENTER() : [];
    var downExec = executeConfig.useDown() ? $_vz8vfzejd24rmpw.DOWN() : [];
    var execKeys = spaceExec.concat(enterExec).concat(downExec);
    return [$_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet(execKeys), execute)].concat(executeConfig.useControlEnter() ? [$_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isControl,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ENTER())
      ]), execute)] : []);
  };
  var getEvents = $_aoet5bwbjd24rmfz.constant({});
  var getApis = $_aoet5bwbjd24rmfz.constant({});
  var ExecutionType = $_bwztiazfjd24rmpy.typical(schema$1, $_6n4e0bxqjd24rmkk.init, getRules, getEvents, getApis, $_asi680wajd24rmfv.none());

  var flatgrid = function (spec) {
    var dimensions = Cell($_asi680wajd24rmfv.none());
    var setGridSize = function (numRows, numColumns) {
      dimensions.set($_asi680wajd24rmfv.some({
        numRows: $_aoet5bwbjd24rmfz.constant(numRows),
        numColumns: $_aoet5bwbjd24rmfz.constant(numColumns)
      }));
    };
    var getNumRows = function () {
      return dimensions.get().map(function (d) {
        return d.numRows();
      });
    };
    var getNumColumns = function () {
      return dimensions.get().map(function (d) {
        return d.numColumns();
      });
    };
    return BehaviourState({
      readState: $_aoet5bwbjd24rmfz.constant({}),
      setGridSize: setGridSize,
      getNumRows: getNumRows,
      getNumColumns: getNumColumns
    });
  };
  var init$1 = function (spec) {
    return spec.state()(spec);
  };
  var $_3ya3d4100jd24rmrz = {
    flatgrid: flatgrid,
    init: init$1
  };

  var onDirection = function (isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function (element) {
    return $_ayz4w9zsjd24rmr3.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };
  var $_ffmz40102jd24rms6 = {
    onDirection: onDirection,
    getDirection: getDirection
  };

  var useH = function (movement) {
    return function (component, simulatedEvent, config, state) {
      var move = movement(component.element());
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var west = function (moveLeft, moveRight) {
    var movement = $_ffmz40102jd24rms6.onDirection(moveLeft, moveRight);
    return useH(movement);
  };
  var east = function (moveLeft, moveRight) {
    var movement = $_ffmz40102jd24rms6.onDirection(moveRight, moveLeft);
    return useH(movement);
  };
  var useV = function (move) {
    return function (component, simulatedEvent, config, state) {
      return use(move, component, simulatedEvent, config, state);
    };
  };
  var use = function (move, component, simulatedEvent, config, state) {
    var outcome = config.focusManager().get(component).bind(function (focused) {
      return move(component.element(), focused, config, state);
    });
    return outcome.map(function (newFocus) {
      config.focusManager().set(component, newFocus);
      return true;
    });
  };
  var $_gj1wyi101jd24rms4 = {
    east: east,
    west: west,
    north: useV,
    south: useV,
    move: useV
  };

  var indexInfo = $_ws57hxmjd24rmkd.immutableBag([
    'index',
    'candidates'
  ], []);
  var locate = function (candidates, predicate) {
    return $_3vsestw9jd24rmfo.findIndex(candidates, predicate).map(function (index) {
      return indexInfo({
        index: index,
        candidates: candidates
      });
    });
  };
  var $_c3x242104jd24rmsf = { locate: locate };

  var visibilityToggler = function (element, property, hiddenValue, visibleValue) {
    var initial = $_ayz4w9zsjd24rmr3.get(element, property);
    if (initial === undefined)
      initial = '';
    var value = initial === hiddenValue ? visibleValue : hiddenValue;
    var off = $_aoet5bwbjd24rmfz.curry($_ayz4w9zsjd24rmr3.set, element, property, initial);
    var on = $_aoet5bwbjd24rmfz.curry($_ayz4w9zsjd24rmr3.set, element, property, value);
    return Toggler(off, on, false);
  };
  var toggler$1 = function (element) {
    return visibilityToggler(element, 'visibility', 'hidden', 'visible');
  };
  var displayToggler = function (element, value) {
    return visibilityToggler(element, 'display', 'none', value);
  };
  var isHidden = function (dom) {
    return dom.offsetWidth <= 0 && dom.offsetHeight <= 0;
  };
  var isVisible = function (element) {
    var dom = element.dom();
    return !isHidden(dom);
  };
  var $_a6okfd105jd24rmsj = {
    toggler: toggler$1,
    displayToggler: displayToggler,
    isVisible: isVisible
  };

  var locateVisible = function (container, current, selector) {
    var filter = $_a6okfd105jd24rmsj.isVisible;
    return locateIn(container, current, selector, filter);
  };
  var locateIn = function (container, current, selector, filter) {
    var predicate = $_aoet5bwbjd24rmfz.curry($_237cqww8jd24rmfh.eq, current);
    var candidates = $_dew4q4zkjd24rmqh.descendants(container, selector);
    var visible = $_3vsestw9jd24rmfo.filter(candidates, $_a6okfd105jd24rmsj.isVisible);
    return $_c3x242104jd24rmsf.locate(visible, predicate);
  };
  var findIndex$2 = function (elements, target) {
    return $_3vsestw9jd24rmfo.findIndex(elements, function (elem) {
      return $_237cqww8jd24rmfh.eq(target, elem);
    });
  };
  var $_89gi95103jd24rms7 = {
    locateVisible: locateVisible,
    locateIn: locateIn,
    findIndex: findIndex$2
  };

  var withGrid = function (values, index, numCols, f) {
    var oldRow = Math.floor(index / numCols);
    var oldColumn = index % numCols;
    return f(oldRow, oldColumn).bind(function (address) {
      var newIndex = address.row() * numCols + address.column();
      return newIndex >= 0 && newIndex < values.length ? $_asi680wajd24rmfv.some(values[newIndex]) : $_asi680wajd24rmfv.none();
    });
  };
  var cycleHorizontal = function (values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var onLastRow = oldRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - oldRow * numCols : numCols;
      var newColumn = $_83gqzezjjd24rmqg.cycleBy(oldColumn, delta, 0, colsInRow - 1);
      return $_asi680wajd24rmfv.some({
        row: $_aoet5bwbjd24rmfz.constant(oldRow),
        column: $_aoet5bwbjd24rmfz.constant(newColumn)
      });
    });
  };
  var cycleVertical = function (values, index, numRows, numCols, delta) {
    return withGrid(values, index, numCols, function (oldRow, oldColumn) {
      var newRow = $_83gqzezjjd24rmqg.cycleBy(oldRow, delta, 0, numRows - 1);
      var onLastRow = newRow === numRows - 1;
      var colsInRow = onLastRow ? values.length - newRow * numCols : numCols;
      var newCol = $_83gqzezjjd24rmqg.cap(oldColumn, 0, colsInRow - 1);
      return $_asi680wajd24rmfv.some({
        row: $_aoet5bwbjd24rmfz.constant(newRow),
        column: $_aoet5bwbjd24rmfz.constant(newCol)
      });
    });
  };
  var cycleRight = function (values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, +1);
  };
  var cycleLeft = function (values, index, numRows, numCols) {
    return cycleHorizontal(values, index, numRows, numCols, -1);
  };
  var cycleUp = function (values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, -1);
  };
  var cycleDown = function (values, index, numRows, numCols) {
    return cycleVertical(values, index, numRows, numCols, +1);
  };
  var $_9e6lxb106jd24rmsm = {
    cycleDown: cycleDown,
    cycleUp: cycleUp,
    cycleLeft: cycleLeft,
    cycleRight: cycleRight
  };

  var schema$2 = [
    $_w7f5sx2jd24rmi1.strict('selector'),
    $_w7f5sx2jd24rmi1.defaulted('execute', $_evk953zyjd24rmrp.defaultExecute),
    $_62w1klytjd24rmnt.onKeyboardHandler('onEscape'),
    $_w7f5sx2jd24rmi1.defaulted('captureTab', false),
    $_62w1klytjd24rmnt.initSize()
  ];
  var focusIn = function (component, gridConfig, gridState) {
    $_56vfpvzmjd24rmql.descendant(component.element(), gridConfig.selector()).each(function (first) {
      gridConfig.focusManager().set(component, first);
    });
  };
  var findCurrent = function (component, gridConfig) {
    return gridConfig.focusManager().get(component).bind(function (elem) {
      return $_56vfpvzmjd24rmql.closest(elem, gridConfig.selector());
    });
  };
  var execute$1 = function (component, simulatedEvent, gridConfig, gridState) {
    return findCurrent(component, gridConfig).bind(function (focused) {
      return gridConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var doMove = function (cycle) {
    return function (element, focused, gridConfig, gridState) {
      return $_89gi95103jd24rms7.locateVisible(element, focused, gridConfig.selector()).bind(function (identified) {
        return cycle(identified.candidates(), identified.index(), gridState.getNumRows().getOr(gridConfig.initSize().numRows()), gridState.getNumColumns().getOr(gridConfig.initSize().numColumns()));
      });
    };
  };
  var handleTab = function (component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.captureTab() ? $_asi680wajd24rmfv.some(true) : $_asi680wajd24rmfv.none();
  };
  var doEscape = function (component, simulatedEvent, gridConfig, gridState) {
    return gridConfig.onEscape()(component, simulatedEvent);
  };
  var moveLeft = doMove($_9e6lxb106jd24rmsm.cycleLeft);
  var moveRight = doMove($_9e6lxb106jd24rmsm.cycleRight);
  var moveNorth = doMove($_9e6lxb106jd24rmsm.cycleUp);
  var moveSouth = doMove($_9e6lxb106jd24rmsm.cycleDown);
  var getRules$1 = $_aoet5bwbjd24rmfz.constant([
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.LEFT()), $_gj1wyi101jd24rms4.west(moveLeft, moveRight)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.RIGHT()), $_gj1wyi101jd24rms4.east(moveLeft, moveRight)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.UP()), $_gj1wyi101jd24rms4.north(moveNorth)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.DOWN()), $_gj1wyi101jd24rms4.south(moveSouth)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
      $_7ssp51zpjd24rmqu.isShift,
      $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
    ]), handleTab),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
      $_7ssp51zpjd24rmqu.isNotShift,
      $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
    ]), handleTab),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ESCAPE()), doEscape),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE().concat($_vz8vfzejd24rmpw.ENTER())), execute$1)
  ]);
  var getEvents$1 = $_aoet5bwbjd24rmfz.constant({});
  var getApis$1 = {};
  var FlatgridType = $_bwztiazfjd24rmpy.typical(schema$2, $_3ya3d4100jd24rmrz.flatgrid, getRules$1, getEvents$1, getApis$1, $_asi680wajd24rmfv.some(focusIn));

  var horizontal = function (container, selector, current, delta) {
    return $_89gi95103jd24rms7.locateVisible(container, current, selector, $_aoet5bwbjd24rmfz.constant(true)).bind(function (identified) {
      var index = identified.index();
      var candidates = identified.candidates();
      var newIndex = $_83gqzezjjd24rmqg.cycleBy(index, delta, 0, candidates.length - 1);
      return $_asi680wajd24rmfv.from(candidates[newIndex]);
    });
  };
  var $_1t7gqc108jd24rmsv = { horizontal: horizontal };

  var schema$3 = [
    $_w7f5sx2jd24rmi1.strict('selector'),
    $_w7f5sx2jd24rmi1.defaulted('getInitial', $_asi680wajd24rmfv.none),
    $_w7f5sx2jd24rmi1.defaulted('execute', $_evk953zyjd24rmrp.defaultExecute),
    $_w7f5sx2jd24rmi1.defaulted('executeOnMove', false)
  ];
  var findCurrent$1 = function (component, flowConfig) {
    return flowConfig.focusManager().get(component).bind(function (elem) {
      return $_56vfpvzmjd24rmql.closest(elem, flowConfig.selector());
    });
  };
  var execute$2 = function (component, simulatedEvent, flowConfig) {
    return findCurrent$1(component, flowConfig).bind(function (focused) {
      return flowConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var focusIn$1 = function (component, flowConfig) {
    flowConfig.getInitial()(component).or($_56vfpvzmjd24rmql.descendant(component.element(), flowConfig.selector())).each(function (first) {
      flowConfig.focusManager().set(component, first);
    });
  };
  var moveLeft$1 = function (element, focused, info) {
    return $_1t7gqc108jd24rmsv.horizontal(element, info.selector(), focused, -1);
  };
  var moveRight$1 = function (element, focused, info) {
    return $_1t7gqc108jd24rmsv.horizontal(element, info.selector(), focused, +1);
  };
  var doMove$1 = function (movement) {
    return function (component, simulatedEvent, flowConfig) {
      return movement(component, simulatedEvent, flowConfig).bind(function () {
        return flowConfig.executeOnMove() ? execute$2(component, simulatedEvent, flowConfig) : $_asi680wajd24rmfv.some(true);
      });
    };
  };
  var getRules$2 = function (_) {
    return [
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.LEFT().concat($_vz8vfzejd24rmpw.UP())), doMove$1($_gj1wyi101jd24rms4.west(moveLeft$1, moveRight$1))),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.RIGHT().concat($_vz8vfzejd24rmpw.DOWN())), doMove$1($_gj1wyi101jd24rms4.east(moveLeft$1, moveRight$1))),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ENTER()), execute$2),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE()), execute$2)
    ];
  };
  var getEvents$2 = $_aoet5bwbjd24rmfz.constant({});
  var getApis$2 = $_aoet5bwbjd24rmfz.constant({});
  var FlowType = $_bwztiazfjd24rmpy.typical(schema$3, $_6n4e0bxqjd24rmkk.init, getRules$2, getEvents$2, getApis$2, $_asi680wajd24rmfv.some(focusIn$1));

  var outcome = $_ws57hxmjd24rmkd.immutableBag([
    'rowIndex',
    'columnIndex',
    'cell'
  ], []);
  var toCell = function (matrix, rowIndex, columnIndex) {
    return $_asi680wajd24rmfv.from(matrix[rowIndex]).bind(function (row) {
      return $_asi680wajd24rmfv.from(row[columnIndex]).map(function (cell) {
        return outcome({
          rowIndex: rowIndex,
          columnIndex: columnIndex,
          cell: cell
        });
      });
    });
  };
  var cycleHorizontal$1 = function (matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = $_83gqzezjjd24rmqg.cycleBy(startCol, deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var cycleVertical$1 = function (matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = $_83gqzezjjd24rmqg.cycleBy(startRow, deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = $_83gqzezjjd24rmqg.cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var moveHorizontal = function (matrix, rowIndex, startCol, deltaCol) {
    var row = matrix[rowIndex];
    var colsInRow = row.length;
    var newColIndex = $_83gqzezjjd24rmqg.cap(startCol + deltaCol, 0, colsInRow - 1);
    return toCell(matrix, rowIndex, newColIndex);
  };
  var moveVertical = function (matrix, colIndex, startRow, deltaRow) {
    var nextRowIndex = $_83gqzezjjd24rmqg.cap(startRow + deltaRow, 0, matrix.length - 1);
    var colsInNextRow = matrix[nextRowIndex].length;
    var nextColIndex = $_83gqzezjjd24rmqg.cap(colIndex, 0, colsInNextRow - 1);
    return toCell(matrix, nextRowIndex, nextColIndex);
  };
  var cycleRight$1 = function (matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, +1);
  };
  var cycleLeft$1 = function (matrix, startRow, startCol) {
    return cycleHorizontal$1(matrix, startRow, startCol, -1);
  };
  var cycleUp$1 = function (matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, -1);
  };
  var cycleDown$1 = function (matrix, startRow, startCol) {
    return cycleVertical$1(matrix, startCol, startRow, +1);
  };
  var moveLeft$2 = function (matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, -1);
  };
  var moveRight$2 = function (matrix, startRow, startCol) {
    return moveHorizontal(matrix, startRow, startCol, +1);
  };
  var moveUp = function (matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, -1);
  };
  var moveDown = function (matrix, startRow, startCol) {
    return moveVertical(matrix, startCol, startRow, +1);
  };
  var $_fy0ur210ajd24rmt8 = {
    cycleRight: cycleRight$1,
    cycleLeft: cycleLeft$1,
    cycleUp: cycleUp$1,
    cycleDown: cycleDown$1,
    moveLeft: moveLeft$2,
    moveRight: moveRight$2,
    moveUp: moveUp,
    moveDown: moveDown
  };

  var schema$4 = [
    $_w7f5sx2jd24rmi1.strictObjOf('selectors', [
      $_w7f5sx2jd24rmi1.strict('row'),
      $_w7f5sx2jd24rmi1.strict('cell')
    ]),
    $_w7f5sx2jd24rmi1.defaulted('cycles', true),
    $_w7f5sx2jd24rmi1.defaulted('previousSelector', $_asi680wajd24rmfv.none),
    $_w7f5sx2jd24rmi1.defaulted('execute', $_evk953zyjd24rmrp.defaultExecute)
  ];
  var focusIn$2 = function (component, matrixConfig) {
    var focused = matrixConfig.previousSelector()(component).orThunk(function () {
      var selectors = matrixConfig.selectors();
      return $_56vfpvzmjd24rmql.descendant(component.element(), selectors.cell());
    });
    focused.each(function (cell) {
      matrixConfig.focusManager().set(component, cell);
    });
  };
  var execute$3 = function (component, simulatedEvent, matrixConfig) {
    return $_9uflcdygjd24rmmn.search(component.element()).bind(function (focused) {
      return matrixConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var toMatrix = function (rows, matrixConfig) {
    return $_3vsestw9jd24rmfo.map(rows, function (row) {
      return $_dew4q4zkjd24rmqh.descendants(row, matrixConfig.selectors().cell());
    });
  };
  var doMove$2 = function (ifCycle, ifMove) {
    return function (element, focused, matrixConfig) {
      var move = matrixConfig.cycles() ? ifCycle : ifMove;
      return $_56vfpvzmjd24rmql.closest(focused, matrixConfig.selectors().row()).bind(function (inRow) {
        var cellsInRow = $_dew4q4zkjd24rmqh.descendants(inRow, matrixConfig.selectors().cell());
        return $_89gi95103jd24rms7.findIndex(cellsInRow, focused).bind(function (colIndex) {
          var allRows = $_dew4q4zkjd24rmqh.descendants(element, matrixConfig.selectors().row());
          return $_89gi95103jd24rms7.findIndex(allRows, inRow).bind(function (rowIndex) {
            var matrix = toMatrix(allRows, matrixConfig);
            return move(matrix, rowIndex, colIndex).map(function (next) {
              return next.cell();
            });
          });
        });
      });
    };
  };
  var moveLeft$3 = doMove$2($_fy0ur210ajd24rmt8.cycleLeft, $_fy0ur210ajd24rmt8.moveLeft);
  var moveRight$3 = doMove$2($_fy0ur210ajd24rmt8.cycleRight, $_fy0ur210ajd24rmt8.moveRight);
  var moveNorth$1 = doMove$2($_fy0ur210ajd24rmt8.cycleUp, $_fy0ur210ajd24rmt8.moveUp);
  var moveSouth$1 = doMove$2($_fy0ur210ajd24rmt8.cycleDown, $_fy0ur210ajd24rmt8.moveDown);
  var getRules$3 = $_aoet5bwbjd24rmfz.constant([
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.LEFT()), $_gj1wyi101jd24rms4.west(moveLeft$3, moveRight$3)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.RIGHT()), $_gj1wyi101jd24rms4.east(moveLeft$3, moveRight$3)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.UP()), $_gj1wyi101jd24rms4.north(moveNorth$1)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.DOWN()), $_gj1wyi101jd24rms4.south(moveSouth$1)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE().concat($_vz8vfzejd24rmpw.ENTER())), execute$3)
  ]);
  var getEvents$3 = $_aoet5bwbjd24rmfz.constant({});
  var getApis$3 = $_aoet5bwbjd24rmfz.constant({});
  var MatrixType = $_bwztiazfjd24rmpy.typical(schema$4, $_6n4e0bxqjd24rmkk.init, getRules$3, getEvents$3, getApis$3, $_asi680wajd24rmfv.some(focusIn$2));

  var schema$5 = [
    $_w7f5sx2jd24rmi1.strict('selector'),
    $_w7f5sx2jd24rmi1.defaulted('execute', $_evk953zyjd24rmrp.defaultExecute),
    $_w7f5sx2jd24rmi1.defaulted('moveOnTab', false)
  ];
  var execute$4 = function (component, simulatedEvent, menuConfig) {
    return menuConfig.focusManager().get(component).bind(function (focused) {
      return menuConfig.execute()(component, simulatedEvent, focused);
    });
  };
  var focusIn$3 = function (component, menuConfig, simulatedEvent) {
    $_56vfpvzmjd24rmql.descendant(component.element(), menuConfig.selector()).each(function (first) {
      menuConfig.focusManager().set(component, first);
    });
  };
  var moveUp$1 = function (element, focused, info) {
    return $_1t7gqc108jd24rmsv.horizontal(element, info.selector(), focused, -1);
  };
  var moveDown$1 = function (element, focused, info) {
    return $_1t7gqc108jd24rmsv.horizontal(element, info.selector(), focused, +1);
  };
  var fireShiftTab = function (component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab() ? $_gj1wyi101jd24rms4.move(moveUp$1)(component, simulatedEvent, menuConfig) : $_asi680wajd24rmfv.none();
  };
  var fireTab = function (component, simulatedEvent, menuConfig) {
    return menuConfig.moveOnTab() ? $_gj1wyi101jd24rms4.move(moveDown$1)(component, simulatedEvent, menuConfig) : $_asi680wajd24rmfv.none();
  };
  var getRules$4 = $_aoet5bwbjd24rmfz.constant([
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.UP()), $_gj1wyi101jd24rms4.move(moveUp$1)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.DOWN()), $_gj1wyi101jd24rms4.move(moveDown$1)),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
      $_7ssp51zpjd24rmqu.isShift,
      $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
    ]), fireShiftTab),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
      $_7ssp51zpjd24rmqu.isNotShift,
      $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
    ]), fireTab),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ENTER()), execute$4),
    $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE()), execute$4)
  ]);
  var getEvents$4 = $_aoet5bwbjd24rmfz.constant({});
  var getApis$4 = $_aoet5bwbjd24rmfz.constant({});
  var MenuType = $_bwztiazfjd24rmpy.typical(schema$5, $_6n4e0bxqjd24rmkk.init, getRules$4, getEvents$4, getApis$4, $_asi680wajd24rmfv.some(focusIn$3));

  var schema$6 = [
    $_62w1klytjd24rmnt.onKeyboardHandler('onSpace'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onEnter'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onShiftEnter'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onLeft'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onRight'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onTab'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onShiftTab'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onUp'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onDown'),
    $_62w1klytjd24rmnt.onKeyboardHandler('onEscape'),
    $_w7f5sx2jd24rmi1.option('focusIn')
  ];
  var getRules$5 = function (component, simulatedEvent, executeInfo) {
    return [
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE()), executeInfo.onSpace()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isNotShift,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ENTER())
      ]), executeInfo.onEnter()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isShift,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ENTER())
      ]), executeInfo.onShiftEnter()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isShift,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
      ]), executeInfo.onShiftTab()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.and([
        $_7ssp51zpjd24rmqu.isNotShift,
        $_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.TAB())
      ]), executeInfo.onTab()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.UP()), executeInfo.onUp()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.DOWN()), executeInfo.onDown()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.LEFT()), executeInfo.onLeft()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.RIGHT()), executeInfo.onRight()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.SPACE()), executeInfo.onSpace()),
      $_dc1a40zojd24rmqo.rule($_7ssp51zpjd24rmqu.inSet($_vz8vfzejd24rmpw.ESCAPE()), executeInfo.onEscape())
    ];
  };
  var focusIn$4 = function (component, executeInfo) {
    return executeInfo.focusIn().bind(function (f) {
      return f(component, executeInfo);
    });
  };
  var getEvents$5 = $_aoet5bwbjd24rmfz.constant({});
  var getApis$5 = $_aoet5bwbjd24rmfz.constant({});
  var SpecialType = $_bwztiazfjd24rmpy.typical(schema$6, $_6n4e0bxqjd24rmkk.init, getRules$5, getEvents$5, getApis$5, $_asi680wajd24rmfv.some(focusIn$4));

  var $_ceaptozbjd24rmpf = {
    acyclic: AcyclicType.schema(),
    cyclic: CyclicType.schema(),
    flow: FlowType.schema(),
    flatgrid: FlatgridType.schema(),
    matrix: MatrixType.schema(),
    execution: ExecutionType.schema(),
    menu: MenuType.schema(),
    special: SpecialType.schema()
  };

  var Keying = $_9vyb2vw4jd24rmen.createModes({
    branchKey: 'mode',
    branches: $_ceaptozbjd24rmpf,
    name: 'keying',
    active: {
      events: function (keyingConfig, keyingState) {
        var handler = keyingConfig.handler();
        return handler.toEvents(keyingConfig, keyingState);
      }
    },
    apis: {
      focusIn: function (component) {
        component.getSystem().triggerFocus(component.element(), component.element());
      },
      setGridSize: function (component, keyConfig, keyState, numRows, numColumns) {
        if (!$_bzffwwx6jd24rmit.hasKey(keyState, 'setGridSize')) {
          console.error('Layout does not support setGridSize');
        } else {
          keyState.setGridSize(numRows, numColumns);
        }
      }
    },
    state: $_3ya3d4100jd24rmrz
  });

  var field$1 = function (name, forbidden) {
    return $_w7f5sx2jd24rmi1.defaultedObjOf(name, {}, $_3vsestw9jd24rmfo.map(forbidden, function (f) {
      return $_w7f5sx2jd24rmi1.forbid(f.name(), 'Cannot configure ' + f.name() + ' for ' + name);
    }).concat([$_w7f5sx2jd24rmi1.state('dump', $_aoet5bwbjd24rmfz.identity)]));
  };
  var get$5 = function (data) {
    return data.dump();
  };
  var $_azr91y10djd24rmtn = {
    field: field$1,
    get: get$5
  };

  var unique = 0;
  var generate$1 = function (prefix) {
    var date = new Date();
    var time = date.getTime();
    var random = Math.floor(Math.random() * 1000000000);
    unique++;
    return prefix + '_' + random + unique + String(time);
  };
  var $_d75dkd10gjd24rmu6 = { generate: generate$1 };

  var premadeTag = $_d75dkd10gjd24rmu6.generate('alloy-premade');
  var apiConfig = $_d75dkd10gjd24rmu6.generate('api');
  var premade = function (comp) {
    return $_bzffwwx6jd24rmit.wrap(premadeTag, comp);
  };
  var getPremade = function (spec) {
    return $_bzffwwx6jd24rmit.readOptFrom(spec, premadeTag);
  };
  var makeApi = function (f) {
    return $_6r3rc2xjjd24rmjw.markAsSketchApi(function (component) {
      var args = Array.prototype.slice.call(arguments, 0);
      var spi = component.config(apiConfig);
      return f.apply(undefined, [spi].concat(args));
    }, f);
  };
  var $_ch8g4910fjd24rmu1 = {
    apiConfig: $_aoet5bwbjd24rmfz.constant(apiConfig),
    makeApi: makeApi,
    premade: premade,
    getPremade: getPremade
  };

  var adt$2 = $_45w193x4jd24rmi8.generate([
    { required: ['data'] },
    { external: ['data'] },
    { optional: ['data'] },
    { group: ['data'] }
  ]);
  var fFactory = $_w7f5sx2jd24rmi1.defaulted('factory', { sketch: $_aoet5bwbjd24rmfz.identity });
  var fSchema = $_w7f5sx2jd24rmi1.defaulted('schema', []);
  var fName = $_w7f5sx2jd24rmi1.strict('name');
  var fPname = $_w7f5sx2jd24rmi1.field('pname', 'pname', $_a33fuhx3jd24rmi5.defaultedThunk(function (typeSpec) {
    return '<alloy.' + $_d75dkd10gjd24rmu6.generate(typeSpec.name) + '>';
  }), $_bdtykhxhjd24rmjn.anyValue());
  var fDefaults = $_w7f5sx2jd24rmi1.defaulted('defaults', $_aoet5bwbjd24rmfz.constant({}));
  var fOverrides = $_w7f5sx2jd24rmi1.defaulted('overrides', $_aoet5bwbjd24rmfz.constant({}));
  var requiredSpec = $_bdtykhxhjd24rmjn.objOf([
    fFactory,
    fSchema,
    fName,
    fPname,
    fDefaults,
    fOverrides
  ]);
  var externalSpec = $_bdtykhxhjd24rmjn.objOf([
    fFactory,
    fSchema,
    fName,
    fDefaults,
    fOverrides
  ]);
  var optionalSpec = $_bdtykhxhjd24rmjn.objOf([
    fFactory,
    fSchema,
    fName,
    fPname,
    fDefaults,
    fOverrides
  ]);
  var groupSpec = $_bdtykhxhjd24rmjn.objOf([
    fFactory,
    fSchema,
    fName,
    $_w7f5sx2jd24rmi1.strict('unit'),
    fPname,
    fDefaults,
    fOverrides
  ]);
  var asNamedPart = function (part) {
    return part.fold($_asi680wajd24rmfv.some, $_asi680wajd24rmfv.none, $_asi680wajd24rmfv.some, $_asi680wajd24rmfv.some);
  };
  var name$1 = function (part) {
    var get = function (data) {
      return data.name();
    };
    return part.fold(get, get, get, get);
  };
  var asCommon = function (part) {
    return part.fold($_aoet5bwbjd24rmfz.identity, $_aoet5bwbjd24rmfz.identity, $_aoet5bwbjd24rmfz.identity, $_aoet5bwbjd24rmfz.identity);
  };
  var convert = function (adtConstructor, partSpec) {
    return function (spec) {
      var data = $_bdtykhxhjd24rmjn.asStructOrDie('Converting part type', partSpec, spec);
      return adtConstructor(data);
    };
  };
  var $_6nn6my10kjd24rmuq = {
    required: convert(adt$2.required, requiredSpec),
    external: convert(adt$2.external, externalSpec),
    optional: convert(adt$2.optional, optionalSpec),
    group: convert(adt$2.group, groupSpec),
    asNamedPart: asNamedPart,
    name: name$1,
    asCommon: asCommon,
    original: $_aoet5bwbjd24rmfz.constant('entirety')
  };

  var placeholder = 'placeholder';
  var adt$3 = $_45w193x4jd24rmi8.generate([
    {
      single: [
        'required',
        'valueThunk'
      ]
    },
    {
      multiple: [
        'required',
        'valueThunks'
      ]
    }
  ]);
  var isSubstitute = function (uiType) {
    return $_3vsestw9jd24rmfo.contains([placeholder], uiType);
  };
  var subPlaceholder = function (owner, detail, compSpec, placeholders) {
    if (owner.exists(function (o) {
        return o !== compSpec.owner;
      }))
      return adt$3.single(true, $_aoet5bwbjd24rmfz.constant(compSpec));
    return $_bzffwwx6jd24rmit.readOptFrom(placeholders, compSpec.name).fold(function () {
      throw new Error('Unknown placeholder component: ' + compSpec.name + '\nKnown: [' + $_2hhb0ax0jd24rmhp.keys(placeholders) + ']\nNamespace: ' + owner.getOr('none') + '\nSpec: ' + $_eur0xxfjd24rmjj.stringify(compSpec, null, 2));
    }, function (newSpec) {
      return newSpec.replace();
    });
  };
  var scan = function (owner, detail, compSpec, placeholders) {
    if (compSpec.uiType === placeholder)
      return subPlaceholder(owner, detail, compSpec, placeholders);
    else
      return adt$3.single(false, $_aoet5bwbjd24rmfz.constant(compSpec));
  };
  var substitute = function (owner, detail, compSpec, placeholders) {
    var base = scan(owner, detail, compSpec, placeholders);
    return base.fold(function (req, valueThunk) {
      var value = valueThunk(detail, compSpec.config, compSpec.validated);
      var childSpecs = $_bzffwwx6jd24rmit.readOptFrom(value, 'components').getOr([]);
      var substituted = $_3vsestw9jd24rmfo.bind(childSpecs, function (c) {
        return substitute(owner, detail, c, placeholders);
      });
      return [$_4x4s83wyjd24rmhm.deepMerge(value, { components: substituted })];
    }, function (req, valuesThunk) {
      var values = valuesThunk(detail, compSpec.config, compSpec.validated);
      return values;
    });
  };
  var substituteAll = function (owner, detail, components, placeholders) {
    return $_3vsestw9jd24rmfo.bind(components, function (c) {
      return substitute(owner, detail, c, placeholders);
    });
  };
  var oneReplace = function (label, replacements) {
    var called = false;
    var used = function () {
      return called;
    };
    var replace = function () {
      if (called === true)
        throw new Error('Trying to use the same placeholder more than once: ' + label);
      called = true;
      return replacements;
    };
    var required = function () {
      return replacements.fold(function (req, _) {
        return req;
      }, function (req, _) {
        return req;
      });
    };
    return {
      name: $_aoet5bwbjd24rmfz.constant(label),
      required: required,
      used: used,
      replace: replace
    };
  };
  var substitutePlaces = function (owner, detail, components, placeholders) {
    var ps = $_2hhb0ax0jd24rmhp.map(placeholders, function (ph, name) {
      return oneReplace(name, ph);
    });
    var outcome = substituteAll(owner, detail, components, ps);
    $_2hhb0ax0jd24rmhp.each(ps, function (p) {
      if (p.used() === false && p.required()) {
        throw new Error('Placeholder: ' + p.name() + ' was not found in components list\nNamespace: ' + owner.getOr('none') + '\nComponents: ' + $_eur0xxfjd24rmjj.stringify(detail.components(), null, 2));
      }
    });
    return outcome;
  };
  var singleReplace = function (detail, p) {
    var replacement = p;
    return replacement.fold(function (req, valueThunk) {
      return [valueThunk(detail)];
    }, function (req, valuesThunk) {
      return valuesThunk(detail);
    });
  };
  var $_dqwfs410ljd24rmuz = {
    single: adt$3.single,
    multiple: adt$3.multiple,
    isSubstitute: isSubstitute,
    placeholder: $_aoet5bwbjd24rmfz.constant(placeholder),
    substituteAll: substituteAll,
    substitutePlaces: substitutePlaces,
    singleReplace: singleReplace
  };

  var combine = function (detail, data, partSpec, partValidated) {
    var spec = partSpec;
    return $_4x4s83wyjd24rmhm.deepMerge(data.defaults()(detail, partSpec, partValidated), partSpec, { uid: detail.partUids()[data.name()] }, data.overrides()(detail, partSpec, partValidated), { 'debug.sketcher': $_bzffwwx6jd24rmit.wrap('part-' + data.name(), spec) });
  };
  var subs = function (owner, detail, parts) {
    var internals = {};
    var externals = {};
    $_3vsestw9jd24rmfo.each(parts, function (part) {
      part.fold(function (data) {
        internals[data.pname()] = $_dqwfs410ljd24rmuz.single(true, function (detail, partSpec, partValidated) {
          return data.factory().sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        var partSpec = detail.parts()[data.name()]();
        externals[data.name()] = $_aoet5bwbjd24rmfz.constant(combine(detail, data, partSpec[$_6nn6my10kjd24rmuq.original()]()));
      }, function (data) {
        internals[data.pname()] = $_dqwfs410ljd24rmuz.single(false, function (detail, partSpec, partValidated) {
          return data.factory().sketch(combine(detail, data, partSpec, partValidated));
        });
      }, function (data) {
        internals[data.pname()] = $_dqwfs410ljd24rmuz.multiple(true, function (detail, _partSpec, _partValidated) {
          var units = detail[data.name()]();
          return $_3vsestw9jd24rmfo.map(units, function (u) {
            return data.factory().sketch($_4x4s83wyjd24rmhm.deepMerge(data.defaults()(detail, u), u, data.overrides()(detail, u)));
          });
        });
      });
    });
    return {
      internals: $_aoet5bwbjd24rmfz.constant(internals),
      externals: $_aoet5bwbjd24rmfz.constant(externals)
    };
  };
  var $_gdmiqi10jjd24rmul = { subs: subs };

  var generate$2 = function (owner, parts) {
    var r = {};
    $_3vsestw9jd24rmfo.each(parts, function (part) {
      $_6nn6my10kjd24rmuq.asNamedPart(part).each(function (np) {
        var g = doGenerateOne(owner, np.pname());
        r[np.name()] = function (config) {
          var validated = $_bdtykhxhjd24rmjn.asRawOrDie('Part: ' + np.name() + ' in ' + owner, $_bdtykhxhjd24rmjn.objOf(np.schema()), config);
          return $_4x4s83wyjd24rmhm.deepMerge(g, {
            config: config,
            validated: validated
          });
        };
      });
    });
    return r;
  };
  var doGenerateOne = function (owner, pname) {
    return {
      uiType: $_dqwfs410ljd24rmuz.placeholder(),
      owner: owner,
      name: pname
    };
  };
  var generateOne = function (owner, pname, config) {
    return {
      uiType: $_dqwfs410ljd24rmuz.placeholder(),
      owner: owner,
      name: pname,
      config: config,
      validated: {}
    };
  };
  var schemas = function (parts) {
    return $_3vsestw9jd24rmfo.bind(parts, function (part) {
      return part.fold($_asi680wajd24rmfv.none, $_asi680wajd24rmfv.some, $_asi680wajd24rmfv.none, $_asi680wajd24rmfv.none).map(function (data) {
        return $_w7f5sx2jd24rmi1.strictObjOf(data.name(), data.schema().concat([$_62w1klytjd24rmnt.snapshot($_6nn6my10kjd24rmuq.original())]));
      }).toArray();
    });
  };
  var names = function (parts) {
    return $_3vsestw9jd24rmfo.map(parts, $_6nn6my10kjd24rmuq.name);
  };
  var substitutes = function (owner, detail, parts) {
    return $_gdmiqi10jjd24rmul.subs(owner, detail, parts);
  };
  var components = function (owner, detail, internals) {
    return $_dqwfs410ljd24rmuz.substitutePlaces($_asi680wajd24rmfv.some(owner), detail, detail.components(), internals);
  };
  var getPart = function (component, detail, partKey) {
    var uid = detail.partUids()[partKey];
    return component.getSystem().getByUid(uid).toOption();
  };
  var getPartOrDie = function (component, detail, partKey) {
    return getPart(component, detail, partKey).getOrDie('Could not find part: ' + partKey);
  };
  var getParts = function (component, detail, partKeys) {
    var r = {};
    var uids = detail.partUids();
    var system = component.getSystem();
    $_3vsestw9jd24rmfo.each(partKeys, function (pk) {
      r[pk] = system.getByUid(uids[pk]);
    });
    return $_2hhb0ax0jd24rmhp.map(r, $_aoet5bwbjd24rmfz.constant);
  };
  var getAllParts = function (component, detail) {
    var system = component.getSystem();
    return $_2hhb0ax0jd24rmhp.map(detail.partUids(), function (pUid, k) {
      return $_aoet5bwbjd24rmfz.constant(system.getByUid(pUid));
    });
  };
  var getPartsOrDie = function (component, detail, partKeys) {
    var r = {};
    var uids = detail.partUids();
    var system = component.getSystem();
    $_3vsestw9jd24rmfo.each(partKeys, function (pk) {
      r[pk] = system.getByUid(uids[pk]).getOrDie();
    });
    return $_2hhb0ax0jd24rmhp.map(r, $_aoet5bwbjd24rmfz.constant);
  };
  var defaultUids = function (baseUid, partTypes) {
    var partNames = names(partTypes);
    return $_bzffwwx6jd24rmit.wrapAll($_3vsestw9jd24rmfo.map(partNames, function (pn) {
      return {
        key: pn,
        value: baseUid + '-' + pn
      };
    }));
  };
  var defaultUidsSchema = function (partTypes) {
    return $_w7f5sx2jd24rmi1.field('partUids', 'partUids', $_a33fuhx3jd24rmi5.mergeWithThunk(function (spec) {
      return defaultUids(spec.uid, partTypes);
    }), $_bdtykhxhjd24rmjn.anyValue());
  };
  var $_czojf710ijd24rmub = {
    generate: generate$2,
    generateOne: generateOne,
    schemas: schemas,
    names: names,
    substitutes: substitutes,
    components: components,
    defaultUids: defaultUids,
    defaultUidsSchema: defaultUidsSchema,
    getAllParts: getAllParts,
    getPart: getPart,
    getPartOrDie: getPartOrDie,
    getParts: getParts,
    getPartsOrDie: getPartsOrDie
  };

  var prefix$1 = 'alloy-id-';
  var idAttr = 'data-alloy-id';
  var $_9i150y10njd24rmvi = {
    prefix: $_aoet5bwbjd24rmfz.constant(prefix$1),
    idAttr: $_aoet5bwbjd24rmfz.constant(idAttr)
  };

  var prefix$2 = $_9i150y10njd24rmvi.prefix();
  var idAttr$1 = $_9i150y10njd24rmvi.idAttr();
  var write = function (label, elem) {
    var id = $_d75dkd10gjd24rmu6.generate(prefix$2 + label);
    $_dxjq1vxwjd24rmkv.set(elem, idAttr$1, id);
    return id;
  };
  var writeOnly = function (elem, uid) {
    $_dxjq1vxwjd24rmkv.set(elem, idAttr$1, uid);
  };
  var read$2 = function (elem) {
    var id = $_5fvhg7xxjd24rmkz.isElement(elem) ? $_dxjq1vxwjd24rmkv.get(elem, idAttr$1) : null;
    return $_asi680wajd24rmfv.from(id);
  };
  var find$3 = function (container, id) {
    return $_56vfpvzmjd24rmql.descendant(container, id);
  };
  var generate$3 = function (prefix) {
    return $_d75dkd10gjd24rmu6.generate(prefix);
  };
  var revoke = function (elem) {
    $_dxjq1vxwjd24rmkv.remove(elem, idAttr$1);
  };
  var $_c4606g10mjd24rmv9 = {
    revoke: revoke,
    write: write,
    writeOnly: writeOnly,
    read: read$2,
    find: find$3,
    generate: generate$3,
    attribute: $_aoet5bwbjd24rmfz.constant(idAttr$1)
  };

  var getPartsSchema = function (partNames, _optPartNames, _owner) {
    var owner = _owner !== undefined ? _owner : 'Unknown owner';
    var fallbackThunk = function () {
      return [$_62w1klytjd24rmnt.output('partUids', {})];
    };
    var optPartNames = _optPartNames !== undefined ? _optPartNames : fallbackThunk();
    if (partNames.length === 0 && optPartNames.length === 0)
      return fallbackThunk();
    var partsSchema = $_w7f5sx2jd24rmi1.strictObjOf('parts', $_3vsestw9jd24rmfo.flatten([
      $_3vsestw9jd24rmfo.map(partNames, $_w7f5sx2jd24rmi1.strict),
      $_3vsestw9jd24rmfo.map(optPartNames, function (optPart) {
        return $_w7f5sx2jd24rmi1.defaulted(optPart, $_dqwfs410ljd24rmuz.single(false, function () {
          throw new Error('The optional part: ' + optPart + ' was not specified in the config, but it was used in components');
        }));
      })
    ]));
    var partUidsSchema = $_w7f5sx2jd24rmi1.state('partUids', function (spec) {
      if (!$_bzffwwx6jd24rmit.hasKey(spec, 'parts')) {
        throw new Error('Part uid definition for owner: ' + owner + ' requires "parts"\nExpected parts: ' + partNames.join(', ') + '\nSpec: ' + $_eur0xxfjd24rmjj.stringify(spec, null, 2));
      }
      var uids = $_2hhb0ax0jd24rmhp.map(spec.parts, function (v, k) {
        return $_bzffwwx6jd24rmit.readOptFrom(v, 'uid').getOrThunk(function () {
          return spec.uid + '-' + k;
        });
      });
      return uids;
    });
    return [
      partsSchema,
      partUidsSchema
    ];
  };
  var base$1 = function (label, partSchemas, partUidsSchemas, spec) {
    var ps = partSchemas.length > 0 ? [$_w7f5sx2jd24rmi1.strictObjOf('parts', partSchemas)] : [];
    return ps.concat([
      $_w7f5sx2jd24rmi1.strict('uid'),
      $_w7f5sx2jd24rmi1.defaulted('dom', {}),
      $_w7f5sx2jd24rmi1.defaulted('components', []),
      $_62w1klytjd24rmnt.snapshot('originalSpec'),
      $_w7f5sx2jd24rmi1.defaulted('debug.sketcher', {})
    ]).concat(partUidsSchemas);
  };
  var asRawOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base$1(label, partSchemas, spec, partUidsSchemas);
    return $_bdtykhxhjd24rmjn.asRawOrDie(label + ' [SpecSchema]', $_bdtykhxhjd24rmjn.objOfOnly(baseS.concat(schema)), spec);
  };
  var asStructOrDie$1 = function (label, schema, spec, partSchemas, partUidsSchemas) {
    var baseS = base$1(label, partSchemas, partUidsSchemas, spec);
    return $_bdtykhxhjd24rmjn.asStructOrDie(label + ' [SpecSchema]', $_bdtykhxhjd24rmjn.objOfOnly(baseS.concat(schema)), spec);
  };
  var extend = function (builder, original, nu) {
    var newSpec = $_4x4s83wyjd24rmhm.deepMerge(original, nu);
    return builder(newSpec);
  };
  var addBehaviours = function (original, behaviours) {
    return $_4x4s83wyjd24rmhm.deepMerge(original, behaviours);
  };
  var $_9ds7ga10ojd24rmvl = {
    asRawOrDie: asRawOrDie$1,
    asStructOrDie: asStructOrDie$1,
    addBehaviours: addBehaviours,
    getPartsSchema: getPartsSchema,
    extend: extend
  };

  var single = function (owner, schema, factory, spec) {
    var specWithUid = supplyUid(spec);
    var detail = $_9ds7ga10ojd24rmvl.asStructOrDie(owner, schema, specWithUid, [], []);
    return $_4x4s83wyjd24rmhm.deepMerge(factory(detail, specWithUid), { 'debug.sketcher': $_bzffwwx6jd24rmit.wrap(owner, spec) });
  };
  var composite = function (owner, schema, partTypes, factory, spec) {
    var specWithUid = supplyUid(spec);
    var partSchemas = $_czojf710ijd24rmub.schemas(partTypes);
    var partUidsSchema = $_czojf710ijd24rmub.defaultUidsSchema(partTypes);
    var detail = $_9ds7ga10ojd24rmvl.asStructOrDie(owner, schema, specWithUid, partSchemas, [partUidsSchema]);
    var subs = $_czojf710ijd24rmub.substitutes(owner, detail, partTypes);
    var components = $_czojf710ijd24rmub.components(owner, detail, subs.internals());
    return $_4x4s83wyjd24rmhm.deepMerge(factory(detail, components, specWithUid, subs.externals()), { 'debug.sketcher': $_bzffwwx6jd24rmit.wrap(owner, spec) });
  };
  var supplyUid = function (spec) {
    return $_4x4s83wyjd24rmhm.deepMerge({ uid: $_c4606g10mjd24rmv9.generate('uid') }, spec);
  };
  var $_noz6s10hjd24rmu7 = {
    supplyUid: supplyUid,
    single: single,
    composite: composite
  };

  var singleSchema = $_bdtykhxhjd24rmjn.objOfOnly([
    $_w7f5sx2jd24rmi1.strict('name'),
    $_w7f5sx2jd24rmi1.strict('factory'),
    $_w7f5sx2jd24rmi1.strict('configFields'),
    $_w7f5sx2jd24rmi1.defaulted('apis', {}),
    $_w7f5sx2jd24rmi1.defaulted('extraApis', {})
  ]);
  var compositeSchema = $_bdtykhxhjd24rmjn.objOfOnly([
    $_w7f5sx2jd24rmi1.strict('name'),
    $_w7f5sx2jd24rmi1.strict('factory'),
    $_w7f5sx2jd24rmi1.strict('configFields'),
    $_w7f5sx2jd24rmi1.strict('partFields'),
    $_w7f5sx2jd24rmi1.defaulted('apis', {}),
    $_w7f5sx2jd24rmi1.defaulted('extraApis', {})
  ]);
  var single$1 = function (rawConfig) {
    var config = $_bdtykhxhjd24rmjn.asRawOrDie('Sketcher for ' + rawConfig.name, singleSchema, rawConfig);
    var sketch = function (spec) {
      return $_noz6s10hjd24rmu7.single(config.name, config.configFields, config.factory, spec);
    };
    var apis = $_2hhb0ax0jd24rmhp.map(config.apis, $_ch8g4910fjd24rmu1.makeApi);
    var extraApis = $_2hhb0ax0jd24rmhp.map(config.extraApis, function (f, k) {
      return $_6r3rc2xjjd24rmjw.markAsExtraApi(f, k);
    });
    return $_4x4s83wyjd24rmhm.deepMerge({
      name: $_aoet5bwbjd24rmfz.constant(config.name),
      partFields: $_aoet5bwbjd24rmfz.constant([]),
      configFields: $_aoet5bwbjd24rmfz.constant(config.configFields),
      sketch: sketch
    }, apis, extraApis);
  };
  var composite$1 = function (rawConfig) {
    var config = $_bdtykhxhjd24rmjn.asRawOrDie('Sketcher for ' + rawConfig.name, compositeSchema, rawConfig);
    var sketch = function (spec) {
      return $_noz6s10hjd24rmu7.composite(config.name, config.configFields, config.partFields, config.factory, spec);
    };
    var parts = $_czojf710ijd24rmub.generate(config.name, config.partFields);
    var apis = $_2hhb0ax0jd24rmhp.map(config.apis, $_ch8g4910fjd24rmu1.makeApi);
    var extraApis = $_2hhb0ax0jd24rmhp.map(config.extraApis, function (f, k) {
      return $_6r3rc2xjjd24rmjw.markAsExtraApi(f, k);
    });
    return $_4x4s83wyjd24rmhm.deepMerge({
      name: $_aoet5bwbjd24rmfz.constant(config.name),
      partFields: $_aoet5bwbjd24rmfz.constant(config.partFields),
      configFields: $_aoet5bwbjd24rmfz.constant(config.configFields),
      sketch: sketch,
      parts: $_aoet5bwbjd24rmfz.constant(parts)
    }, apis, extraApis);
  };
  var $_7v08p10ejd24rmts = {
    single: single$1,
    composite: composite$1
  };

  var events$4 = function (optAction) {
    var executeHandler = function (action) {
      return $_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.execute(), function (component, simulatedEvent) {
        action(component);
        simulatedEvent.stop();
      });
    };
    var onClick = function (component, simulatedEvent) {
      simulatedEvent.stop();
      $_eljod2wvjd24rmhc.emitExecute(component);
    };
    var onMousedown = function (component, simulatedEvent) {
      simulatedEvent.cut();
    };
    var pointerEvents = $_1616jcwgjd24rmg9.detect().deviceType.isTouch() ? [$_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.tap(), onClick)] : [
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.click(), onClick),
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mousedown(), onMousedown)
    ];
    return $_g9t26pw6jd24rmfc.derive($_3vsestw9jd24rmfo.flatten([
      optAction.map(executeHandler).toArray(),
      pointerEvents
    ]));
  };
  var $_40woel10pjd24rmvu = { events: events$4 };

  var factory = function (detail, spec) {
    var events = $_40woel10pjd24rmvu.events(detail.action());
    var optType = $_bzffwwx6jd24rmit.readOptFrom(detail.dom(), 'attributes').bind($_bzffwwx6jd24rmit.readOpt('type'));
    var optTag = $_bzffwwx6jd24rmit.readOptFrom(detail.dom(), 'tag');
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: detail.components(),
      events: events,
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([
        Focusing.config({}),
        Keying.config({
          mode: 'execution',
          useSpace: true,
          useEnter: true
        })
      ]), $_azr91y10djd24rmtn.get(detail.buttonBehaviours())),
      domModification: {
        attributes: $_4x4s83wyjd24rmhm.deepMerge(optType.fold(function () {
          return optTag.is('button') ? { type: 'button' } : {};
        }, function (t) {
          return {};
        }), { role: detail.role().getOr('button') })
      },
      eventOrder: detail.eventOrder()
    };
  };
  var Button = $_7v08p10ejd24rmts.single({
    name: 'Button',
    factory: factory,
    configFields: [
      $_w7f5sx2jd24rmi1.defaulted('uid', undefined),
      $_w7f5sx2jd24rmi1.strict('dom'),
      $_w7f5sx2jd24rmi1.defaulted('components', []),
      $_azr91y10djd24rmtn.field('buttonBehaviours', [
        Focusing,
        Keying
      ]),
      $_w7f5sx2jd24rmi1.option('action'),
      $_w7f5sx2jd24rmi1.option('role'),
      $_w7f5sx2jd24rmi1.defaulted('eventOrder', {})
    ]
  });

  var getAttrs = function (elem) {
    var attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : [];
    return $_3vsestw9jd24rmfo.foldl(attributes, function (b, attr) {
      if (attr.name === 'class')
        return b;
      else
        return $_4x4s83wyjd24rmhm.deepMerge(b, $_bzffwwx6jd24rmit.wrap(attr.name, attr.value));
    }, {});
  };
  var getClasses = function (elem) {
    return Array.prototype.slice.call(elem.dom().classList, 0);
  };
  var fromHtml$2 = function (html) {
    var elem = $_ei6gqxwtjd24rmh8.fromHtml(html);
    var children = $_5on3koy3jd24rmlg.children(elem);
    var attrs = getAttrs(elem);
    var classes = getClasses(elem);
    var contents = children.length === 0 ? {} : { innerHtml: $_bewbr4ybjd24rmmf.get(elem) };
    return $_4x4s83wyjd24rmhm.deepMerge({
      tag: $_5fvhg7xxjd24rmkz.name(elem),
      classes: classes,
      attributes: attrs
    }, contents);
  };
  var sketch = function (sketcher, html, config) {
    return sketcher.sketch($_4x4s83wyjd24rmhm.deepMerge({ dom: fromHtml$2(html) }, config));
  };
  var $_67oink10rjd24rmw1 = {
    fromHtml: fromHtml$2,
    sketch: sketch
  };

  var dom$1 = function (rawHtml) {
    var html = $_cgnhvywpjd24rmgz.supplant(rawHtml, { prefix: $_4i0vdoz1jd24rmoo.prefix() });
    return $_67oink10rjd24rmw1.fromHtml(html);
  };
  var spec = function (rawHtml) {
    var sDom = dom$1(rawHtml);
    return { dom: sDom };
  };
  var $_ejtuy110qjd24rmvy = {
    dom: dom$1,
    spec: spec
  };

  var forToolbarCommand = function (editor, command) {
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, {});
  };
  var getToggleBehaviours = function (command) {
    return $_9vyb2vw4jd24rmen.derive([
      Toggling.config({
        toggleClass: $_4i0vdoz1jd24rmoo.resolve('toolbar-button-selected'),
        toggleOnExecute: false,
        aria: { mode: 'pressed' }
      }),
      $_xzzzbz0jd24rmol.format(command, function (button, status) {
        var toggle = status ? Toggling.on : Toggling.off;
        toggle(button);
      })
    ]);
  };
  var forToolbarStateCommand = function (editor, command) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(command, function () {
      editor.execCommand(command);
    }, extraBehaviours);
  };
  var forToolbarStateAction = function (editor, clazz, command, action) {
    var extraBehaviours = getToggleBehaviours(command);
    return forToolbar(clazz, action, extraBehaviours);
  };
  var forToolbar = function (clazz, action, extraBehaviours) {
    return Button.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-' + clazz + ' ${prefix}-icon"></span>'),
      action: action,
      buttonBehaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([Unselecting.config({})]), extraBehaviours)
    });
  };
  var $_2byzekz2jd24rmop = {
    forToolbar: forToolbar,
    forToolbarCommand: forToolbarCommand,
    forToolbarStateAction: forToolbarStateAction,
    forToolbarStateCommand: forToolbarStateCommand
  };

  var reduceBy = function (value, min, max, step) {
    if (value < min)
      return value;
    else if (value > max)
      return max;
    else if (value === min)
      return min - 1;
    else
      return Math.max(min, value - step);
  };
  var increaseBy = function (value, min, max, step) {
    if (value > max)
      return value;
    else if (value < min)
      return min;
    else if (value === max)
      return max + 1;
    else
      return Math.min(max, value + step);
  };
  var capValue = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
  };
  var snapValueOfX = function (bounds, value, min, max, step, snapStart) {
    return snapStart.fold(function () {
      var initValue = value - min;
      var extraValue = Math.round(initValue / step) * step;
      return capValue(min + extraValue, min - 1, max + 1);
    }, function (start) {
      var remainder = (value - start) % step;
      var adjustment = Math.round(remainder / step);
      var rawSteps = Math.floor((value - start) / step);
      var maxSteps = Math.floor((max - start) / step);
      var numSteps = Math.min(maxSteps, rawSteps + adjustment);
      var r = start + numSteps * step;
      return Math.max(start, r);
    });
  };
  var findValueOfX = function (bounds, min, max, xValue, step, snapToGrid, snapStart) {
    var range = max - min;
    if (xValue < bounds.left)
      return min - 1;
    else if (xValue > bounds.right)
      return max + 1;
    else {
      var xOffset = Math.min(bounds.right, Math.max(xValue, bounds.left)) - bounds.left;
      var newValue = capValue(xOffset / bounds.width * range + min, min - 1, max + 1);
      var roundedValue = Math.round(newValue);
      return snapToGrid && newValue >= min && newValue <= max ? snapValueOfX(bounds, newValue, min, max, step, snapStart) : roundedValue;
    }
  };
  var $_9uzydd10wjd24rmws = {
    reduceBy: reduceBy,
    increaseBy: increaseBy,
    findValueOfX: findValueOfX
  };

  var changeEvent = 'slider.change.value';
  var isTouch = $_1616jcwgjd24rmg9.detect().deviceType.isTouch();
  var getEventSource = function (simulatedEvent) {
    var evt = simulatedEvent.event().raw();
    if (isTouch && evt.touches !== undefined && evt.touches.length === 1)
      return $_asi680wajd24rmfv.some(evt.touches[0]);
    else if (isTouch && evt.touches !== undefined)
      return $_asi680wajd24rmfv.none();
    else if (!isTouch && evt.clientX !== undefined)
      return $_asi680wajd24rmfv.some(evt);
    else
      return $_asi680wajd24rmfv.none();
  };
  var getEventX = function (simulatedEvent) {
    var spot = getEventSource(simulatedEvent);
    return spot.map(function (s) {
      return s.clientX;
    });
  };
  var fireChange = function (component, value) {
    $_eljod2wvjd24rmhc.emitWith(component, changeEvent, { value: value });
  };
  var moveRightFromLedge = function (ledge, detail) {
    fireChange(ledge, detail.min());
  };
  var moveLeftFromRedge = function (redge, detail) {
    fireChange(redge, detail.max());
  };
  var setToRedge = function (redge, detail) {
    fireChange(redge, detail.max() + 1);
  };
  var setToLedge = function (ledge, detail) {
    fireChange(ledge, detail.min() - 1);
  };
  var setToX = function (spectrum, spectrumBounds, detail, xValue) {
    var value = $_9uzydd10wjd24rmws.findValueOfX(spectrumBounds, detail.min(), detail.max(), xValue, detail.stepSize(), detail.snapToGrid(), detail.snapStart());
    fireChange(spectrum, value);
  };
  var setXFromEvent = function (spectrum, detail, spectrumBounds, simulatedEvent) {
    return getEventX(simulatedEvent).map(function (xValue) {
      setToX(spectrum, spectrumBounds, detail, xValue);
      return xValue;
    });
  };
  var moveLeft$4 = function (spectrum, detail) {
    var newValue = $_9uzydd10wjd24rmws.reduceBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
    fireChange(spectrum, newValue);
  };
  var moveRight$4 = function (spectrum, detail) {
    var newValue = $_9uzydd10wjd24rmws.increaseBy(detail.value().get(), detail.min(), detail.max(), detail.stepSize());
    fireChange(spectrum, newValue);
  };
  var $_3nj21c10vjd24rmwm = {
    setXFromEvent: setXFromEvent,
    setToLedge: setToLedge,
    setToRedge: setToRedge,
    moveLeftFromRedge: moveLeftFromRedge,
    moveRightFromLedge: moveRightFromLedge,
    moveLeft: moveLeft$4,
    moveRight: moveRight$4,
    changeEvent: $_aoet5bwbjd24rmfz.constant(changeEvent)
  };

  var platform = $_1616jcwgjd24rmg9.detect();
  var isTouch$1 = platform.deviceType.isTouch();
  var edgePart = function (name, action) {
    return $_6nn6my10kjd24rmuq.optional({
      name: '' + name + '-edge',
      overrides: function (detail) {
        var touchEvents = $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.runActionExtra($_1tcfm9wxjd24rmhk.touchstart(), action, [detail])]);
        var mouseEvents = $_g9t26pw6jd24rmfc.derive([
          $_g9t26pw6jd24rmfc.runActionExtra($_1tcfm9wxjd24rmhk.mousedown(), action, [detail]),
          $_g9t26pw6jd24rmfc.runActionExtra($_1tcfm9wxjd24rmhk.mousemove(), function (l, det) {
            if (det.mouseIsDown().get())
              action(l, det);
          }, [detail])
        ]);
        return { events: isTouch$1 ? touchEvents : mouseEvents };
      }
    });
  };
  var ledgePart = edgePart('left', $_3nj21c10vjd24rmwm.setToLedge);
  var redgePart = edgePart('right', $_3nj21c10vjd24rmwm.setToRedge);
  var thumbPart = $_6nn6my10kjd24rmuq.required({
    name: 'thumb',
    defaults: $_aoet5bwbjd24rmfz.constant({ dom: { styles: { position: 'absolute' } } }),
    overrides: function (detail) {
      return {
        events: $_g9t26pw6jd24rmfc.derive([
          $_g9t26pw6jd24rmfc.redirectToPart($_1tcfm9wxjd24rmhk.touchstart(), detail, 'spectrum'),
          $_g9t26pw6jd24rmfc.redirectToPart($_1tcfm9wxjd24rmhk.touchmove(), detail, 'spectrum'),
          $_g9t26pw6jd24rmfc.redirectToPart($_1tcfm9wxjd24rmhk.touchend(), detail, 'spectrum')
        ])
      };
    }
  });
  var spectrumPart = $_6nn6my10kjd24rmuq.required({
    schema: [$_w7f5sx2jd24rmi1.state('mouseIsDown', function () {
        return Cell(false);
      })],
    name: 'spectrum',
    overrides: function (detail) {
      var moveToX = function (spectrum, simulatedEvent) {
        var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
        $_3nj21c10vjd24rmwm.setXFromEvent(spectrum, detail, spectrumBounds, simulatedEvent);
      };
      var touchEvents = $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchstart(), moveToX),
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchmove(), moveToX)
      ]);
      var mouseEvents = $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mousedown(), moveToX),
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mousemove(), function (spectrum, se) {
          if (detail.mouseIsDown().get())
            moveToX(spectrum, se);
        })
      ]);
      return {
        behaviours: $_9vyb2vw4jd24rmen.derive(isTouch$1 ? [] : [
          Keying.config({
            mode: 'special',
            onLeft: function (spectrum) {
              $_3nj21c10vjd24rmwm.moveLeft(spectrum, detail);
              return $_asi680wajd24rmfv.some(true);
            },
            onRight: function (spectrum) {
              $_3nj21c10vjd24rmwm.moveRight(spectrum, detail);
              return $_asi680wajd24rmfv.some(true);
            }
          }),
          Focusing.config({})
        ]),
        events: isTouch$1 ? touchEvents : mouseEvents
      };
    }
  });
  var SliderParts = [
    ledgePart,
    redgePart,
    thumbPart,
    spectrumPart
  ];

  var onLoad$1 = function (component, repConfig, repState) {
    repConfig.store().manager().onLoad(component, repConfig, repState);
  };
  var onUnload = function (component, repConfig, repState) {
    repConfig.store().manager().onUnload(component, repConfig, repState);
  };
  var setValue = function (component, repConfig, repState, data) {
    repConfig.store().manager().setValue(component, repConfig, repState, data);
  };
  var getValue = function (component, repConfig, repState) {
    return repConfig.store().manager().getValue(component, repConfig, repState);
  };
  var $_62ka4v110jd24rmx5 = {
    onLoad: onLoad$1,
    onUnload: onUnload,
    setValue: setValue,
    getValue: getValue
  };

  var events$5 = function (repConfig, repState) {
    var es = repConfig.resetOnDom() ? [
      $_g9t26pw6jd24rmfc.runOnAttached(function (comp, se) {
        $_62ka4v110jd24rmx5.onLoad(comp, repConfig, repState);
      }),
      $_g9t26pw6jd24rmfc.runOnDetached(function (comp, se) {
        $_62ka4v110jd24rmx5.onUnload(comp, repConfig, repState);
      })
    ] : [$_a3lv5fw5jd24rmf0.loadEvent(repConfig, repState, $_62ka4v110jd24rmx5.onLoad)];
    return $_g9t26pw6jd24rmfc.derive(es);
  };
  var $_845das10zjd24rmx3 = { events: events$5 };

  var memory = function () {
    var data = Cell(null);
    var readState = function () {
      return {
        mode: 'memory',
        value: data.get()
      };
    };
    var isNotSet = function () {
      return data.get() === null;
    };
    var clear = function () {
      data.set(null);
    };
    return BehaviourState({
      set: data.set,
      get: data.get,
      isNotSet: isNotSet,
      clear: clear,
      readState: readState
    });
  };
  var manual = function () {
    var readState = function () {
    };
    return BehaviourState({ readState: readState });
  };
  var dataset = function () {
    var data = Cell({});
    var readState = function () {
      return {
        mode: 'dataset',
        dataset: data.get()
      };
    };
    return BehaviourState({
      readState: readState,
      set: data.set,
      get: data.get
    });
  };
  var init$2 = function (spec) {
    return spec.store().manager().state(spec);
  };
  var $_ac6l6s113jd24rmxb = {
    memory: memory,
    dataset: dataset,
    manual: manual,
    init: init$2
  };

  var setValue$1 = function (component, repConfig, repState, data) {
    var dataKey = repConfig.store().getDataKey();
    repState.set({});
    repConfig.store().setData()(component, data);
    repConfig.onSetValue()(component, data);
  };
  var getValue$1 = function (component, repConfig, repState) {
    var key = repConfig.store().getDataKey()(component);
    var dataset = repState.get();
    return $_bzffwwx6jd24rmit.readOptFrom(dataset, key).fold(function () {
      return repConfig.store().getFallbackEntry()(key);
    }, function (data) {
      return data;
    });
  };
  var onLoad$2 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (data) {
      setValue$1(component, repConfig, repState, data);
    });
  };
  var onUnload$1 = function (component, repConfig, repState) {
    repState.set({});
  };
  var DatasetStore = [
    $_w7f5sx2jd24rmi1.option('initialValue'),
    $_w7f5sx2jd24rmi1.strict('getFallbackEntry'),
    $_w7f5sx2jd24rmi1.strict('getDataKey'),
    $_w7f5sx2jd24rmi1.strict('setData'),
    $_62w1klytjd24rmnt.output('manager', {
      setValue: setValue$1,
      getValue: getValue$1,
      onLoad: onLoad$2,
      onUnload: onUnload$1,
      state: $_ac6l6s113jd24rmxb.dataset
    })
  ];

  var getValue$2 = function (component, repConfig, repState) {
    return repConfig.store().getValue()(component);
  };
  var setValue$2 = function (component, repConfig, repState, data) {
    repConfig.store().setValue()(component, data);
    repConfig.onSetValue()(component, data);
  };
  var onLoad$3 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (data) {
      repConfig.store().setValue()(component, data);
    });
  };
  var ManualStore = [
    $_w7f5sx2jd24rmi1.strict('getValue'),
    $_w7f5sx2jd24rmi1.defaulted('setValue', $_aoet5bwbjd24rmfz.noop),
    $_w7f5sx2jd24rmi1.option('initialValue'),
    $_62w1klytjd24rmnt.output('manager', {
      setValue: setValue$2,
      getValue: getValue$2,
      onLoad: onLoad$3,
      onUnload: $_aoet5bwbjd24rmfz.noop,
      state: $_6n4e0bxqjd24rmkk.init
    })
  ];

  var setValue$3 = function (component, repConfig, repState, data) {
    repState.set(data);
    repConfig.onSetValue()(component, data);
  };
  var getValue$3 = function (component, repConfig, repState) {
    return repState.get();
  };
  var onLoad$4 = function (component, repConfig, repState) {
    repConfig.store().initialValue().each(function (initVal) {
      if (repState.isNotSet())
        repState.set(initVal);
    });
  };
  var onUnload$2 = function (component, repConfig, repState) {
    repState.clear();
  };
  var MemoryStore = [
    $_w7f5sx2jd24rmi1.option('initialValue'),
    $_62w1klytjd24rmnt.output('manager', {
      setValue: setValue$3,
      getValue: getValue$3,
      onLoad: onLoad$4,
      onUnload: onUnload$2,
      state: $_ac6l6s113jd24rmxb.memory
    })
  ];

  var RepresentSchema = [
    $_w7f5sx2jd24rmi1.defaultedOf('store', { mode: 'memory' }, $_bdtykhxhjd24rmjn.choose('mode', {
      memory: MemoryStore,
      manual: ManualStore,
      dataset: DatasetStore
    })),
    $_62w1klytjd24rmnt.onHandler('onSetValue'),
    $_w7f5sx2jd24rmi1.defaulted('resetOnDom', false)
  ];

  var me = $_9vyb2vw4jd24rmen.create({
    fields: RepresentSchema,
    name: 'representing',
    active: $_845das10zjd24rmx3,
    apis: $_62ka4v110jd24rmx5,
    extra: {
      setValueFrom: function (component, source) {
        var value = me.getValue(source);
        me.setValue(component, value);
      }
    },
    state: $_ac6l6s113jd24rmxb
  });

  var isTouch$2 = $_1616jcwgjd24rmg9.detect().deviceType.isTouch();
  var SliderSchema = [
    $_w7f5sx2jd24rmi1.strict('min'),
    $_w7f5sx2jd24rmi1.strict('max'),
    $_w7f5sx2jd24rmi1.defaulted('stepSize', 1),
    $_w7f5sx2jd24rmi1.defaulted('onChange', $_aoet5bwbjd24rmfz.noop),
    $_w7f5sx2jd24rmi1.defaulted('onInit', $_aoet5bwbjd24rmfz.noop),
    $_w7f5sx2jd24rmi1.defaulted('onDragStart', $_aoet5bwbjd24rmfz.noop),
    $_w7f5sx2jd24rmi1.defaulted('onDragEnd', $_aoet5bwbjd24rmfz.noop),
    $_w7f5sx2jd24rmi1.defaulted('snapToGrid', false),
    $_w7f5sx2jd24rmi1.option('snapStart'),
    $_w7f5sx2jd24rmi1.strict('getInitialValue'),
    $_azr91y10djd24rmtn.field('sliderBehaviours', [
      Keying,
      me
    ]),
    $_w7f5sx2jd24rmi1.state('value', function (spec) {
      return Cell(spec.min);
    })
  ].concat(!isTouch$2 ? [$_w7f5sx2jd24rmi1.state('mouseIsDown', function () {
      return Cell(false);
    })] : []);

  var api$1 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$4 = function (element, h) {
    api$1.set(element, h);
  };
  var get$6 = function (element) {
    return api$1.get(element);
  };
  var getOuter$2 = function (element) {
    return api$1.getOuter(element);
  };
  var setMax$1 = function (element, value) {
    var inclusions = [
      'margin-left',
      'border-left-width',
      'padding-left',
      'padding-right',
      'border-right-width',
      'margin-right'
    ];
    var absMax = api$1.max(element, value, inclusions);
    $_ayz4w9zsjd24rmr3.set(element, 'max-width', absMax + 'px');
  };
  var $_cnk9kc117jd24rmxv = {
    set: set$4,
    get: get$6,
    getOuter: getOuter$2,
    setMax: setMax$1
  };

  var isTouch$3 = $_1616jcwgjd24rmg9.detect().deviceType.isTouch();
  var sketch$1 = function (detail, components, spec, externals) {
    var range = detail.max() - detail.min();
    var getXCentre = function (component) {
      var rect = component.element().dom().getBoundingClientRect();
      return (rect.left + rect.right) / 2;
    };
    var getThumb = function (component) {
      return $_czojf710ijd24rmub.getPartOrDie(component, detail, 'thumb');
    };
    var getXOffset = function (slider, spectrumBounds, detail) {
      var v = detail.value().get();
      if (v < detail.min()) {
        return $_czojf710ijd24rmub.getPart(slider, detail, 'left-edge').fold(function () {
          return 0;
        }, function (ledge) {
          return getXCentre(ledge) - spectrumBounds.left;
        });
      } else if (v > detail.max()) {
        return $_czojf710ijd24rmub.getPart(slider, detail, 'right-edge').fold(function () {
          return spectrumBounds.width;
        }, function (redge) {
          return getXCentre(redge) - spectrumBounds.left;
        });
      } else {
        return (detail.value().get() - detail.min()) / range * spectrumBounds.width;
      }
    };
    var getXPos = function (slider) {
      var spectrum = $_czojf710ijd24rmub.getPartOrDie(slider, detail, 'spectrum');
      var spectrumBounds = spectrum.element().dom().getBoundingClientRect();
      var sliderBounds = slider.element().dom().getBoundingClientRect();
      var xOffset = getXOffset(slider, spectrumBounds, detail);
      return spectrumBounds.left - sliderBounds.left + xOffset;
    };
    var refresh = function (component) {
      var pos = getXPos(component);
      var thumb = getThumb(component);
      var thumbRadius = $_cnk9kc117jd24rmxv.get(thumb.element()) / 2;
      $_ayz4w9zsjd24rmr3.set(thumb.element(), 'left', pos - thumbRadius + 'px');
    };
    var changeValue = function (component, newValue) {
      var oldValue = detail.value().get();
      var thumb = getThumb(component);
      if (oldValue !== newValue || $_ayz4w9zsjd24rmr3.getRaw(thumb.element(), 'left').isNone()) {
        detail.value().set(newValue);
        refresh(component);
        detail.onChange()(component, thumb, newValue);
        return $_asi680wajd24rmfv.some(true);
      } else {
        return $_asi680wajd24rmfv.none();
      }
    };
    var resetToMin = function (slider) {
      changeValue(slider, detail.min());
    };
    var resetToMax = function (slider) {
      changeValue(slider, detail.max());
    };
    var uiEventsArr = isTouch$3 ? [
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchstart(), function (slider, simulatedEvent) {
        detail.onDragStart()(slider, getThumb(slider));
      }),
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchend(), function (slider, simulatedEvent) {
        detail.onDragEnd()(slider, getThumb(slider));
      })
    ] : [
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mousedown(), function (slider, simulatedEvent) {
        simulatedEvent.stop();
        detail.onDragStart()(slider, getThumb(slider));
        detail.mouseIsDown().set(true);
      }),
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mouseup(), function (slider, simulatedEvent) {
        detail.onDragEnd()(slider, getThumb(slider));
        detail.mouseIsDown().set(false);
      })
    ];
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive($_3vsestw9jd24rmfo.flatten([
        !isTouch$3 ? [Keying.config({
            mode: 'special',
            focusIn: function (slider) {
              return $_czojf710ijd24rmub.getPart(slider, detail, 'spectrum').map(Keying.focusIn).map($_aoet5bwbjd24rmfz.constant(true));
            }
          })] : [],
        [me.config({
            store: {
              mode: 'manual',
              getValue: function (_) {
                return detail.value().get();
              }
            }
          })]
      ])), $_azr91y10djd24rmtn.get(detail.sliderBehaviours())),
      events: $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.run($_3nj21c10vjd24rmwm.changeEvent(), function (slider, simulatedEvent) {
          changeValue(slider, simulatedEvent.event().value());
        }),
        $_g9t26pw6jd24rmfc.runOnAttached(function (slider, simulatedEvent) {
          detail.value().set(detail.getInitialValue()());
          var thumb = getThumb(slider);
          refresh(slider);
          detail.onInit()(slider, thumb, detail.value().get());
        })
      ].concat(uiEventsArr)),
      apis: {
        resetToMin: resetToMin,
        resetToMax: resetToMax,
        refresh: refresh
      },
      domModification: { styles: { position: 'relative' } }
    };
  };
  var $_frwcym116jd24rmxl = { sketch: sketch$1 };

  var Slider = $_7v08p10ejd24rmts.composite({
    name: 'Slider',
    configFields: SliderSchema,
    partFields: SliderParts,
    factory: $_frwcym116jd24rmxl.sketch,
    apis: {
      resetToMin: function (apis, slider) {
        apis.resetToMin(slider);
      },
      resetToMax: function (apis, slider) {
        apis.resetToMax(slider);
      },
      refresh: function (apis, slider) {
        apis.refresh(slider);
      }
    }
  });

  var button = function (realm, clazz, makeItems) {
    return $_2byzekz2jd24rmop.forToolbar(clazz, function () {
      var items = makeItems();
      realm.setContextToolbar([{
          label: clazz + ' group',
          items: items
        }]);
    }, {});
  };
  var $_fz215i118jd24rmxw = { button: button };

  var BLACK = -1;
  var makeSlider = function (spec) {
    var getColor = function (hue) {
      if (hue < 0) {
        return 'black';
      } else if (hue > 360) {
        return 'white';
      } else {
        return 'hsl(' + hue + ', 100%, 50%)';
      }
    };
    var onInit = function (slider, thumb, value) {
      var color = getColor(value);
      $_ayz4w9zsjd24rmr3.set(thumb.element(), 'background-color', color);
    };
    var onChange = function (slider, thumb, value) {
      var color = getColor(value);
      $_ayz4w9zsjd24rmr3.set(thumb.element(), 'background-color', color);
      spec.onChange(slider, thumb, color);
    };
    return Slider.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-slider ${prefix}-hue-slider-container"></div>'),
      components: [
        Slider.parts()['left-edge']($_ejtuy110qjd24rmvy.spec('<div class="${prefix}-hue-slider-black"></div>')),
        Slider.parts().spectrum({
          dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-slider-gradient-container"></div>'),
          components: [$_ejtuy110qjd24rmvy.spec('<div class="${prefix}-slider-gradient"></div>')],
          behaviours: $_9vyb2vw4jd24rmen.derive([Toggling.config({ toggleClass: $_4i0vdoz1jd24rmoo.resolve('thumb-active') })])
        }),
        Slider.parts()['right-edge']($_ejtuy110qjd24rmvy.spec('<div class="${prefix}-hue-slider-white"></div>')),
        Slider.parts().thumb({
          dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-slider-thumb"></div>'),
          behaviours: $_9vyb2vw4jd24rmen.derive([Toggling.config({ toggleClass: $_4i0vdoz1jd24rmoo.resolve('thumb-active') })])
        })
      ],
      onChange: onChange,
      onDragStart: function (slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function (slider, thumb) {
        Toggling.off(thumb);
      },
      onInit: onInit,
      stepSize: 10,
      min: 0,
      max: 360,
      getInitialValue: spec.getInitialValue,
      sliderBehaviours: $_9vyb2vw4jd24rmen.derive([$_xzzzbz0jd24rmol.orientation(Slider.refresh)])
    });
  };
  var makeItems = function (spec) {
    return [makeSlider(spec)];
  };
  var sketch$2 = function (realm, editor) {
    var spec = {
      onChange: function (slider, thumb, color) {
        editor.undoManager.transact(function () {
          editor.formatter.apply('forecolor', { value: color });
          editor.nodeChanged();
        });
      },
      getInitialValue: function () {
        return BLACK;
      }
    };
    return $_fz215i118jd24rmxw.button(realm, 'color', function () {
      return makeItems(spec);
    });
  };
  var $_ax0cpp10sjd24rmw9 = {
    makeItems: makeItems,
    sketch: sketch$2
  };

  var schema$7 = $_bdtykhxhjd24rmjn.objOfOnly([
    $_w7f5sx2jd24rmi1.strict('getInitialValue'),
    $_w7f5sx2jd24rmi1.strict('onChange'),
    $_w7f5sx2jd24rmi1.strict('category'),
    $_w7f5sx2jd24rmi1.strict('sizes')
  ]);
  var sketch$3 = function (rawSpec) {
    var spec = $_bdtykhxhjd24rmjn.asRawOrDie('SizeSlider', schema$7, rawSpec);
    var isValidValue = function (valueIndex) {
      return valueIndex >= 0 && valueIndex < spec.sizes.length;
    };
    var onChange = function (slider, thumb, valueIndex) {
      if (isValidValue(valueIndex)) {
        spec.onChange(valueIndex);
      }
    };
    return Slider.sketch({
      dom: {
        tag: 'div',
        classes: [
          $_4i0vdoz1jd24rmoo.resolve('slider-' + spec.category + '-size-container'),
          $_4i0vdoz1jd24rmoo.resolve('slider'),
          $_4i0vdoz1jd24rmoo.resolve('slider-size-container')
        ]
      },
      onChange: onChange,
      onDragStart: function (slider, thumb) {
        Toggling.on(thumb);
      },
      onDragEnd: function (slider, thumb) {
        Toggling.off(thumb);
      },
      min: 0,
      max: spec.sizes.length - 1,
      stepSize: 1,
      getInitialValue: spec.getInitialValue,
      snapToGrid: true,
      sliderBehaviours: $_9vyb2vw4jd24rmen.derive([$_xzzzbz0jd24rmol.orientation(Slider.refresh)]),
      components: [
        Slider.parts().spectrum({
          dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-slider-size-container"></div>'),
          components: [$_ejtuy110qjd24rmvy.spec('<div class="${prefix}-slider-size-line"></div>')]
        }),
        Slider.parts().thumb({
          dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-slider-thumb"></div>'),
          behaviours: $_9vyb2vw4jd24rmen.derive([Toggling.config({ toggleClass: $_4i0vdoz1jd24rmoo.resolve('thumb-active') })])
        })
      ]
    });
  };
  var $_5gkeyi11ajd24rmxz = { sketch: sketch$3 };

  var ancestor$3 = function (scope, transform, isRoot) {
    var element = scope.dom();
    var stop = $_cbf8cdwzjd24rmhn.isFunction(isRoot) ? isRoot : $_aoet5bwbjd24rmfz.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_ei6gqxwtjd24rmh8.fromDom(element);
      var transformed = transform(el);
      if (transformed.isSome())
        return transformed;
      else if (stop(el))
        break;
    }
    return $_asi680wajd24rmfv.none();
  };
  var closest$3 = function (scope, transform, isRoot) {
    var current = transform(scope);
    return current.orThunk(function () {
      return isRoot(scope) ? $_asi680wajd24rmfv.none() : ancestor$3(scope, transform, isRoot);
    });
  };
  var $_d5gyoo11cjd24rmyc = {
    ancestor: ancestor$3,
    closest: closest$3
  };

  var candidates = [
    '9px',
    '10px',
    '11px',
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '36px'
  ];
  var defaultSize = 'medium';
  var defaultIndex = 2;
  var indexToSize = function (index) {
    return $_asi680wajd24rmfv.from(candidates[index]);
  };
  var sizeToIndex = function (size) {
    return $_3vsestw9jd24rmfo.findIndex(candidates, function (v) {
      return v === size;
    });
  };
  var getRawOrComputed = function (isRoot, rawStart) {
    var optStart = $_5fvhg7xxjd24rmkz.isElement(rawStart) ? $_asi680wajd24rmfv.some(rawStart) : $_5on3koy3jd24rmlg.parent(rawStart);
    return optStart.map(function (start) {
      var inline = $_d5gyoo11cjd24rmyc.closest(start, function (elem) {
        return $_ayz4w9zsjd24rmr3.getRaw(elem, 'font-size');
      }, isRoot);
      return inline.getOrThunk(function () {
        return $_ayz4w9zsjd24rmr3.get(start, 'font-size');
      });
    }).getOr('');
  };
  var getSize = function (editor) {
    var node = editor.selection.getStart();
    var elem = $_ei6gqxwtjd24rmh8.fromDom(node);
    var root = $_ei6gqxwtjd24rmh8.fromDom(editor.getBody());
    var isRoot = function (e) {
      return $_237cqww8jd24rmfh.eq(root, e);
    };
    var elemSize = getRawOrComputed(isRoot, elem);
    return $_3vsestw9jd24rmfo.find(candidates, function (size) {
      return elemSize === size;
    }).getOr(defaultSize);
  };
  var applySize = function (editor, value) {
    var currentValue = getSize(editor);
    if (currentValue !== value) {
      editor.execCommand('fontSize', false, value);
    }
  };
  var get$7 = function (editor) {
    var size = getSize(editor);
    return sizeToIndex(size).getOr(defaultIndex);
  };
  var apply$1 = function (editor, index) {
    indexToSize(index).each(function (size) {
      applySize(editor, size);
    });
  };
  var $_ox09c11bjd24rmy4 = {
    candidates: $_aoet5bwbjd24rmfz.constant(candidates),
    get: get$7,
    apply: apply$1
  };

  var sizes = $_ox09c11bjd24rmy4.candidates();
  var makeSlider$1 = function (spec) {
    return $_5gkeyi11ajd24rmxz.sketch({
      onChange: spec.onChange,
      sizes: sizes,
      category: 'font',
      getInitialValue: spec.getInitialValue
    });
  };
  var makeItems$1 = function (spec) {
    return [
      $_ejtuy110qjd24rmvy.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-small-font ${prefix}-icon"></span>'),
      makeSlider$1(spec),
      $_ejtuy110qjd24rmvy.spec('<span class="${prefix}-toolbar-button ${prefix}-icon-large-font ${prefix}-icon"></span>')
    ];
  };
  var sketch$4 = function (realm, editor) {
    var spec = {
      onChange: function (value) {
        $_ox09c11bjd24rmy4.apply(editor, value);
      },
      getInitialValue: function () {
        return $_ox09c11bjd24rmy4.get(editor);
      }
    };
    return $_fz215i118jd24rmxw.button(realm, 'font-size', function () {
      return makeItems$1(spec);
    });
  };
  var $_2fhlv5119jd24rmxx = {
    makeItems: makeItems$1,
    sketch: sketch$4
  };

  var record = function (spec) {
    var uid = $_bzffwwx6jd24rmit.hasKey(spec, 'uid') ? spec.uid : $_c4606g10mjd24rmv9.generate('memento');
    var get = function (any) {
      return any.getSystem().getByUid(uid).getOrDie();
    };
    var getOpt = function (any) {
      return any.getSystem().getByUid(uid).fold($_asi680wajd24rmfv.none, $_asi680wajd24rmfv.some);
    };
    var asSpec = function () {
      return $_4x4s83wyjd24rmhm.deepMerge(spec, { uid: uid });
    };
    return {
      get: get,
      getOpt: getOpt,
      asSpec: asSpec
    };
  };
  var $_c9gmcp11ejd24rmyr = { record: record };

  function create$3(width, height) {
    return resize(document.createElement('canvas'), width, height);
  }
  function clone$2(canvas) {
    var tCanvas, ctx;
    tCanvas = create$3(canvas.width, canvas.height);
    ctx = get2dContext(tCanvas);
    ctx.drawImage(canvas, 0, 0);
    return tCanvas;
  }
  function get2dContext(canvas) {
    return canvas.getContext('2d');
  }
  function get3dContext(canvas) {
    var gl = null;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
    }
    if (!gl) {
      gl = null;
    }
    return gl;
  }
  function resize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  var $_5ehg3j11hjd24rmz8 = {
    create: create$3,
    clone: clone$2,
    resize: resize,
    get2dContext: get2dContext,
    get3dContext: get3dContext
  };

  function getWidth(image) {
    return image.naturalWidth || image.width;
  }
  function getHeight(image) {
    return image.naturalHeight || image.height;
  }
  var $_2ux0bm11ijd24rmz9 = {
    getWidth: getWidth,
    getHeight: getHeight
  };

  var promise = function () {
    var Promise = function (fn) {
      if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function')
        throw new TypeError('not a function');
      this._state = null;
      this._value = null;
      this._deferreds = [];
      doResolve(fn, bind(resolve, this), bind(reject, this));
    };
    var asap = Promise.immediateFn || typeof setImmediate === 'function' && setImmediate || function (fn) {
      setTimeout(fn, 1);
    };
    function bind(fn, thisArg) {
      return function () {
        fn.apply(thisArg, arguments);
      };
    }
    var isArray = Array.isArray || function (value) {
      return Object.prototype.toString.call(value) === '[object Array]';
    };
    function handle(deferred) {
      var me = this;
      if (this._state === null) {
        this._deferreds.push(deferred);
        return;
      }
      asap(function () {
        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (me._state ? deferred.resolve : deferred.reject)(me._value);
          return;
        }
        var ret;
        try {
          ret = cb(me._value);
        } catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(ret);
      });
    }
    function resolve(newValue) {
      try {
        if (newValue === this)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = newValue.then;
          if (typeof then === 'function') {
            doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
            return;
          }
        }
        this._state = true;
        this._value = newValue;
        finale.call(this);
      } catch (e) {
        reject.call(this, e);
      }
    }
    function reject(newValue) {
      this._state = false;
      this._value = newValue;
      finale.call(this);
    }
    function finale() {
      for (var i = 0, len = this._deferreds.length; i < len; i++) {
        handle.call(this, this._deferreds[i]);
      }
      this._deferreds = null;
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done)
            return;
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done)
            return;
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done)
          return;
        done = true;
        onRejected(ex);
      }
    }
    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
      var me = this;
      return new Promise(function (resolve, reject) {
        handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
      });
    };
    Promise.all = function () {
      var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
      return new Promise(function (resolve, reject) {
        if (args.length === 0)
          return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.resolve = function (value) {
      if (value && typeof value === 'object' && value.constructor === Promise) {
        return value;
      }
      return new Promise(function (resolve) {
        resolve(value);
      });
    };
    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        for (var i = 0, len = values.length; i < len; i++) {
          values[i].then(resolve, reject);
        }
      });
    };
    return Promise;
  };
  var Promise = window.Promise ? window.Promise : promise();

  function Blob (parts, properties) {
    var f = $_2au6sowdjd24rmg4.getOrDie('Blob');
    return new f(parts, properties);
  }

  function FileReader () {
    var f = $_2au6sowdjd24rmg4.getOrDie('FileReader');
    return new f();
  }

  function Uint8Array (arr) {
    var f = $_2au6sowdjd24rmg4.getOrDie('Uint8Array');
    return new f(arr);
  }

  var requestAnimationFrame = function (callback) {
    var f = $_2au6sowdjd24rmg4.getOrDie('requestAnimationFrame');
    f(callback);
  };
  var atob = function (base64) {
    var f = $_2au6sowdjd24rmg4.getOrDie('atob');
    return f(base64);
  };
  var $_9i8cmx11njd24rmzg = {
    atob: atob,
    requestAnimationFrame: requestAnimationFrame
  };

  function loadImage(image) {
    return new Promise(function (resolve) {
      function loaded() {
        image.removeEventListener('load', loaded);
        resolve(image);
      }
      if (image.complete) {
        resolve(image);
      } else {
        image.addEventListener('load', loaded);
      }
    });
  }
  function imageToBlob(image) {
    return loadImage(image).then(function (image) {
      var src = image.src;
      if (src.indexOf('blob:') === 0) {
        return anyUriToBlob(src);
      }
      if (src.indexOf('data:') === 0) {
        return dataUriToBlob(src);
      }
      return anyUriToBlob(src);
    });
  }
  function blobToImage(blob) {
    return new Promise(function (resolve, reject) {
      var blobUrl = URL.createObjectURL(blob);
      var image = new Image();
      var removeListeners = function () {
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', error);
      };
      function loaded() {
        removeListeners();
        resolve(image);
      }
      function error() {
        removeListeners();
        reject('Unable to load data of type ' + blob.type + ': ' + blobUrl);
      }
      image.addEventListener('load', loaded);
      image.addEventListener('error', error);
      image.src = blobUrl;
      if (image.complete) {
        loaded();
      }
    });
  }
  function anyUriToBlob(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        }
      };
      xhr.onerror = function () {
        var _this = this;
        var corsError = function () {
          var obj = new Error('No access to download image');
          obj.code = 18;
          obj.name = 'SecurityError';
          return obj;
        };
        var genericError = function () {
          return new Error('Error ' + _this.status + ' downloading image');
        };
        reject(this.status === 0 ? corsError() : genericError());
      };
      xhr.send();
    });
  }
  function dataUriToBlobSync(uri) {
    var data = uri.split(',');
    var matches = /data:([^;]+)/.exec(data[0]);
    if (!matches)
      return $_asi680wajd24rmfv.none();
    var mimetype = matches[1];
    var base64 = data[1];
    var sliceSize = 1024;
    var byteCharacters = $_9i8cmx11njd24rmzg.atob(base64);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = Uint8Array(bytes);
    }
    return $_asi680wajd24rmfv.some(Blob(byteArrays, { type: mimetype }));
  }
  function dataUriToBlob(uri) {
    return new Promise(function (resolve, reject) {
      dataUriToBlobSync(uri).fold(function () {
        reject('uri is not base64: ' + uri);
      }, resolve);
    });
  }
  function uriToBlob(url) {
    if (url.indexOf('blob:') === 0) {
      return anyUriToBlob(url);
    }
    if (url.indexOf('data:') === 0) {
      return dataUriToBlob(url);
    }
    return null;
  }
  function canvasToBlob(canvas, type, quality) {
    type = type || 'image/png';
    if (HTMLCanvasElement.prototype.toBlob) {
      return new Promise(function (resolve) {
        canvas.toBlob(function (blob) {
          resolve(blob);
        }, type, quality);
      });
    } else {
      return dataUriToBlob(canvas.toDataURL(type, quality));
    }
  }
  function canvasToDataURL(getCanvas, type, quality) {
    type = type || 'image/png';
    return getCanvas.then(function (canvas) {
      return canvas.toDataURL(type, quality);
    });
  }
  function blobToCanvas(blob) {
    return blobToImage(blob).then(function (image) {
      revokeImageUrl(image);
      var context, canvas;
      canvas = $_5ehg3j11hjd24rmz8.create($_2ux0bm11ijd24rmz9.getWidth(image), $_2ux0bm11ijd24rmz9.getHeight(image));
      context = $_5ehg3j11hjd24rmz8.get2dContext(canvas);
      context.drawImage(image, 0, 0);
      return canvas;
    });
  }
  function blobToDataUri(blob) {
    return new Promise(function (resolve) {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  function blobToBase64(blob) {
    return blobToDataUri(blob).then(function (dataUri) {
      return dataUri.split(',')[1];
    });
  }
  function revokeImageUrl(image) {
    URL.revokeObjectURL(image.src);
  }
  var $_3fot8h11gjd24rmyy = {
    blobToImage: blobToImage,
    imageToBlob: imageToBlob,
    blobToDataUri: blobToDataUri,
    blobToBase64: blobToBase64,
    dataUriToBlobSync: dataUriToBlobSync,
    canvasToBlob: canvasToBlob,
    canvasToDataURL: canvasToDataURL,
    blobToCanvas: blobToCanvas,
    uriToBlob: uriToBlob
  };

  var blobToImage$1 = function (image) {
    return $_3fot8h11gjd24rmyy.blobToImage(image);
  };
  var imageToBlob$1 = function (blob) {
    return $_3fot8h11gjd24rmyy.imageToBlob(blob);
  };
  var blobToDataUri$1 = function (blob) {
    return $_3fot8h11gjd24rmyy.blobToDataUri(blob);
  };
  var blobToBase64$1 = function (blob) {
    return $_3fot8h11gjd24rmyy.blobToBase64(blob);
  };
  var dataUriToBlobSync$1 = function (uri) {
    return $_3fot8h11gjd24rmyy.dataUriToBlobSync(uri);
  };
  var uriToBlob$1 = function (uri) {
    return $_asi680wajd24rmfv.from($_3fot8h11gjd24rmyy.uriToBlob(uri));
  };
  var $_ajx4xn11fjd24rmyv = {
    blobToImage: blobToImage$1,
    imageToBlob: imageToBlob$1,
    blobToDataUri: blobToDataUri$1,
    blobToBase64: blobToBase64$1,
    dataUriToBlobSync: dataUriToBlobSync$1,
    uriToBlob: uriToBlob$1
  };

  var addImage = function (editor, blob) {
    $_ajx4xn11fjd24rmyv.blobToBase64(blob).then(function (base64) {
      editor.undoManager.transact(function () {
        var cache = editor.editorUpload.blobCache;
        var info = cache.create($_d75dkd10gjd24rmu6.generate('mceu'), blob, base64);
        cache.add(info);
        var img = editor.dom.createHTML('img', { src: info.blobUri() });
        editor.insertContent(img);
      });
    });
  };
  var extractBlob = function (simulatedEvent) {
    var event = simulatedEvent.event();
    var files = event.raw().target.files || event.raw().dataTransfer.files;
    return $_asi680wajd24rmfv.from(files[0]);
  };
  var sketch$5 = function (editor) {
    var pickerDom = {
      tag: 'input',
      attributes: {
        accept: 'image/*',
        type: 'file',
        title: ''
      },
      styles: {
        visibility: 'hidden',
        position: 'absolute'
      }
    };
    var memPicker = $_c9gmcp11ejd24rmyr.record({
      dom: pickerDom,
      events: $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.cutter($_1tcfm9wxjd24rmhk.click()),
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.change(), function (picker, simulatedEvent) {
          extractBlob(simulatedEvent).each(function (blob) {
            addImage(editor, blob);
          });
        })
      ])
    });
    return Button.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<span class="${prefix}-toolbar-button ${prefix}-icon-image ${prefix}-icon"></span>'),
      components: [memPicker.asSpec()],
      action: function (button) {
        var picker = memPicker.get(button);
        picker.element().dom().click();
      }
    });
  };
  var $_1lhgof11djd24rmyk = { sketch: sketch$5 };

  var get$8 = function (element) {
    return element.dom().textContent;
  };
  var set$5 = function (element, value) {
    element.dom().textContent = value;
  };
  var $_bekear11qjd24rmzs = {
    get: get$8,
    set: set$5
  };

  var isNotEmpty = function (val) {
    return val.length > 0;
  };
  var defaultToEmpty = function (str) {
    return str === undefined || str === null ? '' : str;
  };
  var noLink = function (editor) {
    var text = editor.selection.getContent({ format: 'text' });
    return {
      url: '',
      text: text,
      title: '',
      target: '',
      link: $_asi680wajd24rmfv.none()
    };
  };
  var fromLink = function (link) {
    var text = $_bekear11qjd24rmzs.get(link);
    var url = $_dxjq1vxwjd24rmkv.get(link, 'href');
    var title = $_dxjq1vxwjd24rmkv.get(link, 'title');
    var target = $_dxjq1vxwjd24rmkv.get(link, 'target');
    return {
      url: defaultToEmpty(url),
      text: text !== url ? defaultToEmpty(text) : '',
      title: defaultToEmpty(title),
      target: defaultToEmpty(target),
      link: $_asi680wajd24rmfv.some(link)
    };
  };
  var getInfo = function (editor) {
    return query(editor).fold(function () {
      return noLink(editor);
    }, function (link) {
      return fromLink(link);
    });
  };
  var wasSimple = function (link) {
    var prevHref = $_dxjq1vxwjd24rmkv.get(link, 'href');
    var prevText = $_bekear11qjd24rmzs.get(link);
    return prevHref === prevText;
  };
  var getTextToApply = function (link, url, info) {
    return info.text.filter(isNotEmpty).fold(function () {
      return wasSimple(link) ? $_asi680wajd24rmfv.some(url) : $_asi680wajd24rmfv.none();
    }, $_asi680wajd24rmfv.some);
  };
  var unlinkIfRequired = function (editor, info) {
    var activeLink = info.link.bind($_aoet5bwbjd24rmfz.identity);
    activeLink.each(function (link) {
      editor.execCommand('unlink');
    });
  };
  var getAttrs$1 = function (url, info) {
    var attrs = {};
    attrs.href = url;
    info.title.filter(isNotEmpty).each(function (title) {
      attrs.title = title;
    });
    info.target.filter(isNotEmpty).each(function (target) {
      attrs.target = target;
    });
    return attrs;
  };
  var applyInfo = function (editor, info) {
    info.url.filter(isNotEmpty).fold(function () {
      unlinkIfRequired(editor, info);
    }, function (url) {
      var attrs = getAttrs$1(url, info);
      var activeLink = info.link.bind($_aoet5bwbjd24rmfz.identity);
      activeLink.fold(function () {
        var text = info.text.filter(isNotEmpty).getOr(url);
        editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(text)));
      }, function (link) {
        var text = getTextToApply(link, url, info);
        $_dxjq1vxwjd24rmkv.setAll(link, attrs);
        text.each(function (newText) {
          $_bekear11qjd24rmzs.set(link, newText);
        });
      });
    });
  };
  var query = function (editor) {
    var start = $_ei6gqxwtjd24rmh8.fromDom(editor.selection.getStart());
    return $_56vfpvzmjd24rmql.closest(start, 'a');
  };
  var $_ezht9c11pjd24rmzm = {
    getInfo: getInfo,
    applyInfo: applyInfo,
    query: query
  };

  var events$6 = function (name, eventHandlers) {
    var events = $_g9t26pw6jd24rmfc.derive(eventHandlers);
    return $_9vyb2vw4jd24rmen.create({
      fields: [$_w7f5sx2jd24rmi1.strict('enabled')],
      name: name,
      active: { events: $_aoet5bwbjd24rmfz.constant(events) }
    });
  };
  var config = function (name, eventHandlers) {
    var me = events$6(name, eventHandlers);
    return {
      key: name,
      value: {
        config: {},
        me: me,
        configAsRaw: $_aoet5bwbjd24rmfz.constant({}),
        initialConfig: {},
        state: $_9vyb2vw4jd24rmen.noState()
      }
    };
  };
  var $_dzt99a11sjd24rn0a = {
    events: events$6,
    config: config
  };

  var getCurrent = function (component, composeConfig, composeState) {
    return composeConfig.find()(component);
  };
  var $_4do4k11ujd24rn0e = { getCurrent: getCurrent };

  var ComposeSchema = [$_w7f5sx2jd24rmi1.strict('find')];

  var Composing = $_9vyb2vw4jd24rmen.create({
    fields: ComposeSchema,
    name: 'composing',
    apis: $_4do4k11ujd24rn0e
  });

  var factory$1 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: $_4x4s83wyjd24rmhm.deepMerge({
        tag: 'div',
        attributes: { role: 'presentation' }
      }, detail.dom()),
      components: detail.components(),
      behaviours: $_azr91y10djd24rmtn.get(detail.containerBehaviours()),
      events: detail.events(),
      domModification: detail.domModification(),
      eventOrder: detail.eventOrder()
    };
  };
  var Container = $_7v08p10ejd24rmts.single({
    name: 'Container',
    factory: factory$1,
    configFields: [
      $_w7f5sx2jd24rmi1.defaulted('components', []),
      $_azr91y10djd24rmtn.field('containerBehaviours', []),
      $_w7f5sx2jd24rmi1.defaulted('events', {}),
      $_w7f5sx2jd24rmi1.defaulted('domModification', {}),
      $_w7f5sx2jd24rmi1.defaulted('eventOrder', {})
    ]
  });

  var factory$2 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([
        me.config({
          store: {
            mode: 'memory',
            initialValue: detail.getInitialValue()()
          }
        }),
        Composing.config({ find: $_asi680wajd24rmfv.some })
      ]), $_azr91y10djd24rmtn.get(detail.dataBehaviours())),
      events: $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.runOnAttached(function (component, simulatedEvent) {
          me.setValue(component, detail.getInitialValue()());
        })])
    };
  };
  var DataField = $_7v08p10ejd24rmts.single({
    name: 'DataField',
    factory: factory$2,
    configFields: [
      $_w7f5sx2jd24rmi1.strict('uid'),
      $_w7f5sx2jd24rmi1.strict('dom'),
      $_w7f5sx2jd24rmi1.strict('getInitialValue'),
      $_azr91y10djd24rmtn.field('dataBehaviours', [
        me,
        Composing
      ])
    ]
  });

  var get$9 = function (element) {
    return element.dom().value;
  };
  var set$6 = function (element, value) {
    if (value === undefined)
      throw new Error('Value.set was undefined');
    element.dom().value = value;
  };
  var $_8ly6ch120jd24rn0x = {
    set: set$6,
    get: get$9
  };

  var schema$8 = [
    $_w7f5sx2jd24rmi1.option('data'),
    $_w7f5sx2jd24rmi1.defaulted('inputAttributes', {}),
    $_w7f5sx2jd24rmi1.defaulted('inputStyles', {}),
    $_w7f5sx2jd24rmi1.defaulted('type', 'input'),
    $_w7f5sx2jd24rmi1.defaulted('tag', 'input'),
    $_w7f5sx2jd24rmi1.defaulted('inputClasses', []),
    $_62w1klytjd24rmnt.onHandler('onSetValue'),
    $_w7f5sx2jd24rmi1.defaulted('styles', {}),
    $_w7f5sx2jd24rmi1.option('placeholder'),
    $_w7f5sx2jd24rmi1.defaulted('eventOrder', {}),
    $_azr91y10djd24rmtn.field('inputBehaviours', [
      me,
      Focusing
    ]),
    $_w7f5sx2jd24rmi1.defaulted('selectOnFocus', true)
  ];
  var behaviours = function (detail) {
    return $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([
      me.config({
        store: {
          mode: 'manual',
          initialValue: detail.data().getOr(undefined),
          getValue: function (input) {
            return $_8ly6ch120jd24rn0x.get(input.element());
          },
          setValue: function (input, data) {
            var current = $_8ly6ch120jd24rn0x.get(input.element());
            if (current !== data) {
              $_8ly6ch120jd24rn0x.set(input.element(), data);
            }
          }
        },
        onSetValue: detail.onSetValue()
      }),
      Focusing.config({
        onFocus: detail.selectOnFocus() === false ? $_aoet5bwbjd24rmfz.noop : function (component) {
          var input = component.element();
          var value = $_8ly6ch120jd24rn0x.get(input);
          input.dom().setSelectionRange(0, value.length);
        }
      })
    ]), $_azr91y10djd24rmtn.get(detail.inputBehaviours()));
  };
  var dom$2 = function (detail) {
    return {
      tag: detail.tag(),
      attributes: $_4x4s83wyjd24rmhm.deepMerge($_bzffwwx6jd24rmit.wrapAll([{
          key: 'type',
          value: detail.type()
        }].concat(detail.placeholder().map(function (pc) {
        return {
          key: 'placeholder',
          value: pc
        };
      }).toArray())), detail.inputAttributes()),
      styles: detail.inputStyles(),
      classes: detail.inputClasses()
    };
  };
  var $_d8xujk11zjd24rn0q = {
    schema: $_aoet5bwbjd24rmfz.constant(schema$8),
    behaviours: behaviours,
    dom: dom$2
  };

  var factory$3 = function (detail, spec) {
    return {
      uid: detail.uid(),
      dom: $_d8xujk11zjd24rn0q.dom(detail),
      components: [],
      behaviours: $_d8xujk11zjd24rn0q.behaviours(detail),
      eventOrder: detail.eventOrder()
    };
  };
  var Input = $_7v08p10ejd24rmts.single({
    name: 'Input',
    configFields: $_d8xujk11zjd24rn0q.schema(),
    factory: factory$3
  });

  var exhibit$3 = function (base, tabConfig) {
    return $_g169haxkjd24rmjy.nu({
      attributes: $_bzffwwx6jd24rmit.wrapAll([{
          key: tabConfig.tabAttr(),
          value: 'true'
        }])
    });
  };
  var $_9wypkp122jd24rn0z = { exhibit: exhibit$3 };

  var TabstopSchema = [$_w7f5sx2jd24rmi1.defaulted('tabAttr', 'data-alloy-tabstop')];

  var Tabstopping = $_9vyb2vw4jd24rmen.create({
    fields: TabstopSchema,
    name: 'tabstopping',
    active: $_9wypkp122jd24rn0z
  });

  var clearInputBehaviour = 'input-clearing';
  var field$2 = function (name, placeholder) {
    var inputSpec = $_c9gmcp11ejd24rmyr.record(Input.sketch({
      placeholder: placeholder,
      onSetValue: function (input, data) {
        $_eljod2wvjd24rmhc.emit(input, $_1tcfm9wxjd24rmhk.input());
      },
      inputBehaviours: $_9vyb2vw4jd24rmen.derive([
        Composing.config({ find: $_asi680wajd24rmfv.some }),
        Tabstopping.config({}),
        Keying.config({ mode: 'execution' })
      ]),
      selectOnFocus: false
    }));
    var buttonSpec = $_c9gmcp11ejd24rmyr.record(Button.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<button class="${prefix}-input-container-x ${prefix}-icon-cancel-circle ${prefix}-icon"></button>'),
      action: function (button) {
        var input = inputSpec.get(button);
        me.setValue(input, '');
      }
    }));
    return {
      name: name,
      spec: Container.sketch({
        dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-input-container"></div>'),
        components: [
          inputSpec.asSpec(),
          buttonSpec.asSpec()
        ],
        containerBehaviours: $_9vyb2vw4jd24rmen.derive([
          Toggling.config({ toggleClass: $_4i0vdoz1jd24rmoo.resolve('input-container-empty') }),
          Composing.config({
            find: function (comp) {
              return $_asi680wajd24rmfv.some(inputSpec.get(comp));
            }
          }),
          $_dzt99a11sjd24rn0a.config(clearInputBehaviour, [$_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.input(), function (iContainer) {
              var input = inputSpec.get(iContainer);
              var val = me.getValue(input);
              var f = val.length > 0 ? Toggling.off : Toggling.on;
              f(iContainer);
            })])
        ])
      })
    };
  };
  var hidden = function (name) {
    return {
      name: name,
      spec: DataField.sketch({
        dom: {
          tag: 'span',
          styles: { display: 'none' }
        },
        getInitialValue: function () {
          return $_asi680wajd24rmfv.none();
        }
      })
    };
  };
  var $_48n3np11rjd24rmzu = {
    field: field$2,
    hidden: hidden
  };

  var nativeDisabled = [
    'input',
    'button',
    'textarea'
  ];
  var onLoad$5 = function (component, disableConfig, disableState) {
    if (disableConfig.disabled())
      disable(component, disableConfig, disableState);
  };
  var hasNative = function (component) {
    return $_3vsestw9jd24rmfo.contains(nativeDisabled, $_5fvhg7xxjd24rmkz.name(component.element()));
  };
  var nativeIsDisabled = function (component) {
    return $_dxjq1vxwjd24rmkv.has(component.element(), 'disabled');
  };
  var nativeDisable = function (component) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'disabled', 'disabled');
  };
  var nativeEnable = function (component) {
    $_dxjq1vxwjd24rmkv.remove(component.element(), 'disabled');
  };
  var ariaIsDisabled = function (component) {
    return $_dxjq1vxwjd24rmkv.get(component.element(), 'aria-disabled') === 'true';
  };
  var ariaDisable = function (component) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'aria-disabled', 'true');
  };
  var ariaEnable = function (component) {
    $_dxjq1vxwjd24rmkv.set(component.element(), 'aria-disabled', 'false');
  };
  var disable = function (component, disableConfig, disableState) {
    disableConfig.disableClass().each(function (disableClass) {
      $_c8qis7xujd24rmks.add(component.element(), disableClass);
    });
    var f = hasNative(component) ? nativeDisable : ariaDisable;
    f(component);
  };
  var enable = function (component, disableConfig, disableState) {
    disableConfig.disableClass().each(function (disableClass) {
      $_c8qis7xujd24rmks.remove(component.element(), disableClass);
    });
    var f = hasNative(component) ? nativeEnable : ariaEnable;
    f(component);
  };
  var isDisabled = function (component) {
    return hasNative(component) ? nativeIsDisabled(component) : ariaIsDisabled(component);
  };
  var $_35wu6b127jd24rn1t = {
    enable: enable,
    disable: disable,
    isDisabled: isDisabled,
    onLoad: onLoad$5
  };

  var exhibit$4 = function (base, disableConfig, disableState) {
    return $_g169haxkjd24rmjy.nu({ classes: disableConfig.disabled() ? disableConfig.disableClass().map($_3vsestw9jd24rmfo.pure).getOr([]) : [] });
  };
  var events$7 = function (disableConfig, disableState) {
    return $_g9t26pw6jd24rmfc.derive([
      $_g9t26pw6jd24rmfc.abort($_9am11ywwjd24rmhg.execute(), function (component, simulatedEvent) {
        return $_35wu6b127jd24rn1t.isDisabled(component, disableConfig, disableState);
      }),
      $_a3lv5fw5jd24rmf0.loadEvent(disableConfig, disableState, $_35wu6b127jd24rn1t.onLoad)
    ]);
  };
  var $_9df5j3126jd24rn1r = {
    exhibit: exhibit$4,
    events: events$7
  };

  var DisableSchema = [
    $_w7f5sx2jd24rmi1.defaulted('disabled', false),
    $_w7f5sx2jd24rmi1.option('disableClass')
  ];

  var Disabling = $_9vyb2vw4jd24rmen.create({
    fields: DisableSchema,
    name: 'disabling',
    active: $_9df5j3126jd24rn1r,
    apis: $_35wu6b127jd24rn1t
  });

  var owner$1 = 'form';
  var schema$9 = [$_azr91y10djd24rmtn.field('formBehaviours', [me])];
  var getPartName = function (name) {
    return '<alloy.field.' + name + '>';
  };
  var sketch$6 = function (fSpec) {
    var parts = function () {
      var record = [];
      var field = function (name, config) {
        record.push(name);
        return $_czojf710ijd24rmub.generateOne(owner$1, getPartName(name), config);
      };
      return {
        field: field,
        record: function () {
          return record;
        }
      };
    }();
    var spec = fSpec(parts);
    var partNames = parts.record();
    var fieldParts = $_3vsestw9jd24rmfo.map(partNames, function (n) {
      return $_6nn6my10kjd24rmuq.required({
        name: n,
        pname: getPartName(n)
      });
    });
    return $_noz6s10hjd24rmu7.composite(owner$1, schema$9, fieldParts, make, spec);
  };
  var make = function (detail, components, spec) {
    return $_4x4s83wyjd24rmhm.deepMerge({
      'debug.sketcher': { 'Form': spec },
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([me.config({
          store: {
            mode: 'manual',
            getValue: function (form) {
              var optPs = $_czojf710ijd24rmub.getAllParts(form, detail);
              return $_2hhb0ax0jd24rmhp.map(optPs, function (optPThunk, pName) {
                return optPThunk().bind(Composing.getCurrent).map(me.getValue);
              });
            },
            setValue: function (form, values) {
              $_2hhb0ax0jd24rmhp.each(values, function (newValue, key) {
                $_czojf710ijd24rmub.getPart(form, detail, key).each(function (wrapper) {
                  Composing.getCurrent(wrapper).each(function (field) {
                    me.setValue(field, newValue);
                  });
                });
              });
            }
          }
        })]), $_azr91y10djd24rmtn.get(detail.formBehaviours())),
      apis: {
        getField: function (form, key) {
          return $_czojf710ijd24rmub.getPart(form, detail, key).bind(Composing.getCurrent);
        }
      }
    });
  };
  var $_ddvcd1129jd24rn22 = {
    getField: $_ch8g4910fjd24rmu1.makeApi(function (apis, component, key) {
      return apis.getField(component, key);
    }),
    sketch: sketch$6
  };

  var revocable = function (doRevoke) {
    var subject = Cell($_asi680wajd24rmfv.none());
    var revoke = function () {
      subject.get().each(doRevoke);
    };
    var clear = function () {
      revoke();
      subject.set($_asi680wajd24rmfv.none());
    };
    var set = function (s) {
      revoke();
      subject.set($_asi680wajd24rmfv.some(s));
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set
    };
  };
  var destroyable = function () {
    return revocable(function (s) {
      s.destroy();
    });
  };
  var unbindable = function () {
    return revocable(function (s) {
      s.unbind();
    });
  };
  var api$2 = function () {
    var subject = Cell($_asi680wajd24rmfv.none());
    var revoke = function () {
      subject.get().each(function (s) {
        s.destroy();
      });
    };
    var clear = function () {
      revoke();
      subject.set($_asi680wajd24rmfv.none());
    };
    var set = function (s) {
      revoke();
      subject.set($_asi680wajd24rmfv.some(s));
    };
    var run = function (f) {
      subject.get().each(f);
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      isSet: isSet,
      set: set,
      run: run
    };
  };
  var value$3 = function () {
    var subject = Cell($_asi680wajd24rmfv.none());
    var clear = function () {
      subject.set($_asi680wajd24rmfv.none());
    };
    var set = function (s) {
      subject.set($_asi680wajd24rmfv.some(s));
    };
    var on = function (f) {
      subject.get().each(f);
    };
    var isSet = function () {
      return subject.get().isSome();
    };
    return {
      clear: clear,
      set: set,
      isSet: isSet,
      on: on
    };
  };
  var $_2x26512ajd24rn28 = {
    destroyable: destroyable,
    unbindable: unbindable,
    api: api$2,
    value: value$3
  };

  var SWIPING_LEFT = 1;
  var SWIPING_RIGHT = -1;
  var SWIPING_NONE = 0;
  var init$3 = function (xValue) {
    return {
      xValue: xValue,
      points: []
    };
  };
  var move = function (model, xValue) {
    if (xValue === model.xValue) {
      return model;
    }
    var currentDirection = xValue - model.xValue > 0 ? SWIPING_LEFT : SWIPING_RIGHT;
    var newPoint = {
      direction: currentDirection,
      xValue: xValue
    };
    var priorPoints = function () {
      if (model.points.length === 0) {
        return [];
      } else {
        var prev = model.points[model.points.length - 1];
        return prev.direction === currentDirection ? model.points.slice(0, model.points.length - 1) : model.points;
      }
    }();
    return {
      xValue: xValue,
      points: priorPoints.concat([newPoint])
    };
  };
  var complete = function (model) {
    if (model.points.length === 0) {
      return SWIPING_NONE;
    } else {
      var firstDirection = model.points[0].direction;
      var lastDirection = model.points[model.points.length - 1].direction;
      return firstDirection === SWIPING_RIGHT && lastDirection === SWIPING_RIGHT ? SWIPING_RIGHT : firstDirection === SWIPING_LEFT && lastDirection === SWIPING_LEFT ? SWIPING_LEFT : SWIPING_NONE;
    }
  };
  var $_3l3gsw12bjd24rn2b = {
    init: init$3,
    move: move,
    complete: complete
  };

  var sketch$7 = function (rawSpec) {
    var navigateEvent = 'navigateEvent';
    var wrapperAdhocEvents = 'serializer-wrapper-events';
    var formAdhocEvents = 'form-events';
    var schema = $_bdtykhxhjd24rmjn.objOf([
      $_w7f5sx2jd24rmi1.strict('fields'),
      $_w7f5sx2jd24rmi1.defaulted('maxFieldIndex', rawSpec.fields.length - 1),
      $_w7f5sx2jd24rmi1.strict('onExecute'),
      $_w7f5sx2jd24rmi1.strict('getInitialValue'),
      $_w7f5sx2jd24rmi1.state('state', function () {
        return {
          dialogSwipeState: $_2x26512ajd24rn28.value(),
          currentScreen: Cell(0)
        };
      })
    ]);
    var spec = $_bdtykhxhjd24rmjn.asRawOrDie('SerialisedDialog', schema, rawSpec);
    var navigationButton = function (direction, directionName, enabled) {
      return Button.sketch({
        dom: $_ejtuy110qjd24rmvy.dom('<span class="${prefix}-icon-' + directionName + ' ${prefix}-icon"></span>'),
        action: function (button) {
          $_eljod2wvjd24rmhc.emitWith(button, navigateEvent, { direction: direction });
        },
        buttonBehaviours: $_9vyb2vw4jd24rmen.derive([Disabling.config({
            disableClass: $_4i0vdoz1jd24rmoo.resolve('toolbar-navigation-disabled'),
            disabled: !enabled
          })])
      });
    };
    var reposition = function (dialog, message) {
      $_56vfpvzmjd24rmql.descendant(dialog.element(), '.' + $_4i0vdoz1jd24rmoo.resolve('serialised-dialog-chain')).each(function (parent) {
        $_ayz4w9zsjd24rmr3.set(parent, 'left', -spec.state.currentScreen.get() * message.width + 'px');
      });
    };
    var navigate = function (dialog, direction) {
      var screens = $_dew4q4zkjd24rmqh.descendants(dialog.element(), '.' + $_4i0vdoz1jd24rmoo.resolve('serialised-dialog-screen'));
      $_56vfpvzmjd24rmql.descendant(dialog.element(), '.' + $_4i0vdoz1jd24rmoo.resolve('serialised-dialog-chain')).each(function (parent) {
        if (spec.state.currentScreen.get() + direction >= 0 && spec.state.currentScreen.get() + direction < screens.length) {
          $_ayz4w9zsjd24rmr3.getRaw(parent, 'left').each(function (left) {
            var currentLeft = parseInt(left, 10);
            var w = $_cnk9kc117jd24rmxv.get(screens[0]);
            $_ayz4w9zsjd24rmr3.set(parent, 'left', currentLeft - direction * w + 'px');
          });
          spec.state.currentScreen.set(spec.state.currentScreen.get() + direction);
        }
      });
    };
    var focusInput = function (dialog) {
      var inputs = $_dew4q4zkjd24rmqh.descendants(dialog.element(), 'input');
      var optInput = $_asi680wajd24rmfv.from(inputs[spec.state.currentScreen.get()]);
      optInput.each(function (input) {
        dialog.getSystem().getByDom(input).each(function (inputComp) {
          $_eljod2wvjd24rmhc.dispatchFocus(dialog, inputComp.element());
        });
      });
      var dotitems = memDots.get(dialog);
      Highlighting.highlightAt(dotitems, spec.state.currentScreen.get());
    };
    var resetState = function () {
      spec.state.currentScreen.set(0);
      spec.state.dialogSwipeState.clear();
    };
    var memForm = $_c9gmcp11ejd24rmyr.record($_ddvcd1129jd24rn22.sketch(function (parts) {
      return {
        dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-serialised-dialog"></div>'),
        components: [Container.sketch({
            dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-serialised-dialog-chain" style="left: 0px; position: absolute;"></div>'),
            components: $_3vsestw9jd24rmfo.map(spec.fields, function (field, i) {
              return i <= spec.maxFieldIndex ? Container.sketch({
                dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-serialised-dialog-screen"></div>'),
                components: $_3vsestw9jd24rmfo.flatten([
                  [navigationButton(-1, 'previous', i > 0)],
                  [parts.field(field.name, field.spec)],
                  [navigationButton(+1, 'next', i < spec.maxFieldIndex)]
                ])
              }) : parts.field(field.name, field.spec);
            })
          })],
        formBehaviours: $_9vyb2vw4jd24rmen.derive([
          $_xzzzbz0jd24rmol.orientation(function (dialog, message) {
            reposition(dialog, message);
          }),
          Keying.config({
            mode: 'special',
            focusIn: function (dialog) {
              focusInput(dialog);
            },
            onTab: function (dialog) {
              navigate(dialog, +1);
              return $_asi680wajd24rmfv.some(true);
            },
            onShiftTab: function (dialog) {
              navigate(dialog, -1);
              return $_asi680wajd24rmfv.some(true);
            }
          }),
          $_dzt99a11sjd24rn0a.config(formAdhocEvents, [
            $_g9t26pw6jd24rmfc.runOnAttached(function (dialog, simulatedEvent) {
              resetState();
              var dotitems = memDots.get(dialog);
              Highlighting.highlightFirst(dotitems);
              spec.getInitialValue(dialog).each(function (v) {
                me.setValue(dialog, v);
              });
            }),
            $_g9t26pw6jd24rmfc.runOnExecute(spec.onExecute),
            $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.transitionend(), function (dialog, simulatedEvent) {
              if (simulatedEvent.event().raw().propertyName === 'left') {
                focusInput(dialog);
              }
            }),
            $_g9t26pw6jd24rmfc.run(navigateEvent, function (dialog, simulatedEvent) {
              var direction = simulatedEvent.event().direction();
              navigate(dialog, direction);
            })
          ])
        ])
      };
    }));
    var memDots = $_c9gmcp11ejd24rmyr.record({
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-dot-container"></div>'),
      behaviours: $_9vyb2vw4jd24rmen.derive([Highlighting.config({
          highlightClass: $_4i0vdoz1jd24rmoo.resolve('dot-active'),
          itemClass: $_4i0vdoz1jd24rmoo.resolve('dot-item')
        })]),
      components: $_3vsestw9jd24rmfo.bind(spec.fields, function (_f, i) {
        return i <= spec.maxFieldIndex ? [$_ejtuy110qjd24rmvy.spec('<div class="${prefix}-dot-item ${prefix}-icon-full-dot ${prefix}-icon"></div>')] : [];
      })
    });
    return {
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-serializer-wrapper"></div>'),
      components: [
        memForm.asSpec(),
        memDots.asSpec()
      ],
      behaviours: $_9vyb2vw4jd24rmen.derive([
        Keying.config({
          mode: 'special',
          focusIn: function (wrapper) {
            var form = memForm.get(wrapper);
            Keying.focusIn(form);
          }
        }),
        $_dzt99a11sjd24rn0a.config(wrapperAdhocEvents, [
          $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchstart(), function (wrapper, simulatedEvent) {
            spec.state.dialogSwipeState.set($_3l3gsw12bjd24rn2b.init(simulatedEvent.event().raw().touches[0].clientX));
          }),
          $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchmove(), function (wrapper, simulatedEvent) {
            spec.state.dialogSwipeState.on(function (state) {
              simulatedEvent.event().prevent();
              spec.state.dialogSwipeState.set($_3l3gsw12bjd24rn2b.move(state, simulatedEvent.event().raw().touches[0].clientX));
            });
          }),
          $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.touchend(), function (wrapper) {
            spec.state.dialogSwipeState.on(function (state) {
              var dialog = memForm.get(wrapper);
              var direction = -1 * $_3l3gsw12bjd24rn2b.complete(state);
              navigate(dialog, direction);
            });
          })
        ])
      ])
    };
  };
  var $_gfnqm6124jd24rn14 = { sketch: sketch$7 };

  var platform$1 = $_1616jcwgjd24rmg9.detect();
  var preserve$1 = function (f, editor) {
    var rng = editor.selection.getRng();
    f();
    editor.selection.setRng(rng);
  };
  var forAndroid = function (editor, f) {
    var wrapper = platform$1.os.isAndroid() ? preserve$1 : $_aoet5bwbjd24rmfz.apply;
    wrapper(f, editor);
  };
  var $_b8s31212cjd24rn2c = { forAndroid: forAndroid };

  var getGroups = $_4myblwwhjd24rmgb.cached(function (realm, editor) {
    return [{
        label: 'the link group',
        items: [$_gfnqm6124jd24rn14.sketch({
            fields: [
              $_48n3np11rjd24rmzu.field('url', 'Type or paste URL'),
              $_48n3np11rjd24rmzu.field('text', 'Link text'),
              $_48n3np11rjd24rmzu.field('title', 'Link title'),
              $_48n3np11rjd24rmzu.field('target', 'Link target'),
              $_48n3np11rjd24rmzu.hidden('link')
            ],
            maxFieldIndex: [
              'url',
              'text',
              'title',
              'target'
            ].length - 1,
            getInitialValue: function () {
              return $_asi680wajd24rmfv.some($_ezht9c11pjd24rmzm.getInfo(editor));
            },
            onExecute: function (dialog) {
              var info = me.getValue(dialog);
              $_ezht9c11pjd24rmzm.applyInfo(editor, info);
              realm.restoreToolbar();
              editor.focus();
            }
          })]
      }];
  });
  var sketch$8 = function (realm, editor) {
    return $_2byzekz2jd24rmop.forToolbarStateAction(editor, 'link', 'link', function () {
      var groups = getGroups(realm, editor);
      realm.setContextToolbar(groups);
      $_b8s31212cjd24rn2c.forAndroid(editor, function () {
        realm.focusToolbar();
      });
      $_ezht9c11pjd24rmzm.query(editor).each(function (link) {
        editor.selection.select(link.dom());
      });
    });
  };
  var $_7qo1pl11ojd24rmzi = { sketch: sketch$8 };

  var DefaultStyleFormats = [
    {
      title: 'Headings',
      items: [
        {
          title: 'Heading 1',
          format: 'h1'
        },
        {
          title: 'Heading 2',
          format: 'h2'
        },
        {
          title: 'Heading 3',
          format: 'h3'
        },
        {
          title: 'Heading 4',
          format: 'h4'
        },
        {
          title: 'Heading 5',
          format: 'h5'
        },
        {
          title: 'Heading 6',
          format: 'h6'
        }
      ]
    },
    {
      title: 'Inline',
      items: [
        {
          title: 'Bold',
          icon: 'bold',
          format: 'bold'
        },
        {
          title: 'Italic',
          icon: 'italic',
          format: 'italic'
        },
        {
          title: 'Underline',
          icon: 'underline',
          format: 'underline'
        },
        {
          title: 'Strikethrough',
          icon: 'strikethrough',
          format: 'strikethrough'
        },
        {
          title: 'Superscript',
          icon: 'superscript',
          format: 'superscript'
        },
        {
          title: 'Subscript',
          icon: 'subscript',
          format: 'subscript'
        },
        {
          title: 'Code',
          icon: 'code',
          format: 'code'
        }
      ]
    },
    {
      title: 'Blocks',
      items: [
        {
          title: 'Paragraph',
          format: 'p'
        },
        {
          title: 'Blockquote',
          format: 'blockquote'
        },
        {
          title: 'Div',
          format: 'div'
        },
        {
          title: 'Pre',
          format: 'pre'
        }
      ]
    },
    {
      title: 'Alignment',
      items: [
        {
          title: 'Left',
          icon: 'alignleft',
          format: 'alignleft'
        },
        {
          title: 'Center',
          icon: 'aligncenter',
          format: 'aligncenter'
        },
        {
          title: 'Right',
          icon: 'alignright',
          format: 'alignright'
        },
        {
          title: 'Justify',
          icon: 'alignjustify',
          format: 'alignjustify'
        }
      ]
    }
  ];

  var findRoute = function (component, transConfig, transState, route) {
    return $_bzffwwx6jd24rmit.readOptFrom(transConfig.routes(), route.start()).map($_aoet5bwbjd24rmfz.apply).bind(function (sConfig) {
      return $_bzffwwx6jd24rmit.readOptFrom(sConfig, route.destination()).map($_aoet5bwbjd24rmfz.apply);
    });
  };
  var getTransition = function (comp, transConfig, transState) {
    var route = getCurrentRoute(comp, transConfig, transState);
    return route.bind(function (r) {
      return getTransitionOf(comp, transConfig, transState, r);
    });
  };
  var getTransitionOf = function (comp, transConfig, transState, route) {
    return findRoute(comp, transConfig, transState, route).bind(function (r) {
      return r.transition().map(function (t) {
        return {
          transition: $_aoet5bwbjd24rmfz.constant(t),
          route: $_aoet5bwbjd24rmfz.constant(r)
        };
      });
    });
  };
  var disableTransition = function (comp, transConfig, transState) {
    getTransition(comp, transConfig, transState).each(function (routeTransition) {
      var t = routeTransition.transition();
      $_c8qis7xujd24rmks.remove(comp.element(), t.transitionClass());
      $_dxjq1vxwjd24rmkv.remove(comp.element(), transConfig.destinationAttr());
    });
  };
  var getNewRoute = function (comp, transConfig, transState, destination) {
    return {
      start: $_aoet5bwbjd24rmfz.constant($_dxjq1vxwjd24rmkv.get(comp.element(), transConfig.stateAttr())),
      destination: $_aoet5bwbjd24rmfz.constant(destination)
    };
  };
  var getCurrentRoute = function (comp, transConfig, transState) {
    var el = comp.element();
    return $_dxjq1vxwjd24rmkv.has(el, transConfig.destinationAttr()) ? $_asi680wajd24rmfv.some({
      start: $_aoet5bwbjd24rmfz.constant($_dxjq1vxwjd24rmkv.get(comp.element(), transConfig.stateAttr())),
      destination: $_aoet5bwbjd24rmfz.constant($_dxjq1vxwjd24rmkv.get(comp.element(), transConfig.destinationAttr()))
    }) : $_asi680wajd24rmfv.none();
  };
  var jumpTo = function (comp, transConfig, transState, destination) {
    disableTransition(comp, transConfig, transState);
    if ($_dxjq1vxwjd24rmkv.has(comp.element(), transConfig.stateAttr()) && $_dxjq1vxwjd24rmkv.get(comp.element(), transConfig.stateAttr()) !== destination)
      transConfig.onFinish()(comp, destination);
    $_dxjq1vxwjd24rmkv.set(comp.element(), transConfig.stateAttr(), destination);
  };
  var fasttrack = function (comp, transConfig, transState, destination) {
    if ($_dxjq1vxwjd24rmkv.has(comp.element(), transConfig.destinationAttr())) {
      $_dxjq1vxwjd24rmkv.set(comp.element(), transConfig.stateAttr(), $_dxjq1vxwjd24rmkv.get(comp.element(), transConfig.destinationAttr()));
      $_dxjq1vxwjd24rmkv.remove(comp.element(), transConfig.destinationAttr());
    }
  };
  var progressTo = function (comp, transConfig, transState, destination) {
    fasttrack(comp, transConfig, transState, destination);
    var route = getNewRoute(comp, transConfig, transState, destination);
    getTransitionOf(comp, transConfig, transState, route).fold(function () {
      jumpTo(comp, transConfig, transState, destination);
    }, function (routeTransition) {
      disableTransition(comp, transConfig, transState);
      var t = routeTransition.transition();
      $_c8qis7xujd24rmks.add(comp.element(), t.transitionClass());
      $_dxjq1vxwjd24rmkv.set(comp.element(), transConfig.destinationAttr(), destination);
    });
  };
  var getState = function (comp, transConfig, transState) {
    var e = comp.element();
    return $_dxjq1vxwjd24rmkv.has(e, transConfig.stateAttr()) ? $_asi680wajd24rmfv.some($_dxjq1vxwjd24rmkv.get(e, transConfig.stateAttr())) : $_asi680wajd24rmfv.none();
  };
  var $_c0289312ijd24rn3d = {
    findRoute: findRoute,
    disableTransition: disableTransition,
    getCurrentRoute: getCurrentRoute,
    jumpTo: jumpTo,
    progressTo: progressTo,
    getState: getState
  };

  var events$8 = function (transConfig, transState) {
    return $_g9t26pw6jd24rmfc.derive([
      $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.transitionend(), function (component, simulatedEvent) {
        var raw = simulatedEvent.event().raw();
        $_c0289312ijd24rn3d.getCurrentRoute(component, transConfig, transState).each(function (route) {
          $_c0289312ijd24rn3d.findRoute(component, transConfig, transState, route).each(function (rInfo) {
            rInfo.transition().each(function (rTransition) {
              if (raw.propertyName === rTransition.property()) {
                $_c0289312ijd24rn3d.jumpTo(component, transConfig, transState, route.destination());
                transConfig.onTransition()(component, route);
              }
            });
          });
        });
      }),
      $_g9t26pw6jd24rmfc.runOnAttached(function (comp, se) {
        $_c0289312ijd24rn3d.jumpTo(comp, transConfig, transState, transConfig.initialState());
      })
    ]);
  };
  var $_9m2i7h12hjd24rn3b = { events: events$8 };

  var TransitionSchema = [
    $_w7f5sx2jd24rmi1.defaulted('destinationAttr', 'data-transitioning-destination'),
    $_w7f5sx2jd24rmi1.defaulted('stateAttr', 'data-transitioning-state'),
    $_w7f5sx2jd24rmi1.strict('initialState'),
    $_62w1klytjd24rmnt.onHandler('onTransition'),
    $_62w1klytjd24rmnt.onHandler('onFinish'),
    $_w7f5sx2jd24rmi1.strictOf('routes', $_bdtykhxhjd24rmjn.setOf($_b2qdiox8jd24rmj0.value, $_bdtykhxhjd24rmjn.setOf($_b2qdiox8jd24rmj0.value, $_bdtykhxhjd24rmjn.objOfOnly([$_w7f5sx2jd24rmi1.optionObjOfOnly('transition', [
        $_w7f5sx2jd24rmi1.strict('property'),
        $_w7f5sx2jd24rmi1.strict('transitionClass')
      ])]))))
  ];

  var createRoutes = function (routes) {
    var r = {};
    $_2hhb0ax0jd24rmhp.each(routes, function (v, k) {
      var waypoints = k.split('<->');
      r[waypoints[0]] = $_bzffwwx6jd24rmit.wrap(waypoints[1], v);
      r[waypoints[1]] = $_bzffwwx6jd24rmit.wrap(waypoints[0], v);
    });
    return r;
  };
  var createBistate = function (first, second, transitions) {
    return $_bzffwwx6jd24rmit.wrapAll([
      {
        key: first,
        value: $_bzffwwx6jd24rmit.wrap(second, transitions)
      },
      {
        key: second,
        value: $_bzffwwx6jd24rmit.wrap(first, transitions)
      }
    ]);
  };
  var createTristate = function (first, second, third, transitions) {
    return $_bzffwwx6jd24rmit.wrapAll([
      {
        key: first,
        value: $_bzffwwx6jd24rmit.wrapAll([
          {
            key: second,
            value: transitions
          },
          {
            key: third,
            value: transitions
          }
        ])
      },
      {
        key: second,
        value: $_bzffwwx6jd24rmit.wrapAll([
          {
            key: first,
            value: transitions
          },
          {
            key: third,
            value: transitions
          }
        ])
      },
      {
        key: third,
        value: $_bzffwwx6jd24rmit.wrapAll([
          {
            key: first,
            value: transitions
          },
          {
            key: second,
            value: transitions
          }
        ])
      }
    ]);
  };
  var Transitioning = $_9vyb2vw4jd24rmen.create({
    fields: TransitionSchema,
    name: 'transitioning',
    active: $_9m2i7h12hjd24rn3b,
    apis: $_c0289312ijd24rn3d,
    extra: {
      createRoutes: createRoutes,
      createBistate: createBistate,
      createTristate: createTristate
    }
  });

  var generateFrom = function (spec, all) {
    var schema = $_3vsestw9jd24rmfo.map(all, function (a) {
      return $_w7f5sx2jd24rmi1.field(a.name(), a.name(), $_a33fuhx3jd24rmi5.asOption(), $_bdtykhxhjd24rmjn.objOf([
        $_w7f5sx2jd24rmi1.strict('config'),
        $_w7f5sx2jd24rmi1.defaulted('state', $_6n4e0bxqjd24rmkk)
      ]));
    });
    var validated = $_bdtykhxhjd24rmjn.asStruct('component.behaviours', $_bdtykhxhjd24rmjn.objOf(schema), spec.behaviours).fold(function (errInfo) {
      throw new Error($_bdtykhxhjd24rmjn.formatError(errInfo) + '\nComplete spec:\n' + $_eur0xxfjd24rmjj.stringify(spec, null, 2));
    }, $_aoet5bwbjd24rmfz.identity);
    return {
      list: all,
      data: $_2hhb0ax0jd24rmhp.map(validated, function (blobOptionThunk) {
        var blobOption = blobOptionThunk();
        return $_aoet5bwbjd24rmfz.constant(blobOption.map(function (blob) {
          return {
            config: blob.config(),
            state: blob.state().init(blob.config())
          };
        }));
      })
    };
  };
  var getBehaviours = function (bData) {
    return bData.list;
  };
  var getData = function (bData) {
    return bData.data;
  };
  var $_73gvsw12njd24rn4h = {
    generateFrom: generateFrom,
    getBehaviours: getBehaviours,
    getData: getData
  };

  var getBehaviours$1 = function (spec) {
    var behaviours = $_bzffwwx6jd24rmit.readOptFrom(spec, 'behaviours').getOr({});
    var keys = $_3vsestw9jd24rmfo.filter($_2hhb0ax0jd24rmhp.keys(behaviours), function (k) {
      return behaviours[k] !== undefined;
    });
    return $_3vsestw9jd24rmfo.map(keys, function (k) {
      return spec.behaviours[k].me;
    });
  };
  var generateFrom$1 = function (spec, all) {
    return $_73gvsw12njd24rn4h.generateFrom(spec, all);
  };
  var generate$4 = function (spec) {
    var all = getBehaviours$1(spec);
    return generateFrom$1(spec, all);
  };
  var $_eix5ec12mjd24rn4d = {
    generate: generate$4,
    generateFrom: generateFrom$1
  };

  var ComponentApi = $_bayyntxsjd24rmkn.exactly([
    'getSystem',
    'config',
    'hasConfigured',
    'spec',
    'connect',
    'disconnect',
    'element',
    'syncComponents',
    'readState',
    'components',
    'events'
  ]);

  var SystemApi = $_bayyntxsjd24rmkn.exactly([
    'debugInfo',
    'triggerFocus',
    'triggerEvent',
    'triggerEscape',
    'addToWorld',
    'removeFromWorld',
    'addToGui',
    'removeFromGui',
    'build',
    'getByUid',
    'getByDom',
    'broadcast',
    'broadcastOn'
  ]);

  function NoContextApi (getComp) {
    var fail = function (event) {
      return function () {
        throw new Error('The component must be in a context to send: ' + event + '\n' + $_3r5kv7y9jd24rmmb.element(getComp().element()) + ' is not in context.');
      };
    };
    return SystemApi({
      debugInfo: $_aoet5bwbjd24rmfz.constant('fake'),
      triggerEvent: fail('triggerEvent'),
      triggerFocus: fail('triggerFocus'),
      triggerEscape: fail('triggerEscape'),
      build: fail('build'),
      addToWorld: fail('addToWorld'),
      removeFromWorld: fail('removeFromWorld'),
      addToGui: fail('addToGui'),
      removeFromGui: fail('removeFromGui'),
      getByUid: fail('getByUid'),
      getByDom: fail('getByDom'),
      broadcast: fail('broadcast'),
      broadcastOn: fail('broadcastOn')
    });
  }

  var byInnerKey = function (data, tuple) {
    var r = {};
    $_2hhb0ax0jd24rmhp.each(data, function (detail, key) {
      $_2hhb0ax0jd24rmhp.each(detail, function (value, indexKey) {
        var chain = $_bzffwwx6jd24rmit.readOr(indexKey, [])(r);
        r[indexKey] = chain.concat([tuple(key, value)]);
      });
    });
    return r;
  };
  var $_b7alqa12sjd24rn58 = { byInnerKey: byInnerKey };

  var behaviourDom = function (name, modification) {
    return {
      name: $_aoet5bwbjd24rmfz.constant(name),
      modification: modification
    };
  };
  var concat = function (chain, aspect) {
    var values = $_3vsestw9jd24rmfo.bind(chain, function (c) {
      return c.modification().getOr([]);
    });
    return $_b2qdiox8jd24rmj0.value($_bzffwwx6jd24rmit.wrap(aspect, values));
  };
  var onlyOne = function (chain, aspect, order) {
    if (chain.length > 1)
      return $_b2qdiox8jd24rmj0.error('Multiple behaviours have tried to change DOM "' + aspect + '". The guilty behaviours are: ' + $_eur0xxfjd24rmjj.stringify($_3vsestw9jd24rmfo.map(chain, function (b) {
        return b.name();
      })) + '. At this stage, this ' + 'is not supported. Future releases might provide strategies for resolving this.');
    else if (chain.length === 0)
      return $_b2qdiox8jd24rmj0.value({});
    else
      return $_b2qdiox8jd24rmj0.value(chain[0].modification().fold(function () {
        return {};
      }, function (m) {
        return $_bzffwwx6jd24rmit.wrap(aspect, m);
      }));
  };
  var duplicate = function (aspect, k, obj, behaviours) {
    return $_b2qdiox8jd24rmj0.error('Mulitple behaviours have tried to change the _' + k + '_ "' + aspect + '"' + '. The guilty behaviours are: ' + $_eur0xxfjd24rmjj.stringify($_3vsestw9jd24rmfo.bind(behaviours, function (b) {
      return b.modification().getOr({})[k] !== undefined ? [b.name()] : [];
    }), null, 2) + '. This is not currently supported.');
  };
  var safeMerge = function (chain, aspect) {
    var y = $_3vsestw9jd24rmfo.foldl(chain, function (acc, c) {
      var obj = c.modification().getOr({});
      return acc.bind(function (accRest) {
        var parts = $_2hhb0ax0jd24rmhp.mapToArray(obj, function (v, k) {
          return accRest[k] !== undefined ? duplicate(aspect, k, obj, chain) : $_b2qdiox8jd24rmj0.value($_bzffwwx6jd24rmit.wrap(k, v));
        });
        return $_bzffwwx6jd24rmit.consolidate(parts, accRest);
      });
    }, $_b2qdiox8jd24rmj0.value({}));
    return y.map(function (yValue) {
      return $_bzffwwx6jd24rmit.wrap(aspect, yValue);
    });
  };
  var mergeTypes = {
    classes: concat,
    attributes: safeMerge,
    styles: safeMerge,
    domChildren: onlyOne,
    defChildren: onlyOne,
    innerHtml: onlyOne,
    value: onlyOne
  };
  var combine$1 = function (info, baseMod, behaviours, base) {
    var behaviourDoms = $_4x4s83wyjd24rmhm.deepMerge({}, baseMod);
    $_3vsestw9jd24rmfo.each(behaviours, function (behaviour) {
      behaviourDoms[behaviour.name()] = behaviour.exhibit(info, base);
    });
    var byAspect = $_b7alqa12sjd24rn58.byInnerKey(behaviourDoms, behaviourDom);
    var usedAspect = $_2hhb0ax0jd24rmhp.map(byAspect, function (values, aspect) {
      return $_3vsestw9jd24rmfo.bind(values, function (value) {
        return value.modification().fold(function () {
          return [];
        }, function (v) {
          return [value];
        });
      });
    });
    var modifications = $_2hhb0ax0jd24rmhp.mapToArray(usedAspect, function (values, aspect) {
      return $_bzffwwx6jd24rmit.readOptFrom(mergeTypes, aspect).fold(function () {
        return $_b2qdiox8jd24rmj0.error('Unknown field type: ' + aspect);
      }, function (merger) {
        return merger(values, aspect);
      });
    });
    var consolidated = $_bzffwwx6jd24rmit.consolidate(modifications, {});
    return consolidated.map($_g169haxkjd24rmjy.nu);
  };
  var $_2dnxnw12rjd24rn4z = { combine: combine$1 };

  var sortKeys = function (label, keyName, array, order) {
    var sliced = array.slice(0);
    try {
      var sorted = sliced.sort(function (a, b) {
        var aKey = a[keyName]();
        var bKey = b[keyName]();
        var aIndex = order.indexOf(aKey);
        var bIndex = order.indexOf(bKey);
        if (aIndex === -1)
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + aKey + '.\nOrder specified: ' + $_eur0xxfjd24rmjj.stringify(order, null, 2));
        if (bIndex === -1)
          throw new Error('The ordering for ' + label + ' does not have an entry for ' + bKey + '.\nOrder specified: ' + $_eur0xxfjd24rmjj.stringify(order, null, 2));
        if (aIndex < bIndex)
          return -1;
        else if (bIndex < aIndex)
          return 1;
        else
          return 0;
      });
      return $_b2qdiox8jd24rmj0.value(sorted);
    } catch (err) {
      return $_b2qdiox8jd24rmj0.error([err]);
    }
  };
  var $_bpzo9v12ujd24rn5j = { sortKeys: sortKeys };

  var nu$7 = function (handler, purpose) {
    return {
      handler: handler,
      purpose: $_aoet5bwbjd24rmfz.constant(purpose)
    };
  };
  var curryArgs = function (descHandler, extraArgs) {
    return {
      handler: $_aoet5bwbjd24rmfz.curry.apply(undefined, [descHandler.handler].concat(extraArgs)),
      purpose: descHandler.purpose
    };
  };
  var getHandler = function (descHandler) {
    return descHandler.handler;
  };
  var $_5il8ci12vjd24rn5n = {
    nu: nu$7,
    curryArgs: curryArgs,
    getHandler: getHandler
  };

  var behaviourTuple = function (name, handler) {
    return {
      name: $_aoet5bwbjd24rmfz.constant(name),
      handler: $_aoet5bwbjd24rmfz.constant(handler)
    };
  };
  var nameToHandlers = function (behaviours, info) {
    var r = {};
    $_3vsestw9jd24rmfo.each(behaviours, function (behaviour) {
      r[behaviour.name()] = behaviour.handlers(info);
    });
    return r;
  };
  var groupByEvents = function (info, behaviours, base) {
    var behaviourEvents = $_4x4s83wyjd24rmhm.deepMerge(base, nameToHandlers(behaviours, info));
    return $_b7alqa12sjd24rn58.byInnerKey(behaviourEvents, behaviourTuple);
  };
  var combine$2 = function (info, eventOrder, behaviours, base) {
    var byEventName = groupByEvents(info, behaviours, base);
    return combineGroups(byEventName, eventOrder);
  };
  var assemble = function (rawHandler) {
    var handler = $_47bwnvx1jd24rmhs.read(rawHandler);
    return function (component, simulatedEvent) {
      var args = Array.prototype.slice.call(arguments, 0);
      if (handler.abort.apply(undefined, args)) {
        simulatedEvent.stop();
      } else if (handler.can.apply(undefined, args)) {
        handler.run.apply(undefined, args);
      }
    };
  };
  var missingOrderError = function (eventName, tuples) {
    return new $_b2qdiox8jd24rmj0.error(['The event (' + eventName + ') has more than one behaviour that listens to it.\nWhen this occurs, you must ' + 'specify an event ordering for the behaviours in your spec (e.g. [ "listing", "toggling" ]).\nThe behaviours that ' + 'can trigger it are: ' + $_eur0xxfjd24rmjj.stringify($_3vsestw9jd24rmfo.map(tuples, function (c) {
        return c.name();
      }), null, 2)]);
  };
  var fuse$1 = function (tuples, eventOrder, eventName) {
    var order = eventOrder[eventName];
    if (!order)
      return missingOrderError(eventName, tuples);
    else
      return $_bpzo9v12ujd24rn5j.sortKeys('Event: ' + eventName, 'name', tuples, order).map(function (sortedTuples) {
        var handlers = $_3vsestw9jd24rmfo.map(sortedTuples, function (tuple) {
          return tuple.handler();
        });
        return $_47bwnvx1jd24rmhs.fuse(handlers);
      });
  };
  var combineGroups = function (byEventName, eventOrder) {
    var r = $_2hhb0ax0jd24rmhp.mapToArray(byEventName, function (tuples, eventName) {
      var combined = tuples.length === 1 ? $_b2qdiox8jd24rmj0.value(tuples[0].handler()) : fuse$1(tuples, eventOrder, eventName);
      return combined.map(function (handler) {
        var assembled = assemble(handler);
        var purpose = tuples.length > 1 ? $_3vsestw9jd24rmfo.filter(eventOrder, function (o) {
          return $_3vsestw9jd24rmfo.contains(tuples, function (t) {
            return t.name() === o;
          });
        }).join(' > ') : tuples[0].name();
        return $_bzffwwx6jd24rmit.wrap(eventName, $_5il8ci12vjd24rn5n.nu(assembled, purpose));
      });
    });
    return $_bzffwwx6jd24rmit.consolidate(r, {});
  };
  var $_dtlume12tjd24rn5b = { combine: combine$2 };

  var toInfo = function (spec) {
    return $_bdtykhxhjd24rmjn.asStruct('custom.definition', $_bdtykhxhjd24rmjn.objOfOnly([
      $_w7f5sx2jd24rmi1.field('dom', 'dom', $_a33fuhx3jd24rmi5.strict(), $_bdtykhxhjd24rmjn.objOfOnly([
        $_w7f5sx2jd24rmi1.strict('tag'),
        $_w7f5sx2jd24rmi1.defaulted('styles', {}),
        $_w7f5sx2jd24rmi1.defaulted('classes', []),
        $_w7f5sx2jd24rmi1.defaulted('attributes', {}),
        $_w7f5sx2jd24rmi1.option('value'),
        $_w7f5sx2jd24rmi1.option('innerHtml')
      ])),
      $_w7f5sx2jd24rmi1.strict('components'),
      $_w7f5sx2jd24rmi1.strict('uid'),
      $_w7f5sx2jd24rmi1.defaulted('events', {}),
      $_w7f5sx2jd24rmi1.defaulted('apis', $_aoet5bwbjd24rmfz.constant({})),
      $_w7f5sx2jd24rmi1.field('eventOrder', 'eventOrder', $_a33fuhx3jd24rmi5.mergeWith({
        'alloy.execute': [
          'disabling',
          'alloy.base.behaviour',
          'toggling'
        ],
        'alloy.focus': [
          'alloy.base.behaviour',
          'focusing',
          'keying'
        ],
        'alloy.system.init': [
          'alloy.base.behaviour',
          'disabling',
          'toggling',
          'representing'
        ],
        'input': [
          'alloy.base.behaviour',
          'representing',
          'streaming',
          'invalidating'
        ],
        'alloy.system.detached': [
          'alloy.base.behaviour',
          'representing'
        ]
      }), $_bdtykhxhjd24rmjn.anyValue()),
      $_w7f5sx2jd24rmi1.option('domModification'),
      $_62w1klytjd24rmnt.snapshot('originalSpec'),
      $_w7f5sx2jd24rmi1.defaulted('debug.sketcher', 'unknown')
    ]), spec);
  };
  var getUid = function (info) {
    return $_bzffwwx6jd24rmit.wrap($_9i150y10njd24rmvi.idAttr(), info.uid());
  };
  var toDefinition = function (info) {
    var base = {
      tag: info.dom().tag(),
      classes: info.dom().classes(),
      attributes: $_4x4s83wyjd24rmhm.deepMerge(getUid(info), info.dom().attributes()),
      styles: info.dom().styles(),
      domChildren: $_3vsestw9jd24rmfo.map(info.components(), function (comp) {
        return comp.element();
      })
    };
    return $_3hxy2nxljd24rmka.nu($_4x4s83wyjd24rmhm.deepMerge(base, info.dom().innerHtml().map(function (h) {
      return $_bzffwwx6jd24rmit.wrap('innerHtml', h);
    }).getOr({}), info.dom().value().map(function (h) {
      return $_bzffwwx6jd24rmit.wrap('value', h);
    }).getOr({})));
  };
  var toModification = function (info) {
    return info.domModification().fold(function () {
      return $_g169haxkjd24rmjy.nu({});
    }, $_g169haxkjd24rmjy.nu);
  };
  var toApis = function (info) {
    return info.apis();
  };
  var toEvents = function (info) {
    return info.events();
  };
  var $_fkd5ia12wjd24rn5p = {
    toInfo: toInfo,
    toDefinition: toDefinition,
    toModification: toModification,
    toApis: toApis,
    toEvents: toEvents
  };

  var add$3 = function (element, classes) {
    $_3vsestw9jd24rmfo.each(classes, function (x) {
      $_c8qis7xujd24rmks.add(element, x);
    });
  };
  var remove$6 = function (element, classes) {
    $_3vsestw9jd24rmfo.each(classes, function (x) {
      $_c8qis7xujd24rmks.remove(element, x);
    });
  };
  var toggle$3 = function (element, classes) {
    $_3vsestw9jd24rmfo.each(classes, function (x) {
      $_c8qis7xujd24rmks.toggle(element, x);
    });
  };
  var hasAll = function (element, classes) {
    return $_3vsestw9jd24rmfo.forall(classes, function (clazz) {
      return $_c8qis7xujd24rmks.has(element, clazz);
    });
  };
  var hasAny = function (element, classes) {
    return $_3vsestw9jd24rmfo.exists(classes, function (clazz) {
      return $_c8qis7xujd24rmks.has(element, clazz);
    });
  };
  var getNative = function (element) {
    var classList = element.dom().classList;
    var r = new Array(classList.length);
    for (var i = 0; i < classList.length; i++) {
      r[i] = classList.item(i);
    }
    return r;
  };
  var get$10 = function (element) {
    return $_26wgjsxyjd24rml1.supports(element) ? getNative(element) : $_26wgjsxyjd24rml1.get(element);
  };
  var $_7u42ke12yjd24rn66 = {
    add: add$3,
    remove: remove$6,
    toggle: toggle$3,
    hasAll: hasAll,
    hasAny: hasAny,
    get: get$10
  };

  var getChildren = function (definition) {
    if (definition.domChildren().isSome() && definition.defChildren().isSome()) {
      throw new Error('Cannot specify children and child specs! Must be one or the other.\nDef: ' + $_3hxy2nxljd24rmka.defToStr(definition));
    } else {
      return definition.domChildren().fold(function () {
        var defChildren = definition.defChildren().getOr([]);
        return $_3vsestw9jd24rmfo.map(defChildren, renderDef);
      }, function (domChildren) {
        return domChildren;
      });
    }
  };
  var renderToDom = function (definition) {
    var subject = $_ei6gqxwtjd24rmh8.fromTag(definition.tag());
    $_dxjq1vxwjd24rmkv.setAll(subject, definition.attributes().getOr({}));
    $_7u42ke12yjd24rn66.add(subject, definition.classes().getOr([]));
    $_ayz4w9zsjd24rmr3.setAll(subject, definition.styles().getOr({}));
    $_bewbr4ybjd24rmmf.set(subject, definition.innerHtml().getOr(''));
    var children = getChildren(definition);
    $_5ijnivy6jd24rmlw.append(subject, children);
    definition.value().each(function (value) {
      $_8ly6ch120jd24rn0x.set(subject, value);
    });
    return subject;
  };
  var renderDef = function (spec) {
    var definition = $_3hxy2nxljd24rmka.nu(spec);
    return renderToDom(definition);
  };
  var $_9mwex912xjd24rn5y = { renderToDom: renderToDom };

  var build = function (spec) {
    var getMe = function () {
      return me;
    };
    var systemApi = Cell(NoContextApi(getMe));
    var info = $_bdtykhxhjd24rmjn.getOrDie($_fkd5ia12wjd24rn5p.toInfo($_4x4s83wyjd24rmhm.deepMerge(spec, { behaviours: undefined })));
    var bBlob = $_eix5ec12mjd24rn4d.generate(spec);
    var bList = $_73gvsw12njd24rn4h.getBehaviours(bBlob);
    var bData = $_73gvsw12njd24rn4h.getData(bBlob);
    var definition = $_fkd5ia12wjd24rn5p.toDefinition(info);
    var baseModification = { 'alloy.base.modification': $_fkd5ia12wjd24rn5p.toModification(info) };
    var modification = $_2dnxnw12rjd24rn4z.combine(bData, baseModification, bList, definition).getOrDie();
    var modDefinition = $_g169haxkjd24rmjy.merge(definition, modification);
    var item = $_9mwex912xjd24rn5y.renderToDom(modDefinition);
    var baseEvents = { 'alloy.base.behaviour': $_fkd5ia12wjd24rn5p.toEvents(info) };
    var events = $_dtlume12tjd24rn5b.combine(bData, info.eventOrder(), bList, baseEvents).getOrDie();
    var subcomponents = Cell(info.components());
    var connect = function (newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function () {
      systemApi.set(NoContextApi(getMe));
    };
    var syncComponents = function () {
      var children = $_5on3koy3jd24rmlg.children(item);
      var subs = $_3vsestw9jd24rmfo.bind(children, function (child) {
        return systemApi.get().getByDom(child).fold(function () {
          return [];
        }, function (c) {
          return [c];
        });
      });
      subcomponents.set(subs);
    };
    var config = function (behaviour) {
      if (behaviour === $_ch8g4910fjd24rmu1.apiConfig())
        return info.apis();
      var b = bData;
      var f = $_cbf8cdwzjd24rmhn.isFunction(b[behaviour.name()]) ? b[behaviour.name()] : function () {
        throw new Error('Could not find ' + behaviour.name() + ' in ' + $_eur0xxfjd24rmjj.stringify(spec, null, 2));
      };
      return f();
    };
    var hasConfigured = function (behaviour) {
      return $_cbf8cdwzjd24rmhn.isFunction(bData[behaviour.name()]);
    };
    var readState = function (behaviourName) {
      return bData[behaviourName]().map(function (b) {
        return b.state.readState();
      }).getOr('not enabled');
    };
    var me = ComponentApi({
      getSystem: systemApi.get,
      config: config,
      hasConfigured: hasConfigured,
      spec: $_aoet5bwbjd24rmfz.constant(spec),
      readState: readState,
      connect: connect,
      disconnect: disconnect,
      element: $_aoet5bwbjd24rmfz.constant(item),
      syncComponents: syncComponents,
      components: subcomponents.get,
      events: $_aoet5bwbjd24rmfz.constant(events)
    });
    return me;
  };
  var $_6sv2rd12ljd24rn43 = { build: build };

  var isRecursive = function (component, originator, target) {
    return $_237cqww8jd24rmfh.eq(originator, component.element()) && !$_237cqww8jd24rmfh.eq(originator, target);
  };
  var $_3ndc4l12zjd24rn6a = {
    events: $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.can($_9am11ywwjd24rmhg.focus(), function (component, simulatedEvent) {
        var originator = simulatedEvent.event().originator();
        var target = simulatedEvent.event().target();
        if (isRecursive(component, originator, target)) {
          console.warn($_9am11ywwjd24rmhg.focus() + ' did not get interpreted by the desired target. ' + '\nOriginator: ' + $_3r5kv7y9jd24rmmb.element(originator) + '\nTarget: ' + $_3r5kv7y9jd24rmmb.element(target) + '\nCheck the ' + $_9am11ywwjd24rmhg.focus() + ' event handlers');
          return false;
        } else {
          return true;
        }
      })])
  };

  var make$1 = function (spec) {
    return spec;
  };
  var $_1iu0gc130jd24rn6c = { make: make$1 };

  var buildSubcomponents = function (spec) {
    var components = $_bzffwwx6jd24rmit.readOr('components', [])(spec);
    return $_3vsestw9jd24rmfo.map(components, build$1);
  };
  var buildFromSpec = function (userSpec) {
    var spec = $_1iu0gc130jd24rn6c.make(userSpec);
    var components = buildSubcomponents(spec);
    var completeSpec = $_4x4s83wyjd24rmhm.deepMerge($_3ndc4l12zjd24rn6a, spec, $_bzffwwx6jd24rmit.wrap('components', components));
    return $_b2qdiox8jd24rmj0.value($_6sv2rd12ljd24rn43.build(completeSpec));
  };
  var text = function (textContent) {
    var element = $_ei6gqxwtjd24rmh8.fromText(textContent);
    return external({ element: element });
  };
  var external = function (spec) {
    var extSpec = $_bdtykhxhjd24rmjn.asStructOrDie('external.component', $_bdtykhxhjd24rmjn.objOfOnly([
      $_w7f5sx2jd24rmi1.strict('element'),
      $_w7f5sx2jd24rmi1.option('uid')
    ]), spec);
    var systemApi = Cell(NoContextApi());
    var connect = function (newApi) {
      systemApi.set(newApi);
    };
    var disconnect = function () {
      systemApi.set(NoContextApi(function () {
        return me;
      }));
    };
    extSpec.uid().each(function (uid) {
      $_c4606g10mjd24rmv9.writeOnly(extSpec.element(), uid);
    });
    var me = ComponentApi({
      getSystem: systemApi.get,
      config: $_asi680wajd24rmfv.none,
      hasConfigured: $_aoet5bwbjd24rmfz.constant(false),
      connect: connect,
      disconnect: disconnect,
      element: $_aoet5bwbjd24rmfz.constant(extSpec.element()),
      spec: $_aoet5bwbjd24rmfz.constant(spec),
      readState: $_aoet5bwbjd24rmfz.constant('No state'),
      syncComponents: $_aoet5bwbjd24rmfz.noop,
      components: $_aoet5bwbjd24rmfz.constant([]),
      events: $_aoet5bwbjd24rmfz.constant({})
    });
    return $_ch8g4910fjd24rmu1.premade(me);
  };
  var build$1 = function (rawUserSpec) {
    return $_ch8g4910fjd24rmu1.getPremade(rawUserSpec).fold(function () {
      var userSpecWithUid = $_4x4s83wyjd24rmhm.deepMerge({ uid: $_c4606g10mjd24rmv9.generate('') }, rawUserSpec);
      return buildFromSpec(userSpecWithUid).getOrDie();
    }, function (prebuilt) {
      return prebuilt;
    });
  };
  var $_57n4pi12kjd24rn3p = {
    build: build$1,
    premade: $_ch8g4910fjd24rmu1.premade,
    external: external,
    text: text
  };

  var hoverEvent = 'alloy.item-hover';
  var focusEvent = 'alloy.item-focus';
  var onHover = function (item) {
    if ($_9uflcdygjd24rmmn.search(item.element()).isNone() || Focusing.isFocused(item)) {
      if (!Focusing.isFocused(item))
        Focusing.focus(item);
      $_eljod2wvjd24rmhc.emitWith(item, hoverEvent, { item: item });
    }
  };
  var onFocus = function (item) {
    $_eljod2wvjd24rmhc.emitWith(item, focusEvent, { item: item });
  };
  var $_7cewp3134jd24rn6s = {
    hover: $_aoet5bwbjd24rmfz.constant(hoverEvent),
    focus: $_aoet5bwbjd24rmfz.constant(focusEvent),
    onHover: onHover,
    onFocus: onFocus
  };

  var builder = function (info) {
    return {
      dom: $_4x4s83wyjd24rmhm.deepMerge(info.dom(), { attributes: { role: info.toggling().isSome() ? 'menuitemcheckbox' : 'menuitem' } }),
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([
        info.toggling().fold(Toggling.revoke, function (tConfig) {
          return Toggling.config($_4x4s83wyjd24rmhm.deepMerge({ aria: { mode: 'checked' } }, tConfig));
        }),
        Focusing.config({
          ignore: info.ignoreFocus(),
          onFocus: function (component) {
            $_7cewp3134jd24rn6s.onFocus(component);
          }
        }),
        Keying.config({ mode: 'execution' }),
        me.config({
          store: {
            mode: 'memory',
            initialValue: info.data()
          }
        })
      ]), info.itemBehaviours()),
      events: $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.runWithTarget($_9am11ywwjd24rmhg.tapOrClick(), $_eljod2wvjd24rmhc.emitExecute),
        $_g9t26pw6jd24rmfc.cutter($_1tcfm9wxjd24rmhk.mousedown()),
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mouseover(), $_7cewp3134jd24rn6s.onHover),
        $_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.focusItem(), Focusing.focus)
      ]),
      components: info.components(),
      domModification: info.domModification()
    };
  };
  var schema$10 = [
    $_w7f5sx2jd24rmi1.strict('data'),
    $_w7f5sx2jd24rmi1.strict('components'),
    $_w7f5sx2jd24rmi1.strict('dom'),
    $_w7f5sx2jd24rmi1.option('toggling'),
    $_w7f5sx2jd24rmi1.defaulted('itemBehaviours', {}),
    $_w7f5sx2jd24rmi1.defaulted('ignoreFocus', false),
    $_w7f5sx2jd24rmi1.defaulted('domModification', {}),
    $_62w1klytjd24rmnt.output('builder', builder)
  ];

  var builder$1 = function (detail) {
    return {
      dom: detail.dom(),
      components: detail.components(),
      events: $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.stopper($_9am11ywwjd24rmhg.focusItem())])
    };
  };
  var schema$11 = [
    $_w7f5sx2jd24rmi1.strict('dom'),
    $_w7f5sx2jd24rmi1.strict('components'),
    $_62w1klytjd24rmnt.output('builder', builder$1)
  ];

  var owner$2 = 'item-widget';
  var partTypes = [$_6nn6my10kjd24rmuq.required({
      name: 'widget',
      overrides: function (detail) {
        return {
          behaviours: $_9vyb2vw4jd24rmen.derive([me.config({
              store: {
                mode: 'manual',
                getValue: function (component) {
                  return detail.data();
                },
                setValue: function () {
                }
              }
            })])
        };
      }
    })];
  var $_8zv4vz137jd24rn73 = {
    owner: $_aoet5bwbjd24rmfz.constant(owner$2),
    parts: $_aoet5bwbjd24rmfz.constant(partTypes)
  };

  var builder$2 = function (info) {
    var subs = $_czojf710ijd24rmub.substitutes($_8zv4vz137jd24rn73.owner(), info, $_8zv4vz137jd24rn73.parts());
    var components = $_czojf710ijd24rmub.components($_8zv4vz137jd24rn73.owner(), info, subs.internals());
    var focusWidget = function (component) {
      return $_czojf710ijd24rmub.getPart(component, info, 'widget').map(function (widget) {
        Keying.focusIn(widget);
        return widget;
      });
    };
    var onHorizontalArrow = function (component, simulatedEvent) {
      return $_fpdsjvzxjd24rmrm.inside(simulatedEvent.event().target()) ? $_asi680wajd24rmfv.none() : function () {
        if (info.autofocus()) {
          simulatedEvent.setSource(component.element());
          return $_asi680wajd24rmfv.none();
        } else {
          return $_asi680wajd24rmfv.none();
        }
      }();
    };
    return $_4x4s83wyjd24rmhm.deepMerge({
      dom: info.dom(),
      components: components,
      domModification: info.domModification(),
      events: $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.runOnExecute(function (component, simulatedEvent) {
          focusWidget(component).each(function (widget) {
            simulatedEvent.stop();
          });
        }),
        $_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.mouseover(), $_7cewp3134jd24rn6s.onHover),
        $_g9t26pw6jd24rmfc.run($_9am11ywwjd24rmhg.focusItem(), function (component, simulatedEvent) {
          if (info.autofocus())
            focusWidget(component);
          else
            Focusing.focus(component);
        })
      ]),
      behaviours: $_9vyb2vw4jd24rmen.derive([
        me.config({
          store: {
            mode: 'memory',
            initialValue: info.data()
          }
        }),
        Focusing.config({
          onFocus: function (component) {
            $_7cewp3134jd24rn6s.onFocus(component);
          }
        }),
        Keying.config({
          mode: 'special',
          onLeft: onHorizontalArrow,
          onRight: onHorizontalArrow,
          onEscape: function (component, simulatedEvent) {
            if (!Focusing.isFocused(component) && !info.autofocus()) {
              Focusing.focus(component);
              return $_asi680wajd24rmfv.some(true);
            } else if (info.autofocus()) {
              simulatedEvent.setSource(component.element());
              return $_asi680wajd24rmfv.none();
            } else {
              return $_asi680wajd24rmfv.none();
            }
          }
        })
      ])
    });
  };
  var schema$12 = [
    $_w7f5sx2jd24rmi1.strict('uid'),
    $_w7f5sx2jd24rmi1.strict('data'),
    $_w7f5sx2jd24rmi1.strict('components'),
    $_w7f5sx2jd24rmi1.strict('dom'),
    $_w7f5sx2jd24rmi1.defaulted('autofocus', false),
    $_w7f5sx2jd24rmi1.defaulted('domModification', {}),
    $_czojf710ijd24rmub.defaultUidsSchema($_8zv4vz137jd24rn73.parts()),
    $_62w1klytjd24rmnt.output('builder', builder$2)
  ];

  var itemSchema$1 = $_bdtykhxhjd24rmjn.choose('type', {
    widget: schema$12,
    item: schema$10,
    separator: schema$11
  });
  var configureGrid = function (detail, movementInfo) {
    return {
      mode: 'flatgrid',
      selector: '.' + detail.markers().item(),
      initSize: {
        numColumns: movementInfo.initSize().numColumns(),
        numRows: movementInfo.initSize().numRows()
      },
      focusManager: detail.focusManager()
    };
  };
  var configureMenu = function (detail, movementInfo) {
    return {
      mode: 'menu',
      selector: '.' + detail.markers().item(),
      moveOnTab: movementInfo.moveOnTab(),
      focusManager: detail.focusManager()
    };
  };
  var parts = [$_6nn6my10kjd24rmuq.group({
      factory: {
        sketch: function (spec) {
          var itemInfo = $_bdtykhxhjd24rmjn.asStructOrDie('menu.spec item', itemSchema$1, spec);
          return itemInfo.builder()(itemInfo);
        }
      },
      name: 'items',
      unit: 'item',
      defaults: function (detail, u) {
        var fallbackUid = $_c4606g10mjd24rmv9.generate('');
        return $_4x4s83wyjd24rmhm.deepMerge({ uid: fallbackUid }, u);
      },
      overrides: function (detail, u) {
        return {
          type: u.type,
          ignoreFocus: detail.fakeFocus(),
          domModification: { classes: [detail.markers().item()] }
        };
      }
    })];
  var schema$13 = [
    $_w7f5sx2jd24rmi1.strict('value'),
    $_w7f5sx2jd24rmi1.strict('items'),
    $_w7f5sx2jd24rmi1.strict('dom'),
    $_w7f5sx2jd24rmi1.strict('components'),
    $_w7f5sx2jd24rmi1.defaulted('eventOrder', {}),
    $_azr91y10djd24rmtn.field('menuBehaviours', [
      Highlighting,
      me,
      Composing,
      Keying
    ]),
    $_w7f5sx2jd24rmi1.defaultedOf('movement', {
      mode: 'menu',
      moveOnTab: true
    }, $_bdtykhxhjd24rmjn.choose('mode', {
      grid: [
        $_62w1klytjd24rmnt.initSize(),
        $_62w1klytjd24rmnt.output('config', configureGrid)
      ],
      menu: [
        $_w7f5sx2jd24rmi1.defaulted('moveOnTab', true),
        $_62w1klytjd24rmnt.output('config', configureMenu)
      ]
    })),
    $_62w1klytjd24rmnt.itemMarkers(),
    $_w7f5sx2jd24rmi1.defaulted('fakeFocus', false),
    $_w7f5sx2jd24rmi1.defaulted('focusManager', $_8odkg5zgjd24rmq2.dom()),
    $_62w1klytjd24rmnt.onHandler('onHighlight')
  ];
  var $_d53jz0132jd24rn6i = {
    name: $_aoet5bwbjd24rmfz.constant('Menu'),
    schema: $_aoet5bwbjd24rmfz.constant(schema$13),
    parts: $_aoet5bwbjd24rmfz.constant(parts)
  };

  var focusEvent$1 = 'alloy.menu-focus';
  var $_7k439l139jd24rn7a = { focus: $_aoet5bwbjd24rmfz.constant(focusEvent$1) };

  var make$2 = function (detail, components, spec, externals) {
    return $_4x4s83wyjd24rmhm.deepMerge({
      dom: $_4x4s83wyjd24rmhm.deepMerge(detail.dom(), { attributes: { role: 'menu' } }),
      uid: detail.uid(),
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([
        Highlighting.config({
          highlightClass: detail.markers().selectedItem(),
          itemClass: detail.markers().item(),
          onHighlight: detail.onHighlight()
        }),
        me.config({
          store: {
            mode: 'memory',
            initialValue: detail.value()
          }
        }),
        Composing.config({ find: $_aoet5bwbjd24rmfz.identity }),
        Keying.config(detail.movement().config()(detail, detail.movement()))
      ]), $_azr91y10djd24rmtn.get(detail.menuBehaviours())),
      events: $_g9t26pw6jd24rmfc.derive([
        $_g9t26pw6jd24rmfc.run($_7cewp3134jd24rn6s.focus(), function (menu, simulatedEvent) {
          var event = simulatedEvent.event();
          menu.getSystem().getByDom(event.target()).each(function (item) {
            Highlighting.highlight(menu, item);
            simulatedEvent.stop();
            $_eljod2wvjd24rmhc.emitWith(menu, $_7k439l139jd24rn7a.focus(), {
              menu: menu,
              item: item
            });
          });
        }),
        $_g9t26pw6jd24rmfc.run($_7cewp3134jd24rn6s.hover(), function (menu, simulatedEvent) {
          var item = simulatedEvent.event().item();
          Highlighting.highlight(menu, item);
        })
      ]),
      components: components,
      eventOrder: detail.eventOrder()
    });
  };
  var $_bbefeh138jd24rn76 = { make: make$2 };

  var Menu = $_7v08p10ejd24rmts.composite({
    name: 'Menu',
    configFields: $_d53jz0132jd24rn6i.schema(),
    partFields: $_d53jz0132jd24rn6i.parts(),
    factory: $_bbefeh138jd24rn76.make
  });

  var preserve$2 = function (f, container) {
    var ownerDoc = $_5on3koy3jd24rmlg.owner(container);
    var refocus = $_9uflcdygjd24rmmn.active(ownerDoc).bind(function (focused) {
      var hasFocus = function (elem) {
        return $_237cqww8jd24rmfh.eq(focused, elem);
      };
      return hasFocus(container) ? $_asi680wajd24rmfv.some(container) : $_en3fpayijd24rmmt.descendant(container, hasFocus);
    });
    var result = f(container);
    refocus.each(function (oldFocus) {
      $_9uflcdygjd24rmmn.active(ownerDoc).filter(function (newFocus) {
        return $_237cqww8jd24rmfh.eq(newFocus, oldFocus);
      }).orThunk(function () {
        $_9uflcdygjd24rmmn.focus(oldFocus);
      });
    });
    return result;
  };
  var $_20106c13djd24rn7l = { preserve: preserve$2 };

  var set$7 = function (component, replaceConfig, replaceState, data) {
    $_41u2roy1jd24rml7.detachChildren(component);
    $_20106c13djd24rn7l.preserve(function () {
      var children = $_3vsestw9jd24rmfo.map(data, component.getSystem().build);
      $_3vsestw9jd24rmfo.each(children, function (l) {
        $_41u2roy1jd24rml7.attach(component, l);
      });
    }, component.element());
  };
  var insert = function (component, replaceConfig, insertion, childSpec) {
    var child = component.getSystem().build(childSpec);
    $_41u2roy1jd24rml7.attachWith(component, child, insertion);
  };
  var append$2 = function (component, replaceConfig, replaceState, appendee) {
    insert(component, replaceConfig, $_a7pwway2jd24rmlf.append, appendee);
  };
  var prepend$2 = function (component, replaceConfig, replaceState, prependee) {
    insert(component, replaceConfig, $_a7pwway2jd24rmlf.prepend, prependee);
  };
  var remove$7 = function (component, replaceConfig, replaceState, removee) {
    var children = contents(component, replaceConfig);
    var foundChild = $_3vsestw9jd24rmfo.find(children, function (child) {
      return $_237cqww8jd24rmfh.eq(removee.element(), child.element());
    });
    foundChild.each($_41u2roy1jd24rml7.detach);
  };
  var contents = function (component, replaceConfig) {
    return component.components();
  };
  var $_e5zz4g13cjd24rn7h = {
    append: append$2,
    prepend: prepend$2,
    remove: remove$7,
    set: set$7,
    contents: contents
  };

  var Replacing = $_9vyb2vw4jd24rmen.create({
    fields: [],
    name: 'replacing',
    apis: $_e5zz4g13cjd24rn7h
  });

  var transpose = function (obj) {
    return $_2hhb0ax0jd24rmhp.tupleMap(obj, function (v, k) {
      return {
        k: v,
        v: k
      };
    });
  };
  var trace = function (items, byItem, byMenu, finish) {
    return $_bzffwwx6jd24rmit.readOptFrom(byMenu, finish).bind(function (triggerItem) {
      return $_bzffwwx6jd24rmit.readOptFrom(items, triggerItem).bind(function (triggerMenu) {
        var rest = trace(items, byItem, byMenu, triggerMenu);
        return $_asi680wajd24rmfv.some([triggerMenu].concat(rest));
      });
    }).getOr([]);
  };
  var generate$5 = function (menus, expansions) {
    var items = {};
    $_2hhb0ax0jd24rmhp.each(menus, function (menuItems, menu) {
      $_3vsestw9jd24rmfo.each(menuItems, function (item) {
        items[item] = menu;
      });
    });
    var byItem = expansions;
    var byMenu = transpose(expansions);
    var menuPaths = $_2hhb0ax0jd24rmhp.map(byMenu, function (triggerItem, submenu) {
      return [submenu].concat(trace(items, byItem, byMenu, submenu));
    });
    return $_2hhb0ax0jd24rmhp.map(items, function (path) {
      return $_bzffwwx6jd24rmit.readOptFrom(menuPaths, path).getOr([path]);
    });
  };
  var $_bx79zk13gjd24rn8i = { generate: generate$5 };

  function LayeredState () {
    var expansions = Cell({});
    var menus = Cell({});
    var paths = Cell({});
    var primary = Cell($_asi680wajd24rmfv.none());
    var toItemValues = Cell($_aoet5bwbjd24rmfz.constant([]));
    var clear = function () {
      expansions.set({});
      menus.set({});
      paths.set({});
      primary.set($_asi680wajd24rmfv.none());
    };
    var isClear = function () {
      return primary.get().isNone();
    };
    var setContents = function (sPrimary, sMenus, sExpansions, sToItemValues) {
      primary.set($_asi680wajd24rmfv.some(sPrimary));
      expansions.set(sExpansions);
      menus.set(sMenus);
      toItemValues.set(sToItemValues);
      var menuValues = sToItemValues(sMenus);
      var sPaths = $_bx79zk13gjd24rn8i.generate(menuValues, sExpansions);
      paths.set(sPaths);
    };
    var expand = function (itemValue) {
      return $_bzffwwx6jd24rmit.readOptFrom(expansions.get(), itemValue).map(function (menu) {
        var current = $_bzffwwx6jd24rmit.readOptFrom(paths.get(), itemValue).getOr([]);
        return [menu].concat(current);
      });
    };
    var collapse = function (itemValue) {
      return $_bzffwwx6jd24rmit.readOptFrom(paths.get(), itemValue).bind(function (path) {
        return path.length > 1 ? $_asi680wajd24rmfv.some(path.slice(1)) : $_asi680wajd24rmfv.none();
      });
    };
    var refresh = function (itemValue) {
      return $_bzffwwx6jd24rmit.readOptFrom(paths.get(), itemValue);
    };
    var lookupMenu = function (menuValue) {
      return $_bzffwwx6jd24rmit.readOptFrom(menus.get(), menuValue);
    };
    var otherMenus = function (path) {
      var menuValues = toItemValues.get()(menus.get());
      return $_3vsestw9jd24rmfo.difference($_2hhb0ax0jd24rmhp.keys(menuValues), path);
    };
    var getPrimary = function () {
      return primary.get().bind(lookupMenu);
    };
    var getMenus = function () {
      return menus.get();
    };
    return {
      setContents: setContents,
      expand: expand,
      refresh: refresh,
      collapse: collapse,
      lookupMenu: lookupMenu,
      otherMenus: otherMenus,
      getPrimary: getPrimary,
      getMenus: getMenus,
      clear: clear,
      isClear: isClear
    };
  }

  var make$3 = function (detail, rawUiSpec) {
    var buildMenus = function (container, menus) {
      return $_2hhb0ax0jd24rmhp.map(menus, function (spec, name) {
        var data = Menu.sketch($_4x4s83wyjd24rmhm.deepMerge(spec, {
          value: name,
          items: spec.items,
          markers: $_bzffwwx6jd24rmit.narrow(rawUiSpec.markers, [
            'item',
            'selectedItem'
          ]),
          fakeFocus: detail.fakeFocus(),
          onHighlight: detail.onHighlight(),
          focusManager: detail.fakeFocus() ? $_8odkg5zgjd24rmq2.highlights() : $_8odkg5zgjd24rmq2.dom()
        }));
        return container.getSystem().build(data);
      });
    };
    var state = LayeredState();
    var setup = function (container) {
      var componentMap = buildMenus(container, detail.data().menus());
      state.setContents(detail.data().primary(), componentMap, detail.data().expansions(), function (sMenus) {
        return toMenuValues(container, sMenus);
      });
      return state.getPrimary();
    };
    var getItemValue = function (item) {
      return me.getValue(item).value;
    };
    var toMenuValues = function (container, sMenus) {
      return $_2hhb0ax0jd24rmhp.map(detail.data().menus(), function (data, menuName) {
        return $_3vsestw9jd24rmfo.bind(data.items, function (item) {
          return item.type === 'separator' ? [] : [item.data.value];
        });
      });
    };
    var setActiveMenu = function (container, menu) {
      Highlighting.highlight(container, menu);
      Highlighting.getHighlighted(menu).orThunk(function () {
        return Highlighting.getFirst(menu);
      }).each(function (item) {
        $_eljod2wvjd24rmhc.dispatch(container, item.element(), $_9am11ywwjd24rmhg.focusItem());
      });
    };
    var getMenus = function (state, menuValues) {
      return $_dq6bfmyejd24rmml.cat($_3vsestw9jd24rmfo.map(menuValues, state.lookupMenu));
    };
    var updateMenuPath = function (container, state, path) {
      return $_asi680wajd24rmfv.from(path[0]).bind(state.lookupMenu).map(function (activeMenu) {
        var rest = getMenus(state, path.slice(1));
        $_3vsestw9jd24rmfo.each(rest, function (r) {
          $_c8qis7xujd24rmks.add(r.element(), detail.markers().backgroundMenu());
        });
        if (!$_fqsltgy7jd24rmlz.inBody(activeMenu.element())) {
          Replacing.append(container, $_57n4pi12kjd24rn3p.premade(activeMenu));
        }
        $_7u42ke12yjd24rn66.remove(activeMenu.element(), [detail.markers().backgroundMenu()]);
        setActiveMenu(container, activeMenu);
        var others = getMenus(state, state.otherMenus(path));
        $_3vsestw9jd24rmfo.each(others, function (o) {
          $_7u42ke12yjd24rn66.remove(o.element(), [detail.markers().backgroundMenu()]);
          if (!detail.stayInDom())
            Replacing.remove(container, o);
        });
        return activeMenu;
      });
    };
    var expandRight = function (container, item) {
      var value = getItemValue(item);
      return state.expand(value).bind(function (path) {
        $_asi680wajd24rmfv.from(path[0]).bind(state.lookupMenu).each(function (activeMenu) {
          if (!$_fqsltgy7jd24rmlz.inBody(activeMenu.element())) {
            Replacing.append(container, $_57n4pi12kjd24rn3p.premade(activeMenu));
          }
          detail.onOpenSubmenu()(container, item, activeMenu);
          Highlighting.highlightFirst(activeMenu);
        });
        return updateMenuPath(container, state, path);
      });
    };
    var collapseLeft = function (container, item) {
      var value = getItemValue(item);
      return state.collapse(value).bind(function (path) {
        return updateMenuPath(container, state, path).map(function (activeMenu) {
          detail.onCollapseMenu()(container, item, activeMenu);
          return activeMenu;
        });
      });
    };
    var updateView = function (container, item) {
      var value = getItemValue(item);
      return state.refresh(value).bind(function (path) {
        return updateMenuPath(container, state, path);
      });
    };
    var onRight = function (container, item) {
      return $_fpdsjvzxjd24rmrm.inside(item.element()) ? $_asi680wajd24rmfv.none() : expandRight(container, item);
    };
    var onLeft = function (container, item) {
      return $_fpdsjvzxjd24rmrm.inside(item.element()) ? $_asi680wajd24rmfv.none() : collapseLeft(container, item);
    };
    var onEscape = function (container, item) {
      return collapseLeft(container, item).orThunk(function () {
        return detail.onEscape()(container, item);
      });
    };
    var keyOnItem = function (f) {
      return function (container, simulatedEvent) {
        return $_56vfpvzmjd24rmql.closest(simulatedEvent.getSource(), '.' + detail.markers().item()).bind(function (target) {
          return container.getSystem().getByDom(target).bind(function (item) {
            return f(container, item);
          });
        });
      };
    };
    var events = $_g9t26pw6jd24rmfc.derive([
      $_g9t26pw6jd24rmfc.run($_7k439l139jd24rn7a.focus(), function (sandbox, simulatedEvent) {
        var menu = simulatedEvent.event().menu();
        Highlighting.highlight(sandbox, menu);
      }),
      $_g9t26pw6jd24rmfc.runOnExecute(function (sandbox, simulatedEvent) {
        var target = simulatedEvent.event().target();
        return sandbox.getSystem().getByDom(target).bind(function (item) {
          var itemValue = getItemValue(item);
          if (itemValue.indexOf('collapse-item') === 0) {
            return collapseLeft(sandbox, item);
          }
          return expandRight(sandbox, item).orThunk(function () {
            return detail.onExecute()(sandbox, item);
          });
        });
      }),
      $_g9t26pw6jd24rmfc.runOnAttached(function (container, simulatedEvent) {
        setup(container).each(function (primary) {
          Replacing.append(container, $_57n4pi12kjd24rn3p.premade(primary));
          if (detail.openImmediately()) {
            setActiveMenu(container, primary);
            detail.onOpenMenu()(container, primary);
          }
        });
      })
    ].concat(detail.navigateOnHover() ? [$_g9t26pw6jd24rmfc.run($_7cewp3134jd24rn6s.hover(), function (sandbox, simulatedEvent) {
        var item = simulatedEvent.event().item();
        updateView(sandbox, item);
        expandRight(sandbox, item);
        detail.onHover()(sandbox, item);
      })] : []));
    var collapseMenuApi = function (container) {
      Highlighting.getHighlighted(container).each(function (currentMenu) {
        Highlighting.getHighlighted(currentMenu).each(function (currentItem) {
          collapseLeft(container, currentItem);
        });
      });
    };
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([
        Keying.config({
          mode: 'special',
          onRight: keyOnItem(onRight),
          onLeft: keyOnItem(onLeft),
          onEscape: keyOnItem(onEscape),
          focusIn: function (container, keyInfo) {
            state.getPrimary().each(function (primary) {
              $_eljod2wvjd24rmhc.dispatch(container, primary.element(), $_9am11ywwjd24rmhg.focusItem());
            });
          }
        }),
        Highlighting.config({
          highlightClass: detail.markers().selectedMenu(),
          itemClass: detail.markers().menu()
        }),
        Composing.config({
          find: function (container) {
            return Highlighting.getHighlighted(container);
          }
        }),
        Replacing.config({})
      ]), $_azr91y10djd24rmtn.get(detail.tmenuBehaviours())),
      eventOrder: detail.eventOrder(),
      apis: { collapseMenu: collapseMenuApi },
      events: events
    };
  };
  var $_2tbse313ejd24rn7w = {
    make: make$3,
    collapseItem: $_aoet5bwbjd24rmfz.constant('collapse-item')
  };

  var tieredData = function (primary, menus, expansions) {
    return {
      primary: primary,
      menus: menus,
      expansions: expansions
    };
  };
  var singleData = function (name, menu) {
    return {
      primary: name,
      menus: $_bzffwwx6jd24rmit.wrap(name, menu),
      expansions: {}
    };
  };
  var collapseItem = function (text) {
    return {
      value: $_d75dkd10gjd24rmu6.generate($_2tbse313ejd24rn7w.collapseItem()),
      text: text
    };
  };
  var TieredMenu = $_7v08p10ejd24rmts.single({
    name: 'TieredMenu',
    configFields: [
      $_62w1klytjd24rmnt.onStrictKeyboardHandler('onExecute'),
      $_62w1klytjd24rmnt.onStrictKeyboardHandler('onEscape'),
      $_62w1klytjd24rmnt.onStrictHandler('onOpenMenu'),
      $_62w1klytjd24rmnt.onStrictHandler('onOpenSubmenu'),
      $_62w1klytjd24rmnt.onHandler('onCollapseMenu'),
      $_w7f5sx2jd24rmi1.defaulted('openImmediately', true),
      $_w7f5sx2jd24rmi1.strictObjOf('data', [
        $_w7f5sx2jd24rmi1.strict('primary'),
        $_w7f5sx2jd24rmi1.strict('menus'),
        $_w7f5sx2jd24rmi1.strict('expansions')
      ]),
      $_w7f5sx2jd24rmi1.defaulted('fakeFocus', false),
      $_62w1klytjd24rmnt.onHandler('onHighlight'),
      $_62w1klytjd24rmnt.onHandler('onHover'),
      $_62w1klytjd24rmnt.tieredMenuMarkers(),
      $_w7f5sx2jd24rmi1.strict('dom'),
      $_w7f5sx2jd24rmi1.defaulted('navigateOnHover', true),
      $_w7f5sx2jd24rmi1.defaulted('stayInDom', false),
      $_azr91y10djd24rmtn.field('tmenuBehaviours', [
        Keying,
        Highlighting,
        Composing,
        Replacing
      ]),
      $_w7f5sx2jd24rmi1.defaulted('eventOrder', {})
    ],
    apis: {
      collapseMenu: function (apis, tmenu) {
        apis.collapseMenu(tmenu);
      }
    },
    factory: $_2tbse313ejd24rn7w.make,
    extraApis: {
      tieredData: tieredData,
      singleData: singleData,
      collapseItem: collapseItem
    }
  });

  var scrollable = $_4i0vdoz1jd24rmoo.resolve('scrollable');
  var register = function (element) {
    $_c8qis7xujd24rmks.add(element, scrollable);
  };
  var deregister = function (element) {
    $_c8qis7xujd24rmks.remove(element, scrollable);
  };
  var $_c71wbk13hjd24rn8p = {
    register: register,
    deregister: deregister,
    scrollable: $_aoet5bwbjd24rmfz.constant(scrollable)
  };

  var getValue$4 = function (item) {
    return $_bzffwwx6jd24rmit.readOptFrom(item, 'format').getOr(item.title);
  };
  var convert$1 = function (formats, memMenuThunk) {
    var mainMenu = makeMenu('Styles', [].concat($_3vsestw9jd24rmfo.map(formats.items, function (k) {
      return makeItem(getValue$4(k), k.title, k.isSelected(), k.getPreview(), $_bzffwwx6jd24rmit.hasKey(formats.expansions, getValue$4(k)));
    })), memMenuThunk, false);
    var submenus = $_2hhb0ax0jd24rmhp.map(formats.menus, function (menuItems, menuName) {
      var items = $_3vsestw9jd24rmfo.map(menuItems, function (item) {
        return makeItem(getValue$4(item), item.title, item.isSelected !== undefined ? item.isSelected() : false, item.getPreview !== undefined ? item.getPreview() : '', $_bzffwwx6jd24rmit.hasKey(formats.expansions, getValue$4(item)));
      });
      return makeMenu(menuName, items, memMenuThunk, true);
    });
    var menus = $_4x4s83wyjd24rmhm.deepMerge(submenus, $_bzffwwx6jd24rmit.wrap('styles', mainMenu));
    var tmenu = TieredMenu.tieredData('styles', menus, formats.expansions);
    return { tmenu: tmenu };
  };
  var makeItem = function (value, text, selected, preview, isMenu) {
    return {
      data: {
        value: value,
        text: text
      },
      type: 'item',
      dom: {
        tag: 'div',
        classes: isMenu ? [$_4i0vdoz1jd24rmoo.resolve('styles-item-is-menu')] : []
      },
      toggling: {
        toggleOnExecute: false,
        toggleClass: $_4i0vdoz1jd24rmoo.resolve('format-matches'),
        selected: selected
      },
      itemBehaviours: $_9vyb2vw4jd24rmen.derive(isMenu ? [] : [$_xzzzbz0jd24rmol.format(value, function (comp, status) {
          var toggle = status ? Toggling.on : Toggling.off;
          toggle(comp);
        })]),
      components: [{
          dom: {
            tag: 'div',
            attributes: { style: preview },
            innerHtml: text
          }
        }]
    };
  };
  var makeMenu = function (value, items, memMenuThunk, collapsable) {
    return {
      value: value,
      dom: { tag: 'div' },
      components: [
        Button.sketch({
          dom: {
            tag: 'div',
            classes: [$_4i0vdoz1jd24rmoo.resolve('styles-collapser')]
          },
          components: collapsable ? [
            {
              dom: {
                tag: 'span',
                classes: [$_4i0vdoz1jd24rmoo.resolve('styles-collapse-icon')]
              }
            },
            $_57n4pi12kjd24rn3p.text(value)
          ] : [$_57n4pi12kjd24rn3p.text(value)],
          action: function (item) {
            if (collapsable) {
              var comp = memMenuThunk().get(item);
              TieredMenu.collapseMenu(comp);
            }
          }
        }),
        {
          dom: {
            tag: 'div',
            classes: [$_4i0vdoz1jd24rmoo.resolve('styles-menu-items-container')]
          },
          components: [Menu.parts().items({})],
          behaviours: $_9vyb2vw4jd24rmen.derive([$_dzt99a11sjd24rn0a.config('adhoc-scrollable-menu', [
              $_g9t26pw6jd24rmfc.runOnAttached(function (component, simulatedEvent) {
                $_ayz4w9zsjd24rmr3.set(component.element(), 'overflow-y', 'auto');
                $_ayz4w9zsjd24rmr3.set(component.element(), '-webkit-overflow-scrolling', 'touch');
                $_c71wbk13hjd24rn8p.register(component.element());
              }),
              $_g9t26pw6jd24rmfc.runOnDetached(function (component) {
                $_ayz4w9zsjd24rmr3.remove(component.element(), 'overflow-y');
                $_ayz4w9zsjd24rmr3.remove(component.element(), '-webkit-overflow-scrolling');
                $_c71wbk13hjd24rn8p.deregister(component.element());
              })
            ])])
        }
      ],
      items: items,
      menuBehaviours: $_9vyb2vw4jd24rmen.derive([Transitioning.config({
          initialState: 'after',
          routes: Transitioning.createTristate('before', 'current', 'after', {
            transition: {
              property: 'transform',
              transitionClass: 'transitioning'
            }
          })
        })])
    };
  };
  var sketch$9 = function (settings) {
    var dataset = convert$1(settings.formats, function () {
      return memMenu;
    });
    var memMenu = $_c9gmcp11ejd24rmyr.record(TieredMenu.sketch({
      dom: {
        tag: 'div',
        classes: [$_4i0vdoz1jd24rmoo.resolve('styles-menu')]
      },
      components: [],
      fakeFocus: true,
      stayInDom: true,
      onExecute: function (tmenu, item) {
        var v = me.getValue(item);
        settings.handle(item, v.value);
      },
      onEscape: function () {
      },
      onOpenMenu: function (container, menu) {
        var w = $_cnk9kc117jd24rmxv.get(container.element());
        $_cnk9kc117jd24rmxv.set(menu.element(), w);
        Transitioning.jumpTo(menu, 'current');
      },
      onOpenSubmenu: function (container, item, submenu) {
        var w = $_cnk9kc117jd24rmxv.get(container.element());
        var menu = $_56vfpvzmjd24rmql.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
        var menuComp = container.getSystem().getByDom(menu).getOrDie();
        $_cnk9kc117jd24rmxv.set(submenu.element(), w);
        Transitioning.progressTo(menuComp, 'before');
        Transitioning.jumpTo(submenu, 'after');
        Transitioning.progressTo(submenu, 'current');
      },
      onCollapseMenu: function (container, item, menu) {
        var submenu = $_56vfpvzmjd24rmql.ancestor(item.element(), '[role="menu"]').getOrDie('hacky');
        var submenuComp = container.getSystem().getByDom(submenu).getOrDie();
        Transitioning.progressTo(submenuComp, 'after');
        Transitioning.progressTo(menu, 'current');
      },
      navigateOnHover: false,
      openImmediately: true,
      data: dataset.tmenu,
      markers: {
        backgroundMenu: $_4i0vdoz1jd24rmoo.resolve('styles-background-menu'),
        menu: $_4i0vdoz1jd24rmoo.resolve('styles-menu'),
        selectedMenu: $_4i0vdoz1jd24rmoo.resolve('styles-selected-menu'),
        item: $_4i0vdoz1jd24rmoo.resolve('styles-item'),
        selectedItem: $_4i0vdoz1jd24rmoo.resolve('styles-selected-item')
      }
    }));
    return memMenu.asSpec();
  };
  var $_3ea10j12fjd24rn2o = { sketch: sketch$9 };

  var getFromExpandingItem = function (item) {
    var newItem = $_4x4s83wyjd24rmhm.deepMerge($_bzffwwx6jd24rmit.exclude(item, ['items']), { menu: true });
    var rest = expand(item.items);
    var newMenus = $_4x4s83wyjd24rmhm.deepMerge(rest.menus, $_bzffwwx6jd24rmit.wrap(item.title, rest.items));
    var newExpansions = $_4x4s83wyjd24rmhm.deepMerge(rest.expansions, $_bzffwwx6jd24rmit.wrap(item.title, item.title));
    return {
      item: newItem,
      menus: newMenus,
      expansions: newExpansions
    };
  };
  var getFromItem = function (item) {
    return $_bzffwwx6jd24rmit.hasKey(item, 'items') ? getFromExpandingItem(item) : {
      item: item,
      menus: {},
      expansions: {}
    };
  };
  var expand = function (items) {
    return $_3vsestw9jd24rmfo.foldr(items, function (acc, item) {
      var newData = getFromItem(item);
      return {
        menus: $_4x4s83wyjd24rmhm.deepMerge(acc.menus, newData.menus),
        items: [newData.item].concat(acc.items),
        expansions: $_4x4s83wyjd24rmhm.deepMerge(acc.expansions, newData.expansions)
      };
    }, {
      menus: {},
      expansions: {},
      items: []
    });
  };
  var $_cw1aq413ijd24rn8s = { expand: expand };

  var register$1 = function (editor, settings) {
    var isSelectedFor = function (format) {
      return function () {
        return editor.formatter.match(format);
      };
    };
    var getPreview = function (format) {
      return function () {
        var styles = editor.formatter.getCssText(format);
        return styles;
      };
    };
    var enrichSupported = function (item) {
      return $_4x4s83wyjd24rmhm.deepMerge(item, {
        isSelected: isSelectedFor(item.format),
        getPreview: getPreview(item.format)
      });
    };
    var enrichMenu = function (item) {
      return $_4x4s83wyjd24rmhm.deepMerge(item, {
        isSelected: $_aoet5bwbjd24rmfz.constant(false),
        getPreview: $_aoet5bwbjd24rmfz.constant('')
      });
    };
    var enrichCustom = function (item) {
      var formatName = $_d75dkd10gjd24rmu6.generate(item.title);
      var newItem = $_4x4s83wyjd24rmhm.deepMerge(item, {
        format: formatName,
        isSelected: isSelectedFor(formatName),
        getPreview: getPreview(formatName)
      });
      editor.formatter.register(formatName, newItem);
      return newItem;
    };
    var formats = $_bzffwwx6jd24rmit.readOptFrom(settings, 'style_formats').getOr(DefaultStyleFormats);
    var doEnrich = function (items) {
      return $_3vsestw9jd24rmfo.map(items, function (item) {
        if ($_bzffwwx6jd24rmit.hasKey(item, 'items')) {
          var newItems = doEnrich(item.items);
          return $_4x4s83wyjd24rmhm.deepMerge(enrichMenu(item), { items: newItems });
        } else if ($_bzffwwx6jd24rmit.hasKey(item, 'format')) {
          return enrichSupported(item);
        } else {
          return enrichCustom(item);
        }
      });
    };
    return doEnrich(formats);
  };
  var prune = function (editor, formats) {
    var doPrune = function (items) {
      return $_3vsestw9jd24rmfo.bind(items, function (item) {
        if (item.items !== undefined) {
          var newItems = doPrune(item.items);
          return newItems.length > 0 ? [item] : [];
        } else {
          var keep = $_bzffwwx6jd24rmit.hasKey(item, 'format') ? editor.formatter.canApply(item.format) : true;
          return keep ? [item] : [];
        }
      });
    };
    var prunedItems = doPrune(formats);
    return $_cw1aq413ijd24rn8s.expand(prunedItems);
  };
  var ui = function (editor, formats, onDone) {
    var pruned = prune(editor, formats);
    return $_3ea10j12fjd24rn2o.sketch({
      formats: pruned,
      handle: function (item, value) {
        editor.undoManager.transact(function () {
          if (Toggling.isOn(item)) {
            editor.formatter.remove(value);
          } else {
            editor.formatter.apply(value);
          }
        });
        onDone();
      }
    });
  };
  var $_59puhl12djd24rn2f = {
    register: register$1,
    ui: ui
  };

  var defaults = [
    'undo',
    'bold',
    'italic',
    'link',
    'image',
    'bullist',
    'styleselect'
  ];
  var extract$1 = function (rawToolbar) {
    var toolbar = rawToolbar.replace(/\|/g, ' ').trim();
    return toolbar.length > 0 ? toolbar.split(/\s+/) : [];
  };
  var identifyFromArray = function (toolbar) {
    return $_3vsestw9jd24rmfo.bind(toolbar, function (item) {
      return $_cbf8cdwzjd24rmhn.isArray(item) ? identifyFromArray(item) : extract$1(item);
    });
  };
  var identify = function (settings) {
    var toolbar = settings.toolbar !== undefined ? settings.toolbar : defaults;
    return $_cbf8cdwzjd24rmhn.isArray(toolbar) ? identifyFromArray(toolbar) : extract$1(toolbar);
  };
  var setup = function (realm, editor) {
    var commandSketch = function (name) {
      return function () {
        return $_2byzekz2jd24rmop.forToolbarCommand(editor, name);
      };
    };
    var stateCommandSketch = function (name) {
      return function () {
        return $_2byzekz2jd24rmop.forToolbarStateCommand(editor, name);
      };
    };
    var actionSketch = function (name, query, action) {
      return function () {
        return $_2byzekz2jd24rmop.forToolbarStateAction(editor, name, query, action);
      };
    };
    var undo = commandSketch('undo');
    var redo = commandSketch('redo');
    var bold = stateCommandSketch('bold');
    var italic = stateCommandSketch('italic');
    var underline = stateCommandSketch('underline');
    var removeformat = commandSketch('removeformat');
    var link = function () {
      return $_7qo1pl11ojd24rmzi.sketch(realm, editor);
    };
    var unlink = actionSketch('unlink', 'link', function () {
      editor.execCommand('unlink', null, false);
    });
    var image = function () {
      return $_1lhgof11djd24rmyk.sketch(editor);
    };
    var bullist = actionSketch('unordered-list', 'ul', function () {
      editor.execCommand('InsertUnorderedList', null, false);
    });
    var numlist = actionSketch('ordered-list', 'ol', function () {
      editor.execCommand('InsertOrderedList', null, false);
    });
    var fontsizeselect = function () {
      return $_2fhlv5119jd24rmxx.sketch(realm, editor);
    };
    var forecolor = function () {
      return $_ax0cpp10sjd24rmw9.sketch(realm, editor);
    };
    var styleFormats = $_59puhl12djd24rn2f.register(editor, editor.settings);
    var styleFormatsMenu = function () {
      return $_59puhl12djd24rn2f.ui(editor, styleFormats, function () {
        editor.fire('scrollIntoView');
      });
    };
    var styleselect = function () {
      return $_2byzekz2jd24rmop.forToolbar('style-formats', function (button) {
        editor.fire('toReading');
        realm.dropup().appear(styleFormatsMenu, Toggling.on, button);
      }, $_9vyb2vw4jd24rmen.derive([
        Toggling.config({
          toggleClass: $_4i0vdoz1jd24rmoo.resolve('toolbar-button-selected'),
          toggleOnExecute: false,
          aria: { mode: 'pressed' }
        }),
        Receiving.config({
          channels: $_bzffwwx6jd24rmit.wrapAll([
            $_xzzzbz0jd24rmol.receive($_11cbmdyojd24rmn5.orientationChanged(), Toggling.off),
            $_xzzzbz0jd24rmol.receive($_11cbmdyojd24rmn5.dropupDismissed(), Toggling.off)
          ])
        })
      ]));
    };
    var feature = function (prereq, sketch) {
      return {
        isSupported: function () {
          return prereq.forall(function (p) {
            return $_bzffwwx6jd24rmit.hasKey(editor.buttons, p);
          });
        },
        sketch: sketch
      };
    };
    return {
      undo: feature($_asi680wajd24rmfv.none(), undo),
      redo: feature($_asi680wajd24rmfv.none(), redo),
      bold: feature($_asi680wajd24rmfv.none(), bold),
      italic: feature($_asi680wajd24rmfv.none(), italic),
      underline: feature($_asi680wajd24rmfv.none(), underline),
      removeformat: feature($_asi680wajd24rmfv.none(), removeformat),
      link: feature($_asi680wajd24rmfv.none(), link),
      unlink: feature($_asi680wajd24rmfv.none(), unlink),
      image: feature($_asi680wajd24rmfv.none(), image),
      bullist: feature($_asi680wajd24rmfv.some('bullist'), bullist),
      numlist: feature($_asi680wajd24rmfv.some('numlist'), numlist),
      fontsizeselect: feature($_asi680wajd24rmfv.none(), fontsizeselect),
      forecolor: feature($_asi680wajd24rmfv.none(), forecolor),
      styleselect: feature($_asi680wajd24rmfv.none(), styleselect)
    };
  };
  var detect$4 = function (settings, features) {
    var itemNames = identify(settings);
    var present = {};
    return $_3vsestw9jd24rmfo.bind(itemNames, function (iName) {
      var r = !$_bzffwwx6jd24rmit.hasKey(present, iName) && $_bzffwwx6jd24rmit.hasKey(features, iName) && features[iName].isSupported() ? [features[iName].sketch()] : [];
      present[iName] = true;
      return r;
    });
  };
  var $_8lfc2oypjd24rmn7 = {
    identify: identify,
    setup: setup,
    detect: detect$4
  };

  var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
    return {
      'target': $_aoet5bwbjd24rmfz.constant(target),
      'x': $_aoet5bwbjd24rmfz.constant(x),
      'y': $_aoet5bwbjd24rmfz.constant(y),
      'stop': stop,
      'prevent': prevent,
      'kill': kill,
      'raw': $_aoet5bwbjd24rmfz.constant(raw)
    };
  };
  var handle = function (filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent))
        return;
      var target = $_ei6gqxwtjd24rmh8.fromDom(rawEvent.target);
      var stop = function () {
        rawEvent.stopPropagation();
      };
      var prevent = function () {
        rawEvent.preventDefault();
      };
      var kill = $_aoet5bwbjd24rmfz.compose(prevent, stop);
      var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
      handler(evt);
    };
  };
  var binder = function (element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: $_aoet5bwbjd24rmfz.curry(unbind, element, event, wrapped, useCapture) };
  };
  var bind$1 = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, false);
  };
  var capture = function (element, event, filter, handler) {
    return binder(element, event, filter, handler, true);
  };
  var unbind = function (element, event, handler, useCapture) {
    element.dom().removeEventListener(event, handler, useCapture);
  };
  var $_5sizd213ljd24rn93 = {
    bind: bind$1,
    capture: capture
  };

  var filter$1 = $_aoet5bwbjd24rmfz.constant(true);
  var bind$2 = function (element, event, handler) {
    return $_5sizd213ljd24rn93.bind(element, event, filter$1, handler);
  };
  var capture$1 = function (element, event, handler) {
    return $_5sizd213ljd24rn93.capture(element, event, filter$1, handler);
  };
  var $_a4ythl13kjd24rn91 = {
    bind: bind$2,
    capture: capture$1
  };

  var INTERVAL = 50;
  var INSURANCE = 1000 / INTERVAL;
  var get$11 = function (outerWindow) {
    var isPortrait = outerWindow.matchMedia('(orientation: portrait)').matches;
    return { isPortrait: $_aoet5bwbjd24rmfz.constant(isPortrait) };
  };
  var getActualWidth = function (outerWindow) {
    var isIos = $_1616jcwgjd24rmg9.detect().os.isiOS();
    var isPortrait = get$11(outerWindow).isPortrait();
    return isIos && !isPortrait ? outerWindow.screen.height : outerWindow.screen.width;
  };
  var onChange = function (outerWindow, listeners) {
    var win = $_ei6gqxwtjd24rmh8.fromDom(outerWindow);
    var poller = null;
    var change = function () {
      clearInterval(poller);
      var orientation = get$11(outerWindow);
      listeners.onChange(orientation);
      onAdjustment(function () {
        listeners.onReady(orientation);
      });
    };
    var orientationHandle = $_a4ythl13kjd24rn91.bind(win, 'orientationchange', change);
    var onAdjustment = function (f) {
      clearInterval(poller);
      var flag = outerWindow.innerHeight;
      var insurance = 0;
      poller = setInterval(function () {
        if (flag !== outerWindow.innerHeight) {
          clearInterval(poller);
          f($_asi680wajd24rmfv.some(outerWindow.innerHeight));
        } else if (insurance > INSURANCE) {
          clearInterval(poller);
          f($_asi680wajd24rmfv.none());
        }
        insurance++;
      }, INTERVAL);
    };
    var destroy = function () {
      orientationHandle.unbind();
    };
    return {
      onAdjustment: onAdjustment,
      destroy: destroy
    };
  };
  var $_fnc6j613jjd24rn8v = {
    get: get$11,
    onChange: onChange,
    getActualWidth: getActualWidth
  };

  function DelayedFunction (fun, delay) {
    var ref = null;
    var schedule = function () {
      var args = arguments;
      ref = setTimeout(function () {
        fun.apply(null, args);
        ref = null;
      }, delay);
    };
    var cancel = function () {
      if (ref !== null) {
        clearTimeout(ref);
        ref = null;
      }
    };
    return {
      cancel: cancel,
      schedule: schedule
    };
  }

  var SIGNIFICANT_MOVE = 5;
  var LONGPRESS_DELAY = 400;
  var getTouch = function (event) {
    if (event.raw().touches === undefined || event.raw().touches.length !== 1)
      return $_asi680wajd24rmfv.none();
    return $_asi680wajd24rmfv.some(event.raw().touches[0]);
  };
  var isFarEnough = function (touch, data) {
    var distX = Math.abs(touch.clientX - data.x());
    var distY = Math.abs(touch.clientY - data.y());
    return distX > SIGNIFICANT_MOVE || distY > SIGNIFICANT_MOVE;
  };
  var monitor = function (settings) {
    var startData = Cell($_asi680wajd24rmfv.none());
    var longpress = DelayedFunction(function (event) {
      startData.set($_asi680wajd24rmfv.none());
      settings.triggerEvent($_9am11ywwjd24rmhg.longpress(), event);
    }, LONGPRESS_DELAY);
    var handleTouchstart = function (event) {
      getTouch(event).each(function (touch) {
        longpress.cancel();
        var data = {
          x: $_aoet5bwbjd24rmfz.constant(touch.clientX),
          y: $_aoet5bwbjd24rmfz.constant(touch.clientY),
          target: event.target
        };
        longpress.schedule(data);
        startData.set($_asi680wajd24rmfv.some(data));
      });
      return $_asi680wajd24rmfv.none();
    };
    var handleTouchmove = function (event) {
      longpress.cancel();
      getTouch(event).each(function (touch) {
        startData.get().each(function (data) {
          if (isFarEnough(touch, data))
            startData.set($_asi680wajd24rmfv.none());
        });
      });
      return $_asi680wajd24rmfv.none();
    };
    var handleTouchend = function (event) {
      longpress.cancel();
      var isSame = function (data) {
        return $_237cqww8jd24rmfh.eq(data.target(), event.target());
      };
      return startData.get().filter(isSame).map(function (data) {
        return settings.triggerEvent($_9am11ywwjd24rmhg.tap(), event);
      });
    };
    var handlers = $_bzffwwx6jd24rmit.wrapAll([
      {
        key: $_1tcfm9wxjd24rmhk.touchstart(),
        value: handleTouchstart
      },
      {
        key: $_1tcfm9wxjd24rmhk.touchmove(),
        value: handleTouchmove
      },
      {
        key: $_1tcfm9wxjd24rmhk.touchend(),
        value: handleTouchend
      }
    ]);
    var fireIfReady = function (event, type) {
      return $_bzffwwx6jd24rmit.readOptFrom(handlers, type).bind(function (handler) {
        return handler(event);
      });
    };
    return { fireIfReady: fireIfReady };
  };
  var $_ayp3zn13rjd24rn9x = { monitor: monitor };

  var monitor$1 = function (editorApi) {
    var tapEvent = $_ayp3zn13rjd24rn9x.monitor({
      triggerEvent: function (type, evt) {
        editorApi.onTapContent(evt);
      }
    });
    var onTouchend = function () {
      return $_a4ythl13kjd24rn91.bind(editorApi.body(), 'touchend', function (evt) {
        tapEvent.fireIfReady(evt, 'touchend');
      });
    };
    var onTouchmove = function () {
      return $_a4ythl13kjd24rn91.bind(editorApi.body(), 'touchmove', function (evt) {
        tapEvent.fireIfReady(evt, 'touchmove');
      });
    };
    var fireTouchstart = function (evt) {
      tapEvent.fireIfReady(evt, 'touchstart');
    };
    return {
      fireTouchstart: fireTouchstart,
      onTouchend: onTouchend,
      onTouchmove: onTouchmove
    };
  };
  var $_6ujzs213qjd24rn9u = { monitor: monitor$1 };

  var isAndroid6 = $_1616jcwgjd24rmg9.detect().os.version.major >= 6;
  var initEvents = function (editorApi, toolstrip, alloy) {
    var tapping = $_6ujzs213qjd24rn9u.monitor(editorApi);
    var outerDoc = $_5on3koy3jd24rmlg.owner(toolstrip);
    var isRanged = function (sel) {
      return !$_237cqww8jd24rmfh.eq(sel.start(), sel.finish()) || sel.soffset() !== sel.foffset();
    };
    var hasRangeInUi = function () {
      return $_9uflcdygjd24rmmn.active(outerDoc).filter(function (input) {
        return $_5fvhg7xxjd24rmkz.name(input) === 'input';
      }).exists(function (input) {
        return input.dom().selectionStart !== input.dom().selectionEnd;
      });
    };
    var updateMargin = function () {
      var rangeInContent = editorApi.doc().dom().hasFocus() && editorApi.getSelection().exists(isRanged);
      alloy.getByDom(toolstrip).each((rangeInContent || hasRangeInUi()) === true ? Toggling.on : Toggling.off);
    };
    var listeners = [
      $_a4ythl13kjd24rn91.bind(editorApi.body(), 'touchstart', function (evt) {
        editorApi.onTouchContent();
        tapping.fireTouchstart(evt);
      }),
      tapping.onTouchmove(),
      tapping.onTouchend(),
      $_a4ythl13kjd24rn91.bind(toolstrip, 'touchstart', function (evt) {
        editorApi.onTouchToolstrip();
      }),
      editorApi.onToReading(function () {
        $_9uflcdygjd24rmmn.blur(editorApi.body());
      }),
      editorApi.onToEditing($_aoet5bwbjd24rmfz.noop),
      editorApi.onScrollToCursor(function (tinyEvent) {
        tinyEvent.preventDefault();
        editorApi.getCursorBox().each(function (bounds) {
          var cWin = editorApi.win();
          var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
          var cScrollBy = isOutside ? bounds.bottom() - cWin.innerHeight + 50 : 0;
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      })
    ].concat(isAndroid6 === true ? [] : [
      $_a4ythl13kjd24rn91.bind($_ei6gqxwtjd24rmh8.fromDom(editorApi.win()), 'blur', function () {
        alloy.getByDom(toolstrip).each(Toggling.off);
      }),
      $_a4ythl13kjd24rn91.bind(outerDoc, 'select', updateMargin),
      $_a4ythl13kjd24rn91.bind(editorApi.doc(), 'selectionchange', updateMargin)
    ]);
    var destroy = function () {
      $_3vsestw9jd24rmfo.each(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var $_7h0reb13pjd24rn9l = { initEvents: initEvents };

  var autocompleteHack = function () {
    return function (f) {
      setTimeout(function () {
        f();
      }, 0);
    };
  };
  var resume = function (cWin) {
    cWin.focus();
    var iBody = $_ei6gqxwtjd24rmh8.fromDom(cWin.document.body);
    var inInput = $_9uflcdygjd24rmmn.active().exists(function (elem) {
      return $_3vsestw9jd24rmfo.contains([
        'input',
        'textarea'
      ], $_5fvhg7xxjd24rmkz.name(elem));
    });
    var transaction = inInput ? autocompleteHack() : $_aoet5bwbjd24rmfz.apply;
    transaction(function () {
      $_9uflcdygjd24rmmn.active().each($_9uflcdygjd24rmmn.blur);
      $_9uflcdygjd24rmmn.focus(iBody);
    });
  };
  var $_ayxhsv13ujd24rnab = { resume: resume };

  var safeParse = function (element, attribute) {
    var parsed = parseInt($_dxjq1vxwjd24rmkv.get(element, attribute), 10);
    return isNaN(parsed) ? 0 : parsed;
  };
  var $_6aqaow13vjd24rnag = { safeParse: safeParse };

  function NodeValue (is, name) {
    var get = function (element) {
      if (!is(element))
        throw new Error('Can only get ' + name + ' value of a ' + name + ' node');
      return getOption(element).getOr('');
    };
    var getOptionIE10 = function (element) {
      try {
        return getOptionSafe(element);
      } catch (e) {
        return $_asi680wajd24rmfv.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? $_asi680wajd24rmfv.from(element.dom().nodeValue) : $_asi680wajd24rmfv.none();
    };
    var browser = $_1616jcwgjd24rmg9.detect().browser;
    var getOption = browser.isIE() && browser.version.major === 10 ? getOptionIE10 : getOptionSafe;
    var set = function (element, value) {
      if (!is(element))
        throw new Error('Can only set raw ' + name + ' value of a ' + name + ' node');
      element.dom().nodeValue = value;
    };
    return {
      get: get,
      getOption: getOption,
      set: set
    };
  }

  var api$3 = NodeValue($_5fvhg7xxjd24rmkz.isText, 'text');
  var get$12 = function (element) {
    return api$3.get(element);
  };
  var getOption = function (element) {
    return api$3.getOption(element);
  };
  var set$8 = function (element, value) {
    api$3.set(element, value);
  };
  var $_9n2ajd13yjd24rnaq = {
    get: get$12,
    getOption: getOption,
    set: set$8
  };

  var getEnd = function (element) {
    return $_5fvhg7xxjd24rmkz.name(element) === 'img' ? 1 : $_9n2ajd13yjd24rnaq.getOption(element).fold(function () {
      return $_5on3koy3jd24rmlg.children(element).length;
    }, function (v) {
      return v.length;
    });
  };
  var isEnd = function (element, offset) {
    return getEnd(element) === offset;
  };
  var isStart = function (element, offset) {
    return offset === 0;
  };
  var NBSP = '\xA0';
  var isTextNodeWithCursorPosition = function (el) {
    return $_9n2ajd13yjd24rnaq.getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = [
    'img',
    'br'
  ];
  var isCursorPosition = function (elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || $_3vsestw9jd24rmfo.contains(elementsWithCursorPosition, $_5fvhg7xxjd24rmkz.name(elem));
  };
  var $_c2p01913xjd24rnao = {
    getEnd: getEnd,
    isEnd: isEnd,
    isStart: isStart,
    isCursorPosition: isCursorPosition
  };

  var adt$4 = $_45w193x4jd24rmi8.generate([
    { 'before': ['element'] },
    {
      'on': [
        'element',
        'offset'
      ]
    },
    { after: ['element'] }
  ]);
  var cata = function (subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart = function (situ) {
    return situ.fold($_aoet5bwbjd24rmfz.identity, $_aoet5bwbjd24rmfz.identity, $_aoet5bwbjd24rmfz.identity);
  };
  var $_ebzye6141jd24rnb2 = {
    before: adt$4.before,
    on: adt$4.on,
    after: adt$4.after,
    cata: cata,
    getStart: getStart
  };

  var type$1 = $_45w193x4jd24rmi8.generate([
    { domRange: ['rng'] },
    {
      relative: [
        'startSitu',
        'finishSitu'
      ]
    },
    {
      exact: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var range$1 = $_ws57hxmjd24rmkd.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$1.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart$1 = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_ei6gqxwtjd24rmh8.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_ebzye6141jd24rnb2.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart$1(selection);
    return $_5on3koy3jd24rmlg.defaultView(start);
  };
  var $_9yp6gw140jd24rnay = {
    domRange: type$1.domRange,
    relative: type$1.relative,
    exact: type$1.exact,
    exactFromRange: exactFromRange,
    range: range$1,
    getWin: getWin
  };

  var makeRange = function (start, soffset, finish, foffset) {
    var doc = $_5on3koy3jd24rmlg.owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var commonAncestorContainer = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    return $_ei6gqxwtjd24rmh8.fromDom(r.commonAncestorContainer);
  };
  var after$2 = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = $_237cqww8jd24rmfh.eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };
  var $_ajf3e1143jd24rnb9 = {
    after: after$2,
    commonAncestorContainer: commonAncestorContainer
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_3vsestw9jd24rmfo.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_ei6gqxwtjd24rmh8.fromDom(fragment);
  };
  var $_6ow1i144jd24rnba = { fromElements: fromElements };

  var selectNodeContents = function (win, element) {
    var rng = win.document.createRange();
    selectNodeContentsUsing(rng, element);
    return rng;
  };
  var selectNodeContentsUsing = function (rng, element) {
    rng.selectNodeContents(element.dom());
  };
  var isWithin = function (outerRange, innerRange) {
    return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 && innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
  };
  var create$4 = function (win) {
    return win.document.createRange();
  };
  var setStart = function (rng, situ) {
    situ.fold(function (e) {
      rng.setStartBefore(e.dom());
    }, function (e, o) {
      rng.setStart(e.dom(), o);
    }, function (e) {
      rng.setStartAfter(e.dom());
    });
  };
  var setFinish = function (rng, situ) {
    situ.fold(function (e) {
      rng.setEndBefore(e.dom());
    }, function (e, o) {
      rng.setEnd(e.dom(), o);
    }, function (e) {
      rng.setEndAfter(e.dom());
    });
  };
  var replaceWith = function (rng, fragment) {
    deleteContents(rng);
    rng.insertNode(fragment.dom());
  };
  var relativeToNative = function (win, startSitu, finishSitu) {
    var range = win.document.createRange();
    setStart(range, startSitu);
    setFinish(range, finishSitu);
    return range;
  };
  var exactToNative = function (win, start, soffset, finish, foffset) {
    var rng = win.document.createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var deleteContents = function (rng) {
    rng.deleteContents();
  };
  var cloneFragment = function (rng) {
    var fragment = rng.cloneContents();
    return $_ei6gqxwtjd24rmh8.fromDom(fragment);
  };
  var toRect = function (rect) {
    return {
      left: $_aoet5bwbjd24rmfz.constant(rect.left),
      top: $_aoet5bwbjd24rmfz.constant(rect.top),
      right: $_aoet5bwbjd24rmfz.constant(rect.right),
      bottom: $_aoet5bwbjd24rmfz.constant(rect.bottom),
      width: $_aoet5bwbjd24rmfz.constant(rect.width),
      height: $_aoet5bwbjd24rmfz.constant(rect.height)
    };
  };
  var getFirstRect = function (rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_asi680wajd24rmfv.some(rect).map(toRect) : $_asi680wajd24rmfv.none();
  };
  var getBounds = function (rng) {
    var rect = rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_asi680wajd24rmfv.some(rect).map(toRect) : $_asi680wajd24rmfv.none();
  };
  var toString$1 = function (rng) {
    return rng.toString();
  };
  var $_8o49a3145jd24rnbd = {
    create: create$4,
    replaceWith: replaceWith,
    selectNodeContents: selectNodeContents,
    selectNodeContentsUsing: selectNodeContentsUsing,
    relativeToNative: relativeToNative,
    exactToNative: exactToNative,
    deleteContents: deleteContents,
    cloneFragment: cloneFragment,
    getFirstRect: getFirstRect,
    getBounds: getBounds,
    isWithin: isWithin,
    toString: toString$1
  };

  var adt$5 = $_45w193x4jd24rmi8.generate([
    {
      ltr: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    },
    {
      rtl: [
        'start',
        'soffset',
        'finish',
        'foffset'
      ]
    }
  ]);
  var fromRange = function (win, type, range) {
    return type($_ei6gqxwtjd24rmh8.fromDom(range.startContainer), range.startOffset, $_ei6gqxwtjd24rmh8.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function (win, selection) {
    return selection.match({
      domRange: function (rng) {
        return {
          ltr: $_aoet5bwbjd24rmfz.constant(rng),
          rtl: $_asi680wajd24rmfv.none
        };
      },
      relative: function (startSitu, finishSitu) {
        return {
          ltr: $_4myblwwhjd24rmgb.cached(function () {
            return $_8o49a3145jd24rnbd.relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: $_4myblwwhjd24rmgb.cached(function () {
            return $_asi680wajd24rmfv.some($_8o49a3145jd24rnbd.relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function (start, soffset, finish, foffset) {
        return {
          ltr: $_4myblwwhjd24rmgb.cached(function () {
            return $_8o49a3145jd24rnbd.exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: $_4myblwwhjd24rmgb.cached(function () {
            return $_asi680wajd24rmfv.some($_8o49a3145jd24rnbd.exactToNative(win, finish, foffset, start, soffset));
          })
        };
      }
    });
  };
  var doDiagnose = function (win, ranges) {
    var rng = ranges.ltr();
    if (rng.collapsed) {
      var reversed = ranges.rtl().filter(function (rev) {
        return rev.collapsed === false;
      });
      return reversed.map(function (rev) {
        return adt$5.rtl($_ei6gqxwtjd24rmh8.fromDom(rev.endContainer), rev.endOffset, $_ei6gqxwtjd24rmh8.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$5.ltr, rng);
      });
    } else {
      return fromRange(win, adt$5.ltr, rng);
    }
  };
  var diagnose = function (win, selection) {
    var ranges = getRanges(win, selection);
    return doDiagnose(win, ranges);
  };
  var asLtrRange = function (win, selection) {
    var diagnosis = diagnose(win, selection);
    return diagnosis.match({
      ltr: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(start.dom(), soffset);
        rng.setEnd(finish.dom(), foffset);
        return rng;
      },
      rtl: function (start, soffset, finish, foffset) {
        var rng = win.document.createRange();
        rng.setStart(finish.dom(), foffset);
        rng.setEnd(start.dom(), soffset);
        return rng;
      }
    });
  };
  var $_2akbom146jd24rnbi = {
    ltr: adt$5.ltr,
    rtl: adt$5.rtl,
    diagnose: diagnose,
    asLtrRange: asLtrRange
  };

  var searchForPoint = function (rectForOffset, x, y, maxX, length) {
    if (length === 0)
      return 0;
    else if (x === maxX)
      return length - 1;
    var xDelta = maxX;
    for (var i = 1; i < length; i++) {
      var rect = rectForOffset(i);
      var curDeltaX = Math.abs(x - rect.left);
      if (y > rect.bottom) {
      } else if (y < rect.top || curDeltaX > xDelta) {
        return i - 1;
      } else {
        xDelta = curDeltaX;
      }
    }
    return 0;
  };
  var inRect = function (rect, x, y) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  var $_8lanyh149jd24rnbv = {
    inRect: inRect,
    searchForPoint: searchForPoint
  };

  var locateOffset = function (doc, textnode, x, y, rect) {
    var rangeForOffset = function (offset) {
      var r = doc.dom().createRange();
      r.setStart(textnode.dom(), offset);
      r.collapse(true);
      return r;
    };
    var rectForOffset = function (offset) {
      var r = rangeForOffset(offset);
      return r.getBoundingClientRect();
    };
    var length = $_9n2ajd13yjd24rnaq.get(textnode).length;
    var offset = $_8lanyh149jd24rnbv.searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate$1 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = $_dq6bfmyejd24rmml.findMap(rects, function (rect) {
      return $_8lanyh149jd24rnbv.inRect(rect, x, y) ? $_asi680wajd24rmfv.some(rect) : $_asi680wajd24rmfv.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };
  var $_6pqxu214ajd24rnbw = { locate: locate$1 };

  var searchInChildren = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = $_5on3koy3jd24rmlg.children(node);
    return $_dq6bfmyejd24rmml.findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return $_8lanyh149jd24rnbv.inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : $_asi680wajd24rmfv.none();
    });
  };
  var locateNode = function (doc, node, x, y) {
    var locator = $_5fvhg7xxjd24rmkz.isText(node) ? $_6pqxu214ajd24rnbw.locate : searchInChildren;
    return locator(doc, node, x, y);
  };
  var locate$2 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };
  var $_dzv2t6148jd24rnbr = { locate: locate$2 };

  var first$3 = function (element) {
    return $_en3fpayijd24rmmt.descendant(element, $_c2p01913xjd24rnao.isCursorPosition);
  };
  var last$2 = function (element) {
    return descendantRtl(element, $_c2p01913xjd24rnao.isCursorPosition);
  };
  var descendantRtl = function (scope, predicate) {
    var descend = function (element) {
      var children = $_5on3koy3jd24rmlg.children(element);
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (predicate(child))
          return $_asi680wajd24rmfv.some(child);
        var res = descend(child);
        if (res.isSome())
          return res;
      }
      return $_asi680wajd24rmfv.none();
    };
    return descend(scope);
  };
  var $_5jupvl14cjd24rnc3 = {
    first: first$3,
    last: last$2
  };

  var COLLAPSE_TO_LEFT = true;
  var COLLAPSE_TO_RIGHT = false;
  var getCollapseDirection = function (rect, x) {
    return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT;
  };
  var createCollapsedNode = function (doc, target, collapseDirection) {
    var r = doc.dom().createRange();
    r.selectNode(target.dom());
    r.collapse(collapseDirection);
    return r;
  };
  var locateInElement = function (doc, node, x) {
    var cursorRange = doc.dom().createRange();
    cursorRange.selectNode(node.dom());
    var rect = cursorRange.getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    var f = collapseDirection === COLLAPSE_TO_LEFT ? $_5jupvl14cjd24rnc3.first : $_5jupvl14cjd24rnc3.last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function (doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return $_asi680wajd24rmfv.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search$1 = function (doc, node, x) {
    var f = $_5on3koy3jd24rmlg.children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };
  var $_97o0co14bjd24rnc0 = { search: search$1 };

  var caretPositionFromPoint = function (doc, x, y) {
    return $_asi680wajd24rmfv.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null)
        return $_asi680wajd24rmfv.none();
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return $_asi680wajd24rmfv.some(r);
    });
  };
  var caretRangeFromPoint = function (doc, x, y) {
    return $_asi680wajd24rmfv.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return $_dzv2t6148jd24rnbr.locate(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function (doc, x, y) {
    return $_ei6gqxwtjd24rmh8.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function () {
        return $_97o0co14bjd24rnc0.search(doc, elem, x);
      };
      return $_5on3koy3jd24rmlg.children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;
  var fromPoint$1 = function (win, x, y) {
    var doc = $_ei6gqxwtjd24rmh8.fromDom(win.document);
    return availableSearch(doc, x, y).map(function (rng) {
      return $_9yp6gw140jd24rnay.range($_ei6gqxwtjd24rmh8.fromDom(rng.startContainer), rng.startOffset, $_ei6gqxwtjd24rmh8.fromDom(rng.endContainer), rng.endOffset);
    });
  };
  var $_115khh147jd24rnbo = { fromPoint: fromPoint$1 };

  var withinContainer = function (win, ancestor, outerRange, selector) {
    var innerRange = $_8o49a3145jd24rnbd.create(win);
    var self = $_afm3pxwsjd24rmh3.is(ancestor, selector) ? [ancestor] : [];
    var elements = self.concat($_dew4q4zkjd24rmqh.descendants(ancestor, selector));
    return $_3vsestw9jd24rmfo.filter(elements, function (elem) {
      $_8o49a3145jd24rnbd.selectNodeContentsUsing(innerRange, elem);
      return $_8o49a3145jd24rnbd.isWithin(outerRange, innerRange);
    });
  };
  var find$4 = function (win, selection, selector) {
    var outerRange = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    var ancestor = $_ei6gqxwtjd24rmh8.fromDom(outerRange.commonAncestorContainer);
    return $_5fvhg7xxjd24rmkz.isElement(ancestor) ? withinContainer(win, ancestor, outerRange, selector) : [];
  };
  var $_avhzn214djd24rnc5 = { find: find$4 };

  var beforeSpecial = function (element, offset) {
    var name = $_5fvhg7xxjd24rmkz.name(element);
    if ('input' === name)
      return $_ebzye6141jd24rnb2.after(element);
    else if (!$_3vsestw9jd24rmfo.contains([
        'br',
        'img'
      ], name))
      return $_ebzye6141jd24rnb2.on(element, offset);
    else
      return offset === 0 ? $_ebzye6141jd24rnb2.before(element) : $_ebzye6141jd24rnb2.after(element);
  };
  var preprocessRelative = function (startSitu, finishSitu) {
    var start = startSitu.fold($_ebzye6141jd24rnb2.before, beforeSpecial, $_ebzye6141jd24rnb2.after);
    var finish = finishSitu.fold($_ebzye6141jd24rnb2.before, beforeSpecial, $_ebzye6141jd24rnb2.after);
    return $_9yp6gw140jd24rnay.relative(start, finish);
  };
  var preprocessExact = function (start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return $_9yp6gw140jd24rnay.relative(startSitu, finishSitu);
  };
  var preprocess = function (selection) {
    return selection.match({
      domRange: function (rng) {
        var start = $_ei6gqxwtjd24rmh8.fromDom(rng.startContainer);
        var finish = $_ei6gqxwtjd24rmh8.fromDom(rng.endContainer);
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset);
      },
      relative: preprocessRelative,
      exact: preprocessExact
    });
  };
  var $_16idbr14ejd24rnc8 = {
    beforeSpecial: beforeSpecial,
    preprocess: preprocess,
    preprocessRelative: preprocessRelative,
    preprocessExact: preprocessExact
  };

  var doSetNativeRange = function (win, rng) {
    $_asi680wajd24rmfv.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function (win, start, soffset, finish, foffset) {
    var rng = $_8o49a3145jd24rnbd.exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var findWithin = function (win, selection, selector) {
    return $_avhzn214djd24rnc5.find(win, selection, selector);
  };
  var setRangeFromRelative = function (win, relative) {
    return $_2akbom146jd24rnbi.diagnose(win, relative).match({
      ltr: function (start, soffset, finish, foffset) {
        doSetRange(win, start, soffset, finish, foffset);
      },
      rtl: function (start, soffset, finish, foffset) {
        var selection = win.getSelection();
        if (selection.extend) {
          selection.collapse(start.dom(), soffset);
          selection.extend(finish.dom(), foffset);
        } else {
          doSetRange(win, finish, foffset, start, soffset);
        }
      }
    });
  };
  var setExact = function (win, start, soffset, finish, foffset) {
    var relative = $_16idbr14ejd24rnc8.preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var setRelative = function (win, startSitu, finishSitu) {
    var relative = $_16idbr14ejd24rnc8.preprocessRelative(startSitu, finishSitu);
    setRangeFromRelative(win, relative);
  };
  var toNative = function (selection) {
    var win = $_9yp6gw140jd24rnay.getWin(selection).dom();
    var getDomRange = function (start, soffset, finish, foffset) {
      return $_8o49a3145jd24rnbd.exactToNative(win, start, soffset, finish, foffset);
    };
    var filtered = $_16idbr14ejd24rnc8.preprocess(selection);
    return $_2akbom146jd24rnbi.diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    });
  };
  var readRange = function (selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return $_asi680wajd24rmfv.some($_9yp6gw140jd24rnay.range($_ei6gqxwtjd24rmh8.fromDom(firstRng.startContainer), firstRng.startOffset, $_ei6gqxwtjd24rmh8.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return $_asi680wajd24rmfv.none();
    }
  };
  var doGetExact = function (selection) {
    var anchorNode = $_ei6gqxwtjd24rmh8.fromDom(selection.anchorNode);
    var focusNode = $_ei6gqxwtjd24rmh8.fromDom(selection.focusNode);
    return $_ajf3e1143jd24rnb9.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? $_asi680wajd24rmfv.some($_9yp6gw140jd24rnay.range($_ei6gqxwtjd24rmh8.fromDom(selection.anchorNode), selection.anchorOffset, $_ei6gqxwtjd24rmh8.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection);
  };
  var setToElement = function (win, element) {
    var rng = $_8o49a3145jd24rnbd.selectNodeContents(win, element);
    doSetNativeRange(win, rng);
  };
  var forElement = function (win, element) {
    var rng = $_8o49a3145jd24rnbd.selectNodeContents(win, element);
    return $_9yp6gw140jd24rnay.range($_ei6gqxwtjd24rmh8.fromDom(rng.startContainer), rng.startOffset, $_ei6gqxwtjd24rmh8.fromDom(rng.endContainer), rng.endOffset);
  };
  var getExact = function (win) {
    var selection = win.getSelection();
    return selection.rangeCount > 0 ? doGetExact(selection) : $_asi680wajd24rmfv.none();
  };
  var get$13 = function (win) {
    return getExact(win).map(function (range) {
      return $_9yp6gw140jd24rnay.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect$1 = function (win, selection) {
    var rng = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    return $_8o49a3145jd24rnbd.getFirstRect(rng);
  };
  var getBounds$1 = function (win, selection) {
    var rng = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    return $_8o49a3145jd24rnbd.getBounds(rng);
  };
  var getAtPoint = function (win, x, y) {
    return $_115khh147jd24rnbo.fromPoint(win, x, y);
  };
  var getAsString = function (win, selection) {
    var rng = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    return $_8o49a3145jd24rnbd.toString(rng);
  };
  var clear$1 = function (win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };
  var clone$3 = function (win, selection) {
    var rng = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    return $_8o49a3145jd24rnbd.cloneFragment(rng);
  };
  var replace = function (win, selection, elements) {
    var rng = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    var fragment = $_6ow1i144jd24rnba.fromElements(elements, win.document);
    $_8o49a3145jd24rnbd.replaceWith(rng, fragment);
  };
  var deleteAt = function (win, selection) {
    var rng = $_2akbom146jd24rnbi.asLtrRange(win, selection);
    $_8o49a3145jd24rnbd.deleteContents(rng);
  };
  var isCollapsed = function (start, soffset, finish, foffset) {
    return $_237cqww8jd24rmfh.eq(start, finish) && soffset === foffset;
  };
  var $_8k37tk142jd24rnb5 = {
    setExact: setExact,
    getExact: getExact,
    get: get$13,
    setRelative: setRelative,
    toNative: toNative,
    setToElement: setToElement,
    clear: clear$1,
    clone: clone$3,
    replace: replace,
    deleteAt: deleteAt,
    forElement: forElement,
    getFirstRect: getFirstRect$1,
    getBounds: getBounds$1,
    getAtPoint: getAtPoint,
    findWithin: findWithin,
    getAsString: getAsString,
    isCollapsed: isCollapsed
  };

  var COLLAPSED_WIDTH = 2;
  var collapsedRect = function (rect) {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: $_aoet5bwbjd24rmfz.constant(COLLAPSED_WIDTH),
      height: rect.height
    };
  };
  var toRect$1 = function (rawRect) {
    return {
      left: $_aoet5bwbjd24rmfz.constant(rawRect.left),
      top: $_aoet5bwbjd24rmfz.constant(rawRect.top),
      right: $_aoet5bwbjd24rmfz.constant(rawRect.right),
      bottom: $_aoet5bwbjd24rmfz.constant(rawRect.bottom),
      width: $_aoet5bwbjd24rmfz.constant(rawRect.width),
      height: $_aoet5bwbjd24rmfz.constant(rawRect.height)
    };
  };
  var getRectsFromRange = function (range) {
    if (!range.collapsed) {
      return $_3vsestw9jd24rmfo.map(range.getClientRects(), toRect$1);
    } else {
      var start_1 = $_ei6gqxwtjd24rmh8.fromDom(range.startContainer);
      return $_5on3koy3jd24rmlg.parent(start_1).bind(function (parent) {
        var selection = $_9yp6gw140jd24rnay.exact(start_1, range.startOffset, parent, $_c2p01913xjd24rnao.getEnd(parent));
        var optRect = $_8k37tk142jd24rnb5.getFirstRect(range.startContainer.ownerDocument.defaultView, selection);
        return optRect.map(collapsedRect).map($_3vsestw9jd24rmfo.pure);
      }).getOr([]);
    }
  };
  var getRectangles = function (cWin) {
    var sel = cWin.getSelection();
    return sel !== undefined && sel.rangeCount > 0 ? getRectsFromRange(sel.getRangeAt(0)) : [];
  };
  var $_a8y1rq13wjd24rnai = { getRectangles: getRectangles };

  var EXTRA_SPACING = 50;
  var data = 'data-' + $_4i0vdoz1jd24rmoo.resolve('last-outer-height');
  var setLastHeight = function (cBody, value) {
    $_dxjq1vxwjd24rmkv.set(cBody, data, value);
  };
  var getLastHeight = function (cBody) {
    return $_6aqaow13vjd24rnag.safeParse(cBody, data);
  };
  var getBoundsFrom = function (rect) {
    return {
      top: $_aoet5bwbjd24rmfz.constant(rect.top()),
      bottom: $_aoet5bwbjd24rmfz.constant(rect.top() + rect.height())
    };
  };
  var getBounds$2 = function (cWin) {
    var rects = $_a8y1rq13wjd24rnai.getRectangles(cWin);
    return rects.length > 0 ? $_asi680wajd24rmfv.some(rects[0]).map(getBoundsFrom) : $_asi680wajd24rmfv.none();
  };
  var findDelta = function (outerWindow, cBody) {
    var last = getLastHeight(cBody);
    var current = outerWindow.innerHeight;
    return last > current ? $_asi680wajd24rmfv.some(last - current) : $_asi680wajd24rmfv.none();
  };
  var calculate = function (cWin, bounds, delta) {
    var isOutside = bounds.top() > cWin.innerHeight || bounds.bottom() > cWin.innerHeight;
    return isOutside ? Math.min(delta, bounds.bottom() - cWin.innerHeight + EXTRA_SPACING) : 0;
  };
  var setup$1 = function (outerWindow, cWin) {
    var cBody = $_ei6gqxwtjd24rmh8.fromDom(cWin.document.body);
    var toEditing = function () {
      $_ayxhsv13ujd24rnab.resume(cWin);
    };
    var onResize = $_a4ythl13kjd24rn91.bind($_ei6gqxwtjd24rmh8.fromDom(outerWindow), 'resize', function () {
      findDelta(outerWindow, cBody).each(function (delta) {
        getBounds$2(cWin).each(function (bounds) {
          var cScrollBy = calculate(cWin, bounds, delta);
          if (cScrollBy !== 0) {
            cWin.scrollTo(cWin.pageXOffset, cWin.pageYOffset + cScrollBy);
          }
        });
      });
      setLastHeight(cBody, outerWindow.innerHeight);
    });
    setLastHeight(cBody, outerWindow.innerHeight);
    var destroy = function () {
      onResize.unbind();
    };
    return {
      toEditing: toEditing,
      destroy: destroy
    };
  };
  var $_eqh2kx13tjd24rna5 = { setup: setup$1 };

  var getBodyFromFrame = function (frame) {
    return $_asi680wajd24rmfv.some($_ei6gqxwtjd24rmh8.fromDom(frame.dom().contentWindow.document.body));
  };
  var getDocFromFrame = function (frame) {
    return $_asi680wajd24rmfv.some($_ei6gqxwtjd24rmh8.fromDom(frame.dom().contentWindow.document));
  };
  var getWinFromFrame = function (frame) {
    return $_asi680wajd24rmfv.from(frame.dom().contentWindow);
  };
  var getSelectionFromFrame = function (frame) {
    var optWin = getWinFromFrame(frame);
    return optWin.bind($_8k37tk142jd24rnb5.getExact);
  };
  var getFrame = function (editor) {
    return editor.getFrame();
  };
  var getOrDerive = function (name, f) {
    return function (editor) {
      var g = editor[name].getOrThunk(function () {
        var frame = getFrame(editor);
        return function () {
          return f(frame);
        };
      });
      return g();
    };
  };
  var getOrListen = function (editor, doc, name, type) {
    return editor[name].getOrThunk(function () {
      return function (handler) {
        return $_a4ythl13kjd24rn91.bind(doc, type, handler);
      };
    });
  };
  var toRect$2 = function (rect) {
    return {
      left: $_aoet5bwbjd24rmfz.constant(rect.left),
      top: $_aoet5bwbjd24rmfz.constant(rect.top),
      right: $_aoet5bwbjd24rmfz.constant(rect.right),
      bottom: $_aoet5bwbjd24rmfz.constant(rect.bottom),
      width: $_aoet5bwbjd24rmfz.constant(rect.width),
      height: $_aoet5bwbjd24rmfz.constant(rect.height)
    };
  };
  var getActiveApi = function (editor) {
    var frame = getFrame(editor);
    var tryFallbackBox = function (win) {
      var isCollapsed = function (sel) {
        return $_237cqww8jd24rmfh.eq(sel.start(), sel.finish()) && sel.soffset() === sel.foffset();
      };
      var toStartRect = function (sel) {
        var rect = sel.start().dom().getBoundingClientRect();
        return rect.width > 0 || rect.height > 0 ? $_asi680wajd24rmfv.some(rect).map(toRect$2) : $_asi680wajd24rmfv.none();
      };
      return $_8k37tk142jd24rnb5.getExact(win).filter(isCollapsed).bind(toStartRect);
    };
    return getBodyFromFrame(frame).bind(function (body) {
      return getDocFromFrame(frame).bind(function (doc) {
        return getWinFromFrame(frame).map(function (win) {
          var html = $_ei6gqxwtjd24rmh8.fromDom(doc.dom().documentElement);
          var getCursorBox = editor.getCursorBox.getOrThunk(function () {
            return function () {
              return $_8k37tk142jd24rnb5.get(win).bind(function (sel) {
                return $_8k37tk142jd24rnb5.getFirstRect(win, sel).orThunk(function () {
                  return tryFallbackBox(win);
                });
              });
            };
          });
          var setSelection = editor.setSelection.getOrThunk(function () {
            return function (start, soffset, finish, foffset) {
              $_8k37tk142jd24rnb5.setExact(win, start, soffset, finish, foffset);
            };
          });
          var clearSelection = editor.clearSelection.getOrThunk(function () {
            return function () {
              $_8k37tk142jd24rnb5.clear(win);
            };
          });
          return {
            body: $_aoet5bwbjd24rmfz.constant(body),
            doc: $_aoet5bwbjd24rmfz.constant(doc),
            win: $_aoet5bwbjd24rmfz.constant(win),
            html: $_aoet5bwbjd24rmfz.constant(html),
            getSelection: $_aoet5bwbjd24rmfz.curry(getSelectionFromFrame, frame),
            setSelection: setSelection,
            clearSelection: clearSelection,
            frame: $_aoet5bwbjd24rmfz.constant(frame),
            onKeyup: getOrListen(editor, doc, 'onKeyup', 'keyup'),
            onNodeChanged: getOrListen(editor, doc, 'onNodeChanged', 'selectionchange'),
            onDomChanged: editor.onDomChanged,
            onScrollToCursor: editor.onScrollToCursor,
            onScrollToElement: editor.onScrollToElement,
            onToReading: editor.onToReading,
            onToEditing: editor.onToEditing,
            onToolbarScrollStart: editor.onToolbarScrollStart,
            onTouchContent: editor.onTouchContent,
            onTapContent: editor.onTapContent,
            onTouchToolstrip: editor.onTouchToolstrip,
            getCursorBox: getCursorBox
          };
        });
      });
    });
  };
  var $_7sgs3814fjd24rncf = {
    getBody: getOrDerive('getBody', getBodyFromFrame),
    getDoc: getOrDerive('getDoc', getDocFromFrame),
    getWin: getOrDerive('getWin', getWinFromFrame),
    getSelection: getOrDerive('getSelection', getSelectionFromFrame),
    getFrame: getFrame,
    getActiveApi: getActiveApi
  };

  var attr = 'data-ephox-mobile-fullscreen-style';
  var siblingStyles = 'display:none!important;';
  var ancestorPosition = 'position:absolute!important;';
  var ancestorStyles = 'top:0!important;left:0!important;margin:0' + '!important;padding:0!important;width:100%!important;';
  var bgFallback = 'background-color:rgb(255,255,255)!important;';
  var isAndroid = $_1616jcwgjd24rmg9.detect().os.isAndroid();
  var matchColor = function (editorBody) {
    var color = $_ayz4w9zsjd24rmr3.get(editorBody, 'background-color');
    return color !== undefined && color !== '' ? 'background-color:' + color + '!important' : bgFallback;
  };
  var clobberStyles = function (container, editorBody) {
    var gatherSibilings = function (element) {
      var siblings = $_dew4q4zkjd24rmqh.siblings(element, '*');
      return siblings;
    };
    var clobber = function (clobberStyle) {
      return function (element) {
        var styles = $_dxjq1vxwjd24rmkv.get(element, 'style');
        var backup = styles === undefined ? 'no-styles' : styles.trim();
        if (backup === clobberStyle) {
          return;
        } else {
          $_dxjq1vxwjd24rmkv.set(element, attr, backup);
          $_dxjq1vxwjd24rmkv.set(element, 'style', clobberStyle);
        }
      };
    };
    var ancestors = $_dew4q4zkjd24rmqh.ancestors(container, '*');
    var siblings = $_3vsestw9jd24rmfo.bind(ancestors, gatherSibilings);
    var bgColor = matchColor(editorBody);
    $_3vsestw9jd24rmfo.each(siblings, clobber(siblingStyles));
    $_3vsestw9jd24rmfo.each(ancestors, clobber(ancestorPosition + ancestorStyles + bgColor));
    var containerStyles = isAndroid === true ? '' : ancestorPosition;
    clobber(containerStyles + ancestorStyles + bgColor)(container);
  };
  var restoreStyles = function () {
    var clobberedEls = $_dew4q4zkjd24rmqh.all('[' + attr + ']');
    $_3vsestw9jd24rmfo.each(clobberedEls, function (element) {
      var restore = $_dxjq1vxwjd24rmkv.get(element, attr);
      if (restore !== 'no-styles') {
        $_dxjq1vxwjd24rmkv.set(element, 'style', restore);
      } else {
        $_dxjq1vxwjd24rmkv.remove(element, 'style');
      }
      $_dxjq1vxwjd24rmkv.remove(element, attr);
    });
  };
  var $_ck8n0314gjd24rncn = {
    clobberStyles: clobberStyles,
    restoreStyles: restoreStyles
  };

  var tag = function () {
    var head = $_56vfpvzmjd24rmql.first('head').getOrDie();
    var nu = function () {
      var meta = $_ei6gqxwtjd24rmh8.fromTag('meta');
      $_dxjq1vxwjd24rmkv.set(meta, 'name', 'viewport');
      $_a7pwway2jd24rmlf.append(head, meta);
      return meta;
    };
    var element = $_56vfpvzmjd24rmql.first('meta[name="viewport"]').getOrThunk(nu);
    var backup = $_dxjq1vxwjd24rmkv.get(element, 'content');
    var maximize = function () {
      $_dxjq1vxwjd24rmkv.set(element, 'content', 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0');
    };
    var restore = function () {
      if (backup !== undefined && backup !== null && backup.length > 0) {
        $_dxjq1vxwjd24rmkv.set(element, 'content', backup);
      } else {
        $_dxjq1vxwjd24rmkv.set(element, 'content', 'user-scalable=yes');
      }
    };
    return {
      maximize: maximize,
      restore: restore
    };
  };
  var $_bguo6714hjd24rnct = { tag: tag };

  var create$5 = function (platform, mask) {
    var meta = $_bguo6714hjd24rnct.tag();
    var androidApi = $_2x26512ajd24rn28.api();
    var androidEvents = $_2x26512ajd24rn28.api();
    var enter = function () {
      mask.hide();
      $_c8qis7xujd24rmks.add(platform.container, $_4i0vdoz1jd24rmoo.resolve('fullscreen-maximized'));
      $_c8qis7xujd24rmks.add(platform.container, $_4i0vdoz1jd24rmoo.resolve('android-maximized'));
      meta.maximize();
      $_c8qis7xujd24rmks.add(platform.body, $_4i0vdoz1jd24rmoo.resolve('android-scroll-reload'));
      androidApi.set($_eqh2kx13tjd24rna5.setup(platform.win, $_7sgs3814fjd24rncf.getWin(platform.editor).getOrDie('no')));
      $_7sgs3814fjd24rncf.getActiveApi(platform.editor).each(function (editorApi) {
        $_ck8n0314gjd24rncn.clobberStyles(platform.container, editorApi.body());
        androidEvents.set($_7h0reb13pjd24rn9l.initEvents(editorApi, platform.toolstrip, platform.alloy));
      });
    };
    var exit = function () {
      meta.restore();
      mask.show();
      $_c8qis7xujd24rmks.remove(platform.container, $_4i0vdoz1jd24rmoo.resolve('fullscreen-maximized'));
      $_c8qis7xujd24rmks.remove(platform.container, $_4i0vdoz1jd24rmoo.resolve('android-maximized'));
      $_ck8n0314gjd24rncn.restoreStyles();
      $_c8qis7xujd24rmks.remove(platform.body, $_4i0vdoz1jd24rmoo.resolve('android-scroll-reload'));
      androidEvents.clear();
      androidApi.clear();
    };
    return {
      enter: enter,
      exit: exit
    };
  };
  var $_cgdjc113ojd24rn9i = { create: create$5 };

  var MobileSchema = $_bdtykhxhjd24rmjn.objOf([
    $_w7f5sx2jd24rmi1.strictObjOf('editor', [
      $_w7f5sx2jd24rmi1.strict('getFrame'),
      $_w7f5sx2jd24rmi1.option('getBody'),
      $_w7f5sx2jd24rmi1.option('getDoc'),
      $_w7f5sx2jd24rmi1.option('getWin'),
      $_w7f5sx2jd24rmi1.option('getSelection'),
      $_w7f5sx2jd24rmi1.option('setSelection'),
      $_w7f5sx2jd24rmi1.option('clearSelection'),
      $_w7f5sx2jd24rmi1.option('cursorSaver'),
      $_w7f5sx2jd24rmi1.option('onKeyup'),
      $_w7f5sx2jd24rmi1.option('onNodeChanged'),
      $_w7f5sx2jd24rmi1.option('getCursorBox'),
      $_w7f5sx2jd24rmi1.strict('onDomChanged'),
      $_w7f5sx2jd24rmi1.defaulted('onTouchContent', $_aoet5bwbjd24rmfz.noop),
      $_w7f5sx2jd24rmi1.defaulted('onTapContent', $_aoet5bwbjd24rmfz.noop),
      $_w7f5sx2jd24rmi1.defaulted('onTouchToolstrip', $_aoet5bwbjd24rmfz.noop),
      $_w7f5sx2jd24rmi1.defaulted('onScrollToCursor', $_aoet5bwbjd24rmfz.constant({ unbind: $_aoet5bwbjd24rmfz.noop })),
      $_w7f5sx2jd24rmi1.defaulted('onScrollToElement', $_aoet5bwbjd24rmfz.constant({ unbind: $_aoet5bwbjd24rmfz.noop })),
      $_w7f5sx2jd24rmi1.defaulted('onToEditing', $_aoet5bwbjd24rmfz.constant({ unbind: $_aoet5bwbjd24rmfz.noop })),
      $_w7f5sx2jd24rmi1.defaulted('onToReading', $_aoet5bwbjd24rmfz.constant({ unbind: $_aoet5bwbjd24rmfz.noop })),
      $_w7f5sx2jd24rmi1.defaulted('onToolbarScrollStart', $_aoet5bwbjd24rmfz.identity)
    ]),
    $_w7f5sx2jd24rmi1.strict('socket'),
    $_w7f5sx2jd24rmi1.strict('toolstrip'),
    $_w7f5sx2jd24rmi1.strict('dropup'),
    $_w7f5sx2jd24rmi1.strict('toolbar'),
    $_w7f5sx2jd24rmi1.strict('container'),
    $_w7f5sx2jd24rmi1.strict('alloy'),
    $_w7f5sx2jd24rmi1.state('win', function (spec) {
      return $_5on3koy3jd24rmlg.owner(spec.socket).dom().defaultView;
    }),
    $_w7f5sx2jd24rmi1.state('body', function (spec) {
      return $_ei6gqxwtjd24rmh8.fromDom(spec.socket.dom().ownerDocument.body);
    }),
    $_w7f5sx2jd24rmi1.defaulted('translate', $_aoet5bwbjd24rmfz.identity),
    $_w7f5sx2jd24rmi1.defaulted('setReadOnly', $_aoet5bwbjd24rmfz.noop)
  ]);

  var adaptable = function (fn, rate) {
    var timer = null;
    var args = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        args = null;
      }
    };
    var throttle = function () {
      args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var first$4 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer === null) {
        timer = setTimeout(function () {
          fn.apply(null, args);
          timer = null;
          args = null;
        }, rate);
      }
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var last$3 = function (fn, rate) {
    var timer = null;
    var cancel = function () {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };
    var throttle = function () {
      var args = arguments;
      if (timer !== null)
        clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
        timer = null;
        args = null;
      }, rate);
    };
    return {
      cancel: cancel,
      throttle: throttle
    };
  };
  var $_2i7nem14kjd24rnd8 = {
    adaptable: adaptable,
    first: first$4,
    last: last$3
  };

  var sketch$10 = function (onView, translate) {
    var memIcon = $_c9gmcp11ejd24rmyr.record(Container.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<div aria-hidden="true" class="${prefix}-mask-tap-icon"></div>'),
      containerBehaviours: $_9vyb2vw4jd24rmen.derive([Toggling.config({
          toggleClass: $_4i0vdoz1jd24rmoo.resolve('mask-tap-icon-selected'),
          toggleOnExecute: false
        })])
    }));
    var onViewThrottle = $_2i7nem14kjd24rnd8.first(onView, 200);
    return Container.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-disabled-mask"></div>'),
      components: [Container.sketch({
          dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-content-container"></div>'),
          components: [Button.sketch({
              dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-content-tap-section"></div>'),
              components: [memIcon.asSpec()],
              action: function (button) {
                onViewThrottle.throttle();
              },
              buttonBehaviours: $_9vyb2vw4jd24rmen.derive([Toggling.config({ toggleClass: $_4i0vdoz1jd24rmoo.resolve('mask-tap-icon-selected') })])
            })]
        })]
    });
  };
  var $_3wiqws14jjd24rnd2 = { sketch: sketch$10 };

  var produce = function (raw) {
    var mobile = $_bdtykhxhjd24rmjn.asRawOrDie('Getting AndroidWebapp schema', MobileSchema, raw);
    $_ayz4w9zsjd24rmr3.set(mobile.toolstrip, 'width', '100%');
    var onTap = function () {
      mobile.setReadOnly(true);
      mode.enter();
    };
    var mask = $_57n4pi12kjd24rn3p.build($_3wiqws14jjd24rnd2.sketch(onTap, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function () {
        mobile.alloy.add(mask);
      },
      hide: function () {
        mobile.alloy.remove(mask);
      }
    };
    $_a7pwway2jd24rmlf.append(mobile.container, mask.element());
    var mode = $_cgdjc113ojd24rn9i.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: $_aoet5bwbjd24rmfz.noop,
      enter: mode.enter,
      exit: mode.exit,
      destroy: $_aoet5bwbjd24rmfz.noop
    };
  };
  var $_3dfh7i13njd24rn9d = { produce: produce };

  var schema$14 = [
    $_w7f5sx2jd24rmi1.defaulted('shell', true),
    $_azr91y10djd24rmtn.field('toolbarBehaviours', [Replacing])
  ];
  var enhanceGroups = function (detail) {
    return { behaviours: $_9vyb2vw4jd24rmen.derive([Replacing.config({})]) };
  };
  var partTypes$1 = [$_6nn6my10kjd24rmuq.optional({
      name: 'groups',
      overrides: enhanceGroups
    })];
  var $_ap158k14njd24rndp = {
    name: $_aoet5bwbjd24rmfz.constant('Toolbar'),
    schema: $_aoet5bwbjd24rmfz.constant(schema$14),
    parts: $_aoet5bwbjd24rmfz.constant(partTypes$1)
  };

  var factory$4 = function (detail, components, spec, _externals) {
    var setGroups = function (toolbar, groups) {
      getGroupContainer(toolbar).fold(function () {
        console.error('Toolbar was defined to not be a shell, but no groups container was specified in components');
        throw new Error('Toolbar was defined to not be a shell, but no groups container was specified in components');
      }, function (container) {
        Replacing.set(container, groups);
      });
    };
    var getGroupContainer = function (component) {
      return detail.shell() ? $_asi680wajd24rmfv.some(component) : $_czojf710ijd24rmub.getPart(component, detail, 'groups');
    };
    var extra = detail.shell() ? {
      behaviours: [Replacing.config({})],
      components: []
    } : {
      behaviours: [],
      components: components
    };
    return {
      uid: detail.uid(),
      dom: detail.dom(),
      components: extra.components,
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive(extra.behaviours), $_azr91y10djd24rmtn.get(detail.toolbarBehaviours())),
      apis: { setGroups: setGroups },
      domModification: { attributes: { role: 'group' } }
    };
  };
  var Toolbar = $_7v08p10ejd24rmts.composite({
    name: 'Toolbar',
    configFields: $_ap158k14njd24rndp.schema(),
    partFields: $_ap158k14njd24rndp.parts(),
    factory: factory$4,
    apis: {
      setGroups: function (apis, toolbar, groups) {
        apis.setGroups(toolbar, groups);
      }
    }
  });

  var schema$15 = [
    $_w7f5sx2jd24rmi1.strict('items'),
    $_62w1klytjd24rmnt.markers(['itemClass']),
    $_azr91y10djd24rmtn.field('tgroupBehaviours', [Keying])
  ];
  var partTypes$2 = [$_6nn6my10kjd24rmuq.group({
      name: 'items',
      unit: 'item',
      overrides: function (detail) {
        return { domModification: { classes: [detail.markers().itemClass()] } };
      }
    })];
  var $_sye0714pjd24rndy = {
    name: $_aoet5bwbjd24rmfz.constant('ToolbarGroup'),
    schema: $_aoet5bwbjd24rmfz.constant(schema$15),
    parts: $_aoet5bwbjd24rmfz.constant(partTypes$2)
  };

  var factory$5 = function (detail, components, spec, _externals) {
    return $_4x4s83wyjd24rmhm.deepMerge({ dom: { attributes: { role: 'toolbar' } } }, {
      uid: detail.uid(),
      dom: detail.dom(),
      components: components,
      behaviours: $_4x4s83wyjd24rmhm.deepMerge($_9vyb2vw4jd24rmen.derive([Keying.config({
          mode: 'flow',
          selector: '.' + detail.markers().itemClass()
        })]), $_azr91y10djd24rmtn.get(detail.tgroupBehaviours())),
      'debug.sketcher': spec['debug.sketcher']
    });
  };
  var ToolbarGroup = $_7v08p10ejd24rmts.composite({
    name: 'ToolbarGroup',
    configFields: $_sye0714pjd24rndy.schema(),
    partFields: $_sye0714pjd24rndy.parts(),
    factory: factory$5
  });

  var dataHorizontal = 'data-' + $_4i0vdoz1jd24rmoo.resolve('horizontal-scroll');
  var canScrollVertically = function (container) {
    container.dom().scrollTop = 1;
    var result = container.dom().scrollTop !== 0;
    container.dom().scrollTop = 0;
    return result;
  };
  var canScrollHorizontally = function (container) {
    container.dom().scrollLeft = 1;
    var result = container.dom().scrollLeft !== 0;
    container.dom().scrollLeft = 0;
    return result;
  };
  var hasVerticalScroll = function (container) {
    return container.dom().scrollTop > 0 || canScrollVertically(container);
  };
  var hasHorizontalScroll = function (container) {
    return container.dom().scrollLeft > 0 || canScrollHorizontally(container);
  };
  var markAsHorizontal = function (container) {
    $_dxjq1vxwjd24rmkv.set(container, dataHorizontal, 'true');
  };
  var hasScroll = function (container) {
    return $_dxjq1vxwjd24rmkv.get(container, dataHorizontal) === 'true' ? hasHorizontalScroll : hasVerticalScroll;
  };
  var exclusive = function (scope, selector) {
    return $_a4ythl13kjd24rn91.bind(scope, 'touchmove', function (event) {
      $_56vfpvzmjd24rmql.closest(event.target(), selector).filter(hasScroll).fold(function () {
        event.raw().preventDefault();
      }, $_aoet5bwbjd24rmfz.noop);
    });
  };
  var $_2nwq8n14qjd24rne2 = {
    exclusive: exclusive,
    markAsHorizontal: markAsHorizontal
  };

  function ScrollingToolbar () {
    var makeGroup = function (gSpec) {
      var scrollClass = gSpec.scrollable === true ? '${prefix}-toolbar-scrollable-group' : '';
      return {
        dom: $_ejtuy110qjd24rmvy.dom('<div aria-label="' + gSpec.label + '" class="${prefix}-toolbar-group ' + scrollClass + '"></div>'),
        tgroupBehaviours: $_9vyb2vw4jd24rmen.derive([$_dzt99a11sjd24rn0a.config('adhoc-scrollable-toolbar', gSpec.scrollable === true ? [$_g9t26pw6jd24rmfc.runOnInit(function (component, simulatedEvent) {
              $_ayz4w9zsjd24rmr3.set(component.element(), 'overflow-x', 'auto');
              $_2nwq8n14qjd24rne2.markAsHorizontal(component.element());
              $_c71wbk13hjd24rn8p.register(component.element());
            })] : [])]),
        components: [Container.sketch({ components: [ToolbarGroup.parts().items({})] })],
        markers: { itemClass: $_4i0vdoz1jd24rmoo.resolve('toolbar-group-item') },
        items: gSpec.items
      };
    };
    var toolbar = $_57n4pi12kjd24rn3p.build(Toolbar.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-toolbar"></div>'),
      components: [Toolbar.parts().groups({})],
      toolbarBehaviours: $_9vyb2vw4jd24rmen.derive([
        Toggling.config({
          toggleClass: $_4i0vdoz1jd24rmoo.resolve('context-toolbar'),
          toggleOnExecute: false,
          aria: { mode: 'none' }
        }),
        Keying.config({ mode: 'cyclic' })
      ]),
      shell: true
    }));
    var wrapper = $_57n4pi12kjd24rn3p.build(Container.sketch({
      dom: { classes: [$_4i0vdoz1jd24rmoo.resolve('toolstrip')] },
      components: [$_57n4pi12kjd24rn3p.premade(toolbar)],
      containerBehaviours: $_9vyb2vw4jd24rmen.derive([Toggling.config({
          toggleClass: $_4i0vdoz1jd24rmoo.resolve('android-selection-context-toolbar'),
          toggleOnExecute: false
        })])
    }));
    var resetGroups = function () {
      Toolbar.setGroups(toolbar, initGroups.get());
      Toggling.off(toolbar);
    };
    var initGroups = Cell([]);
    var setGroups = function (gs) {
      initGroups.set(gs);
      resetGroups();
    };
    var createGroups = function (gs) {
      return $_3vsestw9jd24rmfo.map(gs, $_aoet5bwbjd24rmfz.compose(ToolbarGroup.sketch, makeGroup));
    };
    var refresh = function () {
      Toolbar.refresh(toolbar);
    };
    var setContextToolbar = function (gs) {
      Toggling.on(toolbar);
      Toolbar.setGroups(toolbar, gs);
    };
    var restoreToolbar = function () {
      if (Toggling.isOn(toolbar)) {
        resetGroups();
      }
    };
    var focus = function () {
      Keying.focusIn(toolbar);
    };
    return {
      wrapper: $_aoet5bwbjd24rmfz.constant(wrapper),
      toolbar: $_aoet5bwbjd24rmfz.constant(toolbar),
      createGroups: createGroups,
      setGroups: setGroups,
      setContextToolbar: setContextToolbar,
      restoreToolbar: restoreToolbar,
      refresh: refresh,
      focus: focus
    };
  }

  var makeEditSwitch = function (webapp) {
    return $_57n4pi12kjd24rn3p.build(Button.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-mask-edit-icon ${prefix}-icon"></div>'),
      action: function () {
        webapp.run(function (w) {
          w.setReadOnly(false);
        });
      }
    }));
  };
  var makeSocket = function () {
    return $_57n4pi12kjd24rn3p.build(Container.sketch({
      dom: $_ejtuy110qjd24rmvy.dom('<div class="${prefix}-editor-socket"></div>'),
      components: [],
      containerBehaviours: $_9vyb2vw4jd24rmen.derive([Replacing.config({})])
    }));
  };
  var showEdit = function (socket, switchToEdit) {
    Replacing.append(socket, $_57n4pi12kjd24rn3p.premade(switchToEdit));
  };
  var hideEdit = function (socket, switchToEdit) {
    Replacing.remove(socket, switchToEdit);
  };
  var updateMode = function (socket, switchToEdit, readOnly, root) {
    var swap = readOnly === true ? Swapping.toAlpha : Swapping.toOmega;
    swap(root);
    var f = readOnly ? showEdit : hideEdit;
    f(socket, switchToEdit);
  };
  var $_dh63e514rjd24rne7 = {
    makeEditSwitch: makeEditSwitch,
    makeSocket: makeSocket,
    updateMode: updateMode
  };

  var getAnimationRoot = function (component, slideConfig) {
    return slideConfig.getAnimationRoot().fold(function () {
      return component.element();
    }, function (get) {
      return get(component);
    });
  };
  var getDimensionProperty = function (slideConfig) {
    return slideConfig.dimension().property();
  };
  var getDimension = function (slideConfig, elem) {
    return slideConfig.dimension().getDimension()(elem);
  };
  var disableTransitions = function (component, slideConfig) {
    var root = getAnimationRoot(component, slideConfig);
    $_7u42ke12yjd24rn66.remove(root, [
      slideConfig.shrinkingClass(),
      slideConfig.growingClass()
    ]);
  };
  var setShrunk = function (component, slideConfig) {
    $_c8qis7xujd24rmks.remove(component.element(), slideConfig.openClass());
    $_c8qis7xujd24rmks.add(component.element(), slideConfig.closedClass());
    $_ayz4w9zsjd24rmr3.set(component.element(), getDimensionProperty(slideConfig), '0px');
    $_ayz4w9zsjd24rmr3.reflow(component.element());
  };
  var measureTargetSize = function (component, slideConfig) {
    setGrown(component, slideConfig);
    var expanded = getDimension(slideConfig, component.element());
    setShrunk(component, slideConfig);
    return expanded;
  };
  var setGrown = function (component, slideConfig) {
    $_c8qis7xujd24rmks.remove(component.element(), slideConfig.closedClass());
    $_c8qis7xujd24rmks.add(component.element(), slideConfig.openClass());
    $_ayz4w9zsjd24rmr3.remove(component.element(), getDimensionProperty(slideConfig));
  };
  var doImmediateShrink = function (component, slideConfig, slideState) {
    slideState.setCollapsed();
    $_ayz4w9zsjd24rmr3.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    $_ayz4w9zsjd24rmr3.reflow(component.element());
    disableTransitions(component, slideConfig);
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink()(component);
    slideConfig.onShrunk()(component);
  };
  var doStartShrink = function (component, slideConfig, slideState) {
    slideState.setCollapsed();
    $_ayz4w9zsjd24rmr3.set(component.element(), getDimensionProperty(slideConfig), getDimension(slideConfig, component.element()));
    $_ayz4w9zsjd24rmr3.reflow(component.element());
    var root = getAnimationRoot(component, slideConfig);
    $_c8qis7xujd24rmks.add(root, slideConfig.shrinkingClass());
    setShrunk(component, slideConfig);
    slideConfig.onStartShrink()(component);
  };
  var doStartGrow = function (component, slideConfig, slideState) {
    var fullSize = measureTargetSize(component, slideConfig);
    var root = getAnimationRoot(component, slideConfig);
    $_c8qis7xujd24rmks.add(root, slideConfig.growingClass());
    setGrown(component, slideConfig);
    $_ayz4w9zsjd24rmr3.set(component.element(), getDimensionProperty(slideConfig), fullSize);
    slideState.setExpanded();
    slideConfig.onStartGrow()(component);
  };
  var grow = function (component, slideConfig, slideState) {
    if (!slideState.isExpanded())
      doStartGrow(component, slideConfig, slideState);
  };
  var shrink = function (component, slideConfig, slideState) {
    if (slideState.isExpanded())
      doStartShrink(component, slideConfig, slideState);
  };
  var immediateShrink = function (component, slideConfig, slideState) {
    if (slideState.isExpanded())
      doImmediateShrink(component, slideConfig, slideState);
  };
  var hasGrown = function (component, slideConfig, slideState) {
    return slideState.isExpanded();
  };
  var hasShrunk = function (component, slideConfig, slideState) {
    return slideState.isCollapsed();
  };
  var isGrowing = function (component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return $_c8qis7xujd24rmks.has(root, slideConfig.growingClass()) === true;
  };
  var isShrinking = function (component, slideConfig, slideState) {
    var root = getAnimationRoot(component, slideConfig);
    return $_c8qis7xujd24rmks.has(root, slideConfig.shrinkingClass()) === true;
  };
  var isTransitioning = function (component, slideConfig, slideState) {
    return isGrowing(component, slideConfig, slideState) === true || isShrinking(component, slideConfig, slideState) === true;
  };
  var toggleGrow = function (component, slideConfig, slideState) {
    var f = slideState.isExpanded() ? doStartShrink : doStartGrow;
    f(component, slideConfig, slideState);
  };
  var $_2q1ox914vjd24rnen = {
    grow: grow,
    shrink: shrink,
    immediateShrink: immediateShrink,
    hasGrown: hasGrown,
    hasShrunk: hasShrunk,
    isGrowing: isGrowing,
    isShrinking: isShrinking,
    isTransitioning: isTransitioning,
    toggleGrow: toggleGrow,
    disableTransitions: disableTransitions
  };

  var exhibit$5 = function (base, slideConfig) {
    var expanded = slideConfig.expanded();
    return expanded ? $_g169haxkjd24rmjy.nu({
      classes: [slideConfig.openClass()],
      styles: {}
    }) : $_g169haxkjd24rmjy.nu({
      classes: [slideConfig.closedClass()],
      styles: $_bzffwwx6jd24rmit.wrap(slideConfig.dimension().property(), '0px')
    });
  };
  var events$9 = function (slideConfig, slideState) {
    return $_g9t26pw6jd24rmfc.derive([$_g9t26pw6jd24rmfc.run($_1tcfm9wxjd24rmhk.transitionend(), function (component, simulatedEvent) {
        var raw = simulatedEvent.event().raw();
        if (raw.propertyName === slideConfig.dimension().property()) {
          $_2q1ox914vjd24rnen.disableTransitions(component, slideConfig, slideState);
          if (slideState.isExpanded())
            $_ayz4w9zsjd24rmr3.remove(component.element(), slideConfig.dimension().property());
          var notify = slideState.isExpanded() ? slideConfig.onGrown() : slideConfig.onShrunk();
          notify(component, simulatedEvent);
        }
      })]);
  };
  var $_ymv5314ujd24rnej = {
    exhibit: exhibit$5,
    events: events$9
  };

  var SlidingSchema = [
    $_w7f5sx2jd24rmi1.strict('closedClass'),
    $_w7f5sx2jd24rmi1.strict('openClass'),
    $_w7f5sx2jd24rmi1.strict('shrinkingClass'),
    $_w7f5sx2jd24rmi1.strict('growingClass'),
    $_w7f5sx2jd24rmi1.option('getAnimationRoot'),
    $_62w1klytjd24rmnt.onHandler('onShrunk'),
    $_62w1klytjd24rmnt.onHandler('onStartShrink'),
    $_62w1klytjd24rmnt.onHandler('onGrown'),
    $_62w1klytjd24rmnt.onHandler('onStartGrow'),
    $_w7f5sx2jd24rmi1.defaulted('expanded', false),
    $_w7f5sx2jd24rmi1.strictOf('dimension', $_bdtykhxhjd24rmjn.choose('property', {
      width: [
        $_62w1klytjd24rmnt.output('property', 'width'),
        $_62w1klytjd24rmnt.output('getDimension', function (elem) {
          return $_cnk9kc117jd24rmxv.get(elem) + 'px';
        })
      ],
      height: [
        $_62w1klytjd24rmnt.output('property', 'height'),
        $_62w1klytjd24rmnt.output('getDimension', function (elem) {
          return $_duiw2pzrjd24rmr1.get(elem) + 'px';
        })
      ]
    }))
  ];

  var init$4 = function (spec) {
    var state = Cell(spec.expanded());
    var readState = function () {
      return 'expanded: ' + state.get();
    };
    return BehaviourState({
      isExpanded: function () {
        return state.get() === true;
      },
      isCollapsed: function () {
        return state.get() === false;
      },
      setCollapsed: $_aoet5bwbjd24rmfz.curry(state.set, false),
      setExpanded: $_aoet5bwbjd24rmfz.curry(state.set, true),
      readState: readState
    });
  };
  var $_d9dcek14xjd24rney = { init: init$4 };

  var Sliding = $_9vyb2vw4jd24rmen.create({
    fields: SlidingSchema,
    name: 'sliding',
    active: $_ymv5314ujd24rnej,
    apis: $_2q1ox914vjd24rnen,
    state: $_d9dcek14xjd24rney
  });

  var build$2 = function (refresh, scrollIntoView) {
    var dropup = $_57n4pi12kjd24rn3p.build(Container.sketch({
      dom: {
        tag: 'div',
        classes: $_4i0vdoz1jd24rmoo.resolve('dropup')
      },
      components: [],
      containerBehaviours: $_9vyb2vw4jd24rmen.derive([
        Replacing.config({}),
        Sliding.config({
          closedClass: $_4i0vdoz1jd24rmoo.resolve('dropup-closed'),
          openClass: $_4i0vdoz1jd24rmoo.resolve('dropup-open'),
          shrinkingClass: $_4i0vdoz1jd24rmoo.resolve('dropup-shrinking'),
          growingClass: $_4i0vdoz1jd24rmoo.resolve('dropup-growing'),
          dimension: { property: 'height' },
          onShrunk: function (component) {
            refresh();
            scrollIntoView();
            Replacing.set(component, []);
          },
          onGrown: function (component) {
            refresh();
            scrollIntoView();
          }
        }),
        $_xzzzbz0jd24rmol.orientation(function (component, data) {
          disappear($_aoet5bwbjd24rmfz.noop);
        })
      ])
    }));
    var appear = function (menu, update, component) {
      if (Sliding.hasShrunk(dropup) === true && Sliding.isTransitioning(dropup) === false) {
        window.requestAnimationFrame(function () {
          update(component);
          Replacing.set(dropup, [menu()]);
          Sliding.grow(dropup);
        });
      }
    };
    var disappear = function (onReadyToShrink) {
      window.requestAnimationFrame(function () {
        onReadyToShrink();
        Sliding.shrink(dropup);
      });
    };
    return {
      appear: appear,
      disappear: disappear,
      component: $_aoet5bwbjd24rmfz.constant(dropup),
      element: dropup.element
    };
  };
  var $_agkmjr14sjd24rnec = { build: build$2 };

  var isDangerous = function (event) {
    return event.raw().which === $_vz8vfzejd24rmpw.BACKSPACE()[0] && !$_3vsestw9jd24rmfo.contains([
      'input',
      'textarea'
    ], $_5fvhg7xxjd24rmkz.name(event.target()));
  };
  var isFirefox = $_1616jcwgjd24rmg9.detect().browser.isFirefox();
  var settingsSchema = $_bdtykhxhjd24rmjn.objOfOnly([
    $_w7f5sx2jd24rmi1.strictFunction('triggerEvent'),
    $_w7f5sx2jd24rmi1.strictFunction('broadcastEvent'),
    $_w7f5sx2jd24rmi1.defaulted('stopBackspace', true)
  ]);
  var bindFocus = function (container, handler) {
    if (isFirefox) {
      return $_a4ythl13kjd24rn91.capture(container, 'focus', handler);
    } else {
      return $_a4ythl13kjd24rn91.bind(container, 'focusin', handler);
    }
  };
  var bindBlur = function (container, handler) {
    if (isFirefox) {
      return $_a4ythl13kjd24rn91.capture(container, 'blur', handler);
    } else {
      return $_a4ythl13kjd24rn91.bind(container, 'focusout', handler);
    }
  };
  var setup$2 = function (container, rawSettings) {
    var settings = $_bdtykhxhjd24rmjn.asRawOrDie('Getting GUI events settings', settingsSchema, rawSettings);
    var pointerEvents = $_1616jcwgjd24rmg9.detect().deviceType.isTouch() ? [
      'touchstart',
      'touchmove',
      'touchend',
      'gesturestart'
    ] : [
      'mousedown',
      'mouseup',
      'mouseover',
      'mousemove',
      'mouseout',
      'click'
    ];
    var tapEvent = $_ayp3zn13rjd24rn9x.monitor(settings);
    var simpleEvents = $_3vsestw9jd24rmfo.map(pointerEvents.concat([
      'selectstart',
      'input',
      'contextmenu',
      'change',
      'transitionend',
      'dragstart',
      'dragover',
      'drop'
    ]), function (type) {
      return $_a4ythl13kjd24rn91.bind(container, type, function (event) {
        tapEvent.fireIfReady(event, type).each(function (tapStopped) {
          if (tapStopped)
            event.kill();
        });
        var stopped = settings.triggerEvent(type, event);
        if (stopped)
          event.kill();
      });
    });
    var onKeydown = $_a4ythl13kjd24rn91.bind(container, 'keydown', function (event) {
      var stopped = settings.triggerEvent('keydown', event);
      if (stopped)
        event.kill();
      else if (settings.stopBackspace === true && isDangerous(event)) {
        event.prevent();
      }
    });
    var onFocusIn = bindFocus(container, function (event) {
      var stopped = settings.triggerEvent('focusin', event);
      if (stopped)
        event.kill();
    });
    var onFocusOut = bindBlur(container, function (event) {
      var stopped = settings.triggerEvent('focusout', event);
      if (stopped)
        event.kill();
      setTimeout(function () {
        settings.triggerEvent($_9am11ywwjd24rmhg.postBlur(), event);
      }, 0);
    });
    var defaultView = $_5on3koy3jd24rmlg.defaultView(container);
    var onWindowScroll = $_a4ythl13kjd24rn91.bind(defaultView, 'scroll', function (event) {
      var stopped = settings.broadcastEvent($_9am11ywwjd24rmhg.windowScroll(), event);
      if (stopped)
        event.kill();
    });
    var unbind = function () {
      $_3vsestw9jd24rmfo.each(simpleEvents, function (e) {
        e.unbind();
      });
      onKeydown.unbind();
      onFocusIn.unbind();
      onFocusOut.unbind();
      onWindowScroll.unbind();
    };
    return { unbind: unbind };
  };
  var $_3clamu150jd24rnfn = { setup: setup$2 };

  var derive$3 = function (rawEvent, rawTarget) {
    var source = $_bzffwwx6jd24rmit.readOptFrom(rawEvent, 'target').map(function (getTarget) {
      return getTarget();
    }).getOr(rawTarget);
    return Cell(source);
  };
  var $_e9nd9s152jd24rng0 = { derive: derive$3 };

  var fromSource = function (event, source) {
    var stopper = Cell(false);
    var cutter = Cell(false);
    var stop = function () {
      stopper.set(true);
    };
    var cut = function () {
      cutter.set(true);
    };
    return {
      stop: stop,
      cut: cut,
      isStopped: stopper.get,
      isCut: cutter.get,
      event: $_aoet5bwbjd24rmfz.constant(event),
      setSource: source.set,
      getSource: source.get
    };
  };
  var fromExternal = function (event) {
    var stopper = Cell(false);
    var stop = function () {
      stopper.set(true);
    };
    return {
      stop: stop,
      cut: $_aoet5bwbjd24rmfz.noop,
      isStopped: stopper.get,
      isCut: $_aoet5bwbjd24rmfz.constant(false),
      event: $_aoet5bwbjd24rmfz.constant(event),
      setTarget: $_aoet5bwbjd24rmfz.die(new Error('Cannot set target of a broadcasted event')),
      getTarget: $_aoet5bwbjd24rmfz.die(new Error('Cannot get target of a broadcasted event'))
    };
  };
  var fromTarget = function (event, target) {
    var source = Cell(target);
    return fromSource(event, source);
  };
  var $_90dzsc153jd24rng3 = {
    fromSource: fromSource,
    fromExternal: fromExternal,
    fromTarget: fromTarget
  };

  var adt$6 = $_45w193x4jd24rmi8.generate([
    { stopped: [] },
    { resume: ['element'] },
    { complete: [] }
  ]);
  var doTriggerHandler = function (lookup, eventType, rawEvent, target, source, logger) {
    var handler = lookup(eventType, target);
    var simulatedEvent = $_90dzsc153jd24rng3.fromSource(rawEvent, source);
    return handler.fold(function () {
      logger.logEventNoHandlers(eventType, target);
      return adt$6.complete();
    }, function (handlerInfo) {
      var descHandler = handlerInfo.descHandler();
      var eventHandler = $_5il8ci12vjd24rn5n.getHandler(descHandler);
      eventHandler(simulatedEvent);
      if (simulatedEvent.isStopped()) {
        logger.logEventStopped(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$6.stopped();
      } else if (simulatedEvent.isCut()) {
        logger.logEventCut(eventType, handlerInfo.element(), descHandler.purpose());
        return adt$6.complete();
      } else
        return $_5on3koy3jd24rmlg.parent(handlerInfo.element()).fold(function () {
          logger.logNoParent(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$6.complete();
        }, function (parent) {
          logger.logEventResponse(eventType, handlerInfo.element(), descHandler.purpose());
          return adt$6.resume(parent);
        });
    });
  };
  var doTriggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, source, logger) {
    return doTriggerHandler(lookup, eventType, rawEvent, rawTarget, source, logger).fold(function () {
      return true;
    }, function (parent) {
      return doTriggerOnUntilStopped(lookup, eventType, rawEvent, parent, source, logger);
    }, function () {
      return false;
    });
  };
  var triggerHandler = function (lookup, eventType, rawEvent, target, logger) {
    var source = $_e9nd9s152jd24rng0.derive(rawEvent, target);
    return doTriggerHandler(lookup, eventType, rawEvent, target, source, logger);
  };
  var broadcast = function (listeners, rawEvent, logger) {
    var simulatedEvent = $_90dzsc153jd24rng3.fromExternal(rawEvent);
    $_3vsestw9jd24rmfo.each(listeners, function (listener) {
      var descHandler = listener.descHandler();
      var handler = $_5il8ci12vjd24rn5n.getHandler(descHandler);
      handler(simulatedEvent);
    });
    return simulatedEvent.isStopped();
  };
  var triggerUntilStopped = function (lookup, eventType, rawEvent, logger) {
    var rawTarget = rawEvent.target();
    return triggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, logger);
  };
  var triggerOnUntilStopped = function (lookup, eventType, rawEvent, rawTarget, logger) {
    var source = $_e9nd9s152jd24rng0.derive(rawEvent, rawTarget);
    return doTriggerOnUntilStopped(lookup, eventType, rawEvent, rawTarget, source, logger);
  };
  var $_32avst151jd24rnfw = {
    triggerHandler: triggerHandler,
    triggerUntilStopped: triggerUntilStopped,
    triggerOnUntilStopped: triggerOnUntilStopped,
    broadcast: broadcast
  };

  var closest$4 = function (target, transform, isRoot) {
    var delegate = $_en3fpayijd24rmmt.closest(target, function (elem) {
      return transform(elem).isSome();
    }, isRoot);
    return delegate.bind(transform);
  };
  var $_kj5tf156jd24rngf = { closest: closest$4 };

  var eventHandler = $_ws57hxmjd24rmkd.immutable('element', 'descHandler');
  var messageHandler = function (id, handler) {
    return {
      id: $_aoet5bwbjd24rmfz.constant(id),
      descHandler: $_aoet5bwbjd24rmfz.constant(handler)
    };
  };
  function EventRegistry () {
    var registry = {};
    var registerId = function (extraArgs, id, events) {
      $_2hhb0ax0jd24rmhp.each(events, function (v, k) {
        var handlers = registry[k] !== undefined ? registry[k] : {};
        handlers[id] = $_5il8ci12vjd24rn5n.curryArgs(v, extraArgs);
        registry[k] = handlers;
      });
    };
    var findHandler = function (handlers, elem) {
      return $_c4606g10mjd24rmv9.read(elem).fold(function (err) {
        return $_asi680wajd24rmfv.none();
      }, function (id) {
        var reader = $_bzffwwx6jd24rmit.readOpt(id);
        return handlers.bind(reader).map(function (descHandler) {
          return eventHandler(elem, descHandler);
        });
      });
    };
    var filterByType = function (type) {
      return $_bzffwwx6jd24rmit.readOptFrom(registry, type).map(function (handlers) {
        return $_2hhb0ax0jd24rmhp.mapToArray(handlers, function (f, id) {
          return messageHandler(id, f);
        });
      }).getOr([]);
    };
    var find = function (isAboveRoot, type, target) {
      var readType = $_bzffwwx6jd24rmit.readOpt(type);
      var handlers = readType(registry);
      return $_kj5tf156jd24rngf.closest(target, function (elem) {
        return findHandler(handlers, elem);
      }, isAboveRoot);
    };
    var unregisterId = function (id) {
      $_2hhb0ax0jd24rmhp.each(registry, function (handlersById, eventName) {
        if (handlersById.hasOwnProperty(id))
          delete handlersById[id];
      });
    };
    return {
      registerId: registerId,
      unregisterId: unregisterId,
      filterByType: filterByType,
      find: find
    };
  }

  function Registry () {
    var events = EventRegistry();
    var components = {};
    var readOrTag = function (component) {
      var elem = component.element();
      return $_c4606g10mjd24rmv9.read(elem).fold(function () {
        return $_c4606g10mjd24rmv9.write('uid-', component.element());
      }, function (uid) {
        return uid;
      });
    };
    var failOnDuplicate = function (component, tagId) {
      var conflict = components[tagId];
      if (conflict === component)
        unregister(component);
      else
        throw new Error('The tagId "' + tagId + '" is already used by: ' + $_3r5kv7y9jd24rmmb.element(conflict.element()) + '\nCannot use it for: ' + $_3r5kv7y9jd24rmmb.element(component.element()) + '\n' + 'The conflicting element is' + ($_fqsltgy7jd24rmlz.inBody(conflict.element()) ? ' ' : ' not ') + 'already in the DOM');
    };
    var register = function (component) {
      var tagId = readOrTag(component);
      if ($_bzffwwx6jd24rmit.hasKey(components, tagId))
        failOnDuplicate(component, tagId);
      var extraArgs = [component];
      events.registerId(extraArgs, tagId, component.events());
      components[tagId] = component;
    };
    var unregister = function (component) {
      $_c4606g10mjd24rmv9.read(component.element()).each(function (tagId) {
        components[tagId] = undefined;
        events.unregisterId(tagId);
      });
    };
    var filter = function (type) {
      return events.filterByType(type);
    };
    var find = function (isAboveRoot, type, target) {
      return events.find(isAboveRoot, type, target);
    };
    var getById = function (id) {
      return $_bzffwwx6jd24rmit.readOpt(id)(components);
    };
    return {
      find: find,
      filter: filter,
      register: register,
      unregister: unregister,
      getById: getById
    };
  }

  var create$6 = function () {
    var root = $_57n4pi12kjd24rn3p.build(Container.sketch({ dom: { tag: 'div' } }));
    return takeover(root);
  };
  var takeover = function (root) {
    var isAboveRoot = function (el) {
      return $_5on3koy3jd24rmlg.parent(root.element()).fold(function () {
        return true;
      }, function (parent) {
        return $_237cqww8jd24rmfh.eq(el, parent);
      });
    };
    var registry = Registry();
    var lookup = function (eventName, target) {
      return registry.find(isAboveRoot, eventName, target);
    };
    var domEvents = $_3clamu150jd24rnfn.setup(root.element(), {
      triggerEvent: function (eventName, event) {
        return $_e4133ky8jd24rmm3.monitorEvent(eventName, event.target(), function (logger) {
          return $_32avst151jd24rnfw.triggerUntilStopped(lookup, eventName, event, logger);
        });
      },
      broadcastEvent: function (eventName, event) {
        var listeners = registry.filter(eventName);
        return $_32avst151jd24rnfw.broadcast(listeners, event);
      }
    });
    var systemApi = SystemApi({
      debugInfo: $_aoet5bwbjd24rmfz.constant('real'),
      triggerEvent: function (customType, target, data) {
        $_e4133ky8jd24rmm3.monitorEvent(customType, target, function (logger) {
          $_32avst151jd24rnfw.triggerOnUntilStopped(lookup, customType, data, target, logger);
        });
      },
      triggerFocus: function (target, originator) {
        $_c4606g10mjd24rmv9.read(target).fold(function () {
          $_9uflcdygjd24rmmn.focus(target);
        }, function (_alloyId) {
          $_e4133ky8jd24rmm3.monitorEvent($_9am11ywwjd24rmhg.focus(), target, function (logger) {
            $_32avst151jd24rnfw.triggerHandler(lookup, $_9am11ywwjd24rmhg.focus(), {
              originator: $_aoet5bwbjd24rmfz.constant(originator),
              target: $_aoet5bwbjd24rmfz.constant(target)
            }, target, logger);
          });
        });
      },
      triggerEscape: function (comp, simulatedEvent) {
        systemApi.triggerEvent('keydown', comp.element(), simulatedEvent.event());
      },
      getByUid: function (uid) {
        return getByUid(uid);
      },
      getByDom: function (elem) {
        return getByDom(elem);
      },
      build: $_57n4pi12kjd24rn3p.build,
      addToGui: function (c) {
        add(c);
      },
      removeFromGui: function (c) {
        remove(c);
      },
      addToWorld: function (c) {
        addToWorld(c);
      },
      removeFromWorld: function (c) {
        removeFromWorld(c);
      },
      broadcast: function (message) {
        broadcast(message);
      },
      broadcastOn: function (channels, message) {
        broadcastOn(channels, message);
      }
    });
    var addToWorld = function (component) {
      component.connect(systemApi);
      if (!$_5fvhg7xxjd24rmkz.isText(component.element())) {
        registry.register(component);
        $_3vsestw9jd24rmfo.each(component.components(), addToWorld);
        systemApi.triggerEvent($_9am11ywwjd24rmhg.systemInit(), component.element(), { target: $_aoet5bwbjd24rmfz.constant(component.element()) });
      }
    };
    var removeFromWorld = function (component) {
      if (!$_5fvhg7xxjd24rmkz.isText(component.element())) {
        $_3vsestw9jd24rmfo.each(component.components(), removeFromWorld);
        registry.unregister(component);
      }
      component.disconnect();
    };
    var add = function (component) {
      $_41u2roy1jd24rml7.attach(root, component);
    };
    var remove = function (component) {
      $_41u2roy1jd24rml7.detach(component);
    };
    var destroy = function () {
      domEvents.unbind();
      $_edcoi8y5jd24rmlu.remove(root.element());
    };
    var broadcastData = function (data) {
      var receivers = registry.filter($_9am11ywwjd24rmhg.receive());
      $_3vsestw9jd24rmfo.each(receivers, function (receiver) {
        var descHandler = receiver.descHandler();
        var handler = $_5il8ci12vjd24rn5n.getHandler(descHandler);
        handler(data);
      });
    };
    var broadcast = function (message) {
      broadcastData({
        universal: $_aoet5bwbjd24rmfz.constant(true),
        data: $_aoet5bwbjd24rmfz.constant(message)
      });
    };
    var broadcastOn = function (channels, message) {
      broadcastData({
        universal: $_aoet5bwbjd24rmfz.constant(false),
        channels: $_aoet5bwbjd24rmfz.constant(channels),
        data: $_aoet5bwbjd24rmfz.constant(message)
      });
    };
    var getByUid = function (uid) {
      return registry.getById(uid).fold(function () {
        return $_b2qdiox8jd24rmj0.error(new Error('Could not find component with uid: "' + uid + '" in system.'));
      }, $_b2qdiox8jd24rmj0.value);
    };
    var getByDom = function (elem) {
      return $_c4606g10mjd24rmv9.read(elem).bind(getByUid);
    };
    addToWorld(root);
    return {
      root: $_aoet5bwbjd24rmfz.constant(root),
      element: root.element,
      destroy: destroy,
      add: add,
      remove: remove,
      getByUid: getByUid,
      getByDom: getByDom,
      addToWorld: addToWorld,
      removeFromWorld: removeFromWorld,
      broadcast: broadcast,
      broadcastOn: broadcastOn
    };
  };
  var $_n5vic14zjd24rnf7 = {
    create: create$6,
    takeover: takeover
  };

  var READ_ONLY_MODE_CLASS = $_aoet5bwbjd24rmfz.constant($_4i0vdoz1jd24rmoo.resolve('readonly-mode'));
  var EDIT_MODE_CLASS = $_aoet5bwbjd24rmfz.constant($_4i0vdoz1jd24rmoo.resolve('edit-mode'));
  function OuterContainer (spec) {
    var root = $_57n4pi12kjd24rn3p.build(Container.sketch({
      dom: { classes: [$_4i0vdoz1jd24rmoo.resolve('outer-container')].concat(spec.classes) },
      containerBehaviours: $_9vyb2vw4jd24rmen.derive([Swapping.config({
          alpha: READ_ONLY_MODE_CLASS(),
          omega: EDIT_MODE_CLASS()
        })])
    }));
    return $_n5vic14zjd24rnf7.takeover(root);
  }

  function AndroidRealm (scrollIntoView) {
    var alloy = OuterContainer({ classes: [$_4i0vdoz1jd24rmoo.resolve('android-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = $_2x26512ajd24rn28.api();
    var switchToEdit = $_dh63e514rjd24rne7.makeEditSwitch(webapp);
    var socket = $_dh63e514rjd24rne7.makeSocket();
    var dropup = $_agkmjr14sjd24rnec.build($_aoet5bwbjd24rmfz.noop, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function () {
      toolbar.focus();
    };
    var restoreToolbar = function () {
      toolbar.restoreToolbar();
    };
    var init = function (spec) {
      webapp.set($_3dfh7i13njd24rn9d.produce(spec));
    };
    var exit = function () {
      webapp.run(function (w) {
        w.exit();
        Replacing.remove(socket, switchToEdit);
      });
    };
    var updateMode = function (readOnly) {
      $_dh63e514rjd24rne7.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: $_aoet5bwbjd24rmfz.constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: $_aoet5bwbjd24rmfz.constant(socket),
      dropup: $_aoet5bwbjd24rmfz.constant(dropup)
    };
  }

  var initEvents$1 = function (editorApi, iosApi, toolstrip, socket, dropup) {
    var saveSelectionFirst = function () {
      iosApi.run(function (api) {
        api.highlightSelection();
      });
    };
    var refreshIosSelection = function () {
      iosApi.run(function (api) {
        api.refreshSelection();
      });
    };
    var scrollToY = function (yTop, height) {
      var y = yTop - socket.dom().scrollTop;
      iosApi.run(function (api) {
        api.scrollIntoView(y, y + height);
      });
    };
    var scrollToElement = function (target) {
      scrollToY(iosApi, socket);
    };
    var scrollToCursor = function () {
      editorApi.getCursorBox().each(function (box) {
        scrollToY(box.top(), box.height());
      });
    };
    var clearSelection = function () {
      iosApi.run(function (api) {
        api.clearSelection();
      });
    };
    var clearAndRefresh = function () {
      clearSelection();
      refreshThrottle.throttle();
    };
    var refreshView = function () {
      scrollToCursor();
      iosApi.run(function (api) {
        api.syncHeight();
      });
    };
    var reposition = function () {
      var toolbarHeight = $_duiw2pzrjd24rmr1.get(toolstrip);
      iosApi.run(function (api) {
        api.setViewportOffset(toolbarHeight);
      });
      refreshIosSelection();
      refreshView();
    };
    var toEditing = function () {
      iosApi.run(function (api) {
        api.toEditing();
      });
    };
    var toReading = function () {
      iosApi.run(function (api) {
        api.toReading();
      });
    };
    var onToolbarTouch = function (event) {
      iosApi.run(function (api) {
        api.onToolbarTouch(event);
      });
    };
    var tapping = $_6ujzs213qjd24rn9u.monitor(editorApi);
    var refreshThrottle = $_2i7nem14kjd24rnd8.last(refreshView, 300);
    var listeners = [
      editorApi.onKeyup(clearAndRefresh),
      editorApi.onNodeChanged(refreshIosSelection),
      editorApi.onDomChanged(refreshThrottle.throttle),
      editorApi.onDomChanged(refreshIosSelection),
      editorApi.onScrollToCursor(function (tinyEvent) {
        tinyEvent.preventDefault();
        refreshThrottle.throttle();
      }),
      editorApi.onScrollToElement(function (event) {
        scrollToElement(event.element());
      }),
      editorApi.onToEditing(toEditing),
      editorApi.onToReading(toReading),
      $_a4ythl13kjd24rn91.bind(editorApi.doc(), 'touchend', function (touchEvent) {
        if ($_237cqww8jd24rmfh.eq(editorApi.html(), touchEvent.target()) || $_237cqww8jd24rmfh.eq(editorApi.body(), touchEvent.target())) {
        }
      }),
      $_a4ythl13kjd24rn91.bind(toolstrip, 'transitionend', function (transitionEvent) {
        if (transitionEvent.raw().propertyName === 'height') {
          reposition();
        }
      }),
      $_a4ythl13kjd24rn91.capture(toolstrip, 'touchstart', function (touchEvent) {
        saveSelectionFirst();
        onToolbarTouch(touchEvent);
        editorApi.onTouchToolstrip();
      }),
      $_a4ythl13kjd24rn91.bind(editorApi.body(), 'touchstart', function (evt) {
        clearSelection();
        editorApi.onTouchContent();
        tapping.fireTouchstart(evt);
      }),
      tapping.onTouchmove(),
      tapping.onTouchend(),
      $_a4ythl13kjd24rn91.bind(editorApi.body(), 'click', function (event) {
        event.kill();
      }),
      $_a4ythl13kjd24rn91.bind(toolstrip, 'touchmove', function () {
        editorApi.onToolbarScrollStart();
      })
    ];
    var destroy = function () {
      $_3vsestw9jd24rmfo.each(listeners, function (l) {
        l.unbind();
      });
    };
    return { destroy: destroy };
  };
  var $_4zd7gf15ajd24rnh3 = { initEvents: initEvents$1 };

  var refreshInput = function (input) {
    var start = input.dom().selectionStart;
    var end = input.dom().selectionEnd;
    var dir = input.dom().selectionDirection;
    setTimeout(function () {
      input.dom().setSelectionRange(start, end, dir);
      $_9uflcdygjd24rmmn.focus(input);
    }, 50);
  };
  var refresh = function (winScope) {
    var sel = winScope.getSelection();
    if (sel.rangeCount > 0) {
      var br = sel.getRangeAt(0);
      var r = winScope.document.createRange();
      r.setStart(br.startContainer, br.startOffset);
      r.setEnd(br.endContainer, br.endOffset);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  };
  var $_c3xwyp15ejd24rnhv = {
    refreshInput: refreshInput,
    refresh: refresh
  };

  var resume$1 = function (cWin, frame) {
    $_9uflcdygjd24rmmn.active().each(function (active) {
      if (!$_237cqww8jd24rmfh.eq(active, frame)) {
        $_9uflcdygjd24rmmn.blur(active);
      }
    });
    cWin.focus();
    $_9uflcdygjd24rmmn.focus($_ei6gqxwtjd24rmh8.fromDom(cWin.document.body));
    $_c3xwyp15ejd24rnhv.refresh(cWin);
  };
  var $_3s5ls715djd24rnhs = { resume: resume$1 };

  function FakeSelection (win, frame) {
    var doc = win.document;
    var container = $_ei6gqxwtjd24rmh8.fromTag('div');
    $_c8qis7xujd24rmks.add(container, $_4i0vdoz1jd24rmoo.resolve('unfocused-selections'));
    $_a7pwway2jd24rmlf.append($_ei6gqxwtjd24rmh8.fromDom(doc.documentElement), container);
    var onTouch = $_a4ythl13kjd24rn91.bind(container, 'touchstart', function (event) {
      event.prevent();
      $_3s5ls715djd24rnhs.resume(win, frame);
      clear();
    });
    var make = function (rectangle) {
      var span = $_ei6gqxwtjd24rmh8.fromTag('span');
      $_7u42ke12yjd24rn66.add(span, [
        $_4i0vdoz1jd24rmoo.resolve('layer-editor'),
        $_4i0vdoz1jd24rmoo.resolve('unfocused-selection')
      ]);
      $_ayz4w9zsjd24rmr3.setAll(span, {
        left: rectangle.left() + 'px',
        top: rectangle.top() + 'px',
        width: rectangle.width() + 'px',
        height: rectangle.height() + 'px'
      });
      return span;
    };
    var update = function () {
      clear();
      var rectangles = $_a8y1rq13wjd24rnai.getRectangles(win);
      var spans = $_3vsestw9jd24rmfo.map(rectangles, make);
      $_5ijnivy6jd24rmlw.append(container, spans);
    };
    var clear = function () {
      $_edcoi8y5jd24rmlu.empty(container);
    };
    var destroy = function () {
      onTouch.unbind();
      $_edcoi8y5jd24rmlu.remove(container);
    };
    var isActive = function () {
      return $_5on3koy3jd24rmlg.children(container).length > 0;
    };
    return {
      update: update,
      isActive: isActive,
      destroy: destroy,
      clear: clear
    };
  }

  var nu$8 = function (baseFn) {
    var data = $_asi680wajd24rmfv.none();
    var callbacks = [];
    var map = function (f) {
      return nu$8(function (nCallback) {
        get(function (data) {
          nCallback(f(data));
        });
      });
    };
    var get = function (nCallback) {
      if (isReady())
        call(nCallback);
      else
        callbacks.push(nCallback);
    };
    var set = function (x) {
      data = $_asi680wajd24rmfv.some(x);
      run(callbacks);
      callbacks = [];
    };
    var isReady = function () {
      return data.isSome();
    };
    var run = function (cbs) {
      $_3vsestw9jd24rmfo.each(cbs, call);
    };
    var call = function (cb) {
      data.each(function (x) {
        setTimeout(function () {
          cb(x);
        }, 0);
      });
    };
    baseFn(set);
    return {
      get: get,
      map: map,
      isReady: isReady
    };
  };
  var pure$1 = function (a) {
    return nu$8(function (callback) {
      callback(a);
    });
  };
  var $_3f9pl815hjd24rni5 = {
    nu: nu$8,
    pure: pure$1
  };

  var bounce = function (f) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var me = this;
      setTimeout(function () {
        f.apply(me, args);
      }, 0);
    };
  };
  var $_hq7tp15ijd24rni7 = { bounce: bounce };

  var nu$9 = function (baseFn) {
    var get = function (callback) {
      baseFn($_hq7tp15ijd24rni7.bounce(callback));
    };
    var map = function (fab) {
      return nu$9(function (callback) {
        get(function (a) {
          var value = fab(a);
          callback(value);
        });
      });
    };
    var bind = function (aFutureB) {
      return nu$9(function (callback) {
        get(function (a) {
          aFutureB(a).get(callback);
        });
      });
    };
    var anonBind = function (futureB) {
      return nu$9(function (callback) {
        get(function (a) {
          futureB.get(callback);
        });
      });
    };
    var toLazy = function () {
      return $_3f9pl815hjd24rni5.nu(get);
    };
    return {
      map: map,
      bind: bind,
      anonBind: anonBind,
      toLazy: toLazy,
      get: get
    };
  };
  var pure$2 = function (a) {
    return nu$9(function (callback) {
      callback(a);
    });
  };
  var $_2g1nix15gjd24rni4 = {
    nu: nu$9,
    pure: pure$2
  };

  var adjust = function (value, destination, amount) {
    if (Math.abs(value - destination) <= amount) {
      return $_asi680wajd24rmfv.none();
    } else if (value < destination) {
      return $_asi680wajd24rmfv.some(value + amount);
    } else {
      return $_asi680wajd24rmfv.some(value - amount);
    }
  };
  var create$7 = function () {
    var interval = null;
    var animate = function (getCurrent, destination, amount, increment, doFinish, rate) {
      var finished = false;
      var finish = function (v) {
        finished = true;
        doFinish(v);
      };
      clearInterval(interval);
      var abort = function (v) {
        clearInterval(interval);
        finish(v);
      };
      interval = setInterval(function () {
        var value = getCurrent();
        adjust(value, destination, amount).fold(function () {
          clearInterval(interval);
          finish(destination);
        }, function (s) {
          increment(s, abort);
          if (!finished) {
            var newValue = getCurrent();
            if (newValue !== s || Math.abs(newValue - destination) > Math.abs(value - destination)) {
              clearInterval(interval);
              finish(destination);
            }
          }
        });
      }, rate);
    };
    return { animate: animate };
  };
  var $_ay5gd15jjd24rni8 = {
    create: create$7,
    adjust: adjust
  };

  var findDevice = function (deviceWidth, deviceHeight) {
    var devices = [
      {
        width: 320,
        height: 480,
        keyboard: {
          portrait: 300,
          landscape: 240
        }
      },
      {
        width: 320,
        height: 568,
        keyboard: {
          portrait: 300,
          landscape: 240
        }
      },
      {
        width: 375,
        height: 667,
        keyboard: {
          portrait: 305,
          landscape: 240
        }
      },
      {
        width: 414,
        height: 736,
        keyboard: {
          portrait: 320,
          landscape: 240
        }
      },
      {
        width: 768,
        height: 1024,
        keyboard: {
          portrait: 320,
          landscape: 400
        }
      },
      {
        width: 1024,
        height: 1366,
        keyboard: {
          portrait: 380,
          landscape: 460
        }
      }
    ];
    return $_dq6bfmyejd24rmml.findMap(devices, function (device) {
      return deviceWidth <= device.width && deviceHeight <= device.height ? $_asi680wajd24rmfv.some(device.keyboard) : $_asi680wajd24rmfv.none();
    }).getOr({
      portrait: deviceHeight / 5,
      landscape: deviceWidth / 4
    });
  };
  var $_2mc5wc15mjd24rnir = { findDevice: findDevice };

  var softKeyboardLimits = function (outerWindow) {
    return $_2mc5wc15mjd24rnir.findDevice(outerWindow.screen.width, outerWindow.screen.height);
  };
  var accountableKeyboardHeight = function (outerWindow) {
    var portrait = $_fnc6j613jjd24rn8v.get(outerWindow).isPortrait();
    var limits = softKeyboardLimits(outerWindow);
    var keyboard = portrait ? limits.portrait : limits.landscape;
    var visualScreenHeight = portrait ? outerWindow.screen.height : outerWindow.screen.width;
    return visualScreenHeight - outerWindow.innerHeight > keyboard ? 0 : keyboard;
  };
  var getGreenzone = function (socket, dropup) {
    var outerWindow = $_5on3koy3jd24rmlg.owner(socket).dom().defaultView;
    var viewportHeight = $_duiw2pzrjd24rmr1.get(socket) + $_duiw2pzrjd24rmr1.get(dropup);
    var acc = accountableKeyboardHeight(outerWindow);
    return viewportHeight - acc;
  };
  var updatePadding = function (contentBody, socket, dropup) {
    var greenzoneHeight = getGreenzone(socket, dropup);
    var deltaHeight = $_duiw2pzrjd24rmr1.get(socket) + $_duiw2pzrjd24rmr1.get(dropup) - greenzoneHeight;
    $_ayz4w9zsjd24rmr3.set(contentBody, 'padding-bottom', deltaHeight + 'px');
  };
  var $_6b2d5z15ljd24rnio = {
    getGreenzone: getGreenzone,
    updatePadding: updatePadding
  };

  var fixture = $_45w193x4jd24rmi8.generate([
    {
      fixed: [
        'element',
        'property',
        'offsetY'
      ]
    },
    {
      scroller: [
        'element',
        'offsetY'
      ]
    }
  ]);
  var yFixedData = 'data-' + $_4i0vdoz1jd24rmoo.resolve('position-y-fixed');
  var yFixedProperty = 'data-' + $_4i0vdoz1jd24rmoo.resolve('y-property');
  var yScrollingData = 'data-' + $_4i0vdoz1jd24rmoo.resolve('scrolling');
  var windowSizeData = 'data-' + $_4i0vdoz1jd24rmoo.resolve('last-window-height');
  var getYFixedData = function (element) {
    return $_6aqaow13vjd24rnag.safeParse(element, yFixedData);
  };
  var getYFixedProperty = function (element) {
    return $_dxjq1vxwjd24rmkv.get(element, yFixedProperty);
  };
  var getLastWindowSize = function (element) {
    return $_6aqaow13vjd24rnag.safeParse(element, windowSizeData);
  };
  var classifyFixed = function (element, offsetY) {
    var prop = getYFixedProperty(element);
    return fixture.fixed(element, prop, offsetY);
  };
  var classifyScrolling = function (element, offsetY) {
    return fixture.scroller(element, offsetY);
  };
  var classify = function (element) {
    var offsetY = getYFixedData(element);
    var classifier = $_dxjq1vxwjd24rmkv.get(element, yScrollingData) === 'true' ? classifyScrolling : classifyFixed;
    return classifier(element, offsetY);
  };
  var findFixtures = function (container) {
    var candidates = $_dew4q4zkjd24rmqh.descendants(container, '[' + yFixedData + ']');
    return $_3vsestw9jd24rmfo.map(candidates, classify);
  };
  var takeoverToolbar = function (toolbar) {
    var oldToolbarStyle = $_dxjq1vxwjd24rmkv.get(toolbar, 'style');
    $_ayz4w9zsjd24rmr3.setAll(toolbar, {
      position: 'absolute',
      top: '0px'
    });
    $_dxjq1vxwjd24rmkv.set(toolbar, yFixedData, '0px');
    $_dxjq1vxwjd24rmkv.set(toolbar, yFixedProperty, 'top');
    var restore = function () {
      $_dxjq1vxwjd24rmkv.set(toolbar, 'style', oldToolbarStyle || '');
      $_dxjq1vxwjd24rmkv.remove(toolbar, yFixedData);
      $_dxjq1vxwjd24rmkv.remove(toolbar, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverViewport = function (toolbarHeight, height, viewport) {
    var oldViewportStyle = $_dxjq1vxwjd24rmkv.get(viewport, 'style');
    $_c71wbk13hjd24rn8p.register(viewport);
    $_ayz4w9zsjd24rmr3.setAll(viewport, {
      position: 'absolute',
      height: height + 'px',
      width: '100%',
      top: toolbarHeight + 'px'
    });
    $_dxjq1vxwjd24rmkv.set(viewport, yFixedData, toolbarHeight + 'px');
    $_dxjq1vxwjd24rmkv.set(viewport, yScrollingData, 'true');
    $_dxjq1vxwjd24rmkv.set(viewport, yFixedProperty, 'top');
    var restore = function () {
      $_c71wbk13hjd24rn8p.deregister(viewport);
      $_dxjq1vxwjd24rmkv.set(viewport, 'style', oldViewportStyle || '');
      $_dxjq1vxwjd24rmkv.remove(viewport, yFixedData);
      $_dxjq1vxwjd24rmkv.remove(viewport, yScrollingData);
      $_dxjq1vxwjd24rmkv.remove(viewport, yFixedProperty);
    };
    return { restore: restore };
  };
  var takeoverDropup = function (dropup, toolbarHeight, viewportHeight) {
    var oldDropupStyle = $_dxjq1vxwjd24rmkv.get(dropup, 'style');
    $_ayz4w9zsjd24rmr3.setAll(dropup, {
      position: 'absolute',
      bottom: '0px'
    });
    $_dxjq1vxwjd24rmkv.set(dropup, yFixedData, '0px');
    $_dxjq1vxwjd24rmkv.set(dropup, yFixedProperty, 'bottom');
    var restore = function () {
      $_dxjq1vxwjd24rmkv.set(dropup, 'style', oldDropupStyle || '');
      $_dxjq1vxwjd24rmkv.remove(dropup, yFixedData);
      $_dxjq1vxwjd24rmkv.remove(dropup, yFixedProperty);
    };
    return { restore: restore };
  };
  var deriveViewportHeight = function (viewport, toolbarHeight, dropupHeight) {
    var outerWindow = $_5on3koy3jd24rmlg.owner(viewport).dom().defaultView;
    var winH = outerWindow.innerHeight;
    $_dxjq1vxwjd24rmkv.set(viewport, windowSizeData, winH + 'px');
    return winH - toolbarHeight - dropupHeight;
  };
  var takeover$1 = function (viewport, contentBody, toolbar, dropup) {
    var outerWindow = $_5on3koy3jd24rmlg.owner(viewport).dom().defaultView;
    var toolbarSetup = takeoverToolbar(toolbar);
    var toolbarHeight = $_duiw2pzrjd24rmr1.get(toolbar);
    var dropupHeight = $_duiw2pzrjd24rmr1.get(dropup);
    var viewportHeight = deriveViewportHeight(viewport, toolbarHeight, dropupHeight);
    var viewportSetup = takeoverViewport(toolbarHeight, viewportHeight, viewport);
    var dropupSetup = takeoverDropup(dropup, toolbarHeight, viewportHeight);
    var isActive = true;
    var restore = function () {
      isActive = false;
      toolbarSetup.restore();
      viewportSetup.restore();
      dropupSetup.restore();
    };
    var isExpanding = function () {
      var currentWinHeight = outerWindow.innerHeight;
      var lastWinHeight = getLastWindowSize(viewport);
      return currentWinHeight > lastWinHeight;
    };
    var refresh = function () {
      if (isActive) {
        var newToolbarHeight = $_duiw2pzrjd24rmr1.get(toolbar);
        var dropupHeight_1 = $_duiw2pzrjd24rmr1.get(dropup);
        var newHeight = deriveViewportHeight(viewport, newToolbarHeight, dropupHeight_1);
        $_dxjq1vxwjd24rmkv.set(viewport, yFixedData, newToolbarHeight + 'px');
        $_ayz4w9zsjd24rmr3.set(viewport, 'height', newHeight + 'px');
        $_ayz4w9zsjd24rmr3.set(dropup, 'bottom', -(newToolbarHeight + newHeight + dropupHeight_1) + 'px');
        $_6b2d5z15ljd24rnio.updatePadding(contentBody, viewport, dropup);
      }
    };
    var setViewportOffset = function (newYOffset) {
      var offsetPx = newYOffset + 'px';
      $_dxjq1vxwjd24rmkv.set(viewport, yFixedData, offsetPx);
      refresh();
    };
    $_6b2d5z15ljd24rnio.updatePadding(contentBody, viewport, dropup);
    return {
      setViewportOffset: setViewportOffset,
      isExpanding: isExpanding,
      isShrinking: $_aoet5bwbjd24rmfz.not(isExpanding),
      refresh: refresh,
      restore: restore
    };
  };
  var $_6ylanx15kjd24rnib = {
    findFixtures: findFixtures,
    takeover: takeover$1,
    getYFixedData: getYFixedData
  };

  var animator = $_ay5gd15jjd24rni8.create();
  var ANIMATION_STEP = 15;
  var NUM_TOP_ANIMATION_FRAMES = 10;
  var ANIMATION_RATE = 10;
  var lastScroll = 'data-' + $_4i0vdoz1jd24rmoo.resolve('last-scroll-top');
  var getTop = function (element) {
    var raw = $_ayz4w9zsjd24rmr3.getRaw(element, 'top').getOr(0);
    return parseInt(raw, 10);
  };
  var getScrollTop = function (element) {
    return parseInt(element.dom().scrollTop, 10);
  };
  var moveScrollAndTop = function (element, destination, finalTop) {
    return $_2g1nix15gjd24rni4.nu(function (callback) {
      var getCurrent = $_aoet5bwbjd24rmfz.curry(getScrollTop, element);
      var update = function (newScroll) {
        element.dom().scrollTop = newScroll;
        $_ayz4w9zsjd24rmr3.set(element, 'top', getTop(element) + ANIMATION_STEP + 'px');
      };
      var finish = function () {
        element.dom().scrollTop = destination;
        $_ayz4w9zsjd24rmr3.set(element, 'top', finalTop + 'px');
        callback(destination);
      };
      animator.animate(getCurrent, destination, ANIMATION_STEP, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyScroll = function (element, destination) {
    return $_2g1nix15gjd24rni4.nu(function (callback) {
      var getCurrent = $_aoet5bwbjd24rmfz.curry(getScrollTop, element);
      $_dxjq1vxwjd24rmkv.set(element, lastScroll, getCurrent());
      var update = function (newScroll, abort) {
        var previous = $_6aqaow13vjd24rnag.safeParse(element, lastScroll);
        if (previous !== element.dom().scrollTop) {
          abort(element.dom().scrollTop);
        } else {
          element.dom().scrollTop = newScroll;
          $_dxjq1vxwjd24rmkv.set(element, lastScroll, newScroll);
        }
      };
      var finish = function () {
        element.dom().scrollTop = destination;
        $_dxjq1vxwjd24rmkv.set(element, lastScroll, destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var moveOnlyTop = function (element, destination) {
    return $_2g1nix15gjd24rni4.nu(function (callback) {
      var getCurrent = $_aoet5bwbjd24rmfz.curry(getTop, element);
      var update = function (newTop) {
        $_ayz4w9zsjd24rmr3.set(element, 'top', newTop + 'px');
      };
      var finish = function () {
        update(destination);
        callback(destination);
      };
      var distance = Math.abs(destination - getCurrent());
      var step = Math.ceil(distance / NUM_TOP_ANIMATION_FRAMES);
      animator.animate(getCurrent, destination, step, update, finish, ANIMATION_RATE);
    });
  };
  var updateTop = function (element, amount) {
    var newTop = amount + $_6ylanx15kjd24rnib.getYFixedData(element) + 'px';
    $_ayz4w9zsjd24rmr3.set(element, 'top', newTop);
  };
  var moveWindowScroll = function (toolbar, viewport, destY) {
    var outerWindow = $_5on3koy3jd24rmlg.owner(toolbar).dom().defaultView;
    return $_2g1nix15gjd24rni4.nu(function (callback) {
      updateTop(toolbar, destY);
      updateTop(viewport, destY);
      outerWindow.scrollTo(0, destY);
      callback(destY);
    });
  };
  var $_c8jma315fjd24rnhy = {
    moveScrollAndTop: moveScrollAndTop,
    moveOnlyScroll: moveOnlyScroll,
    moveOnlyTop: moveOnlyTop,
    moveWindowScroll: moveWindowScroll
  };

  function BackgroundActivity (doAction) {
    var action = Cell($_3f9pl815hjd24rni5.pure({}));
    var start = function (value) {
      var future = $_3f9pl815hjd24rni5.nu(function (callback) {
        return doAction(value).get(callback);
      });
      action.set(future);
    };
    var idle = function (g) {
      action.get().get(function () {
        g();
      });
    };
    return {
      start: start,
      idle: idle
    };
  }

  var scrollIntoView = function (cWin, socket, dropup, top, bottom) {
    var greenzone = $_6b2d5z15ljd24rnio.getGreenzone(socket, dropup);
    var refreshCursor = $_aoet5bwbjd24rmfz.curry($_c3xwyp15ejd24rnhv.refresh, cWin);
    if (top > greenzone || bottom > greenzone) {
      $_c8jma315fjd24rnhy.moveOnlyScroll(socket, socket.dom().scrollTop - greenzone + bottom).get(refreshCursor);
    } else if (top < 0) {
      $_c8jma315fjd24rnhy.moveOnlyScroll(socket, socket.dom().scrollTop + top).get(refreshCursor);
    } else {
    }
  };
  var $_4henea15ojd24rniy = { scrollIntoView: scrollIntoView };

  var par = function (asyncValues, nu) {
    return nu(function (callback) {
      var r = [];
      var count = 0;
      var cb = function (i) {
        return function (value) {
          r[i] = value;
          count++;
          if (count >= asyncValues.length) {
            callback(r);
          }
        };
      };
      if (asyncValues.length === 0) {
        callback([]);
      } else {
        $_3vsestw9jd24rmfo.each(asyncValues, function (asyncValue, i) {
          asyncValue.get(cb(i));
        });
      }
    });
  };
  var $_4vwxxd15rjd24rnj6 = { par: par };

  var par$1 = function (futures) {
    return $_4vwxxd15rjd24rnj6.par(futures, $_2g1nix15gjd24rni4.nu);
  };
  var mapM = function (array, fn) {
    var futures = $_3vsestw9jd24rmfo.map(array, fn);
    return par$1(futures);
  };
  var compose$1 = function (f, g) {
    return function (a) {
      return g(a).bind(f);
    };
  };
  var $_g6k6mn15qjd24rnj5 = {
    par: par$1,
    mapM: mapM,
    compose: compose$1
  };

  var updateFixed = function (element, property, winY, offsetY) {
    var destination = winY + offsetY;
    $_ayz4w9zsjd24rmr3.set(element, property, destination + 'px');
    return $_2g1nix15gjd24rni4.pure(offsetY);
  };
  var updateScrollingFixed = function (element, winY, offsetY) {
    var destTop = winY + offsetY;
    var oldProp = $_ayz4w9zsjd24rmr3.getRaw(element, 'top').getOr(offsetY);
    var delta = destTop - parseInt(oldProp, 10);
    var destScroll = element.dom().scrollTop + delta;
    return $_c8jma315fjd24rnhy.moveScrollAndTop(element, destScroll, destTop);
  };
  var updateFixture = function (fixture, winY) {
    return fixture.fold(function (element, property, offsetY) {
      return updateFixed(element, property, winY, offsetY);
    }, function (element, offsetY) {
      return updateScrollingFixed(element, winY, offsetY);
    });
  };
  var updatePositions = function (container, winY) {
    var fixtures = $_6ylanx15kjd24rnib.findFixtures(container);
    var updates = $_3vsestw9jd24rmfo.map(fixtures, function (fixture) {
      return updateFixture(fixture, winY);
    });
    return $_g6k6mn15qjd24rnj5.par(updates);
  };
  var $_6w7jz115pjd24rnj0 = { updatePositions: updatePositions };

  var input = function (parent, operation) {
    var input = $_ei6gqxwtjd24rmh8.fromTag('input');
    $_ayz4w9zsjd24rmr3.setAll(input, {
      opacity: '0',
      position: 'absolute',
      top: '-1000px',
      left: '-1000px'
    });
    $_a7pwway2jd24rmlf.append(parent, input);
    $_9uflcdygjd24rmmn.focus(input);
    operation(input);
    $_edcoi8y5jd24rmlu.remove(input);
  };
  var $_fpbfok15sjd24rnj8 = { input: input };

  var VIEW_MARGIN = 5;
  var register$2 = function (toolstrip, socket, container, outerWindow, structure, cWin) {
    var scroller = BackgroundActivity(function (y) {
      return $_c8jma315fjd24rnhy.moveWindowScroll(toolstrip, socket, y);
    });
    var scrollBounds = function () {
      var rects = $_a8y1rq13wjd24rnai.getRectangles(cWin);
      return $_asi680wajd24rmfv.from(rects[0]).bind(function (rect) {
        var viewTop = rect.top() - socket.dom().scrollTop;
        var outside = viewTop > outerWindow.innerHeight + VIEW_MARGIN || viewTop < -VIEW_MARGIN;
        return outside ? $_asi680wajd24rmfv.some({
          top: $_aoet5bwbjd24rmfz.constant(viewTop),
          bottom: $_aoet5bwbjd24rmfz.constant(viewTop + rect.height())
        }) : $_asi680wajd24rmfv.none();
      });
    };
    var scrollThrottle = $_2i7nem14kjd24rnd8.last(function () {
      scroller.idle(function () {
        $_6w7jz115pjd24rnj0.updatePositions(container, outerWindow.pageYOffset).get(function () {
          var extraScroll = scrollBounds();
          extraScroll.each(function (extra) {
            socket.dom().scrollTop = socket.dom().scrollTop + extra.top();
          });
          scroller.start(0);
          structure.refresh();
        });
      });
    }, 1000);
    var onScroll = $_a4ythl13kjd24rn91.bind($_ei6gqxwtjd24rmh8.fromDom(outerWindow), 'scroll', function () {
      if (outerWindow.pageYOffset < 0) {
        return;
      }
      scrollThrottle.throttle();
    });
    $_6w7jz115pjd24rnj0.updatePositions(container, outerWindow.pageYOffset).get($_aoet5bwbjd24rmfz.identity);
    return { unbind: onScroll.unbind };
  };
  var setup$3 = function (bag) {
    var cWin = bag.cWin();
    var ceBody = bag.ceBody();
    var socket = bag.socket();
    var toolstrip = bag.toolstrip();
    var toolbar = bag.toolbar();
    var contentElement = bag.contentElement();
    var keyboardType = bag.keyboardType();
    var outerWindow = bag.outerWindow();
    var dropup = bag.dropup();
    var structure = $_6ylanx15kjd24rnib.takeover(socket, ceBody, toolstrip, dropup);
    var keyboardModel = keyboardType(bag.outerBody(), cWin, $_fqsltgy7jd24rmlz.body(), contentElement, toolstrip, toolbar);
    var toEditing = function () {
      keyboardModel.toEditing();
      clearSelection();
    };
    var toReading = function () {
      keyboardModel.toReading();
    };
    var onToolbarTouch = function (event) {
      keyboardModel.onToolbarTouch(event);
    };
    var onOrientation = $_fnc6j613jjd24rn8v.onChange(outerWindow, {
      onChange: $_aoet5bwbjd24rmfz.noop,
      onReady: structure.refresh
    });
    onOrientation.onAdjustment(function () {
      structure.refresh();
    });
    var onResize = $_a4ythl13kjd24rn91.bind($_ei6gqxwtjd24rmh8.fromDom(outerWindow), 'resize', function () {
      if (structure.isExpanding()) {
        structure.refresh();
      }
    });
    var onScroll = register$2(toolstrip, socket, bag.outerBody(), outerWindow, structure, cWin);
    var unfocusedSelection = FakeSelection(cWin, contentElement);
    var refreshSelection = function () {
      if (unfocusedSelection.isActive()) {
        unfocusedSelection.update();
      }
    };
    var highlightSelection = function () {
      unfocusedSelection.update();
    };
    var clearSelection = function () {
      unfocusedSelection.clear();
    };
    var scrollIntoView = function (top, bottom) {
      $_4henea15ojd24rniy.scrollIntoView(cWin, socket, dropup, top, bottom);
    };
    var syncHeight = function () {
      $_ayz4w9zsjd24rmr3.set(contentElement, 'height', contentElement.dom().contentWindow.document.body.scrollHeight + 'px');
    };
    var setViewportOffset = function (newYOffset) {
      structure.setViewportOffset(newYOffset);
      $_c8jma315fjd24rnhy.moveOnlyTop(socket, newYOffset).get($_aoet5bwbjd24rmfz.identity);
    };
    var destroy = function () {
      structure.restore();
      onOrientation.destroy();
      onScroll.unbind();
      onResize.unbind();
      keyboardModel.destroy();
      unfocusedSelection.destroy();
      $_fpbfok15sjd24rnj8.input($_fqsltgy7jd24rmlz.body(), $_9uflcdygjd24rmmn.blur);
    };
    return {
      toEditing: toEditing,
      toReading: toReading,
      onToolbarTouch: onToolbarTouch,
      refreshSelection: refreshSelection,
      clearSelection: clearSelection,
      highlightSelection: highlightSelection,
      scrollIntoView: scrollIntoView,
      updateToolbarPadding: $_aoet5bwbjd24rmfz.noop,
      setViewportOffset: setViewportOffset,
      syncHeight: syncHeight,
      refreshStructure: structure.refresh,
      destroy: destroy
    };
  };
  var $_96hnk15bjd24rnha = { setup: setup$3 };

  var stubborn = function (outerBody, cWin, page, frame) {
    var toEditing = function () {
      $_3s5ls715djd24rnhs.resume(cWin, frame);
    };
    var toReading = function () {
      $_fpbfok15sjd24rnj8.input(outerBody, $_9uflcdygjd24rmmn.blur);
    };
    var captureInput = $_a4ythl13kjd24rn91.bind(page, 'keydown', function (evt) {
      if (!$_3vsestw9jd24rmfo.contains([
          'input',
          'textarea'
        ], $_5fvhg7xxjd24rmkz.name(evt.target()))) {
        toEditing();
      }
    });
    var onToolbarTouch = function () {
    };
    var destroy = function () {
      captureInput.unbind();
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: destroy
    };
  };
  var timid = function (outerBody, cWin, page, frame) {
    var dismissKeyboard = function () {
      $_9uflcdygjd24rmmn.blur(frame);
    };
    var onToolbarTouch = function () {
      dismissKeyboard();
    };
    var toReading = function () {
      dismissKeyboard();
    };
    var toEditing = function () {
      $_3s5ls715djd24rnhs.resume(cWin, frame);
    };
    return {
      toReading: toReading,
      toEditing: toEditing,
      onToolbarTouch: onToolbarTouch,
      destroy: $_aoet5bwbjd24rmfz.noop
    };
  };
  var $_25av4u15tjd24rnjc = {
    stubborn: stubborn,
    timid: timid
  };

  var create$8 = function (platform, mask) {
    var meta = $_bguo6714hjd24rnct.tag();
    var priorState = $_2x26512ajd24rn28.value();
    var scrollEvents = $_2x26512ajd24rn28.value();
    var iosApi = $_2x26512ajd24rn28.api();
    var iosEvents = $_2x26512ajd24rn28.api();
    var enter = function () {
      mask.hide();
      var doc = $_ei6gqxwtjd24rmh8.fromDom(document);
      $_7sgs3814fjd24rncf.getActiveApi(platform.editor).each(function (editorApi) {
        priorState.set({
          socketHeight: $_ayz4w9zsjd24rmr3.getRaw(platform.socket, 'height'),
          iframeHeight: $_ayz4w9zsjd24rmr3.getRaw(editorApi.frame(), 'height'),
          outerScroll: document.body.scrollTop
        });
        scrollEvents.set({ exclusives: $_2nwq8n14qjd24rne2.exclusive(doc, '.' + $_c71wbk13hjd24rn8p.scrollable()) });
        $_c8qis7xujd24rmks.add(platform.container, $_4i0vdoz1jd24rmoo.resolve('fullscreen-maximized'));
        $_ck8n0314gjd24rncn.clobberStyles(platform.container, editorApi.body());
        meta.maximize();
        $_ayz4w9zsjd24rmr3.set(platform.socket, 'overflow', 'scroll');
        $_ayz4w9zsjd24rmr3.set(platform.socket, '-webkit-overflow-scrolling', 'touch');
        $_9uflcdygjd24rmmn.focus(editorApi.body());
        var setupBag = $_ws57hxmjd24rmkd.immutableBag([
          'cWin',
          'ceBody',
          'socket',
          'toolstrip',
          'toolbar',
          'dropup',
          'contentElement',
          'cursor',
          'keyboardType',
          'isScrolling',
          'outerWindow',
          'outerBody'
        ], []);
        iosApi.set($_96hnk15bjd24rnha.setup(setupBag({
          cWin: editorApi.win(),
          ceBody: editorApi.body(),
          socket: platform.socket,
          toolstrip: platform.toolstrip,
          toolbar: platform.toolbar,
          dropup: platform.dropup.element(),
          contentElement: editorApi.frame(),
          cursor: $_aoet5bwbjd24rmfz.noop,
          outerBody: platform.body,
          outerWindow: platform.win,
          keyboardType: $_25av4u15tjd24rnjc.stubborn,
          isScrolling: function () {
            return scrollEvents.get().exists(function (s) {
              return s.socket.isScrolling();
            });
          }
        })));
        iosApi.run(function (api) {
          api.syncHeight();
        });
        iosEvents.set($_4zd7gf15ajd24rnh3.initEvents(editorApi, iosApi, platform.toolstrip, platform.socket, platform.dropup));
      });
    };
    var exit = function () {
      meta.restore();
      iosEvents.clear();
      iosApi.clear();
      mask.show();
      priorState.on(function (s) {
        s.socketHeight.each(function (h) {
          $_ayz4w9zsjd24rmr3.set(platform.socket, 'height', h);
        });
        s.iframeHeight.each(function (h) {
          $_ayz4w9zsjd24rmr3.set(platform.editor.getFrame(), 'height', h);
        });
        document.body.scrollTop = s.scrollTop;
      });
      priorState.clear();
      scrollEvents.on(function (s) {
        s.exclusives.unbind();
      });
      scrollEvents.clear();
      $_c8qis7xujd24rmks.remove(platform.container, $_4i0vdoz1jd24rmoo.resolve('fullscreen-maximized'));
      $_ck8n0314gjd24rncn.restoreStyles();
      $_c71wbk13hjd24rn8p.deregister(platform.toolbar);
      $_ayz4w9zsjd24rmr3.remove(platform.socket, 'overflow');
      $_ayz4w9zsjd24rmr3.remove(platform.socket, '-webkit-overflow-scrolling');
      $_9uflcdygjd24rmmn.blur(platform.editor.getFrame());
      $_7sgs3814fjd24rncf.getActiveApi(platform.editor).each(function (editorApi) {
        editorApi.clearSelection();
      });
    };
    var refreshStructure = function () {
      iosApi.run(function (api) {
        api.refreshStructure();
      });
    };
    return {
      enter: enter,
      refreshStructure: refreshStructure,
      exit: exit
    };
  };
  var $_adp1og159jd24rngr = { create: create$8 };

  var produce$1 = function (raw) {
    var mobile = $_bdtykhxhjd24rmjn.asRawOrDie('Getting IosWebapp schema', MobileSchema, raw);
    $_ayz4w9zsjd24rmr3.set(mobile.toolstrip, 'width', '100%');
    $_ayz4w9zsjd24rmr3.set(mobile.container, 'position', 'relative');
    var onView = function () {
      mobile.setReadOnly(true);
      mode.enter();
    };
    var mask = $_57n4pi12kjd24rn3p.build($_3wiqws14jjd24rnd2.sketch(onView, mobile.translate));
    mobile.alloy.add(mask);
    var maskApi = {
      show: function () {
        mobile.alloy.add(mask);
      },
      hide: function () {
        mobile.alloy.remove(mask);
      }
    };
    var mode = $_adp1og159jd24rngr.create(mobile, maskApi);
    return {
      setReadOnly: mobile.setReadOnly,
      refreshStructure: mode.refreshStructure,
      enter: mode.enter,
      exit: mode.exit,
      destroy: $_aoet5bwbjd24rmfz.noop
    };
  };
  var $_9ki28u158jd24rngm = { produce: produce$1 };

  function IosRealm (scrollIntoView) {
    var alloy = OuterContainer({ classes: [$_4i0vdoz1jd24rmoo.resolve('ios-container')] });
    var toolbar = ScrollingToolbar();
    var webapp = $_2x26512ajd24rn28.api();
    var switchToEdit = $_dh63e514rjd24rne7.makeEditSwitch(webapp);
    var socket = $_dh63e514rjd24rne7.makeSocket();
    var dropup = $_agkmjr14sjd24rnec.build(function () {
      webapp.run(function (w) {
        w.refreshStructure();
      });
    }, scrollIntoView);
    alloy.add(toolbar.wrapper());
    alloy.add(socket);
    alloy.add(dropup.component());
    var setToolbarGroups = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setGroups(groups);
    };
    var setContextToolbar = function (rawGroups) {
      var groups = toolbar.createGroups(rawGroups);
      toolbar.setContextToolbar(groups);
    };
    var focusToolbar = function () {
      toolbar.focus();
    };
    var restoreToolbar = function () {
      toolbar.restoreToolbar();
    };
    var init = function (spec) {
      webapp.set($_9ki28u158jd24rngm.produce(spec));
    };
    var exit = function () {
      webapp.run(function (w) {
        Replacing.remove(socket, switchToEdit);
        w.exit();
      });
    };
    var updateMode = function (readOnly) {
      $_dh63e514rjd24rne7.updateMode(socket, switchToEdit, readOnly, alloy.root());
    };
    return {
      system: $_aoet5bwbjd24rmfz.constant(alloy),
      element: alloy.element,
      init: init,
      exit: exit,
      setToolbarGroups: setToolbarGroups,
      setContextToolbar: setContextToolbar,
      focusToolbar: focusToolbar,
      restoreToolbar: restoreToolbar,
      updateMode: updateMode,
      socket: $_aoet5bwbjd24rmfz.constant(socket),
      dropup: $_aoet5bwbjd24rmfz.constant(dropup)
    };
  }

  var EditorManager = tinymce.util.Tools.resolve('tinymce.EditorManager');

  var derive$4 = function (editor) {
    var base = $_bzffwwx6jd24rmit.readOptFrom(editor.settings, 'skin_url').fold(function () {
      return EditorManager.baseURL + '/skins/' + 'lightgray';
    }, function (url) {
      return url;
    });
    return {
      content: base + '/content.mobile.min.css',
      ui: base + '/skin.mobile.min.css'
    };
  };
  var $_4t5ij815ujd24rnji = { derive: derive$4 };

  var fontSizes = [
    'x-small',
    'small',
    'medium',
    'large',
    'x-large'
  ];
  var fireChange$1 = function (realm, command, state) {
    realm.system().broadcastOn([$_11cbmdyojd24rmn5.formatChanged()], {
      command: command,
      state: state
    });
  };
  var init$5 = function (realm, editor) {
    var allFormats = $_2hhb0ax0jd24rmhp.keys(editor.formatter.get());
    $_3vsestw9jd24rmfo.each(allFormats, function (command) {
      editor.formatter.formatChanged(command, function (state) {
        fireChange$1(realm, command, state);
      });
    });
    $_3vsestw9jd24rmfo.each([
      'ul',
      'ol'
    ], function (command) {
      editor.selection.selectorChanged(command, function (state, data) {
        fireChange$1(realm, command, state);
      });
    });
  };
  var $_f7mxdw15wjd24rnjk = {
    init: init$5,
    fontSizes: $_aoet5bwbjd24rmfz.constant(fontSizes)
  };

  var fireSkinLoaded = function (editor) {
    var done = function () {
      editor._skinLoaded = true;
      editor.fire('SkinLoaded');
    };
    return function () {
      if (editor.initialized) {
        done();
      } else {
        editor.on('init', done);
      }
    };
  };
  var $_brv3fn15xjd24rnjn = { fireSkinLoaded: fireSkinLoaded };

  var READING = $_aoet5bwbjd24rmfz.constant('toReading');
  var EDITING = $_aoet5bwbjd24rmfz.constant('toEditing');
  ThemeManager.add('mobile', function (editor) {
    var renderUI = function (args) {
      var cssUrls = $_4t5ij815ujd24rnji.derive(editor);
      if ($_24galiynjd24rmn4.isSkinDisabled(editor) === false) {
        editor.contentCSS.push(cssUrls.content);
        DOMUtils.DOM.styleSheetLoader.load(cssUrls.ui, $_brv3fn15xjd24rnjn.fireSkinLoaded(editor));
      } else {
        $_brv3fn15xjd24rnjn.fireSkinLoaded(editor)();
      }
      var doScrollIntoView = function () {
        editor.fire('scrollIntoView');
      };
      var wrapper = $_ei6gqxwtjd24rmh8.fromTag('div');
      var realm = $_1616jcwgjd24rmg9.detect().os.isAndroid() ? AndroidRealm(doScrollIntoView) : IosRealm(doScrollIntoView);
      var original = $_ei6gqxwtjd24rmh8.fromDom(args.targetNode);
      $_a7pwway2jd24rmlf.after(original, wrapper);
      $_41u2roy1jd24rml7.attachSystem(wrapper, realm.system());
      var findFocusIn = function (elem) {
        return $_9uflcdygjd24rmmn.search(elem).bind(function (focused) {
          return realm.system().getByDom(focused).toOption();
        });
      };
      var outerWindow = args.targetNode.ownerDocument.defaultView;
      var orientation = $_fnc6j613jjd24rn8v.onChange(outerWindow, {
        onChange: function () {
          var alloy = realm.system();
          alloy.broadcastOn([$_11cbmdyojd24rmn5.orientationChanged()], { width: $_fnc6j613jjd24rn8v.getActualWidth(outerWindow) });
        },
        onReady: $_aoet5bwbjd24rmfz.noop
      });
      var setReadOnly = function (readOnlyGroups, mainGroups, ro) {
        if (ro === false) {
          editor.selection.collapse();
        }
        realm.setToolbarGroups(ro ? readOnlyGroups.get() : mainGroups.get());
        editor.setMode(ro === true ? 'readonly' : 'design');
        editor.fire(ro === true ? READING() : EDITING());
        realm.updateMode(ro);
      };
      var bindHandler = function (label, handler) {
        editor.on(label, handler);
        return {
          unbind: function () {
            editor.off(label);
          }
        };
      };
      editor.on('init', function () {
        realm.init({
          editor: {
            getFrame: function () {
              return $_ei6gqxwtjd24rmh8.fromDom(editor.contentAreaContainer.querySelector('iframe'));
            },
            onDomChanged: function () {
              return { unbind: $_aoet5bwbjd24rmfz.noop };
            },
            onToReading: function (handler) {
              return bindHandler(READING(), handler);
            },
            onToEditing: function (handler) {
              return bindHandler(EDITING(), handler);
            },
            onScrollToCursor: function (handler) {
              editor.on('scrollIntoView', function (tinyEvent) {
                handler(tinyEvent);
              });
              var unbind = function () {
                editor.off('scrollIntoView');
                orientation.destroy();
              };
              return { unbind: unbind };
            },
            onTouchToolstrip: function () {
              hideDropup();
            },
            onTouchContent: function () {
              var toolbar = $_ei6gqxwtjd24rmh8.fromDom(editor.editorContainer.querySelector('.' + $_4i0vdoz1jd24rmoo.resolve('toolbar')));
              findFocusIn(toolbar).each($_eljod2wvjd24rmhc.emitExecute);
              realm.restoreToolbar();
              hideDropup();
            },
            onTapContent: function (evt) {
              var target = evt.target();
              if ($_5fvhg7xxjd24rmkz.name(target) === 'img') {
                editor.selection.select(target.dom());
                evt.kill();
              } else if ($_5fvhg7xxjd24rmkz.name(target) === 'a') {
                var component = realm.system().getByDom($_ei6gqxwtjd24rmh8.fromDom(editor.editorContainer));
                component.each(function (container) {
                  if (Swapping.isAlpha(container)) {
                    $_6xjq0uymjd24rmn3.openLink(target.dom());
                  }
                });
              }
            }
          },
          container: $_ei6gqxwtjd24rmh8.fromDom(editor.editorContainer),
          socket: $_ei6gqxwtjd24rmh8.fromDom(editor.contentAreaContainer),
          toolstrip: $_ei6gqxwtjd24rmh8.fromDom(editor.editorContainer.querySelector('.' + $_4i0vdoz1jd24rmoo.resolve('toolstrip'))),
          toolbar: $_ei6gqxwtjd24rmh8.fromDom(editor.editorContainer.querySelector('.' + $_4i0vdoz1jd24rmoo.resolve('toolbar'))),
          dropup: realm.dropup(),
          alloy: realm.system(),
          translate: $_aoet5bwbjd24rmfz.noop,
          setReadOnly: function (ro) {
            setReadOnly(readOnlyGroups, mainGroups, ro);
          }
        });
        var hideDropup = function () {
          realm.dropup().disappear(function () {
            realm.system().broadcastOn([$_11cbmdyojd24rmn5.dropupDismissed()], {});
          });
        };
        $_e4133ky8jd24rmm3.registerInspector('remove this', realm.system());
        var backToMaskGroup = {
          label: 'The first group',
          scrollable: false,
          items: [$_2byzekz2jd24rmop.forToolbar('back', function () {
              editor.selection.collapse();
              realm.exit();
            }, {})]
        };
        var backToReadOnlyGroup = {
          label: 'Back to read only',
          scrollable: false,
          items: [$_2byzekz2jd24rmop.forToolbar('readonly-back', function () {
              setReadOnly(readOnlyGroups, mainGroups, true);
            }, {})]
        };
        var readOnlyGroup = {
          label: 'The read only mode group',
          scrollable: true,
          items: []
        };
        var features = $_8lfc2oypjd24rmn7.setup(realm, editor);
        var items = $_8lfc2oypjd24rmn7.detect(editor.settings, features);
        var actionGroup = {
          label: 'the action group',
          scrollable: true,
          items: items
        };
        var extraGroup = {
          label: 'The extra group',
          scrollable: false,
          items: []
        };
        var mainGroups = Cell([
          backToReadOnlyGroup,
          actionGroup,
          extraGroup
        ]);
        var readOnlyGroups = Cell([
          backToMaskGroup,
          readOnlyGroup,
          extraGroup
        ]);
        $_f7mxdw15wjd24rnjk.init(realm, editor);
      });
      return {
        iframeContainer: realm.socket().element().dom(),
        editorContainer: realm.element().dom()
      };
    };
    return {
      getNotificationManagerImpl: function () {
        return {
          open: $_aoet5bwbjd24rmfz.identity,
          close: $_aoet5bwbjd24rmfz.noop,
          reposition: $_aoet5bwbjd24rmfz.noop,
          getArgs: $_aoet5bwbjd24rmfz.identity
        };
      },
      renderUI: renderUI
    };
  });
  function Theme () {
  }

  return Theme;

}());
})()
