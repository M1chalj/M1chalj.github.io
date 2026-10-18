const ENCRYPTED_MAP = {
  "Marta": {
    "iv": "Z/sg9eaG7VM7sCZL",
    "ct": "oHNnSDzeEJ2LGqC2t3+kGRpGKA=="
  },
  "Hania": {
    "iv": "JjooJaCiD7SKKCdB",
    "ct": "eRRObzjshVJ5iZACpdyiIR9k8QA1"
  },
  "Ania": {
    "iv": "4TlnYAGXOjOGxef2",
    "ct": "6tutFVGMy6/AfeOjhIvmWIJ9stXN"
  },
  "Piotrek": {
    "iv": "T3LYP8YD1AqkbDbj",
    "ct": "tH9zZy/6vHh7n+0u++KDxHZ3aizy+A=="
  },
  "Ola": {
    "iv": "GIyrn/F+NBN89eT6",
    "ct": "/+4xUsQx2BdhSUD14eey3tfGFu4="
  },
  "Janusz": {
    "iv": "dSI/OYWQrCxlnC+e",
    "ct": "i4hkDzshAEFdmA/5NoZH6ATDB1940G7U5kk="
  },
  "Artur": {
    "iv": "jviAFRMWUtMePFwc",
    "ct": "BswYVRGZCR2MIVozz/gl363f2hRgIRM="
  },
  "Agnieszka": {
    "iv": "2sRKkQKjSkr1Kwoa",
    "ct": "a1lDHcdAbXj2oBgo3b/+QbldjoxBUXo="
  },
  "Łukasz": {
    "iv": "hiuQt7DV94cOYkIy",
    "ct": "dbH69gmAn+VpsxAsr0hIUMwDGFwU"
  },
  "Magda": {
    "iv": "U5BDNyDibqUguZK4",
    "ct": "xSWJHC42Fe5cgcUqScYAAduhO1pKS69Ufg=="
  },
  "Ignaś": {
    "iv": "eRnarLY1lBRQyk6H",
    "ct": "KXB5PzXEO+Tc5I87b+ETkr3+QR6pSA=="
  },
  "Basia": {
    "iv": "mp2v+ILvS+uryeHH",
    "ct": "V6M0Qr4rPbeRCeEv1FEIo9tA+P3U"
  },
  "Zosia": {
    "iv": "QZ1SLPT+q0diZUFY",
    "ct": "Ok4F7H66/C8CtEqIMcKXclACFUiU"
  },
  "Stanisław": {
    "iv": "q+AylcfGMX5CdJTJ",
    "ct": "gN4SythpBreP8HLjKDGwkI3uujGA"
  }
};

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

  pwEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      revealBtn.click();
    }
  });
});
