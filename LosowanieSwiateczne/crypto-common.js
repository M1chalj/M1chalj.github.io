(function(){
  // Shared crypto and utility helpers for LosowanieSwiateczne
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function bufToBase64(buf){
    const bytes = new Uint8Array(buf);
    let str = '';
    for (let i=0;i<bytes.length;i++) str += String.fromCharCode(bytes[i]);
    return btoa(str);
  }

  function base64ToBuf(b64){
    const str = atob(b64);
    const buf = new Uint8Array(str.length);
    for (let i=0;i<str.length;i++) buf[i] = str.charCodeAt(i);
    return buf.buffer;
  }

  async function deriveKey(name, password){
    const salt = enc.encode(name);
    const pwKey = await crypto.subtle.importKey('raw', enc.encode(password), {name:'PBKDF2'}, false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey(
      {name:'PBKDF2', salt, iterations:150000, hash:'SHA-256'},
      pwKey,
      {name:'AES-GCM', length:256},
      false,
      ['encrypt','decrypt']
    );
    return key;
  }

  async function encryptText(plain, name, password){
    const key = await deriveKey(name, password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(plain));
    return { iv: bufToBase64(iv.buffer), ct: bufToBase64(ct) };
  }

  async function decryptText(obj, name, password){
    const key = await deriveKey(name, password);
    try{
      const iv = base64ToBuf(obj.iv);
      const ct = base64ToBuf(obj.ct);
      const plainBuf = await crypto.subtle.decrypt({name:'AES-GCM', iv:new Uint8Array(iv)}, key, ct);
      return dec.decode(plainBuf);
    }catch(e){
      throw new Error('Decryption failed');
    }
  }

  function shuffleArray(arr){
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeSingleCycle(names){
    const order = shuffleArray(names);
    const map = {};
    for (let i=0;i<order.length;i++){
      const giver = order[i];
      const recipient = order[(i+1)%order.length];
      map[giver] = recipient;
    }
    return {order, map};
  }

  window.LSCommon = {
    enc, dec,
    bufToBase64, base64ToBuf,
    deriveKey, encryptText, decryptText,
    shuffleArray, makeSingleCycle
  };
})();
