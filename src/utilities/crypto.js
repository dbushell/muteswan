const {crypto} = window;

const textEncoder = new window.TextEncoder();
const textDecoder = new window.TextDecoder();

// Convert a Buffer to a Hexadecimal string
const bufferToHex = (buffer) =>
  [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, 0))
    .join('');

// Convert a Hexadecimal string to a Buffer
const hexToBuffer = (hex) =>
  new Uint8Array(hex.match(/.{1,2}/g).map((b) => Number.parseInt(b, 16)))
    .buffer;

// Convert a Buffer to a Base64 string
const bufferToBase64 = (buffer) =>
  window.btoa(String.fromCharCode(...new Uint8Array(buffer)));

// Convert a Base64 string to a Buffer
const base64ToBuffer = (base64) =>
  Uint8Array.from([...window.atob(base64)].map((c) => c.charCodeAt())).buffer;

// Return a Buffer SHA-256 digest from a text value
async function sha256Digest(value) {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    textEncoder.encode(value)
  );
  return buffer;
}

// Return a Hexadecimal SHA-256 string from a text value
const sha256Hash = async (value) => bufferToHex(await sha256Digest(value));

// Return a random IV value for AES-GCM
const randomIv = (length) => crypto.getRandomValues(new Uint8Array(length));

// Return an AES-GCM key from a password
async function getKey(password) {
  const key = await crypto.subtle.importKey(
    'raw',
    await sha256Digest(password),
    {name: 'AES-GCM'},
    false,
    ['encrypt', 'decrypt']
  );
  return key;
}

/**
 * Encrypt a text value with a password
 * Return the format "[iv]:[data]"
 * "[iv]" is hexadecimal
 * "[data]" is based64
 */
async function encryptIv(value, key) {
  const iv = randomIv(12);
  const theKey = key instanceof window.CryptoKey ? key : await getKey(key);
  const encryptedValue = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    theKey,
    textEncoder.encode(value)
  );
  return `${bufferToHex(iv)}:${bufferToBase64(encryptedValue)}`;
}

/**
 * Decrypt a text value with a password
 * Format must be "[iv]:[data]"
 * "[iv]" is hexadecimal
 * "[data]" is based64
 */
async function decryptIv(value, key) {
  const data = value.split(':');
  const iv = hexToBuffer(data[0]);
  const theKey = key instanceof window.CryptoKey ? key : await getKey(key);
  const decryptedValue = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    theKey,
    base64ToBuffer(data[1])
  );
  return textDecoder.decode(decryptedValue);
}

export {
  bufferToHex,
  hexToBuffer,
  bufferToBase64,
  base64ToBuffer,
  sha256Digest,
  sha256Hash,
  randomIv,
  encryptIv,
  decryptIv
};
