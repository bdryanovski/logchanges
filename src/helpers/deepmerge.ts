// https://github.com/TehShrike/deepmerge/blob/master/index.js

type Target = Record<any, any>
type Source = Record<any, any>
type Options = Record<any, any>
type Merged = Record<any, any>

function isMergeableObject(val: Record<any, any>): boolean {
  const nonNullObject = val && typeof val === 'object';

  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]';
}

function emptyTarget(val: any)  {
  return Array.isArray(val) ? [] : {};
}

function cloneIfNecessary(value: any, optionsArgument?: Options) {
  const clone = optionsArgument && optionsArgument.clone === true;
  return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value;
}

function defaultArrayMerge(target: Target, source: Source, optionsArgument: Options) {
  const destination = target.slice();
  source.forEach(function (e: Target, i: number) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e, optionsArgument);
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument);
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument));
    }
  });
  return destination;
}

function mergeObject(target: Target, source: Source, optionsArgument?: Options) {
  const destination: Target = {};
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function (key: string) {
      destination[key] = cloneIfNecessary(target[key], optionsArgument);
    });
  }
  Object.keys(source).forEach(function (key: string) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key], optionsArgument);
    } else {
      destination[key] = deepmerge(target[key], source[key], optionsArgument);
    }
  });
  return destination;
}

export default function deepmerge(target: Target, source: Source, optionsArgument?: Options): Merged {
  const array = Array.isArray(source);
  const options = optionsArgument || { arrayMerge: defaultArrayMerge };
  const arrayMerge = options.arrayMerge || defaultArrayMerge;

  if (array) {
    return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument);
  } else {
    return mergeObject(target, source, optionsArgument);
  }
}

deepmerge.all = function deepmergeAll(array: any[], optionsArgument: Options) {
  if (!Array.isArray(array) || array.length < 2) {
    throw new Error('first argument should be an array with at least two elements');
  }

  // we are sure there are at least 2 values, so it is safe to have no initial value
  return array.reduce(function (prev: Target, next: Source) {
    return deepmerge(prev, next, optionsArgument);
  });
};

