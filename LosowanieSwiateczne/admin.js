const DEFAULT_NAMES = [
  'Zosia Januszkiewicz',
  'Alicja Januszkiewicz',
  'Michał Januszkiewicz',
  'Katarzyna Januszkiewicz',
  'Robert Januszkiewicz'
];

function createRows(names){
  const rows = document.getElementById('rows');
  rows.innerHTML = '';
  for (const name of names){
    const tr = document.createElement('div');
    tr.className = 'pw-row';
    const label = document.createElement('div');
    label.textContent = name;
    label.className = 'pw-label';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'password for ' + name;
    input.className = 'pw-input';
    input.dataset.name = name;

    tr.appendChild(label);
    tr.appendChild(input);
    rows.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const namesArea = document.getElementById('namesArea');
  const createRowsBtn = document.getElementById('createRowsBtn');
  const generateBtn = document.getElementById('generateBtn');
  const generatePwBtn = document.getElementById('generatePwBtn');
  const downloadPwBtn = document.getElementById('downloadPwBtn');
  const outJson = document.getElementById('outJson');
  const copyBtn = document.getElementById('copyBtn');

  namesArea.value = DEFAULT_NAMES.join('\n');

  createRowsBtn.addEventListener('click', () => {
    const names = namesArea.value.split('\n').map(s=>s.trim()).filter(Boolean);
    if (names.length === 0) return alert('Provide at least one name');
    createRows(names);
  });

  const PW_WORDS = [
    'Mikolaj','Snieg','Balwan','Gwiazdka','Choinka',
    'Prezent','Kolenda','Oplatek','Aniol','Bombka',
    'Dzwonek','Sanie','Piernik','Wigilia','Cukierek'
  ];

  function randInt(max){ return Math.floor(Math.random()*max); }

  function genPassword(){
    const w1 = PW_WORDS[randInt(PW_WORDS.length)];
    const w2 = PW_WORDS[randInt(PW_WORDS.length)];
    const num = String(randInt(1000)).padStart(3,'0');
    return w1 + w2 + num;
  }

  generatePwBtn.addEventListener('click', () => {
    let rows = document.getElementById('rows');
    let inputs = rows.querySelectorAll('input[data-name]');
    if (!inputs || inputs.length === 0){
      return alert('No names provided - use Create Rows first.');
    }

    const generated = [];
    for (const inp of inputs){
      const pw = genPassword();
      inp.value = pw;
      generated.push({name: inp.dataset.name, password: pw});
    }

    downloadPwBtn.disabled = false;
    downloadPwBtn._generated = generated;
  });

  downloadPwBtn.addEventListener('click', () => {
    const generated = downloadPwBtn._generated;
    if (!generated || generated.length === 0) return alert('No generated passwords to download. Click Generate Passwords first.');

    function escapeCsvField(s){
      if (s == null) return '';
      const str = String(s).replace(/"/g,'""');
      return '"' + str + '"';
    }

    const lines = ['"name","password"'];
    for (const row of generated) lines.push(escapeCsvField(row.name) + ',' + escapeCsvField(row.password));
    const csv = lines.join('\n');

    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  generateBtn.addEventListener('click', async () => {
    const rows = document.getElementById('rows');
    const inputs = rows.querySelectorAll('input[data-name]');
    const names = [];
    const pwMap = {};
    for (const inp of inputs){
      const name = inp.dataset.name;
      const pw = inp.value;
      if (!pw){ return alert('Missing password for: ' + name); }
      names.push(name);
      pwMap[name] = pw;
    }

    if (names.length === 0){ return alert('No names/rows found. Click Create Rows first.'); }

    const {order, map} = LSCommon.makeSingleCycle(names);
    const encrypted = {};
    for (const giver of names){
      const recipient = map[giver];
      const encObj = await LSCommon.encryptText(recipient, giver, pwMap[giver]);
      encrypted[giver] = encObj;
    }

    const pretty = JSON.stringify(encrypted, null, 2);
    const snippet = 'const ENCRYPTED_MAP = ' + pretty + ';';
    outJson.value = snippet;
  });

  copyBtn.addEventListener('click', async () => {
    const out = document.getElementById('outJson').value;
    if (!out) return alert('Nothing to copy');
    try{
      await navigator.clipboard.writeText(out);
    }catch(e){
      alert('Copy failed — select and copy manually.');
    }
  });
});
