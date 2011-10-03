// Copyright (c) 2011, Micah Jaffe 
// Licensed for use under BSD License.
// http://www.opensource.org/licenses/bsd-license.php

// Crockford-ian object creation
// http://javascript.crockford.com/prototypal.html
if (typeof Object.create !== 'function') {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

// http://en.wikipedia.org/wiki/Fibonacci_number
// 0 + 1 + 1 + 2 + 3 + 5 + 8 ...  
var fibonacci = function (n, useRecursion) {
  var i, 
    a = 0, 
    b = 1, 
    sum = 0;

  if (typeof n !== 'number' || n < 0) {
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

  // FIXME: check for integer
  if (typeof n !== 'number' || n < 0) {
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

// http://en.wikipedia.org/wiki/Quicksort
// This does not sort in place, returns new array
var quicksort = function (array, comparator) {
  var lesser = [], 
    greater = [], 
    pivot;

  // Empty or array of 1 is already sorted
  if (typeof array !== 'object' 
      || !array.hasOwnProperty('length') 
      || array.length <= 1) {
    return array;
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
  pivot = array.pop();

  // Iterate and put vals into either lesser or greater lists compared
  // to the pivot
  for (var i = 0; i < array.length; i++) {
    if (comparator(array[i], pivot) < 1) {
      lesser.push(array[i]);
    } else {
      greater.push(array[i]);
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
var shuffle = function (array) {
  var i, k, prev;

  if (typeof array !== 'object' || !array.hasOwnProperty('length')) {
    return array;
  }

  // Walk backwards through array
  for (i = array.length - 1; i >= 0; i--) {

    // Pick an index in the array that is <= to the current location
    k = Math.floor(Math.random() * i);

    // Swap values with current index and random pick
    prev = array[i];
    array[i] = array[k];
    array[k] = prev;
  }

  return array;
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
exports.fibonacci = fibonacci;
exports.fib = fibonacci;
exports.factorial = factorial;
exports.fact = factorial;
exports.quicksort = quicksort;
exports.qsort = quicksort;
exports.shuffle = shuffle;
exports.TreeSort = TreeSort;
