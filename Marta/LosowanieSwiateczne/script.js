const ENCRYPTED_MAP = {
  "Marta": {
    "iv": "LZBDhcQpk/nPxIbl",
    "ct": "Jz84axJDo9gfJBgGFRjw8oi5RoNI"
  },
  "Hania": {
    "iv": "aL33yinQeCdoSHwu",
    "ct": "O7GhYo/EvZBZZyjtTxT/SdCk0d0="
  },
  "Ania": {
    "iv": "6do0V+jn3oX7PUGt",
    "ct": "QEhQ2VRepB4MahuY/ejCQl01f6TL1gqmHw=="
  },
  "Piotrek": {
    "iv": "coFYoKRJB4YWSe63",
    "ct": "zDDdCor5Oyk8/jIr8k99JzMZfSUE"
  },
  "Agnieszka": {
    "iv": "tJ3eRox3SFi/KOcv",
    "ct": "lwXzjle8Rr6mNNbyGFkgAythwUF07Xo="
  },
  "Artur": {
    "iv": "TIvZ/9yKjO2t+wNd",
    "ct": "dSHJcCxFCVCXmKn27fIGMhAizHXR"
  },
  "Ola": {
    "iv": "qw8ZAmbPC/nqt8dy",
    "ct": "40DnfAhps+ut10pE7bQls2ybAhcz"
  },
  "Janusz": {
    "iv": "nfacjSNbxLDf/Spb",
    "ct": "G7PCOwUNOr45bqgutwZtOP5YqA=="
  },
  "Zosia": {
    "iv": "YYOyhnTpRt2OLyIC",
    "ct": "7cWXXvKIL0V1ik3JESTFvJtyA5deSw=="
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
