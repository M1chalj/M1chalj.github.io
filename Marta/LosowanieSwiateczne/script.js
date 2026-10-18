const ENCRYPTED_MAP = {
  "Babcia Anusia": {
    "iv": "+x3Nx5WAP15O2PXX",
    "ct": "EdXMuN6bSv0zm7lbxUcTJDKUNnfE8EJbYdgoQdoPqqBY6EYU"
  },
  "Ala Podgórska": {
    "iv": "rsD0W1LanHL1AYjE",
    "ct": "E49tu7hb1ApPnTGH+Y5vKK/HHmLqE77J87zYoscr3dq2"
  },
  "Teresa Przybyła": {
    "iv": "rYvZFVE/Dr4++1n+",
    "ct": "2pZ5QaSN3QTh/C48XVkQjHeu4mi9hp1uDIdL4m+HUqFa"
  },
  "Lucjan Przybyła": {
    "iv": "/A57Fnj3lNyBn4tQ",
    "ct": "ZLVA6GYC7X1tc3D5AP3kPtXjnp68w0o64etFCUo="
  },
  "Tomek Przybyła": {
    "iv": "FIww71Hi5L99S6oj",
    "ct": "NmwLdgQO+I8wxvbXilu/pDaNnW7nFMQkJD8gs0b5cnU="
  },
  "Paulina Przybyła": {
    "iv": "JniGcceXl4w8e9cX",
    "ct": "SfcVytN7FGekjXxKV40bUF0YJPLC+HG+Qe1JcIkXbb849tY="
  },
  "Łukasz Przybyła": {
    "iv": "KFWBisjdPSNRK8nH",
    "ct": "mXYuo7A7ULyE4g1gHMJLLFo/TXEsNUOiWRyG7hmA"
  },
  "Kasia Przybyła": {
    "iv": "GhRnN2PHp7oig0XJ",
    "ct": "SwOFCPeEq3kr2a5qJYj38Sw1ecSpponsRvvd813iQo8="
  },
  "Marysia Zysiek": {
    "iv": "jmZR0muoaYHpUeWE",
    "ct": "FZCM4+Ve2Eg7hBA0gKSBhaSr2RrZkeDVAdhO/4pH6OHA3ZQ="
  },
  "Krzysiu Zysiek": {
    "iv": "FhVsgtpikNKSPR34",
    "ct": "g0LrvzW056mPapVVmTfArWvcLAL3+AB3zZ9a27kJ9X3u43NiHQ=="
  },
  "Kasia Januszkiewicz": {
    "iv": "umptZMaKIXdWp4Em",
    "ct": "aiJa7nbIG1KGyo3ZKoRFdYoOvXhbn+ZWhDIw4JfYnw=="
  },
  "Robert Januszkiewicz": {
    "iv": "9Ws8dpozCgMu4m/N",
    "ct": "/FW5/epCCkXDCvlPMHs4n5Ejx7M8g2rMM7GtL7ul28jEKgY1"
  },
  "Michał Januszkiewicz": {
    "iv": "nBJCTVNn5TpSVCC9",
    "ct": "h0yHnDHlZzOgJhatMKN233+zXqYDOqMOTPKzqGlulw=="
  },
  "Alicja Januszkiewicz": {
    "iv": "mJGlaKYfEe+LLTIl",
    "ct": "FLcx//v9ulevvDnmiCRndeXa9sQknhPEnRoICMG8"
  },
  "Zosia Januszkiewicz": {
    "iv": "2o11gsQFjzmzHz0a",
    "ct": "dZyCQY6ut8CFT8+Ng6fH9OMRVASj4H6hC5Uj8pBY"
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
