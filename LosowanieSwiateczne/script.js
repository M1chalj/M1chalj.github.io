/*
  script.js

  - Placeholder `NAMES` array: edit with your family list.
  - `ENCRYPTED_MAP` should be embedded here after admin generates it.

  Encryption mechanism (client-side using Web Crypto API):
  - Key is derived from the user's full name + their password using PBKDF2 (SHA-256).
  - Derived key is used with AES-GCM to encrypt the recipient's name.
  - The encrypted map stores base64-encoded ciphertext + iv per giver.

  Assignment logic:
  - Generate a random permutation of names, then make each person give to the next name
    in that permutation, with the last giving to the first. This yields a single cycle.

  Admin flow to create the mapping:
  1. Fill the "Names" textarea (one per line).
  2. Provide a JSON object mapping each name to that person's chosen password.
  3. Click "Generate & Encrypt Map" — the output JSON will be produced for copy/paste.

  Security note: This is client-side only and meant for lightweight family usage.
  Do not assume strong protection against determined attackers.
*/

// --- Placeholder names --- edit these as needed
const NAMES = [
  'Alice Smith',
  'Bob Johnson',
  'Carol White',
  'David Green'
];

// --- Encrypted map placeholder --- after you generate the map, paste it here.
// Example structure:
// const ENCRYPTED_MAP = {
//   'Alice Smith': { iv: 'base64...', ct: 'base64...' },
//   ...
// };
const ENCRYPTED_MAP = {
  "Alicja Januszkiewicz": {
    "iv": "MtQAMANeSQnJRb6x",
    "ct": "F1HrfWZjLGUJxRel4BtmHxgK9PfHbjd+/toneV3YF+repl4="
  },
  "Zosia Januszkiewicz": {
    "iv": "hpeRjjmh6he20hDf",
    "ct": "OupLKkvxBqVjVpFRmJ9aMN+m64YBabzdzFqVc2G+5ZC2wF0x5Q=="
  },
  "Michał Januszkiewicz": {
    "iv": "YeLmamzSWp03nqc7",
    "ct": "kbOGhYa8Ce01wJPsv/H85U1/1U75nPUsPlpwDu8fDWbB7g/cGn70"
  },
  "Katarzyna Januszkiewicz": {
    "iv": "F+Wz8xUxFbFa13hj",
    "ct": "4IeKXnxmvH0PSGnYhBhEgeFfn4UwuEj5CfEJsf/QAiJCYQEe"
  },
  "Robert Januszkiewicz": {
    "iv": "D2yq7x0H0VN2vXcY",
    "ct": "EkuEbVpJu8bmHna2IgXNQPTHMYnu+0iSyCKP4C3RHotHnRc4"
  }
};

// Use shared helpers from `crypto-common.js` (available as `LSCommon`).

// --- Assignment generation: create a single cycle ---
// Use `LSCommon.shuffleArray` and `LSCommon.makeSingleCycle` from shared helpers.

// --- UI interactions ---
document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('fullname');
  const pwEl = document.getElementById('password');
  const resultEl = document.getElementById('result');
  const revealBtn = document.getElementById('revealBtn');

  revealBtn.addEventListener('click', async () => {
    const name = nameEl.value.trim();
    const pw = pwEl.value;
    resultEl.textContent = '';
    if (!name || !pw) { resultEl.textContent = 'Wpisz pełne imię i nazwisko oraz hasło.'; return; }

    const entry = ENCRYPTED_MAP[name];
    if (!entry){ resultEl.textContent = 'Nie znaleziono wpisu dla tej osoby. Sprawdź pisownię i wielkość liter.'; return; }

    try{
      const recipient = await LSCommon.decryptText(entry, name, pw);
      resultEl.textContent = `Dajesz prezent: ${recipient}`;
    }catch(e){
      resultEl.textContent = 'Niepoprawne hasło lub uszkodzone dane. Spróbuj ponownie.';
    }
  });

  // Admin generation UI
  const namesArea = document.getElementById('namesArea');
  const pwJson = document.getElementById('pwJson');
  const generateBtn = document.getElementById('generateBtn');
  const outJson = document.getElementById('outJson');

  // Pre-fill admin names area with current NAMES
  namesArea.value = NAMES.join('\n');

  generateBtn.addEventListener('click', async () => {
    const names = namesArea.value.split('\n').map(s=>s.trim()).filter(Boolean);
    let pwMap;
    try{
      pwMap = JSON.parse(pwJson.value || '{}');
    }catch(e){
      outJson.value = 'Passwords JSON is invalid.'; return;
    }

    // Validate passwords provided for every participant
    for (const n of names){
      if (!pwMap[n]){ outJson.value = `Missing password for: ${n}`; return; }
    }

    const {order, map} = LSCommon.makeSingleCycle(names);

    // Build encrypted mapping
    const encrypted = {};
    for (const giver of names){
      const recipient = map[giver];
      const pw = pwMap[giver];
      const encObj = await LSCommon.encryptText(recipient, giver, pw);
      encrypted[giver] = encObj;
    }

    // Output JSON for copy/paste into script.js
    outJson.value = JSON.stringify(encrypted, null, 2);
  });
});
