const ENCRYPTED_MAP = {
  "Babcia": {
    "iv": "zGOpPa0ypSBloA3s",
    "ct": "bqSKOovyNWZ5Br8OU44mr98jpgrl"
  },
  "Ala": {
    "iv": "01+9nQlJaWqIyB0G",
    "ct": "BTDTybRli51ZosgayXz7Ia7KzADrTfBuFRf/LP03Sg=="
  },
  "Teresa": {
    "iv": "n3U3ZI4lQLdIuDa6",
    "ct": "5ujBczKs46H/+qiLhQfIKmMXlS1/qYg5VrVSvdgr1bDk2zs="
  },
  "Lucek": {
    "iv": "ioI7hoDum3mRSd09",
    "ct": "WNqxthYSA1Qz3rU0zopSIEgwkVDv/PA="
  },
  "Marysia": {
    "iv": "XNoeR0NQTBStRJ1G",
    "ct": "wTHgFk6CpPr0PlIQIDpE+se6Vw=="
  },
  "Krzysiu": {
    "iv": "E/va0XIEhgWxA2xp",
    "ct": "SXX9mw2hF4PQyxDw2Wd/tbYeJuaj"
  },
  "Tomek": {
    "iv": "lEx0htLBcGRnXbJl",
    "ct": "gne/qSDlyddCLuN6+Hzjz/vuTLAeJw=="
  },
  "Paulina": {
    "iv": "QpQVYqum/w0+wVCQ",
    "ct": "v5LB+6Jx+aer5V1GdUOaxSbh8015TA=="
  },
  "Łukasz": {
    "iv": "n8834F/wovNWrOQN",
    "ct": "hxBh5XMonu+1nDIo/LOxd5NPRQdhbnI="
  },
  "Kasia Przybyła": {
    "iv": "AeKaIacsmmuVhQNH",
    "ct": "xciGUba749Mj+Le7wNSIjCVq9786Og=="
  },
  "Kasia Januszkiewicz": {
    "iv": "jVpZKO8FJ4idNmlW",
    "ct": "9ADuxLkp4VaOcwzanaUIwWQoScsZMT0="
  },
  "Robert": {
    "iv": "t5oqHa/fSfXE/BHp",
    "ct": "+7glg1+4yISZmFUXA9vBCf/rmyo7iMI="
  },
  "Michał": {
    "iv": "0zDc0iAXW/zzqr2I",
    "ct": "Li3Z6hKHrhUVMxWR+XYsr0BaP8gFlw=="
  },
  "Alicja": {
    "iv": "AXqxGQqhgQO1qgkq",
    "ct": "E8ojgdC33YKyFJ63/17NBQFVBoOU"
  },
  "Zosia": {
    "iv": "q8JATodRdgg8tDle",
    "ct": "gijD38MMaE3H6mC1Fqs/zmHLwK4lQeA="
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
