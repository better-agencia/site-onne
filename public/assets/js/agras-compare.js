// Comparador interativo da linha DJI Agras.
// Dados técnicos publicados pela DJI nas páginas de especificações de cada modelo.
// Este arquivo só é carregado em /agricultura/ (ver BaseLayout.astro).

(() => {
  const root = document.querySelector('[data-agras-compare]');
  if (!root) return;

  const MODELS = {
    t25p: {
      name: 'DJI Agras T25P',
      short: 'T25P',
      status: 'Novo',
      metrics: { tanque: 20, vazao: 24, faixa: 7, dispTanque: 30, dispVazao: 190, dispFaixa: 8, dispCarga: 25, peso: 33, bateria: 15500 },
      rows: {
        perfil: 'Operação solo, pomares e áreas menores',
        tanque: '20 L',
        vazao: '16 L/min (2 bicos) · 24 L/min (4 bicos)',
        faixa: '4–7 m',
        bicos: '2 padrão · 4 opcionais',
        dispTanque: '30 L',
        dispVazao: '190 kg/min',
        dispFaixa: '3–8 m',
        dispCarga: '25 kg',
        peso: '33 kg (com bateria)',
        mtow: '53 kg pulverização · 60 kg dispersão',
        bateria: 'DB800 · 15.500 mAh',
        controle: 'TKPL 2 · tela 7 pol. · 1.400 nits',
        gerador: 'D6000i · 6 kW',
        seguranca: 'Safety System 3.0 · radar + tri-visão',
        alcance: '60 m · evasão ≤ 10 m/s'
      }
    },
    t55: {
      name: 'DJI Agras T55',
      short: 'T55',
      status: 'Novo',
      metrics: { tanque: 50, vazao: 50, faixa: 11, dispTanque: 80, dispVazao: 400, dispFaixa: 10, dispCarga: 55, peso: 45, bateria: 30000 },
      rows: {
        perfil: 'Operação solo, médias áreas e custo-benefício',
        tanque: '50 L',
        vazao: '40 L/min (2 bicos) · 50 L/min (4 bicos névoa)',
        faixa: '4–11 m',
        bicos: '2 padrão · 4 opcionais',
        dispTanque: '80 L',
        dispVazao: '400 kg/min',
        dispFaixa: '3–10 m',
        dispCarga: '55 kg',
        peso: '45 kg (DB1050) · 48,4 kg (DB1580)',
        mtow: '95–103 kg pulverização · 104–108 kg dispersão',
        bateria: 'DB1050 20.000 mAh ou DB1580 30.000 mAh',
        controle: 'TKPL 2 · tela 7 pol. · 1.400 nits',
        gerador: 'D8000iE · 6.500 W CC',
        seguranca: 'Radar + Tri-Vision',
        alcance: '60 m · evasão ≤ 13,8 m/s'
      }
    },
    t70p: {
      name: 'DJI Agras T70P',
      short: 'T70P',
      status: 'Novo',
      metrics: { tanque: 70, vazao: 40, faixa: 11, dispTanque: 100, dispVazao: 400, dispFaixa: 10, dispCarga: 70, peso: 52, bateria: 41000 },
      rows: {
        perfil: 'Médias e grandes áreas, pulverização e dispersão',
        tanque: '70 L',
        vazao: '30 L/min (2 bicos) · 40 L/min (4 bicos)',
        faixa: '4–11 m',
        bicos: '2 padrão · 4 opcionais',
        dispTanque: '100 L',
        dispVazao: '400 kg/min',
        dispFaixa: '3–10 m',
        dispCarga: '70 kg',
        peso: '52 kg (DB1580) · 56 kg (DB2160)',
        mtow: '102–105 kg pulv. · 126 kg disp. (DB1580) · 126–130 kg (DB2160)',
        bateria: 'DB1580 30.000 mAh ou DB2160 41.000 mAh',
        controle: 'TKPL 2 · tela 7 pol. · 1.400 nits',
        gerador: 'D14000iE · 9.650 W CC',
        seguranca: 'Safety System 3.0 · radar + tri-visão',
        alcance: '60 m · evasão ≤ 13,8 m/s'
      }
    },
    t100: {
      name: 'DJI Agras T100',
      short: 'T100',
      status: 'Novo',
      metrics: { tanque: 100, vazao: 40, faixa: 11, dispTanque: 150, dispVazao: 400, dispFaixa: 10, dispCarga: 100, peso: 75, bateria: 41000 },
      rows: {
        perfil: 'Grande escala, máxima carga e produtividade',
        tanque: '100 L',
        vazao: '30 L/min (2 bicos) · 40 L/min (4 bicos)',
        faixa: '5–11 m',
        bicos: '2 padrão · 4 opcionais',
        dispTanque: '150 L',
        dispVazao: '400 kg/min',
        dispFaixa: '3–10 m',
        dispCarga: '100 kg',
        peso: '75 kg (2 bicos) · 77 kg (4 bicos)',
        mtow: '175 kg (2 bicos) · 177 kg (4 bicos) · 175 kg dispersão',
        bateria: 'DB2160 · 41.000 mAh',
        controle: 'TKPL 2 · tela 7 pol. · 1.400 nits',
        gerador: 'D14000iE · 11.500 W CC',
        seguranca: 'Safety System 3.0 · LiDAR + radar + Penta-Vision',
        alcance: '60 m · evasão ≤ 13,8 m/s'
      }
    },
    t50: {
      name: 'DJI Agras T50 seminovo',
      short: 'T50',
      status: 'Seminovo revisado',
      metrics: { tanque: 40, vazao: 24, faixa: 11, dispTanque: 75, dispFaixa: 8, dispCarga: 50, peso: 52, bateria: 30000 },
      rows: {
        perfil: 'Prestadores de serviço e frotas em expansão',
        tanque: '40 L',
        vazao: '16 L/min (2 bicos) · 24 L/min (4 bicos)',
        faixa: '4–11 m',
        bicos: '2 padrão (LX8060SZ) · 4 opcionais',
        dispTanque: '75 L',
        dispVazao: '—',
        dispFaixa: '8 m',
        dispCarga: '50 kg',
        peso: '52 kg (com bateria)',
        mtow: '92 kg pulverização · 103 kg dispersão',
        bateria: 'DB1560 · 30.000 mAh',
        controle: 'RM700B · tela 7,02 pol. · 1.200 nits',
        gerador: 'D12000i · 9.000 W CC',
        seguranca: 'Radar de matriz faseada + visão binocular',
        alcance: '50 m · evasão ≤ 10 m/s'
      }
    },
    t25: {
      name: 'DJI Agras T25 seminovo',
      short: 'T25',
      status: 'Seminovo revisado',
      metrics: { tanque: 20, vazao: 24, faixa: 7, dispTanque: 35, dispFaixa: 8, dispCarga: 25, peso: 32, bateria: 15000 },
      rows: {
        perfil: 'Entrada no agro com menor investimento',
        tanque: '20 L',
        vazao: '16 L/min (2 bicos) · 24 L/min (4 bicos)',
        faixa: '4–7 m',
        bicos: '2 padrão (LX8060SZ) · 4 opcionais',
        dispTanque: '35 L',
        dispVazao: '—',
        dispFaixa: '5–8 m',
        dispCarga: '25 kg',
        peso: '32 kg (com bateria)',
        mtow: '52 kg pulverização · 58 kg dispersão',
        bateria: 'DB800 · 15.000 mAh',
        controle: 'RM700B · tela 7,02 pol. · 1.200 nits',
        gerador: 'D6000i · 6.000 W',
        seguranca: 'Radar de matriz faseada + visão binocular',
        alcance: '50 m · evasão ≤ 10 m/s'
      }
    },
    t40: {
      name: 'DJI Agras T40 seminovo',
      short: 'T40',
      status: 'Seminovo revisado',
      metrics: { tanque: 40, vazao: 12, faixa: 11, dispTanque: 70, dispFaixa: 7, dispCarga: 50, peso: 50, bateria: 30000 },
      rows: {
        perfil: 'Alta produtividade para prestadores de serviço',
        tanque: '40 L',
        vazao: '12 L/min (2 bombas de 6 L/min)',
        faixa: '11 m',
        bicos: '2 (LX8060SZ)',
        dispTanque: '70 L',
        dispVazao: '—',
        dispFaixa: '7 m',
        dispCarga: '50 kg',
        peso: '50 kg (com bateria)',
        mtow: '90 kg pulverização · 101 kg dispersão',
        bateria: 'BAX601 · 30.000 mAh',
        controle: 'RM700 · tela 7,02 pol. · 1.200 nits',
        gerador: 'D12000iE · 9.000 W CC',
        seguranca: 'Radar omnidirecional + visão binocular',
        alcance: '50 m · evasão ≤ 7 m/s'
      }
    },
    t30: {
      name: 'DJI Agras T30 seminovo',
      short: 'T30',
      status: 'Seminovo revisado',
      // Peso não entra no destaque: a DJI publica 26,4 kg sem bateria, base diferente dos demais.
      metrics: { tanque: 30, vazao: 8, faixa: 9, dispTanque: 40, dispCarga: 35, bateria: 29000 },
      rows: {
        perfil: 'Equilíbrio entre capacidade e transporte',
        tanque: '30 L',
        vazao: '7,2 L/min (16 bicos) · 8 L/min (opcional)',
        faixa: '4–9 m',
        bicos: '16 (SX11001VS)',
        dispTanque: '40 L',
        dispVazao: '—',
        dispFaixa: '—',
        dispCarga: '35 kg',
        peso: '26,4 kg (sem bateria)',
        mtow: '73 kg',
        bateria: 'BAX501 · 29.000 mAh',
        controle: 'RM500-ENT · tela 5,5 pol. · 1.000 nits',
        gerador: 'D9000i · 7.200 W',
        seguranca: 'Radar esférico omnidirecional + radar superior',
        alcance: '30 m · evasão ≤ 7 m/s'
      }
    },
    t20p: {
      name: 'DJI Agras T20P seminovo',
      short: 'T20P',
      status: 'Seminovo revisado',
      metrics: { tanque: 20, vazao: 12, faixa: 7, dispTanque: 35, dispFaixa: 7, dispCarga: 25, peso: 32, bateria: 13000 },
      rows: {
        perfil: 'Entrada no agro com investimento menor',
        tanque: '20 L',
        vazao: '12 L/min (2 bombas de 6 L/min)',
        faixa: '7 m',
        bicos: '2 (LX8060SZ)',
        dispTanque: '35 L',
        dispVazao: '—',
        dispFaixa: '7 m',
        dispCarga: '25 kg',
        peso: '32 kg (com bateria)',
        mtow: '52 kg pulverização · 58 kg dispersão',
        bateria: 'BAX601 · 13.000 mAh',
        controle: 'RM700 · tela 7,02 pol. · 1.200 nits',
        gerador: 'D6000i · 4.200 W CC',
        seguranca: 'Radar omnidirecional + visão binocular',
        alcance: '50 m · evasão ≤ 10 m/s'
      }
    }
  };

  // Critérios numéricos com destaque visual. "higher" = maior valor é melhor;
  // "lower" = menor valor é melhor. Valores ausentes ("—") não entram na disputa.
  const METRICS = {
    tanque: { better: 'higher' },
    vazao: { better: 'higher' },
    faixa: { better: 'higher' },
    dispTanque: { better: 'higher' },
    dispVazao: { better: 'higher' },
    dispFaixa: { better: 'higher' },
    dispCarga: { better: 'higher' },
    peso: { better: 'lower' },
    bateria: { better: 'higher' }
  };

  const ROWS = [
    { group: 'Operação' },
    { key: 'perfil', label: 'Perfil indicado' },
    { group: 'Pulverização' },
    { key: 'tanque', label: 'Tanque de calda' },
    { key: 'vazao', label: 'Vazão máxima' },
    { key: 'faixa', label: 'Faixa efetiva' },
    { key: 'bicos', label: 'Bicos' },
    { group: 'Dispersão de sólidos' },
    { key: 'dispTanque', label: 'Tanque de sólidos' },
    { key: 'dispVazao', label: 'Vazão máxima' },
    { key: 'dispFaixa', label: 'Faixa efetiva' },
    { key: 'dispCarga', label: 'Carga útil' },
    { group: 'Aeronave' },
    { key: 'peso', label: 'Peso da aeronave' },
    { key: 'mtow', label: 'Peso máximo de decolagem' },
    { key: 'bateria', label: 'Bateria de voo' },
    { key: 'controle', label: 'Controle remoto' },
    { group: 'Energia' },
    { key: 'gerador', label: 'Gerador / carregador' },
    { group: 'Segurança' },
    { key: 'seguranca', label: 'Sistema de segurança' },
    { key: 'alcance', label: 'Alcance e evasão' }
  ];

  const MAX = 3;
  let selected = ['t55', 't100'];
  let onlyDiff = false;

  const options = Array.from(root.querySelectorAll('[data-model]'));
  const countEl = root.querySelector('[data-compare-count]');
  const emptyEl = root.querySelector('[data-compare-empty]');
  const emptyTitle = root.querySelector('[data-compare-empty-title]');
  const emptyText = root.querySelector('[data-compare-empty-text]');
  const resultEl = root.querySelector('[data-compare-result]');
  const headEl = root.querySelector('[data-compare-head]');
  const bodyEl = root.querySelector('[data-compare-body]');
  const titleEl = root.querySelector('[data-compare-title]');
  const diffEl = root.querySelector('[data-compare-diff]');

  function updateEmptyState() {
    if (selected.length === 0) {
      emptyTitle.textContent = 'Selecione pelo menos 2 modelos.';
      emptyText.textContent = 'Escolha até 3 drones acima para ver a comparação lado a lado.';
    } else {
      emptyTitle.textContent = 'Selecione mais 1 modelo.';
      emptyText.textContent = 'A comparação aparece quando você escolhe 2 ou 3 drones.';
    }
  }

  function updateGroups() {
    const rows = Array.from(bodyEl.querySelectorAll('tr'));
    rows.forEach((row, index) => {
      if (!row.hasAttribute('data-group')) return;
      let next = index + 1;
      let visible = false;
      while (next < rows.length && !rows[next].hasAttribute('data-group')) {
        if (!rows[next].hidden) visible = true;
        next += 1;
      }
      row.hidden = onlyDiff && !visible;
    });
  }

  function compareRow(rowKey) {
    const metric = METRICS[rowKey];
    if (!metric) return { best: [], worse: [] };

    const entries = selected
      .map((id, index) => ({ index, value: MODELS[id].metrics?.[rowKey] }))
      .filter((entry) => Number.isFinite(entry.value));

    // Sem pelo menos dois valores publicados não há comparação possível.
    if (entries.length < 2) return { best: [], worse: [] };

    const values = entries.map((entry) => entry.value);
    const best = metric.better === 'lower' ? Math.min(...values) : Math.max(...values);

    // Se todos os modelos selecionados têm o mesmo valor, ninguém se destaca.
    if (values.every((value) => value === best)) return { best: [], worse: [] };

    return {
      best: entries.filter((entry) => entry.value === best).map((entry) => entry.index),
      worse: entries.filter((entry) => entry.value !== best).map((entry) => entry.index)
    };
  }

  function winsLabel(count) {
    return count === 1 ? '1 destaque' : `${count} destaques`;
  }

  function render() {
    options.forEach((button) => {
      const active = selected.includes(button.dataset.model);
      button.setAttribute('aria-pressed', String(active));
      button.disabled = !active && selected.length >= MAX;
    });

    countEl.textContent = `${selected.length} de ${MAX} selecionados`;
    updateEmptyState();

    const enough = selected.length >= 2;
    emptyEl.hidden = enough;
    resultEl.hidden = !enough;
    if (!enough) return;

    titleEl.textContent = selected.map((id) => MODELS[id].short).join(' × ');

    const wins = Object.fromEntries(selected.map((id) => [id, 0]));
    const rowData = ROWS.map((row) => {
      if (row.group) return row;

      const values = selected.map((id) => MODELS[id].rows[row.key] || '—');
      const same = values.every((value) => value === values[0]);
      const { best, worse } = compareRow(row.key);
      best.forEach((index) => {
        wins[selected[index]] += 1;
      });

      return { ...row, values, same, best, worse };
    });

    headEl.innerHTML = `<tr><th scope="col" class="compare-table__feature">Característica</th>${selected
      .map((id) => {
        const model = MODELS[id];
        const count = wins[id];
        return `<th scope="col" class="compare-table__model" title="${model.name}"><span class="compare-table__name">${model.short}</span><span class="compare-table__status">${model.status}</span><span class="compare-table__wins${count ? '' : ' is-zero'}">${winsLabel(count)}</span></th>`;
      })
      .join('')}</tr>`;

    const html = [];
    rowData.forEach((row) => {
      if (row.group) {
        html.push(
          `<tr class="compare-table__group" data-group><th scope="colgroup" colspan="${selected.length + 1}">${row.group}</th></tr>`
        );
        return;
      }

      const hidden = onlyDiff && row.same ? ' hidden' : '';
      const cells = row.values
        .map((value, index) => {
          if (row.best.includes(index)) {
            const metric = METRICS[row.key];
            const arrow = metric.better === 'lower' ? '↓' : '↑';
            return `<td class="compare-cell--best" title="Melhor valor neste critério"><span class="compare-best-mark" aria-hidden="true">${arrow}</span><span class="sr-only">Melhor valor: </span>${value}</td>`;
          }
          if (row.worse.includes(index)) {
            return `<td class="compare-cell--worse"><span class="sr-only">Abaixo do melhor valor: </span>${value}</td>`;
          }
          return `<td>${value}</td>`;
        })
        .join('');

      html.push(
        `<tr data-row data-same="${row.same}"${hidden}><th scope="row">${row.label}</th>${cells}</tr>`
      );
    });

    bodyEl.innerHTML = html.join('');
    updateGroups();
  }

  function toggleModel(id) {
    if (selected.includes(id)) {
      selected = selected.filter((modelId) => modelId !== id);
    } else {
      if (selected.length >= MAX) return;
      selected = [...selected, id];
    }
    render();
  }

  options.forEach((button) => {
    button.addEventListener('click', () => toggleModel(button.dataset.model));
  });

  root.querySelector('[data-compare-clear]').addEventListener('click', () => {
    selected = [];
    render();
  });

  diffEl.addEventListener('change', () => {
    onlyDiff = diffEl.checked;
    bodyEl.querySelectorAll('[data-row]').forEach((row) => {
      row.hidden = onlyDiff && row.dataset.same === 'true';
    });
    updateGroups();
  });

  render();
})();
