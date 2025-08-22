// CraftPanel demo de control y configuración
const App = (() => {
  const STATE_KEY = 'cp_server_state';
  const CFG_KEY = 'cp_server_cfg';

  let state = {
    status: 'offline', // 'offline' | 'online' | 'restarting'
    ip: '127.0.0.1',
    port: 25565,
    tps: 20.0,
    players: { online: 0, max: 20 },
    ram: { used: 0.3, max: 2 }
  };

  let cfg = {
    name: 'Mi servidor',
    version: '1.21.1',
    ram: 2,
    slots: 20
  };

  function load(){
    try { Object.assign(state, JSON.parse(localStorage.getItem(STATE_KEY)) || {}); } catch(e){}
    try { Object.assign(cfg, JSON.parse(localStorage.getItem(CFG_KEY)) || {}); } catch(e){}
  }
  function save(){
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
  }

  function $(id){ return document.getElementById(id); }

  // UI bindings
  function render(){
    // status
    const dot = $('statusDot');
    const text = $('statusText');
    dot.classList.remove('status-up','status-down');
    if (state.status === 'online'){
      dot.classList.add('status-up');
      text.textContent = 'En línea';
    } else if (state.status === 'restarting'){
      text.textContent = 'Reiniciando...';
    } else {
      dot.classList.add('status-down');
      text.textContent = 'Apagado';
    }

    $('svIp').textContent = state.ip;
    $('svPort').textContent = state.port;
    $('svTps').textContent = state.tps.toFixed(1);
    $('svPlayers').textContent = `${state.players.online}/${state.players.max}`;
    $('svRam').textContent = `${state.ram.used.toFixed(1)} / ${state.ram.max} GB`;

    // cfg form
    $('cfgName').value = cfg.name;
    $('cfgVersion').value = cfg.version;
    $('cfgRam').value = cfg.ram;
    $('cfgSlots').value = cfg.slots;
  }

  // Fake console
  function log(line){
    const c = $('console');
    const ts = new Date().toLocaleTimeString();
    c.textContent += `[${ts}] ${line}\n`;
    c.scrollTop = c.scrollHeight;
  }

  function randomStep(){
    if (state.status !== 'online') return;
    // Simula variación de RAM/players/TPS
    const deltaRam = (Math.random() * .2 - .05);
    state.ram.used = Math.max(.1, Math.min(state.ram.max - .1, state.ram.used + deltaRam));
    const deltaPlayers = Math.floor(Math.random()*3 - 1);
    state.players.online = Math.max(0, Math.min(state.players.max, state.players.online + deltaPlayers));
    state.tps = Math.max(18, Math.min(20, state.tps + (Math.random()*.2 - .1)));
    save();
    render();
  }

  function bind(){
    $('logoutBtn')?.addEventListener('click', Auth.logout);

    $('btnStart')?.addEventListener('click', ()=>{
      if (state.status === 'online') return log('Servidor ya está en línea.');
      state.status = 'online';
      log('Iniciando servidor...');
      setTimeout(()=> log('Servidor en línea.'), 600);
      save(); render();
    });

    $('btnStop')?.addEventListener('click', ()=>{
      if (state.status === 'offline') return log('Servidor ya está apagado.');
      state.status = 'offline';
      state.players.online = 0;
      log('Deteniendo servidor...');
      setTimeout(()=> log('Servidor apagado.'), 600);
      save(); render();
    });

    $('btnRestart')?.addEventListener('click', ()=>{
      if (state.status !== 'online') return log('No se puede reiniciar: el servidor está apagado.');
      state.status = 'restarting';
      log('Reiniciando servidor...');
      render();
      setTimeout(()=>{
        state.status = 'online';
        log('Servidor reiniciado.');
        save(); render();
      }, 1500);
    });

    $('cfgForm')?.addEventListener('submit', (e)=>{
      e.preventDefault();
      cfg.name = $('cfgName').value.trim() || 'Mi servidor';
      cfg.version = $('cfgVersion').value;
      cfg.ram = Math.max(1, parseInt($('cfgRam').value || '2', 10));
      cfg.slots = Math.max(1, parseInt($('cfgSlots').value || '20', 10));
      state.players.max = cfg.slots;
      state.ram.max = cfg.ram;
      save();
      render();
      log('Configuración guardada.');
    });

    $('cmdForm')?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const v = $('cmdInput').value.trim();
      if (!v) return;
      log(`> ${v}`);
      // Respuestas de ejemplo
      if (v.toLowerCase().startsWith('say ')){
        log(`El servidor dice: ${v.slice(4)}`);
      } else if (v.toLowerCase() === 'list'){
        log(`Jugadores conectados: ${state.players.online}`);
      } else {
        log('Comando ejecutado (demo).');
      }
      $('cmdInput').value='';
    });
  }

  function init(){
    load();
    bind();
    render();
    setInterval(randomStep, 1200);
  }

  return { init };
})();
