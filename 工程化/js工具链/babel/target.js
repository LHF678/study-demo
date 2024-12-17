"use strict";

require("core-js/modules/es.array.flat-map.js");
require("core-js/modules/es.array.unscopables.flat-map.js");
require("core-js/modules/es.object.to-string.js");
var _obj$foo;
var obj = {};
obj === null || obj === void 0 || (_obj$foo = obj.foo) === null || _obj$foo === void 0 || (_obj$foo = _obj$foo.bar) === null || _obj$foo === void 0 || _obj$foo.baz;
var result = [1, 2].flatMap(function (x) {
  return [x, x + 2];
});
console.log(result);
