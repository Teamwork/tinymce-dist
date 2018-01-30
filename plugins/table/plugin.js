(function () {
var table = (function () {
  'use strict';

  var PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

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
  var $_brb4k3jijd24rk5p = {
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

  var never$1 = $_brb4k3jijd24rk5p.never;
  var always$1 = $_brb4k3jijd24rk5p.always;
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
      toString: $_brb4k3jijd24rk5p.constant('none()')
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
  var $_geu5gjhjd24rk5m = {
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
    return r === -1 ? $_geu5gjhjd24rk5m.none() : $_geu5gjhjd24rk5m.some(r);
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
        return $_geu5gjhjd24rk5m.some(x);
      }
    }
    return $_geu5gjhjd24rk5m.none();
  };
  var findIndex = function (xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i];
      if (pred(x, i, xs)) {
        return $_geu5gjhjd24rk5m.some(i);
      }
    }
    return $_geu5gjhjd24rk5m.none();
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
    return xs.length === 0 ? $_geu5gjhjd24rk5m.none() : $_geu5gjhjd24rk5m.some(xs[0]);
  };
  var last = function (xs) {
    return xs.length === 0 ? $_geu5gjhjd24rk5m.none() : $_geu5gjhjd24rk5m.some(xs[xs.length - 1]);
  };
  var $_821r2ajgjd24rk5h = {
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
  var find$1 = function (obj, pred) {
    var props = keys(obj);
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k];
      var x = obj[i];
      if (pred(x, i, obj)) {
        return $_geu5gjhjd24rk5m.some(x);
      }
    }
    return $_geu5gjhjd24rk5m.none();
  };
  var values = function (obj) {
    return mapToArray(obj, function (v) {
      return v;
    });
  };
  var size = function (obj) {
    return values(obj).length;
  };
  var $_vpx6ajkjd24rk68 = {
    bifilter: bifilter,
    each: each$1,
    map: objectMap,
    mapToArray: mapToArray,
    tupleMap: tupleMap,
    find: find$1,
    keys: keys,
    values: values,
    size: size
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
      $_821r2ajgjd24rk5h.each(fields, function (name, i) {
        struct[name] = $_brb4k3jijd24rk5p.constant(values[i]);
      });
      return struct;
    };
  }

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
  var $_g4fo8ljpjd24rk6g = {
    isString: isType('string'),
    isObject: isType('object'),
    isArray: isType('array'),
    isNull: isType('null'),
    isBoolean: isType('boolean'),
    isUndefined: isType('undefined'),
    isFunction: isType('function'),
    isNumber: isType('number')
  };

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
    if (!$_g4fo8ljpjd24rk6g.isArray(array))
      throw new Error('The ' + label + ' fields must be an array. Was: ' + array + '.');
    $_821r2ajgjd24rk5h.each(array, function (a) {
      if (!$_g4fo8ljpjd24rk6g.isString(a))
        throw new Error('The value ' + a + ' in the ' + label + ' fields was not a string.');
    });
  };
  var invalidTypeMessage = function (incorrect, type) {
    throw new Error('All values need to be of type: ' + type + '. Keys (' + sort$1(incorrect).join(', ') + ') were not.');
  };
  var checkDupes = function (everything) {
    var sorted = sort$1(everything);
    var dupe = $_821r2ajgjd24rk5h.find(sorted, function (s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1];
    });
    dupe.each(function (d) {
      throw new Error('The field: ' + d + ' occurs more than once in the combined fields: [' + sorted.join(', ') + '].');
    });
  };
  var $_fkrimsjojd24rk6f = {
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
    $_fkrimsjojd24rk6f.validateStrArr('required', required);
    $_fkrimsjojd24rk6f.validateStrArr('optional', optional);
    $_fkrimsjojd24rk6f.checkDupes(everything);
    return function (obj) {
      var keys = $_vpx6ajkjd24rk68.keys(obj);
      var allReqd = $_821r2ajgjd24rk5h.forall(required, function (req) {
        return $_821r2ajgjd24rk5h.contains(keys, req);
      });
      if (!allReqd)
        $_fkrimsjojd24rk6f.reqMessage(required, keys);
      var unsupported = $_821r2ajgjd24rk5h.filter(keys, function (key) {
        return !$_821r2ajgjd24rk5h.contains(everything, key);
      });
      if (unsupported.length > 0)
        $_fkrimsjojd24rk6f.unsuppMessage(unsupported);
      var r = {};
      $_821r2ajgjd24rk5h.each(required, function (req) {
        r[req] = $_brb4k3jijd24rk5p.constant(obj[req]);
      });
      $_821r2ajgjd24rk5h.each(optional, function (opt) {
        r[opt] = $_brb4k3jijd24rk5p.constant(Object.prototype.hasOwnProperty.call(obj, opt) ? $_geu5gjhjd24rk5m.some(obj[opt]) : $_geu5gjhjd24rk5m.none());
      });
      return r;
    };
  }

  var $_7p1bnnjljd24rk6a = {
    immutable: Immutable,
    immutableBag: MixedBag
  };

  var dimensions = $_7p1bnnjljd24rk6a.immutable('width', 'height');
  var grid = $_7p1bnnjljd24rk6a.immutable('rows', 'columns');
  var address = $_7p1bnnjljd24rk6a.immutable('row', 'column');
  var coords = $_7p1bnnjljd24rk6a.immutable('x', 'y');
  var detail = $_7p1bnnjljd24rk6a.immutable('element', 'rowspan', 'colspan');
  var detailnew = $_7p1bnnjljd24rk6a.immutable('element', 'rowspan', 'colspan', 'isNew');
  var extended = $_7p1bnnjljd24rk6a.immutable('element', 'rowspan', 'colspan', 'row', 'column');
  var rowdata = $_7p1bnnjljd24rk6a.immutable('element', 'cells', 'section');
  var elementnew = $_7p1bnnjljd24rk6a.immutable('element', 'isNew');
  var rowdatanew = $_7p1bnnjljd24rk6a.immutable('element', 'cells', 'section', 'isNew');
  var rowcells = $_7p1bnnjljd24rk6a.immutable('cells', 'section');
  var rowdetails = $_7p1bnnjljd24rk6a.immutable('details', 'section');
  var bounds = $_7p1bnnjljd24rk6a.immutable('startRow', 'startCol', 'finishRow', 'finishCol');
  var $_4vfg3njrjd24rk6n = {
    dimensions: dimensions,
    grid: grid,
    address: address,
    coords: coords,
    extended: extended,
    detail: detail,
    detailnew: detailnew,
    rowdata: rowdata,
    elementnew: elementnew,
    rowdatanew: rowdatanew,
    rowcells: rowcells,
    rowdetails: rowdetails,
    bounds: bounds
  };

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
    return { dom: $_brb4k3jijd24rk5p.constant(node) };
  };
  var fromPoint = function (doc, x, y) {
    return $_geu5gjhjd24rk5m.from(doc.dom().elementFromPoint(x, y)).map(fromDom);
  };
  var $_6zx9pgjvjd24rk77 = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  };

  var $_6fhuszjwjd24rk7a = {
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

  var ELEMENT = $_6fhuszjwjd24rk7a.ELEMENT;
  var DOCUMENT = $_6fhuszjwjd24rk7a.DOCUMENT;
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
    return bypassSelector(base) ? [] : $_821r2ajgjd24rk5h.map(base.querySelectorAll(selector), $_6zx9pgjvjd24rk77.fromDom);
  };
  var one = function (selector, scope) {
    var base = scope === undefined ? document : scope.dom();
    return bypassSelector(base) ? $_geu5gjhjd24rk5m.none() : $_geu5gjhjd24rk5m.from(base.querySelector(selector)).map($_6zx9pgjvjd24rk77.fromDom);
  };
  var $_807qyjujd24rk73 = {
    all: all,
    is: is,
    one: one
  };

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
  var $_99jod5jyjd24rk7j = { toArray: toArray };

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
  var $_2rjbi8k2jd24rk7w = {
    path: path,
    resolve: resolve,
    forge: forge,
    namespace: namespace
  };

  var unsafe = function (name, scope) {
    return $_2rjbi8k2jd24rk7w.resolve(name, scope);
  };
  var getOrDie = function (name, scope) {
    var actual = unsafe(name, scope);
    if (actual === undefined || actual === null)
      throw name + ' not available on this browser';
    return actual;
  };
  var $_4dv4r2k1jd24rk7v = { getOrDie: getOrDie };

  var node = function () {
    var f = $_4dv4r2k1jd24rk7v.getOrDie('Node');
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
  var $_ghyxjpk0jd24rk7u = {
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
  var $_aoukxgk5jd24rk80 = { cached: cached };

  var firstMatch = function (regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i];
      if (x.test(s))
        return x;
    }
    return undefined;
  };
  var find$2 = function (regexes, agent) {
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
    return find$2(versionRegexes, cleanedAgent);
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
  var $_elkwv6k8jd24rk84 = {
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
      version: $_elkwv6k8jd24rk84.unknown()
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
  var $_33ulojk7jd24rk82 = {
    unknown: unknown$1,
    nu: nu$1,
    edge: $_brb4k3jijd24rk5p.constant(edge),
    chrome: $_brb4k3jijd24rk5p.constant(chrome),
    ie: $_brb4k3jijd24rk5p.constant(ie),
    opera: $_brb4k3jijd24rk5p.constant(opera),
    firefox: $_brb4k3jijd24rk5p.constant(firefox),
    safari: $_brb4k3jijd24rk5p.constant(safari)
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
      version: $_elkwv6k8jd24rk84.unknown()
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
  var $_85hgvbk9jd24rk86 = {
    unknown: unknown$2,
    nu: nu$2,
    windows: $_brb4k3jijd24rk5p.constant(windows),
    ios: $_brb4k3jijd24rk5p.constant(ios),
    android: $_brb4k3jijd24rk5p.constant(android),
    linux: $_brb4k3jijd24rk5p.constant(linux),
    osx: $_brb4k3jijd24rk5p.constant(osx),
    solaris: $_brb4k3jijd24rk5p.constant(solaris),
    freebsd: $_brb4k3jijd24rk5p.constant(freebsd)
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
      isiPad: $_brb4k3jijd24rk5p.constant(isiPad),
      isiPhone: $_brb4k3jijd24rk5p.constant(isiPhone),
      isTablet: $_brb4k3jijd24rk5p.constant(isTablet),
      isPhone: $_brb4k3jijd24rk5p.constant(isPhone),
      isTouch: $_brb4k3jijd24rk5p.constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: $_brb4k3jijd24rk5p.constant(iOSwebview)
    };
  }

  var detect$1 = function (candidates, userAgent) {
    var agent = String(userAgent).toLowerCase();
    return $_821r2ajgjd24rk5h.find(candidates, function (candidate) {
      return candidate.search(agent);
    });
  };
  var detectBrowser = function (browsers, userAgent) {
    return detect$1(browsers, userAgent).map(function (browser) {
      var version = $_elkwv6k8jd24rk84.detect(browser.versionRegexes, userAgent);
      return {
        current: browser.name,
        version: version
      };
    });
  };
  var detectOs = function (oses, userAgent) {
    return detect$1(oses, userAgent).map(function (os) {
      var version = $_elkwv6k8jd24rk84.detect(os.versionRegexes, userAgent);
      return {
        current: os.name,
        version: version
      };
    });
  };
  var $_9z1g4wkbjd24rk8a = {
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
  var $_z10z2kejd24rk8j = {
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
    return str === '' ? $_geu5gjhjd24rk5m.none() : $_geu5gjhjd24rk5m.some(str.substr(0, 1));
  };
  var tail = function (str) {
    return str === '' ? $_geu5gjhjd24rk5m.none() : $_geu5gjhjd24rk5m.some(str.substring(1));
  };
  var $_8hgvyokfjd24rk8k = {
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
    return startsWith(str, prefix) ? $_z10z2kejd24rk8j.removeFromStart(str, prefix.length) : str;
  };
  var removeTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? $_z10z2kejd24rk8j.removeFromEnd(str, prefix.length) : str;
  };
  var ensureLeading = function (str, prefix) {
    return startsWith(str, prefix) ? str : $_z10z2kejd24rk8j.addToStart(str, prefix);
  };
  var ensureTrailing = function (str, prefix) {
    return endsWith(str, prefix) ? str : $_z10z2kejd24rk8j.addToEnd(str, prefix);
  };
  var contains$1 = function (str, substr) {
    return str.indexOf(substr) !== -1;
  };
  var capitalize = function (str) {
    return $_8hgvyokfjd24rk8k.head(str).bind(function (head) {
      return $_8hgvyokfjd24rk8k.tail(str).map(function (tail) {
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
  var $_1i2xl5kdjd24rk8h = {
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
      return $_1i2xl5kdjd24rk8h.contains(uastring, target);
    };
  };
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function (uastring) {
        var monstrosity = $_1i2xl5kdjd24rk8h.contains(uastring, 'edge/') && $_1i2xl5kdjd24rk8h.contains(uastring, 'chrome') && $_1i2xl5kdjd24rk8h.contains(uastring, 'safari') && $_1i2xl5kdjd24rk8h.contains(uastring, 'applewebkit');
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
        return $_1i2xl5kdjd24rk8h.contains(uastring, 'chrome') && !$_1i2xl5kdjd24rk8h.contains(uastring, 'chromeframe');
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function (uastring) {
        return $_1i2xl5kdjd24rk8h.contains(uastring, 'msie') || $_1i2xl5kdjd24rk8h.contains(uastring, 'trident');
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
        return ($_1i2xl5kdjd24rk8h.contains(uastring, 'safari') || $_1i2xl5kdjd24rk8h.contains(uastring, 'mobile/')) && $_1i2xl5kdjd24rk8h.contains(uastring, 'applewebkit');
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
        return $_1i2xl5kdjd24rk8h.contains(uastring, 'iphone') || $_1i2xl5kdjd24rk8h.contains(uastring, 'ipad');
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
  var $_2sm4nskcjd24rk8d = {
    browsers: $_brb4k3jijd24rk5p.constant(browsers),
    oses: $_brb4k3jijd24rk5p.constant(oses)
  };

  var detect$2 = function (userAgent) {
    var browsers = $_2sm4nskcjd24rk8d.browsers();
    var oses = $_2sm4nskcjd24rk8d.oses();
    var browser = $_9z1g4wkbjd24rk8a.detectBrowser(browsers, userAgent).fold($_33ulojk7jd24rk82.unknown, $_33ulojk7jd24rk82.nu);
    var os = $_9z1g4wkbjd24rk8a.detectOs(oses, userAgent).fold($_85hgvbk9jd24rk86.unknown, $_85hgvbk9jd24rk86.nu);
    var deviceType = DeviceType(os, browser, userAgent);
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    };
  };
  var $_cv0tcfk6jd24rk81 = { detect: detect$2 };

  var detect$3 = $_aoukxgk5jd24rk80.cached(function () {
    var userAgent = navigator.userAgent;
    return $_cv0tcfk6jd24rk81.detect(userAgent);
  });
  var $_cdhubfk4jd24rk7y = { detect: detect$3 };

  var eq = function (e1, e2) {
    return e1.dom() === e2.dom();
  };
  var isEqualNode = function (e1, e2) {
    return e1.dom().isEqualNode(e2.dom());
  };
  var member = function (element, elements) {
    return $_821r2ajgjd24rk5h.exists(elements, $_brb4k3jijd24rk5p.curry(eq, element));
  };
  var regularContains = function (e1, e2) {
    var d1 = e1.dom(), d2 = e2.dom();
    return d1 === d2 ? false : d1.contains(d2);
  };
  var ieContains = function (e1, e2) {
    return $_ghyxjpk0jd24rk7u.documentPositionContainedBy(e1.dom(), e2.dom());
  };
  var browser = $_cdhubfk4jd24rk7y.detect().browser;
  var contains$2 = browser.isIE() ? ieContains : regularContains;
  var $_c6tuisjzjd24rk7o = {
    eq: eq,
    isEqualNode: isEqualNode,
    member: member,
    contains: contains$2,
    is: $_807qyjujd24rk73.is
  };

  var owner = function (element) {
    return $_6zx9pgjvjd24rk77.fromDom(element.dom().ownerDocument);
  };
  var documentElement = function (element) {
    var doc = owner(element);
    return $_6zx9pgjvjd24rk77.fromDom(doc.dom().documentElement);
  };
  var defaultView = function (element) {
    var el = element.dom();
    var defaultView = el.ownerDocument.defaultView;
    return $_6zx9pgjvjd24rk77.fromDom(defaultView);
  };
  var parent = function (element) {
    var dom = element.dom();
    return $_geu5gjhjd24rk5m.from(dom.parentNode).map($_6zx9pgjvjd24rk77.fromDom);
  };
  var findIndex$1 = function (element) {
    return parent(element).bind(function (p) {
      var kin = children(p);
      return $_821r2ajgjd24rk5h.findIndex(kin, function (elem) {
        return $_c6tuisjzjd24rk7o.eq(element, elem);
      });
    });
  };
  var parents = function (element, isRoot) {
    var stop = $_g4fo8ljpjd24rk6g.isFunction(isRoot) ? isRoot : $_brb4k3jijd24rk5p.constant(false);
    var dom = element.dom();
    var ret = [];
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode;
      var parent = $_6zx9pgjvjd24rk77.fromDom(rawParent);
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
      return $_821r2ajgjd24rk5h.filter(elements, function (x) {
        return !$_c6tuisjzjd24rk7o.eq(element, x);
      });
    };
    return parent(element).map(children).map(filterSelf).getOr([]);
  };
  var offsetParent = function (element) {
    var dom = element.dom();
    return $_geu5gjhjd24rk5m.from(dom.offsetParent).map($_6zx9pgjvjd24rk77.fromDom);
  };
  var prevSibling = function (element) {
    var dom = element.dom();
    return $_geu5gjhjd24rk5m.from(dom.previousSibling).map($_6zx9pgjvjd24rk77.fromDom);
  };
  var nextSibling = function (element) {
    var dom = element.dom();
    return $_geu5gjhjd24rk5m.from(dom.nextSibling).map($_6zx9pgjvjd24rk77.fromDom);
  };
  var prevSiblings = function (element) {
    return $_821r2ajgjd24rk5h.reverse($_99jod5jyjd24rk7j.toArray(element, prevSibling));
  };
  var nextSiblings = function (element) {
    return $_99jod5jyjd24rk7j.toArray(element, nextSibling);
  };
  var children = function (element) {
    var dom = element.dom();
    return $_821r2ajgjd24rk5h.map(dom.childNodes, $_6zx9pgjvjd24rk77.fromDom);
  };
  var child = function (element, index) {
    var children = element.dom().childNodes;
    return $_geu5gjhjd24rk5m.from(children[index]).map($_6zx9pgjvjd24rk77.fromDom);
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
  var spot = $_7p1bnnjljd24rk6a.immutable('element', 'offset');
  var leaf = function (element, offset) {
    var cs = children(element);
    return cs.length > 0 && offset < cs.length ? spot(cs[offset], 0) : spot(element, offset);
  };
  var $_8rtodrjxjd24rk7b = {
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

  var firstLayer = function (scope, selector) {
    return filterFirstLayer(scope, selector, $_brb4k3jijd24rk5p.constant(true));
  };
  var filterFirstLayer = function (scope, selector, predicate) {
    return $_821r2ajgjd24rk5h.bind($_8rtodrjxjd24rk7b.children(scope), function (x) {
      return $_807qyjujd24rk73.is(x, selector) ? predicate(x) ? [x] : [] : filterFirstLayer(x, selector, predicate);
    });
  };
  var $_7kecm7jtjd24rk6z = {
    firstLayer: firstLayer,
    filterFirstLayer: filterFirstLayer
  };

  var name = function (element) {
    var r = element.dom().nodeName;
    return r.toLowerCase();
  };
  var type = function (element) {
    return element.dom().nodeType;
  };
  var value = function (element) {
    return element.dom().nodeValue;
  };
  var isType$1 = function (t) {
    return function (element) {
      return type(element) === t;
    };
  };
  var isComment = function (element) {
    return type(element) === $_6fhuszjwjd24rk7a.COMMENT || name(element) === '#comment';
  };
  var isElement = isType$1($_6fhuszjwjd24rk7a.ELEMENT);
  var isText = isType$1($_6fhuszjwjd24rk7a.TEXT);
  var isDocument = isType$1($_6fhuszjwjd24rk7a.DOCUMENT);
  var $_sc7pgkhjd24rk8q = {
    name: name,
    type: type,
    value: value,
    isElement: isElement,
    isText: isText,
    isDocument: isDocument,
    isComment: isComment
  };

  var rawSet = function (dom, key, value) {
    if ($_g4fo8ljpjd24rk6g.isString(value) || $_g4fo8ljpjd24rk6g.isBoolean(value) || $_g4fo8ljpjd24rk6g.isNumber(value)) {
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
    $_vpx6ajkjd24rk68.each(attrs, function (v, k) {
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
    return $_821r2ajgjd24rk5h.foldl(element.dom().attributes, function (acc, attr) {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
  };
  var transferOne = function (source, destination, attr) {
    if (has(source, attr) && !has(destination, attr))
      set(destination, attr, get(source, attr));
  };
  var transfer = function (source, destination, attrs) {
    if (!$_sc7pgkhjd24rk8q.isElement(source) || !$_sc7pgkhjd24rk8q.isElement(destination))
      return;
    $_821r2ajgjd24rk5h.each(attrs, function (attr) {
      transferOne(source, destination, attr);
    });
  };
  var $_4ni5ekkgjd24rk8l = {
    clone: clone,
    set: set,
    setAll: setAll,
    get: get,
    has: has,
    remove: remove,
    hasNone: hasNone,
    transfer: transfer
  };

  var inBody = function (element) {
    var dom = $_sc7pgkhjd24rk8q.isText(element) ? element.dom().parentNode : element.dom();
    return dom !== undefined && dom !== null && dom.ownerDocument.body.contains(dom);
  };
  var body = $_aoukxgk5jd24rk80.cached(function () {
    return getBody($_6zx9pgjvjd24rk77.fromDom(document));
  });
  var getBody = function (doc) {
    var body = doc.dom().body;
    if (body === null || body === undefined)
      throw 'Body is not available yet';
    return $_6zx9pgjvjd24rk77.fromDom(body);
  };
  var $_6ezo74kkjd24rk8v = {
    body: body,
    getBody: getBody,
    inBody: inBody
  };

  var all$1 = function (predicate) {
    return descendants($_6ezo74kkjd24rk8v.body(), predicate);
  };
  var ancestors = function (scope, predicate, isRoot) {
    return $_821r2ajgjd24rk5h.filter($_8rtodrjxjd24rk7b.parents(scope, isRoot), predicate);
  };
  var siblings$1 = function (scope, predicate) {
    return $_821r2ajgjd24rk5h.filter($_8rtodrjxjd24rk7b.siblings(scope), predicate);
  };
  var children$1 = function (scope, predicate) {
    return $_821r2ajgjd24rk5h.filter($_8rtodrjxjd24rk7b.children(scope), predicate);
  };
  var descendants = function (scope, predicate) {
    var result = [];
    $_821r2ajgjd24rk5h.each($_8rtodrjxjd24rk7b.children(scope), function (x) {
      if (predicate(x)) {
        result = result.concat([x]);
      }
      result = result.concat(descendants(x, predicate));
    });
    return result;
  };
  var $_diga24kjjd24rk8t = {
    all: all$1,
    ancestors: ancestors,
    siblings: siblings$1,
    children: children$1,
    descendants: descendants
  };

  var all$2 = function (selector) {
    return $_807qyjujd24rk73.all(selector);
  };
  var ancestors$1 = function (scope, selector, isRoot) {
    return $_diga24kjjd24rk8t.ancestors(scope, function (e) {
      return $_807qyjujd24rk73.is(e, selector);
    }, isRoot);
  };
  var siblings$2 = function (scope, selector) {
    return $_diga24kjjd24rk8t.siblings(scope, function (e) {
      return $_807qyjujd24rk73.is(e, selector);
    });
  };
  var children$2 = function (scope, selector) {
    return $_diga24kjjd24rk8t.children(scope, function (e) {
      return $_807qyjujd24rk73.is(e, selector);
    });
  };
  var descendants$1 = function (scope, selector) {
    return $_807qyjujd24rk73.all(selector, scope);
  };
  var $_ec4gn6kijd24rk8r = {
    all: all$2,
    ancestors: ancestors$1,
    siblings: siblings$2,
    children: children$2,
    descendants: descendants$1
  };

  function ClosestOrAncestor (is, ancestor, scope, a, isRoot) {
    return is(scope, a) ? $_geu5gjhjd24rk5m.some(scope) : $_g4fo8ljpjd24rk6g.isFunction(isRoot) && isRoot(scope) ? $_geu5gjhjd24rk5m.none() : ancestor(scope, a, isRoot);
  }

  var first$1 = function (predicate) {
    return descendant($_6ezo74kkjd24rk8v.body(), predicate);
  };
  var ancestor = function (scope, predicate, isRoot) {
    var element = scope.dom();
    var stop = $_g4fo8ljpjd24rk6g.isFunction(isRoot) ? isRoot : $_brb4k3jijd24rk5p.constant(false);
    while (element.parentNode) {
      element = element.parentNode;
      var el = $_6zx9pgjvjd24rk77.fromDom(element);
      if (predicate(el))
        return $_geu5gjhjd24rk5m.some(el);
      else if (stop(el))
        break;
    }
    return $_geu5gjhjd24rk5m.none();
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
      return $_geu5gjhjd24rk5m.none();
    return child$1($_6zx9pgjvjd24rk77.fromDom(element.parentNode), function (x) {
      return !$_c6tuisjzjd24rk7o.eq(scope, x) && predicate(x);
    });
  };
  var child$1 = function (scope, predicate) {
    var result = $_821r2ajgjd24rk5h.find(scope.dom().childNodes, $_brb4k3jijd24rk5p.compose(predicate, $_6zx9pgjvjd24rk77.fromDom));
    return result.map($_6zx9pgjvjd24rk77.fromDom);
  };
  var descendant = function (scope, predicate) {
    var descend = function (element) {
      for (var i = 0; i < element.childNodes.length; i++) {
        if (predicate($_6zx9pgjvjd24rk77.fromDom(element.childNodes[i])))
          return $_geu5gjhjd24rk5m.some($_6zx9pgjvjd24rk77.fromDom(element.childNodes[i]));
        var res = descend(element.childNodes[i]);
        if (res.isSome())
          return res;
      }
      return $_geu5gjhjd24rk5m.none();
    };
    return descend(scope.dom());
  };
  var $_dnxapkkmjd24rk8z = {
    first: first$1,
    ancestor: ancestor,
    closest: closest,
    sibling: sibling,
    child: child$1,
    descendant: descendant
  };

  var first$2 = function (selector) {
    return $_807qyjujd24rk73.one(selector);
  };
  var ancestor$1 = function (scope, selector, isRoot) {
    return $_dnxapkkmjd24rk8z.ancestor(scope, function (e) {
      return $_807qyjujd24rk73.is(e, selector);
    }, isRoot);
  };
  var sibling$1 = function (scope, selector) {
    return $_dnxapkkmjd24rk8z.sibling(scope, function (e) {
      return $_807qyjujd24rk73.is(e, selector);
    });
  };
  var child$2 = function (scope, selector) {
    return $_dnxapkkmjd24rk8z.child(scope, function (e) {
      return $_807qyjujd24rk73.is(e, selector);
    });
  };
  var descendant$1 = function (scope, selector) {
    return $_807qyjujd24rk73.one(selector, scope);
  };
  var closest$1 = function (scope, selector, isRoot) {
    return ClosestOrAncestor($_807qyjujd24rk73.is, ancestor$1, scope, selector, isRoot);
  };
  var $_e7vzfkljd24rk8y = {
    first: first$2,
    ancestor: ancestor$1,
    sibling: sibling$1,
    child: child$2,
    descendant: descendant$1,
    closest: closest$1
  };

  var lookup = function (tags, element, _isRoot) {
    var isRoot = _isRoot !== undefined ? _isRoot : $_brb4k3jijd24rk5p.constant(false);
    if (isRoot(element))
      return $_geu5gjhjd24rk5m.none();
    if ($_821r2ajgjd24rk5h.contains(tags, $_sc7pgkhjd24rk8q.name(element)))
      return $_geu5gjhjd24rk5m.some(element);
    var isRootOrUpperTable = function (element) {
      return $_807qyjujd24rk73.is(element, 'table') || isRoot(element);
    };
    return $_e7vzfkljd24rk8y.ancestor(element, tags.join(','), isRootOrUpperTable);
  };
  var cell = function (element, isRoot) {
    return lookup([
      'td',
      'th'
    ], element, isRoot);
  };
  var cells = function (ancestor) {
    return $_7kecm7jtjd24rk6z.firstLayer(ancestor, 'th,td');
  };
  var notCell = function (element, isRoot) {
    return lookup([
      'caption',
      'tr',
      'tbody',
      'tfoot',
      'thead'
    ], element, isRoot);
  };
  var neighbours = function (selector, element) {
    return $_8rtodrjxjd24rk7b.parent(element).map(function (parent) {
      return $_ec4gn6kijd24rk8r.children(parent, selector);
    });
  };
  var neighbourCells = $_brb4k3jijd24rk5p.curry(neighbours, 'th,td');
  var neighbourRows = $_brb4k3jijd24rk5p.curry(neighbours, 'tr');
  var firstCell = function (ancestor) {
    return $_e7vzfkljd24rk8y.descendant(ancestor, 'th,td');
  };
  var table = function (element, isRoot) {
    return $_e7vzfkljd24rk8y.closest(element, 'table', isRoot);
  };
  var row = function (element, isRoot) {
    return lookup(['tr'], element, isRoot);
  };
  var rows = function (ancestor) {
    return $_7kecm7jtjd24rk6z.firstLayer(ancestor, 'tr');
  };
  var attr = function (element, property) {
    return parseInt($_4ni5ekkgjd24rk8l.get(element, property), 10);
  };
  var grid$1 = function (element, rowProp, colProp) {
    var rows = attr(element, rowProp);
    var cols = attr(element, colProp);
    return $_4vfg3njrjd24rk6n.grid(rows, cols);
  };
  var $_60ksrkjsjd24rk6p = {
    cell: cell,
    firstCell: firstCell,
    cells: cells,
    neighbourCells: neighbourCells,
    table: table,
    row: row,
    rows: rows,
    notCell: notCell,
    neighbourRows: neighbourRows,
    attr: attr,
    grid: grid$1
  };

  var fromTable = function (table) {
    var rows = $_60ksrkjsjd24rk6p.rows(table);
    return $_821r2ajgjd24rk5h.map(rows, function (row) {
      var element = row;
      var parent = $_8rtodrjxjd24rk7b.parent(element);
      var parentSection = parent.bind(function (parent) {
        var parentName = $_sc7pgkhjd24rk8q.name(parent);
        return parentName === 'tfoot' || parentName === 'thead' || parentName === 'tbody' ? parentName : 'tbody';
      });
      var cells = $_821r2ajgjd24rk5h.map($_60ksrkjsjd24rk6p.cells(row), function (cell) {
        var rowspan = $_4ni5ekkgjd24rk8l.has(cell, 'rowspan') ? parseInt($_4ni5ekkgjd24rk8l.get(cell, 'rowspan'), 10) : 1;
        var colspan = $_4ni5ekkgjd24rk8l.has(cell, 'colspan') ? parseInt($_4ni5ekkgjd24rk8l.get(cell, 'colspan'), 10) : 1;
        return $_4vfg3njrjd24rk6n.detail(cell, rowspan, colspan);
      });
      return $_4vfg3njrjd24rk6n.rowdata(element, cells, parentSection);
    });
  };
  var fromPastedRows = function (rows, example) {
    return $_821r2ajgjd24rk5h.map(rows, function (row) {
      var cells = $_821r2ajgjd24rk5h.map($_60ksrkjsjd24rk6p.cells(row), function (cell) {
        var rowspan = $_4ni5ekkgjd24rk8l.has(cell, 'rowspan') ? parseInt($_4ni5ekkgjd24rk8l.get(cell, 'rowspan'), 10) : 1;
        var colspan = $_4ni5ekkgjd24rk8l.has(cell, 'colspan') ? parseInt($_4ni5ekkgjd24rk8l.get(cell, 'colspan'), 10) : 1;
        return $_4vfg3njrjd24rk6n.detail(cell, rowspan, colspan);
      });
      return $_4vfg3njrjd24rk6n.rowdata(row, cells, example.section());
    });
  };
  var $_d16wdjjqjd24rk6i = {
    fromTable: fromTable,
    fromPastedRows: fromPastedRows
  };

  var key = function (row, column) {
    return row + ',' + column;
  };
  var getAt = function (warehouse, row, column) {
    var raw = warehouse.access()[key(row, column)];
    return raw !== undefined ? $_geu5gjhjd24rk5m.some(raw) : $_geu5gjhjd24rk5m.none();
  };
  var findItem = function (warehouse, item, comparator) {
    var filtered = filterItems(warehouse, function (detail) {
      return comparator(item, detail.element());
    });
    return filtered.length > 0 ? $_geu5gjhjd24rk5m.some(filtered[0]) : $_geu5gjhjd24rk5m.none();
  };
  var filterItems = function (warehouse, predicate) {
    var all = $_821r2ajgjd24rk5h.bind(warehouse.all(), function (r) {
      return r.cells();
    });
    return $_821r2ajgjd24rk5h.filter(all, predicate);
  };
  var generate = function (list) {
    var access = {};
    var cells = [];
    var maxRows = list.length;
    var maxColumns = 0;
    $_821r2ajgjd24rk5h.each(list, function (details, r) {
      var currentRow = [];
      $_821r2ajgjd24rk5h.each(details.cells(), function (detail, c) {
        var start = 0;
        while (access[key(r, start)] !== undefined) {
          start++;
        }
        var current = $_4vfg3njrjd24rk6n.extended(detail.element(), detail.rowspan(), detail.colspan(), r, start);
        for (var i = 0; i < detail.colspan(); i++) {
          for (var j = 0; j < detail.rowspan(); j++) {
            var cr = r + j;
            var cc = start + i;
            var newpos = key(cr, cc);
            access[newpos] = current;
            maxColumns = Math.max(maxColumns, cc + 1);
          }
        }
        currentRow.push(current);
      });
      cells.push($_4vfg3njrjd24rk6n.rowdata(details.element(), currentRow, details.section()));
    });
    var grid = $_4vfg3njrjd24rk6n.grid(maxRows, maxColumns);
    return {
      grid: $_brb4k3jijd24rk5p.constant(grid),
      access: $_brb4k3jijd24rk5p.constant(access),
      all: $_brb4k3jijd24rk5p.constant(cells)
    };
  };
  var justCells = function (warehouse) {
    var rows = $_821r2ajgjd24rk5h.map(warehouse.all(), function (w) {
      return w.cells();
    });
    return $_821r2ajgjd24rk5h.flatten(rows);
  };
  var $_4xhnwmkojd24rk9d = {
    generate: generate,
    getAt: getAt,
    findItem: findItem,
    filterItems: filterItems,
    justCells: justCells
  };

  var isSupported = function (dom) {
    return dom.style !== undefined;
  };
  var $_87r4p1kqjd24rk9q = { isSupported: isSupported };

  var internalSet = function (dom, property, value) {
    if (!$_g4fo8ljpjd24rk6g.isString(value)) {
      console.error('Invalid call to CSS.set. Property ', property, ':: Value ', value, ':: Element ', dom);
      throw new Error('CSS value must be a string: ' + value);
    }
    if ($_87r4p1kqjd24rk9q.isSupported(dom))
      dom.style.setProperty(property, value);
  };
  var internalRemove = function (dom, property) {
    if ($_87r4p1kqjd24rk9q.isSupported(dom))
      dom.style.removeProperty(property);
  };
  var set$1 = function (element, property, value) {
    var dom = element.dom();
    internalSet(dom, property, value);
  };
  var setAll$1 = function (element, css) {
    var dom = element.dom();
    $_vpx6ajkjd24rk68.each(css, function (v, k) {
      internalSet(dom, k, v);
    });
  };
  var setOptions = function (element, css) {
    var dom = element.dom();
    $_vpx6ajkjd24rk68.each(css, function (v, k) {
      v.fold(function () {
        internalRemove(dom, k);
      }, function (value) {
        internalSet(dom, k, value);
      });
    });
  };
  var get$1 = function (element, property) {
    var dom = element.dom();
    var styles = window.getComputedStyle(dom);
    var r = styles.getPropertyValue(property);
    var v = r === '' && !$_6ezo74kkjd24rk8v.inBody(element) ? getUnsafeProperty(dom, property) : r;
    return v === null ? undefined : v;
  };
  var getUnsafeProperty = function (dom, property) {
    return $_87r4p1kqjd24rk9q.isSupported(dom) ? dom.style.getPropertyValue(property) : '';
  };
  var getRaw = function (element, property) {
    var dom = element.dom();
    var raw = getUnsafeProperty(dom, property);
    return $_geu5gjhjd24rk5m.from(raw).filter(function (r) {
      return r.length > 0;
    });
  };
  var getAllRaw = function (element) {
    var css = {};
    var dom = element.dom();
    if ($_87r4p1kqjd24rk9q.isSupported(dom)) {
      for (var i = 0; i < dom.style.length; i++) {
        var ruleName = dom.style.item(i);
        css[ruleName] = dom.style[ruleName];
      }
    }
    return css;
  };
  var isValidValue = function (tag, property, value) {
    var element = $_6zx9pgjvjd24rk77.fromTag(tag);
    set$1(element, property, value);
    var style = getRaw(element, property);
    return style.isSome();
  };
  var remove$1 = function (element, property) {
    var dom = element.dom();
    internalRemove(dom, property);
    if ($_4ni5ekkgjd24rk8l.has(element, 'style') && $_1i2xl5kdjd24rk8h.trim($_4ni5ekkgjd24rk8l.get(element, 'style')) === '') {
      $_4ni5ekkgjd24rk8l.remove(element, 'style');
    }
  };
  var preserve = function (element, f) {
    var oldStyles = $_4ni5ekkgjd24rk8l.get(element, 'style');
    var result = f(element);
    var restore = oldStyles === undefined ? $_4ni5ekkgjd24rk8l.remove : $_4ni5ekkgjd24rk8l.set;
    restore(element, 'style', oldStyles);
    return result;
  };
  var copy = function (source, target) {
    var sourceDom = source.dom();
    var targetDom = target.dom();
    if ($_87r4p1kqjd24rk9q.isSupported(sourceDom) && $_87r4p1kqjd24rk9q.isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText;
    }
  };
  var reflow = function (e) {
    return e.dom().offsetWidth;
  };
  var transferOne$1 = function (source, destination, style) {
    getRaw(source, style).each(function (value) {
      if (getRaw(destination, style).isNone())
        set$1(destination, style, value);
    });
  };
  var transfer$1 = function (source, destination, styles) {
    if (!$_sc7pgkhjd24rk8q.isElement(source) || !$_sc7pgkhjd24rk8q.isElement(destination))
      return;
    $_821r2ajgjd24rk5h.each(styles, function (style) {
      transferOne$1(source, destination, style);
    });
  };
  var $_ftduaokpjd24rk9i = {
    copy: copy,
    set: set$1,
    preserve: preserve,
    setAll: setAll$1,
    setOptions: setOptions,
    remove: remove$1,
    get: get$1,
    getRaw: getRaw,
    getAllRaw: getAllRaw,
    isValidValue: isValidValue,
    reflow: reflow,
    transfer: transfer$1
  };

  var before = function (marker, element) {
    var parent = $_8rtodrjxjd24rk7b.parent(marker);
    parent.each(function (v) {
      v.dom().insertBefore(element.dom(), marker.dom());
    });
  };
  var after = function (marker, element) {
    var sibling = $_8rtodrjxjd24rk7b.nextSibling(marker);
    sibling.fold(function () {
      var parent = $_8rtodrjxjd24rk7b.parent(marker);
      parent.each(function (v) {
        append(v, element);
      });
    }, function (v) {
      before(v, element);
    });
  };
  var prepend = function (parent, element) {
    var firstChild = $_8rtodrjxjd24rk7b.firstChild(parent);
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
    $_8rtodrjxjd24rk7b.child(parent, index).fold(function () {
      append(parent, element);
    }, function (v) {
      before(v, element);
    });
  };
  var wrap = function (element, wrapper) {
    before(element, wrapper);
    append(wrapper, element);
  };
  var $_97r5mekrjd24rk9r = {
    before: before,
    after: after,
    prepend: prepend,
    append: append,
    appendAt: appendAt,
    wrap: wrap
  };

  var before$1 = function (marker, elements) {
    $_821r2ajgjd24rk5h.each(elements, function (x) {
      $_97r5mekrjd24rk9r.before(marker, x);
    });
  };
  var after$1 = function (marker, elements) {
    $_821r2ajgjd24rk5h.each(elements, function (x, i) {
      var e = i === 0 ? marker : elements[i - 1];
      $_97r5mekrjd24rk9r.after(e, x);
    });
  };
  var prepend$1 = function (parent, elements) {
    $_821r2ajgjd24rk5h.each(elements.slice().reverse(), function (x) {
      $_97r5mekrjd24rk9r.prepend(parent, x);
    });
  };
  var append$1 = function (parent, elements) {
    $_821r2ajgjd24rk5h.each(elements, function (x) {
      $_97r5mekrjd24rk9r.append(parent, x);
    });
  };
  var $_vgziuktjd24rk9v = {
    before: before$1,
    after: after$1,
    prepend: prepend$1,
    append: append$1
  };

  var empty = function (element) {
    element.dom().textContent = '';
    $_821r2ajgjd24rk5h.each($_8rtodrjxjd24rk7b.children(element), function (rogue) {
      remove$2(rogue);
    });
  };
  var remove$2 = function (element) {
    var dom = element.dom();
    if (dom.parentNode !== null)
      dom.parentNode.removeChild(dom);
  };
  var unwrap = function (wrapper) {
    var children = $_8rtodrjxjd24rk7b.children(wrapper);
    if (children.length > 0)
      $_vgziuktjd24rk9v.before(wrapper, children);
    remove$2(wrapper);
  };
  var $_6k630dksjd24rk9s = {
    empty: empty,
    remove: remove$2,
    unwrap: unwrap
  };

  var stats = $_7p1bnnjljd24rk6a.immutable('minRow', 'minCol', 'maxRow', 'maxCol');
  var findSelectedStats = function (house, isSelected) {
    var totalColumns = house.grid().columns();
    var totalRows = house.grid().rows();
    var minRow = totalRows;
    var minCol = totalColumns;
    var maxRow = 0;
    var maxCol = 0;
    $_vpx6ajkjd24rk68.each(house.access(), function (detail) {
      if (isSelected(detail)) {
        var startRow = detail.row();
        var endRow = startRow + detail.rowspan() - 1;
        var startCol = detail.column();
        var endCol = startCol + detail.colspan() - 1;
        if (startRow < minRow)
          minRow = startRow;
        else if (endRow > maxRow)
          maxRow = endRow;
        if (startCol < minCol)
          minCol = startCol;
        else if (endCol > maxCol)
          maxCol = endCol;
      }
    });
    return stats(minRow, minCol, maxRow, maxCol);
  };
  var makeCell = function (list, seenSelected, rowIndex) {
    var row = list[rowIndex].element();
    var td = $_6zx9pgjvjd24rk77.fromTag('td');
    $_97r5mekrjd24rk9r.append(td, $_6zx9pgjvjd24rk77.fromTag('br'));
    var f = seenSelected ? $_97r5mekrjd24rk9r.append : $_97r5mekrjd24rk9r.prepend;
    f(row, td);
  };
  var fillInGaps = function (list, house, stats, isSelected) {
    var totalColumns = house.grid().columns();
    var totalRows = house.grid().rows();
    for (var i = 0; i < totalRows; i++) {
      var seenSelected = false;
      for (var j = 0; j < totalColumns; j++) {
        if (!(i < stats.minRow() || i > stats.maxRow() || j < stats.minCol() || j > stats.maxCol())) {
          var needCell = $_4xhnwmkojd24rk9d.getAt(house, i, j).filter(isSelected).isNone();
          if (needCell)
            makeCell(list, seenSelected, i);
          else
            seenSelected = true;
        }
      }
    }
  };
  var clean = function (table, stats) {
    var emptyRows = $_821r2ajgjd24rk5h.filter($_7kecm7jtjd24rk6z.firstLayer(table, 'tr'), function (row) {
      return row.dom().childElementCount === 0;
    });
    $_821r2ajgjd24rk5h.each(emptyRows, $_6k630dksjd24rk9s.remove);
    if (stats.minCol() === stats.maxCol() || stats.minRow() === stats.maxRow()) {
      $_821r2ajgjd24rk5h.each($_7kecm7jtjd24rk6z.firstLayer(table, 'th,td'), function (cell) {
        $_4ni5ekkgjd24rk8l.remove(cell, 'rowspan');
        $_4ni5ekkgjd24rk8l.remove(cell, 'colspan');
      });
    }
    $_4ni5ekkgjd24rk8l.remove(table, 'width');
    $_4ni5ekkgjd24rk8l.remove(table, 'height');
    $_ftduaokpjd24rk9i.remove(table, 'width');
    $_ftduaokpjd24rk9i.remove(table, 'height');
  };
  var extract = function (table, selectedSelector) {
    var isSelected = function (detail) {
      return $_807qyjujd24rk73.is(detail.element(), selectedSelector);
    };
    var list = $_d16wdjjqjd24rk6i.fromTable(table);
    var house = $_4xhnwmkojd24rk9d.generate(list);
    var stats = findSelectedStats(house, isSelected);
    var selector = 'th:not(' + selectedSelector + ')' + ',td:not(' + selectedSelector + ')';
    var unselectedCells = $_7kecm7jtjd24rk6z.filterFirstLayer(table, 'th,td', function (cell) {
      return $_807qyjujd24rk73.is(cell, selector);
    });
    $_821r2ajgjd24rk5h.each(unselectedCells, $_6k630dksjd24rk9s.remove);
    fillInGaps(list, house, stats, isSelected);
    clean(table, stats);
    return table;
  };
  var $_kbiqjjjd24rk5s = { extract: extract };

  var clone$1 = function (original, deep) {
    return $_6zx9pgjvjd24rk77.fromDom(original.dom().cloneNode(deep));
  };
  var shallow = function (original) {
    return clone$1(original, false);
  };
  var deep = function (original) {
    return clone$1(original, true);
  };
  var shallowAs = function (original, tag) {
    var nu = $_6zx9pgjvjd24rk77.fromTag(tag);
    var attributes = $_4ni5ekkgjd24rk8l.clone(original);
    $_4ni5ekkgjd24rk8l.setAll(nu, attributes);
    return nu;
  };
  var copy$1 = function (original, tag) {
    var nu = shallowAs(original, tag);
    var cloneChildren = $_8rtodrjxjd24rk7b.children(deep(original));
    $_vgziuktjd24rk9v.append(nu, cloneChildren);
    return nu;
  };
  var mutate = function (original, tag) {
    var nu = shallowAs(original, tag);
    $_97r5mekrjd24rk9r.before(original, nu);
    var children = $_8rtodrjxjd24rk7b.children(original);
    $_vgziuktjd24rk9v.append(nu, children);
    $_6k630dksjd24rk9s.remove(original);
    return nu;
  };
  var $_3mqh4mkvjd24rkaa = {
    shallow: shallow,
    shallowAs: shallowAs,
    deep: deep,
    copy: copy$1,
    mutate: mutate
  };

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
        return $_geu5gjhjd24rk5m.none();
      }
    };
    var getOptionSafe = function (element) {
      return is(element) ? $_geu5gjhjd24rk5m.from(element.dom().nodeValue) : $_geu5gjhjd24rk5m.none();
    };
    var browser = $_cdhubfk4jd24rk7y.detect().browser;
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

  var api = NodeValue($_sc7pgkhjd24rk8q.isText, 'text');
  var get$2 = function (element) {
    return api.get(element);
  };
  var getOption = function (element) {
    return api.getOption(element);
  };
  var set$2 = function (element, value) {
    api.set(element, value);
  };
  var $_864owvkyjd24rkai = {
    get: get$2,
    getOption: getOption,
    set: set$2
  };

  var getEnd = function (element) {
    return $_sc7pgkhjd24rk8q.name(element) === 'img' ? 1 : $_864owvkyjd24rkai.getOption(element).fold(function () {
      return $_8rtodrjxjd24rk7b.children(element).length;
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
    return $_864owvkyjd24rkai.getOption(el).filter(function (text) {
      return text.trim().length !== 0 || text.indexOf(NBSP) > -1;
    }).isSome();
  };
  var elementsWithCursorPosition = [
    'img',
    'br'
  ];
  var isCursorPosition = function (elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem);
    return hasCursorPosition || $_821r2ajgjd24rk5h.contains(elementsWithCursorPosition, $_sc7pgkhjd24rk8q.name(elem));
  };
  var $_fgxy34kxjd24rkaf = {
    getEnd: getEnd,
    isEnd: isEnd,
    isStart: isStart,
    isCursorPosition: isCursorPosition
  };

  var first$3 = function (element) {
    return $_dnxapkkmjd24rk8z.descendant(element, $_fgxy34kxjd24rkaf.isCursorPosition);
  };
  var last$2 = function (element) {
    return descendantRtl(element, $_fgxy34kxjd24rkaf.isCursorPosition);
  };
  var descendantRtl = function (scope, predicate) {
    var descend = function (element) {
      var children = $_8rtodrjxjd24rk7b.children(element);
      for (var i = children.length - 1; i >= 0; i--) {
        var child = children[i];
        if (predicate(child))
          return $_geu5gjhjd24rk5m.some(child);
        var res = descend(child);
        if (res.isSome())
          return res;
      }
      return $_geu5gjhjd24rk5m.none();
    };
    return descend(scope);
  };
  var $_59jad4kwjd24rkad = {
    first: first$3,
    last: last$2
  };

  var cell$1 = function () {
    var td = $_6zx9pgjvjd24rk77.fromTag('td');
    $_97r5mekrjd24rk9r.append(td, $_6zx9pgjvjd24rk77.fromTag('br'));
    return td;
  };
  var replace = function (cell, tag, attrs) {
    var replica = $_3mqh4mkvjd24rkaa.copy(cell, tag);
    $_vpx6ajkjd24rk68.each(attrs, function (v, k) {
      if (v === null)
        $_4ni5ekkgjd24rk8l.remove(replica, k);
      else
        $_4ni5ekkgjd24rk8l.set(replica, k, v);
    });
    return replica;
  };
  var pasteReplace = function (cellContent) {
    return cellContent;
  };
  var newRow = function (doc) {
    return function () {
      return $_6zx9pgjvjd24rk77.fromTag('tr', doc.dom());
    };
  };
  var cloneFormats = function (oldCell, newCell, formats) {
    var first = $_59jad4kwjd24rkad.first(oldCell);
    return first.map(function (firstText) {
      var formatSelector = formats.join(',');
      var parents = $_ec4gn6kijd24rk8r.ancestors(firstText, formatSelector, function (element) {
        return $_c6tuisjzjd24rk7o.eq(element, oldCell);
      });
      return $_821r2ajgjd24rk5h.foldr(parents, function (last, parent) {
        var clonedFormat = $_3mqh4mkvjd24rkaa.shallow(parent);
        $_97r5mekrjd24rk9r.append(last, clonedFormat);
        return clonedFormat;
      }, newCell);
    }).getOr(newCell);
  };
  var cellOperations = function (mutate, doc, formatsToClone) {
    var newCell = function (prev) {
      var doc = $_8rtodrjxjd24rk7b.owner(prev.element());
      var td = $_6zx9pgjvjd24rk77.fromTag($_sc7pgkhjd24rk8q.name(prev.element()), doc.dom());
      var formats = formatsToClone.getOr([
        'strong',
        'em',
        'b',
        'i',
        'span',
        'font',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'div'
      ]);
      var lastNode = formats.length > 0 ? cloneFormats(prev.element(), td, formats) : td;
      $_97r5mekrjd24rk9r.append(lastNode, $_6zx9pgjvjd24rk77.fromTag('br'));
      $_ftduaokpjd24rk9i.copy(prev.element(), td);
      $_ftduaokpjd24rk9i.remove(td, 'height');
      if (prev.colspan() !== 1)
        $_ftduaokpjd24rk9i.remove(prev.element(), 'width');
      mutate(prev.element(), td);
      return td;
    };
    return {
      row: newRow(doc),
      cell: newCell,
      replace: replace,
      gap: cell$1
    };
  };
  var paste = function (doc) {
    return {
      row: newRow(doc),
      cell: cell$1,
      replace: pasteReplace,
      gap: cell$1
    };
  };
  var $_3u7bywkujd24rk9y = {
    cellOperations: cellOperations,
    paste: paste
  };

  var fromHtml$1 = function (html, scope) {
    var doc = scope || document;
    var div = doc.createElement('div');
    div.innerHTML = html;
    return $_8rtodrjxjd24rk7b.children($_6zx9pgjvjd24rk77.fromDom(div));
  };
  var fromTags = function (tags, scope) {
    return $_821r2ajgjd24rk5h.map(tags, function (x) {
      return $_6zx9pgjvjd24rk77.fromTag(x, scope);
    });
  };
  var fromText$1 = function (texts, scope) {
    return $_821r2ajgjd24rk5h.map(texts, function (x) {
      return $_6zx9pgjvjd24rk77.fromText(x, scope);
    });
  };
  var fromDom$1 = function (nodes) {
    return $_821r2ajgjd24rk5h.map(nodes, $_6zx9pgjvjd24rk77.fromDom);
  };
  var $_bzaps1l0jd24rkam = {
    fromHtml: fromHtml$1,
    fromTags: fromTags,
    fromText: fromText$1,
    fromDom: fromDom$1
  };

  var TagBoundaries = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'li',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ];

  function DomUniverse () {
    var clone = function (element) {
      return $_6zx9pgjvjd24rk77.fromDom(element.dom().cloneNode(false));
    };
    var isBoundary = function (element) {
      if (!$_sc7pgkhjd24rk8q.isElement(element))
        return false;
      if ($_sc7pgkhjd24rk8q.name(element) === 'body')
        return true;
      return $_821r2ajgjd24rk5h.contains(TagBoundaries, $_sc7pgkhjd24rk8q.name(element));
    };
    var isEmptyTag = function (element) {
      if (!$_sc7pgkhjd24rk8q.isElement(element))
        return false;
      return $_821r2ajgjd24rk5h.contains([
        'br',
        'img',
        'hr',
        'input'
      ], $_sc7pgkhjd24rk8q.name(element));
    };
    var comparePosition = function (element, other) {
      return element.dom().compareDocumentPosition(other.dom());
    };
    var copyAttributesTo = function (source, destination) {
      var as = $_4ni5ekkgjd24rk8l.clone(source);
      $_4ni5ekkgjd24rk8l.setAll(destination, as);
    };
    return {
      up: $_brb4k3jijd24rk5p.constant({
        selector: $_e7vzfkljd24rk8y.ancestor,
        closest: $_e7vzfkljd24rk8y.closest,
        predicate: $_dnxapkkmjd24rk8z.ancestor,
        all: $_8rtodrjxjd24rk7b.parents
      }),
      down: $_brb4k3jijd24rk5p.constant({
        selector: $_ec4gn6kijd24rk8r.descendants,
        predicate: $_diga24kjjd24rk8t.descendants
      }),
      styles: $_brb4k3jijd24rk5p.constant({
        get: $_ftduaokpjd24rk9i.get,
        getRaw: $_ftduaokpjd24rk9i.getRaw,
        set: $_ftduaokpjd24rk9i.set,
        remove: $_ftduaokpjd24rk9i.remove
      }),
      attrs: $_brb4k3jijd24rk5p.constant({
        get: $_4ni5ekkgjd24rk8l.get,
        set: $_4ni5ekkgjd24rk8l.set,
        remove: $_4ni5ekkgjd24rk8l.remove,
        copyTo: copyAttributesTo
      }),
      insert: $_brb4k3jijd24rk5p.constant({
        before: $_97r5mekrjd24rk9r.before,
        after: $_97r5mekrjd24rk9r.after,
        afterAll: $_vgziuktjd24rk9v.after,
        append: $_97r5mekrjd24rk9r.append,
        appendAll: $_vgziuktjd24rk9v.append,
        prepend: $_97r5mekrjd24rk9r.prepend,
        wrap: $_97r5mekrjd24rk9r.wrap
      }),
      remove: $_brb4k3jijd24rk5p.constant({
        unwrap: $_6k630dksjd24rk9s.unwrap,
        remove: $_6k630dksjd24rk9s.remove
      }),
      create: $_brb4k3jijd24rk5p.constant({
        nu: $_6zx9pgjvjd24rk77.fromTag,
        clone: clone,
        text: $_6zx9pgjvjd24rk77.fromText
      }),
      query: $_brb4k3jijd24rk5p.constant({
        comparePosition: comparePosition,
        prevSibling: $_8rtodrjxjd24rk7b.prevSibling,
        nextSibling: $_8rtodrjxjd24rk7b.nextSibling
      }),
      property: $_brb4k3jijd24rk5p.constant({
        children: $_8rtodrjxjd24rk7b.children,
        name: $_sc7pgkhjd24rk8q.name,
        parent: $_8rtodrjxjd24rk7b.parent,
        isText: $_sc7pgkhjd24rk8q.isText,
        isComment: $_sc7pgkhjd24rk8q.isComment,
        isElement: $_sc7pgkhjd24rk8q.isElement,
        getText: $_864owvkyjd24rkai.get,
        setText: $_864owvkyjd24rkai.set,
        isBoundary: isBoundary,
        isEmptyTag: isEmptyTag
      }),
      eq: $_c6tuisjzjd24rk7o.eq,
      is: $_c6tuisjzjd24rk7o.is
    };
  }

  var leftRight = $_7p1bnnjljd24rk6a.immutable('left', 'right');
  var bisect = function (universe, parent, child) {
    var children = universe.property().children(parent);
    var index = $_821r2ajgjd24rk5h.findIndex(children, $_brb4k3jijd24rk5p.curry(universe.eq, child));
    return index.map(function (ind) {
      return {
        before: $_brb4k3jijd24rk5p.constant(children.slice(0, ind)),
        after: $_brb4k3jijd24rk5p.constant(children.slice(ind + 1))
      };
    });
  };
  var breakToRight = function (universe, parent, child) {
    return bisect(universe, parent, child).map(function (parts) {
      var second = universe.create().clone(parent);
      universe.insert().appendAll(second, parts.after());
      universe.insert().after(parent, second);
      return leftRight(parent, second);
    });
  };
  var breakToLeft = function (universe, parent, child) {
    return bisect(universe, parent, child).map(function (parts) {
      var prior = universe.create().clone(parent);
      universe.insert().appendAll(prior, parts.before().concat([child]));
      universe.insert().appendAll(parent, parts.after());
      universe.insert().before(parent, prior);
      return leftRight(prior, parent);
    });
  };
  var breakPath = function (universe, item, isTop, breaker) {
    var result = $_7p1bnnjljd24rk6a.immutable('first', 'second', 'splits');
    var next = function (child, group, splits) {
      var fallback = result(child, $_geu5gjhjd24rk5m.none(), splits);
      if (isTop(child))
        return result(child, group, splits);
      else {
        return universe.property().parent(child).bind(function (parent) {
          return breaker(universe, parent, child).map(function (breakage) {
            var extra = [{
                first: breakage.left,
                second: breakage.right
              }];
            var nextChild = isTop(parent) ? parent : breakage.left();
            return next(nextChild, $_geu5gjhjd24rk5m.some(breakage.right()), splits.concat(extra));
          }).getOr(fallback);
        });
      }
    };
    return next(item, $_geu5gjhjd24rk5m.none(), []);
  };
  var $_1tieowl9jd24rkc5 = {
    breakToLeft: breakToLeft,
    breakToRight: breakToRight,
    breakPath: breakPath
  };

  var all$3 = function (universe, look, elements, f) {
    var head = elements[0];
    var tail = elements.slice(1);
    return f(universe, look, head, tail);
  };
  var oneAll = function (universe, look, elements) {
    return elements.length > 0 ? all$3(universe, look, elements, unsafeOne) : $_geu5gjhjd24rk5m.none();
  };
  var unsafeOne = function (universe, look, head, tail) {
    var start = look(universe, head);
    return $_821r2ajgjd24rk5h.foldr(tail, function (b, a) {
      var current = look(universe, a);
      return commonElement(universe, b, current);
    }, start);
  };
  var commonElement = function (universe, start, end) {
    return start.bind(function (s) {
      return end.filter($_brb4k3jijd24rk5p.curry(universe.eq, s));
    });
  };
  var $_11tfpwlajd24rkcb = { oneAll: oneAll };

  var eq$1 = function (universe, item) {
    return $_brb4k3jijd24rk5p.curry(universe.eq, item);
  };
  var unsafeSubset = function (universe, common, ps1, ps2) {
    var children = universe.property().children(common);
    if (universe.eq(common, ps1[0]))
      return $_geu5gjhjd24rk5m.some([ps1[0]]);
    if (universe.eq(common, ps2[0]))
      return $_geu5gjhjd24rk5m.some([ps2[0]]);
    var finder = function (ps) {
      var topDown = $_821r2ajgjd24rk5h.reverse(ps);
      var index = $_821r2ajgjd24rk5h.findIndex(topDown, eq$1(universe, common)).getOr(-1);
      var item = index < topDown.length - 1 ? topDown[index + 1] : topDown[index];
      return $_821r2ajgjd24rk5h.findIndex(children, eq$1(universe, item));
    };
    var startIndex = finder(ps1);
    var endIndex = finder(ps2);
    return startIndex.bind(function (sIndex) {
      return endIndex.map(function (eIndex) {
        var first = Math.min(sIndex, eIndex);
        var last = Math.max(sIndex, eIndex);
        return children.slice(first, last + 1);
      });
    });
  };
  var ancestors$2 = function (universe, start, end, _isRoot) {
    var isRoot = _isRoot !== undefined ? _isRoot : $_brb4k3jijd24rk5p.constant(false);
    var ps1 = [start].concat(universe.up().all(start));
    var ps2 = [end].concat(universe.up().all(end));
    var prune = function (path) {
      var index = $_821r2ajgjd24rk5h.findIndex(path, isRoot);
      return index.fold(function () {
        return path;
      }, function (ind) {
        return path.slice(0, ind + 1);
      });
    };
    var pruned1 = prune(ps1);
    var pruned2 = prune(ps2);
    var shared = $_821r2ajgjd24rk5h.find(pruned1, function (x) {
      return $_821r2ajgjd24rk5h.exists(pruned2, eq$1(universe, x));
    });
    return {
      firstpath: $_brb4k3jijd24rk5p.constant(pruned1),
      secondpath: $_brb4k3jijd24rk5p.constant(pruned2),
      shared: $_brb4k3jijd24rk5p.constant(shared)
    };
  };
  var subset = function (universe, start, end) {
    var ancs = ancestors$2(universe, start, end);
    return ancs.shared().bind(function (shared) {
      return unsafeSubset(universe, shared, ancs.firstpath(), ancs.secondpath());
    });
  };
  var $_6w11hllbjd24rkci = {
    subset: subset,
    ancestors: ancestors$2
  };

  var sharedOne = function (universe, look, elements) {
    return $_11tfpwlajd24rkcb.oneAll(universe, look, elements);
  };
  var subset$1 = function (universe, start, finish) {
    return $_6w11hllbjd24rkci.subset(universe, start, finish);
  };
  var ancestors$3 = function (universe, start, finish, _isRoot) {
    return $_6w11hllbjd24rkci.ancestors(universe, start, finish, _isRoot);
  };
  var breakToLeft$1 = function (universe, parent, child) {
    return $_1tieowl9jd24rkc5.breakToLeft(universe, parent, child);
  };
  var breakToRight$1 = function (universe, parent, child) {
    return $_1tieowl9jd24rkc5.breakToRight(universe, parent, child);
  };
  var breakPath$1 = function (universe, child, isTop, breaker) {
    return $_1tieowl9jd24rkc5.breakPath(universe, child, isTop, breaker);
  };
  var $_2b8ical8jd24rkc4 = {
    sharedOne: sharedOne,
    subset: subset$1,
    ancestors: ancestors$3,
    breakToLeft: breakToLeft$1,
    breakToRight: breakToRight$1,
    breakPath: breakPath$1
  };

  var universe = DomUniverse();
  var sharedOne$1 = function (look, elements) {
    return $_2b8ical8jd24rkc4.sharedOne(universe, function (universe, element) {
      return look(element);
    }, elements);
  };
  var subset$2 = function (start, finish) {
    return $_2b8ical8jd24rkc4.subset(universe, start, finish);
  };
  var ancestors$4 = function (start, finish, _isRoot) {
    return $_2b8ical8jd24rkc4.ancestors(universe, start, finish, _isRoot);
  };
  var breakToLeft$2 = function (parent, child) {
    return $_2b8ical8jd24rkc4.breakToLeft(universe, parent, child);
  };
  var breakToRight$2 = function (parent, child) {
    return $_2b8ical8jd24rkc4.breakToRight(universe, parent, child);
  };
  var breakPath$2 = function (child, isTop, breaker) {
    return $_2b8ical8jd24rkc4.breakPath(universe, child, isTop, function (u, p, c) {
      return breaker(p, c);
    });
  };
  var $_9kdbu6l5jd24rkbj = {
    sharedOne: sharedOne$1,
    subset: subset$2,
    ancestors: ancestors$4,
    breakToLeft: breakToLeft$2,
    breakToRight: breakToRight$2,
    breakPath: breakPath$2
  };

  var inSelection = function (bounds, detail) {
    var leftEdge = detail.column();
    var rightEdge = detail.column() + detail.colspan() - 1;
    var topEdge = detail.row();
    var bottomEdge = detail.row() + detail.rowspan() - 1;
    return leftEdge <= bounds.finishCol() && rightEdge >= bounds.startCol() && (topEdge <= bounds.finishRow() && bottomEdge >= bounds.startRow());
  };
  var isWithin = function (bounds, detail) {
    return detail.column() >= bounds.startCol() && detail.column() + detail.colspan() - 1 <= bounds.finishCol() && detail.row() >= bounds.startRow() && detail.row() + detail.rowspan() - 1 <= bounds.finishRow();
  };
  var isRectangular = function (warehouse, bounds) {
    var isRect = true;
    var detailIsWithin = $_brb4k3jijd24rk5p.curry(isWithin, bounds);
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        isRect = isRect && $_4xhnwmkojd24rk9d.getAt(warehouse, i, j).exists(detailIsWithin);
      }
    }
    return isRect ? $_geu5gjhjd24rk5m.some(bounds) : $_geu5gjhjd24rk5m.none();
  };
  var $_eokqgelejd24rkct = {
    inSelection: inSelection,
    isWithin: isWithin,
    isRectangular: isRectangular
  };

  var getBounds = function (detailA, detailB) {
    return $_4vfg3njrjd24rk6n.bounds(Math.min(detailA.row(), detailB.row()), Math.min(detailA.column(), detailB.column()), Math.max(detailA.row() + detailA.rowspan() - 1, detailB.row() + detailB.rowspan() - 1), Math.max(detailA.column() + detailA.colspan() - 1, detailB.column() + detailB.colspan() - 1));
  };
  var getAnyBox = function (warehouse, startCell, finishCell) {
    var startCoords = $_4xhnwmkojd24rk9d.findItem(warehouse, startCell, $_c6tuisjzjd24rk7o.eq);
    var finishCoords = $_4xhnwmkojd24rk9d.findItem(warehouse, finishCell, $_c6tuisjzjd24rk7o.eq);
    return startCoords.bind(function (sc) {
      return finishCoords.map(function (fc) {
        return getBounds(sc, fc);
      });
    });
  };
  var getBox = function (warehouse, startCell, finishCell) {
    return getAnyBox(warehouse, startCell, finishCell).bind(function (bounds) {
      return $_eokqgelejd24rkct.isRectangular(warehouse, bounds);
    });
  };
  var $_1rq4fclfjd24rkcx = {
    getAnyBox: getAnyBox,
    getBox: getBox
  };

  var moveBy = function (warehouse, cell, row, column) {
    return $_4xhnwmkojd24rk9d.findItem(warehouse, cell, $_c6tuisjzjd24rk7o.eq).bind(function (detail) {
      var startRow = row > 0 ? detail.row() + detail.rowspan() - 1 : detail.row();
      var startCol = column > 0 ? detail.column() + detail.colspan() - 1 : detail.column();
      var dest = $_4xhnwmkojd24rk9d.getAt(warehouse, startRow + row, startCol + column);
      return dest.map(function (d) {
        return d.element();
      });
    });
  };
  var intercepts = function (warehouse, start, finish) {
    return $_1rq4fclfjd24rkcx.getAnyBox(warehouse, start, finish).map(function (bounds) {
      var inside = $_4xhnwmkojd24rk9d.filterItems(warehouse, $_brb4k3jijd24rk5p.curry($_eokqgelejd24rkct.inSelection, bounds));
      return $_821r2ajgjd24rk5h.map(inside, function (detail) {
        return detail.element();
      });
    });
  };
  var parentCell = function (warehouse, innerCell) {
    var isContainedBy = function (c1, c2) {
      return $_c6tuisjzjd24rk7o.contains(c2, c1);
    };
    return $_4xhnwmkojd24rk9d.findItem(warehouse, innerCell, isContainedBy).bind(function (detail) {
      return detail.element();
    });
  };
  var $_9wou1lldjd24rkcp = {
    moveBy: moveBy,
    intercepts: intercepts,
    parentCell: parentCell
  };

  var moveBy$1 = function (cell, deltaRow, deltaColumn) {
    return $_60ksrkjsjd24rk6p.table(cell).bind(function (table) {
      var warehouse = getWarehouse(table);
      return $_9wou1lldjd24rkcp.moveBy(warehouse, cell, deltaRow, deltaColumn);
    });
  };
  var intercepts$1 = function (table, first, last) {
    var warehouse = getWarehouse(table);
    return $_9wou1lldjd24rkcp.intercepts(warehouse, first, last);
  };
  var nestedIntercepts = function (table, first, firstTable, last, lastTable) {
    var warehouse = getWarehouse(table);
    var startCell = $_c6tuisjzjd24rk7o.eq(table, firstTable) ? first : $_9wou1lldjd24rkcp.parentCell(warehouse, first);
    var lastCell = $_c6tuisjzjd24rk7o.eq(table, lastTable) ? last : $_9wou1lldjd24rkcp.parentCell(warehouse, last);
    return $_9wou1lldjd24rkcp.intercepts(warehouse, startCell, lastCell);
  };
  var getBox$1 = function (table, first, last) {
    var warehouse = getWarehouse(table);
    return $_1rq4fclfjd24rkcx.getBox(warehouse, first, last);
  };
  var getWarehouse = function (table) {
    var list = $_d16wdjjqjd24rk6i.fromTable(table);
    return $_4xhnwmkojd24rk9d.generate(list);
  };
  var $_10u6d3lcjd24rkcn = {
    moveBy: moveBy$1,
    intercepts: intercepts$1,
    nestedIntercepts: nestedIntercepts,
    getBox: getBox$1
  };

  var lookupTable = function (container, isRoot) {
    return $_e7vzfkljd24rk8y.ancestor(container, 'table');
  };
  var identified = $_7p1bnnjljd24rk6a.immutableBag([
    'boxes',
    'start',
    'finish'
  ], []);
  var identify = function (start, finish, isRoot) {
    var getIsRoot = function (rootTable) {
      return function (element) {
        return isRoot(element) || $_c6tuisjzjd24rk7o.eq(element, rootTable);
      };
    };
    if ($_c6tuisjzjd24rk7o.eq(start, finish)) {
      return $_geu5gjhjd24rk5m.some(identified({
        boxes: $_geu5gjhjd24rk5m.some([start]),
        start: start,
        finish: finish
      }));
    } else {
      return lookupTable(start, isRoot).bind(function (startTable) {
        return lookupTable(finish, isRoot).bind(function (finishTable) {
          if ($_c6tuisjzjd24rk7o.eq(startTable, finishTable)) {
            return $_geu5gjhjd24rk5m.some(identified({
              boxes: $_10u6d3lcjd24rkcn.intercepts(startTable, start, finish),
              start: start,
              finish: finish
            }));
          } else if ($_c6tuisjzjd24rk7o.contains(startTable, finishTable)) {
            var ancestorCells = $_ec4gn6kijd24rk8r.ancestors(finish, 'td,th', getIsRoot(startTable));
            var finishCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : finish;
            return $_geu5gjhjd24rk5m.some(identified({
              boxes: $_10u6d3lcjd24rkcn.nestedIntercepts(startTable, start, startTable, finish, finishTable),
              start: start,
              finish: finishCell
            }));
          } else if ($_c6tuisjzjd24rk7o.contains(finishTable, startTable)) {
            var ancestorCells = $_ec4gn6kijd24rk8r.ancestors(start, 'td,th', getIsRoot(finishTable));
            var startCell = ancestorCells.length > 0 ? ancestorCells[ancestorCells.length - 1] : start;
            return $_geu5gjhjd24rk5m.some(identified({
              boxes: $_10u6d3lcjd24rkcn.nestedIntercepts(finishTable, start, startTable, finish, finishTable),
              start: start,
              finish: startCell
            }));
          } else {
            return $_9kdbu6l5jd24rkbj.ancestors(start, finish).shared().bind(function (lca) {
              return $_e7vzfkljd24rk8y.closest(lca, 'table', isRoot).bind(function (lcaTable) {
                var finishAncestorCells = $_ec4gn6kijd24rk8r.ancestors(finish, 'td,th', getIsRoot(lcaTable));
                var finishCell = finishAncestorCells.length > 0 ? finishAncestorCells[finishAncestorCells.length - 1] : finish;
                var startAncestorCells = $_ec4gn6kijd24rk8r.ancestors(start, 'td,th', getIsRoot(lcaTable));
                var startCell = startAncestorCells.length > 0 ? startAncestorCells[startAncestorCells.length - 1] : start;
                return $_geu5gjhjd24rk5m.some(identified({
                  boxes: $_10u6d3lcjd24rkcn.nestedIntercepts(lcaTable, start, startTable, finish, finishTable),
                  start: startCell,
                  finish: finishCell
                }));
              });
            });
          }
        });
      });
    }
  };
  var retrieve = function (container, selector) {
    var sels = $_ec4gn6kijd24rk8r.descendants(container, selector);
    return sels.length > 0 ? $_geu5gjhjd24rk5m.some(sels) : $_geu5gjhjd24rk5m.none();
  };
  var getLast = function (boxes, lastSelectedSelector) {
    return $_821r2ajgjd24rk5h.find(boxes, function (box) {
      return $_807qyjujd24rk73.is(box, lastSelectedSelector);
    });
  };
  var getEdges = function (container, firstSelectedSelector, lastSelectedSelector) {
    return $_e7vzfkljd24rk8y.descendant(container, firstSelectedSelector).bind(function (first) {
      return $_e7vzfkljd24rk8y.descendant(container, lastSelectedSelector).bind(function (last) {
        return $_9kdbu6l5jd24rkbj.sharedOne(lookupTable, [
          first,
          last
        ]).map(function (tbl) {
          return {
            first: $_brb4k3jijd24rk5p.constant(first),
            last: $_brb4k3jijd24rk5p.constant(last),
            table: $_brb4k3jijd24rk5p.constant(tbl)
          };
        });
      });
    });
  };
  var expandTo = function (finish, firstSelectedSelector) {
    return $_e7vzfkljd24rk8y.ancestor(finish, 'table').bind(function (table) {
      return $_e7vzfkljd24rk8y.descendant(table, firstSelectedSelector).bind(function (start) {
        return identify(start, finish).bind(function (identified) {
          return identified.boxes().map(function (boxes) {
            return {
              boxes: $_brb4k3jijd24rk5p.constant(boxes),
              start: $_brb4k3jijd24rk5p.constant(identified.start()),
              finish: $_brb4k3jijd24rk5p.constant(identified.finish())
            };
          });
        });
      });
    });
  };
  var shiftSelection = function (boxes, deltaRow, deltaColumn, firstSelectedSelector, lastSelectedSelector) {
    return getLast(boxes, lastSelectedSelector).bind(function (last) {
      return $_10u6d3lcjd24rkcn.moveBy(last, deltaRow, deltaColumn).bind(function (finish) {
        return expandTo(finish, firstSelectedSelector);
      });
    });
  };
  var $_cz5shl4jd24rkb7 = {
    identify: identify,
    retrieve: retrieve,
    shiftSelection: shiftSelection,
    getEdges: getEdges
  };

  var retrieve$1 = function (container, selector) {
    return $_cz5shl4jd24rkb7.retrieve(container, selector);
  };
  var retrieveBox = function (container, firstSelectedSelector, lastSelectedSelector) {
    return $_cz5shl4jd24rkb7.getEdges(container, firstSelectedSelector, lastSelectedSelector).bind(function (edges) {
      var isRoot = function (ancestor) {
        return $_c6tuisjzjd24rk7o.eq(container, ancestor);
      };
      var firstAncestor = $_e7vzfkljd24rk8y.ancestor(edges.first(), 'thead,tfoot,tbody,table', isRoot);
      var lastAncestor = $_e7vzfkljd24rk8y.ancestor(edges.last(), 'thead,tfoot,tbody,table', isRoot);
      return firstAncestor.bind(function (fA) {
        return lastAncestor.bind(function (lA) {
          return $_c6tuisjzjd24rk7o.eq(fA, lA) ? $_10u6d3lcjd24rkcn.getBox(edges.table(), edges.first(), edges.last()) : $_geu5gjhjd24rk5m.none();
        });
      });
    });
  };
  var $_869bbnl3jd24rkb1 = {
    retrieve: retrieve$1,
    retrieveBox: retrieveBox
  };

  var selected = 'data-mce-selected';
  var selectedSelector = 'td[' + selected + '],th[' + selected + ']';
  var attributeSelector = '[' + selected + ']';
  var firstSelected = 'data-mce-first-selected';
  var firstSelectedSelector = 'td[' + firstSelected + '],th[' + firstSelected + ']';
  var lastSelected = 'data-mce-last-selected';
  var lastSelectedSelector = 'td[' + lastSelected + '],th[' + lastSelected + ']';
  var $_eespehlgjd24rkd1 = {
    selected: $_brb4k3jijd24rk5p.constant(selected),
    selectedSelector: $_brb4k3jijd24rk5p.constant(selectedSelector),
    attributeSelector: $_brb4k3jijd24rk5p.constant(attributeSelector),
    firstSelected: $_brb4k3jijd24rk5p.constant(firstSelected),
    firstSelectedSelector: $_brb4k3jijd24rk5p.constant(firstSelectedSelector),
    lastSelected: $_brb4k3jijd24rk5p.constant(lastSelected),
    lastSelectedSelector: $_brb4k3jijd24rk5p.constant(lastSelectedSelector)
  };

  var generate$1 = function (cases) {
    if (!$_g4fo8ljpjd24rk6g.isArray(cases)) {
      throw new Error('cases must be an array');
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case');
    }
    var constructors = [];
    var adt = {};
    $_821r2ajgjd24rk5h.each(cases, function (acase, count) {
      var keys = $_vpx6ajkjd24rk68.keys(acase);
      if (keys.length !== 1) {
        throw new Error('one and only one name per case');
      }
      var key = keys[0];
      var value = acase[key];
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key);
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)');
      } else if (!$_g4fo8ljpjd24rk6g.isArray(value)) {
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
          var branchKeys = $_vpx6ajkjd24rk68.keys(branches);
          if (constructors.length !== branchKeys.length) {
            throw new Error('Wrong number of arguments to match. Expected: ' + constructors.join(',') + '\nActual: ' + branchKeys.join(','));
          }
          var allReqd = $_821r2ajgjd24rk5h.forall(constructors, function (reqKey) {
            return $_821r2ajgjd24rk5h.contains(branchKeys, reqKey);
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
  var $_24qudflijd24rkd4 = { generate: generate$1 };

  var type$1 = $_24qudflijd24rkd4.generate([
    { none: [] },
    { multiple: ['elements'] },
    { single: ['selection'] }
  ]);
  var cata = function (subject, onNone, onMultiple, onSingle) {
    return subject.fold(onNone, onMultiple, onSingle);
  };
  var $_asx793lhjd24rkd2 = {
    cata: cata,
    none: type$1.none,
    multiple: type$1.multiple,
    single: type$1.single
  };

  var selection = function (cell, selections) {
    return $_asx793lhjd24rkd2.cata(selections.get(), $_brb4k3jijd24rk5p.constant([]), $_brb4k3jijd24rk5p.identity, $_brb4k3jijd24rk5p.constant([cell]));
  };
  var unmergable = function (cell, selections) {
    var hasSpan = function (elem) {
      return $_4ni5ekkgjd24rk8l.has(elem, 'rowspan') && parseInt($_4ni5ekkgjd24rk8l.get(elem, 'rowspan'), 10) > 1 || $_4ni5ekkgjd24rk8l.has(elem, 'colspan') && parseInt($_4ni5ekkgjd24rk8l.get(elem, 'colspan'), 10) > 1;
    };
    var candidates = selection(cell, selections);
    return candidates.length > 0 && $_821r2ajgjd24rk5h.forall(candidates, hasSpan) ? $_geu5gjhjd24rk5m.some(candidates) : $_geu5gjhjd24rk5m.none();
  };
  var mergable = function (table, selections) {
    return $_asx793lhjd24rkd2.cata(selections.get(), $_geu5gjhjd24rk5m.none, function (cells, _env) {
      if (cells.length === 0) {
        return $_geu5gjhjd24rk5m.none();
      }
      return $_869bbnl3jd24rkb1.retrieveBox(table, $_eespehlgjd24rkd1.firstSelectedSelector(), $_eespehlgjd24rkd1.lastSelectedSelector()).bind(function (bounds) {
        return cells.length > 1 ? $_geu5gjhjd24rk5m.some({
          bounds: $_brb4k3jijd24rk5p.constant(bounds),
          cells: $_brb4k3jijd24rk5p.constant(cells)
        }) : $_geu5gjhjd24rk5m.none();
      });
    }, $_geu5gjhjd24rk5m.none);
  };
  var $_akp7pql2jd24rkaw = {
    mergable: mergable,
    unmergable: unmergable,
    selection: selection
  };

  var noMenu = function (cell) {
    return {
      element: $_brb4k3jijd24rk5p.constant(cell),
      mergable: $_geu5gjhjd24rk5m.none,
      unmergable: $_geu5gjhjd24rk5m.none,
      selection: $_brb4k3jijd24rk5p.constant([cell])
    };
  };
  var forMenu = function (selections, table, cell) {
    return {
      element: $_brb4k3jijd24rk5p.constant(cell),
      mergable: $_brb4k3jijd24rk5p.constant($_akp7pql2jd24rkaw.mergable(table, selections)),
      unmergable: $_brb4k3jijd24rk5p.constant($_akp7pql2jd24rkaw.unmergable(cell, selections)),
      selection: $_brb4k3jijd24rk5p.constant($_akp7pql2jd24rkaw.selection(cell, selections))
    };
  };
  var notCell$1 = function (element) {
    return noMenu(element);
  };
  var paste$1 = $_7p1bnnjljd24rk6a.immutable('element', 'clipboard', 'generators');
  var pasteRows = function (selections, table, cell, clipboard, generators) {
    return {
      element: $_brb4k3jijd24rk5p.constant(cell),
      mergable: $_geu5gjhjd24rk5m.none,
      unmergable: $_geu5gjhjd24rk5m.none,
      selection: $_brb4k3jijd24rk5p.constant($_akp7pql2jd24rkaw.selection(cell, selections)),
      clipboard: $_brb4k3jijd24rk5p.constant(clipboard),
      generators: $_brb4k3jijd24rk5p.constant(generators)
    };
  };
  var $_g6t26dl1jd24rkap = {
    noMenu: noMenu,
    forMenu: forMenu,
    notCell: notCell$1,
    paste: paste$1,
    pasteRows: pasteRows
  };

  var extractSelected = function (cells) {
    return $_60ksrkjsjd24rk6p.table(cells[0]).map($_3mqh4mkvjd24rkaa.deep).map(function (replica) {
      return [$_kbiqjjjd24rk5s.extract(replica, $_eespehlgjd24rkd1.attributeSelector())];
    });
  };
  var serializeElement = function (editor, elm) {
    return editor.selection.serializer.serialize(elm.dom(), {});
  };
  var registerEvents = function (editor, selections, actions, cellSelection) {
    editor.on('BeforeGetContent', function (e) {
      var multiCellContext = function (cells) {
        e.preventDefault();
        extractSelected(cells).each(function (elements) {
          e.content = $_821r2ajgjd24rk5h.map(elements, function (elm) {
            return serializeElement(editor, elm);
          }).join('');
        });
      };
      if (e.selection === true) {
        $_asx793lhjd24rkd2.cata(selections.get(), $_brb4k3jijd24rk5p.noop, multiCellContext, $_brb4k3jijd24rk5p.noop);
      }
    });
    editor.on('BeforeSetContent', function (e) {
      if (e.selection === true && e.paste === true) {
        var cellOpt = $_geu5gjhjd24rk5m.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        cellOpt.each(function (domCell) {
          var cell = $_6zx9pgjvjd24rk77.fromDom(domCell);
          var table = $_60ksrkjsjd24rk6p.table(cell);
          table.bind(function (table) {
            var elements = $_821r2ajgjd24rk5h.filter($_bzaps1l0jd24rkam.fromHtml(e.content), function (content) {
              return $_sc7pgkhjd24rk8q.name(content) !== 'meta';
            });
            if (elements.length === 1 && $_sc7pgkhjd24rk8q.name(elements[0]) === 'table') {
              e.preventDefault();
              var doc = $_6zx9pgjvjd24rk77.fromDom(editor.getDoc());
              var generators = $_3u7bywkujd24rk9y.paste(doc);
              var targets = $_g6t26dl1jd24rkap.paste(cell, elements[0], generators);
              actions.pasteCells(table, targets).each(function (rng) {
                editor.selection.setRng(rng);
                editor.focus();
                cellSelection.clear(table);
              });
            }
          });
        });
      }
    });
  };
  var $_24mfmajfjd24rk54 = { registerEvents: registerEvents };

  var makeTable = function () {
    return $_6zx9pgjvjd24rk77.fromTag('table');
  };
  var tableBody = function () {
    return $_6zx9pgjvjd24rk77.fromTag('tbody');
  };
  var tableRow = function () {
    return $_6zx9pgjvjd24rk77.fromTag('tr');
  };
  var tableHeaderCell = function () {
    return $_6zx9pgjvjd24rk77.fromTag('th');
  };
  var tableCell = function () {
    return $_6zx9pgjvjd24rk77.fromTag('td');
  };
  var render = function (rows, columns, rowHeaders, columnHeaders) {
    var table = makeTable();
    $_ftduaokpjd24rk9i.setAll(table, {
      'border-collapse': 'collapse',
      width: '100%'
    });
    $_4ni5ekkgjd24rk8l.set(table, 'border', '1');
    var tbody = tableBody();
    $_97r5mekrjd24rk9r.append(table, tbody);
    var trs = [];
    for (var i = 0; i < rows; i++) {
      var tr = tableRow();
      for (var j = 0; j < columns; j++) {
        var td = i < rowHeaders || j < columnHeaders ? tableHeaderCell() : tableCell();
        if (j < columnHeaders) {
          $_4ni5ekkgjd24rk8l.set(td, 'scope', 'row');
        }
        if (i < rowHeaders) {
          $_4ni5ekkgjd24rk8l.set(td, 'scope', 'col');
        }
        $_97r5mekrjd24rk9r.append(td, $_6zx9pgjvjd24rk77.fromTag('br'));
        $_ftduaokpjd24rk9i.set(td, 'width', 100 / columns + '%');
        $_97r5mekrjd24rk9r.append(tr, td);
      }
      trs.push(tr);
    }
    $_vgziuktjd24rk9v.append(tbody, trs);
    return table;
  };
  var $_1sgmkxlljd24rkdd = { render: render };

  var $_dydsrdlkjd24rkdc = { render: $_1sgmkxlljd24rkdd.render };

  var get$3 = function (element) {
    return element.dom().innerHTML;
  };
  var set$3 = function (element, content) {
    var owner = $_8rtodrjxjd24rk7b.owner(element);
    var docDom = owner.dom();
    var fragment = $_6zx9pgjvjd24rk77.fromDom(docDom.createDocumentFragment());
    var contentElements = $_bzaps1l0jd24rkam.fromHtml(content, docDom);
    $_vgziuktjd24rk9v.append(fragment, contentElements);
    $_6k630dksjd24rk9s.empty(element);
    $_97r5mekrjd24rk9r.append(element, fragment);
  };
  var getOuter = function (element) {
    var container = $_6zx9pgjvjd24rk77.fromTag('div');
    var clone = $_6zx9pgjvjd24rk77.fromDom(element.dom().cloneNode(true));
    $_97r5mekrjd24rk9r.append(container, clone);
    return get$3(container);
  };
  var $_8971xblmjd24rkdj = {
    get: get$3,
    set: set$3,
    getOuter: getOuter
  };

  var placeCaretInCell = function (editor, cell) {
    editor.selection.select(cell.dom(), true);
    editor.selection.collapse(true);
  };
  var selectFirstCellInTable = function (editor, tableElm) {
    $_e7vzfkljd24rk8y.descendant(tableElm, 'td,th').each($_brb4k3jijd24rk5p.curry(placeCaretInCell, editor));
  };
  var insert = function (editor, columns, rows) {
    var tableElm;
    var renderedHtml = $_dydsrdlkjd24rkdc.render(rows, columns, 0, 0);
    $_4ni5ekkgjd24rk8l.set(renderedHtml, 'id', '__mce');
    var html = $_8971xblmjd24rkdj.getOuter(renderedHtml);
    editor.insertContent(html);
    tableElm = editor.dom.get('__mce');
    editor.dom.setAttrib(tableElm, 'id', null);
    editor.$('tr', tableElm).each(function (index, row) {
      editor.fire('newrow', { node: row });
      editor.$('th,td', row).each(function (index, cell) {
        editor.fire('newcell', { node: cell });
      });
    });
    editor.dom.setAttribs(tableElm, editor.settings.table_default_attributes || {});
    editor.dom.setStyles(tableElm, editor.settings.table_default_styles || {});
    selectFirstCellInTable(editor, $_6zx9pgjvjd24rk77.fromDom(tableElm));
    return tableElm;
  };
  var $_8wcpcxljjd24rkd7 = { insert: insert };

  function Dimension (name, getOffset) {
    var set = function (element, h) {
      if (!$_g4fo8ljpjd24rk6g.isNumber(h) && !h.match(/^[0-9]+$/))
        throw name + '.set accepts only positive integer values. Value was ' + h;
      var dom = element.dom();
      if ($_87r4p1kqjd24rk9q.isSupported(dom))
        dom.style[name] = h + 'px';
    };
    var get = function (element) {
      var r = getOffset(element);
      if (r <= 0 || r === null) {
        var css = $_ftduaokpjd24rk9i.get(element, name);
        return parseFloat(css) || 0;
      }
      return r;
    };
    var getOuter = get;
    var aggregate = function (element, properties) {
      return $_821r2ajgjd24rk5h.foldl(properties, function (acc, property) {
        var val = $_ftduaokpjd24rk9i.get(element, property);
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

  var api$1 = Dimension('height', function (element) {
    return $_6ezo74kkjd24rk8v.inBody(element) ? element.dom().getBoundingClientRect().height : element.dom().offsetHeight;
  });
  var set$4 = function (element, h) {
    api$1.set(element, h);
  };
  var get$4 = function (element) {
    return api$1.get(element);
  };
  var getOuter$1 = function (element) {
    return api$1.getOuter(element);
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
    var absMax = api$1.max(element, value, inclusions);
    $_ftduaokpjd24rk9i.set(element, 'max-height', absMax + 'px');
  };
  var $_54nv5jlrjd24rkeg = {
    set: set$4,
    get: get$4,
    getOuter: getOuter$1,
    setMax: setMax
  };

  var api$2 = Dimension('width', function (element) {
    return element.dom().offsetWidth;
  });
  var set$5 = function (element, h) {
    api$2.set(element, h);
  };
  var get$5 = function (element) {
    return api$2.get(element);
  };
  var getOuter$2 = function (element) {
    return api$2.getOuter(element);
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
    var absMax = api$2.max(element, value, inclusions);
    $_ftduaokpjd24rk9i.set(element, 'max-width', absMax + 'px');
  };
  var $_a7blqultjd24rkem = {
    set: set$5,
    get: get$5,
    getOuter: getOuter$2,
    setMax: setMax$1
  };

  var platform = $_cdhubfk4jd24rk7y.detect();
  var needManualCalc = function () {
    return platform.browser.isIE() || platform.browser.isEdge();
  };
  var toNumber = function (px, fallback) {
    var num = parseFloat(px);
    return isNaN(num) ? fallback : num;
  };
  var getProp = function (elm, name, fallback) {
    return toNumber($_ftduaokpjd24rk9i.get(elm, name), fallback);
  };
  var getCalculatedHeight = function (cell) {
    var paddingTop = getProp(cell, 'padding-top', 0);
    var paddingBottom = getProp(cell, 'padding-bottom', 0);
    var borderTop = getProp(cell, 'border-top-width', 0);
    var borderBottom = getProp(cell, 'border-bottom-width', 0);
    var height = cell.dom().getBoundingClientRect().height;
    var boxSizing = $_ftduaokpjd24rk9i.get(cell, 'box-sizing');
    var borders = borderTop + borderBottom;
    return boxSizing === 'border-box' ? height : height - paddingTop - paddingBottom - borders;
  };
  var getWidth = function (cell) {
    return getProp(cell, 'width', $_a7blqultjd24rkem.get(cell));
  };
  var getHeight = function (cell) {
    return needManualCalc() ? getCalculatedHeight(cell) : getProp(cell, 'height', $_54nv5jlrjd24rkeg.get(cell));
  };
  var $_7q6sjdlqjd24rkec = {
    getWidth: getWidth,
    getHeight: getHeight
  };

  var genericSizeRegex = /(\d+(\.\d+)?)(\w|%)*/;
  var percentageBasedSizeRegex = /(\d+(\.\d+)?)%/;
  var pixelBasedSizeRegex = /(\d+(\.\d+)?)px|em/;
  var setPixelWidth = function (cell, amount) {
    $_ftduaokpjd24rk9i.set(cell, 'width', amount + 'px');
  };
  var setPercentageWidth = function (cell, amount) {
    $_ftduaokpjd24rk9i.set(cell, 'width', amount + '%');
  };
  var setHeight = function (cell, amount) {
    $_ftduaokpjd24rk9i.set(cell, 'height', amount + 'px');
  };
  var getHeightValue = function (cell) {
    return $_ftduaokpjd24rk9i.getRaw(cell, 'height').getOrThunk(function () {
      return $_7q6sjdlqjd24rkec.getHeight(cell) + 'px';
    });
  };
  var convert = function (cell, number, getter, setter) {
    var newSize = $_60ksrkjsjd24rk6p.table(cell).map(function (table) {
      var total = getter(table);
      return Math.floor(number / 100 * total);
    }).getOr(number);
    setter(cell, newSize);
    return newSize;
  };
  var normalizePixelSize = function (value, cell, getter, setter) {
    var number = parseInt(value, 10);
    return $_1i2xl5kdjd24rk8h.endsWith(value, '%') && $_sc7pgkhjd24rk8q.name(cell) !== 'table' ? convert(cell, number, getter, setter) : number;
  };
  var getTotalHeight = function (cell) {
    var value = getHeightValue(cell);
    if (!value)
      return $_54nv5jlrjd24rkeg.get(cell);
    return normalizePixelSize(value, cell, $_54nv5jlrjd24rkeg.get, setHeight);
  };
  var get$6 = function (cell, type, f) {
    var v = f(cell);
    var span = getSpan(cell, type);
    return v / span;
  };
  var getSpan = function (cell, type) {
    return $_4ni5ekkgjd24rk8l.has(cell, type) ? parseInt($_4ni5ekkgjd24rk8l.get(cell, type), 10) : 1;
  };
  var getRawWidth = function (element) {
    var cssWidth = $_ftduaokpjd24rk9i.getRaw(element, 'width');
    return cssWidth.fold(function () {
      return $_geu5gjhjd24rk5m.from($_4ni5ekkgjd24rk8l.get(element, 'width'));
    }, function (width) {
      return $_geu5gjhjd24rk5m.some(width);
    });
  };
  var normalizePercentageWidth = function (cellWidth, tableSize) {
    return cellWidth / tableSize.pixelWidth() * 100;
  };
  var choosePercentageSize = function (element, width, tableSize) {
    if (percentageBasedSizeRegex.test(width)) {
      var percentMatch = percentageBasedSizeRegex.exec(width);
      return parseFloat(percentMatch[1]);
    } else {
      var fallbackWidth = $_a7blqultjd24rkem.get(element);
      var intWidth = parseInt(fallbackWidth, 10);
      return normalizePercentageWidth(intWidth, tableSize);
    }
  };
  var getPercentageWidth = function (cell, tableSize) {
    var width = getRawWidth(cell);
    return width.fold(function () {
      var width = $_a7blqultjd24rkem.get(cell);
      var intWidth = parseInt(width, 10);
      return normalizePercentageWidth(intWidth, tableSize);
    }, function (width) {
      return choosePercentageSize(cell, width, tableSize);
    });
  };
  var normalizePixelWidth = function (cellWidth, tableSize) {
    return cellWidth / 100 * tableSize.pixelWidth();
  };
  var choosePixelSize = function (element, width, tableSize) {
    if (pixelBasedSizeRegex.test(width)) {
      var pixelMatch = pixelBasedSizeRegex.exec(width);
      return parseInt(pixelMatch[1], 10);
    } else if (percentageBasedSizeRegex.test(width)) {
      var percentMatch = percentageBasedSizeRegex.exec(width);
      var floatWidth = parseFloat(percentMatch[1]);
      return normalizePixelWidth(floatWidth, tableSize);
    } else {
      var fallbackWidth = $_a7blqultjd24rkem.get(element);
      return parseInt(fallbackWidth, 10);
    }
  };
  var getPixelWidth = function (cell, tableSize) {
    var width = getRawWidth(cell);
    return width.fold(function () {
      var width = $_a7blqultjd24rkem.get(cell);
      var intWidth = parseInt(width, 10);
      return intWidth;
    }, function (width) {
      return choosePixelSize(cell, width, tableSize);
    });
  };
  var getHeight$1 = function (cell) {
    return get$6(cell, 'rowspan', getTotalHeight);
  };
  var getGenericWidth = function (cell) {
    var width = getRawWidth(cell);
    return width.bind(function (width) {
      if (genericSizeRegex.test(width)) {
        var match = genericSizeRegex.exec(width);
        return $_geu5gjhjd24rk5m.some({
          width: $_brb4k3jijd24rk5p.constant(match[1]),
          unit: $_brb4k3jijd24rk5p.constant(match[3])
        });
      } else {
        return $_geu5gjhjd24rk5m.none();
      }
    });
  };
  var setGenericWidth = function (cell, amount, unit) {
    $_ftduaokpjd24rk9i.set(cell, 'width', amount + unit);
  };
  var $_2r7bu7lpjd24rke2 = {
    percentageBasedSizeRegex: $_brb4k3jijd24rk5p.constant(percentageBasedSizeRegex),
    pixelBasedSizeRegex: $_brb4k3jijd24rk5p.constant(pixelBasedSizeRegex),
    setPixelWidth: setPixelWidth,
    setPercentageWidth: setPercentageWidth,
    setHeight: setHeight,
    getPixelWidth: getPixelWidth,
    getPercentageWidth: getPercentageWidth,
    getGenericWidth: getGenericWidth,
    setGenericWidth: setGenericWidth,
    getHeight: getHeight$1,
    getRawWidth: getRawWidth
  };

  var halve = function (main, other) {
    var width = $_2r7bu7lpjd24rke2.getGenericWidth(main);
    width.each(function (width) {
      var newWidth = width.width() / 2;
      $_2r7bu7lpjd24rke2.setGenericWidth(main, newWidth, width.unit());
      $_2r7bu7lpjd24rke2.setGenericWidth(other, newWidth, width.unit());
    });
  };
  var $_48y4rplojd24rkdx = { halve: halve };

  var attached = function (element, scope) {
    var doc = scope || $_6zx9pgjvjd24rk77.fromDom(document.documentElement);
    return $_dnxapkkmjd24rk8z.ancestor(element, $_brb4k3jijd24rk5p.curry($_c6tuisjzjd24rk7o.eq, doc)).isSome();
  };
  var windowOf = function (element) {
    var dom = element.dom();
    if (dom === dom.window)
      return element;
    return $_sc7pgkhjd24rk8q.isDocument(element) ? dom.defaultView || dom.parentWindow : null;
  };
  var $_gbbm8blyjd24rkey = {
    attached: attached,
    windowOf: windowOf
  };

  var r = function (left, top) {
    var translate = function (x, y) {
      return r(left + x, top + y);
    };
    return {
      left: $_brb4k3jijd24rk5p.constant(left),
      top: $_brb4k3jijd24rk5p.constant(top),
      translate: translate
    };
  };

  var boxPosition = function (dom) {
    var box = dom.getBoundingClientRect();
    return r(box.left, box.top);
  };
  var firstDefinedOrZero = function (a, b) {
    return a !== undefined ? a : b !== undefined ? b : 0;
  };
  var absolute = function (element) {
    var doc = element.dom().ownerDocument;
    var body = doc.body;
    var win = $_gbbm8blyjd24rkey.windowOf($_6zx9pgjvjd24rk77.fromDom(doc));
    var html = doc.documentElement;
    var scrollTop = firstDefinedOrZero(win.pageYOffset, html.scrollTop);
    var scrollLeft = firstDefinedOrZero(win.pageXOffset, html.scrollLeft);
    var clientTop = firstDefinedOrZero(html.clientTop, body.clientTop);
    var clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft);
    return viewport(element).translate(scrollLeft - clientLeft, scrollTop - clientTop);
  };
  var relative = function (element) {
    var dom = element.dom();
    return r(dom.offsetLeft, dom.offsetTop);
  };
  var viewport = function (element) {
    var dom = element.dom();
    var doc = dom.ownerDocument;
    var body = doc.body;
    var html = $_6zx9pgjvjd24rk77.fromDom(doc.documentElement);
    if (body === dom)
      return r(body.offsetLeft, body.offsetTop);
    if (!$_gbbm8blyjd24rkey.attached(element, html))
      return r(0, 0);
    return boxPosition(dom);
  };
  var $_3k046olxjd24rkew = {
    absolute: absolute,
    relative: relative,
    viewport: viewport
  };

  var rowInfo = $_7p1bnnjljd24rk6a.immutable('row', 'y');
  var colInfo = $_7p1bnnjljd24rk6a.immutable('col', 'x');
  var rtlEdge = function (cell) {
    var pos = $_3k046olxjd24rkew.absolute(cell);
    return pos.left() + $_a7blqultjd24rkem.getOuter(cell);
  };
  var ltrEdge = function (cell) {
    return $_3k046olxjd24rkew.absolute(cell).left();
  };
  var getLeftEdge = function (index, cell) {
    return colInfo(index, ltrEdge(cell));
  };
  var getRightEdge = function (index, cell) {
    return colInfo(index, rtlEdge(cell));
  };
  var getTop = function (cell) {
    return $_3k046olxjd24rkew.absolute(cell).top();
  };
  var getTopEdge = function (index, cell) {
    return rowInfo(index, getTop(cell));
  };
  var getBottomEdge = function (index, cell) {
    return rowInfo(index, getTop(cell) + $_54nv5jlrjd24rkeg.getOuter(cell));
  };
  var findPositions = function (getInnerEdge, getOuterEdge, array) {
    if (array.length === 0)
      return [];
    var lines = $_821r2ajgjd24rk5h.map(array.slice(1), function (cellOption, index) {
      return cellOption.map(function (cell) {
        return getInnerEdge(index, cell);
      });
    });
    var lastLine = array[array.length - 1].map(function (cell) {
      return getOuterEdge(array.length - 1, cell);
    });
    return lines.concat([lastLine]);
  };
  var negate = function (step, _table) {
    return -step;
  };
  var height = {
    delta: $_brb4k3jijd24rk5p.identity,
    positions: $_brb4k3jijd24rk5p.curry(findPositions, getTopEdge, getBottomEdge),
    edge: getTop
  };
  var ltr = {
    delta: $_brb4k3jijd24rk5p.identity,
    edge: ltrEdge,
    positions: $_brb4k3jijd24rk5p.curry(findPositions, getLeftEdge, getRightEdge)
  };
  var rtl = {
    delta: negate,
    edge: rtlEdge,
    positions: $_brb4k3jijd24rk5p.curry(findPositions, getRightEdge, getLeftEdge)
  };
  var $_9tp6ulwjd24rkeq = {
    height: height,
    rtl: rtl,
    ltr: ltr
  };

  var $_bnamd9lvjd24rkep = {
    ltr: $_9tp6ulwjd24rkeq.ltr,
    rtl: $_9tp6ulwjd24rkeq.rtl
  };

  function TableDirection (directionAt) {
    var auto = function (table) {
      return directionAt(table).isRtl() ? $_bnamd9lvjd24rkep.rtl : $_bnamd9lvjd24rkep.ltr;
    };
    var delta = function (amount, table) {
      return auto(table).delta(amount, table);
    };
    var positions = function (cols, table) {
      return auto(table).positions(cols, table);
    };
    var edge = function (cell) {
      return auto(cell).edge(cell);
    };
    return {
      delta: delta,
      edge: edge,
      positions: positions
    };
  }

  var getGridSize = function (table) {
    var input = $_d16wdjjqjd24rk6i.fromTable(table);
    var warehouse = $_4xhnwmkojd24rk9d.generate(input);
    return warehouse.grid();
  };
  var $_e8b05vm0jd24rkf2 = { getGridSize: getGridSize };

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

  var base = function (handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: $_g4fo8ljpjd24rk6g.isFunction,
      label: 'function'
    });
  };
  var baseWith = function (handleUnsupported, required, pred) {
    if (required.length === 0)
      throw new Error('You must specify at least one required field.');
    $_fkrimsjojd24rk6f.validateStrArr('required', required);
    $_fkrimsjojd24rk6f.checkDupes(required);
    return function (obj) {
      var keys = $_vpx6ajkjd24rk68.keys(obj);
      var allReqd = $_821r2ajgjd24rk5h.forall(required, function (req) {
        return $_821r2ajgjd24rk5h.contains(keys, req);
      });
      if (!allReqd)
        $_fkrimsjojd24rk6f.reqMessage(required, keys);
      handleUnsupported(required, keys);
      var invalidKeys = $_821r2ajgjd24rk5h.filter(required, function (key) {
        return !pred.validate(obj[key], key);
      });
      if (invalidKeys.length > 0)
        $_fkrimsjojd24rk6f.invalidTypeMessage(invalidKeys, pred.label);
      return obj;
    };
  };
  var handleExact = function (required, keys) {
    var unsupported = $_821r2ajgjd24rk5h.filter(keys, function (key) {
      return !$_821r2ajgjd24rk5h.contains(required, key);
    });
    if (unsupported.length > 0)
      $_fkrimsjojd24rk6f.unsuppMessage(unsupported);
  };
  var allowExtra = $_brb4k3jijd24rk5p.noop;
  var $_7tn8m0m4jd24rkft = {
    exactly: $_brb4k3jijd24rk5p.curry(base, handleExact),
    ensure: $_brb4k3jijd24rk5p.curry(base, allowExtra),
    ensureWith: $_brb4k3jijd24rk5p.curry(baseWith, allowExtra)
  };

  var elementToData = function (element) {
    var colspan = $_4ni5ekkgjd24rk8l.has(element, 'colspan') ? parseInt($_4ni5ekkgjd24rk8l.get(element, 'colspan'), 10) : 1;
    var rowspan = $_4ni5ekkgjd24rk8l.has(element, 'rowspan') ? parseInt($_4ni5ekkgjd24rk8l.get(element, 'rowspan'), 10) : 1;
    return {
      element: $_brb4k3jijd24rk5p.constant(element),
      colspan: $_brb4k3jijd24rk5p.constant(colspan),
      rowspan: $_brb4k3jijd24rk5p.constant(rowspan)
    };
  };
  var modification = function (generators, _toData) {
    contract(generators);
    var position = Cell($_geu5gjhjd24rk5m.none());
    var toData = _toData !== undefined ? _toData : elementToData;
    var nu = function (data) {
      return generators.cell(data);
    };
    var nuFrom = function (element) {
      var data = toData(element);
      return nu(data);
    };
    var add = function (element) {
      var replacement = nuFrom(element);
      if (position.get().isNone())
        position.set($_geu5gjhjd24rk5m.some(replacement));
      recent = $_geu5gjhjd24rk5m.some({
        item: element,
        replacement: replacement
      });
      return replacement;
    };
    var recent = $_geu5gjhjd24rk5m.none();
    var getOrInit = function (element, comparator) {
      return recent.fold(function () {
        return add(element);
      }, function (p) {
        return comparator(element, p.item) ? p.replacement : add(element);
      });
    };
    return {
      getOrInit: getOrInit,
      cursor: position.get
    };
  };
  var transform = function (scope, tag) {
    return function (generators) {
      var position = Cell($_geu5gjhjd24rk5m.none());
      contract(generators);
      var list = [];
      var find = function (element, comparator) {
        return $_821r2ajgjd24rk5h.find(list, function (x) {
          return comparator(x.item, element);
        });
      };
      var makeNew = function (element) {
        var cell = generators.replace(element, tag, { scope: scope });
        list.push({
          item: element,
          sub: cell
        });
        if (position.get().isNone())
          position.set($_geu5gjhjd24rk5m.some(cell));
        return cell;
      };
      var replaceOrInit = function (element, comparator) {
        return find(element, comparator).fold(function () {
          return makeNew(element);
        }, function (p) {
          return comparator(element, p.item) ? p.sub : makeNew(element);
        });
      };
      return {
        replaceOrInit: replaceOrInit,
        cursor: position.get
      };
    };
  };
  var merging = function (generators) {
    contract(generators);
    var position = Cell($_geu5gjhjd24rk5m.none());
    var combine = function (cell) {
      if (position.get().isNone())
        position.set($_geu5gjhjd24rk5m.some(cell));
      return function () {
        var raw = generators.cell({
          element: $_brb4k3jijd24rk5p.constant(cell),
          colspan: $_brb4k3jijd24rk5p.constant(1),
          rowspan: $_brb4k3jijd24rk5p.constant(1)
        });
        $_ftduaokpjd24rk9i.remove(raw, 'width');
        $_ftduaokpjd24rk9i.remove(cell, 'width');
        return raw;
      };
    };
    return {
      combine: combine,
      cursor: position.get
    };
  };
  var contract = $_7tn8m0m4jd24rkft.exactly([
    'cell',
    'row',
    'replace',
    'gap'
  ]);
  var $_97pcrxm2jd24rkfj = {
    modification: modification,
    transform: transform,
    merging: merging
  };

  var blockList = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'table',
    'thead',
    'tfoot',
    'tbody',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ];
  var isList = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_821r2ajgjd24rk5h.contains([
      'ol',
      'ul'
    ], tagName);
  };
  var isBlock = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_821r2ajgjd24rk5h.contains(blockList, tagName);
  };
  var isFormatting = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_821r2ajgjd24rk5h.contains([
      'address',
      'pre',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ], tagName);
  };
  var isHeading = function (universe, item) {
    var tagName = universe.property().name(item);
    return $_821r2ajgjd24rk5h.contains([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ], tagName);
  };
  var isContainer = function (universe, item) {
    return $_821r2ajgjd24rk5h.contains([
      'div',
      'li',
      'td',
      'th',
      'blockquote',
      'body',
      'caption'
    ], universe.property().name(item));
  };
  var isEmptyTag = function (universe, item) {
    return $_821r2ajgjd24rk5h.contains([
      'br',
      'img',
      'hr',
      'input'
    ], universe.property().name(item));
  };
  var isFrame = function (universe, item) {
    return universe.property().name(item) === 'iframe';
  };
  var isInline = function (universe, item) {
    return !(isBlock(universe, item) || isEmptyTag(universe, item)) && universe.property().name(item) !== 'li';
  };
  var $_aso3eqm7jd24rkg8 = {
    isBlock: isBlock,
    isList: isList,
    isFormatting: isFormatting,
    isHeading: isHeading,
    isContainer: isContainer,
    isEmptyTag: isEmptyTag,
    isFrame: isFrame,
    isInline: isInline
  };

  var universe$1 = DomUniverse();
  var isBlock$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isBlock(universe$1, element);
  };
  var isList$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isList(universe$1, element);
  };
  var isFormatting$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isFormatting(universe$1, element);
  };
  var isHeading$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isHeading(universe$1, element);
  };
  var isContainer$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isContainer(universe$1, element);
  };
  var isEmptyTag$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isEmptyTag(universe$1, element);
  };
  var isFrame$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isFrame(universe$1, element);
  };
  var isInline$1 = function (element) {
    return $_aso3eqm7jd24rkg8.isInline(universe$1, element);
  };
  var $_g9xax0m6jd24rkg6 = {
    isBlock: isBlock$1,
    isList: isList$1,
    isFormatting: isFormatting$1,
    isHeading: isHeading$1,
    isContainer: isContainer$1,
    isEmptyTag: isEmptyTag$1,
    isFrame: isFrame$1,
    isInline: isInline$1
  };

  var merge = function (cells) {
    var isBr = function (el) {
      return $_sc7pgkhjd24rk8q.name(el) === 'br';
    };
    var advancedBr = function (children) {
      return $_821r2ajgjd24rk5h.forall(children, function (c) {
        return isBr(c) || $_sc7pgkhjd24rk8q.isText(c) && $_864owvkyjd24rkai.get(c).trim().length === 0;
      });
    };
    var isListItem = function (el) {
      return $_sc7pgkhjd24rk8q.name(el) === 'li' || $_dnxapkkmjd24rk8z.ancestor(el, $_g9xax0m6jd24rkg6.isList).isSome();
    };
    var siblingIsBlock = function (el) {
      return $_8rtodrjxjd24rk7b.nextSibling(el).map(function (rightSibling) {
        if ($_g9xax0m6jd24rkg6.isBlock(rightSibling))
          return true;
        if ($_g9xax0m6jd24rkg6.isEmptyTag(rightSibling)) {
          return $_sc7pgkhjd24rk8q.name(rightSibling) === 'img' ? false : true;
        }
      }).getOr(false);
    };
    var markCell = function (cell) {
      return $_59jad4kwjd24rkad.last(cell).bind(function (rightEdge) {
        var rightSiblingIsBlock = siblingIsBlock(rightEdge);
        return $_8rtodrjxjd24rk7b.parent(rightEdge).map(function (parent) {
          return rightSiblingIsBlock === true || isListItem(parent) || isBr(rightEdge) || $_g9xax0m6jd24rkg6.isBlock(parent) && !$_c6tuisjzjd24rk7o.eq(cell, parent) ? [] : [$_6zx9pgjvjd24rk77.fromTag('br')];
        });
      }).getOr([]);
    };
    var markContent = function () {
      var content = $_821r2ajgjd24rk5h.bind(cells, function (cell) {
        var children = $_8rtodrjxjd24rk7b.children(cell);
        return advancedBr(children) ? [] : children.concat(markCell(cell));
      });
      return content.length === 0 ? [$_6zx9pgjvjd24rk77.fromTag('br')] : content;
    };
    var contents = markContent();
    $_6k630dksjd24rk9s.empty(cells[0]);
    $_vgziuktjd24rk9v.append(cells[0], contents);
  };
  var $_dp3njam5jd24rkfw = { merge: merge };

  var shallow$1 = function (old, nu) {
    return nu;
  };
  var deep$1 = function (old, nu) {
    var bothObjects = $_g4fo8ljpjd24rk6g.isObject(old) && $_g4fo8ljpjd24rk6g.isObject(nu);
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
  var deepMerge = baseMerge(deep$1);
  var merge$1 = baseMerge(shallow$1);
  var $_7rq5b3m9jd24rkgm = {
    deepMerge: deepMerge,
    merge: merge$1
  };

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
    return $_geu5gjhjd24rk5m.none();
  };
  var liftN = function (arr, f) {
    var r = [];
    for (var i = 0; i < arr.length; i++) {
      var x = arr[i];
      if (x.isSome()) {
        r.push(x.getOrDie());
      } else {
        return $_geu5gjhjd24rk5m.none();
      }
    }
    return $_geu5gjhjd24rk5m.some(f.apply(null, r));
  };
  var $_eci14jmajd24rkgo = {
    cat: cat,
    findMap: findMap,
    liftN: liftN
  };

  var addCell = function (gridRow, index, cell) {
    var cells = gridRow.cells();
    var before = cells.slice(0, index);
    var after = cells.slice(index);
    var newCells = before.concat([cell]).concat(after);
    return setCells(gridRow, newCells);
  };
  var mutateCell = function (gridRow, index, cell) {
    var cells = gridRow.cells();
    cells[index] = cell;
  };
  var setCells = function (gridRow, cells) {
    return $_4vfg3njrjd24rk6n.rowcells(cells, gridRow.section());
  };
  var mapCells = function (gridRow, f) {
    var cells = gridRow.cells();
    var r = $_821r2ajgjd24rk5h.map(cells, f);
    return $_4vfg3njrjd24rk6n.rowcells(r, gridRow.section());
  };
  var getCell = function (gridRow, index) {
    return gridRow.cells()[index];
  };
  var getCellElement = function (gridRow, index) {
    return getCell(gridRow, index).element();
  };
  var cellLength = function (gridRow) {
    return gridRow.cells().length;
  };
  var $_azl8jsmdjd24rkgw = {
    addCell: addCell,
    setCells: setCells,
    mutateCell: mutateCell,
    getCell: getCell,
    getCellElement: getCellElement,
    mapCells: mapCells,
    cellLength: cellLength
  };

  var getColumn = function (grid, index) {
    return $_821r2ajgjd24rk5h.map(grid, function (row) {
      return $_azl8jsmdjd24rkgw.getCell(row, index);
    });
  };
  var getRow = function (grid, index) {
    return grid[index];
  };
  var findDiff = function (xs, comp) {
    if (xs.length === 0)
      return 0;
    var first = xs[0];
    var index = $_821r2ajgjd24rk5h.findIndex(xs, function (x) {
      return !comp(first.element(), x.element());
    });
    return index.fold(function () {
      return xs.length;
    }, function (ind) {
      return ind;
    });
  };
  var subgrid = function (grid, row, column, comparator) {
    var restOfRow = getRow(grid, row).cells().slice(column);
    var endColIndex = findDiff(restOfRow, comparator);
    var restOfColumn = getColumn(grid, column).slice(row);
    var endRowIndex = findDiff(restOfColumn, comparator);
    return {
      colspan: $_brb4k3jijd24rk5p.constant(endColIndex),
      rowspan: $_brb4k3jijd24rk5p.constant(endRowIndex)
    };
  };
  var $_ddtfw8mcjd24rkgt = { subgrid: subgrid };

  var toDetails = function (grid, comparator) {
    var seen = $_821r2ajgjd24rk5h.map(grid, function (row, ri) {
      return $_821r2ajgjd24rk5h.map(row.cells(), function (col, ci) {
        return false;
      });
    });
    var updateSeen = function (ri, ci, rowspan, colspan) {
      for (var r = ri; r < ri + rowspan; r++) {
        for (var c = ci; c < ci + colspan; c++) {
          seen[r][c] = true;
        }
      }
    };
    return $_821r2ajgjd24rk5h.map(grid, function (row, ri) {
      var details = $_821r2ajgjd24rk5h.bind(row.cells(), function (cell, ci) {
        if (seen[ri][ci] === false) {
          var result = $_ddtfw8mcjd24rkgt.subgrid(grid, ri, ci, comparator);
          updateSeen(ri, ci, result.rowspan(), result.colspan());
          return [$_4vfg3njrjd24rk6n.detailnew(cell.element(), result.rowspan(), result.colspan(), cell.isNew())];
        } else {
          return [];
        }
      });
      return $_4vfg3njrjd24rk6n.rowdetails(details, row.section());
    });
  };
  var toGrid = function (warehouse, generators, isNew) {
    var grid = [];
    for (var i = 0; i < warehouse.grid().rows(); i++) {
      var rowCells = [];
      for (var j = 0; j < warehouse.grid().columns(); j++) {
        var element = $_4xhnwmkojd24rk9d.getAt(warehouse, i, j).map(function (item) {
          return $_4vfg3njrjd24rk6n.elementnew(item.element(), isNew);
        }).getOrThunk(function () {
          return $_4vfg3njrjd24rk6n.elementnew(generators.gap(), true);
        });
        rowCells.push(element);
      }
      var row = $_4vfg3njrjd24rk6n.rowcells(rowCells, warehouse.all()[i].section());
      grid.push(row);
    }
    return grid;
  };
  var $_6ox826mbjd24rkgq = {
    toDetails: toDetails,
    toGrid: toGrid
  };

  var setIfNot = function (element, property, value, ignore) {
    if (value === ignore)
      $_4ni5ekkgjd24rk8l.remove(element, property);
    else
      $_4ni5ekkgjd24rk8l.set(element, property, value);
  };
  var render$1 = function (table, grid) {
    var newRows = [];
    var newCells = [];
    var renderSection = function (gridSection, sectionName) {
      var section = $_e7vzfkljd24rk8y.child(table, sectionName).getOrThunk(function () {
        var tb = $_6zx9pgjvjd24rk77.fromTag(sectionName, $_8rtodrjxjd24rk7b.owner(table).dom());
        $_97r5mekrjd24rk9r.append(table, tb);
        return tb;
      });
      $_6k630dksjd24rk9s.empty(section);
      var rows = $_821r2ajgjd24rk5h.map(gridSection, function (row) {
        if (row.isNew()) {
          newRows.push(row.element());
        }
        var tr = row.element();
        $_6k630dksjd24rk9s.empty(tr);
        $_821r2ajgjd24rk5h.each(row.cells(), function (cell) {
          if (cell.isNew()) {
            newCells.push(cell.element());
          }
          setIfNot(cell.element(), 'colspan', cell.colspan(), 1);
          setIfNot(cell.element(), 'rowspan', cell.rowspan(), 1);
          $_97r5mekrjd24rk9r.append(tr, cell.element());
        });
        return tr;
      });
      $_vgziuktjd24rk9v.append(section, rows);
    };
    var removeSection = function (sectionName) {
      $_e7vzfkljd24rk8y.child(table, sectionName).bind($_6k630dksjd24rk9s.remove);
    };
    var renderOrRemoveSection = function (gridSection, sectionName) {
      if (gridSection.length > 0) {
        renderSection(gridSection, sectionName);
      } else {
        removeSection(sectionName);
      }
    };
    var headSection = [];
    var bodySection = [];
    var footSection = [];
    $_821r2ajgjd24rk5h.each(grid, function (row) {
      switch (row.section()) {
      case 'thead':
        headSection.push(row);
        break;
      case 'tbody':
        bodySection.push(row);
        break;
      case 'tfoot':
        footSection.push(row);
        break;
      }
    });
    renderOrRemoveSection(headSection, 'thead');
    renderOrRemoveSection(bodySection, 'tbody');
    renderOrRemoveSection(footSection, 'tfoot');
    return {
      newRows: $_brb4k3jijd24rk5p.constant(newRows),
      newCells: $_brb4k3jijd24rk5p.constant(newCells)
    };
  };
  var copy$2 = function (grid) {
    var rows = $_821r2ajgjd24rk5h.map(grid, function (row) {
      var tr = $_3mqh4mkvjd24rkaa.shallow(row.element());
      $_821r2ajgjd24rk5h.each(row.cells(), function (cell) {
        var clonedCell = $_3mqh4mkvjd24rkaa.deep(cell.element());
        setIfNot(clonedCell, 'colspan', cell.colspan(), 1);
        setIfNot(clonedCell, 'rowspan', cell.rowspan(), 1);
        $_97r5mekrjd24rk9r.append(tr, clonedCell);
      });
      return tr;
    });
    return rows;
  };
  var $_ajrwq4mejd24rkh4 = {
    render: render$1,
    copy: copy$2
  };

  var repeat = function (repititions, f) {
    var r = [];
    for (var i = 0; i < repititions; i++) {
      r.push(f(i));
    }
    return r;
  };
  var range$1 = function (start, end) {
    var r = [];
    for (var i = start; i < end; i++) {
      r.push(i);
    }
    return r;
  };
  var unique = function (xs, comparator) {
    var result = [];
    $_821r2ajgjd24rk5h.each(xs, function (x, i) {
      if (i < xs.length - 1 && !comparator(x, xs[i + 1])) {
        result.push(x);
      } else if (i === xs.length - 1) {
        result.push(x);
      }
    });
    return result;
  };
  var deduce = function (xs, index) {
    if (index < 0 || index >= xs.length - 1)
      return $_geu5gjhjd24rk5m.none();
    var current = xs[index].fold(function () {
      var rest = $_821r2ajgjd24rk5h.reverse(xs.slice(0, index));
      return $_eci14jmajd24rkgo.findMap(rest, function (a, i) {
        return a.map(function (aa) {
          return {
            value: aa,
            delta: i + 1
          };
        });
      });
    }, function (c) {
      return $_geu5gjhjd24rk5m.some({
        value: c,
        delta: 0
      });
    });
    var next = xs[index + 1].fold(function () {
      var rest = xs.slice(index + 1);
      return $_eci14jmajd24rkgo.findMap(rest, function (a, i) {
        return a.map(function (aa) {
          return {
            value: aa,
            delta: i + 1
          };
        });
      });
    }, function (n) {
      return $_geu5gjhjd24rk5m.some({
        value: n,
        delta: 1
      });
    });
    return current.bind(function (c) {
      return next.map(function (n) {
        var extras = n.delta + c.delta;
        return Math.abs(n.value - c.value) / extras;
      });
    });
  };
  var $_1zj6etmhjd24rkhu = {
    repeat: repeat,
    range: range$1,
    unique: unique,
    deduce: deduce
  };

  var columns = function (warehouse) {
    var grid = warehouse.grid();
    var cols = $_1zj6etmhjd24rkhu.range(0, grid.columns());
    var rows = $_1zj6etmhjd24rkhu.range(0, grid.rows());
    return $_821r2ajgjd24rk5h.map(cols, function (col) {
      var getBlock = function () {
        return $_821r2ajgjd24rk5h.bind(rows, function (r) {
          return $_4xhnwmkojd24rk9d.getAt(warehouse, r, col).filter(function (detail) {
            return detail.column() === col;
          }).fold($_brb4k3jijd24rk5p.constant([]), function (detail) {
            return [detail];
          });
        });
      };
      var isSingle = function (detail) {
        return detail.colspan() === 1;
      };
      var getFallback = function () {
        return $_4xhnwmkojd24rk9d.getAt(warehouse, 0, col);
      };
      return decide(getBlock, isSingle, getFallback);
    });
  };
  var decide = function (getBlock, isSingle, getFallback) {
    var inBlock = getBlock();
    var singleInBlock = $_821r2ajgjd24rk5h.find(inBlock, isSingle);
    var detailOption = singleInBlock.orThunk(function () {
      return $_geu5gjhjd24rk5m.from(inBlock[0]).orThunk(getFallback);
    });
    return detailOption.map(function (detail) {
      return detail.element();
    });
  };
  var rows$1 = function (warehouse) {
    var grid = warehouse.grid();
    var rows = $_1zj6etmhjd24rkhu.range(0, grid.rows());
    var cols = $_1zj6etmhjd24rkhu.range(0, grid.columns());
    return $_821r2ajgjd24rk5h.map(rows, function (row) {
      var getBlock = function () {
        return $_821r2ajgjd24rk5h.bind(cols, function (c) {
          return $_4xhnwmkojd24rk9d.getAt(warehouse, row, c).filter(function (detail) {
            return detail.row() === row;
          }).fold($_brb4k3jijd24rk5p.constant([]), function (detail) {
            return [detail];
          });
        });
      };
      var isSingle = function (detail) {
        return detail.rowspan() === 1;
      };
      var getFallback = function () {
        return $_4xhnwmkojd24rk9d.getAt(warehouse, row, 0);
      };
      return decide(getBlock, isSingle, getFallback);
    });
  };
  var $_c2dyjvmgjd24rkhp = {
    columns: columns,
    rows: rows$1
  };

  var col = function (column, x, y, w, h) {
    var blocker = $_6zx9pgjvjd24rk77.fromTag('div');
    $_ftduaokpjd24rk9i.setAll(blocker, {
      position: 'absolute',
      left: x - w / 2 + 'px',
      top: y + 'px',
      height: h + 'px',
      width: w + 'px'
    });
    $_4ni5ekkgjd24rk8l.setAll(blocker, {
      'data-column': column,
      'role': 'presentation'
    });
    return blocker;
  };
  var row$1 = function (row, x, y, w, h) {
    var blocker = $_6zx9pgjvjd24rk77.fromTag('div');
    $_ftduaokpjd24rk9i.setAll(blocker, {
      position: 'absolute',
      left: x + 'px',
      top: y - h / 2 + 'px',
      height: h + 'px',
      width: w + 'px'
    });
    $_4ni5ekkgjd24rk8l.setAll(blocker, {
      'data-row': row,
      'role': 'presentation'
    });
    return blocker;
  };
  var $_bs5t9wmijd24rkhz = {
    col: col,
    row: row$1
  };

  var css = function (namespace) {
    var dashNamespace = namespace.replace(/\./g, '-');
    var resolve = function (str) {
      return dashNamespace + '-' + str;
    };
    return { resolve: resolve };
  };
  var $_dcqifmmkjd24rki5 = { css: css };

  var styles = $_dcqifmmkjd24rki5.css('ephox-snooker');
  var $_bop07zmjjd24rki3 = { resolve: styles.resolve };

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

  var read = function (element, attr) {
    var value = $_4ni5ekkgjd24rk8l.get(element, attr);
    return value === undefined || value === '' ? [] : value.split(' ');
  };
  var add = function (element, attr, id) {
    var old = read(element, attr);
    var nu = old.concat([id]);
    $_4ni5ekkgjd24rk8l.set(element, attr, nu.join(' '));
  };
  var remove$3 = function (element, attr, id) {
    var nu = $_821r2ajgjd24rk5h.filter(read(element, attr), function (v) {
      return v !== id;
    });
    if (nu.length > 0)
      $_4ni5ekkgjd24rk8l.set(element, attr, nu.join(' '));
    else
      $_4ni5ekkgjd24rk8l.remove(element, attr);
  };
  var $_4nq8admojd24rkib = {
    read: read,
    add: add,
    remove: remove$3
  };

  var supports = function (element) {
    return element.dom().classList !== undefined;
  };
  var get$7 = function (element) {
    return $_4nq8admojd24rkib.read(element, 'class');
  };
  var add$1 = function (element, clazz) {
    return $_4nq8admojd24rkib.add(element, 'class', clazz);
  };
  var remove$4 = function (element, clazz) {
    return $_4nq8admojd24rkib.remove(element, 'class', clazz);
  };
  var toggle = function (element, clazz) {
    if ($_821r2ajgjd24rk5h.contains(get$7(element), clazz)) {
      remove$4(element, clazz);
    } else {
      add$1(element, clazz);
    }
  };
  var $_5pv04amnjd24rki9 = {
    get: get$7,
    add: add$1,
    remove: remove$4,
    toggle: toggle,
    supports: supports
  };

  var add$2 = function (element, clazz) {
    if ($_5pv04amnjd24rki9.supports(element))
      element.dom().classList.add(clazz);
    else
      $_5pv04amnjd24rki9.add(element, clazz);
  };
  var cleanClass = function (element) {
    var classList = $_5pv04amnjd24rki9.supports(element) ? element.dom().classList : $_5pv04amnjd24rki9.get(element);
    if (classList.length === 0) {
      $_4ni5ekkgjd24rk8l.remove(element, 'class');
    }
  };
  var remove$5 = function (element, clazz) {
    if ($_5pv04amnjd24rki9.supports(element)) {
      var classList = element.dom().classList;
      classList.remove(clazz);
    } else
      $_5pv04amnjd24rki9.remove(element, clazz);
    cleanClass(element);
  };
  var toggle$1 = function (element, clazz) {
    return $_5pv04amnjd24rki9.supports(element) ? element.dom().classList.toggle(clazz) : $_5pv04amnjd24rki9.toggle(element, clazz);
  };
  var toggler = function (element, clazz) {
    var hasClasslist = $_5pv04amnjd24rki9.supports(element);
    var classList = element.dom().classList;
    var off = function () {
      if (hasClasslist)
        classList.remove(clazz);
      else
        $_5pv04amnjd24rki9.remove(element, clazz);
    };
    var on = function () {
      if (hasClasslist)
        classList.add(clazz);
      else
        $_5pv04amnjd24rki9.add(element, clazz);
    };
    return Toggler(off, on, has$1(element, clazz));
  };
  var has$1 = function (element, clazz) {
    return $_5pv04amnjd24rki9.supports(element) && element.dom().classList.contains(clazz);
  };
  var $_17vk2qmljd24rki6 = {
    add: add$2,
    remove: remove$5,
    toggle: toggle$1,
    toggler: toggler,
    has: has$1
  };

  var resizeBar = $_bop07zmjjd24rki3.resolve('resizer-bar');
  var resizeRowBar = $_bop07zmjjd24rki3.resolve('resizer-rows');
  var resizeColBar = $_bop07zmjjd24rki3.resolve('resizer-cols');
  var BAR_THICKNESS = 7;
  var clear = function (wire) {
    var previous = $_ec4gn6kijd24rk8r.descendants(wire.parent(), '.' + resizeBar);
    $_821r2ajgjd24rk5h.each(previous, $_6k630dksjd24rk9s.remove);
  };
  var drawBar = function (wire, positions, create) {
    var origin = wire.origin();
    $_821r2ajgjd24rk5h.each(positions, function (cpOption, i) {
      cpOption.each(function (cp) {
        var bar = create(origin, cp);
        $_17vk2qmljd24rki6.add(bar, resizeBar);
        $_97r5mekrjd24rk9r.append(wire.parent(), bar);
      });
    });
  };
  var refreshCol = function (wire, colPositions, position, tableHeight) {
    drawBar(wire, colPositions, function (origin, cp) {
      var colBar = $_bs5t9wmijd24rkhz.col(cp.col(), cp.x() - origin.left(), position.top() - origin.top(), BAR_THICKNESS, tableHeight);
      $_17vk2qmljd24rki6.add(colBar, resizeColBar);
      return colBar;
    });
  };
  var refreshRow = function (wire, rowPositions, position, tableWidth) {
    drawBar(wire, rowPositions, function (origin, cp) {
      var rowBar = $_bs5t9wmijd24rkhz.row(cp.row(), position.left() - origin.left(), cp.y() - origin.top(), tableWidth, BAR_THICKNESS);
      $_17vk2qmljd24rki6.add(rowBar, resizeRowBar);
      return rowBar;
    });
  };
  var refreshGrid = function (wire, table, rows, cols, hdirection, vdirection) {
    var position = $_3k046olxjd24rkew.absolute(table);
    var rowPositions = rows.length > 0 ? hdirection.positions(rows, table) : [];
    refreshRow(wire, rowPositions, position, $_a7blqultjd24rkem.getOuter(table));
    var colPositions = cols.length > 0 ? vdirection.positions(cols, table) : [];
    refreshCol(wire, colPositions, position, $_54nv5jlrjd24rkeg.getOuter(table));
  };
  var refresh = function (wire, table, hdirection, vdirection) {
    clear(wire);
    var list = $_d16wdjjqjd24rk6i.fromTable(table);
    var warehouse = $_4xhnwmkojd24rk9d.generate(list);
    var rows = $_c2dyjvmgjd24rkhp.rows(warehouse);
    var cols = $_c2dyjvmgjd24rkhp.columns(warehouse);
    refreshGrid(wire, table, rows, cols, hdirection, vdirection);
  };
  var each$2 = function (wire, f) {
    var bars = $_ec4gn6kijd24rk8r.descendants(wire.parent(), '.' + resizeBar);
    $_821r2ajgjd24rk5h.each(bars, f);
  };
  var hide = function (wire) {
    each$2(wire, function (bar) {
      $_ftduaokpjd24rk9i.set(bar, 'display', 'none');
    });
  };
  var show = function (wire) {
    each$2(wire, function (bar) {
      $_ftduaokpjd24rk9i.set(bar, 'display', 'block');
    });
  };
  var isRowBar = function (element) {
    return $_17vk2qmljd24rki6.has(element, resizeRowBar);
  };
  var isColBar = function (element) {
    return $_17vk2qmljd24rki6.has(element, resizeColBar);
  };
  var $_cqn4oymfjd24rkhg = {
    refresh: refresh,
    hide: hide,
    show: show,
    destroy: clear,
    isRowBar: isRowBar,
    isColBar: isColBar
  };

  var fromWarehouse = function (warehouse, generators) {
    return $_6ox826mbjd24rkgq.toGrid(warehouse, generators, false);
  };
  var deriveRows = function (rendered, generators) {
    var findRow = function (details) {
      var rowOfCells = $_eci14jmajd24rkgo.findMap(details, function (detail) {
        return $_8rtodrjxjd24rk7b.parent(detail.element()).map(function (row) {
          var isNew = $_8rtodrjxjd24rk7b.parent(row).isNone();
          return $_4vfg3njrjd24rk6n.elementnew(row, isNew);
        });
      });
      return rowOfCells.getOrThunk(function () {
        return $_4vfg3njrjd24rk6n.elementnew(generators.row(), true);
      });
    };
    return $_821r2ajgjd24rk5h.map(rendered, function (details) {
      var row = findRow(details.details());
      return $_4vfg3njrjd24rk6n.rowdatanew(row.element(), details.details(), details.section(), row.isNew());
    });
  };
  var toDetailList = function (grid, generators) {
    var rendered = $_6ox826mbjd24rkgq.toDetails(grid, $_c6tuisjzjd24rk7o.eq);
    return deriveRows(rendered, generators);
  };
  var findInWarehouse = function (warehouse, element) {
    var all = $_821r2ajgjd24rk5h.flatten($_821r2ajgjd24rk5h.map(warehouse.all(), function (r) {
      return r.cells();
    }));
    return $_821r2ajgjd24rk5h.find(all, function (e) {
      return $_c6tuisjzjd24rk7o.eq(element, e.element());
    });
  };
  var run = function (operation, extract, adjustment, postAction, genWrappers) {
    return function (wire, table, target, generators, direction) {
      var input = $_d16wdjjqjd24rk6i.fromTable(table);
      var warehouse = $_4xhnwmkojd24rk9d.generate(input);
      var output = extract(warehouse, target).map(function (info) {
        var model = fromWarehouse(warehouse, generators);
        var result = operation(model, info, $_c6tuisjzjd24rk7o.eq, genWrappers(generators));
        var grid = toDetailList(result.grid(), generators);
        return {
          grid: $_brb4k3jijd24rk5p.constant(grid),
          cursor: result.cursor
        };
      });
      return output.fold(function () {
        return $_geu5gjhjd24rk5m.none();
      }, function (out) {
        var newElements = $_ajrwq4mejd24rkh4.render(table, out.grid());
        adjustment(table, out.grid(), direction);
        postAction(table);
        $_cqn4oymfjd24rkhg.refresh(wire, table, $_9tp6ulwjd24rkeq.height, direction);
        return $_geu5gjhjd24rk5m.some({
          cursor: out.cursor,
          newRows: newElements.newRows,
          newCells: newElements.newCells
        });
      });
    };
  };
  var onCell = function (warehouse, target) {
    return $_60ksrkjsjd24rk6p.cell(target.element()).bind(function (cell) {
      return findInWarehouse(warehouse, cell);
    });
  };
  var onPaste = function (warehouse, target) {
    return $_60ksrkjsjd24rk6p.cell(target.element()).bind(function (cell) {
      return findInWarehouse(warehouse, cell).map(function (details) {
        return $_7rq5b3m9jd24rkgm.merge(details, {
          generators: target.generators,
          clipboard: target.clipboard
        });
      });
    });
  };
  var onPasteRows = function (warehouse, target) {
    var details = $_821r2ajgjd24rk5h.map(target.selection(), function (cell) {
      return $_60ksrkjsjd24rk6p.cell(cell).bind(function (lc) {
        return findInWarehouse(warehouse, lc);
      });
    });
    var cells = $_eci14jmajd24rkgo.cat(details);
    return cells.length > 0 ? $_geu5gjhjd24rk5m.some($_7rq5b3m9jd24rkgm.merge({ cells: cells }, {
      generators: target.generators,
      clipboard: target.clipboard
    })) : $_geu5gjhjd24rk5m.none();
  };
  var onMergable = function (warehouse, target) {
    return target.mergable();
  };
  var onUnmergable = function (warehouse, target) {
    return target.unmergable();
  };
  var onCells = function (warehouse, target) {
    var details = $_821r2ajgjd24rk5h.map(target.selection(), function (cell) {
      return $_60ksrkjsjd24rk6p.cell(cell).bind(function (lc) {
        return findInWarehouse(warehouse, lc);
      });
    });
    var cells = $_eci14jmajd24rkgo.cat(details);
    return cells.length > 0 ? $_geu5gjhjd24rk5m.some(cells) : $_geu5gjhjd24rk5m.none();
  };
  var $_qjw38m8jd24rkgd = {
    run: run,
    toDetailList: toDetailList,
    onCell: onCell,
    onCells: onCells,
    onPaste: onPaste,
    onPasteRows: onPasteRows,
    onMergable: onMergable,
    onUnmergable: onUnmergable
  };

  var value$1 = function (o) {
    var is = function (v) {
      return o === v;
    };
    var or = function (opt) {
      return value$1(o);
    };
    var orThunk = function (f) {
      return value$1(o);
    };
    var map = function (f) {
      return value$1(f(o));
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
      return $_geu5gjhjd24rk5m.some(o);
    };
    return {
      is: is,
      isValue: $_brb4k3jijd24rk5p.constant(true),
      isError: $_brb4k3jijd24rk5p.constant(false),
      getOr: $_brb4k3jijd24rk5p.constant(o),
      getOrThunk: $_brb4k3jijd24rk5p.constant(o),
      getOrDie: $_brb4k3jijd24rk5p.constant(o),
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
      return $_brb4k3jijd24rk5p.die(message)();
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
      is: $_brb4k3jijd24rk5p.constant(false),
      isValue: $_brb4k3jijd24rk5p.constant(false),
      isError: $_brb4k3jijd24rk5p.constant(true),
      getOr: $_brb4k3jijd24rk5p.identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      each: $_brb4k3jijd24rk5p.noop,
      bind: bind,
      exists: $_brb4k3jijd24rk5p.constant(false),
      forall: $_brb4k3jijd24rk5p.constant(true),
      toOption: $_geu5gjhjd24rk5m.none
    };
  };
  var $_d8vav5mrjd24rkip = {
    value: value$1,
    error: error
  };

  var measure = function (startAddress, gridA, gridB) {
    if (startAddress.row() >= gridA.length || startAddress.column() > $_azl8jsmdjd24rkgw.cellLength(gridA[0]))
      return $_d8vav5mrjd24rkip.error('invalid start address out of table bounds, row: ' + startAddress.row() + ', column: ' + startAddress.column());
    var rowRemainder = gridA.slice(startAddress.row());
    var colRemainder = rowRemainder[0].cells().slice(startAddress.column());
    var colRequired = $_azl8jsmdjd24rkgw.cellLength(gridB[0]);
    var rowRequired = gridB.length;
    return $_d8vav5mrjd24rkip.value({
      rowDelta: $_brb4k3jijd24rk5p.constant(rowRemainder.length - rowRequired),
      colDelta: $_brb4k3jijd24rk5p.constant(colRemainder.length - colRequired)
    });
  };
  var measureWidth = function (gridA, gridB) {
    var colLengthA = $_azl8jsmdjd24rkgw.cellLength(gridA[0]);
    var colLengthB = $_azl8jsmdjd24rkgw.cellLength(gridB[0]);
    return {
      rowDelta: $_brb4k3jijd24rk5p.constant(0),
      colDelta: $_brb4k3jijd24rk5p.constant(colLengthA - colLengthB)
    };
  };
  var fill = function (cells, generator) {
    return $_821r2ajgjd24rk5h.map(cells, function () {
      return $_4vfg3njrjd24rk6n.elementnew(generator.cell(), true);
    });
  };
  var rowFill = function (grid, amount, generator) {
    return grid.concat($_1zj6etmhjd24rkhu.repeat(amount, function (_row) {
      return $_azl8jsmdjd24rkgw.setCells(grid[grid.length - 1], fill(grid[grid.length - 1].cells(), generator));
    }));
  };
  var colFill = function (grid, amount, generator) {
    return $_821r2ajgjd24rk5h.map(grid, function (row) {
      return $_azl8jsmdjd24rkgw.setCells(row, row.cells().concat(fill($_1zj6etmhjd24rkhu.range(0, amount), generator)));
    });
  };
  var tailor = function (gridA, delta, generator) {
    var fillCols = delta.colDelta() < 0 ? colFill : $_brb4k3jijd24rk5p.identity;
    var fillRows = delta.rowDelta() < 0 ? rowFill : $_brb4k3jijd24rk5p.identity;
    var modifiedCols = fillCols(gridA, Math.abs(delta.colDelta()), generator);
    var tailoredGrid = fillRows(modifiedCols, Math.abs(delta.rowDelta()), generator);
    return tailoredGrid;
  };
  var $_g854u8mqjd24rkih = {
    measure: measure,
    measureWidth: measureWidth,
    tailor: tailor
  };

  var merge$2 = function (grid, bounds, comparator, substitution) {
    if (grid.length === 0)
      return grid;
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        $_azl8jsmdjd24rkgw.mutateCell(grid[i], j, $_4vfg3njrjd24rk6n.elementnew(substitution(), false));
      }
    }
    return grid;
  };
  var unmerge = function (grid, target, comparator, substitution) {
    var first = true;
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < $_azl8jsmdjd24rkgw.cellLength(grid[0]); j++) {
        var current = $_azl8jsmdjd24rkgw.getCellElement(grid[i], j);
        var isToReplace = comparator(current, target);
        if (isToReplace === true && first === false) {
          $_azl8jsmdjd24rkgw.mutateCell(grid[i], j, $_4vfg3njrjd24rk6n.elementnew(substitution(), true));
        } else if (isToReplace === true) {
          first = false;
        }
      }
    }
    return grid;
  };
  var uniqueCells = function (row, comparator) {
    return $_821r2ajgjd24rk5h.foldl(row, function (rest, cell) {
      return $_821r2ajgjd24rk5h.exists(rest, function (currentCell) {
        return comparator(currentCell.element(), cell.element());
      }) ? rest : rest.concat([cell]);
    }, []);
  };
  var splitRows = function (grid, index, comparator, substitution) {
    if (index > 0 && index < grid.length) {
      var rowPrevCells = grid[index - 1].cells();
      var cells = uniqueCells(rowPrevCells, comparator);
      $_821r2ajgjd24rk5h.each(cells, function (cell) {
        var replacement = $_geu5gjhjd24rk5m.none();
        for (var i = index; i < grid.length; i++) {
          for (var j = 0; j < $_azl8jsmdjd24rkgw.cellLength(grid[0]); j++) {
            var current = grid[i].cells()[j];
            var isToReplace = comparator(current.element(), cell.element());
            if (isToReplace) {
              if (replacement.isNone()) {
                replacement = $_geu5gjhjd24rk5m.some(substitution());
              }
              replacement.each(function (sub) {
                $_azl8jsmdjd24rkgw.mutateCell(grid[i], j, $_4vfg3njrjd24rk6n.elementnew(sub, true));
              });
            }
          }
        }
      });
    }
    return grid;
  };
  var $_7muui5msjd24rkis = {
    merge: merge$2,
    unmerge: unmerge,
    splitRows: splitRows
  };

  var isSpanning = function (grid, row, col, comparator) {
    var candidate = $_azl8jsmdjd24rkgw.getCell(grid[row], col);
    var matching = $_brb4k3jijd24rk5p.curry(comparator, candidate.element());
    var currentRow = grid[row];
    return grid.length > 1 && $_azl8jsmdjd24rkgw.cellLength(currentRow) > 1 && (col > 0 && matching($_azl8jsmdjd24rkgw.getCellElement(currentRow, col - 1)) || col < currentRow.length - 1 && matching($_azl8jsmdjd24rkgw.getCellElement(currentRow, col + 1)) || row > 0 && matching($_azl8jsmdjd24rkgw.getCellElement(grid[row - 1], col)) || row < grid.length - 1 && matching($_azl8jsmdjd24rkgw.getCellElement(grid[row + 1], col)));
  };
  var mergeTables = function (startAddress, gridA, gridB, generator, comparator) {
    var startRow = startAddress.row();
    var startCol = startAddress.column();
    var mergeHeight = gridB.length;
    var mergeWidth = $_azl8jsmdjd24rkgw.cellLength(gridB[0]);
    var endRow = startRow + mergeHeight;
    var endCol = startCol + mergeWidth;
    for (var r = startRow; r < endRow; r++) {
      for (var c = startCol; c < endCol; c++) {
        if (isSpanning(gridA, r, c, comparator)) {
          $_7muui5msjd24rkis.unmerge(gridA, $_azl8jsmdjd24rkgw.getCellElement(gridA[r], c), comparator, generator.cell);
        }
        var newCell = $_azl8jsmdjd24rkgw.getCellElement(gridB[r - startRow], c - startCol);
        var replacement = generator.replace(newCell);
        $_azl8jsmdjd24rkgw.mutateCell(gridA[r], c, $_4vfg3njrjd24rk6n.elementnew(replacement, true));
      }
    }
    return gridA;
  };
  var merge$3 = function (startAddress, gridA, gridB, generator, comparator) {
    var result = $_g854u8mqjd24rkih.measure(startAddress, gridA, gridB);
    return result.map(function (delta) {
      var fittedGrid = $_g854u8mqjd24rkih.tailor(gridA, delta, generator);
      return mergeTables(startAddress, fittedGrid, gridB, generator, comparator);
    });
  };
  var insert$1 = function (index, gridA, gridB, generator, comparator) {
    $_7muui5msjd24rkis.splitRows(gridA, index, comparator, generator.cell);
    var delta = $_g854u8mqjd24rkih.measureWidth(gridB, gridA);
    var fittedNewGrid = $_g854u8mqjd24rkih.tailor(gridB, delta, generator);
    var secondDelta = $_g854u8mqjd24rkih.measureWidth(gridA, fittedNewGrid);
    var fittedOldGrid = $_g854u8mqjd24rkih.tailor(gridA, secondDelta, generator);
    return fittedOldGrid.slice(0, index).concat(fittedNewGrid).concat(fittedOldGrid.slice(index, fittedOldGrid.length));
  };
  var $_fzhtv7mpjd24rkie = {
    merge: merge$3,
    insert: insert$1
  };

  var insertRowAt = function (grid, index, example, comparator, substitution) {
    var before = grid.slice(0, index);
    var after = grid.slice(index);
    var between = $_azl8jsmdjd24rkgw.mapCells(grid[example], function (ex, c) {
      var withinSpan = index > 0 && index < grid.length && comparator($_azl8jsmdjd24rkgw.getCellElement(grid[index - 1], c), $_azl8jsmdjd24rkgw.getCellElement(grid[index], c));
      var ret = withinSpan ? $_azl8jsmdjd24rkgw.getCell(grid[index], c) : $_4vfg3njrjd24rk6n.elementnew(substitution(ex.element(), comparator), true);
      return ret;
    });
    return before.concat([between]).concat(after);
  };
  var insertColumnAt = function (grid, index, example, comparator, substitution) {
    return $_821r2ajgjd24rk5h.map(grid, function (row) {
      var withinSpan = index > 0 && index < $_azl8jsmdjd24rkgw.cellLength(row) && comparator($_azl8jsmdjd24rkgw.getCellElement(row, index - 1), $_azl8jsmdjd24rkgw.getCellElement(row, index));
      var sub = withinSpan ? $_azl8jsmdjd24rkgw.getCell(row, index) : $_4vfg3njrjd24rk6n.elementnew(substitution($_azl8jsmdjd24rkgw.getCellElement(row, example), comparator), true);
      return $_azl8jsmdjd24rkgw.addCell(row, index, sub);
    });
  };
  var splitCellIntoColumns = function (grid, exampleRow, exampleCol, comparator, substitution) {
    var index = exampleCol + 1;
    return $_821r2ajgjd24rk5h.map(grid, function (row, i) {
      var isTargetCell = i === exampleRow;
      var sub = isTargetCell ? $_4vfg3njrjd24rk6n.elementnew(substitution($_azl8jsmdjd24rkgw.getCellElement(row, exampleCol), comparator), true) : $_azl8jsmdjd24rkgw.getCell(row, exampleCol);
      return $_azl8jsmdjd24rkgw.addCell(row, index, sub);
    });
  };
  var splitCellIntoRows = function (grid, exampleRow, exampleCol, comparator, substitution) {
    var index = exampleRow + 1;
    var before = grid.slice(0, index);
    var after = grid.slice(index);
    var between = $_azl8jsmdjd24rkgw.mapCells(grid[exampleRow], function (ex, i) {
      var isTargetCell = i === exampleCol;
      return isTargetCell ? $_4vfg3njrjd24rk6n.elementnew(substitution(ex.element(), comparator), true) : ex;
    });
    return before.concat([between]).concat(after);
  };
  var deleteColumnsAt = function (grid, start, finish) {
    var rows = $_821r2ajgjd24rk5h.map(grid, function (row) {
      var cells = row.cells().slice(0, start).concat(row.cells().slice(finish + 1));
      return $_4vfg3njrjd24rk6n.rowcells(cells, row.section());
    });
    return $_821r2ajgjd24rk5h.filter(rows, function (row) {
      return row.cells().length > 0;
    });
  };
  var deleteRowsAt = function (grid, start, finish) {
    return grid.slice(0, start).concat(grid.slice(finish + 1));
  };
  var $_337n1dmtjd24rkiw = {
    insertRowAt: insertRowAt,
    insertColumnAt: insertColumnAt,
    splitCellIntoColumns: splitCellIntoColumns,
    splitCellIntoRows: splitCellIntoRows,
    deleteRowsAt: deleteRowsAt,
    deleteColumnsAt: deleteColumnsAt
  };

  var replaceIn = function (grid, targets, comparator, substitution) {
    var isTarget = function (cell) {
      return $_821r2ajgjd24rk5h.exists(targets, function (target) {
        return comparator(cell.element(), target.element());
      });
    };
    return $_821r2ajgjd24rk5h.map(grid, function (row) {
      return $_azl8jsmdjd24rkgw.mapCells(row, function (cell) {
        return isTarget(cell) ? $_4vfg3njrjd24rk6n.elementnew(substitution(cell.element(), comparator), true) : cell;
      });
    });
  };
  var notStartRow = function (grid, rowIndex, colIndex, comparator) {
    return $_azl8jsmdjd24rkgw.getCellElement(grid[rowIndex], colIndex) !== undefined && (rowIndex > 0 && comparator($_azl8jsmdjd24rkgw.getCellElement(grid[rowIndex - 1], colIndex), $_azl8jsmdjd24rkgw.getCellElement(grid[rowIndex], colIndex)));
  };
  var notStartColumn = function (row, index, comparator) {
    return index > 0 && comparator($_azl8jsmdjd24rkgw.getCellElement(row, index - 1), $_azl8jsmdjd24rkgw.getCellElement(row, index));
  };
  var replaceColumn = function (grid, index, comparator, substitution) {
    var targets = $_821r2ajgjd24rk5h.bind(grid, function (row, i) {
      var alreadyAdded = notStartRow(grid, i, index, comparator) || notStartColumn(row, index, comparator);
      return alreadyAdded ? [] : [$_azl8jsmdjd24rkgw.getCell(row, index)];
    });
    return replaceIn(grid, targets, comparator, substitution);
  };
  var replaceRow = function (grid, index, comparator, substitution) {
    var targetRow = grid[index];
    var targets = $_821r2ajgjd24rk5h.bind(targetRow.cells(), function (item, i) {
      var alreadyAdded = notStartRow(grid, index, i, comparator) || notStartColumn(targetRow, i, comparator);
      return alreadyAdded ? [] : [item];
    });
    return replaceIn(grid, targets, comparator, substitution);
  };
  var $_1u0rnfmujd24rkj0 = {
    replaceColumn: replaceColumn,
    replaceRow: replaceRow
  };

  var none$1 = function () {
    return folder(function (n, o, l, m, r) {
      return n();
    });
  };
  var only = function (index) {
    return folder(function (n, o, l, m, r) {
      return o(index);
    });
  };
  var left = function (index, next) {
    return folder(function (n, o, l, m, r) {
      return l(index, next);
    });
  };
  var middle = function (prev, index, next) {
    return folder(function (n, o, l, m, r) {
      return m(prev, index, next);
    });
  };
  var right = function (prev, index) {
    return folder(function (n, o, l, m, r) {
      return r(prev, index);
    });
  };
  var folder = function (fold) {
    return { fold: fold };
  };
  var $_4vksuumxjd24rkjc = {
    none: none$1,
    only: only,
    left: left,
    middle: middle,
    right: right
  };

  var neighbours$1 = function (input, index) {
    if (input.length === 0)
      return $_4vksuumxjd24rkjc.none();
    if (input.length === 1)
      return $_4vksuumxjd24rkjc.only(0);
    if (index === 0)
      return $_4vksuumxjd24rkjc.left(0, 1);
    if (index === input.length - 1)
      return $_4vksuumxjd24rkjc.right(index - 1, index);
    if (index > 0 && index < input.length - 1)
      return $_4vksuumxjd24rkjc.middle(index - 1, index, index + 1);
    return $_4vksuumxjd24rkjc.none();
  };
  var determine = function (input, column, step, tableSize) {
    var result = input.slice(0);
    var context = neighbours$1(input, column);
    var zero = function (array) {
      return $_821r2ajgjd24rk5h.map(array, $_brb4k3jijd24rk5p.constant(0));
    };
    var onNone = $_brb4k3jijd24rk5p.constant(zero(result));
    var onOnly = function (index) {
      return tableSize.singleColumnWidth(result[index], step);
    };
    var onChange = function (index, next) {
      if (step >= 0) {
        var newNext = Math.max(tableSize.minCellWidth(), result[next] - step);
        return zero(result.slice(0, index)).concat([
          step,
          newNext - result[next]
        ]).concat(zero(result.slice(next + 1)));
      } else {
        var newThis = Math.max(tableSize.minCellWidth(), result[index] + step);
        var diffx = result[index] - newThis;
        return zero(result.slice(0, index)).concat([
          newThis - result[index],
          diffx
        ]).concat(zero(result.slice(next + 1)));
      }
    };
    var onLeft = onChange;
    var onMiddle = function (prev, index, next) {
      return onChange(index, next);
    };
    var onRight = function (prev, index) {
      if (step >= 0) {
        return zero(result.slice(0, index)).concat([step]);
      } else {
        var size = Math.max(tableSize.minCellWidth(), result[index] + step);
        return zero(result.slice(0, index)).concat([size - result[index]]);
      }
    };
    return context.fold(onNone, onOnly, onLeft, onMiddle, onRight);
  };
  var $_93e9njmwjd24rkj8 = { determine: determine };

  var getSpan$1 = function (cell, type) {
    return $_4ni5ekkgjd24rk8l.has(cell, type) && parseInt($_4ni5ekkgjd24rk8l.get(cell, type), 10) > 1;
  };
  var hasColspan = function (cell) {
    return getSpan$1(cell, 'colspan');
  };
  var hasRowspan = function (cell) {
    return getSpan$1(cell, 'rowspan');
  };
  var getInt = function (element, property) {
    return parseInt($_ftduaokpjd24rk9i.get(element, property), 10);
  };
  var $_7hcblcmzjd24rkjj = {
    hasColspan: hasColspan,
    hasRowspan: hasRowspan,
    minWidth: $_brb4k3jijd24rk5p.constant(10),
    minHeight: $_brb4k3jijd24rk5p.constant(10),
    getInt: getInt
  };

  var getRaw$1 = function (cell, property, getter) {
    return $_ftduaokpjd24rk9i.getRaw(cell, property).fold(function () {
      return getter(cell) + 'px';
    }, function (raw) {
      return raw;
    });
  };
  var getRawW = function (cell) {
    return getRaw$1(cell, 'width', $_2r7bu7lpjd24rke2.getPixelWidth);
  };
  var getRawH = function (cell) {
    return getRaw$1(cell, 'height', $_2r7bu7lpjd24rke2.getHeight);
  };
  var getWidthFrom = function (warehouse, direction, getWidth, fallback, tableSize) {
    var columns = $_c2dyjvmgjd24rkhp.columns(warehouse);
    var backups = $_821r2ajgjd24rk5h.map(columns, function (cellOption) {
      return cellOption.map(direction.edge);
    });
    return $_821r2ajgjd24rk5h.map(columns, function (cellOption, c) {
      var columnCell = cellOption.filter($_brb4k3jijd24rk5p.not($_7hcblcmzjd24rkjj.hasColspan));
      return columnCell.fold(function () {
        var deduced = $_1zj6etmhjd24rkhu.deduce(backups, c);
        return fallback(deduced);
      }, function (cell) {
        return getWidth(cell, tableSize);
      });
    });
  };
  var getDeduced = function (deduced) {
    return deduced.map(function (d) {
      return d + 'px';
    }).getOr('');
  };
  var getRawWidths = function (warehouse, direction) {
    return getWidthFrom(warehouse, direction, getRawW, getDeduced);
  };
  var getPercentageWidths = function (warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, $_2r7bu7lpjd24rke2.getPercentageWidth, function (deduced) {
      return deduced.fold(function () {
        return tableSize.minCellWidth();
      }, function (cellWidth) {
        return cellWidth / tableSize.pixelWidth() * 100;
      });
    }, tableSize);
  };
  var getPixelWidths = function (warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, $_2r7bu7lpjd24rke2.getPixelWidth, function (deduced) {
      return deduced.getOrThunk(tableSize.minCellWidth);
    }, tableSize);
  };
  var getHeightFrom = function (warehouse, direction, getHeight, fallback) {
    var rows = $_c2dyjvmgjd24rkhp.rows(warehouse);
    var backups = $_821r2ajgjd24rk5h.map(rows, function (cellOption) {
      return cellOption.map(direction.edge);
    });
    return $_821r2ajgjd24rk5h.map(rows, function (cellOption, c) {
      var rowCell = cellOption.filter($_brb4k3jijd24rk5p.not($_7hcblcmzjd24rkjj.hasRowspan));
      return rowCell.fold(function () {
        var deduced = $_1zj6etmhjd24rkhu.deduce(backups, c);
        return fallback(deduced);
      }, function (cell) {
        return getHeight(cell);
      });
    });
  };
  var getPixelHeights = function (warehouse, direction) {
    return getHeightFrom(warehouse, direction, $_2r7bu7lpjd24rke2.getHeight, function (deduced) {
      return deduced.getOrThunk($_7hcblcmzjd24rkjj.minHeight);
    });
  };
  var getRawHeights = function (warehouse, direction) {
    return getHeightFrom(warehouse, direction, getRawH, getDeduced);
  };
  var $_e6287qmyjd24rkje = {
    getRawWidths: getRawWidths,
    getPixelWidths: getPixelWidths,
    getPercentageWidths: getPercentageWidths,
    getPixelHeights: getPixelHeights,
    getRawHeights: getRawHeights
  };

  var total = function (start, end, measures) {
    var r = 0;
    for (var i = start; i < end; i++) {
      r += measures[i] !== undefined ? measures[i] : 0;
    }
    return r;
  };
  var recalculateWidth = function (warehouse, widths) {
    var all = $_4xhnwmkojd24rk9d.justCells(warehouse);
    return $_821r2ajgjd24rk5h.map(all, function (cell) {
      var width = total(cell.column(), cell.column() + cell.colspan(), widths);
      return {
        element: cell.element,
        width: $_brb4k3jijd24rk5p.constant(width),
        colspan: cell.colspan
      };
    });
  };
  var recalculateHeight = function (warehouse, heights) {
    var all = $_4xhnwmkojd24rk9d.justCells(warehouse);
    return $_821r2ajgjd24rk5h.map(all, function (cell) {
      var height = total(cell.row(), cell.row() + cell.rowspan(), heights);
      return {
        element: cell.element,
        height: $_brb4k3jijd24rk5p.constant(height),
        rowspan: cell.rowspan
      };
    });
  };
  var matchRowHeight = function (warehouse, heights) {
    return $_821r2ajgjd24rk5h.map(warehouse.all(), function (row, i) {
      return {
        element: row.element,
        height: $_brb4k3jijd24rk5p.constant(heights[i])
      };
    });
  };
  var $_fxrpcxn0jd24rkjn = {
    recalculateWidth: recalculateWidth,
    recalculateHeight: recalculateHeight,
    matchRowHeight: matchRowHeight
  };

  var percentageSize = function (width, element) {
    var floatWidth = parseFloat(width);
    var pixelWidth = $_a7blqultjd24rkem.get(element);
    var getCellDelta = function (delta) {
      return delta / pixelWidth * 100;
    };
    var singleColumnWidth = function (width, _delta) {
      return [100 - width];
    };
    var minCellWidth = function () {
      return $_7hcblcmzjd24rkjj.minWidth() / pixelWidth * 100;
    };
    var setTableWidth = function (table, _newWidths, delta) {
      var total = floatWidth + delta;
      $_2r7bu7lpjd24rke2.setPercentageWidth(table, total);
    };
    return {
      width: $_brb4k3jijd24rk5p.constant(floatWidth),
      pixelWidth: $_brb4k3jijd24rk5p.constant(pixelWidth),
      getWidths: $_e6287qmyjd24rkje.getPercentageWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: minCellWidth,
      setElementWidth: $_2r7bu7lpjd24rke2.setPercentageWidth,
      setTableWidth: setTableWidth
    };
  };
  var pixelSize = function (width) {
    var intWidth = parseInt(width, 10);
    var getCellDelta = $_brb4k3jijd24rk5p.identity;
    var singleColumnWidth = function (width, delta) {
      var newNext = Math.max($_7hcblcmzjd24rkjj.minWidth(), width + delta);
      return [newNext - width];
    };
    var setTableWidth = function (table, newWidths, _delta) {
      var total = $_821r2ajgjd24rk5h.foldr(newWidths, function (b, a) {
        return b + a;
      }, 0);
      $_2r7bu7lpjd24rke2.setPixelWidth(table, total);
    };
    return {
      width: $_brb4k3jijd24rk5p.constant(intWidth),
      pixelWidth: $_brb4k3jijd24rk5p.constant(intWidth),
      getWidths: $_e6287qmyjd24rkje.getPixelWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: $_7hcblcmzjd24rkjj.minWidth,
      setElementWidth: $_2r7bu7lpjd24rke2.setPixelWidth,
      setTableWidth: setTableWidth
    };
  };
  var chooseSize = function (element, width) {
    if ($_2r7bu7lpjd24rke2.percentageBasedSizeRegex().test(width)) {
      var percentMatch = $_2r7bu7lpjd24rke2.percentageBasedSizeRegex().exec(width);
      return percentageSize(percentMatch[1], element);
    } else if ($_2r7bu7lpjd24rke2.pixelBasedSizeRegex().test(width)) {
      var pixelMatch = $_2r7bu7lpjd24rke2.pixelBasedSizeRegex().exec(width);
      return pixelSize(pixelMatch[1]);
    } else {
      var fallbackWidth = $_a7blqultjd24rkem.get(element);
      return pixelSize(fallbackWidth);
    }
  };
  var getTableSize = function (element) {
    var width = $_2r7bu7lpjd24rke2.getRawWidth(element);
    return width.fold(function () {
      var fallbackWidth = $_a7blqultjd24rkem.get(element);
      return pixelSize(fallbackWidth);
    }, function (width) {
      return chooseSize(element, width);
    });
  };
  var $_d4cvrrn1jd24rkjr = { getTableSize: getTableSize };

  var getWarehouse$1 = function (list) {
    return $_4xhnwmkojd24rk9d.generate(list);
  };
  var sumUp = function (newSize) {
    return $_821r2ajgjd24rk5h.foldr(newSize, function (b, a) {
      return b + a;
    }, 0);
  };
  var getTableWarehouse = function (table) {
    var list = $_d16wdjjqjd24rk6i.fromTable(table);
    return getWarehouse$1(list);
  };
  var adjustWidth = function (table, delta, index, direction) {
    var tableSize = $_d4cvrrn1jd24rkjr.getTableSize(table);
    var step = tableSize.getCellDelta(delta);
    var warehouse = getTableWarehouse(table);
    var widths = tableSize.getWidths(warehouse, direction, tableSize);
    var deltas = $_93e9njmwjd24rkj8.determine(widths, index, step, tableSize);
    var newWidths = $_821r2ajgjd24rk5h.map(deltas, function (dx, i) {
      return dx + widths[i];
    });
    var newSizes = $_fxrpcxn0jd24rkjn.recalculateWidth(warehouse, newWidths);
    $_821r2ajgjd24rk5h.each(newSizes, function (cell) {
      tableSize.setElementWidth(cell.element(), cell.width());
    });
    if (index === warehouse.grid().columns() - 1) {
      tableSize.setTableWidth(table, newWidths, step);
    }
  };
  var adjustHeight = function (table, delta, index, direction) {
    var warehouse = getTableWarehouse(table);
    var heights = $_e6287qmyjd24rkje.getPixelHeights(warehouse, direction);
    var newHeights = $_821r2ajgjd24rk5h.map(heights, function (dy, i) {
      return index === i ? Math.max(delta + dy, $_7hcblcmzjd24rkjj.minHeight()) : dy;
    });
    var newCellSizes = $_fxrpcxn0jd24rkjn.recalculateHeight(warehouse, newHeights);
    var newRowSizes = $_fxrpcxn0jd24rkjn.matchRowHeight(warehouse, newHeights);
    $_821r2ajgjd24rk5h.each(newRowSizes, function (row) {
      $_2r7bu7lpjd24rke2.setHeight(row.element(), row.height());
    });
    $_821r2ajgjd24rk5h.each(newCellSizes, function (cell) {
      $_2r7bu7lpjd24rke2.setHeight(cell.element(), cell.height());
    });
    var total = sumUp(newHeights);
    $_2r7bu7lpjd24rke2.setHeight(table, total);
  };
  var adjustWidthTo = function (table, list, direction) {
    var tableSize = $_d4cvrrn1jd24rkjr.getTableSize(table);
    var warehouse = getWarehouse$1(list);
    var widths = tableSize.getWidths(warehouse, direction, tableSize);
    var newSizes = $_fxrpcxn0jd24rkjn.recalculateWidth(warehouse, widths);
    $_821r2ajgjd24rk5h.each(newSizes, function (cell) {
      tableSize.setElementWidth(cell.element(), cell.width());
    });
    var total = $_821r2ajgjd24rk5h.foldr(widths, function (b, a) {
      return a + b;
    }, 0);
    if (newSizes.length > 0) {
      tableSize.setElementWidth(table, total);
    }
  };
  var $_3srypfmvjd24rkj5 = {
    adjustWidth: adjustWidth,
    adjustHeight: adjustHeight,
    adjustWidthTo: adjustWidthTo
  };

  var prune = function (table) {
    var cells = $_60ksrkjsjd24rk6p.cells(table);
    if (cells.length === 0)
      $_6k630dksjd24rk9s.remove(table);
  };
  var outcome = $_7p1bnnjljd24rk6a.immutable('grid', 'cursor');
  var elementFromGrid = function (grid, row, column) {
    return findIn(grid, row, column).orThunk(function () {
      return findIn(grid, 0, 0);
    });
  };
  var findIn = function (grid, row, column) {
    return $_geu5gjhjd24rk5m.from(grid[row]).bind(function (r) {
      return $_geu5gjhjd24rk5m.from(r.cells()[column]).bind(function (c) {
        return $_geu5gjhjd24rk5m.from(c.element());
      });
    });
  };
  var bundle = function (grid, row, column) {
    return outcome(grid, findIn(grid, row, column));
  };
  var uniqueRows = function (details) {
    return $_821r2ajgjd24rk5h.foldl(details, function (rest, detail) {
      return $_821r2ajgjd24rk5h.exists(rest, function (currentDetail) {
        return currentDetail.row() === detail.row();
      }) ? rest : rest.concat([detail]);
    }, []).sort(function (detailA, detailB) {
      return detailA.row() - detailB.row();
    });
  };
  var uniqueColumns = function (details) {
    return $_821r2ajgjd24rk5h.foldl(details, function (rest, detail) {
      return $_821r2ajgjd24rk5h.exists(rest, function (currentDetail) {
        return currentDetail.column() === detail.column();
      }) ? rest : rest.concat([detail]);
    }, []).sort(function (detailA, detailB) {
      return detailA.column() - detailB.column();
    });
  };
  var insertRowBefore = function (grid, detail, comparator, genWrappers) {
    var example = detail.row();
    var targetIndex = detail.row();
    var newGrid = $_337n1dmtjd24rkiw.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, targetIndex, detail.column());
  };
  var insertRowsBefore = function (grid, details, comparator, genWrappers) {
    var example = details[0].row();
    var targetIndex = details[0].row();
    var rows = uniqueRows(details);
    var newGrid = $_821r2ajgjd24rk5h.foldl(rows, function (newGrid, _row) {
      return $_337n1dmtjd24rkiw.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, targetIndex, details[0].column());
  };
  var insertRowAfter = function (grid, detail, comparator, genWrappers) {
    var example = detail.row();
    var targetIndex = detail.row() + detail.rowspan();
    var newGrid = $_337n1dmtjd24rkiw.insertRowAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, targetIndex, detail.column());
  };
  var insertRowsAfter = function (grid, details, comparator, genWrappers) {
    var rows = uniqueRows(details);
    var example = rows[rows.length - 1].row();
    var targetIndex = rows[rows.length - 1].row() + rows[rows.length - 1].rowspan();
    var newGrid = $_821r2ajgjd24rk5h.foldl(rows, function (newGrid, _row) {
      return $_337n1dmtjd24rkiw.insertRowAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, targetIndex, details[0].column());
  };
  var insertColumnBefore = function (grid, detail, comparator, genWrappers) {
    var example = detail.column();
    var targetIndex = detail.column();
    var newGrid = $_337n1dmtjd24rkiw.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), targetIndex);
  };
  var insertColumnsBefore = function (grid, details, comparator, genWrappers) {
    var columns = uniqueColumns(details);
    var example = columns[0].column();
    var targetIndex = columns[0].column();
    var newGrid = $_821r2ajgjd24rk5h.foldl(columns, function (newGrid, _row) {
      return $_337n1dmtjd24rkiw.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, details[0].row(), targetIndex);
  };
  var insertColumnAfter = function (grid, detail, comparator, genWrappers) {
    var example = detail.column();
    var targetIndex = detail.column() + detail.colspan();
    var newGrid = $_337n1dmtjd24rkiw.insertColumnAt(grid, targetIndex, example, comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), targetIndex);
  };
  var insertColumnsAfter = function (grid, details, comparator, genWrappers) {
    var example = details[details.length - 1].column();
    var targetIndex = details[details.length - 1].column() + details[details.length - 1].colspan();
    var columns = uniqueColumns(details);
    var newGrid = $_821r2ajgjd24rk5h.foldl(columns, function (newGrid, _row) {
      return $_337n1dmtjd24rkiw.insertColumnAt(newGrid, targetIndex, example, comparator, genWrappers.getOrInit);
    }, grid);
    return bundle(newGrid, details[0].row(), targetIndex);
  };
  var makeRowHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1u0rnfmujd24rkj0.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var makeColumnHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1u0rnfmujd24rkj0.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var unmakeRowHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1u0rnfmujd24rkj0.replaceRow(grid, detail.row(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var unmakeColumnHeader = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_1u0rnfmujd24rkj0.replaceColumn(grid, detail.column(), comparator, genWrappers.replaceOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var splitCellIntoColumns$1 = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_337n1dmtjd24rkiw.splitCellIntoColumns(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var splitCellIntoRows$1 = function (grid, detail, comparator, genWrappers) {
    var newGrid = $_337n1dmtjd24rkiw.splitCellIntoRows(grid, detail.row(), detail.column(), comparator, genWrappers.getOrInit);
    return bundle(newGrid, detail.row(), detail.column());
  };
  var eraseColumns = function (grid, details, comparator, _genWrappers) {
    var columns = uniqueColumns(details);
    var newGrid = $_337n1dmtjd24rkiw.deleteColumnsAt(grid, columns[0].column(), columns[columns.length - 1].column());
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column());
    return outcome(newGrid, cursor);
  };
  var eraseRows = function (grid, details, comparator, _genWrappers) {
    var rows = uniqueRows(details);
    var newGrid = $_337n1dmtjd24rkiw.deleteRowsAt(grid, rows[0].row(), rows[rows.length - 1].row());
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column());
    return outcome(newGrid, cursor);
  };
  var mergeCells = function (grid, mergable, comparator, _genWrappers) {
    var cells = mergable.cells();
    $_dp3njam5jd24rkfw.merge(cells);
    var newGrid = $_7muui5msjd24rkis.merge(grid, mergable.bounds(), comparator, $_brb4k3jijd24rk5p.constant(cells[0]));
    return outcome(newGrid, $_geu5gjhjd24rk5m.from(cells[0]));
  };
  var unmergeCells = function (grid, unmergable, comparator, genWrappers) {
    var newGrid = $_821r2ajgjd24rk5h.foldr(unmergable, function (b, cell) {
      return $_7muui5msjd24rkis.unmerge(b, cell, comparator, genWrappers.combine(cell));
    }, grid);
    return outcome(newGrid, $_geu5gjhjd24rk5m.from(unmergable[0]));
  };
  var pasteCells = function (grid, pasteDetails, comparator, genWrappers) {
    var gridify = function (table, generators) {
      var list = $_d16wdjjqjd24rk6i.fromTable(table);
      var wh = $_4xhnwmkojd24rk9d.generate(list);
      return $_6ox826mbjd24rkgq.toGrid(wh, generators, true);
    };
    var gridB = gridify(pasteDetails.clipboard(), pasteDetails.generators());
    var startAddress = $_4vfg3njrjd24rk6n.address(pasteDetails.row(), pasteDetails.column());
    var mergedGrid = $_fzhtv7mpjd24rkie.merge(startAddress, grid, gridB, pasteDetails.generators(), comparator);
    return mergedGrid.fold(function () {
      return outcome(grid, $_geu5gjhjd24rk5m.some(pasteDetails.element()));
    }, function (nuGrid) {
      var cursor = elementFromGrid(nuGrid, pasteDetails.row(), pasteDetails.column());
      return outcome(nuGrid, cursor);
    });
  };
  var gridifyRows = function (rows, generators, example) {
    var pasteDetails = $_d16wdjjqjd24rk6i.fromPastedRows(rows, example);
    var wh = $_4xhnwmkojd24rk9d.generate(pasteDetails);
    return $_6ox826mbjd24rkgq.toGrid(wh, generators, true);
  };
  var pasteRowsBefore = function (grid, pasteDetails, comparator, genWrappers) {
    var example = grid[pasteDetails.cells[0].row()];
    var index = pasteDetails.cells[0].row();
    var gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example);
    var mergedGrid = $_fzhtv7mpjd24rkie.insert(index, grid, gridB, pasteDetails.generators(), comparator);
    var cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column());
    return outcome(mergedGrid, cursor);
  };
  var pasteRowsAfter = function (grid, pasteDetails, comparator, genWrappers) {
    var example = grid[pasteDetails.cells[0].row()];
    var index = pasteDetails.cells[pasteDetails.cells.length - 1].row() + pasteDetails.cells[pasteDetails.cells.length - 1].rowspan();
    var gridB = gridifyRows(pasteDetails.clipboard(), pasteDetails.generators(), example);
    var mergedGrid = $_fzhtv7mpjd24rkie.insert(index, grid, gridB, pasteDetails.generators(), comparator);
    var cursor = elementFromGrid(mergedGrid, pasteDetails.cells[0].row(), pasteDetails.cells[0].column());
    return outcome(mergedGrid, cursor);
  };
  var resize = $_3srypfmvjd24rkj5.adjustWidthTo;
  var $_1c0uzsm1jd24rkf5 = {
    insertRowBefore: $_qjw38m8jd24rkgd.run(insertRowBefore, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertRowsBefore: $_qjw38m8jd24rkgd.run(insertRowsBefore, $_qjw38m8jd24rkgd.onCells, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertRowAfter: $_qjw38m8jd24rkgd.run(insertRowAfter, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertRowsAfter: $_qjw38m8jd24rkgd.run(insertRowsAfter, $_qjw38m8jd24rkgd.onCells, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertColumnBefore: $_qjw38m8jd24rkgd.run(insertColumnBefore, $_qjw38m8jd24rkgd.onCell, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertColumnsBefore: $_qjw38m8jd24rkgd.run(insertColumnsBefore, $_qjw38m8jd24rkgd.onCells, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertColumnAfter: $_qjw38m8jd24rkgd.run(insertColumnAfter, $_qjw38m8jd24rkgd.onCell, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    insertColumnsAfter: $_qjw38m8jd24rkgd.run(insertColumnsAfter, $_qjw38m8jd24rkgd.onCells, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    splitCellIntoColumns: $_qjw38m8jd24rkgd.run(splitCellIntoColumns$1, $_qjw38m8jd24rkgd.onCell, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    splitCellIntoRows: $_qjw38m8jd24rkgd.run(splitCellIntoRows$1, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    eraseColumns: $_qjw38m8jd24rkgd.run(eraseColumns, $_qjw38m8jd24rkgd.onCells, resize, prune, $_97pcrxm2jd24rkfj.modification),
    eraseRows: $_qjw38m8jd24rkgd.run(eraseRows, $_qjw38m8jd24rkgd.onCells, $_brb4k3jijd24rk5p.noop, prune, $_97pcrxm2jd24rkfj.modification),
    makeColumnHeader: $_qjw38m8jd24rkgd.run(makeColumnHeader, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.transform('row', 'th')),
    unmakeColumnHeader: $_qjw38m8jd24rkgd.run(unmakeColumnHeader, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.transform(null, 'td')),
    makeRowHeader: $_qjw38m8jd24rkgd.run(makeRowHeader, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.transform('col', 'th')),
    unmakeRowHeader: $_qjw38m8jd24rkgd.run(unmakeRowHeader, $_qjw38m8jd24rkgd.onCell, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.transform(null, 'td')),
    mergeCells: $_qjw38m8jd24rkgd.run(mergeCells, $_qjw38m8jd24rkgd.onMergable, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.merging),
    unmergeCells: $_qjw38m8jd24rkgd.run(unmergeCells, $_qjw38m8jd24rkgd.onUnmergable, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.merging),
    pasteCells: $_qjw38m8jd24rkgd.run(pasteCells, $_qjw38m8jd24rkgd.onPaste, resize, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    pasteRowsBefore: $_qjw38m8jd24rkgd.run(pasteRowsBefore, $_qjw38m8jd24rkgd.onPasteRows, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification),
    pasteRowsAfter: $_qjw38m8jd24rkgd.run(pasteRowsAfter, $_qjw38m8jd24rkgd.onPasteRows, $_brb4k3jijd24rk5p.noop, $_brb4k3jijd24rk5p.noop, $_97pcrxm2jd24rkfj.modification)
  };

  var getBody$1 = function (editor) {
    return $_6zx9pgjvjd24rk77.fromDom(editor.getBody());
  };
  var getIsRoot = function (editor) {
    return function (element) {
      return $_c6tuisjzjd24rk7o.eq(element, getBody$1(editor));
    };
  };
  var removePxSuffix = function (size) {
    return size ? size.replace(/px$/, '') : '';
  };
  var addSizeSuffix = function (size) {
    if (/^[0-9]+$/.test(size)) {
      size += 'px';
    }
    return size;
  };
  var $_a6b2yhn2jd24rkjw = {
    getBody: getBody$1,
    getIsRoot: getIsRoot,
    addSizeSuffix: addSizeSuffix,
    removePxSuffix: removePxSuffix
  };

  var onDirection = function (isLtr, isRtl) {
    return function (element) {
      return getDirection(element) === 'rtl' ? isRtl : isLtr;
    };
  };
  var getDirection = function (element) {
    return $_ftduaokpjd24rk9i.get(element, 'direction') === 'rtl' ? 'rtl' : 'ltr';
  };
  var $_aczl9ln4jd24rkk1 = {
    onDirection: onDirection,
    getDirection: getDirection
  };

  var ltr$1 = { isRtl: $_brb4k3jijd24rk5p.constant(false) };
  var rtl$1 = { isRtl: $_brb4k3jijd24rk5p.constant(true) };
  var directionAt = function (element) {
    var dir = $_aczl9ln4jd24rkk1.getDirection(element);
    return dir === 'rtl' ? rtl$1 : ltr$1;
  };
  var $_2g3t0n3jd24rkjz = { directionAt: directionAt };

  function TableActions (editor, lazyWire) {
    var isTableBody = function (editor) {
      return $_sc7pgkhjd24rk8q.name($_a6b2yhn2jd24rkjw.getBody(editor)) === 'table';
    };
    var lastRowGuard = function (table) {
      var size = $_e8b05vm0jd24rkf2.getGridSize(table);
      return isTableBody(editor) === false || size.rows() > 1;
    };
    var lastColumnGuard = function (table) {
      var size = $_e8b05vm0jd24rkf2.getGridSize(table);
      return isTableBody(editor) === false || size.columns() > 1;
    };
    var fireNewRow = function (node) {
      editor.fire('newrow', { node: node.dom() });
      return node.dom();
    };
    var fireNewCell = function (node) {
      editor.fire('newcell', { node: node.dom() });
      return node.dom();
    };
    var cloneFormatsArray;
    if (editor.settings.table_clone_elements !== false) {
      if (typeof editor.settings.table_clone_elements === 'string') {
        cloneFormatsArray = editor.settings.table_clone_elements.split(/[ ,]/);
      } else if (Array.isArray(editor.settings.table_clone_elements)) {
        cloneFormatsArray = editor.settings.table_clone_elements;
      }
    }
    var cloneFormats = $_geu5gjhjd24rk5m.from(cloneFormatsArray);
    var execute = function (operation, guard, mutate, lazyWire) {
      return function (table, target) {
        var dataStyleCells = $_ec4gn6kijd24rk8r.descendants(table, 'td[data-mce-style],th[data-mce-style]');
        $_821r2ajgjd24rk5h.each(dataStyleCells, function (cell) {
          $_4ni5ekkgjd24rk8l.remove(cell, 'data-mce-style');
        });
        var wire = lazyWire();
        var doc = $_6zx9pgjvjd24rk77.fromDom(editor.getDoc());
        var direction = TableDirection($_2g3t0n3jd24rkjz.directionAt);
        var generators = $_3u7bywkujd24rk9y.cellOperations(mutate, doc, cloneFormats);
        return guard(table) ? operation(wire, table, target, generators, direction).bind(function (result) {
          $_821r2ajgjd24rk5h.each(result.newRows(), function (row) {
            fireNewRow(row);
          });
          $_821r2ajgjd24rk5h.each(result.newCells(), function (cell) {
            fireNewCell(cell);
          });
          return result.cursor().map(function (cell) {
            var rng = editor.dom.createRng();
            rng.setStart(cell.dom(), 0);
            rng.setEnd(cell.dom(), 0);
            return rng;
          });
        }) : $_geu5gjhjd24rk5m.none();
      };
    };
    var deleteRow = execute($_1c0uzsm1jd24rkf5.eraseRows, lastRowGuard, $_brb4k3jijd24rk5p.noop, lazyWire);
    var deleteColumn = execute($_1c0uzsm1jd24rkf5.eraseColumns, lastColumnGuard, $_brb4k3jijd24rk5p.noop, lazyWire);
    var insertRowsBefore = execute($_1c0uzsm1jd24rkf5.insertRowsBefore, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    var insertRowsAfter = execute($_1c0uzsm1jd24rkf5.insertRowsAfter, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    var insertColumnsBefore = execute($_1c0uzsm1jd24rkf5.insertColumnsBefore, $_brb4k3jijd24rk5p.always, $_48y4rplojd24rkdx.halve, lazyWire);
    var insertColumnsAfter = execute($_1c0uzsm1jd24rkf5.insertColumnsAfter, $_brb4k3jijd24rk5p.always, $_48y4rplojd24rkdx.halve, lazyWire);
    var mergeCells = execute($_1c0uzsm1jd24rkf5.mergeCells, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    var unmergeCells = execute($_1c0uzsm1jd24rkf5.unmergeCells, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    var pasteRowsBefore = execute($_1c0uzsm1jd24rkf5.pasteRowsBefore, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    var pasteRowsAfter = execute($_1c0uzsm1jd24rkf5.pasteRowsAfter, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    var pasteCells = execute($_1c0uzsm1jd24rkf5.pasteCells, $_brb4k3jijd24rk5p.always, $_brb4k3jijd24rk5p.noop, lazyWire);
    return {
      deleteRow: deleteRow,
      deleteColumn: deleteColumn,
      insertRowsBefore: insertRowsBefore,
      insertRowsAfter: insertRowsAfter,
      insertColumnsBefore: insertColumnsBefore,
      insertColumnsAfter: insertColumnsAfter,
      mergeCells: mergeCells,
      unmergeCells: unmergeCells,
      pasteRowsBefore: pasteRowsBefore,
      pasteRowsAfter: pasteRowsAfter,
      pasteCells: pasteCells
    };
  }

  var copyRows = function (table, target, generators) {
    var list = $_d16wdjjqjd24rk6i.fromTable(table);
    var house = $_4xhnwmkojd24rk9d.generate(list);
    var details = $_qjw38m8jd24rkgd.onCells(house, target);
    return details.map(function (selectedCells) {
      var grid = $_6ox826mbjd24rkgq.toGrid(house, generators, false);
      var slicedGrid = grid.slice(selectedCells[0].row(), selectedCells[selectedCells.length - 1].row() + selectedCells[selectedCells.length - 1].rowspan());
      var slicedDetails = $_qjw38m8jd24rkgd.toDetailList(slicedGrid, generators);
      return $_ajrwq4mejd24rkh4.copy(slicedDetails);
    });
  };
  var $_4ftm2on6jd24rkkg = { copyRows: copyRows };

  var Tools = tinymce.util.Tools.resolve('tinymce.util.Tools');

  var Env = tinymce.util.Tools.resolve('tinymce.Env');

  var getTDTHOverallStyle = function (dom, elm, name) {
    var cells = dom.select('td,th', elm);
    var firstChildStyle;
    var checkChildren = function (firstChildStyle, elms) {
      for (var i = 0; i < elms.length; i++) {
        var currentStyle = dom.getStyle(elms[i], name);
        if (typeof firstChildStyle === 'undefined') {
          firstChildStyle = currentStyle;
        }
        if (firstChildStyle !== currentStyle) {
          return '';
        }
      }
      return firstChildStyle;
    };
    firstChildStyle = checkChildren(firstChildStyle, cells);
    return firstChildStyle;
  };
  var applyAlign = function (editor, elm, name) {
    if (name) {
      editor.formatter.apply('align' + name, {}, elm);
    }
  };
  var applyVAlign = function (editor, elm, name) {
    if (name) {
      editor.formatter.apply('valign' + name, {}, elm);
    }
  };
  var unApplyAlign = function (editor, elm) {
    Tools.each('left center right'.split(' '), function (name) {
      editor.formatter.remove('align' + name, {}, elm);
    });
  };
  var unApplyVAlign = function (editor, elm) {
    Tools.each('top middle bottom'.split(' '), function (name) {
      editor.formatter.remove('valign' + name, {}, elm);
    });
  };
  var $_90wvwnnajd24rkkq = {
    applyAlign: applyAlign,
    applyVAlign: applyVAlign,
    unApplyAlign: unApplyAlign,
    unApplyVAlign: unApplyVAlign,
    getTDTHOverallStyle: getTDTHOverallStyle
  };

  var buildListItems = function (inputList, itemCallback, startItems) {
    var appendItems = function (values, output) {
      output = output || [];
      Tools.each(values, function (item) {
        var menuItem = { text: item.text || item.title };
        if (item.menu) {
          menuItem.menu = appendItems(item.menu);
        } else {
          menuItem.value = item.value;
          if (itemCallback) {
            itemCallback(menuItem);
          }
        }
        output.push(menuItem);
      });
      return output;
    };
    return appendItems(inputList, startItems || []);
  };
  var updateStyleField = function (editor, evt) {
    var dom = editor.dom;
    var rootControl = evt.control.rootControl;
    var data = rootControl.toJSON();
    var css = dom.parseStyle(data.style);
    if (evt.control.name() === 'style') {
      rootControl.find('#borderStyle').value(css['border-style'] || '')[0].fire('select');
      rootControl.find('#borderColor').value(css['border-color'] || '')[0].fire('change');
      rootControl.find('#backgroundColor').value(css['background-color'] || '')[0].fire('change');
      rootControl.find('#width').value(css.width || '').fire('change');
      rootControl.find('#height').value(css.height || '').fire('change');
    } else {
      css['border-style'] = data.borderStyle;
      css['border-color'] = data.borderColor;
      css['background-color'] = data.backgroundColor;
      css.width = data.width ? $_a6b2yhn2jd24rkjw.addSizeSuffix(data.width) : '';
      css.height = data.height ? $_a6b2yhn2jd24rkjw.addSizeSuffix(data.height) : '';
    }
    rootControl.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
  };
  var extractAdvancedStyles = function (dom, elm) {
    var css = dom.parseStyle(dom.getAttrib(elm, 'style'));
    var data = {};
    if (css['border-style']) {
      data.borderStyle = css['border-style'];
    }
    if (css['border-color']) {
      data.borderColor = css['border-color'];
    }
    if (css['background-color']) {
      data.backgroundColor = css['background-color'];
    }
    data.style = dom.serializeStyle(css);
    return data;
  };
  var createStyleForm = function (editor) {
    var createColorPickAction = function () {
      var colorPickerCallback = editor.settings.color_picker_callback;
      if (colorPickerCallback) {
        return function (evt) {
          return colorPickerCallback.call(editor, function (value) {
            evt.control.value(value).fire('change');
          }, evt.control.value());
        };
      }
    };
    return {
      title: 'Advanced',
      type: 'form',
      defaults: { onchange: $_brb4k3jijd24rk5p.curry(updateStyleField, editor) },
      items: [
        {
          label: 'Style',
          name: 'style',
          type: 'textbox'
        },
        {
          type: 'form',
          padding: 0,
          formItemDefaults: {
            layout: 'grid',
            alignH: [
              'start',
              'right'
            ]
          },
          defaults: { size: 7 },
          items: [
            {
              label: 'Border style',
              type: 'listbox',
              name: 'borderStyle',
              width: 90,
              onselect: $_brb4k3jijd24rk5p.curry(updateStyleField, editor),
              values: [
                {
                  text: 'Select...',
                  value: ''
                },
                {
                  text: 'Solid',
                  value: 'solid'
                },
                {
                  text: 'Dotted',
                  value: 'dotted'
                },
                {
                  text: 'Dashed',
                  value: 'dashed'
                },
                {
                  text: 'Double',
                  value: 'double'
                },
                {
                  text: 'Groove',
                  value: 'groove'
                },
                {
                  text: 'Ridge',
                  value: 'ridge'
                },
                {
                  text: 'Inset',
                  value: 'inset'
                },
                {
                  text: 'Outset',
                  value: 'outset'
                },
                {
                  text: 'None',
                  value: 'none'
                },
                {
                  text: 'Hidden',
                  value: 'hidden'
                }
              ]
            },
            {
              label: 'Border color',
              type: 'colorbox',
              name: 'borderColor',
              onaction: createColorPickAction()
            },
            {
              label: 'Background color',
              type: 'colorbox',
              name: 'backgroundColor',
              onaction: createColorPickAction()
            }
          ]
        }
      ]
    };
  };
  var $_b2ano0nbjd24rkks = {
    createStyleForm: createStyleForm,
    buildListItems: buildListItems,
    updateStyleField: updateStyleField,
    extractAdvancedStyles: extractAdvancedStyles
  };

  function styleTDTH(dom, elm, name, value) {
    if (elm.tagName === 'TD' || elm.tagName === 'TH') {
      dom.setStyle(elm, name, value);
    } else {
      if (elm.children) {
        for (var i = 0; i < elm.children.length; i++) {
          styleTDTH(dom, elm.children[i], name, value);
        }
      }
    }
  }
  var extractDataFromElement = function (editor, tableElm) {
    var dom = editor.dom;
    var data = {
      width: dom.getStyle(tableElm, 'width') || dom.getAttrib(tableElm, 'width'),
      height: dom.getStyle(tableElm, 'height') || dom.getAttrib(tableElm, 'height'),
      cellspacing: dom.getStyle(tableElm, 'border-spacing') || dom.getAttrib(tableElm, 'cellspacing'),
      cellpadding: dom.getAttrib(tableElm, 'data-mce-cell-padding') || dom.getAttrib(tableElm, 'cellpadding') || $_90wvwnnajd24rkkq.getTDTHOverallStyle(editor.dom, tableElm, 'padding'),
      border: dom.getAttrib(tableElm, 'data-mce-border') || dom.getAttrib(tableElm, 'border') || $_90wvwnnajd24rkkq.getTDTHOverallStyle(editor.dom, tableElm, 'border'),
      borderColor: dom.getAttrib(tableElm, 'data-mce-border-color'),
      caption: !!dom.select('caption', tableElm)[0],
      class: dom.getAttrib(tableElm, 'class')
    };
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(tableElm, 'align' + name)) {
        data.align = name;
      }
    });
    if (editor.settings.table_advtab !== false) {
      Tools.extend(data, $_b2ano0nbjd24rkks.extractAdvancedStyles(dom, tableElm));
    }
    return data;
  };
  var applyDataToElement = function (editor, tableElm, data) {
    var dom = editor.dom;
    var attrs = {};
    var styles = {};
    attrs.class = data.class;
    styles.height = $_a6b2yhn2jd24rkjw.addSizeSuffix(data.height);
    if (dom.getAttrib(tableElm, 'width') && !editor.settings.table_style_by_css) {
      attrs.width = $_a6b2yhn2jd24rkjw.removePxSuffix(data.width);
    } else {
      styles.width = $_a6b2yhn2jd24rkjw.addSizeSuffix(data.width);
    }
    if (editor.settings.table_style_by_css) {
      styles['border-width'] = $_a6b2yhn2jd24rkjw.addSizeSuffix(data.border);
      styles['border-spacing'] = $_a6b2yhn2jd24rkjw.addSizeSuffix(data.cellspacing);
      Tools.extend(attrs, {
        'data-mce-border-color': data.borderColor,
        'data-mce-cell-padding': data.cellpadding,
        'data-mce-border': data.border
      });
    } else {
      Tools.extend(attrs, {
        border: data.border,
        cellpadding: data.cellpadding,
        cellspacing: data.cellspacing
      });
    }
    if (editor.settings.table_style_by_css) {
      if (tableElm.children) {
        for (var i = 0; i < tableElm.children.length; i++) {
          styleTDTH(dom, tableElm.children[i], {
            'border-width': $_a6b2yhn2jd24rkjw.addSizeSuffix(data.border),
            'border-color': data.borderColor,
            'padding': $_a6b2yhn2jd24rkjw.addSizeSuffix(data.cellpadding)
          });
        }
      }
    }
    if (data.style) {
      Tools.extend(styles, dom.parseStyle(data.style));
    } else {
      styles = Tools.extend({}, dom.parseStyle(dom.getAttrib(tableElm, 'style')), styles);
    }
    attrs.style = dom.serializeStyle(styles);
    dom.setAttribs(tableElm, attrs);
  };
  var onSubmitTableForm = function (editor, tableElm, evt) {
    var dom = editor.dom;
    var captionElm;
    var data;
    $_b2ano0nbjd24rkks.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    if (data.class === false) {
      delete data.class;
    }
    editor.undoManager.transact(function () {
      if (!tableElm) {
        tableElm = $_8wcpcxljjd24rkd7.insert(editor, data.cols || 1, data.rows || 1);
      }
      applyDataToElement(editor, tableElm, data);
      captionElm = dom.select('caption', tableElm)[0];
      if (captionElm && !data.caption) {
        dom.remove(captionElm);
      }
      if (!captionElm && data.caption) {
        captionElm = dom.create('caption');
        captionElm.innerHTML = !Env.ie ? '<br data-mce-bogus="1"/>' : '\xA0';
        tableElm.insertBefore(captionElm, tableElm.firstChild);
      }
      $_90wvwnnajd24rkkq.unApplyAlign(editor, tableElm);
      if (data.align) {
        $_90wvwnnajd24rkkq.applyAlign(editor, tableElm, data.align);
      }
      editor.focus();
      editor.addVisual();
    });
  };
  var open = function (editor, isProps) {
    var dom = editor.dom;
    var tableElm, colsCtrl, rowsCtrl, classListCtrl, data = {}, generalTableForm;
    if (isProps === true) {
      tableElm = dom.getParent(editor.selection.getStart(), 'table');
      if (tableElm) {
        data = extractDataFromElement(editor, tableElm);
      }
    } else {
      colsCtrl = {
        label: 'Cols',
        name: 'cols'
      };
      rowsCtrl = {
        label: 'Rows',
        name: 'rows'
      };
    }
    if (editor.settings.table_class_list) {
      if (data.class) {
        data.class = data.class.replace(/\s*mce\-item\-table\s*/g, '');
      }
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_b2ano0nbjd24rkks.buildListItems(editor.settings.table_class_list, function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'table',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    generalTableForm = {
      type: 'form',
      layout: 'flex',
      direction: 'column',
      labelGapCalc: 'children',
      padding: 0,
      items: [
        {
          type: 'form',
          labelGapCalc: false,
          padding: 0,
          layout: 'grid',
          columns: 2,
          defaults: {
            type: 'textbox',
            maxWidth: 50
          },
          items: editor.settings.table_appearance_options !== false ? [
            colsCtrl,
            rowsCtrl,
            {
              label: 'Width',
              name: 'width',
              onchange: $_brb4k3jijd24rk5p.curry($_b2ano0nbjd24rkks.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_brb4k3jijd24rk5p.curry($_b2ano0nbjd24rkks.updateStyleField, editor)
            },
            {
              label: 'Cell spacing',
              name: 'cellspacing'
            },
            {
              label: 'Cell padding',
              name: 'cellpadding'
            },
            {
              label: 'Border',
              name: 'border'
            },
            {
              label: 'Caption',
              name: 'caption',
              type: 'checkbox'
            }
          ] : [
            colsCtrl,
            rowsCtrl,
            {
              label: 'Width',
              name: 'width',
              onchange: $_brb4k3jijd24rk5p.curry($_b2ano0nbjd24rkks.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_brb4k3jijd24rk5p.curry($_b2ano0nbjd24rkks.updateStyleField, editor)
            }
          ]
        },
        {
          label: 'Alignment',
          name: 'align',
          type: 'listbox',
          text: 'None',
          values: [
            {
              text: 'None',
              value: ''
            },
            {
              text: 'Left',
              value: 'left'
            },
            {
              text: 'Center',
              value: 'center'
            },
            {
              text: 'Right',
              value: 'right'
            }
          ]
        },
        classListCtrl
      ]
    };
    if (editor.settings.table_advtab !== false) {
      editor.windowManager.open({
        title: 'Table properties',
        data: data,
        bodyType: 'tabpanel',
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalTableForm
          },
          $_b2ano0nbjd24rkks.createStyleForm(editor)
        ],
        onsubmit: $_brb4k3jijd24rk5p.curry(onSubmitTableForm, editor, tableElm)
      });
    } else {
      editor.windowManager.open({
        title: 'Table properties',
        data: data,
        body: generalTableForm,
        onsubmit: $_brb4k3jijd24rk5p.curry(onSubmitTableForm, editor, tableElm)
      });
    }
  };
  var $_4fehk0n8jd24rkkk = { open: open };

  var extractDataFromElement$1 = function (editor, elm) {
    var dom = editor.dom;
    var data = {
      height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
      scope: dom.getAttrib(elm, 'scope'),
      class: dom.getAttrib(elm, 'class')
    };
    data.type = elm.parentNode.nodeName.toLowerCase();
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'align' + name)) {
        data.align = name;
      }
    });
    if (editor.settings.table_row_advtab !== false) {
      Tools.extend(data, $_b2ano0nbjd24rkks.extractAdvancedStyles(dom, elm));
    }
    return data;
  };
  var switchRowType = function (dom, rowElm, toType) {
    var tableElm = dom.getParent(rowElm, 'table');
    var oldParentElm = rowElm.parentNode;
    var parentElm = dom.select(toType, tableElm)[0];
    if (!parentElm) {
      parentElm = dom.create(toType);
      if (tableElm.firstChild) {
        if (tableElm.firstChild.nodeName === 'CAPTION') {
          dom.insertAfter(parentElm, tableElm.firstChild);
        } else {
          tableElm.insertBefore(parentElm, tableElm.firstChild);
        }
      } else {
        tableElm.appendChild(parentElm);
      }
    }
    parentElm.appendChild(rowElm);
    if (!oldParentElm.hasChildNodes()) {
      dom.remove(oldParentElm);
    }
  };
  function onSubmitRowForm(editor, rows, evt) {
    var dom = editor.dom;
    var data;
    function setAttrib(elm, name, value) {
      if (value) {
        dom.setAttrib(elm, name, value);
      }
    }
    function setStyle(elm, name, value) {
      if (value) {
        dom.setStyle(elm, name, value);
      }
    }
    $_b2ano0nbjd24rkks.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    editor.undoManager.transact(function () {
      Tools.each(rows, function (rowElm) {
        setAttrib(rowElm, 'scope', data.scope);
        setAttrib(rowElm, 'style', data.style);
        setAttrib(rowElm, 'class', data.class);
        setStyle(rowElm, 'height', $_a6b2yhn2jd24rkjw.addSizeSuffix(data.height));
        if (data.type !== rowElm.parentNode.nodeName.toLowerCase()) {
          switchRowType(editor.dom, rowElm, data.type);
        }
        if (rows.length === 1) {
          $_90wvwnnajd24rkkq.unApplyAlign(editor, rowElm);
        }
        if (data.align) {
          $_90wvwnnajd24rkkq.applyAlign(editor, rowElm, data.align);
        }
      });
      editor.focus();
    });
  }
  var open$1 = function (editor) {
    var dom = editor.dom;
    var tableElm, cellElm, rowElm, classListCtrl, data;
    var rows = [];
    var generalRowForm;
    tableElm = dom.getParent(editor.selection.getStart(), 'table');
    cellElm = dom.getParent(editor.selection.getStart(), 'td,th');
    Tools.each(tableElm.rows, function (row) {
      Tools.each(row.cells, function (cell) {
        if (dom.getAttrib(cell, 'data-mce-selected') || cell === cellElm) {
          rows.push(row);
          return false;
        }
      });
    });
    rowElm = rows[0];
    if (!rowElm) {
      return;
    }
    if (rows.length > 1) {
      data = {
        height: '',
        scope: '',
        class: '',
        align: '',
        type: rowElm.parentNode.nodeName.toLowerCase()
      };
    } else {
      data = extractDataFromElement$1(editor, rowElm);
    }
    if (editor.settings.table_row_class_list) {
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_b2ano0nbjd24rkks.buildListItems(editor.settings.table_row_class_list, function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'tr',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    generalRowForm = {
      type: 'form',
      columns: 2,
      padding: 0,
      defaults: { type: 'textbox' },
      items: [
        {
          type: 'listbox',
          name: 'type',
          label: 'Row type',
          text: 'Header',
          maxWidth: null,
          values: [
            {
              text: 'Header',
              value: 'thead'
            },
            {
              text: 'Body',
              value: 'tbody'
            },
            {
              text: 'Footer',
              value: 'tfoot'
            }
          ]
        },
        {
          type: 'listbox',
          name: 'align',
          label: 'Alignment',
          text: 'None',
          maxWidth: null,
          values: [
            {
              text: 'None',
              value: ''
            },
            {
              text: 'Left',
              value: 'left'
            },
            {
              text: 'Center',
              value: 'center'
            },
            {
              text: 'Right',
              value: 'right'
            }
          ]
        },
        {
          label: 'Height',
          name: 'height'
        },
        classListCtrl
      ]
    };
    if (editor.settings.table_row_advtab !== false) {
      editor.windowManager.open({
        title: 'Row properties',
        data: data,
        bodyType: 'tabpanel',
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalRowForm
          },
          $_b2ano0nbjd24rkks.createStyleForm(editor)
        ],
        onsubmit: $_brb4k3jijd24rk5p.curry(onSubmitRowForm, editor, rows)
      });
    } else {
      editor.windowManager.open({
        title: 'Row properties',
        data: data,
        body: generalRowForm,
        onsubmit: $_brb4k3jijd24rk5p.curry(onSubmitRowForm, editor, rows)
      });
    }
  };
  var $_9k9te1ncjd24rkkx = { open: open$1 };

  var updateStyles = function (elm, cssText) {
    elm.style.cssText += ';' + cssText;
  };
  var extractDataFromElement$2 = function (editor, elm) {
    var dom = editor.dom;
    var data = {
      width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
      height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
      scope: dom.getAttrib(elm, 'scope'),
      class: dom.getAttrib(elm, 'class')
    };
    data.type = elm.nodeName.toLowerCase();
    Tools.each('left center right'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'align' + name)) {
        data.align = name;
      }
    });
    Tools.each('top middle bottom'.split(' '), function (name) {
      if (editor.formatter.matchNode(elm, 'valign' + name)) {
        data.valign = name;
      }
    });
    if (editor.settings.table_cell_advtab !== false) {
      Tools.extend(data, $_b2ano0nbjd24rkks.extractAdvancedStyles(dom, elm));
    }
    return data;
  };
  var onSubmitCellForm = function (editor, cells, evt) {
    var dom = editor.dom;
    var data;
    function setAttrib(elm, name, value) {
      if (value) {
        dom.setAttrib(elm, name, value);
      }
    }
    function setStyle(elm, name, value) {
      if (value) {
        dom.setStyle(elm, name, value);
      }
    }
    $_b2ano0nbjd24rkks.updateStyleField(editor, evt);
    data = evt.control.rootControl.toJSON();
    editor.undoManager.transact(function () {
      Tools.each(cells, function (cellElm) {
        setAttrib(cellElm, 'scope', data.scope);
        if (cells.length === 1) {
          setAttrib(cellElm, 'style', data.style);
        } else {
          updateStyles(cellElm, data.style);
        }
        setAttrib(cellElm, 'class', data.class);
        setStyle(cellElm, 'width', $_a6b2yhn2jd24rkjw.addSizeSuffix(data.width));
        setStyle(cellElm, 'height', $_a6b2yhn2jd24rkjw.addSizeSuffix(data.height));
        if (data.type && cellElm.nodeName.toLowerCase() !== data.type) {
          cellElm = dom.rename(cellElm, data.type);
        }
        if (cells.length === 1) {
          $_90wvwnnajd24rkkq.unApplyAlign(editor, cellElm);
          $_90wvwnnajd24rkkq.unApplyVAlign(editor, cellElm);
        }
        if (data.align) {
          $_90wvwnnajd24rkkq.applyAlign(editor, cellElm, data.align);
        }
        if (data.valign) {
          $_90wvwnnajd24rkkq.applyVAlign(editor, cellElm, data.valign);
        }
      });
      editor.focus();
    });
  };
  var open$2 = function (editor) {
    var cellElm, data, classListCtrl, cells = [];
    cells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
    cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');
    if (!cells.length && cellElm) {
      cells.push(cellElm);
    }
    cellElm = cellElm || cells[0];
    if (!cellElm) {
      return;
    }
    if (cells.length > 1) {
      data = {
        width: '',
        height: '',
        scope: '',
        class: '',
        align: '',
        style: '',
        type: cellElm.nodeName.toLowerCase()
      };
    } else {
      data = extractDataFromElement$2(editor, cellElm);
    }
    if (editor.settings.table_cell_class_list) {
      classListCtrl = {
        name: 'class',
        type: 'listbox',
        label: 'Class',
        values: $_b2ano0nbjd24rkks.buildListItems(editor.settings.table_cell_class_list, function (item) {
          if (item.value) {
            item.textStyle = function () {
              return editor.formatter.getCssText({
                block: 'td',
                classes: [item.value]
              });
            };
          }
        })
      };
    }
    var generalCellForm = {
      type: 'form',
      layout: 'flex',
      direction: 'column',
      labelGapCalc: 'children',
      padding: 0,
      items: [
        {
          type: 'form',
          layout: 'grid',
          columns: 2,
          labelGapCalc: false,
          padding: 0,
          defaults: {
            type: 'textbox',
            maxWidth: 50
          },
          items: [
            {
              label: 'Width',
              name: 'width',
              onchange: $_brb4k3jijd24rk5p.curry($_b2ano0nbjd24rkks.updateStyleField, editor)
            },
            {
              label: 'Height',
              name: 'height',
              onchange: $_brb4k3jijd24rk5p.curry($_b2ano0nbjd24rkks.updateStyleField, editor)
            },
            {
              label: 'Cell type',
              name: 'type',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'Cell',
                  value: 'td'
                },
                {
                  text: 'Header cell',
                  value: 'th'
                }
              ]
            },
            {
              label: 'Scope',
              name: 'scope',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Row',
                  value: 'row'
                },
                {
                  text: 'Column',
                  value: 'col'
                },
                {
                  text: 'Row group',
                  value: 'rowgroup'
                },
                {
                  text: 'Column group',
                  value: 'colgroup'
                }
              ]
            },
            {
              label: 'H Align',
              name: 'align',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Left',
                  value: 'left'
                },
                {
                  text: 'Center',
                  value: 'center'
                },
                {
                  text: 'Right',
                  value: 'right'
                }
              ]
            },
            {
              label: 'V Align',
              name: 'valign',
              type: 'listbox',
              text: 'None',
              minWidth: 90,
              maxWidth: null,
              values: [
                {
                  text: 'None',
                  value: ''
                },
                {
                  text: 'Top',
                  value: 'top'
                },
                {
                  text: 'Middle',
                  value: 'middle'
                },
                {
                  text: 'Bottom',
                  value: 'bottom'
                }
              ]
            }
          ]
        },
        classListCtrl
      ]
    };
    if (editor.settings.table_cell_advtab !== false) {
      editor.windowManager.open({
        title: 'Cell properties',
        bodyType: 'tabpanel',
        data: data,
        body: [
          {
            title: 'General',
            type: 'form',
            items: generalCellForm
          },
          $_b2ano0nbjd24rkks.createStyleForm(editor)
        ],
        onsubmit: $_brb4k3jijd24rk5p.curry(onSubmitCellForm, editor, cells)
      });
    } else {
      editor.windowManager.open({
        title: 'Cell properties',
        data: data,
        body: generalCellForm,
        onsubmit: $_brb4k3jijd24rk5p.curry(onSubmitCellForm, editor, cells)
      });
    }
  };
  var $_79qvugndjd24rkl2 = { open: open$2 };

  var each$3 = Tools.each;
  var clipboardRows = $_geu5gjhjd24rk5m.none();
  var getClipboardRows = function () {
    return clipboardRows.fold(function () {
      return;
    }, function (rows) {
      return $_821r2ajgjd24rk5h.map(rows, function (row) {
        return row.dom();
      });
    });
  };
  var setClipboardRows = function (rows) {
    var sugarRows = $_821r2ajgjd24rk5h.map(rows, $_6zx9pgjvjd24rk77.fromDom);
    clipboardRows = $_geu5gjhjd24rk5m.from(sugarRows);
  };
  var registerCommands = function (editor, actions, cellSelection, selections) {
    var isRoot = $_a6b2yhn2jd24rkjw.getIsRoot(editor);
    var eraseTable = function () {
      var cell = $_6zx9pgjvjd24rk77.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
      var table = $_60ksrkjsjd24rk6p.table(cell, isRoot);
      table.filter($_brb4k3jijd24rk5p.not(isRoot)).each(function (table) {
        var cursor = $_6zx9pgjvjd24rk77.fromText('');
        $_97r5mekrjd24rk9r.after(table, cursor);
        $_6k630dksjd24rk9s.remove(table);
        var rng = editor.dom.createRng();
        rng.setStart(cursor.dom(), 0);
        rng.setEnd(cursor.dom(), 0);
        editor.selection.setRng(rng);
      });
    };
    var getSelectionStartCell = function () {
      return $_6zx9pgjvjd24rk77.fromDom(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
    };
    var getTableFromCell = function (cell) {
      return $_60ksrkjsjd24rk6p.table(cell, isRoot);
    };
    var actOnSelection = function (execute) {
      var cell = getSelectionStartCell();
      var table = getTableFromCell(cell);
      table.each(function (table) {
        var targets = $_g6t26dl1jd24rkap.forMenu(selections, table, cell);
        execute(table, targets).each(function (rng) {
          editor.selection.setRng(rng);
          editor.focus();
          cellSelection.clear(table);
        });
      });
    };
    var copyRowSelection = function (execute) {
      var cell = getSelectionStartCell();
      var table = getTableFromCell(cell);
      return table.bind(function (table) {
        var doc = $_6zx9pgjvjd24rk77.fromDom(editor.getDoc());
        var targets = $_g6t26dl1jd24rkap.forMenu(selections, table, cell);
        var generators = $_3u7bywkujd24rk9y.cellOperations($_brb4k3jijd24rk5p.noop, doc, $_geu5gjhjd24rk5m.none());
        return $_4ftm2on6jd24rkkg.copyRows(table, targets, generators);
      });
    };
    var pasteOnSelection = function (execute) {
      clipboardRows.each(function (rows) {
        var clonedRows = $_821r2ajgjd24rk5h.map(rows, function (row) {
          return $_3mqh4mkvjd24rkaa.deep(row);
        });
        var cell = getSelectionStartCell();
        var table = getTableFromCell(cell);
        table.bind(function (table) {
          var doc = $_6zx9pgjvjd24rk77.fromDom(editor.getDoc());
          var generators = $_3u7bywkujd24rk9y.paste(doc);
          var targets = $_g6t26dl1jd24rkap.pasteRows(selections, table, cell, clonedRows, generators);
          execute(table, targets).each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
            cellSelection.clear(table);
          });
        });
      });
    };
    each$3({
      mceTableSplitCells: function () {
        actOnSelection(actions.unmergeCells);
      },
      mceTableMergeCells: function () {
        actOnSelection(actions.mergeCells);
      },
      mceTableInsertRowBefore: function () {
        actOnSelection(actions.insertRowsBefore);
      },
      mceTableInsertRowAfter: function () {
        actOnSelection(actions.insertRowsAfter);
      },
      mceTableInsertColBefore: function () {
        actOnSelection(actions.insertColumnsBefore);
      },
      mceTableInsertColAfter: function () {
        actOnSelection(actions.insertColumnsAfter);
      },
      mceTableDeleteCol: function () {
        actOnSelection(actions.deleteColumn);
      },
      mceTableDeleteRow: function () {
        actOnSelection(actions.deleteRow);
      },
      mceTableCutRow: function (grid) {
        clipboardRows = copyRowSelection();
        actOnSelection(actions.deleteRow);
      },
      mceTableCopyRow: function (grid) {
        clipboardRows = copyRowSelection();
      },
      mceTablePasteRowBefore: function (grid) {
        pasteOnSelection(actions.pasteRowsBefore);
      },
      mceTablePasteRowAfter: function (grid) {
        pasteOnSelection(actions.pasteRowsAfter);
      },
      mceTableDelete: eraseTable
    }, function (func, name) {
      editor.addCommand(name, func);
    });
    each$3({
      mceInsertTable: $_brb4k3jijd24rk5p.curry($_4fehk0n8jd24rkkk.open, editor),
      mceTableProps: $_brb4k3jijd24rk5p.curry($_4fehk0n8jd24rkkk.open, editor, true),
      mceTableRowProps: $_brb4k3jijd24rk5p.curry($_9k9te1ncjd24rkkx.open, editor),
      mceTableCellProps: $_brb4k3jijd24rk5p.curry($_79qvugndjd24rkl2.open, editor)
    }, function (func, name) {
      editor.addCommand(name, function (ui, val) {
        func(val);
      });
    });
  };
  var $_90iotyn5jd24rkk3 = {
    registerCommands: registerCommands,
    getClipboardRows: getClipboardRows,
    setClipboardRows: setClipboardRows
  };

  var only$1 = function (element) {
    var parent = $_geu5gjhjd24rk5m.from(element.dom().documentElement).map($_6zx9pgjvjd24rk77.fromDom).getOr(element);
    return {
      parent: $_brb4k3jijd24rk5p.constant(parent),
      view: $_brb4k3jijd24rk5p.constant(element),
      origin: $_brb4k3jijd24rk5p.constant(r(0, 0))
    };
  };
  var detached = function (editable, chrome) {
    var origin = $_brb4k3jijd24rk5p.curry($_3k046olxjd24rkew.absolute, chrome);
    return {
      parent: $_brb4k3jijd24rk5p.constant(chrome),
      view: $_brb4k3jijd24rk5p.constant(editable),
      origin: origin
    };
  };
  var body$1 = function (editable, chrome) {
    return {
      parent: $_brb4k3jijd24rk5p.constant(chrome),
      view: $_brb4k3jijd24rk5p.constant(editable),
      origin: $_brb4k3jijd24rk5p.constant(r(0, 0))
    };
  };
  var $_6mt6munfjd24rkle = {
    only: only$1,
    detached: detached,
    body: body$1
  };

  function Event (fields) {
    var struct = $_7p1bnnjljd24rk6a.immutable.apply(null, fields);
    var handlers = [];
    var bind = function (handler) {
      if (handler === undefined) {
        throw 'Event bind error: undefined handler';
      }
      handlers.push(handler);
    };
    var unbind = function (handler) {
      handlers = $_821r2ajgjd24rk5h.filter(handlers, function (h) {
        return h !== handler;
      });
    };
    var trigger = function () {
      var event = struct.apply(null, arguments);
      $_821r2ajgjd24rk5h.each(handlers, function (handler) {
        handler(event);
      });
    };
    return {
      bind: bind,
      unbind: unbind,
      trigger: trigger
    };
  }

  var create = function (typeDefs) {
    var registry = $_vpx6ajkjd24rk68.map(typeDefs, function (event) {
      return {
        bind: event.bind,
        unbind: event.unbind
      };
    });
    var trigger = $_vpx6ajkjd24rk68.map(typeDefs, function (event) {
      return event.trigger;
    });
    return {
      registry: registry,
      trigger: trigger
    };
  };
  var $_enj623nijd24rklu = { create: create };

  var mode = $_7tn8m0m4jd24rkft.exactly([
    'compare',
    'extract',
    'mutate',
    'sink'
  ]);
  var sink = $_7tn8m0m4jd24rkft.exactly([
    'element',
    'start',
    'stop',
    'destroy'
  ]);
  var api$3 = $_7tn8m0m4jd24rkft.exactly([
    'forceDrop',
    'drop',
    'move',
    'delayDrop'
  ]);
  var $_das06dnmjd24rkmi = {
    mode: mode,
    sink: sink,
    api: api$3
  };

  var styles$1 = $_dcqifmmkjd24rki5.css('ephox-dragster');
  var $_cixuhdnojd24rkmp = { resolve: styles$1.resolve };

  function Blocker (options) {
    var settings = $_7rq5b3m9jd24rkgm.merge({ 'layerClass': $_cixuhdnojd24rkmp.resolve('blocker') }, options);
    var div = $_6zx9pgjvjd24rk77.fromTag('div');
    $_4ni5ekkgjd24rk8l.set(div, 'role', 'presentation');
    $_ftduaokpjd24rk9i.setAll(div, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%'
    });
    $_17vk2qmljd24rki6.add(div, $_cixuhdnojd24rkmp.resolve('blocker'));
    $_17vk2qmljd24rki6.add(div, settings.layerClass);
    var element = function () {
      return div;
    };
    var destroy = function () {
      $_6k630dksjd24rk9s.remove(div);
    };
    return {
      element: element,
      destroy: destroy
    };
  }

  var mkEvent = function (target, x, y, stop, prevent, kill, raw) {
    return {
      'target': $_brb4k3jijd24rk5p.constant(target),
      'x': $_brb4k3jijd24rk5p.constant(x),
      'y': $_brb4k3jijd24rk5p.constant(y),
      'stop': stop,
      'prevent': prevent,
      'kill': kill,
      'raw': $_brb4k3jijd24rk5p.constant(raw)
    };
  };
  var handle = function (filter, handler) {
    return function (rawEvent) {
      if (!filter(rawEvent))
        return;
      var target = $_6zx9pgjvjd24rk77.fromDom(rawEvent.target);
      var stop = function () {
        rawEvent.stopPropagation();
      };
      var prevent = function () {
        rawEvent.preventDefault();
      };
      var kill = $_brb4k3jijd24rk5p.compose(prevent, stop);
      var evt = mkEvent(target, rawEvent.clientX, rawEvent.clientY, stop, prevent, kill, rawEvent);
      handler(evt);
    };
  };
  var binder = function (element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler);
    element.dom().addEventListener(event, wrapped, useCapture);
    return { unbind: $_brb4k3jijd24rk5p.curry(unbind, element, event, wrapped, useCapture) };
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
  var $_6lchnznqjd24rkmt = {
    bind: bind$1,
    capture: capture
  };

  var filter$1 = $_brb4k3jijd24rk5p.constant(true);
  var bind$2 = function (element, event, handler) {
    return $_6lchnznqjd24rkmt.bind(element, event, filter$1, handler);
  };
  var capture$1 = function (element, event, handler) {
    return $_6lchnznqjd24rkmt.capture(element, event, filter$1, handler);
  };
  var $_6ox4y5npjd24rkmr = {
    bind: bind$2,
    capture: capture$1
  };

  var compare = function (old, nu) {
    return r(nu.left() - old.left(), nu.top() - old.top());
  };
  var extract$1 = function (event) {
    return $_geu5gjhjd24rk5m.some(r(event.x(), event.y()));
  };
  var mutate$1 = function (mutation, info) {
    mutation.mutate(info.left(), info.top());
  };
  var sink$1 = function (dragApi, settings) {
    var blocker = Blocker(settings);
    var mdown = $_6ox4y5npjd24rkmr.bind(blocker.element(), 'mousedown', dragApi.forceDrop);
    var mup = $_6ox4y5npjd24rkmr.bind(blocker.element(), 'mouseup', dragApi.drop);
    var mmove = $_6ox4y5npjd24rkmr.bind(blocker.element(), 'mousemove', dragApi.move);
    var mout = $_6ox4y5npjd24rkmr.bind(blocker.element(), 'mouseout', dragApi.delayDrop);
    var destroy = function () {
      blocker.destroy();
      mup.unbind();
      mmove.unbind();
      mout.unbind();
      mdown.unbind();
    };
    var start = function (parent) {
      $_97r5mekrjd24rk9r.append(parent, blocker.element());
    };
    var stop = function () {
      $_6k630dksjd24rk9s.remove(blocker.element());
    };
    return $_das06dnmjd24rkmi.sink({
      element: blocker.element,
      start: start,
      stop: stop,
      destroy: destroy
    });
  };
  var MouseDrag = $_das06dnmjd24rkmi.mode({
    compare: compare,
    extract: extract$1,
    sink: sink$1,
    mutate: mutate$1
  });

  function InDrag () {
    var previous = $_geu5gjhjd24rk5m.none();
    var reset = function () {
      previous = $_geu5gjhjd24rk5m.none();
    };
    var update = function (mode, nu) {
      var result = previous.map(function (old) {
        return mode.compare(old, nu);
      });
      previous = $_geu5gjhjd24rk5m.some(nu);
      return result;
    };
    var onEvent = function (event, mode) {
      var dataOption = mode.extract(event);
      dataOption.each(function (data) {
        var offset = update(mode, data);
        offset.each(function (d) {
          events.trigger.move(d);
        });
      });
    };
    var events = $_enj623nijd24rklu.create({ move: Event(['info']) });
    return {
      onEvent: onEvent,
      reset: reset,
      events: events.registry
    };
  }

  function NoDrag (anchor) {
    var onEvent = function (event, mode) {
    };
    return {
      onEvent: onEvent,
      reset: $_brb4k3jijd24rk5p.noop
    };
  }

  function Movement () {
    var noDragState = NoDrag();
    var inDragState = InDrag();
    var dragState = noDragState;
    var on = function () {
      dragState.reset();
      dragState = inDragState;
    };
    var off = function () {
      dragState.reset();
      dragState = noDragState;
    };
    var onEvent = function (event, mode) {
      dragState.onEvent(event, mode);
    };
    var isOn = function () {
      return dragState === inDragState;
    };
    return {
      on: on,
      off: off,
      isOn: isOn,
      onEvent: onEvent,
      events: inDragState.events
    };
  }

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
  var $_bpjzktnvjd24rknc = {
    adaptable: adaptable,
    first: first$4,
    last: last$3
  };

  var setup = function (mutation, mode, settings) {
    var active = false;
    var events = $_enj623nijd24rklu.create({
      start: Event([]),
      stop: Event([])
    });
    var movement = Movement();
    var drop = function () {
      sink.stop();
      if (movement.isOn()) {
        movement.off();
        events.trigger.stop();
      }
    };
    var throttledDrop = $_bpjzktnvjd24rknc.last(drop, 200);
    var go = function (parent) {
      sink.start(parent);
      movement.on();
      events.trigger.start();
    };
    var mousemove = function (event, ui) {
      throttledDrop.cancel();
      movement.onEvent(event, mode);
    };
    movement.events.move.bind(function (event) {
      mode.mutate(mutation, event.info());
    });
    var on = function () {
      active = true;
    };
    var off = function () {
      active = false;
    };
    var runIfActive = function (f) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        if (active) {
          return f.apply(null, args);
        }
      };
    };
    var sink = mode.sink($_das06dnmjd24rkmi.api({
      forceDrop: drop,
      drop: runIfActive(drop),
      move: runIfActive(mousemove),
      delayDrop: runIfActive(throttledDrop.throttle)
    }), settings);
    var destroy = function () {
      sink.destroy();
    };
    return {
      element: sink.element,
      go: go,
      on: on,
      off: off,
      destroy: destroy,
      events: events.registry
    };
  };
  var $_cnsitlnrjd24rkmx = { setup: setup };

  var transform$1 = function (mutation, options) {
    var settings = options !== undefined ? options : {};
    var mode = settings.mode !== undefined ? settings.mode : MouseDrag;
    return $_cnsitlnrjd24rkmx.setup(mutation, mode, options);
  };
  var $_2vamusnkjd24rkmb = { transform: transform$1 };

  function Mutation () {
    var events = $_enj623nijd24rklu.create({
      'drag': Event([
        'xDelta',
        'yDelta'
      ])
    });
    var mutate = function (x, y) {
      events.trigger.drag(x, y);
    };
    return {
      mutate: mutate,
      events: events.registry
    };
  }

  function BarMutation () {
    var events = $_enj623nijd24rklu.create({
      drag: Event([
        'xDelta',
        'yDelta',
        'target'
      ])
    });
    var target = $_geu5gjhjd24rk5m.none();
    var delegate = Mutation();
    delegate.events.drag.bind(function (event) {
      target.each(function (t) {
        events.trigger.drag(event.xDelta(), event.yDelta(), t);
      });
    });
    var assign = function (t) {
      target = $_geu5gjhjd24rk5m.some(t);
    };
    var get = function () {
      return target;
    };
    return {
      assign: assign,
      get: get,
      mutate: delegate.mutate,
      events: events.registry
    };
  }

  var any = function (selector) {
    return $_e7vzfkljd24rk8y.first(selector).isSome();
  };
  var ancestor$2 = function (scope, selector, isRoot) {
    return $_e7vzfkljd24rk8y.ancestor(scope, selector, isRoot).isSome();
  };
  var sibling$2 = function (scope, selector) {
    return $_e7vzfkljd24rk8y.sibling(scope, selector).isSome();
  };
  var child$3 = function (scope, selector) {
    return $_e7vzfkljd24rk8y.child(scope, selector).isSome();
  };
  var descendant$2 = function (scope, selector) {
    return $_e7vzfkljd24rk8y.descendant(scope, selector).isSome();
  };
  var closest$2 = function (scope, selector, isRoot) {
    return $_e7vzfkljd24rk8y.closest(scope, selector, isRoot).isSome();
  };
  var $_bqs94cnyjd24rknl = {
    any: any,
    ancestor: ancestor$2,
    sibling: sibling$2,
    child: child$3,
    descendant: descendant$2,
    closest: closest$2
  };

  var resizeBarDragging = $_bop07zmjjd24rki3.resolve('resizer-bar-dragging');
  function BarManager (wire, direction, hdirection) {
    var mutation = BarMutation();
    var resizing = $_2vamusnkjd24rkmb.transform(mutation, {});
    var hoverTable = $_geu5gjhjd24rk5m.none();
    var getResizer = function (element, type) {
      return $_geu5gjhjd24rk5m.from($_4ni5ekkgjd24rk8l.get(element, type));
    };
    mutation.events.drag.bind(function (event) {
      getResizer(event.target(), 'data-row').each(function (_dataRow) {
        var currentRow = $_7hcblcmzjd24rkjj.getInt(event.target(), 'top');
        $_ftduaokpjd24rk9i.set(event.target(), 'top', currentRow + event.yDelta() + 'px');
      });
      getResizer(event.target(), 'data-column').each(function (_dataCol) {
        var currentCol = $_7hcblcmzjd24rkjj.getInt(event.target(), 'left');
        $_ftduaokpjd24rk9i.set(event.target(), 'left', currentCol + event.xDelta() + 'px');
      });
    });
    var getDelta = function (target, direction) {
      var newX = $_7hcblcmzjd24rkjj.getInt(target, direction);
      var oldX = parseInt($_4ni5ekkgjd24rk8l.get(target, 'data-initial-' + direction), 10);
      return newX - oldX;
    };
    resizing.events.stop.bind(function () {
      mutation.get().each(function (target) {
        hoverTable.each(function (table) {
          getResizer(target, 'data-row').each(function (row) {
            var delta = getDelta(target, 'top');
            $_4ni5ekkgjd24rk8l.remove(target, 'data-initial-top');
            events.trigger.adjustHeight(table, delta, parseInt(row, 10));
          });
          getResizer(target, 'data-column').each(function (column) {
            var delta = getDelta(target, 'left');
            $_4ni5ekkgjd24rk8l.remove(target, 'data-initial-left');
            events.trigger.adjustWidth(table, delta, parseInt(column, 10));
          });
          $_cqn4oymfjd24rkhg.refresh(wire, table, hdirection, direction);
        });
      });
    });
    var handler = function (target, direction) {
      events.trigger.startAdjust();
      mutation.assign(target);
      $_4ni5ekkgjd24rk8l.set(target, 'data-initial-' + direction, parseInt($_ftduaokpjd24rk9i.get(target, direction), 10));
      $_17vk2qmljd24rki6.add(target, resizeBarDragging);
      $_ftduaokpjd24rk9i.set(target, 'opacity', '0.2');
      resizing.go(wire.parent());
    };
    var mousedown = $_6ox4y5npjd24rkmr.bind(wire.parent(), 'mousedown', function (event) {
      if ($_cqn4oymfjd24rkhg.isRowBar(event.target()))
        handler(event.target(), 'top');
      if ($_cqn4oymfjd24rkhg.isColBar(event.target()))
        handler(event.target(), 'left');
    });
    var isRoot = function (e) {
      return $_c6tuisjzjd24rk7o.eq(e, wire.view());
    };
    var mouseover = $_6ox4y5npjd24rkmr.bind(wire.view(), 'mouseover', function (event) {
      if ($_sc7pgkhjd24rk8q.name(event.target()) === 'table' || $_bqs94cnyjd24rknl.ancestor(event.target(), 'table', isRoot)) {
        hoverTable = $_sc7pgkhjd24rk8q.name(event.target()) === 'table' ? $_geu5gjhjd24rk5m.some(event.target()) : $_e7vzfkljd24rk8y.ancestor(event.target(), 'table', isRoot);
        hoverTable.each(function (ht) {
          $_cqn4oymfjd24rkhg.refresh(wire, ht, hdirection, direction);
        });
      } else if ($_6ezo74kkjd24rk8v.inBody(event.target())) {
        $_cqn4oymfjd24rkhg.destroy(wire);
      }
    });
    var destroy = function () {
      mousedown.unbind();
      mouseover.unbind();
      resizing.destroy();
      $_cqn4oymfjd24rkhg.destroy(wire);
    };
    var refresh = function (tbl) {
      $_cqn4oymfjd24rkhg.refresh(wire, tbl, hdirection, direction);
    };
    var events = $_enj623nijd24rklu.create({
      adjustHeight: Event([
        'table',
        'delta',
        'row'
      ]),
      adjustWidth: Event([
        'table',
        'delta',
        'column'
      ]),
      startAdjust: Event([])
    });
    return {
      destroy: destroy,
      refresh: refresh,
      on: resizing.on,
      off: resizing.off,
      hideBars: $_brb4k3jijd24rk5p.curry($_cqn4oymfjd24rkhg.hide, wire),
      showBars: $_brb4k3jijd24rk5p.curry($_cqn4oymfjd24rkhg.show, wire),
      events: events.registry
    };
  }

  function TableResize (wire, vdirection) {
    var hdirection = $_9tp6ulwjd24rkeq.height;
    var manager = BarManager(wire, vdirection, hdirection);
    var events = $_enj623nijd24rklu.create({
      beforeResize: Event(['table']),
      afterResize: Event(['table']),
      startDrag: Event([])
    });
    manager.events.adjustHeight.bind(function (event) {
      events.trigger.beforeResize(event.table());
      var delta = hdirection.delta(event.delta(), event.table());
      $_3srypfmvjd24rkj5.adjustHeight(event.table(), delta, event.row(), hdirection);
      events.trigger.afterResize(event.table());
    });
    manager.events.startAdjust.bind(function (event) {
      events.trigger.startDrag();
    });
    manager.events.adjustWidth.bind(function (event) {
      events.trigger.beforeResize(event.table());
      var delta = vdirection.delta(event.delta(), event.table());
      $_3srypfmvjd24rkj5.adjustWidth(event.table(), delta, event.column(), vdirection);
      events.trigger.afterResize(event.table());
    });
    return {
      on: manager.on,
      off: manager.off,
      hideBars: manager.hideBars,
      showBars: manager.showBars,
      destroy: manager.destroy,
      events: events.registry
    };
  }

  var createContainer = function () {
    var container = $_6zx9pgjvjd24rk77.fromTag('div');
    $_ftduaokpjd24rk9i.setAll(container, {
      position: 'static',
      height: '0',
      width: '0',
      padding: '0',
      margin: '0',
      border: '0'
    });
    $_97r5mekrjd24rk9r.append($_6ezo74kkjd24rk8v.body(), container);
    return container;
  };
  var get$8 = function (editor, container) {
    return editor.inline ? $_6mt6munfjd24rkle.body($_a6b2yhn2jd24rkjw.getBody(editor), createContainer()) : $_6mt6munfjd24rkle.only($_6zx9pgjvjd24rk77.fromDom(editor.getDoc()));
  };
  var remove$6 = function (editor, wire) {
    if (editor.inline) {
      $_6k630dksjd24rk9s.remove(wire.parent());
    }
  };
  var $_amyp8jnzjd24rknn = {
    get: get$8,
    remove: remove$6
  };

  function ResizeHandler (editor) {
    var selectionRng = $_geu5gjhjd24rk5m.none();
    var resize = $_geu5gjhjd24rk5m.none();
    var wire = $_geu5gjhjd24rk5m.none();
    var percentageBasedSizeRegex = /(\d+(\.\d+)?)%/;
    var startW, startRawW;
    var isTable = function (elm) {
      return elm.nodeName === 'TABLE';
    };
    var getRawWidth = function (elm) {
      return editor.dom.getStyle(elm, 'width') || editor.dom.getAttrib(elm, 'width');
    };
    var lazyResize = function () {
      return resize;
    };
    var lazyWire = function () {
      return wire.getOr($_6mt6munfjd24rkle.only($_6zx9pgjvjd24rk77.fromDom(editor.getBody())));
    };
    var destroy = function () {
      resize.each(function (sz) {
        sz.destroy();
      });
      wire.each(function (w) {
        $_amyp8jnzjd24rknn.remove(editor, w);
      });
    };
    editor.on('init', function () {
      var direction = TableDirection($_2g3t0n3jd24rkjz.directionAt);
      var rawWire = $_amyp8jnzjd24rknn.get(editor);
      wire = $_geu5gjhjd24rk5m.some(rawWire);
      if (editor.settings.object_resizing && editor.settings.table_resize_bars !== false && (editor.settings.object_resizing === true || editor.settings.object_resizing === 'table')) {
        var sz = TableResize(rawWire, direction);
        sz.on();
        sz.events.startDrag.bind(function (event) {
          selectionRng = $_geu5gjhjd24rk5m.some(editor.selection.getRng());
        });
        sz.events.afterResize.bind(function (event) {
          var table = event.table();
          var dataStyleCells = $_ec4gn6kijd24rk8r.descendants(table, 'td[data-mce-style],th[data-mce-style]');
          $_821r2ajgjd24rk5h.each(dataStyleCells, function (cell) {
            $_4ni5ekkgjd24rk8l.remove(cell, 'data-mce-style');
          });
          selectionRng.each(function (rng) {
            editor.selection.setRng(rng);
            editor.focus();
          });
          editor.undoManager.add();
        });
        resize = $_geu5gjhjd24rk5m.some(sz);
      }
    });
    editor.on('ObjectResizeStart', function (e) {
      if (isTable(e.target)) {
        startW = e.width;
        startRawW = getRawWidth(e.target);
      }
    });
    editor.on('ObjectResized', function (e) {
      if (isTable(e.target)) {
        var table = e.target;
        if (percentageBasedSizeRegex.test(startRawW)) {
          var percentW = parseFloat(percentageBasedSizeRegex.exec(startRawW)[1]);
          var targetPercentW = e.width * percentW / startW;
          editor.dom.setStyle(table, 'width', targetPercentW + '%');
        } else {
          var newCellSizes_1 = [];
          Tools.each(table.rows, function (row) {
            Tools.each(row.cells, function (cell) {
              var width = editor.dom.getStyle(cell, 'width', true);
              newCellSizes_1.push({
                cell: cell,
                width: width
              });
            });
          });
          Tools.each(newCellSizes_1, function (newCellSize) {
            editor.dom.setStyle(newCellSize.cell, 'width', newCellSize.width);
            editor.dom.setAttrib(newCellSize.cell, 'width', null);
          });
        }
      }
    });
    return {
      lazyResize: lazyResize,
      lazyWire: lazyWire,
      destroy: destroy
    };
  }

  var none$2 = function (current) {
    return folder$1(function (n, f, m, l) {
      return n(current);
    });
  };
  var first$5 = function (current) {
    return folder$1(function (n, f, m, l) {
      return f(current);
    });
  };
  var middle$1 = function (current, target) {
    return folder$1(function (n, f, m, l) {
      return m(current, target);
    });
  };
  var last$4 = function (current) {
    return folder$1(function (n, f, m, l) {
      return l(current);
    });
  };
  var folder$1 = function (fold) {
    return { fold: fold };
  };
  var $_g88m3jo2jd24rko6 = {
    none: none$2,
    first: first$5,
    middle: middle$1,
    last: last$4
  };

  var detect$4 = function (current, isRoot) {
    return $_60ksrkjsjd24rk6p.table(current, isRoot).bind(function (table) {
      var all = $_60ksrkjsjd24rk6p.cells(table);
      var index = $_821r2ajgjd24rk5h.findIndex(all, function (x) {
        return $_c6tuisjzjd24rk7o.eq(current, x);
      });
      return index.map(function (ind) {
        return {
          index: $_brb4k3jijd24rk5p.constant(ind),
          all: $_brb4k3jijd24rk5p.constant(all)
        };
      });
    });
  };
  var next = function (current, isRoot) {
    var detection = detect$4(current, isRoot);
    return detection.fold(function () {
      return $_g88m3jo2jd24rko6.none(current);
    }, function (info) {
      return info.index() + 1 < info.all().length ? $_g88m3jo2jd24rko6.middle(current, info.all()[info.index() + 1]) : $_g88m3jo2jd24rko6.last(current);
    });
  };
  var prev = function (current, isRoot) {
    var detection = detect$4(current, isRoot);
    return detection.fold(function () {
      return $_g88m3jo2jd24rko6.none();
    }, function (info) {
      return info.index() - 1 >= 0 ? $_g88m3jo2jd24rko6.middle(current, info.all()[info.index() - 1]) : $_g88m3jo2jd24rko6.first(current);
    });
  };
  var $_cvs7kgo1jd24rko2 = {
    next: next,
    prev: prev
  };

  var adt = $_24qudflijd24rkd4.generate([
    { 'before': ['element'] },
    {
      'on': [
        'element',
        'offset'
      ]
    },
    { after: ['element'] }
  ]);
  var cata$1 = function (subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter);
  };
  var getStart = function (situ) {
    return situ.fold($_brb4k3jijd24rk5p.identity, $_brb4k3jijd24rk5p.identity, $_brb4k3jijd24rk5p.identity);
  };
  var $_9leghho4jd24rkoc = {
    before: adt.before,
    on: adt.on,
    after: adt.after,
    cata: cata$1,
    getStart: getStart
  };

  var type$2 = $_24qudflijd24rkd4.generate([
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
  var range$2 = $_7p1bnnjljd24rk6a.immutable('start', 'soffset', 'finish', 'foffset');
  var exactFromRange = function (simRange) {
    return type$2.exact(simRange.start(), simRange.soffset(), simRange.finish(), simRange.foffset());
  };
  var getStart$1 = function (selection) {
    return selection.match({
      domRange: function (rng) {
        return $_6zx9pgjvjd24rk77.fromDom(rng.startContainer);
      },
      relative: function (startSitu, finishSitu) {
        return $_9leghho4jd24rkoc.getStart(startSitu);
      },
      exact: function (start, soffset, finish, foffset) {
        return start;
      }
    });
  };
  var getWin = function (selection) {
    var start = getStart$1(selection);
    return $_8rtodrjxjd24rk7b.defaultView(start);
  };
  var $_2nstlyo3jd24rko8 = {
    domRange: type$2.domRange,
    relative: type$2.relative,
    exact: type$2.exact,
    exactFromRange: exactFromRange,
    range: range$2,
    getWin: getWin
  };

  var makeRange = function (start, soffset, finish, foffset) {
    var doc = $_8rtodrjxjd24rk7b.owner(start);
    var rng = doc.dom().createRange();
    rng.setStart(start.dom(), soffset);
    rng.setEnd(finish.dom(), foffset);
    return rng;
  };
  var commonAncestorContainer = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    return $_6zx9pgjvjd24rk77.fromDom(r.commonAncestorContainer);
  };
  var after$2 = function (start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset);
    var same = $_c6tuisjzjd24rk7o.eq(start, finish) && soffset === foffset;
    return r.collapsed && !same;
  };
  var $_f6f0o8o6jd24rkok = {
    after: after$2,
    commonAncestorContainer: commonAncestorContainer
  };

  var fromElements = function (elements, scope) {
    var doc = scope || document;
    var fragment = doc.createDocumentFragment();
    $_821r2ajgjd24rk5h.each(elements, function (element) {
      fragment.appendChild(element.dom());
    });
    return $_6zx9pgjvjd24rk77.fromDom(fragment);
  };
  var $_7t4cbto7jd24rkol = { fromElements: fromElements };

  var selectNodeContents = function (win, element) {
    var rng = win.document.createRange();
    selectNodeContentsUsing(rng, element);
    return rng;
  };
  var selectNodeContentsUsing = function (rng, element) {
    rng.selectNodeContents(element.dom());
  };
  var isWithin$1 = function (outerRange, innerRange) {
    return innerRange.compareBoundaryPoints(outerRange.END_TO_START, outerRange) < 1 && innerRange.compareBoundaryPoints(outerRange.START_TO_END, outerRange) > -1;
  };
  var create$1 = function (win) {
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
    return $_6zx9pgjvjd24rk77.fromDom(fragment);
  };
  var toRect = function (rect) {
    return {
      left: $_brb4k3jijd24rk5p.constant(rect.left),
      top: $_brb4k3jijd24rk5p.constant(rect.top),
      right: $_brb4k3jijd24rk5p.constant(rect.right),
      bottom: $_brb4k3jijd24rk5p.constant(rect.bottom),
      width: $_brb4k3jijd24rk5p.constant(rect.width),
      height: $_brb4k3jijd24rk5p.constant(rect.height)
    };
  };
  var getFirstRect = function (rng) {
    var rects = rng.getClientRects();
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_geu5gjhjd24rk5m.some(rect).map(toRect) : $_geu5gjhjd24rk5m.none();
  };
  var getBounds$1 = function (rng) {
    var rect = rng.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0 ? $_geu5gjhjd24rk5m.some(rect).map(toRect) : $_geu5gjhjd24rk5m.none();
  };
  var toString = function (rng) {
    return rng.toString();
  };
  var $_cxzqyso8jd24rkoq = {
    create: create$1,
    replaceWith: replaceWith,
    selectNodeContents: selectNodeContents,
    selectNodeContentsUsing: selectNodeContentsUsing,
    relativeToNative: relativeToNative,
    exactToNative: exactToNative,
    deleteContents: deleteContents,
    cloneFragment: cloneFragment,
    getFirstRect: getFirstRect,
    getBounds: getBounds$1,
    isWithin: isWithin$1,
    toString: toString
  };

  var adt$1 = $_24qudflijd24rkd4.generate([
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
    return type($_6zx9pgjvjd24rk77.fromDom(range.startContainer), range.startOffset, $_6zx9pgjvjd24rk77.fromDom(range.endContainer), range.endOffset);
  };
  var getRanges = function (win, selection) {
    return selection.match({
      domRange: function (rng) {
        return {
          ltr: $_brb4k3jijd24rk5p.constant(rng),
          rtl: $_geu5gjhjd24rk5m.none
        };
      },
      relative: function (startSitu, finishSitu) {
        return {
          ltr: $_aoukxgk5jd24rk80.cached(function () {
            return $_cxzqyso8jd24rkoq.relativeToNative(win, startSitu, finishSitu);
          }),
          rtl: $_aoukxgk5jd24rk80.cached(function () {
            return $_geu5gjhjd24rk5m.some($_cxzqyso8jd24rkoq.relativeToNative(win, finishSitu, startSitu));
          })
        };
      },
      exact: function (start, soffset, finish, foffset) {
        return {
          ltr: $_aoukxgk5jd24rk80.cached(function () {
            return $_cxzqyso8jd24rkoq.exactToNative(win, start, soffset, finish, foffset);
          }),
          rtl: $_aoukxgk5jd24rk80.cached(function () {
            return $_geu5gjhjd24rk5m.some($_cxzqyso8jd24rkoq.exactToNative(win, finish, foffset, start, soffset));
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
        return adt$1.rtl($_6zx9pgjvjd24rk77.fromDom(rev.endContainer), rev.endOffset, $_6zx9pgjvjd24rk77.fromDom(rev.startContainer), rev.startOffset);
      }).getOrThunk(function () {
        return fromRange(win, adt$1.ltr, rng);
      });
    } else {
      return fromRange(win, adt$1.ltr, rng);
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
  var $_4wzb57o9jd24rkov = {
    ltr: adt$1.ltr,
    rtl: adt$1.rtl,
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
  var $_6haywmocjd24rkp7 = {
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
    var length = $_864owvkyjd24rkai.get(textnode).length;
    var offset = $_6haywmocjd24rkp7.searchForPoint(rectForOffset, x, y, rect.right, length);
    return rangeForOffset(offset);
  };
  var locate = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rects = r.getClientRects();
    var foundRect = $_eci14jmajd24rkgo.findMap(rects, function (rect) {
      return $_6haywmocjd24rkp7.inRect(rect, x, y) ? $_geu5gjhjd24rk5m.some(rect) : $_geu5gjhjd24rk5m.none();
    });
    return foundRect.map(function (rect) {
      return locateOffset(doc, node, x, y, rect);
    });
  };
  var $_sai92odjd24rkp9 = { locate: locate };

  var searchInChildren = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    var nodes = $_8rtodrjxjd24rk7b.children(node);
    return $_eci14jmajd24rkgo.findMap(nodes, function (n) {
      r.selectNode(n.dom());
      return $_6haywmocjd24rkp7.inRect(r.getBoundingClientRect(), x, y) ? locateNode(doc, n, x, y) : $_geu5gjhjd24rk5m.none();
    });
  };
  var locateNode = function (doc, node, x, y) {
    var locator = $_sc7pgkhjd24rk8q.isText(node) ? $_sai92odjd24rkp9.locate : searchInChildren;
    return locator(doc, node, x, y);
  };
  var locate$1 = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return locateNode(doc, node, boundedX, boundedY);
  };
  var $_7wpzk2objd24rkp4 = { locate: locate$1 };

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
    var f = collapseDirection === COLLAPSE_TO_LEFT ? $_59jad4kwjd24rkad.first : $_59jad4kwjd24rkad.last;
    return f(node).map(function (target) {
      return createCollapsedNode(doc, target, collapseDirection);
    });
  };
  var locateInEmpty = function (doc, node, x) {
    var rect = node.dom().getBoundingClientRect();
    var collapseDirection = getCollapseDirection(rect, x);
    return $_geu5gjhjd24rk5m.some(createCollapsedNode(doc, node, collapseDirection));
  };
  var search = function (doc, node, x) {
    var f = $_8rtodrjxjd24rk7b.children(node).length === 0 ? locateInEmpty : locateInElement;
    return f(doc, node, x);
  };
  var $_d60nptoejd24rkpd = { search: search };

  var caretPositionFromPoint = function (doc, x, y) {
    return $_geu5gjhjd24rk5m.from(doc.dom().caretPositionFromPoint(x, y)).bind(function (pos) {
      if (pos.offsetNode === null)
        return $_geu5gjhjd24rk5m.none();
      var r = doc.dom().createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse();
      return $_geu5gjhjd24rk5m.some(r);
    });
  };
  var caretRangeFromPoint = function (doc, x, y) {
    return $_geu5gjhjd24rk5m.from(doc.dom().caretRangeFromPoint(x, y));
  };
  var searchTextNodes = function (doc, node, x, y) {
    var r = doc.dom().createRange();
    r.selectNode(node.dom());
    var rect = r.getBoundingClientRect();
    var boundedX = Math.max(rect.left, Math.min(rect.right, x));
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y));
    return $_7wpzk2objd24rkp4.locate(doc, node, boundedX, boundedY);
  };
  var searchFromPoint = function (doc, x, y) {
    return $_6zx9pgjvjd24rk77.fromPoint(doc, x, y).bind(function (elem) {
      var fallback = function () {
        return $_d60nptoejd24rkpd.search(doc, elem, x);
      };
      return $_8rtodrjxjd24rk7b.children(elem).length === 0 ? fallback() : searchTextNodes(doc, elem, x, y).orThunk(fallback);
    });
  };
  var availableSearch = document.caretPositionFromPoint ? caretPositionFromPoint : document.caretRangeFromPoint ? caretRangeFromPoint : searchFromPoint;
  var fromPoint$1 = function (win, x, y) {
    var doc = $_6zx9pgjvjd24rk77.fromDom(win.document);
    return availableSearch(doc, x, y).map(function (rng) {
      return $_2nstlyo3jd24rko8.range($_6zx9pgjvjd24rk77.fromDom(rng.startContainer), rng.startOffset, $_6zx9pgjvjd24rk77.fromDom(rng.endContainer), rng.endOffset);
    });
  };
  var $_4lnli4oajd24rkp1 = { fromPoint: fromPoint$1 };

  var withinContainer = function (win, ancestor, outerRange, selector) {
    var innerRange = $_cxzqyso8jd24rkoq.create(win);
    var self = $_807qyjujd24rk73.is(ancestor, selector) ? [ancestor] : [];
    var elements = self.concat($_ec4gn6kijd24rk8r.descendants(ancestor, selector));
    return $_821r2ajgjd24rk5h.filter(elements, function (elem) {
      $_cxzqyso8jd24rkoq.selectNodeContentsUsing(innerRange, elem);
      return $_cxzqyso8jd24rkoq.isWithin(outerRange, innerRange);
    });
  };
  var find$3 = function (win, selection, selector) {
    var outerRange = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    var ancestor = $_6zx9pgjvjd24rk77.fromDom(outerRange.commonAncestorContainer);
    return $_sc7pgkhjd24rk8q.isElement(ancestor) ? withinContainer(win, ancestor, outerRange, selector) : [];
  };
  var $_awz0ruofjd24rkpf = { find: find$3 };

  var beforeSpecial = function (element, offset) {
    var name = $_sc7pgkhjd24rk8q.name(element);
    if ('input' === name)
      return $_9leghho4jd24rkoc.after(element);
    else if (!$_821r2ajgjd24rk5h.contains([
        'br',
        'img'
      ], name))
      return $_9leghho4jd24rkoc.on(element, offset);
    else
      return offset === 0 ? $_9leghho4jd24rkoc.before(element) : $_9leghho4jd24rkoc.after(element);
  };
  var preprocessRelative = function (startSitu, finishSitu) {
    var start = startSitu.fold($_9leghho4jd24rkoc.before, beforeSpecial, $_9leghho4jd24rkoc.after);
    var finish = finishSitu.fold($_9leghho4jd24rkoc.before, beforeSpecial, $_9leghho4jd24rkoc.after);
    return $_2nstlyo3jd24rko8.relative(start, finish);
  };
  var preprocessExact = function (start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset);
    var finishSitu = beforeSpecial(finish, foffset);
    return $_2nstlyo3jd24rko8.relative(startSitu, finishSitu);
  };
  var preprocess = function (selection) {
    return selection.match({
      domRange: function (rng) {
        var start = $_6zx9pgjvjd24rk77.fromDom(rng.startContainer);
        var finish = $_6zx9pgjvjd24rk77.fromDom(rng.endContainer);
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset);
      },
      relative: preprocessRelative,
      exact: preprocessExact
    });
  };
  var $_61upheogjd24rkpi = {
    beforeSpecial: beforeSpecial,
    preprocess: preprocess,
    preprocessRelative: preprocessRelative,
    preprocessExact: preprocessExact
  };

  var doSetNativeRange = function (win, rng) {
    $_geu5gjhjd24rk5m.from(win.getSelection()).each(function (selection) {
      selection.removeAllRanges();
      selection.addRange(rng);
    });
  };
  var doSetRange = function (win, start, soffset, finish, foffset) {
    var rng = $_cxzqyso8jd24rkoq.exactToNative(win, start, soffset, finish, foffset);
    doSetNativeRange(win, rng);
  };
  var findWithin = function (win, selection, selector) {
    return $_awz0ruofjd24rkpf.find(win, selection, selector);
  };
  var setRangeFromRelative = function (win, relative) {
    return $_4wzb57o9jd24rkov.diagnose(win, relative).match({
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
    var relative = $_61upheogjd24rkpi.preprocessExact(start, soffset, finish, foffset);
    setRangeFromRelative(win, relative);
  };
  var setRelative = function (win, startSitu, finishSitu) {
    var relative = $_61upheogjd24rkpi.preprocessRelative(startSitu, finishSitu);
    setRangeFromRelative(win, relative);
  };
  var toNative = function (selection) {
    var win = $_2nstlyo3jd24rko8.getWin(selection).dom();
    var getDomRange = function (start, soffset, finish, foffset) {
      return $_cxzqyso8jd24rkoq.exactToNative(win, start, soffset, finish, foffset);
    };
    var filtered = $_61upheogjd24rkpi.preprocess(selection);
    return $_4wzb57o9jd24rkov.diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    });
  };
  var readRange = function (selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0);
      var lastRng = selection.getRangeAt(selection.rangeCount - 1);
      return $_geu5gjhjd24rk5m.some($_2nstlyo3jd24rko8.range($_6zx9pgjvjd24rk77.fromDom(firstRng.startContainer), firstRng.startOffset, $_6zx9pgjvjd24rk77.fromDom(lastRng.endContainer), lastRng.endOffset));
    } else {
      return $_geu5gjhjd24rk5m.none();
    }
  };
  var doGetExact = function (selection) {
    var anchorNode = $_6zx9pgjvjd24rk77.fromDom(selection.anchorNode);
    var focusNode = $_6zx9pgjvjd24rk77.fromDom(selection.focusNode);
    return $_f6f0o8o6jd24rkok.after(anchorNode, selection.anchorOffset, focusNode, selection.focusOffset) ? $_geu5gjhjd24rk5m.some($_2nstlyo3jd24rko8.range($_6zx9pgjvjd24rk77.fromDom(selection.anchorNode), selection.anchorOffset, $_6zx9pgjvjd24rk77.fromDom(selection.focusNode), selection.focusOffset)) : readRange(selection);
  };
  var setToElement = function (win, element) {
    var rng = $_cxzqyso8jd24rkoq.selectNodeContents(win, element);
    doSetNativeRange(win, rng);
  };
  var forElement = function (win, element) {
    var rng = $_cxzqyso8jd24rkoq.selectNodeContents(win, element);
    return $_2nstlyo3jd24rko8.range($_6zx9pgjvjd24rk77.fromDom(rng.startContainer), rng.startOffset, $_6zx9pgjvjd24rk77.fromDom(rng.endContainer), rng.endOffset);
  };
  var getExact = function (win) {
    var selection = win.getSelection();
    return selection.rangeCount > 0 ? doGetExact(selection) : $_geu5gjhjd24rk5m.none();
  };
  var get$9 = function (win) {
    return getExact(win).map(function (range) {
      return $_2nstlyo3jd24rko8.exact(range.start(), range.soffset(), range.finish(), range.foffset());
    });
  };
  var getFirstRect$1 = function (win, selection) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    return $_cxzqyso8jd24rkoq.getFirstRect(rng);
  };
  var getBounds$2 = function (win, selection) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    return $_cxzqyso8jd24rkoq.getBounds(rng);
  };
  var getAtPoint = function (win, x, y) {
    return $_4lnli4oajd24rkp1.fromPoint(win, x, y);
  };
  var getAsString = function (win, selection) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    return $_cxzqyso8jd24rkoq.toString(rng);
  };
  var clear$1 = function (win) {
    var selection = win.getSelection();
    selection.removeAllRanges();
  };
  var clone$2 = function (win, selection) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    return $_cxzqyso8jd24rkoq.cloneFragment(rng);
  };
  var replace$1 = function (win, selection, elements) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    var fragment = $_7t4cbto7jd24rkol.fromElements(elements, win.document);
    $_cxzqyso8jd24rkoq.replaceWith(rng, fragment);
  };
  var deleteAt = function (win, selection) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    $_cxzqyso8jd24rkoq.deleteContents(rng);
  };
  var isCollapsed = function (start, soffset, finish, foffset) {
    return $_c6tuisjzjd24rk7o.eq(start, finish) && soffset === foffset;
  };
  var $_1a4kdlo5jd24rkof = {
    setExact: setExact,
    getExact: getExact,
    get: get$9,
    setRelative: setRelative,
    toNative: toNative,
    setToElement: setToElement,
    clear: clear$1,
    clone: clone$2,
    replace: replace$1,
    deleteAt: deleteAt,
    forElement: forElement,
    getFirstRect: getFirstRect$1,
    getBounds: getBounds$2,
    getAtPoint: getAtPoint,
    findWithin: findWithin,
    getAsString: getAsString,
    isCollapsed: isCollapsed
  };

  var VK = tinymce.util.Tools.resolve('tinymce.util.VK');

  var forward = function (editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, $_cvs7kgo1jd24rko2.next(cell), lazyWire);
  };
  var backward = function (editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, $_cvs7kgo1jd24rko2.prev(cell), lazyWire);
  };
  var getCellFirstCursorPosition = function (editor, cell) {
    var selection = $_2nstlyo3jd24rko8.exact(cell, 0, cell, 0);
    return $_1a4kdlo5jd24rkof.toNative(selection);
  };
  var getNewRowCursorPosition = function (editor, table) {
    var rows = $_ec4gn6kijd24rk8r.descendants(table, 'tr');
    return $_821r2ajgjd24rk5h.last(rows).bind(function (last) {
      return $_e7vzfkljd24rk8y.descendant(last, 'td,th').map(function (first) {
        return getCellFirstCursorPosition(editor, first);
      });
    });
  };
  var go = function (editor, isRoot, cell, actions, lazyWire) {
    return cell.fold($_geu5gjhjd24rk5m.none, $_geu5gjhjd24rk5m.none, function (current, next) {
      return $_59jad4kwjd24rkad.first(next).map(function (cell) {
        return getCellFirstCursorPosition(editor, cell);
      });
    }, function (current) {
      return $_60ksrkjsjd24rk6p.table(current, isRoot).bind(function (table) {
        var targets = $_g6t26dl1jd24rkap.noMenu(current);
        editor.undoManager.transact(function () {
          actions.insertRowsAfter(table, targets);
        });
        return getNewRowCursorPosition(editor, table);
      });
    });
  };
  var rootElements = [
    'table',
    'li',
    'dl'
  ];
  var handle$1 = function (event, editor, actions, lazyWire) {
    if (event.keyCode === VK.TAB) {
      var body_1 = $_a6b2yhn2jd24rkjw.getBody(editor);
      var isRoot_1 = function (element) {
        var name = $_sc7pgkhjd24rk8q.name(element);
        return $_c6tuisjzjd24rk7o.eq(element, body_1) || $_821r2ajgjd24rk5h.contains(rootElements, name);
      };
      var rng = editor.selection.getRng();
      if (rng.collapsed) {
        var start = $_6zx9pgjvjd24rk77.fromDom(rng.startContainer);
        $_60ksrkjsjd24rk6p.cell(start, isRoot_1).each(function (cell) {
          event.preventDefault();
          var navigation = event.shiftKey ? backward : forward;
          var rng = navigation(editor, isRoot_1, cell, actions, lazyWire);
          rng.each(function (range) {
            editor.selection.setRng(range);
          });
        });
      }
    }
  };
  var $_c3nz3po0jd24rkns = { handle: handle$1 };

  var response = $_7p1bnnjljd24rk6a.immutable('selection', 'kill');
  var $_2ktrnxokjd24rkqb = { response: response };

  var isKey = function (key) {
    return function (keycode) {
      return keycode === key;
    };
  };
  var isUp = isKey(38);
  var isDown = isKey(40);
  var isNavigation = function (keycode) {
    return keycode >= 37 && keycode <= 40;
  };
  var $_q6r0boljd24rkqc = {
    ltr: {
      isBackward: isKey(37),
      isForward: isKey(39)
    },
    rtl: {
      isBackward: isKey(39),
      isForward: isKey(37)
    },
    isUp: isUp,
    isDown: isDown,
    isNavigation: isNavigation
  };

  var convertToRange = function (win, selection) {
    var rng = $_4wzb57o9jd24rkov.asLtrRange(win, selection);
    return {
      start: $_brb4k3jijd24rk5p.constant($_6zx9pgjvjd24rk77.fromDom(rng.startContainer)),
      soffset: $_brb4k3jijd24rk5p.constant(rng.startOffset),
      finish: $_brb4k3jijd24rk5p.constant($_6zx9pgjvjd24rk77.fromDom(rng.endContainer)),
      foffset: $_brb4k3jijd24rk5p.constant(rng.endOffset)
    };
  };
  var makeSitus = function (start, soffset, finish, foffset) {
    return {
      start: $_brb4k3jijd24rk5p.constant($_9leghho4jd24rkoc.on(start, soffset)),
      finish: $_brb4k3jijd24rk5p.constant($_9leghho4jd24rkoc.on(finish, foffset))
    };
  };
  var $_5o4tjbonjd24rkqm = {
    convertToRange: convertToRange,
    makeSitus: makeSitus
  };

  var isSafari = $_cdhubfk4jd24rk7y.detect().browser.isSafari();
  var get$10 = function (_doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var x = doc.body.scrollLeft || doc.documentElement.scrollLeft;
    var y = doc.body.scrollTop || doc.documentElement.scrollTop;
    return r(x, y);
  };
  var to = function (x, y, _doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var win = doc.defaultView;
    win.scrollTo(x, y);
  };
  var by = function (x, y, _doc) {
    var doc = _doc !== undefined ? _doc.dom() : document;
    var win = doc.defaultView;
    win.scrollBy(x, y);
  };
  var setToElement$1 = function (win, element) {
    var pos = $_3k046olxjd24rkew.absolute(element);
    var doc = $_6zx9pgjvjd24rk77.fromDom(win.document);
    to(pos.left(), pos.top(), doc);
  };
  var preserve$1 = function (doc, f) {
    var before = get$10(doc);
    f();
    var after = get$10(doc);
    if (before.top() !== after.top() || before.left() !== after.left()) {
      to(before.left(), before.top(), doc);
    }
  };
  var capture$2 = function (doc) {
    var previous = $_geu5gjhjd24rk5m.none();
    var save = function () {
      previous = $_geu5gjhjd24rk5m.some(get$10(doc));
    };
    var restore = function () {
      previous.each(function (p) {
        to(p.left(), p.top(), doc);
      });
    };
    save();
    return {
      save: save,
      restore: restore
    };
  };
  var intoView = function (element, alignToTop) {
    if (isSafari && $_g4fo8ljpjd24rk6g.isFunction(element.dom().scrollIntoViewIfNeeded)) {
      element.dom().scrollIntoViewIfNeeded(false);
    } else {
      element.dom().scrollIntoView(alignToTop);
    }
  };
  var intoViewIfNeeded = function (element, container) {
    var containerBox = container.dom().getBoundingClientRect();
    var elementBox = element.dom().getBoundingClientRect();
    if (elementBox.top < containerBox.top) {
      intoView(element, true);
    } else if (elementBox.bottom > containerBox.bottom) {
      intoView(element, false);
    }
  };
  var scrollBarWidth = function () {
    var scrollDiv = $_6zx9pgjvjd24rk77.fromHtml('<div style="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;"></div>');
    $_97r5mekrjd24rk9r.after($_6ezo74kkjd24rk8v.body(), scrollDiv);
    var w = scrollDiv.dom().offsetWidth - scrollDiv.dom().clientWidth;
    $_6k630dksjd24rk9s.remove(scrollDiv);
    return w;
  };
  var $_6mh5fjoojd24rkqr = {
    get: get$10,
    to: to,
    by: by,
    preserve: preserve$1,
    capture: capture$2,
    intoView: intoView,
    intoViewIfNeeded: intoViewIfNeeded,
    setToElement: setToElement$1,
    scrollBarWidth: scrollBarWidth
  };

  function WindowBridge (win) {
    var elementFromPoint = function (x, y) {
      return $_geu5gjhjd24rk5m.from(win.document.elementFromPoint(x, y)).map($_6zx9pgjvjd24rk77.fromDom);
    };
    var getRect = function (element) {
      return element.dom().getBoundingClientRect();
    };
    var getRangedRect = function (start, soffset, finish, foffset) {
      var sel = $_2nstlyo3jd24rko8.exact(start, soffset, finish, foffset);
      return $_1a4kdlo5jd24rkof.getFirstRect(win, sel).map(function (structRect) {
        return $_vpx6ajkjd24rk68.map(structRect, $_brb4k3jijd24rk5p.apply);
      });
    };
    var getSelection = function () {
      return $_1a4kdlo5jd24rkof.get(win).map(function (exactAdt) {
        return $_5o4tjbonjd24rkqm.convertToRange(win, exactAdt);
      });
    };
    var fromSitus = function (situs) {
      var relative = $_2nstlyo3jd24rko8.relative(situs.start(), situs.finish());
      return $_5o4tjbonjd24rkqm.convertToRange(win, relative);
    };
    var situsFromPoint = function (x, y) {
      return $_1a4kdlo5jd24rkof.getAtPoint(win, x, y).map(function (exact) {
        return {
          start: $_brb4k3jijd24rk5p.constant($_9leghho4jd24rkoc.on(exact.start(), exact.soffset())),
          finish: $_brb4k3jijd24rk5p.constant($_9leghho4jd24rkoc.on(exact.finish(), exact.foffset()))
        };
      });
    };
    var clearSelection = function () {
      $_1a4kdlo5jd24rkof.clear(win);
    };
    var selectContents = function (element) {
      $_1a4kdlo5jd24rkof.setToElement(win, element);
    };
    var setSelection = function (sel) {
      $_1a4kdlo5jd24rkof.setExact(win, sel.start(), sel.soffset(), sel.finish(), sel.foffset());
    };
    var setRelativeSelection = function (start, finish) {
      $_1a4kdlo5jd24rkof.setRelative(win, start, finish);
    };
    var getInnerHeight = function () {
      return win.innerHeight;
    };
    var getScrollY = function () {
      var pos = $_6mh5fjoojd24rkqr.get($_6zx9pgjvjd24rk77.fromDom(win.document));
      return pos.top();
    };
    var scrollBy = function (x, y) {
      $_6mh5fjoojd24rkqr.by(x, y, $_6zx9pgjvjd24rk77.fromDom(win.document));
    };
    return {
      elementFromPoint: elementFromPoint,
      getRect: getRect,
      getRangedRect: getRangedRect,
      getSelection: getSelection,
      fromSitus: fromSitus,
      situsFromPoint: situsFromPoint,
      clearSelection: clearSelection,
      setSelection: setSelection,
      setRelativeSelection: setRelativeSelection,
      selectContents: selectContents,
      getInnerHeight: getInnerHeight,
      getScrollY: getScrollY,
      scrollBy: scrollBy
    };
  }

  var sync = function (container, isRoot, start, soffset, finish, foffset, selectRange) {
    if (!($_c6tuisjzjd24rk7o.eq(start, finish) && soffset === foffset)) {
      return $_e7vzfkljd24rk8y.closest(start, 'td,th', isRoot).bind(function (s) {
        return $_e7vzfkljd24rk8y.closest(finish, 'td,th', isRoot).bind(function (f) {
          return detect$5(container, isRoot, s, f, selectRange);
        });
      });
    } else {
      return $_geu5gjhjd24rk5m.none();
    }
  };
  var detect$5 = function (container, isRoot, start, finish, selectRange) {
    if (!$_c6tuisjzjd24rk7o.eq(start, finish)) {
      return $_cz5shl4jd24rkb7.identify(start, finish, isRoot).bind(function (cellSel) {
        var boxes = cellSel.boxes().getOr([]);
        if (boxes.length > 0) {
          selectRange(container, boxes, cellSel.start(), cellSel.finish());
          return $_geu5gjhjd24rk5m.some($_2ktrnxokjd24rkqb.response($_geu5gjhjd24rk5m.some($_5o4tjbonjd24rkqm.makeSitus(start, 0, start, $_fgxy34kxjd24rkaf.getEnd(start))), true));
        } else {
          return $_geu5gjhjd24rk5m.none();
        }
      });
    }
  };
  var update = function (rows, columns, container, selected, annotations) {
    var updateSelection = function (newSels) {
      annotations.clear(container);
      annotations.selectRange(container, newSels.boxes(), newSels.start(), newSels.finish());
      return newSels.boxes();
    };
    return $_cz5shl4jd24rkb7.shiftSelection(selected, rows, columns, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(updateSelection);
  };
  var $_3iphxnopjd24rkqy = {
    sync: sync,
    detect: detect$5,
    update: update
  };

  var nu$3 = $_7p1bnnjljd24rk6a.immutableBag([
    'left',
    'top',
    'right',
    'bottom'
  ], []);
  var moveDown = function (caret, amount) {
    return nu$3({
      left: caret.left(),
      top: caret.top() + amount,
      right: caret.right(),
      bottom: caret.bottom() + amount
    });
  };
  var moveUp = function (caret, amount) {
    return nu$3({
      left: caret.left(),
      top: caret.top() - amount,
      right: caret.right(),
      bottom: caret.bottom() - amount
    });
  };
  var moveBottomTo = function (caret, bottom) {
    var height = caret.bottom() - caret.top();
    return nu$3({
      left: caret.left(),
      top: bottom - height,
      right: caret.right(),
      bottom: bottom
    });
  };
  var moveTopTo = function (caret, top) {
    var height = caret.bottom() - caret.top();
    return nu$3({
      left: caret.left(),
      top: top,
      right: caret.right(),
      bottom: top + height
    });
  };
  var translate = function (caret, xDelta, yDelta) {
    return nu$3({
      left: caret.left() + xDelta,
      top: caret.top() + yDelta,
      right: caret.right() + xDelta,
      bottom: caret.bottom() + yDelta
    });
  };
  var getTop$1 = function (caret) {
    return caret.top();
  };
  var getBottom = function (caret) {
    return caret.bottom();
  };
  var toString$1 = function (caret) {
    return '(' + caret.left() + ', ' + caret.top() + ') -> (' + caret.right() + ', ' + caret.bottom() + ')';
  };
  var $_3td4icosjd24rkrr = {
    nu: nu$3,
    moveUp: moveUp,
    moveDown: moveDown,
    moveBottomTo: moveBottomTo,
    moveTopTo: moveTopTo,
    getTop: getTop$1,
    getBottom: getBottom,
    translate: translate,
    toString: toString$1
  };

  var getPartialBox = function (bridge, element, offset) {
    if (offset >= 0 && offset < $_fgxy34kxjd24rkaf.getEnd(element))
      return bridge.getRangedRect(element, offset, element, offset + 1);
    else if (offset > 0)
      return bridge.getRangedRect(element, offset - 1, element, offset);
    return $_geu5gjhjd24rk5m.none();
  };
  var toCaret = function (rect) {
    return $_3td4icosjd24rkrr.nu({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    });
  };
  var getElemBox = function (bridge, element) {
    return $_geu5gjhjd24rk5m.some(bridge.getRect(element));
  };
  var getBoxAt = function (bridge, element, offset) {
    if ($_sc7pgkhjd24rk8q.isElement(element))
      return getElemBox(bridge, element).map(toCaret);
    else if ($_sc7pgkhjd24rk8q.isText(element))
      return getPartialBox(bridge, element, offset).map(toCaret);
    else
      return $_geu5gjhjd24rk5m.none();
  };
  var getEntireBox = function (bridge, element) {
    if ($_sc7pgkhjd24rk8q.isElement(element))
      return getElemBox(bridge, element).map(toCaret);
    else if ($_sc7pgkhjd24rk8q.isText(element))
      return bridge.getRangedRect(element, 0, element, $_fgxy34kxjd24rkaf.getEnd(element)).map(toCaret);
    else
      return $_geu5gjhjd24rk5m.none();
  };
  var $_7dmqnvotjd24rkry = {
    getBoxAt: getBoxAt,
    getEntireBox: getEntireBox
  };

  var traverse = $_7p1bnnjljd24rk6a.immutable('item', 'mode');
  var backtrack = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : sidestep;
    return universe.property().parent(item).map(function (p) {
      return traverse(p, transition);
    });
  };
  var sidestep = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : advance;
    return direction.sibling(universe, item).map(function (p) {
      return traverse(p, transition);
    });
  };
  var advance = function (universe, item, direction, _transition) {
    var transition = _transition !== undefined ? _transition : advance;
    var children = universe.property().children(item);
    var result = direction.first(children);
    return result.map(function (r) {
      return traverse(r, transition);
    });
  };
  var successors = [
    {
      current: backtrack,
      next: sidestep,
      fallback: $_geu5gjhjd24rk5m.none()
    },
    {
      current: sidestep,
      next: advance,
      fallback: $_geu5gjhjd24rk5m.some(backtrack)
    },
    {
      current: advance,
      next: advance,
      fallback: $_geu5gjhjd24rk5m.some(sidestep)
    }
  ];
  var go$1 = function (universe, item, mode, direction, rules) {
    var rules = rules !== undefined ? rules : successors;
    var ruleOpt = $_821r2ajgjd24rk5h.find(rules, function (succ) {
      return succ.current === mode;
    });
    return ruleOpt.bind(function (rule) {
      return rule.current(universe, item, direction, rule.next).orThunk(function () {
        return rule.fallback.bind(function (fb) {
          return go$1(universe, item, fb, direction);
        });
      });
    });
  };
  var $_cwodzboyjd24rksk = {
    backtrack: backtrack,
    sidestep: sidestep,
    advance: advance,
    go: go$1
  };

  var left$1 = function () {
    var sibling = function (universe, item) {
      return universe.query().prevSibling(item);
    };
    var first = function (children) {
      return children.length > 0 ? $_geu5gjhjd24rk5m.some(children[children.length - 1]) : $_geu5gjhjd24rk5m.none();
    };
    return {
      sibling: sibling,
      first: first
    };
  };
  var right$1 = function () {
    var sibling = function (universe, item) {
      return universe.query().nextSibling(item);
    };
    var first = function (children) {
      return children.length > 0 ? $_geu5gjhjd24rk5m.some(children[0]) : $_geu5gjhjd24rk5m.none();
    };
    return {
      sibling: sibling,
      first: first
    };
  };
  var $_g0oyljozjd24rkso = {
    left: left$1,
    right: right$1
  };

  var hone = function (universe, item, predicate, mode, direction, isRoot) {
    var next = $_cwodzboyjd24rksk.go(universe, item, mode, direction);
    return next.bind(function (n) {
      if (isRoot(n.item()))
        return $_geu5gjhjd24rk5m.none();
      else
        return predicate(n.item()) ? $_geu5gjhjd24rk5m.some(n.item()) : hone(universe, n.item(), predicate, n.mode(), direction, isRoot);
    });
  };
  var left$2 = function (universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, $_cwodzboyjd24rksk.sidestep, $_g0oyljozjd24rkso.left(), isRoot);
  };
  var right$2 = function (universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, $_cwodzboyjd24rksk.sidestep, $_g0oyljozjd24rkso.right(), isRoot);
  };
  var $_gadh5zoxjd24rksh = {
    left: left$2,
    right: right$2
  };

  var isLeaf = function (universe, element) {
    return universe.property().children(element).length === 0;
  };
  var before$2 = function (universe, item, isRoot) {
    return seekLeft(universe, item, $_brb4k3jijd24rk5p.curry(isLeaf, universe), isRoot);
  };
  var after$3 = function (universe, item, isRoot) {
    return seekRight(universe, item, $_brb4k3jijd24rk5p.curry(isLeaf, universe), isRoot);
  };
  var seekLeft = function (universe, item, predicate, isRoot) {
    return $_gadh5zoxjd24rksh.left(universe, item, predicate, isRoot);
  };
  var seekRight = function (universe, item, predicate, isRoot) {
    return $_gadh5zoxjd24rksh.right(universe, item, predicate, isRoot);
  };
  var walkers = function () {
    return {
      left: $_g0oyljozjd24rkso.left,
      right: $_g0oyljozjd24rkso.right
    };
  };
  var walk = function (universe, item, mode, direction, _rules) {
    return $_cwodzboyjd24rksk.go(universe, item, mode, direction, _rules);
  };
  var $_eh4yotowjd24rksf = {
    before: before$2,
    after: after$3,
    seekLeft: seekLeft,
    seekRight: seekRight,
    walkers: walkers,
    walk: walk,
    backtrack: $_cwodzboyjd24rksk.backtrack,
    sidestep: $_cwodzboyjd24rksk.sidestep,
    advance: $_cwodzboyjd24rksk.advance
  };

  var universe$2 = DomUniverse();
  var gather = function (element, prune, transform) {
    return $_eh4yotowjd24rksf.gather(universe$2, element, prune, transform);
  };
  var before$3 = function (element, isRoot) {
    return $_eh4yotowjd24rksf.before(universe$2, element, isRoot);
  };
  var after$4 = function (element, isRoot) {
    return $_eh4yotowjd24rksf.after(universe$2, element, isRoot);
  };
  var seekLeft$1 = function (element, predicate, isRoot) {
    return $_eh4yotowjd24rksf.seekLeft(universe$2, element, predicate, isRoot);
  };
  var seekRight$1 = function (element, predicate, isRoot) {
    return $_eh4yotowjd24rksf.seekRight(universe$2, element, predicate, isRoot);
  };
  var walkers$1 = function () {
    return $_eh4yotowjd24rksf.walkers();
  };
  var walk$1 = function (item, mode, direction, _rules) {
    return $_eh4yotowjd24rksf.walk(universe$2, item, mode, direction, _rules);
  };
  var $_370x9movjd24rksd = {
    gather: gather,
    before: before$3,
    after: after$4,
    seekLeft: seekLeft$1,
    seekRight: seekRight$1,
    walkers: walkers$1,
    walk: walk$1
  };

  var JUMP_SIZE = 5;
  var NUM_RETRIES = 100;
  var adt$2 = $_24qudflijd24rkd4.generate([
    { 'none': [] },
    { 'retry': ['caret'] }
  ]);
  var isOutside = function (caret, box) {
    return caret.left() < box.left() || Math.abs(box.right() - caret.left()) < 1 || caret.left() > box.right();
  };
  var inOutsideBlock = function (bridge, element, caret) {
    return $_dnxapkkmjd24rk8z.closest(element, $_g9xax0m6jd24rkg6.isBlock).fold($_brb4k3jijd24rk5p.constant(false), function (cell) {
      return $_7dmqnvotjd24rkry.getEntireBox(bridge, cell).exists(function (box) {
        return isOutside(caret, box);
      });
    });
  };
  var adjustDown = function (bridge, element, guessBox, original, caret) {
    var lowerCaret = $_3td4icosjd24rkrr.moveDown(caret, JUMP_SIZE);
    if (Math.abs(guessBox.bottom() - original.bottom()) < 1)
      return adt$2.retry(lowerCaret);
    else if (guessBox.top() > caret.bottom())
      return adt$2.retry(lowerCaret);
    else if (guessBox.top() === caret.bottom())
      return adt$2.retry($_3td4icosjd24rkrr.moveDown(caret, 1));
    else
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry($_3td4icosjd24rkrr.translate(lowerCaret, JUMP_SIZE, 0)) : adt$2.none();
  };
  var adjustUp = function (bridge, element, guessBox, original, caret) {
    var higherCaret = $_3td4icosjd24rkrr.moveUp(caret, JUMP_SIZE);
    if (Math.abs(guessBox.top() - original.top()) < 1)
      return adt$2.retry(higherCaret);
    else if (guessBox.bottom() < caret.top())
      return adt$2.retry(higherCaret);
    else if (guessBox.bottom() === caret.top())
      return adt$2.retry($_3td4icosjd24rkrr.moveUp(caret, 1));
    else
      return inOutsideBlock(bridge, element, caret) ? adt$2.retry($_3td4icosjd24rkrr.translate(higherCaret, JUMP_SIZE, 0)) : adt$2.none();
  };
  var upMovement = {
    point: $_3td4icosjd24rkrr.getTop,
    adjuster: adjustUp,
    move: $_3td4icosjd24rkrr.moveUp,
    gather: $_370x9movjd24rksd.before
  };
  var downMovement = {
    point: $_3td4icosjd24rkrr.getBottom,
    adjuster: adjustDown,
    move: $_3td4icosjd24rkrr.moveDown,
    gather: $_370x9movjd24rksd.after
  };
  var isAtTable = function (bridge, x, y) {
    return bridge.elementFromPoint(x, y).filter(function (elm) {
      return $_sc7pgkhjd24rk8q.name(elm) === 'table';
    }).isSome();
  };
  var adjustForTable = function (bridge, movement, original, caret, numRetries) {
    return adjustTil(bridge, movement, original, movement.move(caret, JUMP_SIZE), numRetries);
  };
  var adjustTil = function (bridge, movement, original, caret, numRetries) {
    if (numRetries === 0)
      return $_geu5gjhjd24rk5m.some(caret);
    if (isAtTable(bridge, caret.left(), movement.point(caret)))
      return adjustForTable(bridge, movement, original, caret, numRetries - 1);
    return bridge.situsFromPoint(caret.left(), movement.point(caret)).bind(function (guess) {
      return guess.start().fold($_geu5gjhjd24rk5m.none, function (element, offset) {
        return $_7dmqnvotjd24rkry.getEntireBox(bridge, element, offset).bind(function (guessBox) {
          return movement.adjuster(bridge, element, guessBox, original, caret).fold($_geu5gjhjd24rk5m.none, function (newCaret) {
            return adjustTil(bridge, movement, original, newCaret, numRetries - 1);
          });
        }).orThunk(function () {
          return $_geu5gjhjd24rk5m.some(caret);
        });
      }, $_geu5gjhjd24rk5m.none);
    });
  };
  var ieTryDown = function (bridge, caret) {
    return bridge.situsFromPoint(caret.left(), caret.bottom() + JUMP_SIZE);
  };
  var ieTryUp = function (bridge, caret) {
    return bridge.situsFromPoint(caret.left(), caret.top() - JUMP_SIZE);
  };
  var checkScroll = function (movement, adjusted, bridge) {
    if (movement.point(adjusted) > bridge.getInnerHeight())
      return $_geu5gjhjd24rk5m.some(movement.point(adjusted) - bridge.getInnerHeight());
    else if (movement.point(adjusted) < 0)
      return $_geu5gjhjd24rk5m.some(-movement.point(adjusted));
    else
      return $_geu5gjhjd24rk5m.none();
  };
  var retry = function (movement, bridge, caret) {
    var moved = movement.move(caret, JUMP_SIZE);
    var adjusted = adjustTil(bridge, movement, caret, moved, NUM_RETRIES).getOr(moved);
    return checkScroll(movement, adjusted, bridge).fold(function () {
      return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted));
    }, function (delta) {
      bridge.scrollBy(0, delta);
      return bridge.situsFromPoint(adjusted.left(), movement.point(adjusted) - delta);
    });
  };
  var $_3nmdj9oujd24rks3 = {
    tryUp: $_brb4k3jijd24rk5p.curry(retry, upMovement),
    tryDown: $_brb4k3jijd24rk5p.curry(retry, downMovement),
    ieTryUp: ieTryUp,
    ieTryDown: ieTryDown,
    getJumpSize: $_brb4k3jijd24rk5p.constant(JUMP_SIZE)
  };

  var adt$3 = $_24qudflijd24rkd4.generate([
    { 'none': ['message'] },
    { 'success': [] },
    { 'failedUp': ['cell'] },
    { 'failedDown': ['cell'] }
  ]);
  var isOverlapping = function (bridge, before, after) {
    var beforeBounds = bridge.getRect(before);
    var afterBounds = bridge.getRect(after);
    return afterBounds.right > beforeBounds.left && afterBounds.left < beforeBounds.right;
  };
  var verify = function (bridge, before, beforeOffset, after, afterOffset, failure, isRoot) {
    return $_e7vzfkljd24rk8y.closest(after, 'td,th', isRoot).bind(function (afterCell) {
      return $_e7vzfkljd24rk8y.closest(before, 'td,th', isRoot).map(function (beforeCell) {
        if (!$_c6tuisjzjd24rk7o.eq(afterCell, beforeCell)) {
          return $_9kdbu6l5jd24rkbj.sharedOne(isRow, [
            afterCell,
            beforeCell
          ]).fold(function () {
            return isOverlapping(bridge, beforeCell, afterCell) ? adt$3.success() : failure(beforeCell);
          }, function (sharedRow) {
            return failure(beforeCell);
          });
        } else {
          return $_c6tuisjzjd24rk7o.eq(after, afterCell) && $_fgxy34kxjd24rkaf.getEnd(afterCell) === afterOffset ? failure(beforeCell) : adt$3.none('in same cell');
        }
      });
    }).getOr(adt$3.none('default'));
  };
  var isRow = function (elem) {
    return $_e7vzfkljd24rk8y.closest(elem, 'tr');
  };
  var cata$2 = function (subject, onNone, onSuccess, onFailedUp, onFailedDown) {
    return subject.fold(onNone, onSuccess, onFailedUp, onFailedDown);
  };
  var $_b0vspkp0jd24rksr = {
    verify: verify,
    cata: cata$2,
    adt: adt$3
  };

  var point = $_7p1bnnjljd24rk6a.immutable('element', 'offset');
  var delta = $_7p1bnnjljd24rk6a.immutable('element', 'deltaOffset');
  var range$3 = $_7p1bnnjljd24rk6a.immutable('element', 'start', 'finish');
  var points = $_7p1bnnjljd24rk6a.immutable('begin', 'end');
  var text = $_7p1bnnjljd24rk6a.immutable('element', 'text');
  var $_asdo1zp2jd24rkt6 = {
    point: point,
    delta: delta,
    range: range$3,
    points: points,
    text: text
  };

  var inAncestor = $_7p1bnnjljd24rk6a.immutable('ancestor', 'descendants', 'element', 'index');
  var inParent = $_7p1bnnjljd24rk6a.immutable('parent', 'children', 'element', 'index');
  var childOf = function (element, ancestor) {
    return $_dnxapkkmjd24rk8z.closest(element, function (elem) {
      return $_8rtodrjxjd24rk7b.parent(elem).exists(function (parent) {
        return $_c6tuisjzjd24rk7o.eq(parent, ancestor);
      });
    });
  };
  var indexInParent = function (element) {
    return $_8rtodrjxjd24rk7b.parent(element).bind(function (parent) {
      var children = $_8rtodrjxjd24rk7b.children(parent);
      return indexOf$1(children, element).map(function (index) {
        return inParent(parent, children, element, index);
      });
    });
  };
  var indexOf$1 = function (elements, element) {
    return $_821r2ajgjd24rk5h.findIndex(elements, $_brb4k3jijd24rk5p.curry($_c6tuisjzjd24rk7o.eq, element));
  };
  var selectorsInParent = function (element, selector) {
    return $_8rtodrjxjd24rk7b.parent(element).bind(function (parent) {
      var children = $_ec4gn6kijd24rk8r.children(parent, selector);
      return indexOf$1(children, element).map(function (index) {
        return inParent(parent, children, element, index);
      });
    });
  };
  var descendantsInAncestor = function (element, ancestorSelector, descendantSelector) {
    return $_e7vzfkljd24rk8y.closest(element, ancestorSelector).bind(function (ancestor) {
      var descendants = $_ec4gn6kijd24rk8r.descendants(ancestor, descendantSelector);
      return indexOf$1(descendants, element).map(function (index) {
        return inAncestor(ancestor, descendants, element, index);
      });
    });
  };
  var $_571hjhp3jd24rkt8 = {
    childOf: childOf,
    indexOf: indexOf$1,
    indexInParent: indexInParent,
    selectorsInParent: selectorsInParent,
    descendantsInAncestor: descendantsInAncestor
  };

  var isBr = function (elem) {
    return $_sc7pgkhjd24rk8q.name(elem) === 'br';
  };
  var gatherer = function (cand, gather, isRoot) {
    return gather(cand, isRoot).bind(function (target) {
      return $_sc7pgkhjd24rk8q.isText(target) && $_864owvkyjd24rkai.get(target).trim().length === 0 ? gatherer(target, gather, isRoot) : $_geu5gjhjd24rk5m.some(target);
    });
  };
  var handleBr = function (isRoot, element, direction) {
    return direction.traverse(element).orThunk(function () {
      return gatherer(element, direction.gather, isRoot);
    }).map(direction.relative);
  };
  var findBr = function (element, offset) {
    return $_8rtodrjxjd24rk7b.child(element, offset).filter(isBr).orThunk(function () {
      return $_8rtodrjxjd24rk7b.child(element, offset - 1).filter(isBr);
    });
  };
  var handleParent = function (isRoot, element, offset, direction) {
    return findBr(element, offset).bind(function (br) {
      return direction.traverse(br).fold(function () {
        return gatherer(br, direction.gather, isRoot).map(direction.relative);
      }, function (adjacent) {
        return $_571hjhp3jd24rkt8.indexInParent(adjacent).map(function (info) {
          return $_9leghho4jd24rkoc.on(info.parent(), info.index());
        });
      });
    });
  };
  var tryBr = function (isRoot, element, offset, direction) {
    var target = isBr(element) ? handleBr(isRoot, element, direction) : handleParent(isRoot, element, offset, direction);
    return target.map(function (tgt) {
      return {
        start: $_brb4k3jijd24rk5p.constant(tgt),
        finish: $_brb4k3jijd24rk5p.constant(tgt)
      };
    });
  };
  var process = function (analysis) {
    return $_b0vspkp0jd24rksr.cata(analysis, function (message) {
      return $_geu5gjhjd24rk5m.none('BR ADT: none');
    }, function () {
      return $_geu5gjhjd24rk5m.none();
    }, function (cell) {
      return $_geu5gjhjd24rk5m.some($_asdo1zp2jd24rkt6.point(cell, 0));
    }, function (cell) {
      return $_geu5gjhjd24rk5m.some($_asdo1zp2jd24rkt6.point(cell, $_fgxy34kxjd24rkaf.getEnd(cell)));
    });
  };
  var $_3modh7p1jd24rksx = {
    tryBr: tryBr,
    process: process
  };

  var MAX_RETRIES = 20;
  var platform$1 = $_cdhubfk4jd24rk7y.detect();
  var findSpot = function (bridge, isRoot, direction) {
    return bridge.getSelection().bind(function (sel) {
      return $_3modh7p1jd24rksx.tryBr(isRoot, sel.finish(), sel.foffset(), direction).fold(function () {
        return $_geu5gjhjd24rk5m.some($_asdo1zp2jd24rkt6.point(sel.finish(), sel.foffset()));
      }, function (brNeighbour) {
        var range = bridge.fromSitus(brNeighbour);
        var analysis = $_b0vspkp0jd24rksr.verify(bridge, sel.finish(), sel.foffset(), range.finish(), range.foffset(), direction.failure, isRoot);
        return $_3modh7p1jd24rksx.process(analysis);
      });
    });
  };
  var scan = function (bridge, isRoot, element, offset, direction, numRetries) {
    if (numRetries === 0)
      return $_geu5gjhjd24rk5m.none();
    return tryCursor(bridge, isRoot, element, offset, direction).bind(function (situs) {
      var range = bridge.fromSitus(situs);
      var analysis = $_b0vspkp0jd24rksr.verify(bridge, element, offset, range.finish(), range.foffset(), direction.failure, isRoot);
      return $_b0vspkp0jd24rksr.cata(analysis, function () {
        return $_geu5gjhjd24rk5m.none();
      }, function () {
        return $_geu5gjhjd24rk5m.some(situs);
      }, function (cell) {
        if ($_c6tuisjzjd24rk7o.eq(element, cell) && offset === 0)
          return tryAgain(bridge, element, offset, $_3td4icosjd24rkrr.moveUp, direction);
        else
          return scan(bridge, isRoot, cell, 0, direction, numRetries - 1);
      }, function (cell) {
        if ($_c6tuisjzjd24rk7o.eq(element, cell) && offset === $_fgxy34kxjd24rkaf.getEnd(cell))
          return tryAgain(bridge, element, offset, $_3td4icosjd24rkrr.moveDown, direction);
        else
          return scan(bridge, isRoot, cell, $_fgxy34kxjd24rkaf.getEnd(cell), direction, numRetries - 1);
      });
    });
  };
  var tryAgain = function (bridge, element, offset, move, direction) {
    return $_7dmqnvotjd24rkry.getBoxAt(bridge, element, offset).bind(function (box) {
      return tryAt(bridge, direction, move(box, $_3nmdj9oujd24rks3.getJumpSize()));
    });
  };
  var tryAt = function (bridge, direction, box) {
    if (platform$1.browser.isChrome() || platform$1.browser.isSafari() || platform$1.browser.isFirefox() || platform$1.browser.isEdge())
      return direction.otherRetry(bridge, box);
    else if (platform$1.browser.isIE())
      return direction.ieRetry(bridge, box);
    else
      return $_geu5gjhjd24rk5m.none();
  };
  var tryCursor = function (bridge, isRoot, element, offset, direction) {
    return $_7dmqnvotjd24rkry.getBoxAt(bridge, element, offset).bind(function (box) {
      return tryAt(bridge, direction, box);
    });
  };
  var handle$2 = function (bridge, isRoot, direction) {
    return findSpot(bridge, isRoot, direction).bind(function (spot) {
      return scan(bridge, isRoot, spot.element(), spot.offset(), direction, MAX_RETRIES).map(bridge.fromSitus);
    });
  };
  var $_4fe3eiorjd24rkrk = { handle: handle$2 };

  var any$1 = function (predicate) {
    return $_dnxapkkmjd24rk8z.first(predicate).isSome();
  };
  var ancestor$3 = function (scope, predicate, isRoot) {
    return $_dnxapkkmjd24rk8z.ancestor(scope, predicate, isRoot).isSome();
  };
  var closest$3 = function (scope, predicate, isRoot) {
    return $_dnxapkkmjd24rk8z.closest(scope, predicate, isRoot).isSome();
  };
  var sibling$3 = function (scope, predicate) {
    return $_dnxapkkmjd24rk8z.sibling(scope, predicate).isSome();
  };
  var child$4 = function (scope, predicate) {
    return $_dnxapkkmjd24rk8z.child(scope, predicate).isSome();
  };
  var descendant$3 = function (scope, predicate) {
    return $_dnxapkkmjd24rk8z.descendant(scope, predicate).isSome();
  };
  var $_cy3scop4jd24rkth = {
    any: any$1,
    ancestor: ancestor$3,
    closest: closest$3,
    sibling: sibling$3,
    child: child$4,
    descendant: descendant$3
  };

  var detection = $_cdhubfk4jd24rk7y.detect();
  var inSameTable = function (elem, table) {
    return $_cy3scop4jd24rkth.ancestor(elem, function (e) {
      return $_8rtodrjxjd24rk7b.parent(e).exists(function (p) {
        return $_c6tuisjzjd24rk7o.eq(p, table);
      });
    });
  };
  var simulate = function (bridge, isRoot, direction, initial, anchor) {
    return $_e7vzfkljd24rk8y.closest(initial, 'td,th', isRoot).bind(function (start) {
      return $_e7vzfkljd24rk8y.closest(start, 'table', isRoot).bind(function (table) {
        if (!inSameTable(anchor, table))
          return $_geu5gjhjd24rk5m.none();
        return $_4fe3eiorjd24rkrk.handle(bridge, isRoot, direction).bind(function (range) {
          return $_e7vzfkljd24rk8y.closest(range.finish(), 'td,th', isRoot).map(function (finish) {
            return {
              start: $_brb4k3jijd24rk5p.constant(start),
              finish: $_brb4k3jijd24rk5p.constant(finish),
              range: $_brb4k3jijd24rk5p.constant(range)
            };
          });
        });
      });
    });
  };
  var navigate = function (bridge, isRoot, direction, initial, anchor, precheck) {
    if (detection.browser.isIE()) {
      return $_geu5gjhjd24rk5m.none();
    } else {
      return precheck(initial, isRoot).orThunk(function () {
        return simulate(bridge, isRoot, direction, initial, anchor).map(function (info) {
          var range = info.range();
          return $_2ktrnxokjd24rkqb.response($_geu5gjhjd24rk5m.some($_5o4tjbonjd24rkqm.makeSitus(range.start(), range.soffset(), range.finish(), range.foffset())), true);
        });
      });
    }
  };
  var firstUpCheck = function (initial, isRoot) {
    return $_e7vzfkljd24rk8y.closest(initial, 'tr', isRoot).bind(function (startRow) {
      return $_e7vzfkljd24rk8y.closest(startRow, 'table', isRoot).bind(function (table) {
        var rows = $_ec4gn6kijd24rk8r.descendants(table, 'tr');
        if ($_c6tuisjzjd24rk7o.eq(startRow, rows[0])) {
          return $_370x9movjd24rksd.seekLeft(table, function (element) {
            return $_59jad4kwjd24rkad.last(element).isSome();
          }, isRoot).map(function (last) {
            var lastOffset = $_fgxy34kxjd24rkaf.getEnd(last);
            return $_2ktrnxokjd24rkqb.response($_geu5gjhjd24rk5m.some($_5o4tjbonjd24rkqm.makeSitus(last, lastOffset, last, lastOffset)), true);
          });
        } else {
          return $_geu5gjhjd24rk5m.none();
        }
      });
    });
  };
  var lastDownCheck = function (initial, isRoot) {
    return $_e7vzfkljd24rk8y.closest(initial, 'tr', isRoot).bind(function (startRow) {
      return $_e7vzfkljd24rk8y.closest(startRow, 'table', isRoot).bind(function (table) {
        var rows = $_ec4gn6kijd24rk8r.descendants(table, 'tr');
        if ($_c6tuisjzjd24rk7o.eq(startRow, rows[rows.length - 1])) {
          return $_370x9movjd24rksd.seekRight(table, function (element) {
            return $_59jad4kwjd24rkad.first(element).isSome();
          }, isRoot).map(function (first) {
            return $_2ktrnxokjd24rkqb.response($_geu5gjhjd24rk5m.some($_5o4tjbonjd24rkqm.makeSitus(first, 0, first, 0)), true);
          });
        } else {
          return $_geu5gjhjd24rk5m.none();
        }
      });
    });
  };
  var select = function (bridge, container, isRoot, direction, initial, anchor, selectRange) {
    return simulate(bridge, isRoot, direction, initial, anchor).bind(function (info) {
      return $_3iphxnopjd24rkqy.detect(container, isRoot, info.start(), info.finish(), selectRange);
    });
  };
  var $_bpahajoqjd24rkr5 = {
    navigate: navigate,
    select: select,
    firstUpCheck: firstUpCheck,
    lastDownCheck: lastDownCheck
  };

  var findCell = function (target, isRoot) {
    return $_e7vzfkljd24rk8y.closest(target, 'td,th', isRoot);
  };
  function MouseSelection (bridge, container, isRoot, annotations) {
    var cursor = $_geu5gjhjd24rk5m.none();
    var clearState = function () {
      cursor = $_geu5gjhjd24rk5m.none();
    };
    var mousedown = function (event) {
      annotations.clear(container);
      cursor = findCell(event.target(), isRoot);
    };
    var mouseover = function (event) {
      cursor.each(function (start) {
        annotations.clear(container);
        findCell(event.target(), isRoot).each(function (finish) {
          $_cz5shl4jd24rkb7.identify(start, finish, isRoot).each(function (cellSel) {
            var boxes = cellSel.boxes().getOr([]);
            if (boxes.length > 1 || boxes.length === 1 && !$_c6tuisjzjd24rk7o.eq(start, finish)) {
              annotations.selectRange(container, boxes, cellSel.start(), cellSel.finish());
              bridge.selectContents(finish);
            }
          });
        });
      });
    };
    var mouseup = function () {
      cursor.each(clearState);
    };
    return {
      mousedown: mousedown,
      mouseover: mouseover,
      mouseup: mouseup
    };
  }

  var $_akx611p6jd24rktn = {
    down: {
      traverse: $_8rtodrjxjd24rk7b.nextSibling,
      gather: $_370x9movjd24rksd.after,
      relative: $_9leghho4jd24rkoc.before,
      otherRetry: $_3nmdj9oujd24rks3.tryDown,
      ieRetry: $_3nmdj9oujd24rks3.ieTryDown,
      failure: $_b0vspkp0jd24rksr.adt.failedDown
    },
    up: {
      traverse: $_8rtodrjxjd24rk7b.prevSibling,
      gather: $_370x9movjd24rksd.before,
      relative: $_9leghho4jd24rkoc.before,
      otherRetry: $_3nmdj9oujd24rks3.tryUp,
      ieRetry: $_3nmdj9oujd24rks3.ieTryUp,
      failure: $_b0vspkp0jd24rksr.adt.failedUp
    }
  };

  var rc = $_7p1bnnjljd24rk6a.immutable('rows', 'cols');
  var mouse = function (win, container, isRoot, annotations) {
    var bridge = WindowBridge(win);
    var handlers = MouseSelection(bridge, container, isRoot, annotations);
    return {
      mousedown: handlers.mousedown,
      mouseover: handlers.mouseover,
      mouseup: handlers.mouseup
    };
  };
  var keyboard = function (win, container, isRoot, annotations) {
    var bridge = WindowBridge(win);
    var clearToNavigate = function () {
      annotations.clear(container);
      return $_geu5gjhjd24rk5m.none();
    };
    var keydown = function (event, start, soffset, finish, foffset, direction) {
      var keycode = event.raw().which;
      var shiftKey = event.raw().shiftKey === true;
      var handler = $_cz5shl4jd24rkb7.retrieve(container, annotations.selectedSelector()).fold(function () {
        if ($_q6r0boljd24rkqc.isDown(keycode) && shiftKey) {
          return $_brb4k3jijd24rk5p.curry($_bpahajoqjd24rkr5.select, bridge, container, isRoot, $_akx611p6jd24rktn.down, finish, start, annotations.selectRange);
        } else if ($_q6r0boljd24rkqc.isUp(keycode) && shiftKey) {
          return $_brb4k3jijd24rk5p.curry($_bpahajoqjd24rkr5.select, bridge, container, isRoot, $_akx611p6jd24rktn.up, finish, start, annotations.selectRange);
        } else if ($_q6r0boljd24rkqc.isDown(keycode)) {
          return $_brb4k3jijd24rk5p.curry($_bpahajoqjd24rkr5.navigate, bridge, isRoot, $_akx611p6jd24rktn.down, finish, start, $_bpahajoqjd24rkr5.lastDownCheck);
        } else if ($_q6r0boljd24rkqc.isUp(keycode)) {
          return $_brb4k3jijd24rk5p.curry($_bpahajoqjd24rkr5.navigate, bridge, isRoot, $_akx611p6jd24rktn.up, finish, start, $_bpahajoqjd24rkr5.firstUpCheck);
        } else {
          return $_geu5gjhjd24rk5m.none;
        }
      }, function (selected) {
        var update = function (attempts) {
          return function () {
            var navigation = $_eci14jmajd24rkgo.findMap(attempts, function (delta) {
              return $_3iphxnopjd24rkqy.update(delta.rows(), delta.cols(), container, selected, annotations);
            });
            return navigation.fold(function () {
              return $_cz5shl4jd24rkb7.getEdges(container, annotations.firstSelectedSelector(), annotations.lastSelectedSelector()).map(function (edges) {
                var relative = $_q6r0boljd24rkqc.isDown(keycode) || direction.isForward(keycode) ? $_9leghho4jd24rkoc.after : $_9leghho4jd24rkoc.before;
                bridge.setRelativeSelection($_9leghho4jd24rkoc.on(edges.first(), 0), relative(edges.table()));
                annotations.clear(container);
                return $_2ktrnxokjd24rkqb.response($_geu5gjhjd24rk5m.none(), true);
              });
            }, function (_) {
              return $_geu5gjhjd24rk5m.some($_2ktrnxokjd24rkqb.response($_geu5gjhjd24rk5m.none(), true));
            });
          };
        };
        if ($_q6r0boljd24rkqc.isDown(keycode) && shiftKey)
          return update([rc(+1, 0)]);
        else if ($_q6r0boljd24rkqc.isUp(keycode) && shiftKey)
          return update([rc(-1, 0)]);
        else if (direction.isBackward(keycode) && shiftKey)
          return update([
            rc(0, -1),
            rc(-1, 0)
          ]);
        else if (direction.isForward(keycode) && shiftKey)
          return update([
            rc(0, +1),
            rc(+1, 0)
          ]);
        else if ($_q6r0boljd24rkqc.isNavigation(keycode) && shiftKey === false)
          return clearToNavigate;
        else
          return $_geu5gjhjd24rk5m.none;
      });
      return handler();
    };
    var keyup = function (event, start, soffset, finish, foffset) {
      return $_cz5shl4jd24rkb7.retrieve(container, annotations.selectedSelector()).fold(function () {
        var keycode = event.raw().which;
        var shiftKey = event.raw().shiftKey === true;
        if (shiftKey === false)
          return $_geu5gjhjd24rk5m.none();
        if ($_q6r0boljd24rkqc.isNavigation(keycode))
          return $_3iphxnopjd24rkqy.sync(container, isRoot, start, soffset, finish, foffset, annotations.selectRange);
        else
          return $_geu5gjhjd24rk5m.none();
      }, $_geu5gjhjd24rk5m.none);
    };
    return {
      keydown: keydown,
      keyup: keyup
    };
  };
  var $_77918gojjd24rkq0 = {
    mouse: mouse,
    keyboard: keyboard
  };

  var add$3 = function (element, classes) {
    $_821r2ajgjd24rk5h.each(classes, function (x) {
      $_17vk2qmljd24rki6.add(element, x);
    });
  };
  var remove$7 = function (element, classes) {
    $_821r2ajgjd24rk5h.each(classes, function (x) {
      $_17vk2qmljd24rki6.remove(element, x);
    });
  };
  var toggle$2 = function (element, classes) {
    $_821r2ajgjd24rk5h.each(classes, function (x) {
      $_17vk2qmljd24rki6.toggle(element, x);
    });
  };
  var hasAll = function (element, classes) {
    return $_821r2ajgjd24rk5h.forall(classes, function (clazz) {
      return $_17vk2qmljd24rki6.has(element, clazz);
    });
  };
  var hasAny = function (element, classes) {
    return $_821r2ajgjd24rk5h.exists(classes, function (clazz) {
      return $_17vk2qmljd24rki6.has(element, clazz);
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
  var get$11 = function (element) {
    return $_5pv04amnjd24rki9.supports(element) ? getNative(element) : $_5pv04amnjd24rki9.get(element);
  };
  var $_5hkdjop9jd24rkty = {
    add: add$3,
    remove: remove$7,
    toggle: toggle$2,
    hasAll: hasAll,
    hasAny: hasAny,
    get: get$11
  };

  var addClass = function (clazz) {
    return function (element) {
      $_17vk2qmljd24rki6.add(element, clazz);
    };
  };
  var removeClass = function (clazz) {
    return function (element) {
      $_17vk2qmljd24rki6.remove(element, clazz);
    };
  };
  var removeClasses = function (classes) {
    return function (element) {
      $_5hkdjop9jd24rkty.remove(element, classes);
    };
  };
  var hasClass = function (clazz) {
    return function (element) {
      return $_17vk2qmljd24rki6.has(element, clazz);
    };
  };
  var $_5899jcp8jd24rktx = {
    addClass: addClass,
    removeClass: removeClass,
    removeClasses: removeClasses,
    hasClass: hasClass
  };

  var byClass = function (ephemera) {
    var addSelectionClass = $_5899jcp8jd24rktx.addClass(ephemera.selected());
    var removeSelectionClasses = $_5899jcp8jd24rktx.removeClasses([
      ephemera.selected(),
      ephemera.lastSelected(),
      ephemera.firstSelected()
    ]);
    var clear = function (container) {
      var sels = $_ec4gn6kijd24rk8r.descendants(container, ephemera.selectedSelector());
      $_821r2ajgjd24rk5h.each(sels, removeSelectionClasses);
    };
    var selectRange = function (container, cells, start, finish) {
      clear(container);
      $_821r2ajgjd24rk5h.each(cells, addSelectionClass);
      $_17vk2qmljd24rki6.add(start, ephemera.firstSelected());
      $_17vk2qmljd24rki6.add(finish, ephemera.lastSelected());
    };
    return {
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    };
  };
  var byAttr = function (ephemera) {
    var removeSelectionAttributes = function (element) {
      $_4ni5ekkgjd24rk8l.remove(element, ephemera.selected());
      $_4ni5ekkgjd24rk8l.remove(element, ephemera.firstSelected());
      $_4ni5ekkgjd24rk8l.remove(element, ephemera.lastSelected());
    };
    var addSelectionAttribute = function (element) {
      $_4ni5ekkgjd24rk8l.set(element, ephemera.selected(), '1');
    };
    var clear = function (container) {
      var sels = $_ec4gn6kijd24rk8r.descendants(container, ephemera.selectedSelector());
      $_821r2ajgjd24rk5h.each(sels, removeSelectionAttributes);
    };
    var selectRange = function (container, cells, start, finish) {
      clear(container);
      $_821r2ajgjd24rk5h.each(cells, addSelectionAttribute);
      $_4ni5ekkgjd24rk8l.set(start, ephemera.firstSelected(), '1');
      $_4ni5ekkgjd24rk8l.set(finish, ephemera.lastSelected(), '1');
    };
    return {
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    };
  };
  var $_14mnlrp7jd24rktr = {
    byClass: byClass,
    byAttr: byAttr
  };

  function CellSelection$1 (editor, lazyResize) {
    var handlerStruct = $_7p1bnnjljd24rk6a.immutableBag([
      'mousedown',
      'mouseover',
      'mouseup',
      'keyup',
      'keydown'
    ], []);
    var handlers = $_geu5gjhjd24rk5m.none();
    var annotations = $_14mnlrp7jd24rktr.byAttr($_eespehlgjd24rkd1);
    editor.on('init', function (e) {
      var win = editor.getWin();
      var body = $_a6b2yhn2jd24rkjw.getBody(editor);
      var isRoot = $_a6b2yhn2jd24rkjw.getIsRoot(editor);
      var syncSelection = function () {
        var sel = editor.selection;
        var start = $_6zx9pgjvjd24rk77.fromDom(sel.getStart());
        var end = $_6zx9pgjvjd24rk77.fromDom(sel.getEnd());
        var startTable = $_60ksrkjsjd24rk6p.table(start);
        var endTable = $_60ksrkjsjd24rk6p.table(end);
        var sameTable = startTable.bind(function (tableStart) {
          return endTable.bind(function (tableEnd) {
            return $_c6tuisjzjd24rk7o.eq(tableStart, tableEnd) ? $_geu5gjhjd24rk5m.some(true) : $_geu5gjhjd24rk5m.none();
          });
        });
        sameTable.fold(function () {
          annotations.clear(body);
        }, $_brb4k3jijd24rk5p.noop);
      };
      var mouseHandlers = $_77918gojjd24rkq0.mouse(win, body, isRoot, annotations);
      var keyHandlers = $_77918gojjd24rkq0.keyboard(win, body, isRoot, annotations);
      var handleResponse = function (event, response) {
        if (response.kill()) {
          event.kill();
        }
        response.selection().each(function (ns) {
          var relative = $_2nstlyo3jd24rko8.relative(ns.start(), ns.finish());
          var rng = $_4wzb57o9jd24rkov.asLtrRange(win, relative);
          editor.selection.setRng(rng);
        });
      };
      var keyup = function (event) {
        var wrappedEvent = wrapEvent(event);
        if (wrappedEvent.raw().shiftKey && $_q6r0boljd24rkqc.isNavigation(wrappedEvent.raw().which)) {
          var rng = editor.selection.getRng();
          var start = $_6zx9pgjvjd24rk77.fromDom(rng.startContainer);
          var end = $_6zx9pgjvjd24rk77.fromDom(rng.endContainer);
          keyHandlers.keyup(wrappedEvent, start, rng.startOffset, end, rng.endOffset).each(function (response) {
            handleResponse(wrappedEvent, response);
          });
        }
      };
      var checkLast = function (last) {
        return !$_4ni5ekkgjd24rk8l.has(last, 'data-mce-bogus') && $_sc7pgkhjd24rk8q.name(last) !== 'br' && !($_sc7pgkhjd24rk8q.isText(last) && $_864owvkyjd24rkai.get(last).length === 0);
      };
      var getLast = function () {
        var body = $_6zx9pgjvjd24rk77.fromDom(editor.getBody());
        var lastChild = $_8rtodrjxjd24rk7b.lastChild(body);
        var getPrevLast = function (last) {
          return $_8rtodrjxjd24rk7b.prevSibling(last).bind(function (prevLast) {
            return checkLast(prevLast) ? $_geu5gjhjd24rk5m.some(prevLast) : getPrevLast(prevLast);
          });
        };
        return lastChild.bind(function (last) {
          return checkLast(last) ? $_geu5gjhjd24rk5m.some(last) : getPrevLast(last);
        });
      };
      var keydown = function (event) {
        var wrappedEvent = wrapEvent(event);
        lazyResize().each(function (resize) {
          resize.hideBars();
        });
        if (event.which === 40) {
          getLast().each(function (last) {
            if ($_sc7pgkhjd24rk8q.name(last) === 'table') {
              if (editor.settings.forced_root_block) {
                editor.dom.add(editor.getBody(), editor.settings.forced_root_block, editor.settings.forced_root_block_attrs, '<br/>');
              } else {
                editor.dom.add(editor.getBody(), 'br');
              }
            }
          });
        }
        var rng = editor.selection.getRng();
        var startContainer = $_6zx9pgjvjd24rk77.fromDom(editor.selection.getStart());
        var start = $_6zx9pgjvjd24rk77.fromDom(rng.startContainer);
        var end = $_6zx9pgjvjd24rk77.fromDom(rng.endContainer);
        var direction = $_2g3t0n3jd24rkjz.directionAt(startContainer).isRtl() ? $_q6r0boljd24rkqc.rtl : $_q6r0boljd24rkqc.ltr;
        keyHandlers.keydown(wrappedEvent, start, rng.startOffset, end, rng.endOffset, direction).each(function (response) {
          handleResponse(wrappedEvent, response);
        });
        lazyResize().each(function (resize) {
          resize.showBars();
        });
      };
      var wrapEvent = function (event) {
        var target = $_6zx9pgjvjd24rk77.fromDom(event.target);
        var stop = function () {
          event.stopPropagation();
        };
        var prevent = function () {
          event.preventDefault();
        };
        var kill = $_brb4k3jijd24rk5p.compose(prevent, stop);
        return {
          target: $_brb4k3jijd24rk5p.constant(target),
          x: $_brb4k3jijd24rk5p.constant(event.x),
          y: $_brb4k3jijd24rk5p.constant(event.y),
          stop: stop,
          prevent: prevent,
          kill: kill,
          raw: $_brb4k3jijd24rk5p.constant(event)
        };
      };
      var isLeftMouse = function (raw) {
        return raw.button === 0;
      };
      var isLeftButtonPressed = function (raw) {
        if (raw.buttons === undefined) {
          return true;
        }
        return (raw.buttons & 1) !== 0;
      };
      var mouseDown = function (e) {
        if (isLeftMouse(e)) {
          mouseHandlers.mousedown(wrapEvent(e));
        }
      };
      var mouseOver = function (e) {
        if (isLeftButtonPressed(e)) {
          mouseHandlers.mouseover(wrapEvent(e));
        }
      };
      var mouseUp = function (e) {
        if (isLeftMouse) {
          mouseHandlers.mouseup(wrapEvent(e));
        }
      };
      editor.on('mousedown', mouseDown);
      editor.on('mouseover', mouseOver);
      editor.on('mouseup', mouseUp);
      editor.on('keyup', keyup);
      editor.on('keydown', keydown);
      editor.on('nodechange', syncSelection);
      handlers = $_geu5gjhjd24rk5m.some(handlerStruct({
        mousedown: mouseDown,
        mouseover: mouseOver,
        mouseup: mouseUp,
        keyup: keyup,
        keydown: keydown
      }));
    });
    var destroy = function () {
      handlers.each(function (handlers) {
      });
    };
    return {
      clear: annotations.clear,
      destroy: destroy
    };
  }

  function Selections (editor) {
    var get = function () {
      var body = $_a6b2yhn2jd24rkjw.getBody(editor);
      return $_869bbnl3jd24rkb1.retrieve(body, $_eespehlgjd24rkd1.selectedSelector()).fold(function () {
        if (editor.selection.getStart() === undefined) {
          return $_asx793lhjd24rkd2.none();
        } else {
          return $_asx793lhjd24rkd2.single(editor.selection);
        }
      }, function (cells) {
        return $_asx793lhjd24rkd2.multiple(cells);
      });
    };
    return { get: get };
  }

  var each$4 = Tools.each;
  var addButtons = function (editor) {
    var menuItems = [];
    each$4('inserttable tableprops deletetable | cell row column'.split(' '), function (name) {
      if (name === '|') {
        menuItems.push({ text: '-' });
      } else {
        menuItems.push(editor.menuItems[name]);
      }
    });
    editor.addButton('table', {
      type: 'menubutton',
      title: 'Table',
      menu: menuItems
    });
    function cmd(command) {
      return function () {
        editor.execCommand(command);
      };
    }
    editor.addButton('tableprops', {
      title: 'Table properties',
      onclick: $_brb4k3jijd24rk5p.curry($_4fehk0n8jd24rkkk.open, editor, true),
      icon: 'table'
    });
    editor.addButton('tabledelete', {
      title: 'Delete table',
      onclick: cmd('mceTableDelete')
    });
    editor.addButton('tablecellprops', {
      title: 'Cell properties',
      onclick: cmd('mceTableCellProps')
    });
    editor.addButton('tablemergecells', {
      title: 'Merge cells',
      onclick: cmd('mceTableMergeCells')
    });
    editor.addButton('tablesplitcells', {
      title: 'Split cell',
      onclick: cmd('mceTableSplitCells')
    });
    editor.addButton('tableinsertrowbefore', {
      title: 'Insert row before',
      onclick: cmd('mceTableInsertRowBefore')
    });
    editor.addButton('tableinsertrowafter', {
      title: 'Insert row after',
      onclick: cmd('mceTableInsertRowAfter')
    });
    editor.addButton('tabledeleterow', {
      title: 'Delete row',
      onclick: cmd('mceTableDeleteRow')
    });
    editor.addButton('tablerowprops', {
      title: 'Row properties',
      onclick: cmd('mceTableRowProps')
    });
    editor.addButton('tablecutrow', {
      title: 'Cut row',
      onclick: cmd('mceTableCutRow')
    });
    editor.addButton('tablecopyrow', {
      title: 'Copy row',
      onclick: cmd('mceTableCopyRow')
    });
    editor.addButton('tablepasterowbefore', {
      title: 'Paste row before',
      onclick: cmd('mceTablePasteRowBefore')
    });
    editor.addButton('tablepasterowafter', {
      title: 'Paste row after',
      onclick: cmd('mceTablePasteRowAfter')
    });
    editor.addButton('tableinsertcolbefore', {
      title: 'Insert column before',
      onclick: cmd('mceTableInsertColBefore')
    });
    editor.addButton('tableinsertcolafter', {
      title: 'Insert column after',
      onclick: cmd('mceTableInsertColAfter')
    });
    editor.addButton('tabledeletecol', {
      title: 'Delete column',
      onclick: cmd('mceTableDeleteCol')
    });
  };
  var addToolbars = function (editor) {
    var isTable = function (table) {
      var selectorMatched = editor.dom.is(table, 'table') && editor.getBody().contains(table);
      return selectorMatched;
    };
    var toolbarItems = editor.settings.table_toolbar;
    if (toolbarItems === '' || toolbarItems === false) {
      return;
    }
    if (!toolbarItems) {
      toolbarItems = 'tableprops tabledelete | ' + 'tableinsertrowbefore tableinsertrowafter tabledeleterow | ' + 'tableinsertcolbefore tableinsertcolafter tabledeletecol';
    }
    editor.addContextToolbar(isTable, toolbarItems);
  };
  var $_bngnepbjd24rku4 = {
    addButtons: addButtons,
    addToolbars: addToolbars
  };

  var addMenuItems = function (editor, selections) {
    var targets = $_geu5gjhjd24rk5m.none();
    var tableCtrls = [];
    var cellCtrls = [];
    var mergeCtrls = [];
    var unmergeCtrls = [];
    var noTargetDisable = function (ctrl) {
      ctrl.disabled(true);
    };
    var ctrlEnable = function (ctrl) {
      ctrl.disabled(false);
    };
    var pushTable = function () {
      var self = this;
      tableCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        ctrlEnable(self);
      });
    };
    var pushCell = function () {
      var self = this;
      cellCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        ctrlEnable(self);
      });
    };
    var pushMerge = function () {
      var self = this;
      mergeCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        self.disabled(targets.mergable().isNone());
      });
    };
    var pushUnmerge = function () {
      var self = this;
      unmergeCtrls.push(self);
      targets.fold(function () {
        noTargetDisable(self);
      }, function (targets) {
        self.disabled(targets.unmergable().isNone());
      });
    };
    var setDisabledCtrls = function () {
      targets.fold(function () {
        $_821r2ajgjd24rk5h.each(tableCtrls, noTargetDisable);
        $_821r2ajgjd24rk5h.each(cellCtrls, noTargetDisable);
        $_821r2ajgjd24rk5h.each(mergeCtrls, noTargetDisable);
        $_821r2ajgjd24rk5h.each(unmergeCtrls, noTargetDisable);
      }, function (targets) {
        $_821r2ajgjd24rk5h.each(tableCtrls, ctrlEnable);
        $_821r2ajgjd24rk5h.each(cellCtrls, ctrlEnable);
        $_821r2ajgjd24rk5h.each(mergeCtrls, function (mergeCtrl) {
          mergeCtrl.disabled(targets.mergable().isNone());
        });
        $_821r2ajgjd24rk5h.each(unmergeCtrls, function (unmergeCtrl) {
          unmergeCtrl.disabled(targets.unmergable().isNone());
        });
      });
    };
    editor.on('init', function () {
      editor.on('nodechange', function (e) {
        var cellOpt = $_geu5gjhjd24rk5m.from(editor.dom.getParent(editor.selection.getStart(), 'th,td'));
        targets = cellOpt.bind(function (cellDom) {
          var cell = $_6zx9pgjvjd24rk77.fromDom(cellDom);
          var table = $_60ksrkjsjd24rk6p.table(cell);
          return table.map(function (table) {
            return $_g6t26dl1jd24rkap.forMenu(selections, table, cell);
          });
        });
        setDisabledCtrls();
      });
    });
    var generateTableGrid = function () {
      var html = '';
      html = '<table role="grid" class="mce-grid mce-grid-border" aria-readonly="true">';
      for (var y = 0; y < 10; y++) {
        html += '<tr>';
        for (var x = 0; x < 10; x++) {
          html += '<td role="gridcell" tabindex="-1"><a id="mcegrid' + (y * 10 + x) + '" href="#" ' + 'data-mce-x="' + x + '" data-mce-y="' + y + '"></a></td>';
        }
        html += '</tr>';
      }
      html += '</table>';
      html += '<div class="mce-text-center" role="presentation">1 x 1</div>';
      return html;
    };
    var selectGrid = function (editor, tx, ty, control) {
      var table = control.getEl().getElementsByTagName('table')[0];
      var x, y, focusCell, cell, active;
      var rtl = control.isRtl() || control.parent().rel === 'tl-tr';
      table.nextSibling.innerHTML = tx + 1 + ' x ' + (ty + 1);
      if (rtl) {
        tx = 9 - tx;
      }
      for (y = 0; y < 10; y++) {
        for (x = 0; x < 10; x++) {
          cell = table.rows[y].childNodes[x].firstChild;
          active = (rtl ? x >= tx : x <= tx) && y <= ty;
          editor.dom.toggleClass(cell, 'mce-active', active);
          if (active) {
            focusCell = cell;
          }
        }
      }
      return focusCell.parentNode;
    };
    var insertTable = editor.settings.table_grid === false ? {
      text: 'Table',
      icon: 'table',
      context: 'table',
      onclick: $_brb4k3jijd24rk5p.curry($_4fehk0n8jd24rkkk.open, editor)
    } : {
      text: 'Table',
      icon: 'table',
      context: 'table',
      ariaHideMenu: true,
      onclick: function (e) {
        if (e.aria) {
          this.parent().hideAll();
          e.stopImmediatePropagation();
          $_4fehk0n8jd24rkkk.open(editor);
        }
      },
      onshow: function () {
        selectGrid(editor, 0, 0, this.menu.items()[0]);
      },
      onhide: function () {
        var elements = this.menu.items()[0].getEl().getElementsByTagName('a');
        editor.dom.removeClass(elements, 'mce-active');
        editor.dom.addClass(elements[0], 'mce-active');
      },
      menu: [{
          type: 'container',
          html: generateTableGrid(),
          onPostRender: function () {
            this.lastX = this.lastY = 0;
          },
          onmousemove: function (e) {
            var target = e.target;
            var x, y;
            if (target.tagName.toUpperCase() === 'A') {
              x = parseInt(target.getAttribute('data-mce-x'), 10);
              y = parseInt(target.getAttribute('data-mce-y'), 10);
              if (this.isRtl() || this.parent().rel === 'tl-tr') {
                x = 9 - x;
              }
              if (x !== this.lastX || y !== this.lastY) {
                selectGrid(editor, x, y, e.control);
                this.lastX = x;
                this.lastY = y;
              }
            }
          },
          onclick: function (e) {
            var self = this;
            if (e.target.tagName.toUpperCase() === 'A') {
              e.preventDefault();
              e.stopPropagation();
              self.parent().cancel();
              editor.undoManager.transact(function () {
                $_8wcpcxljjd24rkd7.insert(editor, self.lastX + 1, self.lastY + 1);
              });
              editor.addVisual();
            }
          }
        }]
    };
    function cmd(command) {
      return function () {
        editor.execCommand(command);
      };
    }
    var tableProperties = {
      text: 'Table properties',
      context: 'table',
      onPostRender: pushTable,
      onclick: $_brb4k3jijd24rk5p.curry($_4fehk0n8jd24rkkk.open, editor, true)
    };
    var deleteTable = {
      text: 'Delete table',
      context: 'table',
      onPostRender: pushTable,
      cmd: 'mceTableDelete'
    };
    var row = {
      text: 'Row',
      context: 'table',
      menu: [
        {
          text: 'Insert row before',
          onclick: cmd('mceTableInsertRowBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Insert row after',
          onclick: cmd('mceTableInsertRowAfter'),
          onPostRender: pushCell
        },
        {
          text: 'Delete row',
          onclick: cmd('mceTableDeleteRow'),
          onPostRender: pushCell
        },
        {
          text: 'Row properties',
          onclick: cmd('mceTableRowProps'),
          onPostRender: pushCell
        },
        { text: '-' },
        {
          text: 'Cut row',
          onclick: cmd('mceTableCutRow'),
          onPostRender: pushCell
        },
        {
          text: 'Copy row',
          onclick: cmd('mceTableCopyRow'),
          onPostRender: pushCell
        },
        {
          text: 'Paste row before',
          onclick: cmd('mceTablePasteRowBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Paste row after',
          onclick: cmd('mceTablePasteRowAfter'),
          onPostRender: pushCell
        }
      ]
    };
    var column = {
      text: 'Column',
      context: 'table',
      menu: [
        {
          text: 'Insert column before',
          onclick: cmd('mceTableInsertColBefore'),
          onPostRender: pushCell
        },
        {
          text: 'Insert column after',
          onclick: cmd('mceTableInsertColAfter'),
          onPostRender: pushCell
        },
        {
          text: 'Delete column',
          onclick: cmd('mceTableDeleteCol'),
          onPostRender: pushCell
        }
      ]
    };
    var cell = {
      separator: 'before',
      text: 'Cell',
      context: 'table',
      menu: [
        {
          text: 'Cell properties',
          onclick: cmd('mceTableCellProps'),
          onPostRender: pushCell
        },
        {
          text: 'Merge cells',
          onclick: cmd('mceTableMergeCells'),
          onPostRender: pushMerge
        },
        {
          text: 'Split cell',
          onclick: cmd('mceTableSplitCells'),
          onPostRender: pushUnmerge
        }
      ]
    };
    editor.addMenuItem('inserttable', insertTable);
    editor.addMenuItem('tableprops', tableProperties);
    editor.addMenuItem('deletetable', deleteTable);
    editor.addMenuItem('row', row);
    editor.addMenuItem('column', column);
    editor.addMenuItem('cell', cell);
  };
  var $_eo1bjjpcjd24rku8 = { addMenuItems: addMenuItems };

  function Plugin(editor) {
    var self = this;
    var resizeHandler = ResizeHandler(editor);
    var cellSelection = CellSelection$1(editor, resizeHandler.lazyResize);
    var actions = TableActions(editor, resizeHandler.lazyWire);
    var selections = Selections(editor);
    $_90iotyn5jd24rkk3.registerCommands(editor, actions, cellSelection, selections);
    $_24mfmajfjd24rk54.registerEvents(editor, selections, actions, cellSelection);
    $_eo1bjjpcjd24rku8.addMenuItems(editor, selections);
    $_bngnepbjd24rku4.addButtons(editor);
    $_bngnepbjd24rku4.addToolbars(editor);
    editor.on('PreInit', function () {
      editor.serializer.addTempAttr($_eespehlgjd24rkd1.firstSelected());
      editor.serializer.addTempAttr($_eespehlgjd24rkd1.lastSelected());
    });
    if (editor.settings.table_tab_navigation !== false) {
      editor.on('keydown', function (e) {
        $_c3nz3po0jd24rkns.handle(e, editor, actions, resizeHandler.lazyWire);
      });
    }
    editor.on('remove', function () {
      resizeHandler.destroy();
      cellSelection.destroy();
    });
    self.insertTable = function (columns, rows) {
      return $_8wcpcxljjd24rkd7.insert(editor, columns, rows);
    };
    self.setClipboardRows = $_90iotyn5jd24rkk3.setClipboardRows;
    self.getClipboardRows = $_90iotyn5jd24rkk3.getClipboardRows;
  }
  PluginManager.add('table', Plugin);
  function Plugin$1 () {
  }

  return Plugin$1;

}());
})()
