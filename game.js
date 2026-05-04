const GAME_DATA = window.GAME_DATA;

const PHASE = {
  START: "start",
  CHOOSE: "choose",
  BATTLE: "battle",
  RESULT: "result"
};

const MODE = {
  PVP: "pvp",
  PVE: "pve"
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ui = {
  startHint: document.getElementById("startHint"),
  startMenuButton: document.getElementById("startMenuButton"),
  startMenuPanel: document.getElementById("startMenuPanel"),
  showBagButton: document.getElementById("showBagButton"),
  showConstellationButton: document.getElementById("showConstellationButton"),
  showGachaButton: document.getElementById("showGachaButton"),
  showShopButton: document.getElementById("showShopButton"),
  showAuthorsButton: document.getElementById("showAuthorsButton"),
  showDonateButton: document.getElementById("showDonateButton"),
  authOverlay: document.getElementById("authOverlay"),
  authTitle: document.getElementById("authTitle"),
  authSubtitle: document.getElementById("authSubtitle"),
  authLoginTab: document.getElementById("authLoginTab"),
  authRegisterTab: document.getElementById("authRegisterTab"),
  authUsername: document.getElementById("authUsername"),
  authPassword: document.getElementById("authPassword"),
  authConfirmRow: document.getElementById("authConfirmRow"),
  authConfirmPassword: document.getElementById("authConfirmPassword"),
  authMessage: document.getElementById("authMessage"),
  authSubmit: document.getElementById("authSubmit"),
  startOverlay: document.getElementById("startOverlay"),
  startOverlayTitle: document.getElementById("startOverlayTitle"),
  startOverlayText: document.getElementById("startOverlayText"),
  startOverlayImage: document.getElementById("startOverlayImage"),
  startOverlayContent: document.getElementById("startOverlayContent"),
  startOverlayClose: document.getElementById("startOverlayClose"),
  phaseBanner: document.getElementById("phaseBanner"),
  hud: document.getElementById("hud"),
  p1HealthFill: document.getElementById("p1HealthFill"),
  p2HealthFill: document.getElementById("p2HealthFill"),
  p1HealthText: document.getElementById("p1HealthText"),
  p2HealthText: document.getElementById("p2HealthText"),
  p1WeaponCdFill: document.getElementById("p1WeaponCdFill"),
  p2WeaponCdFill: document.getElementById("p2WeaponCdFill"),
  p1CharacterCdFill: document.getElementById("p1CharacterCdFill"),
  p2CharacterCdFill: document.getElementById("p2CharacterCdFill"),
  p1DashFill: document.getElementById("p1DashFill"),
  p2DashFill: document.getElementById("p2DashFill"),
  p1WeaponCdText: document.getElementById("p1WeaponCdText"),
  p2WeaponCdText: document.getElementById("p2WeaponCdText"),
  p1CharacterCdText: document.getElementById("p1CharacterCdText"),
  p2CharacterCdText: document.getElementById("p2CharacterCdText"),
  p1DashText: document.getElementById("p1DashText"),
  p2DashText: document.getElementById("p2DashText"),
  p1StatusRow: document.getElementById("p1StatusRow"),
  p2StatusRow: document.getElementById("p2StatusRow"),
  battleTip: document.getElementById("battleTip"),
  battleInfoPanel: document.getElementById("battleInfoPanel"),
  battleInfoTitle: document.getElementById("battleInfoTitle"),
  battleInfoHint: document.getElementById("battleInfoHint"),
  battleInfoP1Character: document.getElementById("battleInfoP1Character"),
  battleInfoP1Weapon: document.getElementById("battleInfoP1Weapon"),
  battleInfoP2Character: document.getElementById("battleInfoP2Character"),
  battleInfoP2Weapon: document.getElementById("battleInfoP2Weapon"),
  battleInfoBoss: document.getElementById("battleInfoBoss"),
  bossHud: document.getElementById("bossHud"),
  bossName: document.getElementById("bossName"),
  bossHealthFill: document.getElementById("bossHealthFill"),
  bossHealthText: document.getElementById("bossHealthText"),
  selectionPanel: document.getElementById("selectionPanel"),
  selectionTitle: document.getElementById("selectionTitle"),
  selectionSubtitle: document.getElementById("selectionSubtitle"),
  selectionWheel: document.getElementById("selectionWheel"),
  selectionList: document.getElementById("selectionList"),
  detailName: document.getElementById("detailName"),
  detailDescription: document.getElementById("detailDescription"),
  detailStats: document.getElementById("detailStats"),
  selectionPath: document.getElementById("selectionPath"),
  confirmButton: document.getElementById("confirmButton"),
  resultPanel: document.getElementById("resultPanel"),
  resultTitle: document.getElementById("resultTitle"),
  resultDescription: document.getElementById("resultDescription"),
  restartButton: document.getElementById("restartButton")
};

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const keysDown = new Set();
const justPressed = new Set();
const imageBank = new Map();

const game = {
  phase: PHASE.START,
  mode: null,
  now: 0,
  isPaused: false,
  pauseReason: "",
  battleInfoTimer: null,
  showHitboxes: false,
  backgroundIndex: 0,
  backgroundTimer: 0,
  lockedBackgroundIndex: 0,
  tip: "",
  tipUntil: 0,
  portals: createPortals(),
  players: [],
  projectiles: [],
  webZones: [],
  sandstorms: [],
  fireCurtains: [],
  flamebornBlades: [],
  healingTotems: [],
  boss: null,
  selection: {
    flow: [],
    stepIndex: 0,
    currentIndex: 0,
    choices: {}
  },
  result: {
    title: "",
    description: ""
  },
  account: {
    db: null,
    username: "",
    profile: null,
    authMode: "login",
    overlayTab: "bag",
    overlayMessage: "",
    currentBannerKey: "",
    lastDateKey: ""
  }
};

const RANDOM_CHARACTER_OPTION = {
  id: "random-character",
  name: "随机角色",
  description: "确认后会在战斗开始时随机分配一个角色。",
  stats: {
    说明: "仅随机该玩家角色"
  },
  randomPool: "characters"
};

const RANDOM_WEAPON_OPTION = {
  id: "random-weapon",
  name: "随机武器",
  description: "确认后会在战斗开始时随机分配一把武器。",
  stats: {
    说明: "仅随机该玩家武器"
  },
  randomPool: "weapons" 
};

const AUTHOR_NAMES = ["Zhoumoubo", "仙蕊缀锦", "ChatGPT", "Mario"];
const DONATE_IMAGE_PATH = "Images/Money/WeChat.jpg";
const NEGATIVE_LAYER_CAP = 5;
const STORAGE_KEY = "tradition-flower-save-v2";
const STORAGE_USER_KEY = "tradition-flower-current-user";
const TOPUP_TEST_PASSWORD = "abcdefghijklmnopqrstuvwxyz1234567890";
const GACHA_CHARACTER_RATE = 0.006;
const GACHA_80TH_RATE = 0.03;
const GACHA_PITY_MAX = 120;
const VULNERABLE_DURATION = 5;
const HEALING_TOTEM_RADIUS = 122;
const HEALING_TOTEM_DURATION = 5;
const HEALING_TOTEM_TICK = 1;
const RECHARGE_OPTIONS = [
  { amountCny: 6, prototypes: 60 },
  { amountCny: 30, prototypes: 300 },
  { amountCny: 98, prototypes: 980 },
  { amountCny: 198, prototypes: 1980 },
  { amountCny: 328, prototypes: 3280 },
  { amountCny: 648, prototypes: 6480 }
];
const CONSTELLATION_DATA = {
  "qing-lan": [
    "技能冷却 -1s",
    "移速 +2%",
    "放下风印后可立即再次使用技能进行传送",
    "风印传送伤害提升至 5",
    "风印传送命中时附加 1s 眩晕与易伤",
    "风印传送后刷新技能冷却，每 15s 最多触发 1 次"
  ],
  "shadow-ninja": [
    "隐身时间 +1s",
    "隐身期间移速 +5%",
    "血量上限提升至 100",
    "冲刺伤害提升至 6",
    "进入隐身时回复 3 点闪能",
    "满足条件时触发完美隐身：眩晕敌人并解锁强化突进"
  ],
  "chi-yan": [
    "移速 +2%",
    "蓄力时间 -1s",
    "火幕命中敌人时立刻刷新技能冷却",
    "蓄力时间 +2s，伤害 +5，蓄力受伤时每 2s 随机回复 0~5 点生命",
    "蓄力期间可移动",
    "蓄力不再因击退累计而中断"
  ],
  "ling-mu": [
    "移速 +2%",
    "每 10s 触发一次：造成伤害时随机回复 0~10 点生命",
    "血量上限 +5",
    "移速再 +1%，受伤后每 15s 随机回复 0~5 点生命",
    "移速 -4%",
    "复活次数 +1，触发复活后留下治疗图腾"
  ],
  "burning-blade": [
    "血量上限 +20%",
    "冲撞伤害 +2，获得特殊皮肤“泣血之刃”",
    "释放技能时眩晕敌方 3s",
    "血量上限再 +10%",
    "血量高于 50% 时承伤提升至 3 倍",
    "若技能消耗或回复超过 30% 血量，5s 内武器命中附加上限 2% 伤害并回复上限 1% 生命"
  ]
};
const CHARACTER_NAME_BY_ID = Object.fromEntries(GAME_DATA.characters.map((character) => [character.id, character.name]));

function createPortals() {
  const y = HEIGHT * 0.54;
  const radius = GAME_DATA.tuning.portalRadius;
  return {
    pvp: {
      id: "pvp",
      label: "PvP",
      x: WIDTH * 0.14,
      y,
      radius,
      spin: 0,
      hold: 0,
      image: GAME_DATA.portals.pvp
    },
    pve: {
      id: "pve",
      label: "PvE",
      x: WIDTH * 0.86,
      y,
      radius,
      spin: 0,
      hold: 0,
      image: GAME_DATA.portals.pve
    }
  };
}

function createPlayer(side, x) {
  const tuning = GAME_DATA.tuning;
  const isP1 = side === "p1";
  return {
    id: isP1 ? "P1" : "P2",
    side,
    x,
    y: getGroundY() - 108,
    w: 72,
    h: 108,
    hitScale: 0.46,
    vx: 0,
    vy: 0,
    onGround: true,
    facing: isP1 ? 1 : -1,
    hp: tuning.maxHp,
    maxHp: tuning.maxHp,
    baseMoveSpeedMultiplier: 1,
    staticMoveMultiplier: 1,
    speedBuffUntil: 0,
    speedDebuffUntil: 0,
    bindUntil: 0,
    bindStacks: [],
    permanentSlowPct: 0,
    poisonStacks: [],
    poisonTickAt: 0,
    webZoneIds: new Set(),
    webSlowMultiplier: 1,
    jumpLocked: false,
    maxJumps: 1,
    jumpCount: 0,
    incomingDamageMultiplier: 1,
    dashDamageMultiplier: 1,
    dashKnockbackMultiplier: 1,
    dashDamageOverride: null,
    dashCharges: GAME_DATA.tuning.dashChargeMax ?? 3,
    dashChargeMax: GAME_DATA.tuning.dashChargeMax ?? 3,
    dashChargeNextAt: 0,
    stunnedUntil: 0,
    weaponSkillReadyAt: 0,
    weaponPassiveReadyAt: 0,
    characterSkillReadyAt: 0,
    dashUntil: 0,
    dashRecoverAt: 0,
    dashCooldownUntil: 0,
    dashRecoveryPending: false,
    dashHitMarks: new Set(),
    kunpengDusts: [],
    nextKunpengDustAt: 0,
    windMark: null,
    chiyanCharge: {
      active: false,
      startedAt: 0,
      breakAccum: 0
    },
    flamebornLeapActive: false,
    burningBladeWeaponBuffUntil: 0,
    lingmuReviveUsed: false,
    lingmuRevivesRemaining: 1,
    lingmuLifeBurstReadyAt: 0,
    lingmuDamageHealReadyAt: 0,
    invisibleUntil: 0,
    shadowPerfectStrikeReady: false,
    shadowPerfectStrikeTrail: null,
    chiyanChargeHealReadyAt: 0,
    qinglanCooldownResetReadyAt: 0,
    characterConstellationLevel: 0,
    vulnerableUntil: 0,
    vulnerableBonus: 0,
    runtimeCharacterSkill: null,
    portalTouch: null,
    portalPhase: Math.random() * Math.PI * 2,
    character: GAME_DATA.characters[0],
    weapon: GAME_DATA.weapons[0],
    controls: isP1
      ? {
        left: "KeyA",
        right: "KeyD",
        jump: "KeyW",
        down: "KeyS",
        characterSkill: "KeyS",
        weaponSkill: "KeyK",
        dash: "KeyJ",
        surrender: "KeyY"
      }
      : {
        left: "ArrowLeft",
        right: "ArrowRight",
        jump: "ArrowUp",
        down: "ArrowDown",
        characterSkill: "ArrowDown",
        weaponSkill: "Numpad2",
        weaponSkillAlt: "Digit2",
        dash: "Numpad1",
        dashAlt: "Digit1",
        surrender: "KeyP"
      }
  };
}

function getGroundY() {
  return HEIGHT * GAME_DATA.tuning.groundHeightRatio;
}

function getJumpVelocityForHeight(height) {
  const gravity = GAME_DATA.tuning.gravity;
  return Math.sqrt(2 * gravity * Math.max(0, height));
}

function getJumpVelocity() {
  const jumpHeight = HEIGHT * GAME_DATA.tuning.jumpHeightRatio;
  return getJumpVelocityForHeight(jumpHeight);
}

function getPlayerSpritePath(player) {
  if (!player?.character) {
    return "";
  }
  if (player.character.id === "burning-blade" && (player.characterConstellationLevel ?? 0) >= 2 && player.character.sprite?.c2) {
    return player.character.sprite.c2;
  }
  return player.side === "p1" ? player.character.sprite.p1 : player.character.sprite.p2;
}

function preloadAssets() {
  const allSources = new Set([
    ...GAME_DATA.backgrounds,
    GAME_DATA.portals.pvp,
    GAME_DATA.portals.pve,
    DONATE_IMAGE_PATH
  ]);

  for (const character of GAME_DATA.characters) {
    for (const src of Object.values(character.sprite ?? {})) {
      if (typeof src === "string" && src.length > 0) {
        allSources.add(src);
      }
    }
  }

  for (const weapon of GAME_DATA.weapons) {
    allSources.add(weapon.icon);
  }

  for (const boss of GAME_DATA.bosses) {
    allSources.add(boss.sprite);
  }

  const tasks = [...allSources].map((src) => loadImage(src));
  return Promise.all(tasks);
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageBank.set(src, img);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

function getImage(src) {
  return imageBank.get(src) ?? null;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getBannerIndexForKey(dateKey) {
  const [year, month, day] = String(dateKey || getLocalDateKey())
    .split("-")
    .map((value) => Number(value) || 0);
  const currentDate = new Date(year, Math.max(0, month - 1), Math.max(1, day));
  const epoch = new Date(2026, 0, 1);
  const days = Math.floor((currentDate - epoch) / 86400000);
  const total = GAME_DATA.characters.length || 1;   
  return ((days % total) + total) % total;
}

function getBannerCharacterByKey(dateKey = getLocalDateKey()) {
  return GAME_DATA.characters[getBannerIndexForKey(dateKey)] ?? GAME_DATA.characters[0];
}

function createEmptyAccountDb() {
  return {
    version: 2,
    accounts: {}
  };
}

function createDefaultProfile() {
  const characters = {};
  for (const character of GAME_DATA.characters) {
    characters[character.id] = {
      obtained: 0,
      active: 0
    };
  }
  return {
    version: 2,
    createdAt: Date.now(),
    resources: {
      shards: 0,
      flowers: 0,
      greatFlowers: 0,
      prototypes: 0
    },
    inventory: {
      residue: 0,
      urgentDraft: 0,
      lastingDraft: 0,
      vouchers: 0
    },
    characters,
    gacha: {
      cyclePulls: 0,
      freeTenPulls: 0,
      urgentGranted: false,
      lastingGranted: false,
      bannerKey: "",
      history: [],
      lastResults: []
    },
    shop: {
      firstTopUpDouble: true
    },
    messages: []
  };
}

function normalizeProfile(profile) {
  const base = createDefaultProfile();
  const next = {
    ...base,
    ...(profile ?? {}),
    resources: {
      ...base.resources,
      ...(profile?.resources ?? {})
    },
    inventory: {
      ...base.inventory,
      ...(profile?.inventory ?? {})
    },
    gacha: {
      ...base.gacha,
      ...(profile?.gacha ?? {})
    },
    shop: {
      ...base.shop,
      ...(profile?.shop ?? {})
    },
    messages: Array.isArray(profile?.messages) ? profile.messages.slice(-18) : []
  };

  next.characters = {};
  for (const character of GAME_DATA.characters) {
    const saved = profile?.characters?.[character.id] ?? {};
    const obtained = clamp(Math.round(saved.obtained ?? 0), 0, 6);
    next.characters[character.id] = {
      obtained,
      active: clamp(Math.round(saved.active ?? 0), 0, obtained)
    };
  }

  next.gacha.cyclePulls = clamp(Math.round(next.gacha.cyclePulls ?? 0), 0, GACHA_PITY_MAX);
  next.gacha.freeTenPulls = Math.max(0, Math.round(next.gacha.freeTenPulls ?? 0));
  next.gacha.history = Array.isArray(profile?.gacha?.history) ? profile.gacha.history.slice(-30) : [];
  next.gacha.lastResults = Array.isArray(profile?.gacha?.lastResults) ? profile.gacha.lastResults.slice(-10) : [];
  next.inventory.vouchers = Math.max(0, Math.round(next.inventory.vouchers ?? 0));
  next.inventory.residue = Math.max(0, Math.round(next.inventory.residue ?? 0));
  next.inventory.urgentDraft = Math.max(0, Math.round(next.inventory.urgentDraft ?? 0));
  next.inventory.lastingDraft = Math.max(0, Math.round(next.inventory.lastingDraft ?? 0));
  next.resources.shards = Math.max(0, Math.round(next.resources.shards ?? 0));
  next.resources.flowers = Math.max(0, Math.round(next.resources.flowers ?? 0));
  next.resources.greatFlowers = Math.max(0, Math.round(next.resources.greatFlowers ?? 0));
  next.resources.prototypes = Math.max(0, Math.round(next.resources.prototypes ?? 0));
  return next;
}

function loadAccountDb() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyAccountDb();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return createEmptyAccountDb();
    }
    return {
      version: 2,
      accounts: parsed.accounts ?? {}
    };
  } catch (error) {
    console.warn("读取账号存档失败，已回退为空存档。", error);
    return createEmptyAccountDb();
  }
}

function persistAccountDb() {
  if (!game.account.db) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(game.account.db));
  if (game.account.username) {
    window.localStorage.setItem(STORAGE_USER_KEY, game.account.username);
  } else {
    window.localStorage.removeItem(STORAGE_USER_KEY);
  }
}

function isSignedIn() {
  return Boolean(game.account.username && game.account.profile);
}

function getProfile() {
  return game.account.profile;
}

function saveCurrentProfile() {
  if (!isSignedIn() || !game.account.db?.accounts?.[game.account.username]) {
    return;
  }
  game.account.profile = normalizeProfile(game.account.profile);
  game.account.db.accounts[game.account.username].profile = game.account.profile;
  persistAccountDb();
}

function getCharacterProgress(characterId) {
  const profile = getProfile();
  if (!profile) {
    return { obtained: 0, active: 0 };
  }
  return profile.characters?.[characterId] ?? { obtained: 0, active: 0 };
}

function getObtainedConstellationLevel(characterId) {
  return clamp(getCharacterProgress(characterId).obtained ?? 0, 0, 6);
}

function getActiveConstellationLevel(characterId) {
  return clamp(getCharacterProgress(characterId).active ?? 0, 0, 6);
}

function setOverlayMessage(text = "") {
  game.account.overlayMessage = String(text || "");
}

function pushProfileMessage(text) {
  const profile = getProfile();
  if (!profile) {
    return;
  }
  profile.messages = Array.isArray(profile.messages) ? profile.messages : [];
  profile.messages.unshift({
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: String(text),
    createdAt: Date.now()
  });
  profile.messages = profile.messages.slice(0, 18);
}

function syncProfileDailyState() {
  if (!isSignedIn()) {
    return;
  }
  const todayKey = getLocalDateKey();
  if (game.account.lastDateKey === todayKey) {
    return;
  }
  game.account.lastDateKey = todayKey;
  game.account.currentBannerKey = todayKey;

  const profile = getProfile();
  if (profile.gacha.bannerKey && profile.gacha.bannerKey !== todayKey && profile.inventory.vouchers > 0) {
    const converted = profile.inventory.vouchers * 10;
    profile.resources.greatFlowers += converted;
    pushProfileMessage(`卡池已在 ${todayKey} 刷新，自动兑换 ${converted} 巨大文花。`);
    profile.inventory.vouchers = 0;
  }
  profile.gacha.bannerKey = todayKey;
  saveCurrentProfile();
}

function setAuthMode(mode) {
  game.account.authMode = mode === "register" ? "register" : "login";
  const isRegister = game.account.authMode === "register";
  ui.authLoginTab.classList.toggle("active", !isRegister);
  ui.authRegisterTab.classList.toggle("active", isRegister);
  ui.authConfirmRow.classList.toggle("hidden", !isRegister);
  ui.authTitle.textContent = isRegister ? "注册账号" : "账号登录";
  ui.authSubmit.textContent = isRegister ? "注册" : "登录";
  ui.authPassword.autocomplete = isRegister ? "new-password" : "current-password";
}

function showAuthMessage(text, isError = false) {
  ui.authMessage.textContent = text;
  ui.authMessage.style.color = isError ? "#ffd1d1" : "#b7cfdf";
}

function showAuthOverlay(mode = "login", message = "") {
  setAuthMode(mode);
  ui.authOverlay.classList.remove("hidden");
  setStartMenuVisible(false);
  ui.authPassword.value = "";
  ui.authConfirmPassword.value = "";
  const fallback = mode === "register" ? "请输入账号并完成注册。" : "请输入账号密码登录。";
  showAuthMessage(message || fallback, false);
}

function hideAuthOverlay() {
  ui.authOverlay.classList.add("hidden");
  clearInputState();
}

function activateAccount(username, { silent = false } = {}) {
  const entry = game.account.db?.accounts?.[username];
  if (!entry) {
    return false;
  }
  game.account.username = username;
  game.account.profile = normalizeProfile(entry.profile);
  game.account.db.accounts[username].profile = game.account.profile;
  syncProfileDailyState();
  persistAccountDb();
  hideAuthOverlay();
  if (game.phase === PHASE.START) {
    setStartMenuVisible(true);
  }
  if (!silent) {
    setOverlayMessage(`欢迎回来，${username}。`);
  }
  return true;
}

function logoutAccount() {
  game.account.username = "";
  game.account.profile = null;
  game.account.currentBannerKey = "";
  game.account.lastDateKey = "";
  setOverlayMessage("");
  persistAccountDb();
  closeStartOverlay();
  showAuthOverlay("login", "已退出账号，请重新登录。");
}

function initializeAccountState() {
  game.account.db = loadAccountDb();
  const rememberedUser = window.localStorage.getItem(STORAGE_USER_KEY);
  if (rememberedUser && game.account.db.accounts?.[rememberedUser]) {
    activateAccount(rememberedUser, { silent: true });
    return;
  }
  showAuthOverlay("register", "首次进入请注册一个新账号。");
}

function handleAuthSubmit() {
  const username = String(ui.authUsername.value || "").trim();
  const password = String(ui.authPassword.value || "").trim();
  const confirmPassword = String(ui.authConfirmPassword.value || "").trim();
  if (!username || username.length < 2) {
    showAuthMessage("账号至少需要 2 个字符。", true);
    return;
  }
  if (!password || password.length < 4) {
    showAuthMessage("密码至少需要 4 个字符。", true);
    return;
  }

  if (game.account.authMode === "register") {
    if (password !== confirmPassword) {
      showAuthMessage("两次输入的密码不一致。", true);
      return;
    }
    if (game.account.db.accounts?.[username]) {
      showAuthMessage("该账号已存在，请直接登录。", true);
      return;
    }
    game.account.db.accounts[username] = {
      password,
      profile: createDefaultProfile()
    };
    activateAccount(username);
    showAuthMessage("注册成功。");
    return;
  }

  const entry = game.account.db.accounts?.[username];
  if (!entry || entry.password !== password) {
    showAuthMessage("账号或密码错误。", true);
    return;
  }
  activateAccount(username);
}

function resetStartOverlayBody() {
  ui.startOverlayText.innerHTML = "";
  ui.startOverlayText.classList.add("hidden");
  ui.startOverlayImage.classList.add("hidden");
  ui.startOverlayImage.removeAttribute("src");
  ui.startOverlayContent.innerHTML = "";
  ui.startOverlayContent.classList.add("hidden");
}

function showSimpleStartOverlay(title, textHtml, imageSrc = "") {
  resetStartOverlayBody();
  ui.startOverlayTitle.textContent = title;
  ui.startOverlayText.innerHTML = textHtml;
  ui.startOverlayText.classList.remove("hidden");
  if (imageSrc) {
    ui.startOverlayImage.src = imageSrc;
    ui.startOverlayImage.classList.remove("hidden");
  }
  ui.startOverlay.classList.remove("hidden");
}

function showRichStartOverlay(title, contentHtml) {
  resetStartOverlayBody();
  ui.startOverlayTitle.textContent = title;
  ui.startOverlayContent.innerHTML = contentHtml;
  ui.startOverlayContent.classList.remove("hidden");
  ui.startOverlay.classList.remove("hidden");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function buildOverlayTabsHtml(activeTab) {
  const tabs = [
    { id: "bag", label: "背包" },
    { id: "constellation", label: "角色命座" },
    { id: "gacha", label: "抽卡" },
    { id: "shop", label: "充值商店" }
  ];
  return `
    <div class="overlay-tabs">
      ${tabs
        .map((tab) => `
          <button
            class="overlay-tab${tab.id === activeTab ? " active" : ""}"
            type="button"
            data-action="switch-tab"
            data-tab="${tab.id}"
          >${tab.label}</button>
        `)
        .join("")}
    </div>
  `;
}

function renderProfileBannerHtml() {
  const bannerKey = game.account.currentBannerKey || getLocalDateKey();
  const featured = getBannerCharacterByKey(bannerKey);
  return `
    <div class="profile-banner">
      <div>
        <strong>${escapeHtml(game.account.username || "未登录")}</strong>
        <span>今日卡池：${escapeHtml(featured.name)} · ${escapeHtml(bannerKey)}</span>
      </div>
      <div class="inline-actions">
        <button class="secondary-button" type="button" data-action="switch-tab" data-tab="bag">查看资源</button>
        <button class="danger-button" type="button" data-action="logout">退出账号</button>
      </div>
    </div>
  `;
}

function renderOverlayMessageHtml() {
  if (!game.account.overlayMessage) {
    return "";
  }
  return `<div class="account-section"><p>${escapeHtml(game.account.overlayMessage)}</p></div>`;
}

function renderBagTabHtml() {
  const profile = getProfile();
  const messages = Array.isArray(profile.messages) ? profile.messages.slice(0, 4) : [];
  return `
    ${renderProfileBannerHtml()}
    ${buildOverlayTabsHtml("bag")}
    ${renderOverlayMessageHtml()}
    <div class="resource-grid">
      <div class="resource-card"><div class="resource-label">文花碎片</div><div class="resource-value">${profile.resources.shards}</div></div>
      <div class="resource-card"><div class="resource-label">文花</div><div class="resource-value">${profile.resources.flowers}</div></div>
      <div class="resource-card"><div class="resource-label">巨大文花</div><div class="resource-value">${profile.resources.greatFlowers}</div></div>
      <div class="resource-card"><div class="resource-label">文花雏形</div><div class="resource-value">${profile.resources.prototypes}</div></div>
    </div>
    <div class="two-column">
      <section class="account-section">
        <h4>背包物品</h4>
        <ul class="inventory-list">
          <li>糟粕：${profile.inventory.residue}</li>
          <li>加急撰写：${profile.inventory.urgentDraft}</li>
          <li>持续撰写：${profile.inventory.lastingDraft}</li>
          <li>文花凭证：${profile.inventory.vouchers}</li>
        </ul>
        <p class="muted-text">重复获得已满命角色时，会自动转化为 5 文花。</p>
      </section>
      <section class="account-section">
        <h4>资源兑换</h4>
        <div class="inline-actions">
          <button class="confirm-button" type="button" data-action="convert-prototypes">雏形 -> 碎片</button>
          <button class="confirm-button" type="button" data-action="convert-shards">150 碎片 -> 1 巨大文花</button>
          <button class="confirm-button" type="button" data-action="convert-flowers">2 文花 -> 1 巨大文花</button>
        </div>
        <p class="muted-text">兑换按可用数量批量执行，方便快速测试。</p>
      </section>
    </div>
    <section class="account-section">
      <h4>最近消息</h4>
      ${messages.length > 0
        ? `<ul class="detail-list">${messages.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("")}</ul>`
        : `<p class="muted-text">暂无消息。</p>`}
    </section>
  `;
}

function renderConstellationTabHtml() {
  const cards = GAME_DATA.characters
    .map((character) => {
      const progress = getCharacterProgress(character.id);
      const lines = CONSTELLATION_DATA[character.id] ?? [];
      return `
        <section class="constellation-card">
          <h4>${escapeHtml(character.name)}</h4>
          <div class="constellation-meta">
            <span>已获得：${progress.obtained} / 6</span>
            <span>当前生效：${progress.active} 命</span>
          </div>
          <div class="inline-actions">
            <button class="confirm-button" type="button" data-action="set-constellation" data-character="${character.id}" data-level="${Math.min(progress.obtained, progress.active + 1)}">激活下一命</button>
            <button class="secondary-button" type="button" data-action="set-constellation" data-character="${character.id}" data-level="${Math.max(0, progress.active - 1)}">取消一命</button>
            <button class="secondary-button" type="button" data-action="set-constellation" data-character="${character.id}" data-level="0">全部关闭</button>
          </div>
          <div class="constellation-list">
            ${lines
              .map((line, index) => {
                const level = index + 1;
                let stateClass = "locked";
                if (level <= progress.active) {
                  stateClass = "active";
                } else if (level <= progress.obtained) {
                  stateClass = "";
                }
                return `
                  <div class="constellation-item ${stateClass}">
                    <strong>${level} 命</strong>
                    <span>${escapeHtml(line)}</span>
                  </div>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
  return `
    ${renderProfileBannerHtml()}
    ${buildOverlayTabsHtml("constellation")}
    ${renderOverlayMessageHtml()}
    <div class="constellation-grid">${cards}</div>
    <section class="account-section">
      <h4>说明</h4>
      <p class="muted-text">命座只能按前缀生效。你可以在 0 命到“已获得命数”之间自由切换，方便测试不同配置。</p>
    </section>
  `;
}

function renderGachaTabHtml() {
  const profile = getProfile();
  const bannerKey = game.account.currentBannerKey || getLocalDateKey();
  const featured = getBannerCharacterByKey(bannerKey);
  const pityRemaining = Math.max(0, GACHA_PITY_MAX - profile.gacha.cyclePulls);
  const lastResults = profile.gacha.lastResults ?? [];
  return `
    ${renderProfileBannerHtml()}
    ${buildOverlayTabsHtml("gacha")}
    ${renderOverlayMessageHtml()}
    <div class="two-column">
      <section class="featured-card">
        <h4>当期 UP 角色</h4>
        <p>${escapeHtml(featured.name)}</p>
        <p>基础出角概率 0.6%，第 80 抽提升至 3%，第 120 抽必出。</p>
        <p>当前保底计数：${profile.gacha.cyclePulls} 抽，距离保底还差 ${pityRemaining} 抽。</p>
        <p>免费十连：${profile.gacha.freeTenPulls} 次，不计入保底。</p>
      </section>
      <section class="gacha-summary-card">
        <h4>抽卡操作</h4>
        <div class="gacha-actions">
          <button class="confirm-button" type="button" data-action="draw-once">单抽（1 巨大文花）</button>
          <button class="confirm-button" type="button" data-action="draw-ten">十连（10 巨大文花）</button>
          <button class="secondary-button" type="button" data-action="draw-free-ten">使用免费十连</button>
        </div>
        <p>第 20 抽会送一发不计保底的免费十连；第 60 抽会获得文花凭证，下一次卡池刷新时自动兑换 10 巨大文花。</p>
      </section>
    </div>
    <section class="account-section">
      <h4>最近抽卡结果</h4>
      ${lastResults.length > 0
        ? `<div class="gacha-result-grid">
            ${lastResults
              .map((item) => `
                <div class="result-chip">
                  <strong>${escapeHtml(item.name)}</strong>
                  <span>${escapeHtml(item.description)}</span>
                </div>
              `)
              .join("")}
          </div>`
        : `<p class="muted-text">还没有抽卡记录。</p>`}
    </section>
  `;
}

function renderShopTabHtml() {
  const profile = getProfile();
  const cards = RECHARGE_OPTIONS
    .map((pack, index) => {
      const actual = profile.shop.firstTopUpDouble ? pack.prototypes * 2 : pack.prototypes;
      return `
        <div class="shop-card">
          <h4>${pack.amountCny} CNY</h4>
          <p>基础：${pack.prototypes} 文花雏形</p>
          <p>${profile.shop.firstTopUpDouble ? `首充翻倍：本次到账 ${actual}` : `到账 ${actual} 文花雏形`}</p>
          <button class="confirm-button" type="button" data-action="topup" data-index="${index}">立即充值</button>
        </div>
      `;
    })
    .join("");
  return `
    ${renderProfileBannerHtml()}
    ${buildOverlayTabsHtml("shop")}
    ${renderOverlayMessageHtml()}
    <section class="account-section">
      <h4>支付验证</h4>
      <div class="form-inline">
        <input id="paymentPasswordInput" class="mini-input" type="password" placeholder="输入支付密码">
      </div>
      <p class="muted-text">测试密码：骗你的你根本不知道</p>
      <p class="muted-text">首充双倍在任意档位首次成功充值后失效。</p>
    </section>
    <div class="shop-grid">${cards}</div>
  `;
}

function renderAccountOverlay(tab = game.account.overlayTab) {
  if (!isSignedIn()) {
    showAuthOverlay("login", "请先登录后再使用账号面板。");
    return;
  }
  syncProfileDailyState();
  game.account.overlayTab = tab;
  let title = "账号面板";
  let html = "";
  if (tab === "constellation") {
    title = "角色命座";
    html = renderConstellationTabHtml();
  } else if (tab === "gacha") {
    title = "抽卡";
    html = renderGachaTabHtml();
  } else if (tab === "shop") {
    title = "充值商店";
    html = renderShopTabHtml();
  } else {
    title = "背包";
    html = renderBagTabHtml();
  }
  showRichStartOverlay(title, html);
}

function consumeResourcesForGreatFlowers() {
  const profile = getProfile();
  if (!profile) {
    return;
  }
  if (profile.resources.prototypes > 0) {
    profile.resources.shards += profile.resources.prototypes;
    pushProfileMessage(`已自动将 ${profile.resources.prototypes} 文花雏形兑换为文花碎片。`);
    profile.resources.prototypes = 0;
  }
}

function tryConvertResources(kind) {
  const profile = getProfile();
  if (!profile) {
    return;
  }
  setOverlayMessage("");
  if (kind === "prototypes") {
    if (profile.resources.prototypes <= 0) {
      setOverlayMessage("当前没有可兑换的文花雏形。");
    } else {
      const amount = profile.resources.prototypes;
      profile.resources.shards += amount;
      profile.resources.prototypes = 0;
      setOverlayMessage(`已兑换 ${amount} 文花碎片。`);
    }
  } else if (kind === "shards") {
    const count = Math.floor(profile.resources.shards / 150);
    if (count <= 0) {
      setOverlayMessage("文花碎片不足 150，无法兑换巨大文花。");
    } else {
      profile.resources.shards -= count * 150;
      profile.resources.greatFlowers += count;
      setOverlayMessage(`已兑换 ${count} 巨大文花。`);
    }
  } else if (kind === "flowers") {
    const count = Math.floor(profile.resources.flowers / 2);
    if (count <= 0) {
      setOverlayMessage("文花不足 2，无法兑换巨大文花。");
    } else {
      profile.resources.flowers -= count * 2;
      profile.resources.greatFlowers += count;
      setOverlayMessage(`已兑换 ${count} 巨大文花。`);
    }
  }
  saveCurrentProfile();
  renderAccountOverlay(game.account.overlayTab);
}

function setCharacterConstellationLevel(characterId, targetLevel) {
  const profile = getProfile();
  if (!profile || !profile.characters?.[characterId]) {
    return;
  }
  const progress = profile.characters[characterId];
  progress.active = clamp(targetLevel, 0, progress.obtained);
  setOverlayMessage(`${CHARACTER_NAME_BY_ID[characterId] ?? "角色"} 当前生效 ${progress.active} 命。`);
  saveCurrentProfile();
  renderAccountOverlay("constellation");
}

function getPityCharacterRate(drawNumber) {
  if (drawNumber >= GACHA_PITY_MAX) {
    return 1;
  }
  if (drawNumber === 80) {
    return GACHA_80TH_RATE;
  }
  if (drawNumber >= 81) {
    const ratio = (drawNumber - 81) / (GACHA_PITY_MAX - 81);
    return clamp(GACHA_CHARACTER_RATE + ratio * (1 - GACHA_CHARACTER_RATE), GACHA_CHARACTER_RATE, 1);
  }
  return GACHA_CHARACTER_RATE;
}

function grantFeaturedCharacterCopy(character) {
  const profile = getProfile();
  if (!profile) {
    return {
      name: character.name,
      description: "未登录状态无法领奖。"
    };
  }
  const progress = profile.characters[character.id];
  if (progress.obtained >= 6) {
    profile.resources.flowers += 5;
    return {
      name: character.name,
      description: "重复命座已转化为 5 文花。"
    };
  }
  progress.obtained += 1;
  return {
    name: `${character.name} 的命座`,
    description: `已获得第 ${progress.obtained} 命素材，可在角色命座中手动激活。`
  };
}

function runSingleGachaDraw({ featuredCharacter, countsTowardPity }) {
  const profile = getProfile();
  const drawIndex = countsTowardPity ? profile.gacha.cyclePulls + 1 : 0;
  const hitCharacter = Math.random() < (countsTowardPity ? getPityCharacterRate(drawIndex) : GACHA_CHARACTER_RATE);
  if (hitCharacter) {
    if (countsTowardPity) {
      profile.gacha.cyclePulls = 0;
      profile.gacha.urgentGranted = false;
      profile.gacha.lastingGranted = false;
    }
    return grantFeaturedCharacterCopy(featuredCharacter);
  }

  profile.inventory.residue += 1;
  if (countsTowardPity) {
    profile.gacha.cyclePulls = clamp(profile.gacha.cyclePulls + 1, 0, GACHA_PITY_MAX);
    if (profile.gacha.cyclePulls >= 20 && !profile.gacha.urgentGranted) {
      profile.gacha.urgentGranted = true;
      profile.gacha.freeTenPulls += 1;
      profile.inventory.urgentDraft += 1;
      pushProfileMessage("第 20 抽奖励已发放：获得 1 次免费十连（不计入保底）。");
    }
    if (profile.gacha.cyclePulls >= 60 && !profile.gacha.lastingGranted) {
      profile.gacha.lastingGranted = true;
      profile.inventory.lastingDraft += 1;
      profile.inventory.vouchers += 1;
      pushProfileMessage("第 60 抽奖励已发放：获得 1 张文花凭证，下次卡池刷新时自动兑换 10 巨大文花。");
    }
  }
  return {
    name: "糟粕",
    description: "未出角色，获得 1 个糟粕。"
  };
}

function recordGachaResults(results, label) {
  const profile = getProfile();
  if (!profile) {
    return;
  }
  profile.gacha.lastResults = results.slice(-10);
  profile.gacha.history.unshift({
    id: `history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    results,
    createdAt: Date.now()
  });
  profile.gacha.history = profile.gacha.history.slice(0, 30);
}

function performGachaDraw(batchSize, { freeTen = false } = {}) {
  const profile = getProfile();
  if (!profile) {
    return;
  }
  syncProfileDailyState();
  consumeResourcesForGreatFlowers();

  if (freeTen) {
    if (profile.gacha.freeTenPulls <= 0) {
      setOverlayMessage("当前没有可用的免费十连。");
      renderAccountOverlay("gacha");
      return;
    }
    profile.gacha.freeTenPulls -= 1;
    if (profile.inventory.urgentDraft > 0) {
      profile.inventory.urgentDraft -= 1;
    }
  } else if (profile.resources.greatFlowers < batchSize) {
    setOverlayMessage(`巨大文花不足，当前仅有 ${profile.resources.greatFlowers}。`);
    renderAccountOverlay("gacha");
    return;
  } else {
    profile.resources.greatFlowers -= batchSize;
  }

  const featuredCharacter = getBannerCharacterByKey(game.account.currentBannerKey || getLocalDateKey());
  const results = [];
  for (let i = 0; i < batchSize; i += 1) {
    results.push(
      runSingleGachaDraw({
        featuredCharacter,
        countsTowardPity: !freeTen
      })
    );
  }

  const label = freeTen ? "免费十连" : batchSize === 10 ? "十连" : "单抽";
  recordGachaResults(results, label);
  const characterCount = results.filter((item) => item.name.includes("命座") || item.name === featuredCharacter.name).length;
  setOverlayMessage(`${label}完成，本次共获得 ${characterCount} 个角色命座结果。`);
  saveCurrentProfile();
  renderAccountOverlay("gacha");
}

function handleTopUp(index) {
  const profile = getProfile();
  const pack = RECHARGE_OPTIONS[index];
  if (!profile || !pack) {
    return;
  }
  const passwordInput = ui.startOverlayContent.querySelector("#paymentPasswordInput");
  const password = String(passwordInput?.value || "");
  if (password !== TOPUP_TEST_PASSWORD) {
    setOverlayMessage("支付密码错误，未完成充值。");
    renderAccountOverlay("shop");
    return;
  }
  const actual = profile.shop.firstTopUpDouble ? pack.prototypes * 2 : pack.prototypes;
  profile.resources.prototypes += actual;
  profile.shop.firstTopUpDouble = false;
  pushProfileMessage(`充值成功：${pack.amountCny} CNY，到账 ${actual} 文花雏形。`);
  setOverlayMessage(`充值成功，已到账 ${actual} 文花雏形。`);
  saveCurrentProfile();
  renderAccountOverlay("shop");
}

function handleStartOverlayAction(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) {
    return;
  }
  const action = actionTarget.dataset.action;
  if (action === "switch-tab") {
    setOverlayMessage("");
    renderAccountOverlay(actionTarget.dataset.tab || "bag");
    return;
  }
  if (action === "logout") {
    logoutAccount();
    return;
  }
  if (action === "convert-prototypes") {
    tryConvertResources("prototypes");
    return;
  }
  if (action === "convert-shards") {
    tryConvertResources("shards");
    return;
  }
  if (action === "convert-flowers") {
    tryConvertResources("flowers");
    return;
  }
  if (action === "set-constellation") {
    const level = Number(actionTarget.dataset.level);
    setCharacterConstellationLevel(actionTarget.dataset.character, Number.isNaN(level) ? 0 : level);
    return;
  }
  if (action === "draw-once") {
    performGachaDraw(1);
    return;
  }
  if (action === "draw-ten") {
    performGachaDraw(10);
    return;
  }
  if (action === "draw-free-ten") {
    performGachaDraw(10, { freeTen: true });
    return;
  }
  if (action === "topup") {
    handleTopUp(Number(actionTarget.dataset.index));
  }
}

function init() {
  game.players = [
    createPlayer("p1", WIDTH * 0.43),
    createPlayer("p2", WIDTH * 0.57)
  ];
  initializeAccountState();
  bindInput();
  bindUi();
  resetToStart();
  requestAnimationFrame(loop);
}

function bindInput() {
  const preventKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);
  const blockedInspectorKeys = new Set(["i", "j", "c", "k"]);

  function isBlockedInspectShortcut(event) {
    const key = String(event.key || "").toLowerCase();
    if (event.code === "F12") {
      return true;
    }
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && blockedInspectorKeys.has(key)) {
      return true;
    }
    if (event.metaKey && event.altKey && blockedInspectorKeys.has(key)) {
      return true;
    }
    if ((event.ctrlKey || event.metaKey) && key === "u") {
      return true;
    }
    return false;
  }

  window.addEventListener("keydown", (event) => {
    if (isBlockedInspectShortcut(event)) {
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      return;
    }
    if (event.code === "F1") {
      event.preventDefault();
      event.stopPropagation();
      if (game.phase === PHASE.BATTLE && !event.repeat) {
        toggleBattleInfoPanel();
      }
      return;
    }
    if (event.code === "F3") {
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) {
        game.showHitboxes = !game.showHitboxes;
        showTip(game.showHitboxes ? "碰撞箱显示: 开" : "碰撞箱显示: 关");
      }
      return;
    }
    if (preventKeys.has(event.code)) {
      event.preventDefault();
    }
    if (!keysDown.has(event.code)) {
      justPressed.add(event.code);
    }
    keysDown.add(event.code);

    if (game.phase === PHASE.CHOOSE && event.code === "Enter") {
      confirmSelection();
    }
  });

  window.addEventListener("keyup", (event) => {
    keysDown.delete(event.code);
  });

  window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener("blur", () => {
    keysDown.clear();
    justPressed.clear();
  });
}

function bindUi() {
  ui.confirmButton.addEventListener("click", confirmSelection);
  ui.restartButton.addEventListener("click", resetToStart);

  ui.authLoginTab.addEventListener("click", () => setAuthMode("login"));
  ui.authRegisterTab.addEventListener("click", () => setAuthMode("register"));
  ui.authSubmit.addEventListener("click", handleAuthSubmit);
  ui.authUsername.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAuthSubmit();
    }
  });
  ui.authPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAuthSubmit();
    }
  });
  ui.authConfirmPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAuthSubmit();
    }
  });

  ui.startMenuButton.addEventListener("click", () => {
    if (game.phase !== PHASE.START) {
      return;
    }
    ui.startMenuPanel.classList.toggle("hidden");
  });

  ui.showBagButton.addEventListener("click", () => {
    if (game.phase !== PHASE.START || !isSignedIn()) {
      return;
    }
    ui.startMenuPanel.classList.add("hidden");
    renderAccountOverlay("bag");
  });

  ui.showConstellationButton.addEventListener("click", () => {
    if (game.phase !== PHASE.START || !isSignedIn()) {
      return;
    }
    ui.startMenuPanel.classList.add("hidden");
    renderAccountOverlay("constellation");
  });

  ui.showGachaButton.addEventListener("click", () => {
    if (game.phase !== PHASE.START || !isSignedIn()) {
      return;
    }
    ui.startMenuPanel.classList.add("hidden");
    renderAccountOverlay("gacha");
  });

  ui.showShopButton.addEventListener("click", () => {
    if (game.phase !== PHASE.START || !isSignedIn()) {
      return;
    }
    ui.startMenuPanel.classList.add("hidden");
    renderAccountOverlay("shop");
  });

  ui.showAuthorsButton.addEventListener("click", () => {
    showAuthorsOverlay();
  });

  ui.showDonateButton.addEventListener("click", () => {
    showDonateOverlay();
  });

  ui.startOverlayClose.addEventListener("click", () => {
    closeStartOverlay();
  });

  ui.startOverlayContent.addEventListener("click", handleStartOverlayAction);

  ui.startOverlay.addEventListener("click", (event) => {
    if (event.target === ui.startOverlay) {
      closeStartOverlay();
    }
  });

  window.addEventListener("click", (event) => {
    if (game.phase !== PHASE.START) {
      return;
    }
    const inMenuButton = ui.startMenuButton.contains(event.target);
    const inMenuPanel = ui.startMenuPanel.contains(event.target);
    if (!inMenuButton && !inMenuPanel) {
      ui.startMenuPanel.classList.add("hidden");
    }
  });

  const wheel = ui.selectionWheel;
  let dragging = false;
  let lastY = 0;

  wheel.addEventListener("wheel", (event) => {
    if (game.phase !== PHASE.CHOOSE) {
      return;
    }
    event.preventDefault();
    rotateSelection(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  wheel.addEventListener("pointerdown", (event) => {
    if (game.phase !== PHASE.CHOOSE) {
      return;
    }
    dragging = true;
    lastY = event.clientY;
    wheel.setPointerCapture(event.pointerId);
  });

  wheel.addEventListener("pointermove", (event) => {
    if (!dragging || game.phase !== PHASE.CHOOSE) {
      return;
    }
    const deltaY = event.clientY - lastY;
    if (Math.abs(deltaY) > 32) {
      rotateSelection(deltaY > 0 ? 1 : -1);
      lastY = event.clientY;
    }
  });

  const stopDrag = (event) => {
    if (!dragging) {
      return;
    }
    dragging = false;
    if (wheel.hasPointerCapture(event.pointerId)) {
      wheel.releasePointerCapture(event.pointerId);
    }
  };

  wheel.addEventListener("pointerup", stopDrag);
  wheel.addEventListener("pointercancel", stopDrag);

  wheel.addEventListener("click", (event) => {
    if (game.phase !== PHASE.CHOOSE) {
      return;
    }
    const item = event.target.closest(".wheel-item");
    if (!item) {
      return;
    }
    const index = Number(item.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    game.selection.currentIndex = index;
    renderSelectionStep();
  });
}

let lastFrameAt = performance.now();

function loop(frameAt) {
  const dt = Math.min(0.033, (frameAt - lastFrameAt) / 1000);
  lastFrameAt = frameAt;
  const now = frameAt / 1000;
  game.now = now;

  update(dt, now);
  render(now);

  justPressed.clear();
  requestAnimationFrame(loop);
}

function update(dt, now) {
  if (game.phase === PHASE.START) {
    updateStart(dt, now);
    return;
  }
  if (game.phase === PHASE.CHOOSE) {
    updateChoose(now);
    return;
  }
  if (game.phase === PHASE.BATTLE) {
    updateBattle(dt, now);
    return;
  }
  updateResult();
}

function updateStart(dt, now) {
  updateBackgroundCycle(dt);
  if (!isSignedIn()) {
    ui.phaseBanner.textContent = "请先登录或注册账号";
    return;
  }
  syncProfileDailyState();

  game.portals.pvp.spin += dt * 1.5;
  game.portals.pve.spin -= dt * 1.5;
  updateStartPlayerMovement(game.players[0], dt);
  updateStartPlayerMovement(game.players[1], dt);

  for (const player of game.players) {
    player.portalTouch = findPortalContact(player);
  }

  let banner = `白门=PvP，黑门=PvE，双方同门停留 ${GAME_DATA.tuning.portalEntrySeconds} 秒开始`;
  for (const portal of Object.values(game.portals)) {
    const allInside = game.players.every((player) => player.portalTouch === portal.id);
    if (allInside) {
      portal.hold += dt;
      const remain = Math.max(0, GAME_DATA.tuning.portalEntrySeconds - portal.hold);
      banner = `${portal.label} 传送门启动中：${remain.toFixed(1)} 秒`;

      if (portal.hold >= GAME_DATA.tuning.portalEntrySeconds) {
        enterSelection(portal.id === "pvp" ? MODE.PVP : MODE.PVE);
      }
    } else {
      portal.hold = Math.max(0, portal.hold - dt * 1.6);
    }
  }

  ui.phaseBanner.textContent = banner;
}

function updateStartPlayerMovement(player, dt) {
  const tuning = GAME_DATA.tuning;
  const speed = tuning.moveSpeed * 0.92;
  const left = keysDown.has(player.controls.left);
  const right = keysDown.has(player.controls.right);
  const up = keysDown.has(player.controls.jump);
  const down = keysDown.has(player.controls.down);
  const axisX = (left ? -1 : 0) + (right ? 1 : 0);
  const axisY = (up ? -1 : 0) + (down ? 1 : 0);

  if (axisX !== 0) {
    player.facing = axisX;
  }
  player.vx = approach(player.vx, axisX * speed, tuning.accel * dt);
  player.vy = approach(player.vy, axisY * speed, tuning.accel * dt);

  player.x += player.vx * dt;
  player.y += player.vy * dt;

  const minY = HEIGHT * 0.24;
  const maxY = getGroundY() - player.h;
  player.x = clamp(player.x, 0, WIDTH - player.w);
  player.y = clamp(player.y, minY, maxY);
}

function updateChoose(now) {
  const modeText = game.mode === MODE.PVE ? "PvE" : "PvP";
  ui.phaseBanner.textContent = `选择界面 (${modeText})`;
  updateTip(now);
}

function updateBattle(dt, now) {
  if (game.isPaused) {
    ui.phaseBanner.textContent = "战斗暂停中（F1 继续）";
    return;
  }

  updateTip(now);
  ui.phaseBanner.textContent = game.mode === MODE.PVE ? "战斗界面 (PvE)" : "战斗界面 (PvP)";
  updateTimedEffects(now);
  updateDashChargeStates(now);
  refreshWebZoneEffects(now);

  const p1 = game.players[0];
  const p2 = game.players[1];
  updatePlayerMovement(p1, dt, now, true);
  updatePlayerMovement(p2, dt, now, true);
  refreshWebZoneEffects(now);
  updateKunpengDustStates(now);

  if (isPressed(p1.controls.surrender)) {
    surrenderPlayer(p1);
  }
  if (isPressed(p2.controls.surrender)) {
    surrenderPlayer(p2);
  }

  if (game.mode === MODE.PVE && (isPressed("Numpad9") || isPressed("Digit9"))) {
    finishBattle("玩家胜利", "Boss 选择投降，小队获胜。");
  }

  if (game.mode === MODE.PVP) {
    resolveDashHit(p1, p2, now);
    resolveDashHit(p2, p1, now);
  } else if (game.boss) {
    resolveDashHitToBoss(p1, game.boss, now);
    resolveDashHitToBoss(p2, game.boss, now);
    updateBoss(dt, now);
  }

  updateProjectiles(dt, now);
  checkWinCondition();
  updateHud();
}

function updateResult() {
  ui.phaseBanner.textContent = "战斗结束";
}

function updateTip(now) {
  if (game.tip && now <= game.tipUntil) {
    ui.battleTip.textContent = game.tip;
    return;
  }
  if (game.phase === PHASE.BATTLE) {
    ui.battleTip.textContent = game.mode === MODE.PVE
      ? "Boss战：小键盘9可触发Boss投降"
      : "PvP：Y/P投降，J/小键盘1冲撞（消耗闪能），K/小键盘2武器，S/下键角色技能";
  }
}

function showTip(text, seconds = 1.4) {
  game.tip = text;
  game.tipUntil = game.now + seconds;
}

function showAuthorsOverlay() {
  if (game.phase !== PHASE.START) {
    return;
  }
  ui.startMenuPanel.classList.add("hidden");
  showSimpleStartOverlay(
    "作者名单",
    AUTHOR_NAMES
    .map((name, index) => `${index + 1}. ${name}`)
    .join("<br>")
  );
}

function showDonateOverlay() {
  if (game.phase !== PHASE.START) {
    return;
  }
  ui.startMenuPanel.classList.add("hidden");
  showSimpleStartOverlay("打赏支持", "感谢支持项目开发与迭代。<br>请使用微信扫码。", DONATE_IMAGE_PATH);
}

function closeStartOverlay() {
  ui.startOverlay.classList.add("hidden");
  resetStartOverlayBody();
}

function setStartMenuVisible(visible) {
  ui.startMenuButton.classList.toggle("hidden", !(visible && isSignedIn()));
  if (!visible) {
    ui.startMenuPanel.classList.add("hidden");
    closeStartOverlay();
  }
}

function toggleBattleInfoPanel() {
  if (game.phase !== PHASE.BATTLE) {
    return;
  }
  if (isBattleInfoVisible()) {
    hideBattleInfoPanel(true);
    return;
  }
  updateBattleInfoPanelContent();
  showBattleInfoPanel({ manual: true });
}

function showBattleInfoPanel({ autoHideMs = null, manual = true } = {}) {
  if (game.phase !== PHASE.BATTLE) {
    return;
  }
  clearBattleInfoTimer();
  ui.battleInfoPanel.classList.remove("hidden");
  ui.battleInfoHint.textContent = manual
    ? "按 F1 继续战斗（游戏已暂停）"
    : "开场说明：3 秒后自动继续，按 F1 可立即继续";
  game.isPaused = true;
  game.pauseReason = "info";
  clearInputState();

  if (autoHideMs) {
    game.battleInfoTimer = window.setTimeout(() => {
      if (game.phase === PHASE.BATTLE && isBattleInfoVisible()) {
        hideBattleInfoPanel(true);
      }
    }, autoHideMs);
  }
}

function hideBattleInfoPanel(resumeBattle) {
  clearBattleInfoTimer();
  ui.battleInfoPanel.classList.add("hidden");
  if (resumeBattle && game.phase === PHASE.BATTLE) {
    game.isPaused = false;
    game.pauseReason = "";
    clearInputState();
  }
}

function updateBattleInfoPanelContent() {
  const p1 = game.players[0];
  const p2 = game.players[1];
  const p1SkillText = getCharacterSkillPanelText(p1);
  const p2SkillText = getCharacterSkillPanelText(p2);
  const p1Constellation = p1.characterConstellationLevel ?? 0;
  const p2Constellation = p2.characterConstellationLevel ?? 0;
  ui.battleInfoTitle.textContent = "本局角色与武器说明";
  ui.battleInfoP1Character.textContent = `角色：${p1.character.name}（${p1Constellation}命，生命 ${p1.maxHp}，移速倍率 ${formatMultiplier((p1.baseMoveSpeedMultiplier ?? 1) * (p1.staticMoveMultiplier ?? 1))}）｜技能：${p1SkillText}`;
  ui.battleInfoP1Weapon.textContent = `武器：${p1.weapon.name} - ${p1.weapon.description}`;
  ui.battleInfoP2Character.textContent = `角色：${p2.character.name}（${p2Constellation}命，生命 ${p2.maxHp}，移速倍率 ${formatMultiplier((p2.baseMoveSpeedMultiplier ?? 1) * (p2.staticMoveMultiplier ?? 1))}）｜技能：${p2SkillText}`;
  ui.battleInfoP2Weapon.textContent = `武器：${p2.weapon.name} - ${p2.weapon.description}`;

  if (game.mode === MODE.PVE && game.boss) {
    ui.battleInfoBoss.classList.remove("hidden");
    ui.battleInfoBoss.textContent = `Boss：${game.boss.data.name}（生命 ${game.boss.maxHp}，技能冷却 ${game.boss.data.projectile.cooldown}s）`;
  } else {
    ui.battleInfoBoss.classList.add("hidden");
    ui.battleInfoBoss.textContent = "";
  }
}

function isBattleInfoVisible() {
  return !ui.battleInfoPanel.classList.contains("hidden");
}

function clearBattleInfoTimer() {
  if (game.battleInfoTimer) {
    window.clearTimeout(game.battleInfoTimer);
    game.battleInfoTimer = null;
  }
}

function clearInputState() {
  keysDown.clear();
  justPressed.clear();
}

function updateBackgroundCycle(dt) {
  game.backgroundTimer += dt;
  if (game.backgroundTimer >= GAME_DATA.tuning.portalSwitchSeconds) {
    game.backgroundTimer = 0;
    game.backgroundIndex = (game.backgroundIndex + 1) % GAME_DATA.backgrounds.length;
  }
}

function updatePlayerMovement(player, dt, now, combatEnabled) {
  const tuning = GAME_DATA.tuning;
  const isStunned = now < player.stunnedUntil;
  const left = keysDown.has(player.controls.left);
  const right = keysDown.has(player.controls.right);
  const move = (left ? -1 : 0) + (right ? 1 : 0);
  const isCharging = player.chiyanCharge?.active;
  const isFlamebornLeaping = player.flamebornLeapActive;
  const canAct = !isStunned && player.hp > 0;
  const moveSpeed = getEffectiveMoveSpeed(player, now);

  if (isFlamebornLeaping) {
    player.vx = approach(player.vx, 0, tuning.friction * dt);
  } else if (isCharging) {
    const canMoveWhileCharging = player.character?.id === "chi-yan" && player.characterConstellationLevel >= 5 && canAct;
    if (canMoveWhileCharging && move !== 0) {
      player.facing = move;
      player.vx = approach(player.vx, move * moveSpeed * 0.78, tuning.accel * dt * 0.8);
    } else {
      player.vx = approach(player.vx, 0, tuning.friction * dt * 1.2);
    }
    if (canAct) {
      tryHandlePlayerJump(player);
    }
    if (combatEnabled) {
      handleCharacterSkillInput(player, now, canAct);
    }
  } else if (canAct) {
    if (move !== 0) {
      player.facing = move;
      player.vx = approach(player.vx, move * moveSpeed, tuning.accel * dt);
    } else {
      player.vx = approach(player.vx, 0, tuning.friction * dt);
    }

    tryHandlePlayerJump(player);

    if (combatEnabled) {
      const dashPressed = isPressed(player.controls.dash) || (player.controls.dashAlt && isPressed(player.controls.dashAlt));
      if (dashPressed) {
        tryDash(player, now);
      }
      const weaponPressed = isPressed(player.controls.weaponSkill) || (player.controls.weaponSkillAlt && isPressed(player.controls.weaponSkillAlt));
      if (weaponPressed) {
        tryCastWeaponSkill(player, now);
      }
      handleCharacterSkillInput(player, now, canAct);
    }
  } else {
    player.vx = approach(player.vx, 0, tuning.friction * dt * 0.7);
    if (combatEnabled) {
      handleCharacterSkillInput(player, now, canAct);
    }
  }

  if (player.dashUntil > now) {
    player.vx = player.facing * tuning.dashSpeed * (moveSpeed / tuning.moveSpeed);
  }

  player.vy += tuning.gravity * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  }
  if (player.x + player.w > WIDTH) {
    player.x = WIDTH - player.w;
    player.vx = 0;
  }
  if (player.y < 0) {
    player.y = 0;
    if (player.vy < 0) {
      player.vy = 0;
    }
  }

  const groundY = getGroundY();
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.onGround = true;
    player.jumpCount = 0;
    if (player.flamebornLeapActive) {
      resolveBurningBladeLanding(player, now);
    }
  } else {
    player.onGround = false;
  }
}

function tryHandlePlayerJump(player) {
  const canJump = player.onGround || player.jumpCount < player.maxJumps;
  if (!isPressed(player.controls.jump) || !canJump || player.jumpLocked) {
    return;
  }
  const wasOnGround = player.onGround;
  player.vy = -getJumpVelocity();
  player.onGround = false;
  if (wasOnGround) {
    player.jumpCount = 1;
  } else {
    player.jumpCount += 1;
  }
}

function tryDash(player, now) {
  const tuning = GAME_DATA.tuning;
  if (player.chiyanCharge?.active || player.flamebornLeapActive) {
    return;
  }
  if (player.dashUntil > now || now < player.stunnedUntil || player.hp <= 0) {
    return;
  }
  if (!consumeDashCharge(player, now)) {
    showTip(`${player.id} 闪能不足`);
    return;
  }
  player.dashUntil = now + tuning.dashDuration;
  player.dashRecoverAt = 0;
  player.dashRecoveryPending = false;
  player.dashCooldownUntil = 0;
  player.dashHitMarks.clear();
}

function tryCastWeaponSkill(player, now) {
  if (player.chiyanCharge?.active || player.flamebornLeapActive) {
    return;
  }
  if (now < player.stunnedUntil || player.hp <= 0) {
    return;
  }
  const weapon = player.weapon || GAME_DATA.weapons[0];
  const skill = weapon.skill ?? weapon.bullet;
  if (!skill) {
    return;
  }
  if (player.shadowPerfectStrikeReady) {
    if (now < player.weaponSkillReadyAt) {
      return;
    }
    player.weaponSkillReadyAt = now + (skill.cooldown ?? 1);
    executeShadowPerfectStrike(player, now);
    return;
  }
  if (skill.type === "kunpeng-dust") {
    fireKunpengDust(player, weapon, skill, now);
    return;
  }
  if (now < player.weaponSkillReadyAt) {
    return;
  }
  player.weaponSkillReadyAt = now + skill.cooldown;

  if (skill.type === "heavy-drop") {
    castHeavyDropSkill(player, weapon, skill);
    return;
  }
  spawnForwardSkillProjectile(player, weapon, skill);
}

function executeShadowPerfectStrike(player, now) {
  const startX = player.x + player.w / 2;
  const dashDistance = WIDTH * 0.5 * player.facing;
  const nextCenterX = clamp(startX + dashDistance, player.w / 2, WIDTH - player.w / 2);
  const endX = nextCenterX;
  const minX = Math.min(startX, endX);
  const maxX = Math.max(startX, endX);
  const centerY = player.y + player.h * 0.5;
  let hitAny = false;

  for (const target of getEnemyUnits(player)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    const circle = getEntityHitCircle(target);
    const withinPath = circle.x + circle.radius >= minX
      && circle.x - circle.radius <= maxX
      && Math.abs(circle.y - centerY) <= player.h * 0.9;
    if (!withinPath) {
      continue;
    }
    hitAny = true;
    if (target.id === "BOSS") {
      applyDamageToBoss(target, 10, player.facing * 240, player);
    } else {
      applyHitToPlayer(target, 10, 0, player.facing * 240, 1, player);
    }
  }

  player.x = clamp(endX - player.w / 2, 0, WIDTH - player.w);
  player.vx = 0;
  player.vy = 0;
  player.shadowPerfectStrikeReady = false;
  player.shadowPerfectStrikeTrail = {
    startX,
    endX,
    y: centerY,
    createdAt: now,
    expiresAt: now + 0.24
  };
  const healAmount = Math.min(player.maxHp, player.hp + 10) - player.hp;
  player.hp += healAmount;
  showTip(hitAny ? `${player.id} 发动完美隐身突进` : `${player.id} 释放隐身突进`);
}

function tryTriggerPerfectShadowCloak(player, now) {
  if (player.character?.id !== "shadow-ninja" || player.characterConstellationLevel < 6) {
    return;
  }
  const selfCircle = getEntityHitCircle(player);
  const triggerRadius = selfCircle.radius * 4;
  const nearbyProjectile = game.projectiles.some((projectile) => {
    if (!projectile) {
      return false;
    }
    const owner = findActorById(projectile.owner);
    if (!owner || owner.id === player.id) {
      return false;
    }
    if (owner.id !== "BOSS" && owner.side === player.side) {
      return false;
    }
    return distance(projectile.x, projectile.y, selfCircle.x, selfCircle.y) <= triggerRadius + (projectile.radius ?? 0);
  });

  if (!nearbyProjectile) {
    return;
  }
  player.shadowPerfectStrikeReady = true;
  for (const target of getEnemyUnits(player)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    if (target.id === "BOSS") {
      target.stunnedUntil = Math.max(target.stunnedUntil ?? 0, now + 2);
    } else {
      target.stunnedUntil = Math.max(target.stunnedUntil, now + 2);
    }
  }
  showTip(`${player.id} 触发完美隐身`);
}

function consumeDashCharge(player, now) {
  if ((player.dashCharges ?? 0) <= 0) {
    return false;
  }
  const interval = GAME_DATA.tuning.dashChargeInterval ?? 3;
  const max = player.dashChargeMax ?? GAME_DATA.tuning.dashChargeMax ?? 3;
  const wasFull = (player.dashCharges ?? 0) >= max;
  player.dashCharges -= 1;
  if (player.dashCharges < max && (wasFull || !(player.dashChargeNextAt > now))) {
    player.dashChargeNextAt = now + interval;
  }
  return true;
}

function updateDashChargeStates(now) {
  const interval = GAME_DATA.tuning.dashChargeInterval ?? 3;
  for (const player of game.players) {
    const max = player.dashChargeMax ?? GAME_DATA.tuning.dashChargeMax ?? 3;
    player.dashChargeMax = max;
    player.dashCharges = clamp(player.dashCharges ?? max, 0, max);
    if (player.dashCharges >= max) {
      player.dashChargeNextAt = 0;
      continue;
    }
    if (!(player.dashChargeNextAt > now)) {
      if (!(player.dashChargeNextAt > 0)) {
        player.dashChargeNextAt = now + interval;
      }
      while (player.dashCharges < max && now >= player.dashChargeNextAt) {
        player.dashCharges += 1;
        if (player.dashCharges >= max) {
          player.dashChargeNextAt = 0;
          break;
        }
        player.dashChargeNextAt += interval;
      }
    }
  }
}

function updateKunpengDustStates(now) {
  for (const player of game.players) {
    const skill = player.weapon?.skill ?? player.weapon?.bullet;
    if (!skill || skill.type !== "kunpeng-dust" || player.hp <= 0) {
      player.kunpengDusts = [];
      player.nextKunpengDustAt = 0;
      continue;
    }

    const interval = skill.generationInterval ?? 4;
    const maxOrbiting = skill.maxOrbiting ?? 20;
    if (player.kunpengDusts.length >= maxOrbiting) {
      player.nextKunpengDustAt = now + interval;
    } else {
      if (!(player.nextKunpengDustAt > 0)) {
        player.nextKunpengDustAt = now + interval;
      }
      while (player.kunpengDusts.length < maxOrbiting && now >= player.nextKunpengDustAt) {
        player.kunpengDusts.push({
          id: `dust-${Math.random().toString(36).slice(2, 10)}`,
          angleSeed: Math.random() * Math.PI * 2,
          x: player.x + player.w / 2,
          y: player.y + player.h * 0.45,
          radius: skill.radius ?? 11
        });
        player.nextKunpengDustAt += interval;
      }
    }

    layoutKunpengDusts(player, skill, now);
    resolveKunpengDustOrbitHits(player, skill);
  }
}

function layoutKunpengDusts(player, skill, now) {
  const dusts = player.kunpengDusts ?? [];
  if (dusts.length === 0) {
    return;
  }
  const ringSize = skill.orbitRingSize ?? 8;
  const visualRect = getEntityVisualRect(player);
  const orbitPadding = skill.orbitPadding ?? 4;
  const radiusStep = skill.orbitRadiusStep ?? 18;
  const orbitSpeed = skill.orbitSpeed ?? 1.9;
  const centerX = visualRect.x + visualRect.w / 2;
  const centerY = visualRect.y + visualRect.h / 2;

  for (let i = 0; i < dusts.length; i += 1) {
    const dust = dusts[i];
    const ring = Math.floor(i / ringSize);
    const indexInRing = i % ringSize;
    const itemsInRing = Math.min(ringSize, dusts.length - ring * ringSize);
    const angle = now * orbitSpeed + dust.angleSeed + indexInRing * (Math.PI * 2 / Math.max(1, itemsInRing));
    dust.radius = skill.radius ?? 11;
    const baseRadius = Math.hypot(visualRect.w / 2, visualRect.h / 2) + dust.radius + orbitPadding;
    const radius = baseRadius + ring * radiusStep;
    dust.x = centerX + Math.cos(angle) * radius;
    dust.y = centerY + Math.sin(angle) * radius;
  }
}

function resolveKunpengDustOrbitHits(player, skill) {
  const dusts = player.kunpengDusts ?? [];
  if (dusts.length === 0) {
    return;
  }

  for (let i = dusts.length - 1; i >= 0; i -= 1) {
    const dust = dusts[i];
    let hit = false;
    if (game.mode === MODE.PVP) {
      const target = player.id === "P1" ? game.players[1] : game.players[0];
      hit = tryOrbitDustHitPlayer(player, dust, target, skill);
    } else if (game.boss) {
      hit = tryOrbitDustHitBoss(player, dust, game.boss, skill);
    }
    if (hit) {
      dusts.splice(i, 1);
    }
  }
}

function tryOrbitDustHitPlayer(owner, dust, target, skill) {
  if (!target || target.hp <= 0) {
    return false;
  }
  const circle = getEntityHitCircle(target);
  if (distance(dust.x, dust.y, circle.x, circle.y) > dust.radius + circle.radius) {
    return false;
  }
  const dir = Math.sign(circle.x - dust.x) || owner.facing || 1;
  return applyHitToPlayer(target, skill.damage ?? 2, 0, dir * 130, 1, owner);
}

function tryOrbitDustHitBoss(owner, dust, boss, skill) {
  if (!boss || boss.hp <= 0) {
    return false;
  }
  const circle = getEntityHitCircle(boss);
  if (distance(dust.x, dust.y, circle.x, circle.y) > dust.radius + circle.radius) {
    return false;
  }
  const dir = Math.sign(circle.x - dust.x) || owner.facing || 1;
  return applyDamageToBoss(boss, skill.damage ?? 2, dir * 120, owner);
}

function fireKunpengDust(player, weapon, skill, now) {
  if (!player.kunpengDusts || player.kunpengDusts.length === 0) {
    showTip(`${player.id} 暂无鲲鹏尘`);
    return;
  }
  layoutKunpengDusts(player, skill, now);
  const dust = player.kunpengDusts.shift();
  game.projectiles.push({
    owner: player.id,
    sourceType: "player",
    effectType: "kunpeng-dust",
    weaponId: weapon.id,
    x: dust?.x ?? (player.x + player.w / 2),
    y: dust?.y ?? (player.y + player.h * 0.45),
    vx: player.facing * (skill.speed ?? 920),
    vy: 0,
    gravity: 0,
    radius: skill.radius ?? 11,
    life: skill.life ?? 3.6,
    damage: skill.damage ?? 2,
    stun: 0,
    knockbackMultiplier: 1,
    healOnHit: 0,
    healCooldown: 0,
    icon: weapon.icon,
    spin: 0,
    spinSpeed: skill.spinSpeed ?? 0
  });
}

function getCharacterSkillConfig(player) {
  return player.runtimeCharacterSkill ?? player.character?.characterSkill ?? null;
}

function isCharacterSkillHeld(player) {
  return keysDown.has(player.controls.characterSkill);
}

function handleCharacterSkillInput(player, now, canAct) {
  const skill = getCharacterSkillConfig(player);
  if (!skill) {
    return;
  }

  if (skill.type === "flame-curtain") {
    updateChiyanChargeState(player, skill, now, canAct);
    return;
  }

  if (!canAct) {
    return;
  }
  if (!isPressed(player.controls.characterSkill)) {
    return;
  }
  tryCastCharacterSkill(player, skill, now);
}

function updateChiyanChargeState(player, skill, now, canAct) {
  const charge = player.chiyanCharge;
  const held = isCharacterSkillHeld(player);

  if (charge.active) {
    if (player.hp <= 0) {
      cancelChiyanCharge(player, true);
      return;
    }
    if (!held) {
      cancelChiyanCharge(player, false);
      return;
    }
    const need = skill.chargeSeconds ?? 3;
    const elapsed = now - charge.startedAt;
    if (elapsed >= need) {
      charge.active = false;
      charge.startedAt = 0;
      charge.breakAccum = 0;
      player.characterSkillReadyAt = now + (skill.cooldown ?? 6);
      castChiyanFlameCurtain(player, skill, now);
    }
    return;
  }

  if (!canAct || !held) {
    return;
  }
  if (now < player.characterSkillReadyAt || player.hp <= 0) {
    return;
  }
  charge.active = true;
  charge.startedAt = now;
  charge.breakAccum = 0;
  player.vx = 0;
  showTip(`${player.id} 开始蓄力`);
}

function cancelChiyanCharge(player, interrupted) {
  const charge = player.chiyanCharge;
  if (!charge.active) {
    return;
  }
  charge.active = false;
  charge.startedAt = 0;
  charge.breakAccum = 0;
  showTip(interrupted ? `${player.id} 蓄力被打断` : `${player.id} 取消蓄力`);
}

function addChiyanChargeKnockback(player, knockbackMultiplier = 1) {
  const skill = getCharacterSkillConfig(player);
  if (!skill || skill.type !== "flame-curtain") {
    return;
  }
  if (!player.chiyanCharge?.active) {
    return;
  }
  if (player.characterConstellationLevel >= 6) {
    return;
  }
  const breakNeed = skill.breakKnockback ?? 4;
  const normalized = Math.max(0, knockbackMultiplier);
  player.chiyanCharge.breakAccum += normalized;
  if (player.chiyanCharge.breakAccum >= breakNeed) {
    cancelChiyanCharge(player, true);
  }
}

function tryCastCharacterSkill(player, skill, now) {
  if (now < player.characterSkillReadyAt || now < player.stunnedUntil || player.hp <= 0) {
    return;
  }

  if (skill.passive) {
    showTip(`${player.id} 角色技能为被动`);
    return;
  }

  if (skill.type === "wind-mark") {
    castQingLanWindSkill(player, skill, now);
    return;
  }

  if (skill.type === "burning-blade") {
    castBurningBladeSkill(player, skill, now);
    return;
  }

  if (skill.type === "shadow-cloak") {
    player.invisibleUntil = Math.max(player.invisibleUntil, now + (skill.duration ?? 1.5));
    player.characterSkillReadyAt = now + (skill.cooldown ?? 6);
    if (player.characterConstellationLevel >= 5) {
      const maxCharges = player.dashChargeMax ?? GAME_DATA.tuning.dashChargeMax ?? 3;
      player.dashCharges = clamp((player.dashCharges ?? 0) + 3, 0, maxCharges);
      if (player.dashCharges >= maxCharges) {
        player.dashChargeNextAt = 0;
      }
    }
    tryTriggerPerfectShadowCloak(player, now);
    showTip(`${player.id} 进入隐身`);
  }
}

function castQingLanWindSkill(player, skill, now) {
  const existingMark = player.windMark;
  const cooldown = skill.cooldown ?? 6;
  const damage = skill.aoeDamage ?? 2;
  const radius = skill.aoeRadius ?? 82;
  const level = player.characterConstellationLevel;

  if (!existingMark) {
    player.windMark = createWindMark(player, skill, now);
    player.characterSkillReadyAt = level >= 3 ? now : now + cooldown;
    showTip(`${player.id} 留下风印`);
    return;
  }

  const groundY = getGroundY();
  player.x = clamp(existingMark.x - player.w / 2, 0, WIDTH - player.w);
  player.y = clamp(existingMark.y - player.h / 2, 0, groundY - player.h);
  player.vx = 0;
  player.vy = 0;
  player.onGround = player.y + player.h >= groundY - 0.01;
  if (player.onGround) {
    player.jumpCount = 0;
  }

  let hitAny = false;
  for (const target of getEnemyUnits(player)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    const targetCircle = getEntityHitCircle(target);
    const inRange = distance(existingMark.x, existingMark.y, targetCircle.x, targetCircle.y) <= radius + targetCircle.radius;
    if (!inRange) {
      continue;
    }
    hitAny = true;
    if (target.id === "BOSS") {
      applyDamageToBoss(target, damage, player.facing * 180, player, level >= 5 ? 1 : 0);
    } else {
      applyHitToPlayer(target, damage, level >= 5 ? 1 : 0, player.facing * 180, 1, player);
    }
    if (level >= 5) {
      applyVulnerable(target, now, 2, VULNERABLE_DURATION);
    }
  }

  player.windMark = null;
  if (level >= 6 && now >= (player.qinglanCooldownResetReadyAt ?? 0)) {
    player.characterSkillReadyAt = now;
    player.qinglanCooldownResetReadyAt = now + 15;
  } else {
    player.characterSkillReadyAt = now + cooldown;
  }
  showTip(hitAny ? `${player.id} 借风印引渡并命中敌人` : `${player.id} 借风印引渡`);
}

function createWindMark(player, skill, now) {
  return {
    x: player.x + player.w / 2,
    y: player.y + player.h * 0.5,
    size: Math.min(player.w, player.h),
    placedAt: now,
    hoverUntil: now + (skill.hoverSeconds ?? 0.5),
    spinSeed: Math.random() * Math.PI * 2
  };
}

function castChiyanFlameCurtain(player, skill, now) {
  const centerX = player.x + player.w / 2;
  const effectSeconds = skill.effectSeconds ?? 0.42;
  const level = player.characterConstellationLevel;
  let hitAny = false;
  game.fireCurtains.push({
    ownerId: player.id,
    facing: player.facing,
    centerX,
    spawnedAt: now,
    expiresAt: now + effectSeconds
  });

  for (const target of getEnemyUnits(player)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    const targetCircle = getEntityHitCircle(target);
    const ahead = player.facing >= 0 ? targetCircle.x >= centerX : targetCircle.x <= centerX;
    if (!ahead) {
      continue;
    }
    hitAny = true;
    if (target.id === "BOSS") {
      applyDamageToBoss(target, skill.damage ?? 15, player.facing * 300, player, 0.32);
    } else {
      applyHitToPlayer(target, skill.damage ?? 15, 0.32, player.facing * 280, 1, player);
    }
  }

  if (level >= 3 && hitAny) {
    player.characterSkillReadyAt = now;
  }
  showTip(`${player.id} 释放火幕`);
}

function castBurningBladeSkill(player, skill, now) {
  const targetHp = Math.max(1, Math.round(player.maxHp * (skill.selfHpRatio ?? 0.5)));
  player.hp = targetHp;
  player.characterSkillReadyAt = now + (skill.cooldown ?? 20);
  player.flamebornLeapActive = true;
  player.dashUntil = 0;
  player.dashRecoverAt = 0;
  player.dashCooldownUntil = 0;
  player.dashRecoveryPending = false;
  player.dashHitMarks.clear();
  player.vx = 0;
  player.vy = -getJumpVelocityForHeight(HEIGHT * (skill.leapHeightRatio ?? 0.5));
  player.onGround = false;
  player.jumpCount = player.maxJumps;
  showTip(`${player.id} 燃命跃起`);
}

function resolveBurningBladeLanding(player, now) {
  if (!player.flamebornLeapActive) {
    return;
  }
  const skill = getCharacterSkillConfig(player);
  player.flamebornLeapActive = false;
  if (!skill || skill.type !== "burning-blade" || player.hp <= 0) {
    return;
  }
  spawnBurningBladeVolley(player, skill, now);
  showTip(`${player.id} 射出燃命风刃`);
}

function spawnBurningBladeVolley(player, skill, now) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h * 0.5;
  const length = WIDTH * (skill.bladeLengthRatio ?? 0.25);
  const damage = Math.max(1, Math.round(player.maxHp * (skill.bladeDamageHpRatio ?? 0.05)));
  const travelSeconds = Math.max(0.16, skill.bladeTravelSeconds ?? 0.38);
  const travelDistance = WIDTH * (skill.bladeTravelDistanceRatio ?? 0.22);
  const speed = travelDistance / travelSeconds;
  const spawnOffset = (skill.bladeSpawnOffsetRatio ?? 0.72) * Math.min(player.w, player.h) * 0.5;
  const curve = skill.bladeCurve ?? 48;
  const blades = [
    {
      direction: "left",
      axis: "vertical",
      x: centerX - spawnOffset,
      y: centerY,
      vx: -speed,
      vy: 0
    },
    {
      direction: "up",
      axis: "horizontal",
      x: centerX,
      y: player.y - spawnOffset * 0.55,
      vx: 0,
      vy: -speed
    },
    {
      direction: "right",
      axis: "vertical",
      x: centerX + spawnOffset,
      y: centerY,
      vx: speed,
      vy: 0
    }
  ];

  blades.forEach((blade) => {
    game.flamebornBlades.push({
      id: `burning-blade-${Math.random().toString(36).slice(2, 9)}`,
      ownerId: player.id,
      direction: blade.direction,
      axis: blade.axis,
      x: blade.x,
      y: blade.y,
      prevX: blade.x,
      prevY: blade.y,
      vx: blade.vx,
      vy: blade.vy,
      length,
      thickness: 34,
      curve,
      damage,
      createdAt: now,
      updatedAt: now,
      expired: false
    });
  });
}

function getEnemyUnits(player) {
  if (game.mode === MODE.PVP) {
    return [player.id === "P1" ? game.players[1] : game.players[0]];
  }
  if (game.boss) {
    return [game.boss];
  }
  return [];
}

function spawnForwardSkillProjectile(player, weapon, skill) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h * 0.4;
  game.projectiles.push({
    owner: player.id,
    sourceType: "player",
    effectType: skill.type ?? "projectile",
    weaponId: weapon.id,
    x: centerX + player.facing * 38,
    y: centerY,
    vx: player.facing * skill.speed,
    vy: skill.vy ?? 0,
    gravity: skill.gravity ?? 0,
    radius: skill.radius ?? 15,
    life: skill.life ?? 3.5,
    damage: skill.damage ?? 0,
    stun: skill.stun ?? 0,
    knockbackMultiplier: skill.knockbackMultiplier ?? 1,
    healOnHit: skill.healOnHit ?? 0,
    healCooldown: skill.healCooldown ?? 0,
    icon: weapon.icon,
    spin: 0,
    spinSpeed: skill.spinSpeed ?? 9,
    webTrapRadius: skill.trapRadius ?? 92
  });
}

function castHeavyDropSkill(player, weapon, skill) {
  const centerX = player.x + player.w / 2;
  const spawnY = player.y + player.h * 0.15;
  const boost = getJumpVelocity() * (skill.jumpBoostRatio ?? 0.72);
  player.vy = Math.min(player.vy - boost, -boost);
  player.onGround = false;

  game.projectiles.push({
    owner: player.id,
    sourceType: "player",
    effectType: "heavy-drop",
    weaponId: weapon.id,
    x: centerX,
    y: spawnY,
    vx: player.facing * 40,
    vy: skill.dropSpeed ?? 860,
    gravity: skill.gravity ?? 1800,
    radius: skill.radius ?? 18,
    life: skill.life ?? 2.4,
    damage: skill.damage ?? 5,
    stun: skill.stun ?? 1,
    knockbackMultiplier: skill.knockbackMultiplier ?? 1,
    icon: weapon.icon,
    spin: 0,
    spinSpeed: skill.spinSpeed ?? 10
  });
}

function updateBoss(dt, now) {
  const boss = game.boss;
  if (!boss || boss.hp <= 0) {
    return;
  }

  const alivePlayers = game.players.filter((player) => player.hp > 0);
  if (alivePlayers.length === 0) {
    return;
  }

  const target = alivePlayers.reduce((best, player) => {
    if (!best) {
      return player;
    }
    const distA = Math.abs(player.x - boss.x);
    const distB = Math.abs(best.x - boss.x);
    return distA < distB ? player : best;
  }, null);

  if (!target) {
    return;
  }

  const bossData = boss.data;
  const bossStunned = now < (boss.stunnedUntil ?? 0);
  const dx = target.x + target.w / 2 - (boss.x + boss.w / 2);
  const direction = dx === 0 ? boss.facing : Math.sign(dx);
  boss.facing = direction;
  const bossSpeedDebuff = now < (boss.speedDebuffUntil ?? 0)
    ? GAME_DATA.effects.sand.speedDebuffMultiplier
    : 1;
  const bossBindMultiplier = getBindMoveMultiplier(boss, now);
  if (bossStunned) {
    boss.vx = approach(boss.vx, 0, GAME_DATA.tuning.friction * dt * 0.8);
  } else {
    boss.vx = approach(
      boss.vx,
      direction * bossData.moveSpeed * bossSpeedDebuff * bossBindMultiplier * (boss.webSlowMultiplier ?? 1),
      GAME_DATA.tuning.accel * dt * 0.7
    );

    if (boss.onGround && Math.abs(dx) > 240 && Math.random() < 0.018) {
      boss.vy = -getJumpVelocity() * 0.74;
      boss.onGround = false;
    }

    if (now >= boss.skillReadyAt) {
      boss.skillReadyAt = now + bossData.projectile.cooldown;
      game.projectiles.push({
        owner: "BOSS",
        sourceType: "boss",
        x: boss.x + boss.w / 2 + boss.facing * 44,
        y: boss.y + boss.h * 0.35,
        vx: boss.facing * bossData.projectile.speed,
        vy: 0,
        radius: 18,
        life: 3.5,
        damage: bossData.projectile.damage,
        stun: bossData.projectile.stun,
        knockbackMultiplier: 1,
        icon: GAME_DATA.weapons[0].icon,
        spin: 0
      });
    }

    if (now >= boss.meleeReadyAt) {
      for (const player of alivePlayers) {
        if (entitiesOverlap(boss, player)) {
          applyHitToPlayer(player, 4, 0.2, boss.facing * 220, 1, boss);
          boss.meleeReadyAt = now + 1.1;
          break;
        }
      }
    }
  }

  boss.vy += GAME_DATA.tuning.gravity * dt;
  boss.x += boss.vx * dt;
  boss.y += boss.vy * dt;

  if (boss.x < 0) {
    boss.x = 0;
    boss.vx = 0;
  }
  if (boss.x + boss.w > WIDTH) {
    boss.x = WIDTH - boss.w;
    boss.vx = 0;
  }
  if (boss.y < 0) {
    boss.y = 0;
    if (boss.vy < 0) {
      boss.vy = 0;
    }
  }

  const groundY = getGroundY();
  if (boss.y + boss.h >= groundY) {
    boss.y = groundY - boss.h;
    boss.vy = 0;
    boss.onGround = true;
  } else {
    boss.onGround = false;
  }
}

function updateProjectiles(dt) {
  for (let i = game.projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = game.projectiles[i];
    if (projectile.gravity) {
      projectile.vy += projectile.gravity * dt;
    }
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    projectile.spin += dt * (projectile.spinSpeed ?? 9);

    let hit = false;
    if (projectile.sourceType === "player") {
      if (game.mode === MODE.PVP) {
        const target = projectile.owner === "P1" ? game.players[1] : game.players[0];
        hit = tryProjectileHitPlayer(projectile, target);
      } else {
        hit = tryProjectileHitBoss(projectile, game.boss);
      }
    } else if (projectile.sourceType === "boss") {
      for (const player of game.players) {
        if (tryProjectileHitPlayer(projectile, player)) {
          hit = true;
          break;
        }
      }
    }

    const outOfBounds = projectile.x < -80 || projectile.x > WIDTH + 80 || projectile.y < -80 || projectile.y > HEIGHT + 80;
    if (hit || outOfBounds || projectile.life <= 0) {
      game.projectiles.splice(i, 1);
    }
  }
}

function tryProjectileHitPlayer(projectile, player) {
  if (!player || player.hp <= 0) {
    return false;
  }
  if (!projectileHitsEntity(projectile, player)) {
    return false;
  }
  const owner = findActorById(projectile.owner);
  applyProjectileHitToPlayer(projectile, player, owner);
  return true;
}

function tryProjectileHitBoss(projectile, boss) {
  if (!boss || boss.hp <= 0) {
    return false;
  }
  if (!projectileHitsEntity(projectile, boss)) {
    return false;
  }
  const owner = findActorById(projectile.owner);
  applyProjectileHitToBoss(projectile, boss, owner);
  return true;
}

function getDashDamageValue(player) {
  if (player.dashDamageOverride != null) {
    return player.dashDamageOverride;
  }
  return Math.max(1, Math.round(GAME_DATA.tuning.dashDamage * (player.dashDamageMultiplier ?? 1)));
}

function getIncomingDamageMultiplier(target) {
  if (!target) {
    return 1;
  }
  let multiplier = Math.max(0, target.incomingDamageMultiplier ?? 1);
  if (target.character?.id === "burning-blade" && (target.characterConstellationLevel ?? 0) >= 5 && target.hp > target.maxHp * 0.5) {
    multiplier = Math.max(multiplier, 3);
  }
  return multiplier;
}

function resolveDashHit(attacker, defender, now) {
  if (attacker.hp <= 0 || defender.hp <= 0) {
    return;
  }
  if (attacker.dashUntil <= now) {
    return;
  }
  if (attacker.dashHitMarks.has(defender.id)) {
    return;
  }
  if (!entitiesOverlap(attacker, defender)) {
    return;
  }

  attacker.dashHitMarks.add(defender.id);
  const damage = getDashDamageValue(attacker);
  const knockback = attacker.facing * 330 * (attacker.dashKnockbackMultiplier ?? 1);
  applyHitToPlayer(defender, damage, 0, knockback, attacker.dashKnockbackMultiplier ?? 1, attacker);
}

function resolveDashHitToBoss(attacker, boss, now) {
  if (!boss || boss.hp <= 0 || attacker.hp <= 0) {
    return;
  }
  if (attacker.dashUntil <= now) {
    return;
  }
  if (attacker.dashHitMarks.has("boss")) {
    return;
  }
  if (!entitiesOverlap(attacker, boss)) {
    return;
  }

  attacker.dashHitMarks.add("boss");
  const damage = getDashDamageValue(attacker);
  const knockback = attacker.facing * 260 * (attacker.dashKnockbackMultiplier ?? 1);
  applyDamageToBoss(boss, damage, knockback, attacker);
}

function isShadowCloakActive(player, now = game.now) {
  if (!player || player.hp <= 0) {
    return false;
  }
  return player.character?.id === "shadow-ninja" && now < (player.invisibleUntil ?? 0);
}

function randomInt(min, max) {
  const floorMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - floorMin + 1)) + floorMin;
}

function applyVulnerable(target, now, bonus = 2, duration = VULNERABLE_DURATION) {
  if (!target) {
    return;
  }
  target.vulnerableUntil = Math.max(target.vulnerableUntil ?? 0, now + duration);
  target.vulnerableBonus = Math.max(target.vulnerableBonus ?? 0, bonus);
}

function getIncomingDamageBonus(target, now = game.now) {
  if (!target) {
    return 0;
  }
  if (now < (target.vulnerableUntil ?? 0)) {
    return target.vulnerableBonus ?? 0;
  }
  return 0;
}

function getAdjustedIncomingDamage(target, damage, now = game.now) {
  if (!target) {
    return 0;
  }
  const scaled = Math.max(0, damage + getIncomingDamageBonus(target, now)) * Math.max(0, target.incomingDamageMultiplier ?? 1);
  return Math.max(0, Math.round(scaled));
}

function triggerOwnerDamagePassives(owner, actualDamage) {
  if (!owner || owner.id === "BOSS" || actualDamage <= 0 || owner.hp <= 0) {
    return;
  }
  if (owner.character?.id === "ling-mu" && owner.characterConstellationLevel >= 2 && game.now >= (owner.lingmuLifeBurstReadyAt ?? 0)) {
    owner.lingmuLifeBurstReadyAt = game.now + 10;
    const heal = randomInt(0, 10);
    if (heal > 0) {
      owner.hp = Math.min(owner.maxHp, owner.hp + heal);
      showTip(`${owner.id} 的灵木 2 命回复了 ${heal} 点生命`);
    }
  }
}

function triggerTimedRandomHeal(player, maxHeal, cooldownSeconds, readyAtKey, label) {
  if (!player) {
    return;
  }
  const now = game.now;
  if (now < (player[readyAtKey] ?? 0)) {
    return;
  }
  player[readyAtKey] = now + cooldownSeconds;
  const heal = randomInt(0, maxHeal);
  const prevHp = player.hp;
  player.hp = Math.min(player.maxHp, player.hp + heal);
  const actualHeal = Math.max(0, player.hp - prevHp);
  showTip(`${player.id} 的${label}回复了 ${actualHeal} 点生命`);
}

function triggerVictimDamagePassives(player, actualDamage = 0) {
  if (!player || actualDamage <= 0) {
    return;
  }
  if (player.character?.id === "ling-mu" && player.characterConstellationLevel >= 4) {
    triggerTimedRandomHeal(player, 5, 15, "lingmuDamageHealReadyAt", "灵木 4 命");
  }
  if (player.character?.id === "chi-yan" && player.characterConstellationLevel >= 4 && player.chiyanCharge?.active) {
    triggerTimedRandomHeal(player, 5, 2, "chiyanChargeHealReadyAt", "炽焰 4 命");
  }
}

function applyDamageToBoss(boss, damage, knockbackX = 0, owner = null, stun = 0) {
  if (!boss || boss.hp <= 0) {
    return false;
  }
  const totalDamage = Math.max(0, damage + getIncomingDamageBonus(boss));
  if (totalDamage <= 0) {
    return false;
  }
  const actualDamage = Math.min(boss.hp, totalDamage);
  boss.hp = Math.max(0, boss.hp - totalDamage);
  boss.vx += knockbackX;
  if (stun > 0) {
    boss.stunnedUntil = Math.max(boss.stunnedUntil ?? 0, game.now + stun);
  }
  triggerOwnerDamagePassives(owner, actualDamage);
  return true;
}

function applyHitToPlayer(player, damage, stun, knockbackX, knockbackMultiplier = 1, owner = null) {
  if (!player || player.hp <= 0) {
    return false;
  }
  if (isShadowCloakActive(player)) {
    return false;
  }
  const totalDamage = getAdjustedIncomingDamage(player, damage);
  if (totalDamage <= 0) {
    return false;
  }
  const actualDamage = Math.min(player.hp, totalDamage);
  player.hp = Math.max(0, player.hp - totalDamage);
  player.vx += knockbackX;
  player.stunnedUntil = Math.max(player.stunnedUntil, game.now + stun);
  addChiyanChargeKnockback(player, knockbackMultiplier);
  triggerVictimDamagePassives(player, actualDamage);
  triggerOwnerDamagePassives(owner, actualDamage);
  tryTriggerLingmuRevive(player);
  return true;
}

function tryTriggerLingmuRevive(player) {
  if (!player || player.hp > 0) {
    return false;
  }
  const skill = getCharacterSkillConfig(player);
  if (!skill || skill.type !== "verdant-revival") {
    return false;
  }
  if ((player.lingmuRevivesRemaining ?? 0) <= 0) {
    return false;
  }

  player.lingmuRevivesRemaining -= 1;
  player.lingmuReviveUsed = player.lingmuRevivesRemaining <= 0;
  const ratio = skill.reviveHpRatio ?? 0.2;
  player.hp = Math.max(1, Math.round(player.maxHp * ratio));
  const stunSeconds = skill.stunSeconds ?? 3;
  for (const target of getEnemyUnits(player)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    if (target.id === "BOSS") {
      target.stunnedUntil = Math.max(target.stunnedUntil ?? 0, game.now + stunSeconds);
    } else {
      target.stunnedUntil = Math.max(target.stunnedUntil, game.now + stunSeconds);
    }
  }
  if (player.characterConstellationLevel >= 6) {
    game.healingTotems.push({
      id: `totem-${Math.random().toString(36).slice(2, 9)}`,
      ownerId: player.id,
      x: player.x + player.w / 2,
      y: player.y + player.h * 0.58,
      radius: HEALING_TOTEM_RADIUS,
      createdAt: game.now,
      expiresAt: game.now + HEALING_TOTEM_DURATION,
      nextTickAt: game.now + HEALING_TOTEM_TICK
    });
  }
  showTip(`${player.id} 触发灵木回生`);
  return true;
}

function applyProjectileHitToPlayer(projectile, target, owner) {
  if (projectile.effectType === "sand") {
    const sand = GAME_DATA.effects.sand;
    addPoisonStacks(target, 1, sand.poisonDuration);
    target.speedDebuffUntil = Math.max(target.speedDebuffUntil, game.now + sand.speedEffectDuration);
    if (owner && owner.side) {
      owner.speedBuffUntil = Math.max(owner.speedBuffUntil, game.now + sand.speedEffectDuration);
    }
    spawnSandstorm(target, sand.stormDuration);
    showTip(`${target.id} 被飞沙符命中：中毒叠层`);
    return;
  }

  const knockback = Math.sign(projectile.vx || 0) * 210;
  const landed = applyHitToPlayer(
    target,
    projectile.damage ?? 0,
    projectile.stun ?? 0,
    knockback,
    projectile.knockbackMultiplier ?? 1,
    owner
  );
  if (landed) {
    tryTriggerWeaponOnHit(projectile, owner);
  }

  if (projectile.effectType === "web") {
    const circle = getEntityHitCircle(target);
    spawnWebZone(target, circle.x, circle.y, projectile.webTrapRadius ?? GAME_DATA.effects.web.trapRadius ?? 92, projectile.owner);
    showTip(`${target.id} 被缓行咒命中：进入蛛网区域`);
  }
}

function applyProjectileHitToBoss(projectile, boss, owner) {
  if (projectile.effectType === "sand") {
    const sand = GAME_DATA.effects.sand;
    addPoisonStacks(boss, 1, sand.poisonDuration);
    boss.speedDebuffUntil = Math.max(boss.speedDebuffUntil ?? 0, game.now + sand.speedEffectDuration);
    if (owner && owner.side) {
      owner.speedBuffUntil = Math.max(owner.speedBuffUntil, game.now + sand.speedEffectDuration);
    }
    spawnSandstorm(boss, sand.stormDuration);
    return;
  }

  if (projectile.effectType === "web") {
    const circle = getEntityHitCircle(boss);
    spawnWebZone(boss, circle.x, circle.y, projectile.webTrapRadius ?? GAME_DATA.effects.web.trapRadius ?? 92, projectile.owner);
  }

  const hit = applyDamageToBoss(boss, projectile.damage ?? 0, Math.sign(projectile.vx || 0) * 180, owner);
  if (hit) {
    tryTriggerWeaponOnHit(projectile, owner);
  }
}

function spawnWebZone(target, x, y, radius, ownerId) {
  const web = GAME_DATA.effects.web;
  const circle = target ? getEntityHitCircle(target) : { x, y };
  game.webZones.push({
    id: `web-${Math.random().toString(36).slice(2, 10)}`,
    ownerId,
    x: circle.x,
    y: circle.y,
    radius: radius ?? web.trapRadius ?? 92,
    createdAt: game.now,
    expiresAt: game.now + (web.zoneDuration ?? web.bindDuration ?? 6)
  });
}

function spawnSandstorm(target, duration) {
  const circle = getEntityHitCircle(target);
  game.sandstorms.push({
    id: `sand-${Math.random().toString(36).slice(2, 10)}`,
    x: circle.x,
    y: circle.y,
    radius: 220,
    phase: Math.random() * Math.PI * 2,
    duration,
    expiresAt: game.now + duration
  });
}

function addPoisonStacks(target, count, duration) {
  if (!target.poisonStacks) {
    target.poisonStacks = [];
  }
  target.poisonStacks = target.poisonStacks.filter((expireAt) => expireAt > game.now);
  const room = Math.max(0, NEGATIVE_LAYER_CAP - target.poisonStacks.length);
  const addCount = Math.min(count, room);
  for (let i = 0; i < addCount; i += 1) {
    target.poisonStacks.push(game.now + duration);
  }
  if (!target.poisonTickAt || target.poisonTickAt < game.now) {
    target.poisonTickAt = game.now + GAME_DATA.effects.sand.poisonTickInterval;
  }
}

function tryTriggerWeaponOnHit(projectile, owner) {
  if (!projectile || !owner || !owner.side || owner.hp <= 0) {
    return;
  }
  const healAmount = projectile.healOnHit ?? 0;
  const healCooldown = projectile.healCooldown ?? 0;
  if (healAmount <= 0 || healCooldown <= 0) {
    return;
  }
  if (game.now < (owner.weaponPassiveReadyAt ?? 0)) {
    return;
  }

  owner.weaponPassiveReadyAt = game.now + healCooldown;
  const nextHp = Math.min(owner.maxHp, owner.hp + healAmount);
  const actualHeal = nextHp - owner.hp;
  owner.hp = nextHp;
  if (actualHeal > 0) {
    showTip(`${owner.id} 的饮血牙回复了 ${actualHeal} 点生命`);
  }
}

function addBindStacks(target, count, duration) {
  if (!target) {
    return 0;
  }
  if (!target.bindStacks) {
    target.bindStacks = [];
  }
  target.bindStacks = target.bindStacks.filter((expireAt) => expireAt > game.now);
  const room = Math.max(0, NEGATIVE_LAYER_CAP - target.bindStacks.length);
  const addCount = Math.min(count, room);
  for (let i = 0; i < addCount; i += 1) {
    target.bindStacks.push(game.now + duration);
  }
  target.bindUntil = target.bindStacks.reduce((latest, expireAt) => Math.max(latest, expireAt), 0);
  return addCount;
}

function getBindLayerCount(target, now) {
  if (!target) {
    return 0;
  }
  if (!target.bindStacks) {
    target.bindStacks = [];
  }
  target.bindStacks = target.bindStacks.filter((expireAt) => expireAt > now);
  target.bindUntil = target.bindStacks.reduce((latest, expireAt) => Math.max(latest, expireAt), 0);
  return clamp(target.bindStacks.length, 0, NEGATIVE_LAYER_CAP);
}

function getBindMoveMultiplier(target, now) {
  const layers = getBindLayerCount(target, now);
  if (layers <= 0) {
    return 1;
  }
  return Math.pow(GAME_DATA.effects.web.bindMoveMultiplier ?? 0.89, layers);
}

function getAlliedUnits(ownerId) {
  const owner = findActorById(ownerId);
  if (!owner || owner.id === "BOSS") {
    return [];
  }
  if (game.mode === MODE.PVE) {
    return game.players.filter((player) => player.hp > 0);
  }
  return owner.hp > 0 ? [owner] : [];
}

function updateHealingTotems(now) {
  game.healingTotems = game.healingTotems.filter((totem) => now < totem.expiresAt);
  for (const totem of game.healingTotems) {
    while (now >= (totem.nextTickAt ?? 0) && now < totem.expiresAt) {
      for (const ally of getAlliedUnits(totem.ownerId)) {
        const circle = getEntityHitCircle(ally);
        if (distance(circle.x, circle.y, totem.x, totem.y) <= totem.radius + circle.radius) {
          ally.hp = Math.min(ally.maxHp, ally.hp + 2);
        }
      }
      totem.nextTickAt += HEALING_TOTEM_TICK;
    }
  }
}

function updateFlamebornBlades(now) {
  game.flamebornBlades = game.flamebornBlades.filter((blade) => {
    if (now < blade.createdAt) {
      return true;
    }
    if (blade.expired) {
      return false;
    }
    const lastUpdatedAt = blade.updatedAt ?? blade.createdAt;
    const dt = Math.max(0, Math.min(0.05, now - lastUpdatedAt));
    blade.prevX = blade.x;
    blade.prevY = blade.y;
    if (dt > 0) {
      blade.x += blade.vx * dt;
      blade.y += blade.vy * dt;
      blade.updatedAt = now;
      blade.expired = resolveFlamebornBladeHits(blade) || doesFlamebornBladeTouchBoundary(blade);
    }
    return !blade.expired;
  });
}

function resolveFlamebornBladeHits(blade) {
  const owner = findActorById(blade.ownerId);
  if (!owner) {
    return false;
  }
  for (const target of getEnemyUnits(owner)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    if (!isTargetHitByFlamebornBlade(blade, target)) {
      continue;
    }
    const knockback = blade.direction === "left" ? -180 : blade.direction === "right" ? 180 : 0;
    if (target.id === "BOSS") {
      applyDamageToBoss(target, blade.damage, knockback, owner);
    } else {
      applyHitToPlayer(target, blade.damage, 0, knockback, 1, owner);
    }
    return true;
  }
  return false;
}

function isTargetHitByFlamebornBlade(blade, target) {
  const circle = getEntityHitCircle(target);
  const thickness = (blade.thickness ?? 34) + circle.radius;
  if (blade.axis === "vertical") {
    const minX = Math.min(blade.prevX ?? blade.x, blade.x) - thickness;
    const maxX = Math.max(blade.prevX ?? blade.x, blade.x) + thickness;
    const minY = blade.y - blade.length * 0.5 - thickness;
    const maxY = blade.y + blade.length * 0.5 + thickness;
    return circle.x >= minX && circle.x <= maxX && circle.y >= minY && circle.y <= maxY;
  }
  const minX = blade.x - blade.length * 0.5 - thickness;
  const maxX = blade.x + blade.length * 0.5 + thickness;
  const minY = Math.min(blade.prevY ?? blade.y, blade.y) - thickness;
  const maxY = Math.max(blade.prevY ?? blade.y, blade.y) + thickness;
  return circle.x >= minX && circle.x <= maxX && circle.y >= minY && circle.y <= maxY;
}

function doesFlamebornBladeTouchBoundary(blade) {
  const thickness = blade.thickness ?? 34;
  if (blade.direction === "left") {
    return blade.x - thickness <= 0;
  }
  if (blade.direction === "right") {
    return blade.x + thickness >= WIDTH;
  }
  return blade.y - thickness <= 0;
}

function updateTimedEffects(now) {
  game.sandstorms = game.sandstorms.filter((storm) => now < storm.expiresAt);
  game.fireCurtains = game.fireCurtains.filter((effect) => now < effect.expiresAt);
  updateHealingTotems(now);
  updateFlamebornBlades(now);

  for (const player of game.players) {
    if (player.hp <= 0) {
      player.windMark = null;
      cancelChiyanCharge(player, false);
      player.flamebornLeapActive = false;
      player.shadowPerfectStrikeTrail = null;
    }
    if (player.shadowPerfectStrikeTrail && now >= player.shadowPerfectStrikeTrail.expiresAt) {
      player.shadowPerfectStrikeTrail = null;
    }
    tickPoisonDamage(player, now);
    getBindLayerCount(player, now);
  }
  if (game.boss) {
    tickPoisonDamage(game.boss, now);
    getBindLayerCount(game.boss, now);
  }
}

function tickPoisonDamage(target, now) {
  if (!target || !target.poisonStacks) {
    return;
  }
  target.poisonStacks = target.poisonStacks.filter((expireAt) => expireAt > now);
  if (target.poisonStacks.length === 0) {
    target.poisonTickAt = 0;
    return;
  }

  const sand = GAME_DATA.effects.sand;
  if (!target.poisonTickAt || target.poisonTickAt <= 0) {
    target.poisonTickAt = now + sand.poisonTickInterval;
  }

  while (now >= target.poisonTickAt) {
    const damage = getAdjustedIncomingDamage(target, target.poisonStacks.length * sand.poisonDamagePerStack, now);
    const actualDamage = Math.min(target.hp, damage);
    target.hp = Math.max(0, target.hp - damage);
    if (target.side) {
      triggerVictimDamagePassives(target, actualDamage);
      tryTriggerLingmuRevive(target);
    }
    target.poisonTickAt += sand.poisonTickInterval;
  }
}

function refreshWebZoneEffects(now) {
  const web = GAME_DATA.effects.web;
  const activeZones = game.webZones.filter((zone) => now < zone.expiresAt);
  const activeZoneMap = new Map(activeZones.map((zone) => [zone.id, zone]));
  game.webZones = activeZones;

  for (const entity of getWebTrackedEntities()) {
    const previousZones = entity.webZoneIds instanceof Set ? entity.webZoneIds : new Set();
    const currentZones = new Set();
    const circle = getEntityHitCircle(entity);

    for (const zone of activeZones) {
      if (!webZoneAffectsEntity(zone, entity)) {
        continue;
      }
      const inside = distance(circle.x, circle.y, zone.x, zone.y) <= circle.radius + zone.radius;
      if (inside) {
        currentZones.add(zone.id);
      }
    }

    for (const zoneId of previousZones) {
      if (currentZones.has(zoneId) || !activeZoneMap.has(zoneId)) {
        continue;
      }
      const added = addBindStacks(entity, 1, web.bindDuration ?? 6);
      if (added > 0) {
        showTip(`${entity.id} 离开蛛网：束缚+${added}层`);
      }
    }

    entity.webZoneIds = currentZones;
    entity.webSlowMultiplier = currentZones.size > 0
      ? Math.pow(web.zoneMoveMultiplier ?? web.bindMoveMultiplier ?? 0.89, clamp(currentZones.size, 0, NEGATIVE_LAYER_CAP))
      : 1;
    entity.jumpLocked = currentZones.size > 0 && Boolean(web.lockJumpWhileInside);
  }
}

function getEffectiveMoveSpeed(player, now) {
  let speed = GAME_DATA.tuning.moveSpeed * (player.baseMoveSpeedMultiplier ?? 1);
  speed *= player.staticMoveMultiplier ?? 1;
  if (now < (player.speedBuffUntil ?? 0)) {
    speed *= GAME_DATA.effects.sand.speedBuffMultiplier;
  }
  if (now < (player.speedDebuffUntil ?? 0)) {
    speed *= GAME_DATA.effects.sand.speedDebuffMultiplier;
  }
  if (player.character?.id === "shadow-ninja" && player.characterConstellationLevel >= 2 && isShadowCloakActive(player, now)) {
    speed *= 1.05;
  }
  speed *= getBindMoveMultiplier(player, now);
  speed *= player.webSlowMultiplier ?? 1;
  return Math.max(120, speed);
}

function getWebTrackedEntities() {
  const entities = [...game.players];
  if (game.boss) {
    entities.push(game.boss);
  }
  return entities.filter((entity) => entity && entity.hp > 0);
}

function webZoneAffectsEntity(zone, entity) {
  if (!zone || !entity || zone.ownerId === entity.id) {
    return false;
  }
  const owner = findActorById(zone.ownerId);
  if (!owner) {
    return false;
  }
  if (owner.id === "BOSS") {
    return Boolean(entity.side);
  }
  if (entity.id === "BOSS") {
    return Boolean(owner.side);
  }
  return owner.side !== entity.side;
}

function findActorById(id) {
  if (id === "P1") {
    return game.players[0];
  }
  if (id === "P2") {
    return game.players[1];
  }
  if (id === "BOSS") {
    return game.boss;
  }
  return null;
}

function surrenderPlayer(player) {
  if (player.hp <= 0 || game.phase !== PHASE.BATTLE) {
    return;
  }
  player.hp = 0;
  showTip(`${player.id} 投降`);

  if (game.mode === MODE.PVP) {
    const winner = player.id === "P1" ? "P2" : "P1";
    finishBattle(`${winner} 获胜`, `${player.id} 选择投降。`);
  } else {
    const living = game.players.filter((item) => item.hp > 0);
    if (living.length === 0) {
      finishBattle("Boss 胜利", "两位玩家都已投降。");
    }
  }
}

function checkWinCondition() {
  if (game.phase !== PHASE.BATTLE) {
    return;
  }

  const p1 = game.players[0];
  const p2 = game.players[1];
  if (game.mode === MODE.PVP) {
    if (p1.hp <= 0 && p2.hp <= 0) {
      finishBattle("平局", "双方同时倒地。");
      return;
    }
    if (p1.hp <= 0) {
      finishBattle("P2 获胜", "P1 生命值归零。");
      return;
    }
    if (p2.hp <= 0) {
      finishBattle("P1 获胜", "P2 生命值归零。");
    }
    return;
  }

  const boss = game.boss;
  if (!boss) {
    return;
  }
  if (boss.hp <= 0) {
    finishBattle("玩家胜利", `${boss.data.name} 已被击败。`);
    return;
  }
  if (p1.hp <= 0 && p2.hp <= 0) {
    finishBattle("Boss 胜利", "双方玩家生命值都归零。");
  }
}

function updateHud() {
  const p1 = game.players[0];
  const p2 = game.players[1];
  const p1Rate = clamp(p1.hp / p1.maxHp, 0, 1) * 100;
  const p2Rate = clamp(p2.hp / p2.maxHp, 0, 1) * 100;
  ui.p1HealthFill.style.width = `${p1Rate}%`;
  ui.p2HealthFill.style.width = `${p2Rate}%`;
  ui.p1HealthText.textContent = `${Math.ceil(p1.hp)} / ${p1.maxHp}`;
  ui.p2HealthText.textContent = `${Math.ceil(p2.hp)} / ${p2.maxHp}`;
  updatePlayerSkillHud(
    p1,
    ui.p1WeaponCdFill,
    ui.p1WeaponCdText,
    ui.p1CharacterCdFill,
    ui.p1CharacterCdText
  );
  updatePlayerDashHud(p1, ui.p1DashFill, ui.p1DashText);
  renderNegativeStatusRow(p1, ui.p1StatusRow, game.now);
  updatePlayerSkillHud(
    p2,
    ui.p2WeaponCdFill,
    ui.p2WeaponCdText,
    ui.p2CharacterCdFill,
    ui.p2CharacterCdText
  );
  updatePlayerDashHud(p2, ui.p2DashFill, ui.p2DashText);
  renderNegativeStatusRow(p2, ui.p2StatusRow, game.now);

  if (game.mode === MODE.PVE && game.boss) {
    const rate = clamp(game.boss.hp / game.boss.maxHp, 0, 1) * 100;
    ui.bossHealthFill.style.width = `${rate}%`;
    ui.bossHealthText.textContent = `${Math.ceil(game.boss.hp)} / ${game.boss.maxHp}`;
    ui.bossName.textContent = game.boss.data.name;
  }
}

function updatePlayerSkillHud(player, weaponFill, weaponText, characterFill, characterText) {
  const now = game.now;
  const weaponSkill = player.weapon?.skill ?? player.weapon?.bullet;
  if (weaponSkill?.type === "kunpeng-dust") {
    const dustCount = player.kunpengDusts?.length ?? 0;
    const maxDust = weaponSkill.maxOrbiting ?? 20;
    const fillRatio = clamp(dustCount / Math.max(1, maxDust), 0, 1);
    weaponFill.style.width = `${(fillRatio * 100).toFixed(1)}%`;
    if (dustCount >= maxDust) {
      weaponText.textContent = `武器: 尘 ${dustCount}/${maxDust}`;
    } else {
      const remaining = Math.max(0, (player.nextKunpengDustAt ?? now) - now);
      weaponText.textContent = `武器: 尘 ${dustCount}/${maxDust} | 下枚 ${remaining.toFixed(1)}s`;
    }
  } else {
    const weaponCooldown = weaponSkill?.cooldown ?? 0;
    const weaponState = getCooldownState(player.weaponSkillReadyAt, weaponCooldown, now);
    weaponFill.style.width = `${(weaponState.progress * 100).toFixed(1)}%`;
    weaponText.textContent = weaponState.remaining > 0
      ? `武器: ${weaponState.remaining.toFixed(1)}s`
      : "武器: 就绪";
  }

  const characterSkill = getCharacterSkillConfig(player);
  if (!characterSkill) {
    characterFill.style.width = "100%";
    characterText.textContent = "角色: 无";
    return;
  }

  if (characterSkill.passive) {
    const remaining = Math.max(0, player.lingmuRevivesRemaining ?? (player.lingmuReviveUsed ? 0 : 1));
    const maxCharges = player.characterConstellationLevel >= 6 ? 2 : 1;
    const ready = remaining > 0 ? remaining / maxCharges : 0;
    characterFill.style.width = `${(ready * 100).toFixed(1)}%`;
    characterText.textContent = remaining > 0 ? `角色: 被动待命 ${remaining}/${maxCharges}` : "角色: 被动已触发";
    return;
  }

  if (characterSkill.type === "flame-curtain" && player.chiyanCharge?.active) {
    const chargeNeed = characterSkill.chargeSeconds ?? 3;
    const chargeProgress = clamp((now - player.chiyanCharge.startedAt) / chargeNeed, 0, 1);
    characterFill.style.width = `${(chargeProgress * 100).toFixed(1)}%`;
    characterText.textContent = `角色: 蓄力 ${Math.round(chargeProgress * 100)}%`;
    return;
  }

  if (player.shadowPerfectStrikeReady) {
    characterFill.style.width = "100%";
    characterText.textContent = "角色: 完隐待发";
    return;
  }

  if (characterSkill.type === "burning-blade" && player.flamebornLeapActive) {
    characterFill.style.width = "100%";
    characterText.textContent = "角色: 腾跃中";
    return;
  }

  const characterCooldown = characterSkill.cooldown ?? 0;
  const characterState = getCooldownState(player.characterSkillReadyAt, characterCooldown, now);
  characterFill.style.width = `${(characterState.progress * 100).toFixed(1)}%`;
  characterText.textContent = characterState.remaining > 0
    ? `角色: ${characterState.remaining.toFixed(1)}s`
    : "角色: 就绪";
}

function updatePlayerDashHud(player, dashFill, dashText) {
  const now = game.now;
  const maxCharges = player.dashChargeMax ?? GAME_DATA.tuning.dashChargeMax ?? 3;
  const currentCharges = clamp(player.dashCharges ?? maxCharges, 0, maxCharges);
  dashFill.style.width = `${(currentCharges / Math.max(1, maxCharges) * 100).toFixed(1)}%`;
  if (currentCharges >= maxCharges || !(player.dashChargeNextAt > now)) {
    dashText.textContent = `闪能: ${currentCharges}/${maxCharges}`;
    return;
  }
  const remaining = Math.max(0, player.dashChargeNextAt - now);
  dashText.textContent = `闪能: ${currentCharges}/${maxCharges} | 回复 ${remaining.toFixed(1)}s`;
}

function getCooldownState(readyAt, cooldown, now) {
  if (!cooldown || cooldown <= 0) {
    return { progress: 1, remaining: 0 };
  }
  const remaining = Math.max(0, (readyAt ?? 0) - now);
  const progress = clamp(1 - remaining / cooldown, 0, 1);
  return { progress, remaining };
}

function renderNegativeStatusRow(player, rowElement, now) {
  if (!rowElement) {
    return;
  }
  const statuses = collectNegativeStatuses(player, now);
  if (statuses.length === 0) {
    rowElement.innerHTML = "";
    return;
  }
  rowElement.innerHTML = statuses
    .map((status) => `<span class="status-chip" title="${status.title}" data-layers="${status.layers}">${status.symbol}</span>`)
    .join("");
}

function collectNegativeStatuses(player, now) {
  const statuses = [];

  const poisonLayers = clamp(
    (player.poisonStacks?.filter((expireAt) => expireAt > now).length ?? 0),
    0,
    NEGATIVE_LAYER_CAP
  );
  if (poisonLayers > 0) {
    statuses.push({ symbol: "毒", layers: poisonLayers, title: "中毒" });
  }

  if (now < (player.stunnedUntil ?? 0)) {
    statuses.push({ symbol: "晕", layers: 1, title: "眩晕" });
  }

  if (player.jumpLocked) {
    statuses.push({ symbol: "禁", layers: 1, title: "禁跳" });
  }

  if (now < (player.speedDebuffUntil ?? 0)) {
    statuses.push({ symbol: "迟", layers: 1, title: "减速" });
  }

  if (now < (player.vulnerableUntil ?? 0)) {
    statuses.push({ symbol: "易", layers: player.vulnerableBonus ?? 2, title: "易伤" });
  }

  const bindLayers = getBindLayerCount(player, now);
  if (bindLayers > 0) {
    statuses.push({ symbol: "缚", layers: bindLayers, title: "束缚" });
  }

  return statuses;
}

function findPortalContact(player) {
  const centerX = player.x + player.w / 2;
  const centerY = player.y + player.h / 2;
  let picked = null;
  let pickedDistance = Number.POSITIVE_INFINITY;
  for (const portal of Object.values(game.portals)) {
    const d = distance(centerX, centerY, portal.x, portal.y);
    if (d <= portal.radius && d < pickedDistance) {
      picked = portal.id;
      pickedDistance = d;
    }
  }
  return picked;
}

function enterSelection(mode) {
  game.phase = PHASE.CHOOSE;
  game.mode = mode;
  game.isPaused = false;
  game.pauseReason = "";
  game.lockedBackgroundIndex = game.backgroundIndex;
  game.selection.flow = buildSelectionFlow(mode);
  game.selection.stepIndex = 0;
  game.selection.currentIndex = 0;
  game.selection.choices = {};

  ui.selectionPanel.classList.remove("hidden");
  ui.startHint.classList.add("hidden");
  setStartMenuVisible(false);
  ui.hud.classList.add("hidden");
  ui.battleTip.classList.add("hidden");
  hideBattleInfoPanel(false);
  ui.bossHud.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  renderSelectionStep();
}

function buildSelectionFlow(mode) {
  const characterOptions = [RANDOM_CHARACTER_OPTION, ...GAME_DATA.characters];
  const weaponOptions = [RANDOM_WEAPON_OPTION, ...GAME_DATA.weapons];
  const flow = [];
  if (mode === MODE.PVE) {
    flow.push({
      key: "boss",
      title: "选择 Boss",
      subtitle: "Boss 决定本局 PvE 节奏",
      options: GAME_DATA.bosses
    });
  }
  flow.push({
    key: "p1Character",
    title: "P1 选择角色",
    subtitle: "支持随机角色；可用滚轮、拖动或点击切换",
    options: characterOptions
  });
  flow.push({
    key: "p1Weapon",
    title: "P1 选择武器",
    subtitle: "支持随机武器；显示完整武器列表",
    options: weaponOptions
  });
  flow.push({
    key: "p2Character",
    title: "P2 选择角色",
    subtitle: "P2 同样支持随机角色",
    options: characterOptions
  });
  flow.push({
    key: "p2Weapon",
    title: "P2 选择武器",
    subtitle: "确认后进入战斗界面",
    options: weaponOptions
  });
  return flow;
}

function rotateSelection(direction) {
  const step = game.selection.flow[game.selection.stepIndex];
  if (!step) {
    return;
  }
  const total = step.options.length;
  const next = (game.selection.currentIndex + direction + total) % total;
  game.selection.currentIndex = next;
  renderSelectionStep();
}

function renderSelectionStep() {
  const step = game.selection.flow[game.selection.stepIndex];
  if (!step) {
    return;
  }
  const options = step.options;
  const current = options[game.selection.currentIndex];

  ui.selectionTitle.textContent = step.title;
  ui.selectionSubtitle.textContent = `${step.subtitle}（第 ${game.selection.stepIndex + 1} / ${game.selection.flow.length} 步）`;
  ui.detailName.textContent = current.name;
  ui.detailDescription.textContent = current.description;

  ui.selectionList.innerHTML = "";
  options.forEach((option, index) => {
    const item = document.createElement("div");
    item.className = `wheel-item${index === game.selection.currentIndex ? " current" : ""}`;
    item.dataset.index = String(index);
    item.textContent = option.name;
    ui.selectionList.appendChild(item);
  });

  ui.detailStats.innerHTML = "";
  for (const [key, value] of Object.entries(current.stats ?? {})) {
    const li = document.createElement("li");
    li.textContent = `${key}: ${value}`;
    ui.detailStats.appendChild(li);
  }
  if (GAME_DATA.characters.some((character) => character.id === current.id)) {
    const li = document.createElement("li");
    li.textContent = `当前命座: ${getActiveConstellationLevel(current.id)} / 已获得 ${getObtainedConstellationLevel(current.id)}`;
    ui.detailStats.appendChild(li);
  }

  ui.selectionPath.textContent = buildSelectionPathText();
  requestAnimationFrame(() => {
    const active = ui.selectionList.querySelector(`.wheel-item.current`);
    active?.scrollIntoView({ block: "nearest" });
  });
}

function buildSelectionPathText() {
  const labels = [];
  for (const step of game.selection.flow) {
    const chosen = game.selection.choices[step.key];
    if (chosen) {
      labels.push(`${step.title.replace("选择", "")}: ${chosen.name}`);
    } else {
      labels.push(`${step.title.replace("选择", "")}: 待选择`);
    }
  }
  return labels.join("  |  ");
}

function confirmSelection() {
  if (game.phase !== PHASE.CHOOSE) {
    return;
  }
  const step = game.selection.flow[game.selection.stepIndex];
  if (!step) {
    return;
  }
  const current = step.options[game.selection.currentIndex];
  game.selection.choices[step.key] = current;

  if (game.selection.stepIndex < game.selection.flow.length - 1) {
    game.selection.stepIndex += 1;
    game.selection.currentIndex = 0;
    renderSelectionStep();
  } else {
    enterBattle();
  }
}

function enterBattle() {
  const choices = game.selection.choices;
  const p1 = game.players[0];
  const p2 = game.players[1];

  p1.character = resolveCharacterChoice(choices.p1Character);
  p2.character = resolveCharacterChoice(choices.p2Character);
  p1.weapon = resolveWeaponChoice(choices.p1Weapon);
  p2.weapon = resolveWeaponChoice(choices.p2Weapon);

  preparePlayerForBattle(p1);
  preparePlayerForBattle(p2);

  if (game.mode === MODE.PVE) {
    p1.x = WIDTH * 0.22;
    p2.x = WIDTH * 0.36;
    game.boss = createBoss(choices.boss ?? GAME_DATA.bosses[0]);
    showTip("PvE 开始，小键盘9可令 Boss 投降", 2.4);
  } else {
    p1.x = WIDTH * 0.24;
    p2.x = WIDTH * 0.72;
    game.boss = null;
    showTip("PvP 开始，Y/P 可投降", 2.2);
  }

  p1.y = getGroundY() - p1.h;
  p2.y = getGroundY() - p2.h;
  p1.vx = 0;
  p2.vx = 0;
  p1.vy = 0;
  p2.vy = 0;

  game.projectiles.length = 0;
  game.webZones.length = 0;
  game.sandstorms.length = 0;
  game.fireCurtains.length = 0;
  game.flamebornBlades.length = 0;
  game.healingTotems.length = 0;
  game.phase = PHASE.BATTLE;
  game.isPaused = false;
  game.pauseReason = "";

  ui.selectionPanel.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  ui.hud.classList.remove("hidden");
  ui.battleTip.classList.remove("hidden");
  hideBattleInfoPanel(false);
  ui.bossHud.classList.toggle("hidden", game.mode !== MODE.PVE);
  showTip(`P1=${p1.character.name}/${p1.weapon.name}，P2=${p2.character.name}/${p2.weapon.name}`, 2.2);
  updateBattleInfoPanelContent();
  showBattleInfoPanel({ autoHideMs: 3000, manual: false });
  updateHud();
}

function applyCharacterConstellationSetup(player) {
  const character = player.character;
  const baseSkill = character?.characterSkill ? { ...character.characterSkill } : null;
  const level = character ? getActiveConstellationLevel(character.id) : 0;
  player.characterConstellationLevel = level;
  player.runtimeCharacterSkill = baseSkill;
  player.staticMoveMultiplier = 1;
  player.incomingDamageMultiplier = character?.incomingDamageMultiplier ?? 1;
  player.dashDamageOverride = character?.dashDamageOverride ?? null;
  player.shadowPerfectStrikeReady = false;
  player.shadowPerfectStrikeTrail = null;
  player.flamebornLeapActive = false;
  player.qinglanCooldownResetReadyAt = 0;
  player.lingmuLifeBurstReadyAt = 0;
  player.lingmuDamageHealReadyAt = 0;
  player.chiyanChargeHealReadyAt = 0;
  player.lingmuRevivesRemaining = 1;

  if (!character) {
    return;
  }

  if (character.id === "qing-lan") {
    if (level >= 1 && player.runtimeCharacterSkill) {
      player.runtimeCharacterSkill.cooldown = Math.max(0, (player.runtimeCharacterSkill.cooldown ?? 6) - 1);
    }
    if (level >= 2) {
      player.staticMoveMultiplier *= 1.02;
    }
    if (level >= 4 && player.runtimeCharacterSkill) {
      player.runtimeCharacterSkill.aoeDamage = 5;
    }
  } else if (character.id === "chi-yan") {
    if (level >= 1) {
      player.staticMoveMultiplier *= 1.02;
    }
    if (player.runtimeCharacterSkill) {
      let chargeSeconds = player.runtimeCharacterSkill.chargeSeconds ?? 3;
      if (level >= 2) {
        chargeSeconds -= 1;
      }
      if (level >= 4) {
        chargeSeconds += 2;
        player.runtimeCharacterSkill.damage = (player.runtimeCharacterSkill.damage ?? 15) + 5;
      }
      player.runtimeCharacterSkill.chargeSeconds = Math.max(0.5, chargeSeconds);
    }
  } else if (character.id === "ling-mu") {
    if (level >= 1) {
      player.staticMoveMultiplier *= 1.02;
    }
    if (level >= 4) {
      player.staticMoveMultiplier *= 1.01;
    }
    if (level >= 5) {
      player.staticMoveMultiplier *= 0.96;
    }
    if (level >= 3) {
      player.maxHp += 5;
    }
    player.lingmuRevivesRemaining = level >= 6 ? 2 : 1;
  } else if (character.id === "shadow-ninja") {
    if (player.runtimeCharacterSkill && level >= 1) {
      player.runtimeCharacterSkill.duration = (player.runtimeCharacterSkill.duration ?? 1.5) + 1;
    }
    if (level >= 3) {
      player.maxHp = Math.max(player.maxHp, 100);
    }
    if (level >= 4) {
      player.dashDamageOverride = 6;
    }
  }
}

function preparePlayerForBattle(player) {
  player.maxHp = player.character?.baseHp ?? GAME_DATA.tuning.maxHp;
  player.baseMoveSpeedMultiplier = player.character?.moveSpeedMultiplier ?? 1;
  player.maxJumps = player.character?.maxJumps ?? 1;
  player.jumpCount = 0;
  player.incomingDamageMultiplier = player.character?.incomingDamageMultiplier ?? 1;
  player.dashDamageMultiplier = player.character?.dashDamageMultiplier ?? 1;
  player.dashKnockbackMultiplier = player.character?.dashKnockbackMultiplier ?? 1;
  applyCharacterConstellationSetup(player);
  player.hp = player.maxHp;
  player.dashChargeMax = GAME_DATA.tuning.dashChargeMax ?? 3;
  player.dashCharges = player.dashChargeMax;
  player.dashChargeNextAt = 0;
  player.speedBuffUntil = 0;
  player.speedDebuffUntil = 0;
  player.bindUntil = 0;
  player.bindStacks = [];
  player.permanentSlowPct = 0;
  player.poisonStacks = [];
  player.poisonTickAt = 0;
  player.webZoneIds = new Set();
  player.webSlowMultiplier = 1;
  player.jumpLocked = false;
  player.stunnedUntil = 0;
  player.weaponSkillReadyAt = 0;
  player.weaponPassiveReadyAt = 0;
  player.characterSkillReadyAt = 0;
  player.dashUntil = 0;
  player.dashRecoverAt = 0;
  player.dashRecoveryPending = false;
  player.dashHitMarks.clear();
  player.dashCooldownUntil = 0;
  player.kunpengDusts = [];
  const weaponSkill = player.weapon?.skill ?? player.weapon?.bullet;
  player.nextKunpengDustAt = weaponSkill?.type === "kunpeng-dust"
    ? game.now + (weaponSkill.generationInterval ?? 4)
    : 0;
  player.windMark = null;
  player.chiyanCharge.active = false;
  player.chiyanCharge.startedAt = 0;
  player.chiyanCharge.breakAccum = 0;
  player.flamebornLeapActive = false;
  player.lingmuReviveUsed = false;
  player.lingmuDamageHealReadyAt = 0;
  player.chiyanChargeHealReadyAt = 0;
  player.vulnerableUntil = 0;
  player.vulnerableBonus = 0;
  player.invisibleUntil = 0;
  player.shadowPerfectStrikeTrail = null;
  player.portalTouch = null;
}

function resolveCharacterChoice(choice) {
  if (choice?.randomPool === "characters") {
    return pickRandom(GAME_DATA.characters);
  }
  return choice ?? GAME_DATA.characters[0];
}

function resolveWeaponChoice(choice) {
  if (choice?.randomPool === "weapons") {
    return pickRandom(GAME_DATA.weapons);
  }
  return choice ?? GAME_DATA.weapons[0];
}

function createBoss(data) {
  return {
    id: "BOSS",
    data,
    x: WIDTH * 0.62,
    y: getGroundY() - 132,
    w: 108,
    h: 132,
    hitScale: 0.46,
    vx: 0,
    vy: 0,
    onGround: true,
    facing: -1,
    hp: data.hp,
    maxHp: data.hp,
    poisonStacks: [],
    poisonTickAt: 0,
    speedDebuffUntil: 0,
    bindUntil: 0,
    bindStacks: [],
    webZoneIds: new Set(),
    webSlowMultiplier: 1,
    jumpLocked: false,
    vulnerableUntil: 0,
    vulnerableBonus: 0,
    stunnedUntil: 0,
    skillReadyAt: 0,
    meleeReadyAt: 0
  };
}

function finishBattle(title, description) {
  if (game.phase !== PHASE.BATTLE) {
    return;
  }
  game.isPaused = false;
  game.pauseReason = "";
  game.phase = PHASE.RESULT;
  game.result.title = title;
  game.result.description = description;
  ui.resultTitle.textContent = title;
  ui.resultDescription.textContent = description;
  ui.resultPanel.classList.remove("hidden");
  ui.battleTip.classList.add("hidden");
  hideBattleInfoPanel(false);
  ui.bossHud.classList.toggle("hidden", !(game.mode === MODE.PVE && game.boss));
}

function resetToStart() {
  game.phase = PHASE.START;
  game.mode = null;
  game.projectiles.length = 0;
  game.webZones.length = 0;
  game.sandstorms.length = 0;
  game.fireCurtains.length = 0;
  game.flamebornBlades.length = 0;
  game.healingTotems.length = 0;
  game.boss = null;
  game.portals = createPortals();
  game.backgroundTimer = 0;
  game.result.title = "";
  game.result.description = "";

  const p1 = game.players[0];
  const p2 = game.players[1];
  p1.x = WIDTH * 0.43;
  p2.x = WIDTH * 0.57;
  p1.y = getGroundY() - p1.h;
  p2.y = getGroundY() - p2.h;
  p1.vx = 0;
  p2.vx = 0;
  p1.vy = 0;
  p2.vy = 0;
  p1.dashUntil = 0;
  p2.dashUntil = 0;
  p1.dashRecoverAt = 0;
  p2.dashRecoverAt = 0;
  p1.dashRecoveryPending = false;
  p2.dashRecoveryPending = false;
  p1.dashHitMarks.clear();
  p2.dashHitMarks.clear();
  p1.kunpengDusts = [];
  p2.kunpengDusts = [];
  p1.nextKunpengDustAt = 0;
  p2.nextKunpengDustAt = 0;
  p1.stunnedUntil = 0;
  p2.stunnedUntil = 0;
  p1.maxHp = GAME_DATA.tuning.maxHp;
  p2.maxHp = GAME_DATA.tuning.maxHp;
  p1.hp = p1.maxHp;
  p2.hp = p2.maxHp;
  p1.baseMoveSpeedMultiplier = 1;
  p2.baseMoveSpeedMultiplier = 1;
  p1.staticMoveMultiplier = 1;
  p2.staticMoveMultiplier = 1;
  p1.maxJumps = 1;
  p2.maxJumps = 1;
  p1.jumpCount = 0;
  p2.jumpCount = 0;
  p1.incomingDamageMultiplier = 1;
  p2.incomingDamageMultiplier = 1;
  p1.dashDamageMultiplier = 1;
  p2.dashDamageMultiplier = 1;
  p1.dashKnockbackMultiplier = 1;
  p2.dashKnockbackMultiplier = 1;
  p1.dashDamageOverride = null;
  p2.dashDamageOverride = null;
  p1.dashChargeMax = GAME_DATA.tuning.dashChargeMax ?? 3;
  p2.dashChargeMax = GAME_DATA.tuning.dashChargeMax ?? 3;
  p1.dashCharges = p1.dashChargeMax;
  p2.dashCharges = p2.dashChargeMax;
  p1.dashChargeNextAt = 0;
  p2.dashChargeNextAt = 0;
  p1.speedBuffUntil = 0;
  p2.speedBuffUntil = 0;
  p1.speedDebuffUntil = 0;
  p2.speedDebuffUntil = 0;
  p1.bindUntil = 0;
  p2.bindUntil = 0;
  p1.bindStacks = [];
  p2.bindStacks = [];
  p1.permanentSlowPct = 0;
  p2.permanentSlowPct = 0;
  p1.poisonStacks = [];
  p2.poisonStacks = [];
  p1.poisonTickAt = 0;
  p2.poisonTickAt = 0;
  p1.webZoneIds = new Set();
  p2.webZoneIds = new Set();
  p1.webSlowMultiplier = 1;
  p2.webSlowMultiplier = 1;
  p1.jumpLocked = false;
  p2.jumpLocked = false;
  p1.weaponSkillReadyAt = 0;
  p2.weaponSkillReadyAt = 0;
  p1.weaponPassiveReadyAt = 0;
  p2.weaponPassiveReadyAt = 0;
  p1.characterSkillReadyAt = 0;
  p2.characterSkillReadyAt = 0;
  p1.windMark = null;
  p2.windMark = null;
  p1.chiyanCharge.active = false;
  p2.chiyanCharge.active = false;
  p1.chiyanCharge.startedAt = 0;
  p2.chiyanCharge.startedAt = 0;
  p1.chiyanCharge.breakAccum = 0;
  p2.chiyanCharge.breakAccum = 0;
  p1.flamebornLeapActive = false;
  p2.flamebornLeapActive = false;
  p1.lingmuReviveUsed = false;
  p2.lingmuReviveUsed = false;
  p1.lingmuRevivesRemaining = 1;
  p2.lingmuRevivesRemaining = 1;
  p1.lingmuLifeBurstReadyAt = 0;
  p2.lingmuLifeBurstReadyAt = 0;
  p1.lingmuDamageHealReadyAt = 0;
  p2.lingmuDamageHealReadyAt = 0;
  p1.invisibleUntil = 0;
  p2.invisibleUntil = 0;
  p1.shadowPerfectStrikeReady = false;
  p2.shadowPerfectStrikeReady = false;
  p1.shadowPerfectStrikeTrail = null;
  p2.shadowPerfectStrikeTrail = null;
  p1.chiyanChargeHealReadyAt = 0;
  p2.chiyanChargeHealReadyAt = 0;
  p1.qinglanCooldownResetReadyAt = 0;
  p2.qinglanCooldownResetReadyAt = 0;
  p1.characterConstellationLevel = 0;
  p2.characterConstellationLevel = 0;
  p1.vulnerableUntil = 0;
  p2.vulnerableUntil = 0;
  p1.vulnerableBonus = 0;
  p2.vulnerableBonus = 0;
  p1.runtimeCharacterSkill = null;
  p2.runtimeCharacterSkill = null;
  p1.portalTouch = null;
  p2.portalTouch = null;
  p1.character = GAME_DATA.characters[0];
  p2.character = GAME_DATA.characters[0];
  p1.weapon = GAME_DATA.weapons[0];
  p2.weapon = GAME_DATA.weapons[0];

  ui.startHint.classList.remove("hidden");
  setStartMenuVisible(true);
  ui.selectionPanel.classList.add("hidden");
  ui.hud.classList.add("hidden");
  ui.battleTip.classList.add("hidden");
  hideBattleInfoPanel(false);
  ui.bossHud.classList.add("hidden");
  ui.resultPanel.classList.add("hidden");
  ui.phaseBanner.textContent = `白门=PvP，黑门=PvE，双方同门停留 ${GAME_DATA.tuning.portalEntrySeconds} 秒开始`;
}

function render(now) {
  drawBackground();
  drawGround();

  if (game.phase === PHASE.START) {
    drawPortals(now);
    drawPlayer(game.players[0], now);
    drawPlayer(game.players[1], now);
    if (game.showHitboxes) {
      drawHitboxes();
    }
    return;
  }

  if (game.phase === PHASE.CHOOSE) {
    drawPlayerSilhouette(game.players[0], 0.18);
    drawPlayerSilhouette(game.players[1], 0.18);
    return;
  }

  drawWindMarks(now);
  drawFireCurtains(now);
  drawShadowPerfectStrikeTrails(now);
  drawFlamebornBlades(now);
  for (const projectile of game.projectiles) {
    drawProjectile(projectile);
  }
  drawKunpengDusts(now);
  drawWebZones(now);
  drawHealingTotems(now);
  drawPlayer(game.players[0], now);
  drawPlayer(game.players[1], now);
  if (game.mode === MODE.PVE && game.boss) {
    drawBoss(game.boss, now);
  }
  drawSandstorms(now);
  if (game.showHitboxes) {
    drawHitboxes();
  }
}

function drawBackground() {
  const index = game.phase === PHASE.START ? game.backgroundIndex : game.lockedBackgroundIndex;
  const src = GAME_DATA.backgrounds[index];
  const image = getImage(src);
  if (image) {
    drawImageCover(image, 0, 0, WIDTH, HEIGHT);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#11324d");
    gradient.addColorStop(1, "#06141f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  ctx.fillStyle = "rgba(4, 9, 16, 0.25)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawGround() {
  const groundY = getGroundY();
  const gradient = ctx.createLinearGradient(0, groundY, 0, HEIGHT);
  gradient.addColorStop(0, "rgba(64, 86, 110, 0.55)");
  gradient.addColorStop(1, "rgba(13, 23, 34, 0.92)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, groundY, WIDTH, HEIGHT - groundY);
}

function drawPortals(now) {
  drawPortal(game.portals.pvp, now, "#ffffff", "PvP");
  drawPortal(game.portals.pve, now, "#111111", "PvE");
}

function drawPortal(portal, now, fallbackColor, label) {
  const image = getImage(portal.image);
  const size = portal.radius * 1.36;

  ctx.save();
  ctx.translate(portal.x, portal.y);
  ctx.rotate(portal.spin + now * 0.5);
  if (image) {
    drawImageContain(image, -size, -size, size * 2, size * 2, "center");
  } else {
    ctx.fillStyle = fallbackColor;
    ctx.beginPath();
    ctx.arc(0, 0, portal.radius * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "rgba(220, 241, 255, 0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(portal.x, portal.y, portal.radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = "bold 26px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillStyle = label === "PvP" ? "#ffffff" : "#e6e6e6";
  ctx.fillText(label, portal.x, portal.y - portal.radius - 24);
}

function drawWindMarks(now) {
  for (const player of game.players) {
    const mark = player.windMark;
    if (!mark) {
      continue;
    }
    const hoverDuration = Math.max(0.001, (player.character?.characterSkill?.hoverSeconds ?? 0.5));
    const hoverRatio = clamp((mark.hoverUntil - now) / hoverDuration, 0, 1);
    const hoverLift = hoverRatio > 0 ? (1 - hoverRatio) * 18 : 18;
    const x = mark.x;
    const y = mark.y - hoverLift;
    const size = mark.size;
    const spin = now * 2.6 + mark.spinSeed;

    ctx.save();
    ctx.translate(x, y);

    ctx.save();
    ctx.rotate(spin);
    ctx.strokeStyle = "rgba(158, 245, 255, 0.86)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      const a0 = (Math.PI / 2) * i + 0.2;
      const a1 = a0 + 0.95;
      ctx.arc(0, 0, size * 0.64, a0, a1);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "rgba(82, 225, 255, 0.42)";
    ctx.strokeStyle = "rgba(197, 253, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.fillRect(-size * 0.45, -size * 0.45, size * 0.9, size * 0.9);
    ctx.strokeRect(-size * 0.45, -size * 0.45, size * 0.9, size * 0.9);
    ctx.restore();

    ctx.restore();
  }
}

function drawKunpengDusts(now) {
  void now;
  for (const player of game.players) {
    if (!player.kunpengDusts || player.kunpengDusts.length === 0) {
      continue;
    }
    for (const dust of player.kunpengDusts) {
      drawProjectile({
        x: dust.x,
        y: dust.y,
        radius: dust.radius ?? 11,
        icon: player.weapon?.icon,
        spin: 0,
        spinSpeed: 0,
        sourceType: "player"
      });
    }
  }
}

function drawFireCurtains(now) {
  for (const effect of game.fireCurtains) {
    if (now >= effect.expiresAt) {
      continue;
    }
    const life = clamp((effect.expiresAt - now) / (effect.expiresAt - effect.spawnedAt), 0, 1);
    const alpha = 0.42 * life;
    const left = effect.facing >= 0 ? effect.centerX : 0;
    const width = effect.facing >= 0 ? WIDTH - effect.centerX : effect.centerX;

    ctx.save();
    const gradient = ctx.createLinearGradient(left, 0, left + width, 0);
    gradient.addColorStop(0, `rgba(255, 76, 58, ${alpha.toFixed(3)})`);
    gradient.addColorStop(1, `rgba(255, 161, 92, ${(alpha * 0.14).toFixed(3)})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(left, 0, width, getGroundY());

    ctx.strokeStyle = `rgba(255, 214, 176, ${(alpha * 0.9).toFixed(3)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(effect.centerX, 0);
    ctx.lineTo(effect.centerX, getGroundY());
    ctx.stroke();
    ctx.restore();
  }
}

function drawShadowPerfectStrikeTrails(now) {
  for (const player of game.players) {
    const trail = player.shadowPerfectStrikeTrail;
    if (!trail) {
      continue;
    }
    if (now >= trail.expiresAt) {
      player.shadowPerfectStrikeTrail = null;
      continue;
    }
    const lifeRate = clamp((trail.expiresAt - now) / Math.max(0.001, trail.expiresAt - trail.createdAt), 0, 1);
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.16 + lifeRate * 0.16).toFixed(3)})`;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(trail.startX, trail.y);
    ctx.lineTo(trail.endX, trail.y);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.34 + lifeRate * 0.3).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trail.startX, trail.y);
    ctx.lineTo(trail.endX, trail.y);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFlamebornBlades(now) {
  for (const blade of game.flamebornBlades) {
    if (now < blade.createdAt) {
      continue;
    }
    const age = Math.max(0, now - blade.createdAt);
    const pulse = 0.5 + 0.5 * Math.sin(age * 10);
    const alpha = 0.72 + pulse * 0.16;
    const glowAlpha = 0.18 + pulse * 0.08;
    const currentX = blade.x;
    const currentY = blade.y;
    const curve = blade.curve ?? 48;

    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(112, 243, 255, ${alpha.toFixed(3)})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    if (blade.axis === "horizontal") {
      ctx.moveTo(currentX - blade.length * 0.5, currentY);
      ctx.quadraticCurveTo(currentX, currentY - curve, currentX + blade.length * 0.5, currentY);
    } else {
      const bendX = blade.direction === "left" ? currentX - curve : currentX + curve;
      ctx.moveTo(currentX, currentY - blade.length * 0.5);
      ctx.quadraticCurveTo(bendX, currentY, currentX, currentY + blade.length * 0.5);
    }
    ctx.stroke();
    ctx.strokeStyle = `rgba(218, 253, 255, ${(alpha * 0.82).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (blade.axis === "horizontal") {
      ctx.moveTo(currentX - blade.length * 0.38, currentY + 8);
      ctx.quadraticCurveTo(currentX, currentY - curve * 0.44, currentX + blade.length * 0.38, currentY + 8);
    } else {
      const bendX = blade.direction === "left" ? currentX - curve * 0.56 : currentX + curve * 0.56;
      ctx.moveTo(currentX + (blade.direction === "left" ? 6 : -6), currentY - blade.length * 0.36);
      ctx.quadraticCurveTo(bendX, currentY, currentX + (blade.direction === "left" ? 6 : -6), currentY + blade.length * 0.36);
    }
    ctx.stroke();

    ctx.strokeStyle = `rgba(125, 238, 255, ${(0.18 + pulse * 0.1).toFixed(3)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(blade.prevX ?? currentX, blade.prevY ?? currentY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.fillStyle = `rgba(108, 242, 255, ${glowAlpha.toFixed(3)})`;
    ctx.beginPath();
    if (blade.axis === "horizontal") {
      ctx.ellipse(currentX, currentY, blade.length * 0.32, 20, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(currentX, currentY, 20, blade.length * 0.32, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }
}

function drawPlayer(player, now) {
  const spritePath = player.side === "p1" ? player.character.sprite.p1 : player.character.sprite.p2;
  const image = getImage(spritePath);
  const stunned = now < player.stunnedUntil;
  const invisible = isShadowCloakActive(player, now);

  let drawX = player.x;
  let drawY = player.y;
  let rotation = 0;
  if (game.phase === PHASE.START && player.portalTouch) {
    const portal = game.portals[player.portalTouch];
    const orbitAngle = now * 9 + player.portalPhase * (player.side === "p1" ? 1 : -1);
    const orbitRadius = 26 + Math.sin(now * 7 + player.portalPhase) * 12;
    const orbitX = portal.x + Math.cos(orbitAngle) * orbitRadius - player.w / 2;
    const orbitY = portal.y + Math.sin(orbitAngle * 1.2) * orbitRadius * 0.6 - player.h / 2;
    drawX = lerp(player.x, orbitX, 0.68);
    drawY = lerp(player.y, orbitY, 0.68);
    rotation = now * 2;
  }

  ctx.save();
  ctx.translate(drawX + player.w / 2, drawY + player.h / 2);
  ctx.rotate(rotation);
  const hue = getCharacterHue(player.character.id) + (player.side === "p2" ? 18 : 0);
  ctx.filter = `hue-rotate(${hue}deg) saturate(1.06)`;
  const baseAlpha = player.hp > 0 ? 1 : 0.35;
  const stealthAlpha = invisible ? (player.character?.characterSkill?.alpha ?? 0.5) : 1;
  ctx.globalAlpha = baseAlpha * stealthAlpha;
  if (image) {
    drawImageContain(image, -player.w / 2, -player.h / 2, player.w, player.h, "bottom");
  } else {
    ctx.fillStyle = player.side === "p1" ? "#4cc9f0" : "#ff758f";
    ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
  }
  ctx.filter = "none";
  ctx.restore();

  if (game.phase !== PHASE.START) {
    const barX = drawX + 6;
    const barY = drawY - 12;
    const barW = player.w - 12;
    ctx.fillStyle = "rgba(6, 14, 21, 0.7)";
    ctx.fillRect(barX, barY, barW, 6);
    ctx.fillStyle = player.side === "p1" ? "#4cc9f0" : "#ff758f";
    ctx.fillRect(barX, barY, barW * clamp(player.hp / player.maxHp, 0, 1), 6);
  }

  if (stunned) {
    ctx.fillStyle = "rgba(255, 230, 152, 0.9)";
    ctx.font = "bold 14px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText("眩晕", drawX + player.w / 2, drawY - 20);
  }

  ctx.fillStyle = "#eff8ff";
  ctx.font = "bold 16px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(player.id, drawX + player.w / 2, drawY + player.h + 18);

  if (invisible || player.chiyanCharge?.active || player.shadowPerfectStrikeReady || player.flamebornLeapActive) {
    const labels = [];
    if (invisible) {
      labels.push("隐身");
    }
    if (player.chiyanCharge?.active) {
      labels.push("蓄力");
    }
    if (player.shadowPerfectStrikeReady) {
      labels.push("完隐");
    }
    if (player.flamebornLeapActive) {
      labels.push("腾跃");
    }
    ctx.fillStyle = "rgba(237, 243, 255, 0.92)";
    ctx.font = "bold 13px Microsoft YaHei";
    ctx.fillText(labels.join(" | "), drawX + player.w / 2, drawY + player.h + 36);
  }
}

function drawPlayerSilhouette(player, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = player.side === "p1" ? "#4cc9f0" : "#ff758f";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.restore();
}

function drawBoss(boss, now) {
  const image = getImage(boss.data.sprite);
  ctx.save();
  ctx.translate(boss.x + boss.w / 2, boss.y + boss.h / 2);
  ctx.rotate(Math.sin(now * 2.5) * 0.05);
  ctx.filter = "hue-rotate(36deg) saturate(1.18)";
  if (image) {
    drawImageContain(image, -boss.w / 2, -boss.h / 2, boss.w, boss.h, "bottom");
  } else {
    ctx.fillStyle = "#ffcc33";
    ctx.fillRect(-boss.w / 2, -boss.h / 2, boss.w, boss.h);
  }
  ctx.filter = "none";
  ctx.restore();

  ctx.fillStyle = "rgba(8, 14, 20, 0.72)";
  ctx.fillRect(boss.x + 10, boss.y - 14, boss.w - 20, 7);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(boss.x + 10, boss.y - 14, (boss.w - 20) * clamp(boss.hp / boss.maxHp, 0, 1), 7);

  ctx.fillStyle = "#ffe8b6";
  ctx.font = "bold 14px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText("Boss", boss.x + boss.w / 2, boss.y + boss.h + 18);

  const poisonCount = clamp(
    boss.poisonStacks?.filter((expireAt) => expireAt > game.now).length ?? 0,
    0,
    NEGATIVE_LAYER_CAP
  );
  if (poisonCount > 0 || game.now < (boss.vulnerableUntil ?? 0)) {
    ctx.fillStyle = "rgba(201, 255, 180, 0.96)";
    ctx.font = "bold 13px Microsoft YaHei";
    const labels = [];
    if (poisonCount > 0) {
      labels.push(`中毒 x${poisonCount}`);
    }
    if (game.now < (boss.vulnerableUntil ?? 0)) {
      labels.push(`易伤 +${boss.vulnerableBonus ?? 2}`);
    }
    ctx.fillText(labels.join(" | "), boss.x + boss.w / 2, boss.y + boss.h + 36);
  }
}

function drawProjectile(projectile) {
  const image = getImage(projectile.icon);
  const size = projectile.radius * 2;
  ctx.save();
  ctx.translate(projectile.x, projectile.y);
  ctx.rotate(projectile.spin);
  if (image) {
    ctx.drawImage(image, -projectile.radius, -projectile.radius, size, size);
  } else {
    ctx.fillStyle = projectile.sourceType === "boss" ? "#ffd166" : "#66e2ff";
    ctx.beginPath();
    ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWebZones(now) {
  const activeZones = game.webZones.filter((zone) => now < zone.expiresAt);
  if (activeZones.length === 0) {
    return;
  }

  ctx.save();
  for (const zone of activeZones) {
    const lifeRate = clamp((zone.expiresAt - now) / Math.max(0.01, zone.expiresAt - zone.createdAt), 0, 1);
    const alpha = 0.18 + lifeRate * 0.12;
    const gradient = ctx.createRadialGradient(zone.x, zone.y, zone.radius * 0.18, zone.x, zone.y, zone.radius);
    gradient.addColorStop(0, `rgba(218, 231, 255, ${(alpha + 0.12).toFixed(3)})`);
    gradient.addColorStop(0.58, `rgba(124, 154, 214, ${alpha.toFixed(3)})`);
    gradient.addColorStop(1, "rgba(57, 82, 125, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(232, 242, 255, ${(0.32 + lifeRate * 0.12).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius * 0.92, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 6; i += 1) {
      const angle = now * 1.35 + zone.createdAt * 0.7 + i * (Math.PI / 3);
      const inner = zone.radius * 0.26;
      const outer = zone.radius * 0.88;
      ctx.strokeStyle = `rgba(243, 248, 255, ${(0.2 + i * 0.02).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(zone.x + Math.cos(angle) * inner, zone.y + Math.sin(angle) * inner);
      ctx.lineTo(zone.x + Math.cos(angle) * outer, zone.y + Math.sin(angle) * outer);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawHealingTotems(now) {
  const activeTotems = game.healingTotems.filter((totem) => now < totem.expiresAt);
  if (activeTotems.length === 0) {
    return;
  }

  ctx.save();
  for (const totem of activeTotems) {
    const lifeRate = clamp((totem.expiresAt - now) / HEALING_TOTEM_DURATION, 0, 1);
    const alpha = 0.18 + lifeRate * 0.18;
    const gradient = ctx.createRadialGradient(totem.x, totem.y, totem.radius * 0.18, totem.x, totem.y, totem.radius);
    gradient.addColorStop(0, `rgba(188, 255, 190, ${(alpha + 0.16).toFixed(3)})`);
    gradient.addColorStop(0.58, `rgba(97, 201, 112, ${alpha.toFixed(3)})`);
    gradient.addColorStop(1, "rgba(60, 140, 78, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(totem.x, totem.y, totem.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(232, 255, 234, ${(0.32 + lifeRate * 0.14).toFixed(3)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(totem.x, totem.y, totem.radius * 0.88, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(129, 214, 142, 0.92)";
    ctx.beginPath();
    ctx.moveTo(totem.x, totem.y - 28);
    ctx.lineTo(totem.x - 18, totem.y + 8);
    ctx.lineTo(totem.x + 18, totem.y + 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(121, 79, 46, 0.92)";
    ctx.fillRect(totem.x - 4, totem.y + 8, 8, 22);
  }
  ctx.restore();
}

function drawSandstorms(now) {
  const active = game.sandstorms.filter((storm) => now < storm.expiresAt);
  if (active.length === 0) {
    return;
  }

  const veil = clamp(0.24 + active.length * 0.08, 0.24, 0.58);
  ctx.save();
  ctx.fillStyle = `rgba(194, 155, 102, ${veil.toFixed(3)})`;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const storm of active) {
    const lifeRate = clamp((storm.expiresAt - now) / (storm.duration || 6), 0, 1);
    for (let i = 0; i < 12; i += 1) {
      const angle = storm.phase + now * 0.9 + i * 0.54;
      const dist = 40 + ((i * 47) % (storm.radius - 20));
      const x = storm.x + Math.cos(angle) * dist;
      const y = storm.y + Math.sin(angle * 1.2) * dist * 0.6;
      ctx.globalAlpha = 0.16 * lifeRate;
      ctx.fillStyle = "#ead8b0";
      ctx.beginPath();
      ctx.arc(x, y, 12 + (i % 3) * 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawHitboxes() {
  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.lineWidth = 2;

  for (const player of game.players) {
    const circle = getEntityHitCircle(player);
    ctx.strokeStyle = player.side === "p1" ? "rgba(76, 201, 240, 0.95)" : "rgba(255, 117, 143, 0.95)";
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (game.boss && game.mode === MODE.PVE) {
    const circle = getEntityHitCircle(game.boss);
    ctx.strokeStyle = "rgba(255, 209, 102, 0.95)";
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

function drawImageCover(image, x, y, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  const dx = x + (width - drawW) / 2;
  const dy = y + (height - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
}

function drawImageContain(image, x, y, width, height, align = "center") {
  const rect = getContainRect(width, height, image.width, image.height, align);
  ctx.drawImage(image, x + rect.x, y + rect.y, rect.w, rect.h);
}

function isPressed(code) {
  return justPressed.has(code);
}

function approach(current, target, delta) {
  if (current < target) {
    return Math.min(target, current + delta);
  }
  if (current > target) {
    return Math.max(target, current - delta);
  }
  return current;
}

function getEntityHitCircle(entity) {
  const visualRect = getEntityVisualRect(entity);
  const scale = entity.hitScale ?? 0.46;
  return {
    x: visualRect.x + visualRect.w / 2,
    y: visualRect.y + visualRect.h / 2,
    radius: Math.max(8, Math.min(visualRect.w, visualRect.h) * scale)
  };
}

function getEntityVisualRect(entity) {
  let image = null;
  let align = "center";

  if (entity.id === "BOSS" && entity.data) {
    image = getImage(entity.data.sprite);
    align = "bottom";
  } else if (entity.side) {
    const spritePath = entity.side === "p1" ? entity.character.sprite.p1 : entity.character.sprite.p2;
    image = getImage(spritePath);
    align = "bottom";
  }

  if (!image) {
    return { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
  }

  const rect = getContainRect(entity.w, entity.h, image.width, image.height, align);
  return {
    x: entity.x + rect.x,
    y: entity.y + rect.y,
    w: rect.w,
    h: rect.h
  };
}

function getContainRect(width, height, sourceWidth, sourceHeight, align = "center") {
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale;
  const h = sourceHeight * scale;
  const x = (width - w) / 2;
  const y = align === "bottom" ? height - h : (height - h) / 2;
  return { x, y, w, h };
}

function entitiesOverlap(a, b) {
  const ca = getEntityHitCircle(a);
  const cb = getEntityHitCircle(b);
  const d = distance(ca.x, ca.y, cb.x, cb.y);
  return d <= ca.radius + cb.radius;
}

function projectileHitsEntity(projectile, entity) {
  const circle = getEntityHitCircle(entity);
  const d = distance(projectile.x, projectile.y, circle.x, circle.y);
  return d <= projectile.radius + circle.radius;
}

function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.hypot(dx, dy);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function pickRandom(list) {
  if (!list || list.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function formatMultiplier(value) {
  return `${value.toFixed(2)}x`;
}

function getCharacterHue(characterId) {
  if (characterId === "chi-yan") {
    return 52;
  }
  if (characterId === "burning-blade") {
    return 184;
  }
  if (characterId === "ling-mu") {
    return 118;
  }
  if (characterId === "shadow-ninja") {
    return 212;
  }
  return 0;
}

function getCharacterSkillPanelText(characterOrPlayer) {
  const player = characterOrPlayer?.character ? characterOrPlayer : null;
  const character = player?.character ?? characterOrPlayer;
  const skill = player?.runtimeCharacterSkill ?? character?.characterSkill;
  if (!skill) {
    return "无";
  }
  if (skill.type === "wind-mark") {
    const cooldown = skill.cooldown ?? 6;
    const damage = skill.aoeDamage ?? 2;
    return `风印瞬移/落点小范围${damage}伤害（冷却${cooldown}s）`;
  }
  if (skill.type === "flame-curtain") {
    return `长按蓄力${skill.chargeSeconds ?? 3}s，成功后前方全域${skill.damage ?? 15}伤害（冷却${skill.cooldown ?? 6}s）`;
  }
  if (skill.type === "burning-blade") {
    const hpRatio = Math.round((skill.selfHpRatio ?? 0.5) * 100);
    const damageRatio = Math.round((skill.bladeDamageHpRatio ?? 0.05) * 100);
    return `设为${hpRatio}%生命并高跃，落地后向上/左右射出三道风刃，命中敌人或碰到边界才消失，每道造成上限${damageRatio}%伤害（冷却${skill.cooldown ?? 20}s）`;
  }
  if (skill.type === "verdant-revival") {
    const charges = player?.lingmuRevivesRemaining ?? (player?.characterConstellationLevel >= 6 ? 2 : 1);
    return `被动：濒死复苏20%生命并眩晕敌方3s（剩余${charges}次）`;
  }
  if (skill.type === "shadow-cloak") {
    return `隐身${skill.duration ?? 1.5}s并免疫非附加伤害（冷却${skill.cooldown ?? 6}s）`;
  }
  return "无";
}

preloadAssets().then(init);
