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
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  for (const name of names){
    const tr = document.createElement('div');
    tr.style.display = 'flex';
    tr.style.gap = '8px';
    tr.style.marginBottom = '6px';
    const label = document.createElement('div');
    label.textContent = name;
    label.style.flex = '1';
    label.style.padding = '8px 10px';
    label.style.background = '#fafafa';
    label.style.border = '1px solid #eee';
    label.style.borderRadius = '6px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'password for ' + name;
    input.style.flex = '1';
    input.dataset.name = name;

    tr.appendChild(label);
    tr.appendChild(input);
    rows.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const namesArea = document.getElementById('namesArea');
  const createRowsBtn = document.getElementById('createRowsBtn');
  const loadDefaultsBtn = document.getElementById('loadDefaultsBtn');
  const generateBtn = document.getElementById('generateBtn');
  const outJson = document.getElementById('outJson');
  const copyBtn = document.getElementById('copyBtn');
  const downloadLink = document.getElementById('downloadLink');

  // Prefill names area with defaults
  namesArea.value = DEFAULT_NAMES.join('\n');

  createRowsBtn.addEventListener('click', () => {
    const names = namesArea.value.split('\n').map(s=>s.trim()).filter(Boolean);
    if (names.length === 0) return alert('Provide at least one name');
    createRows(names);
  });

  loadDefaultsBtn.addEventListener('click', () => {
    namesArea.value = DEFAULT_NAMES.join('\n');
    createRows(DEFAULT_NAMES);
  });

  generateBtn.addEventListener('click', async () => {
    // collect names and passwords from rows
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
    outJson.value = pretty;

    // create copy-ready snippet to paste into script.js
    const snippet = 'const ENCRYPTED_MAP = ' + pretty + ';';
    downloadLink.textContent = 'Download mapping.js';
    downloadLink.href = URL.createObjectURL(new Blob([snippet], {type:'application/javascript'}));
    downloadLink.download = 'mapping.js';
  });

  copyBtn.addEventListener('click', async () => {
    const out = document.getElementById('outJson').value;
    if (!out) return alert('Nothing to copy');
    try{
      await navigator.clipboard.writeText(out);
      alert('Copied encrypted mapping to clipboard (JSON only).');
    }catch(e){
      alert('Copy failed — select and copy manually.');
    }
  });
});
