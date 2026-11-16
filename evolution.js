// Integração do painel com a Evolution API.
// A chave NUNCA fica neste arquivo: ela é digitada no formulário do painel
// e guardada apenas no localStorage do navegador.

const EVO = {
  get url() {
    return (localStorage.getItem('evo_url') || '').replace(/\/+$/, '');
  },
  get instance() {
    return localStorage.getItem('evo_instance') || '';
  },
  get key() {
    return localStorage.getItem('evo_key') || '';
  },
  save({ url, instance, key }) {
    localStorage.setItem('evo_url', url.trim());
    localStorage.setItem('evo_instance', instance.trim());
    localStorage.setItem('evo_key', key.trim());
  },
  clear() {
    ['evo_url', 'evo_instance', 'evo_key'].forEach((k) => localStorage.removeItem(k));
  },
};

async function evoFetch(path, options = {}) {
  if (!EVO.url || !EVO.key) {
    throw new Error('Configure a URL e a chave da Evolution API primeiro.');
  }
  const res = await fetch(`${EVO.url}${path}`, {
    ...options,
    headers: {
      apikey: EVO.key,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Evolution API respondeu HTTP ${res.status}`);
  }
  return res.json();
}

// Busca as etiquetas da instância configurada.
async function buscarEtiquetas() {
  return evoFetch(`/label/findLabels/${encodeURIComponent(EVO.instance)}`);
}

// Exemplo de uso no painel:
//
// document.getElementById('btn-salvar-evo').addEventListener('click', async () => {
//   EVO.save({
//     url: document.getElementById('evo-url').value,
//     instance: document.getElementById('evo-instance').value,
//     key: document.getElementById('evo-key').value,
//   });
//   try {
//     const etiquetas = await buscarEtiquetas();
//     console.log('Etiquetas:', etiquetas);
//   } catch (err) {
//     alert(err.message);
//   }
// });
