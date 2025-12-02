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
