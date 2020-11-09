/**
 * Object Hashsum
 * https://github.com/bevacqua/hash-sum
 */

const fold = (hash, text) => {
  if (text.length === 0) {
    return hash;
  }

  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  return hash < 0 ? hash * -2 : hash;
};

const foldObject = (hash, object, seen) =>
  Object.keys(object)
    .sort()
    .reduce((hash, key) => {
      return foldValue(hash, object[key], key, seen);
    }, hash);

const foldValue = (input, value, key, seen) => {
  const hash = fold(
    fold(fold(input, key), Object.prototype.toString.call(value)),
    typeof value
  );

  if (value === null) {
    return fold(hash, 'null');
  }

  if (value === undefined) {
    return fold(hash, 'undefined');
  }

  if (typeof value === 'object' || typeof value === 'function') {
    if (seen.includes(value)) {
      return fold(hash, '[Circular]' + key);
    }

    seen.push(value);
    const objectHash = foldObject(hash, value, seen);

    if (!('valueOf' in value) || typeof value.valueOf !== 'function') {
      return objectHash;
    }

    try {
      return fold(objectHash, String(value.valueOf()));
    } catch (error) {
      return fold(
        objectHash,
        '[valueOf exception]' + (error.stack || error.message)
      );
    }
  }

  return fold(hash, value.toString());
};

const hashsum = (o) => foldValue(0, o, '', []).toString(16).padStart(8, 0);

export default hashsum;
