/**
 * TechQuest 游戏引擎
 * 管理游戏状态、存档、成就和核心逻辑
 */
const GameEngine = (() => {
  const STORAGE_KEY = 'techquest_save';
  const STREAK_KEY = 'techquest_streak';

  // 所有世界数据
  const WORLDS = [SQL_LEVELS, REDIS_LEVELS, KAFKA_LEVELS, ELK_LEVELS];

  // 成就定义
  const ACHIEVEMENTS = [
    { id: 'first-blood', icon: '🎯', name: '初出茅庐', desc: '完成第一个关卡', check: (s) => s.completedLevels.length >= 1 },
    { id: 'sql-master', icon: '🗃️', name: 'SQL 大师', desc: '完成 SQL 世界所有关卡', check: (s) => getWorldProgress('sql', s).completed === SQL_LEVELS.levels.length },
    { id: 'redis-master', icon: '🔴', name: 'Redis 专家', desc: '完成 Redis 世界所有关卡', check: (s) => getWorldProgress('redis', s).completed === REDIS_LEVELS.levels.length },
    { id: 'kafka-master', icon: '📨', name: 'Kafka 架构师', desc: '完成 Kafka 世界所有关卡', check: (s) => getWorldProgress('kafka', s).completed === KAFKA_LEVELS.levels.length },
    { id: 'elk-master', icon: '📊', name: 'ELK 日志专家', desc: '完成 ELK 世界所有关卡', check: (s) => getWorldProgress('elk', s).completed === ELK_LEVELS.levels.length },
    { id: 'world-explorer', icon: '🌍', name: '世界探索者', desc: '在每个世界都至少完成一个关卡', check: (s) => WORLDS.every(w => s.completedLevels.some(l => l.startsWith(w.world))) },
    { id: 'xp-500', icon: '⭐', name: '新星崛起', desc: '累计获得 500 XP', check: (s) => s.totalXp >= 500 },
    { id: 'xp-1000', icon: '🌟', name: '星光闪耀', desc: '累计获得 1000 XP', check: (s) => s.totalXp >= 1000 },
    { id: 'xp-2000', icon: '💫', name: '传奇之路', desc: '累计获得 2000 XP', check: (s) => s.totalXp >= 2000 },
    { id: 'streak-3', icon: '🔥', name: '三日不辍', desc: '连续学习 3 天', check: (s) => s.streak >= 3 },
    { id: 'streak-7', icon: '🔥', name: '一周坚持', desc: '连续学习 7 天', check: (s) => s.streak >= 7 },
    { id: 'half-way', icon: '🏔️', name: '半程英雄', desc: '完成所有关卡的 50%', check: (s) => {
      const total = WORLDS.reduce((sum, w) => sum + w.levels.length, 0);
      return s.completedLevels.length >= total / 2;
    }},
    { id: 'completionist', icon: '👑', name: '全能征服者', desc: '完成所有关卡', check: (s) => {
      const total = WORLDS.reduce((sum, w) => sum + w.levels.length, 0);
      return s.completedLevels.length >= total;
    }}
  ];

  // 等级经验值表
  const XP_TABLE = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, 5000];

  function getDefaultState() {
    return {
      completedLevels: [],
      totalXp: 0,
      streak: 0,
      lastPlayDate: null,
      achievements: [],
      currentLevel: {}
    };
  }

  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const state = JSON.parse(data);
        return { ...getDefaultState(), ...state };
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return getDefaultState();
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }

  function resetState() {
    localStorage.removeItem(STORAGE_KEY);
    return getDefaultState();
  }

  function getLevel(levelId) {
    for (const world of WORLDS) {
      const level = world.levels.find(l => l.id === levelId);
      if (level) return { level, world };
    }
    return null;
  }

  function getWorld(worldId) {
    return WORLDS.find(w => w.world === worldId) || null;
  }

  function getAllWorlds() {
    return WORLDS;
  }

  function getWorldProgress(worldId, state) {
    const world = getWorld(worldId);
    if (!world) return { completed: 0, total: 0, percent: 0 };
    const total = world.levels.length;
    const completed = world.levels.filter(l => state.completedLevels.includes(l.id)).length;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  }

  function isLevelUnlocked(levelId, state) {
    const result = getLevel(levelId);
    if (!result) return false;
    const { level, world } = result;
    const idx = world.levels.findIndex(l => l.id === levelId);
    if (idx === 0) return true;
    return state.completedLevels.includes(world.levels[idx - 1].id);
  }

  function completeLevel(levelId, state) {
    if (state.completedLevels.includes(levelId)) {
      return { alreadyCompleted: true, newXp: 0, newAchievements: [] };
    }

    const result = getLevel(levelId);
    if (!result) return { alreadyCompleted: false, newXp: 0, newAchievements: [] };

    state.completedLevels.push(levelId);
    state.totalXp += result.level.xp;

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    if (state.lastPlayDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (state.lastPlayDate === yesterday) {
        state.streak++;
      } else if (state.lastPlayDate !== today) {
        state.streak = 1;
      }
      state.lastPlayDate = today;
    }

    // Check achievements
    const newAchievements = [];
    for (const ach of ACHIEVEMENTS) {
      if (!state.achievements.includes(ach.id) && ach.check(state)) {
        state.achievements.push(ach.id);
        newAchievements.push(ach);
      }
    }

    saveState(state);
    return { alreadyCompleted: false, newXp: result.level.xp, newAchievements };
  }

  function getPlayerLevel(state) {
    let level = 1;
    for (let i = XP_TABLE.length - 1; i >= 0; i--) {
      if (state.totalXp >= XP_TABLE[i]) {
        level = i + 1;
        break;
      }
    }
    return level;
  }

  function updateStreak(state) {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastPlayDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (state.lastPlayDate !== today && state.lastPlayDate !== yesterday) {
        state.streak = 0;
        saveState(state);
      }
    }
    return state.streak;
  }

  function getAchievements(state) {
    return ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: state.achievements.includes(ach.id)
    }));
  }

  function getStats(state) {
    const totalLevels = WORLDS.reduce((sum, w) => sum + w.levels.length, 0);
    return {
      totalXp: state.totalXp,
      playerLevel: getPlayerLevel(state),
      streak: updateStreak(state),
      completedCount: state.completedLevels.length,
      totalLevels,
      overallPercent: Math.round((state.completedLevels.length / totalLevels) * 100),
      achievementCount: state.achievements.length,
      totalAchievements: ACHIEVEMENTS.length
    };
  }

  function saveCurrentLevelCode(worldId, levelId, code) {
    const state = loadState();
    if (!state.currentLevel) state.currentLevel = {};
    state.currentLevel[levelId] = code;
    saveState(state);
  }

  function getCurrentLevelCode(levelId) {
    const state = loadState();
    return state.currentLevel ? state.currentLevel[levelId] : null;
  }

  return {
    WORLDS,
    ACHIEVEMENTS,
    loadState,
    saveState,
    resetState,
    getLevel,
    getWorld,
    getAllWorlds,
    getWorldProgress,
    isLevelUnlocked,
    completeLevel,
    getPlayerLevel,
    getAchievements,
    getStats,
    saveCurrentLevelCode,
    getCurrentLevelCode,
    updateStreak
  };
})();