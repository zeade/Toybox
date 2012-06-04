/**
 * @author Micah Jaffe
 * Personal toy problems and code snippets I've used in the past.
 * 
 * Copyright (c) 2011 - 2012, Micah Jaffe
 * Licensed for use under BSD License.
 * http://www.opensource.org/licenses/bsd-license.php
 */

// Crockford-ian object creation
// http://javascript.crockford.com/prototypal.html
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

// Checks type for integer
var isInt = function (i) {
  return typeof i === 'number' && parseInt(i) == parseFloat(i) && !isNaN(i);	
};

// Checks type, value where i > 0 returns true
var isPositiveInt = function (i) {
  return isInt(i) && i > -1;
};

var isArray = function(a) {
  return a instanceof Array;  
};

/**
 * Distance between two points (a, b) in 2D (or higher)
 *
 * @see http://en.wikipedia.org/wiki/Distance
 * @param {Array} a Point a, coordinates ordered as x, y, z, etc
 * @param {Array} b Point b, sames as point a
 * @return {number} Distance from a to b (positive) or Number.NaN if there was an error
 */
var distance = function (a, b) {
  var d = Number.NaN, delta = 0;
  if (isArray(a) && isArray(b) && a.length > 1 && a.length === b.length) {
    // Doing this for clarity, not compactness
    delta = Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
    for (var i = 2; i < a.length; i++) {
      delta += Math.pow(b[i] - a[i], 2);
    }
    d = Math.sqrt(delta);
  }
  return d;
};

// http://en.wikipedia.org/wiki/Fibonacci_number
// 0 + 1 + 1 + 2 + 3 + 5 + 8 ...  
var fibonacci = function (n, useRecursion) {
  var i, 
    a = 0, 
    b = 1, 
    sum = 0;

  if (!isPositiveInt(n)) {
    return Number.NaN;
  }

  // F(0) is 0, F(1) is 1
  if (n < 2) {
    return n;
  }

  // F(2) ... F(N)
  if (useRecursion) {
    return fibonacci(n - 1, useRecursion) + fibonacci(n - 2, useRecursion);
  } else {
    for (i = 1; i < n; i++) {
      sum = a + b;
      a = b;
      b = sum;
    }
    return sum;
  }
};

// http://en.wikipedia.org/wiki/Factorial
// E.g. 5! = 5 * 4 * 3 * 2 * 1 = 120
var factorial = function (n, useRecursion) {
  var prod = 1;

  if (!isPositiveInt(n)) {
    return Number.NaN;
  }

  // 0! or 1! is equal to 1
  if (n === 0 || n === 1) {
    return 1;
  }

  if (useRecursion) {
    return n * factorial(n - 1, useRecursion);
  } else {
    while (n > 1) {
      prod = prod * n;
      n--;
    }
    return prod;
  }
};

/**
 * Binomial coefficient, "n choose k" or "pick k unordered outcomes from n possibilities" 
 * = n! / (n-k)! * k! where 0 <= k < n, 0 otherwise
 *
 * @function
 * @see http://en.wikipedia.org/wiki/Binomial_coefficient
 * @see http://mathworld.wolfram.com/BinomialCoefficient.html
 * @param {number} n Number of events to pick from
 * @param {number} k Number of events to pick
 * @return {number} Number of possible outcomes
 */
var binomialCoefficient = function (n, k) {
  if (!isPositiveInt(k) || !isInt(n) || !(k < n)) {
    return 0;
  }
  return (factorial(n) / (factorial(n - k) * factorial(k)));
};

/**
 * Dice roller
 *
 * @function 
 * @param {number} n Number of dice to roll (default 1)
 * @param {number} max Max integers a dice can represent, from 1 to max (default 6)
 * @param {function} perRollCallback Function to call per callback with 2 parameters: value, sequence # (starting at 0)
 * @return {number} sum of rolls
 */
var rollDice = function(n, max, perRollCallback) {
  var sum = 0,
    aRoll,
    hasCallback = typeof perRollCallback === 'function';
  
  if (!isPositiveInt(n)) {
    n = 1;
  }
  if (!isPositiveInt(max)) {
    max = 6;
  }

  for (var i = 0; i < n; i++) {
    aRoll = Math.floor(Math.random() * max + 1);
    sum += aRoll;
    if (hasCallback) {
      perRollCallback(aRoll, i);
    }
  }
  return sum;
};

/**
 * Quicksort (non-destructive)
 *
 * @see http://en.wikipedia.org/wiki/Quicksort
 * @param {Array} arr Array to be sorted
 * @param {function} comparator Function to use between two elements in the list (e.g. a, b), default evaluates to (returns) -1 if a < b, 0 if equal, 1 if b > a
 * @return {Array} sorted array
 */
var quicksort = function (arr, comparator) {
  var lesser = [], 
    greater = [], 
    pivot;

  // Not an array, empty or array of 1 is already sorted
  if (!isArray(arr) || arr.length < 2) {
    return arr;
  }

  // Create a comparator func if not passed in
  if (typeof comparator !== 'function') {
    comparator = function (a, b) {
      if (a < b) {
        return -1;
      } else if (a === b) {
        return 0;
      } else {
        return 1;
      }
    };
  }

  // Get our pivot, this could be randomized
  pivot = arr.pop();

  // Iterate and put vals into either lesser or greater lists compared
  // to the pivot
  for (var i = 0; i < arr.length; i++) {
    if (comparator(arr[i], pivot) < 1) {
      lesser.push(arr[i]);
    } else {
      greater.push(arr[i]);
    }
  }

  // Sort lesser and greater lists, concat results
  return [].concat(
    quicksort(lesser, comparator), 
    pivot, 
    quicksort(greater, comparator)
  );
};

// http://en.wikipedia.org/wiki/Fisher-Yates_shuffle
// Randomizes (shuffles) an array in place, like a deck of cards.
// FIXME: make non-destructive?
var shuffle = function (arr) {
  var i, k, prev;

  if (!isArray(arr)) {
    return arr;
  }

  // Walk backwards through array
  for (i = arr.length - 1; i >= 0; i--) {

    // Pick an index in the array that is <= to the current location
    k = Math.floor(Math.random() * i);

    // Swap values with current index and random pick
    prev = arr[i];
    arr[i] = arr[k];
    arr[k] = prev;
  }
  return arr;
};

// http://en.wikipedia.org/wiki/Tree_sort
// Worst: O(n^2) (unbalanced), O(n log n) (balanced)
// Best: O(n)
// Avg: O(n log n)
var TreeSort = {
  left: null,
  right: null,
  value: null,
  count: 0,
  create: function () { 
    return Object.create(TreeSort);
  },
  insert: function (aValue) {
    if (this.value === null || this.value === aValue) {
      this.value = aValue;
      this.count++;
    }
    else if (aValue < this.value) {
      if (this.left === null) {
        this.left = TreeSort.create();
      }
      this.left.add(aValue);
    }
    else if (aValue > this.value) {
      if (this.right === null) {
        this.right = TreeSort.create();
      }
      this.right.add(aValue);
    }
  },
  toArray: function () {
    if (this.value === null) {
      return [];
    }
    return [].concat(
      this.left ? this.left.toArray() : [], 
      this.value, 
      this.right ? this.right.toArray() : []
    );
  }
};

// Exports variable as defined in CommonJS specification:
// http://www.commonjs.org/specs/modules/1.0/
// For use in other frameworks e.g. RequireJS or NodeJS
// http://requirejs.org/
// http://nodejs.org/
exports.isInt = isInt;
exports.isPositiveInt = isPositiveInt;
exports.isArray = isArray;
exports.distance = distance;
exports.fibonacci = fibonacci;
exports.fib = fibonacci;
exports.factorial = factorial;
exports.fact = factorial;
exports.binomialCoefficient = binomialCoefficient;
exports.binomial = binomialCoefficient;
exports.rollDice = rollDice;
exports.roll = rollDice;
exports.quicksort = quicksort;
exports.qsort = quicksort;
exports.shuffle = shuffle;
exports.TreeSort = TreeSort;
