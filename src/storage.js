import storage from 'redux-persist/lib/storage';

import {sha256Hash, encryptIv, decryptIv} from './utilities/crypto';

// Default encryption password
const defaultPassword = 'muteswan';

// Internal store
let passwordHash = defaultPassword;
let passwordChecksum = false;

// Return the stored password
const getPassword = () => passwordHash;

// Returne the stored checksum
export const getChecksum = () => passwordChecksum;

// Peristed state is locked until this promise resolves
let isLocked = Promise.resolve();

// Remember known keys used by storage
const storedKeys = Object.create(null);
const getKeys = () => Object.keys(storedKeys);

// Returns true if storage key has encrypted data
const isKeyEncrypted = (key) => /^encrypted[^:]*?:/.test(key);

// Get the encrypted key name from a storage key name
const encryptKey = (key, suffix = false) => {
  const newKey = key.replace(/^(encrypted[^:]*?:)?/, `encrypted:`);
  if (suffix) {
    return newKey.replace(/^(encrypted)/, `$1-${suffix}`);
  }

  return newKey;
};

// Return true if the stored state is password protecte
export const isDataProtected = async () => {
  const checksumKey = encryptKey('persist:root', 'checksum');
  const storedChecksum = await storage.getItem(checksumKey);
  return String(storedChecksum).length === 64;
};

/**
 * Set a new encryption password
 */
export const setPassword = (value) => {
  // eslint-disable-next-line no-async-promise-executor
  isLocked = new Promise(async (resolve) => {
    const valueHash = await sha256Hash(value + defaultPassword);
    const newChecksum = await sha256Hash(valueHash);
    // Skip if password has not changed
    if (value === getPassword() || newChecksum === getChecksum()) {
      resolve(false);
      return;
    }

    // Purge persisted storage
    getKeys().forEach(async (key) => {
      await storage.removeItem(key);
    });

    const checksumKey = encryptKey('persist:root', 'checksum');

    if (value) {
      // Set new password and remember checksum
      await storage.setItem(checksumKey, newChecksum);
      storedKeys[checksumKey] = Date.now();
      passwordChecksum = newChecksum;
      passwordHash = valueHash;
    } else {
      // Set default password and remove checksum
      await storage.removeItem(checksumKey);
      delete storedKeys[checksumKey];
      passwordChecksum = false;
      passwordHash = defaultPassword;
    }

    resolve(true);
  });
  return isLocked;
};

/**
 * Validate and set the interal password
 */
export const activatePassword = (value) => {
  // eslint-disable-next-line no-async-promise-executor
  isLocked = new Promise(async (resolve) => {
    const checksumKey = encryptKey('persist:root', 'checksum');
    const storedChecksum = await storage.getItem(checksumKey);
    const valueHash = await sha256Hash(value + defaultPassword);
    const newChecksum = await sha256Hash(valueHash);
    const isValid = storedChecksum === newChecksum;
    if (isValid) {
      storedKeys[checksumKey] = Date.now();
      passwordChecksum = newChecksum;
      passwordHash = valueHash;
    }

    resolve(isValid);
  });
  return isLocked;
};

/**
 * Return item from storage and decrypt if necessary
 */
const getItem = (key) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await isLocked;
      // Bypass encryption for old values or direct access
      const oldValue = await storage.getItem(key);
      if (oldValue) {
        // Remove and return the unencrypted value for backwards-compatibility
        if (isKeyEncrypted(key) === false) {
          await storage.removeItem(key);
        }

        resolve(oldValue);
        return;
      }

      const newKey = encryptKey(key);
      const hashKey = encryptKey(newKey, 'hash');
      const storedValue = await storage.getItem(newKey);
      const storedHash = await storage.getItem(hashKey);
      // Return value if no stored hash
      if (!storedHash) {
        resolve(storedValue);
        return;
      }

      const storedValueHash = await sha256Hash(storedValue);
      // Return value if item was not encrypted
      if (storedHash === storedValueHash) {
        resolve(storedValue);
        return;
      }

      // Return decrypted value if hashes match
      const pass = getPassword();
      const decryptedValue = await decryptIv(storedValue, pass);
      const decryptedValueHash = await sha256Hash(decryptedValue);
      if (storedHash === decryptedValueHash) {
        resolve(decryptedValue);
        return;
      }

      // Hashes do not match
      throw new Error('Hash mismatch');
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Add item to storage along with its value hash pair
 */
const setItem = (key, value) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await isLocked;
      const newKey = encryptKey(key);
      const hashKey = encryptKey(newKey, 'hash');
      // Store hashed value prior to encryption
      const valueHash = await sha256Hash(value);
      await storage.setItem(hashKey, valueHash);
      storedKeys[hashKey] = Date.now();
      // Encrypt and store value
      const pass = getPassword();
      const encryptedValue = await encryptIv(value, pass);
      await storage.setItem(newKey, encryptedValue);
      storedKeys[newKey] = Date.now();
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

/**
 * Remove item from storage along with its value hash pair
 */
const removeItem = (key) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await isLocked;
      const newKey = encryptKey(key);
      const hashKey = encryptKey(key, 'hash');
      await storage.removeItem(newKey);
      await storage.removeItem(hashKey);
      if (newKey in storedKeys) {
        delete storedKeys[newKey];
        delete storedKeys[hashKey];
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Return decrypted data if valid persisted root with matching hash value
 */
export const decryptData = (data) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      await isLocked;

      // Configure data keys
      const key = encryptKey('persist:root');
      const hashKey = encryptKey(key, 'hash');
      const checksumKey = encryptKey(key, 'checksum');

      // Check if data is password protected
      const storedChecksum = data[checksumKey];
      let isProtected = getChecksum() !== false;

      if (storedChecksum) {
        if (storedChecksum !== getChecksum()) {
          throw new Error('Data encrypted with different password');
        }
      } else {
        isProtected = false;
      }

      if (!(key in data) || !(hashKey in data)) {
        resolve(null);
        return;
      }

      // Attempt to decrypt the data
      const pass = isProtected ? getPassword() : defaultPassword;
      const decryptedValue = await decryptIv(data[key], pass);
      const decryptedValueHash = await sha256Hash(decryptedValue);

      if (data[hashKey] === decryptedValueHash) {
        resolve(decryptedValue);
        return;
      }

      resolve(null);
    } catch (error) {
      reject(error);
    }
  });

const encryptedStorage = {
  getKeys,
  getItem,
  setItem,
  removeItem
};

export default encryptedStorage;
