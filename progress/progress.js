async function loadProgress() {
  const response = await fetch('./updates.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Could not load updates.json');
  return response.json();
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function list(items = []) {
  const ul = document.createElement('ul');
  items.forEach((item) => ul.appendChild(el('li', '', item)));
  return ul;
}

function renderStages(stages = []) {
  const container = document.getElementById('stageList');
  container.replaceChildren();

  stages.forEach((stage) => {
    const card = el('article', 'stageCard');
    const meta = el('div', 'stageMeta');
    meta.append(el('span', 'stageName', stage.name));
    meta.append(el('span', 'stageStatus', stage.status));

    const body = el('div', 'stageBody');
    body.append(el('h3', '', stage.label));
    body.append(el('p', '', stage.summary));

    const columns = el('div', 'stageColumns');
    const complete = el('div');
    complete.append(el('h4', '', 'Built / captured'));
    complete.append(list(stage.complete));

    const next = el('div');
    next.append(el('h4', '', 'Next'));
    next.append(list(stage.next));

    columns.append(complete, next);
    body.append(columns);
    card.append(meta, body);
    container.append(card);
  });
}

function renderUpdates(updates = []) {
  const container = document.getElementById('updatesList');
  container.replaceChildren();

  updates.forEach((update) => {
    const item = el('article', 'updateItem');
    item.append(el('time', '', update.date));
    const body = el('div');
    body.append(el('h3', '', update.title));
    body.append(el('p', '', update.body));
    item.append(body);
    container.append(item);
  });
}

function renderBuildLog(items = []) {
  document.getElementById('buildLog').replaceChildren(...list(items).children);
}

loadProgress()
  .then((progress) => {
    document.getElementById('statusText').textContent = progress.status;
    document.getElementById('currentFocus').textContent = progress.currentFocus;
    document.getElementById('lastUpdated').textContent = `Last updated ${progress.lastUpdated}`;
    document.getElementById('progressFill').style.width = `${progress.progressPercent || 0}%`;
    renderStages(progress.stages);
    renderUpdates(progress.recentUpdates);
    renderBuildLog(progress.buildLog);
  })
  .catch(() => {
    document.getElementById('statusText').textContent = 'Progress updates unavailable';
    document.getElementById('currentFocus').textContent = 'The static page loaded, but the progress data file could not be read.';
  });
