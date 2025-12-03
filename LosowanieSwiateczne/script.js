const ENCRYPTED_MAP = {
  "Zosia Januszkiewicz": {
    "iv": "5Rbg/Vc5QjsiyRbZ",
    "ct": "dcIktCnZXkKpTov1vu0zUMoT0XStrslEuiz8Seiapis2eINmkw=="
  },
  "Alicja Januszkiewicz": {
    "iv": "dwmfWQoP50x+FOKp",
    "ct": "tdnjFAq3rrJ/6aXBQGFcLZ96R81yMZZrFeOtTOCWbkkH/EYnhHGw"
  },
  "Michał Januszkiewicz": {
    "iv": "Jd+QNKlZ1Y/Z65o9",
    "ct": "wEjqWh2nVLsVb0R7Z7YGkdLEqAceBIiiZyvBM+1G5yyKP3pj"
  },
  "Katarzyna Januszkiewicz": {
    "iv": "9xgEuxh9n7mOZArI",
    "ct": "nCvqeZCc72V5NGQLqZwgLcyaSNOAMYUQFMJRa3+C5wXcRFQ="
  },
  "Robert Januszkiewicz": {
    "iv": "2t3SlW09sPUjXBL5",
    "ct": "EqXBeMrHlaeVJ4okJObcAXh2ZKQuwHS2S8heQfutV8SD6Ekh"
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
});
