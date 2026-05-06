/**
 * TechQuest 主应用
 * 管理 UI 渲染、用户交互和页面导航
 */
const app = (() => {
  let state;
  let currentWorldId = null;
  let currentLevelId = null;

  // ============ 初始化 ============
  function init() {
    state = GameEngine.loadState();
    createParticles();
    bindEvents();
  }

  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['#6c63ff', '#b388ff', '#4fc3f7', '#ff80ab', '#69f0ae'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (3 + Math.random() * 7) + 's';
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      container.appendChild(p);
    }
  }

  function bindEvents() {
    document.getElementById('btn-start').addEventListener('click', () => {
      document.getElementById('splash-screen').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      renderHome();
    });

    document.getElementById('code-input').addEventListener('input', () => {
      updateLineNumbers();
      if (currentLevelId) {
        GameEngine.saveCurrentLevelCode(currentWorldId, currentLevelId, getCode());
      }
    });

    document.getElementById('code-input').addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const ta = e.target;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
        updateLineNumbers();
      }
    });

    document.getElementById('btn-back-world').addEventListener('click', () => {
      showWorld(currentWorldId);
    });
  }

  // ============ 导航 ============
  function switchView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const view = document.getElementById(viewId);
    if (view) view.classList.add('active');
  }

  function showHome() {
    switchView('view-home');
    renderHome();
  }

  function showWorld(worldId) {
    currentWorldId = worldId;
    switchView('view-world');
    renderWorld(worldId);
  }

  function showLevel(levelId) {
    currentLevelId = levelId;
    switchView('view-level');
    renderLevel(levelId);
  }

  function showAchievements() {
    switchView('view-achievements');
    renderAchievements();
  }

  function showProgress() {
    switchView('view-progress');
    renderProgress();
  }

  // ============ 渲染 ============
  function renderHome() {
    state = GameEngine.loadState();
    updateNavStats();

    const grid = document.getElementById('worlds-grid');
    grid.innerHTML = '';

    GameEngine.getAllWorlds().forEach(world => {
      const prog = GameEngine.getWorldProgress(world.world, state);
      const card = document.createElement('div');
      card.className = 'world-card';
      card.dataset.world = world.world;
      card.onclick = () => showWorld(world.world);
      card.innerHTML = `
        <span class="world-icon">${world.icon}</span>
        <div class="world-name">${world.name}</div>
        <div class="world-brief">${world.description}</div>
        <div class="world-card-footer">
          <span class="world-level-count">${world.levels.length} 个关卡</span>
          <div class="world-card-progress">
            <div class="mini-progress-bar">
              <div class="mini-progress-fill" style="width:${prog.percent}%"></div>
            </div>
            <span class="mini-progress-text">${prog.percent}%</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderWorld(worldId) {
    state = GameEngine.loadState();
    const world = GameEngine.getWorld(worldId);
    if (!world) return;

    document.getElementById('world-title').textContent = world.icon + ' ' + world.name;
    document.getElementById('world-desc').textContent = world.description;

    const prog = GameEngine.getWorldProgress(worldId, state);
    document.getElementById('world-progress-fill').style.width = prog.percent + '%';
    document.getElementById('world-progress-text').textContent = prog.completed + '/' + prog.total;

    const container = document.getElementById('levels-container');
    container.innerHTML = '';

    world.levels.forEach((level, idx) => {
      const isCompleted = state.completedLevels.includes(level.id);
      const isUnlocked = GameEngine.isLevelUnlocked(level.id, state);

      const card = document.createElement('div');
      card.className = 'level-card' + (isCompleted ? ' completed' : '') + (!isUnlocked ? ' locked' : '');
      card.innerHTML = `
        <div class="level-number">关卡 ${idx + 1}</div>
        <div class="level-card-title">${level.title}</div>
        <div class="level-card-desc">${getDifficultyLabel(level.difficulty)} · ${level.xp} XP</div>
        <div class="level-card-footer">
          <span class="difficulty ${level.difficulty}">${getDifficultyCN(level.difficulty)}</span>
          <span class="xp-badge">⭐ ${level.xp} XP</span>
        </div>
      `;

      if (isUnlocked) {
        card.onclick = () => showLevel(level.id);
      } else {
        card.title = '请先完成前一关卡';
      }

      container.appendChild(card);
    });
  }

  function renderLevel(levelId) {
    state = GameEngine.loadState();
    const result = GameEngine.getLevel(levelId);
    if (!result) return;
    const { level } = result;

    currentWorldId = result.world.world;

    document.getElementById('level-title').textContent = level.title;
    document.getElementById('level-difficulty').textContent = getDifficultyCN(level.difficulty);
    document.getElementById('level-difficulty').className = 'difficulty-badge ' + level.difficulty;
    document.getElementById('level-xp').textContent = '⭐ ' + level.xp + ' XP';

    document.getElementById('level-instruction').innerHTML = level.instruction;
    document.getElementById('level-hint').innerHTML = level.hint;
    document.getElementById('level-hint').classList.add('hidden');
    document.getElementById('btn-hint').textContent = '显示提示';
    document.getElementById('level-theory').innerHTML = level.theory;

    // Load saved code or initial code
    const savedCode = GameEngine.getCurrentLevelCode(levelId);
    document.getElementById('code-input').value = savedCode || level.initialCode || '';
    updateLineNumbers();

    // Clear output
    document.getElementById('output-area').innerHTML = '<div class="output-placeholder">运行代码后，结果将显示在这里...</div>';
  }

  function updateNavStats() {
    const stats = GameEngine.getStats(state);
    document.getElementById('total-xp').textContent = stats.totalXp;
    document.getElementById('player-level').textContent = stats.playerLevel;
    document.getElementById('streak-days').textContent = stats.streak;
  }

  function updateLineNumbers() {
    const textarea = document.getElementById('code-input');
    const lineNums = document.getElementById('line-numbers');
    const lines = textarea.value.split('\n');
    lineNums.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
  }

  // ============ 代码执行 ============
  function getCode() {
    return document.getElementById('code-input').value;
  }

  function runCode() {
    const code = getCode();
    const outputArea = document.getElementById('output-area');
    const result = GameEngine.getLevel(currentLevelId);
    if (!result) return;

    const { level } = result;
    outputArea.innerHTML = '';

    // Simulate running the code
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('--') && !l.trim().startsWith('#') && !l.trim().startsWith('//'));

    if (lines.length === 0) {
      addOutput('请先输入代码再运行。', 'warn');
      return;
    }

    addOutput('▶ 正在执行...', 'info');
    addOutput('', 'separator');

    // Simulate output based on the sample data
    setTimeout(() => {
      if (Array.isArray(level.sampleData)) {
        level.sampleData.forEach(item => {
          if (Array.isArray(item)) {
            item.forEach(row => addOutput(row, 'info'));
          } else {
            addOutput(item, 'info');
          }
        });
      }
      addOutput('', 'separator');
      addOutput('✓ 执行完成', 'success');
    }, 300);
  }

  function addOutput(text, type = '') {
    const outputArea = document.getElementById('output-area');
    // Remove placeholder
    const placeholder = outputArea.querySelector('.output-placeholder');
    if (placeholder) placeholder.remove();

    const div = document.createElement('div');
    div.className = 'output-line' + (type ? ' ' + type : '');
    div.textContent = text;
    outputArea.appendChild(div);
    outputArea.scrollTop = outputArea.scrollHeight;
  }

  function resetCode() {
    const result = GameEngine.getLevel(currentLevelId);
    if (!result) return;
    document.getElementById('code-input').value = result.level.initialCode || '';
    updateLineNumbers();
    document.getElementById('output-area').innerHTML = '<div class="output-placeholder">运行代码后，结果将显示在这里...</div>';
  }

  // ============ 答案验证 ============
  function checkAnswer() {
    const code = getCode();
    const result = GameEngine.getLevel(currentLevelId);
    if (!result) return;

    const { level } = result;

    if (!code.trim()) {
      showError('请先输入代码！');
      return;
    }

    try {
      const passed = level.validator(code);
      if (passed) {
        const completion = GameEngine.completeLevel(currentLevelId, state);
        if (completion.alreadyCompleted) {
          showSuccess(level.xp, '你已经完成过这个关卡了。', level.id);
        } else {
          let msg = level.successMsg || '做得好！';
          if (completion.newAchievements.length > 0) {
            msg += '\n\n🏆 新成就解锁：' + completion.newAchievements.map(a => a.icon + ' ' + a.name).join('、');
          }
          showSuccess(completion.newXp, msg, level.id);
        }
      } else {
        showError('答案不正确，请检查你的代码。可以点击"显示提示"获取帮助。');
      }
    } catch (e) {
      showError('验证出错: ' + e.message);
    }
  }

  // ============ UI 辅助 ============
  function showSuccess(xp, message, currentLevelId) {
    document.getElementById('success-xp').textContent = '+' + xp + ' XP';
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.remove('hidden');

    updateNavStats();

    // Next level button
    const nextBtn = document.getElementById('btn-next-level');
    const result = GameEngine.getLevel(currentLevelId);
    if (result) {
      const world = result.world;
      const idx = world.levels.findIndex(l => l.id === currentLevelId);
      if (idx < world.levels.length - 1) {
        nextBtn.style.display = '';
        nextBtn.onclick = () => {
          closeModal('success-modal');
          showLevel(world.levels[idx + 1].id);
        };
      } else {
        nextBtn.style.display = '';
        nextBtn.textContent = '🏠 返回世界';
        nextBtn.onclick = () => {
          closeModal('success-modal');
          showWorld(world.world);
        };
      }
    }
  }

  function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').classList.remove('hidden');
  }

  function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
  }

  function toggleHint() {
    const hintBody = document.getElementById('level-hint');
    const btn = document.getElementById('btn-hint');
    if (hintBody.classList.contains('hidden')) {
      hintBody.classList.remove('hidden');
      btn.textContent = '隐藏提示';
    } else {
      hintBody.classList.add('hidden');
      btn.textContent = '显示提示';
    }
  }

  function resetProgress() {
    if (confirm('确定要重置所有进度吗？此操作不可撤销。')) {
      state = GameEngine.resetState();
      renderHome();
      updateNavStats();
    }
  }

  function renderAchievements() {
    state = GameEngine.loadState();
    const grid = document.getElementById('achievements-grid');
    const achievements = GameEngine.getAchievements(state);
    grid.innerHTML = '';

    achievements.forEach(ach => {
      const card = document.createElement('div');
      card.className = 'achievement-card ' + (ach.unlocked ? 'unlocked' : 'locked');
      card.innerHTML = `
        <span class="achievement-icon">${ach.icon}</span>
        <div class="achievement-name">${ach.name}</div>
        <div class="achievement-desc">${ach.desc}</div>
        ${ach.unlocked ? '<div class="achievement-date">✅ 已解锁</div>' : '<div class="achievement-date">🔒 未解锁</div>'}
      `;
      grid.appendChild(card);
    });
  }

  function renderProgress() {
    state = GameEngine.loadState();
    const container = document.getElementById('progress-content');
    container.innerHTML = '';

    GameEngine.getAllWorlds().forEach(world => {
      const prog = GameEngine.getWorldProgress(world.world, state);
      const xp = world.levels
        .filter(l => state.completedLevels.includes(l.id))
        .reduce((sum, l) => sum + l.xp, 0);

      const card = document.createElement('div');
      card.className = 'progress-world-card';
      card.innerHTML = `
        <div class="progress-world-header">
          <span class="progress-world-icon">${world.icon}</span>
          <span class="progress-world-title">${world.name}</span>
        </div>
        <div class="progress-stats">
          <div class="progress-stat">
            <div class="progress-stat-value">${prog.completed}/${prog.total}</div>
            <div class="progress-stat-label">已完成</div>
          </div>
          <div class="progress-stat">
            <div class="progress-stat-value">${prog.percent}%</div>
            <div class="progress-stat-label">完成率</div>
          </div>
          <div class="progress-stat">
            <div class="progress-stat-value">${xp}</div>
            <div class="progress-stat-label">获得 XP</div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Overall stats
    const stats = GameEngine.getStats(state);
    const overallCard = document.createElement('div');
    overallCard.className = 'progress-world-card';
    overallCard.innerHTML = `
      <div class="progress-world-header">
        <span class="progress-world-icon">📊</span>
        <span class="progress-world-title">总览</span>
      </div>
      <div class="progress-stats">
        <div class="progress-stat">
          <div class="progress-stat-value">${stats.completedCount}/${stats.totalLevels}</div>
          <div class="progress-stat-label">总完成</div>
        </div>
        <div class="progress-stat">
          <div class="progress-stat-value">${stats.totalXp}</div>
          <div class="progress-stat-label">总 XP</div>
        </div>
        <div class="progress-stat">
          <div class="progress-stat-value">Lv.${stats.playerLevel}</div>
          <div class="progress-stat-label">当前等级</div>
        </div>
        <div class="progress-stat">
          <div class="progress-stat-value">${stats.achievementCount}/${stats.totalAchievements}</div>
          <div class="progress-stat-label">成就</div>
        </div>
        <div class="progress-stat">
          <div class="progress-stat-value">${stats.streak}</div>
          <div class="progress-stat-label">连续天数</div>
        </div>
      </div>
    `;
    container.appendChild(overallCard);
  }

  // ============ 辅助函数 ============
  function getDifficultyCN(diff) {
    const map = { easy: '初级', medium: '中级', hard: '高级', expert: '专家' };
    return map[diff] || diff;
  }

  function getDifficultyLabel(diff) {
    const map = { easy: '⭐ 初级', medium: '⭐⭐ 中级', hard: '⭐⭐⭐ 高级', expert: '⭐⭐⭐⭐ 专家' };
    return map[diff] || diff;
  }

  // ============ 初始化 ============
  document.addEventListener('DOMContentLoaded', init);

  return {
    showHome,
    showWorld,
    showLevel,
    showAchievements,
    showProgress,
    runCode,
    resetCode,
    checkAnswer,
    toggleHint,
    closeModal,
    resetProgress
  };
})();