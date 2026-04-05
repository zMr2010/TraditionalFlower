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
  showAuthorsButton: document.getElementById("showAuthorsButton"),
  showDonateButton: document.getElementById("showDonateButton"),
  startOverlay: document.getElementById("startOverlay"),
  startOverlayTitle: document.getElementById("startOverlayTitle"),
  startOverlayText: document.getElementById("startOverlayText"),
  startOverlayImage: document.getElementById("startOverlayImage"),
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
  p1WeaponCdText: document.getElementById("p1WeaponCdText"),
  p2WeaponCdText: document.getElementById("p2WeaponCdText"),
  p1CharacterCdText: document.getElementById("p1CharacterCdText"),
  p2CharacterCdText: document.getElementById("p2CharacterCdText"),
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
    speedBuffUntil: 0,
    speedDebuffUntil: 0,
    permanentSlowPct: 0,
    poisonStacks: [],
    poisonTickAt: 0,
    webZoneId: null,
    webSlowMultiplier: 1,
    jumpLocked: false,
    maxJumps: 1,
    jumpCount: 0,
    dashDamageMultiplier: 1,
    dashKnockbackMultiplier: 1,
    stunnedUntil: 0,
    weaponSkillReadyAt: 0,
    characterSkillReadyAt: 0,
    dashUntil: 0,
    dashRecoverAt: 0,
    dashCooldownUntil: 0,
    dashRecoveryPending: false,
    dashHitMarks: new Set(),
    windMark: null,
    chiyanCharge: {
      active: false,
      startedAt: 0,
      breakAccum: 0
    },
    lingmuReviveUsed: false,
    invisibleUntil: 0,
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

function getJumpVelocity() {
  const gravity = GAME_DATA.tuning.gravity;
  const jumpHeight = HEIGHT * GAME_DATA.tuning.jumpHeightRatio;
  return Math.sqrt(2 * gravity * jumpHeight);
}

function preloadAssets() {
  const allSources = new Set([
    ...GAME_DATA.backgrounds,
    GAME_DATA.portals.pvp,
    GAME_DATA.portals.pve,
    DONATE_IMAGE_PATH
  ]);

  for (const character of GAME_DATA.characters) {
    allSources.add(character.sprite.p1);
    allSources.add(character.sprite.p2);
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

function init() {
  game.players = [
    createPlayer("p1", WIDTH * 0.43),
    createPlayer("p2", WIDTH * 0.57)
  ];
  bindInput();
  bindUi();
  resetToStart();
  requestAnimationFrame(loop);
}

function bindInput() {
  const preventKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"]);
  window.addEventListener("keydown", (event) => {
    if (event.code === "F12") {
      event.preventDefault();
      event.stopPropagation();
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

  window.addEventListener("blur", () => {
    keysDown.clear();
    justPressed.clear();
  });
}

function bindUi() {
  ui.confirmButton.addEventListener("click", confirmSelection);
  ui.restartButton.addEventListener("click", resetToStart);

  ui.startMenuButton.addEventListener("click", () => {
    if (game.phase !== PHASE.START) {
      return;
    }
    ui.startMenuPanel.classList.toggle("hidden");
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
  refreshWebZoneEffects(now);

  const p1 = game.players[0];
  const p2 = game.players[1];
  updatePlayerMovement(p1, dt, now, true);
  updatePlayerMovement(p2, dt, now, true);
  refreshWebZoneEffects(now);

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
      : "PvP：Y/P投降，J/小键盘1冲撞，K/小键盘2武器，S/下键角色技能";
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
  ui.startOverlayTitle.textContent = "作者名单";
  ui.startOverlayText.innerHTML = AUTHOR_NAMES
    .map((name, index) => `${index + 1}. ${name}`)
    .join("<br>");
  ui.startOverlayImage.classList.add("hidden");
  ui.startOverlayImage.removeAttribute("src");
  ui.startOverlay.classList.remove("hidden");
}

function showDonateOverlay() {
  if (game.phase !== PHASE.START) {
    return;
  }
  ui.startMenuPanel.classList.add("hidden");
  ui.startOverlayTitle.textContent = "打赏支持";
  ui.startOverlayText.innerHTML = "感谢支持项目开发与迭代。<br>请使用微信扫码。";
  ui.startOverlayImage.src = DONATE_IMAGE_PATH;
  ui.startOverlayImage.classList.remove("hidden");
  ui.startOverlay.classList.remove("hidden");
}

function closeStartOverlay() {
  ui.startOverlay.classList.add("hidden");
}

function setStartMenuVisible(visible) {
  ui.startMenuButton.classList.toggle("hidden", !visible);
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
  const p1SkillText = getCharacterSkillPanelText(p1.character);
  const p2SkillText = getCharacterSkillPanelText(p2.character);
  ui.battleInfoTitle.textContent = "本局角色与武器说明";
  ui.battleInfoP1Character.textContent = `角色：${p1.character.name}（生命 ${p1.maxHp}，移速倍率 ${formatMultiplier(p1.baseMoveSpeedMultiplier)}）｜技能：${p1SkillText}`;
  ui.battleInfoP1Weapon.textContent = `武器：${p1.weapon.name} - ${p1.weapon.description}`;
  ui.battleInfoP2Character.textContent = `角色：${p2.character.name}（生命 ${p2.maxHp}，移速倍率 ${formatMultiplier(p2.baseMoveSpeedMultiplier)}）｜技能：${p2SkillText}`;
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
  const canAct = !isStunned && player.hp > 0;
  const moveSpeed = getEffectiveMoveSpeed(player, now);

  if (isCharging) {
    player.vx = approach(player.vx, 0, tuning.friction * dt * 1.2);
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

    const canJump = player.onGround || player.jumpCount < player.maxJumps;
    if (isPressed(player.controls.jump) && canJump && !player.jumpLocked) {
      const wasOnGround = player.onGround;
      player.vy = -getJumpVelocity();
      player.onGround = false;
      if (wasOnGround) {
        player.jumpCount = 1;
      } else {
        player.jumpCount += 1;
      }
    }

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
  } else if (player.dashRecoveryPending && now >= player.dashRecoverAt) {
    player.dashRecoveryPending = false;
    player.stunnedUntil = Math.max(player.stunnedUntil, now + tuning.dashSelfStun);
    showTip(`${player.id} 冲撞后进入眩晕`);
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
  } else {
    player.onGround = false;
  }
}

function tryDash(player, now) {
  const tuning = GAME_DATA.tuning;
  if (player.chiyanCharge?.active) {
    return;
  }
  if (now < player.dashCooldownUntil || now < player.stunnedUntil || player.hp <= 0) {
    return;
  }
  player.dashUntil = now + tuning.dashDuration;
  player.dashRecoverAt = player.dashUntil;
  player.dashRecoveryPending = true;
  player.dashCooldownUntil = now + tuning.dashCooldown;
  player.dashHitMarks.clear();
}

function tryCastWeaponSkill(player, now) {
  if (player.chiyanCharge?.active) {
    return;
  }
  if (now < player.weaponSkillReadyAt || now < player.stunnedUntil || player.hp <= 0) {
    return;
  }
  const weapon = player.weapon || GAME_DATA.weapons[0];
  const skill = weapon.skill ?? weapon.bullet;
  if (!skill) {
    return;
  }
  player.weaponSkillReadyAt = now + skill.cooldown;

  if (skill.type === "heavy-drop") {
    castHeavyDropSkill(player, weapon, skill);
    return;
  }
  spawnForwardSkillProjectile(player, weapon, skill);
}

function getCharacterSkillConfig(player) {
  return player.character?.characterSkill ?? null;
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
    if (!canAct) {
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
  const breakNeed = skill.breakKnockback ?? 3;
  const normalized = Math.max(0, knockbackMultiplier);
  player.chiyanCharge.breakAccum += normalized;
  if (player.chiyanCharge.breakAccum > breakNeed) {
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

  if (skill.type === "shadow-cloak") {
    player.invisibleUntil = Math.max(player.invisibleUntil, now + (skill.duration ?? 1.5));
    player.characterSkillReadyAt = now + (skill.cooldown ?? 6);
    showTip(`${player.id} 进入隐身`);
  }
}

function castQingLanWindSkill(player, skill, now) {
  const existingMark = player.windMark;
  const cooldown = skill.cooldown ?? 6;
  const damage = skill.aoeDamage ?? 2;
  const radius = skill.aoeRadius ?? 82;

  if (!existingMark) {
    player.windMark = createWindMark(player, skill, now);
    player.characterSkillReadyAt = now + cooldown;
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

  for (const target of getEnemyUnits(player)) {
    if (!target || target.hp <= 0) {
      continue;
    }
    const targetCircle = getEntityHitCircle(target);
    const inRange = distance(existingMark.x, existingMark.y, targetCircle.x, targetCircle.y) <= radius + targetCircle.radius;
    if (!inRange) {
      continue;
    }
    if (target.id === "BOSS") {
      target.hp = Math.max(0, target.hp - damage);
      target.vx += player.facing * 180;
      target.stunnedUntil = Math.max(target.stunnedUntil ?? 0, now + 0.16);
    } else {
      applyHitToPlayer(target, damage, 0.16, player.facing * 180, 1);
    }
  }

  player.windMark = null;
  player.characterSkillReadyAt = now + cooldown;
  showTip(`${player.id} 借风印引渡`);
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
    if (target.id === "BOSS") {
      target.hp = Math.max(0, target.hp - (skill.damage ?? 7));
      target.vx += player.facing * 300;
      target.stunnedUntil = Math.max(target.stunnedUntil ?? 0, now + 0.32);
    } else {
      applyHitToPlayer(target, skill.damage ?? 7, 0.32, player.facing * 280, 1);
    }
  }

  showTip(`${player.id} 释放火幕`);
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
  if (bossStunned) {
    boss.vx = approach(boss.vx, 0, GAME_DATA.tuning.friction * dt * 0.8);
  } else {
    boss.vx = approach(
      boss.vx,
      direction * bossData.moveSpeed * bossSpeedDebuff,
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
          applyHitToPlayer(player, 4, 0.2, boss.facing * 220, 1);
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
  const damage = Math.max(1, Math.round(GAME_DATA.tuning.dashDamage * (attacker.dashDamageMultiplier ?? 1)));
  const knockback = attacker.facing * 330 * (attacker.dashKnockbackMultiplier ?? 1);
  applyHitToPlayer(defender, damage, 0.32, knockback, attacker.dashKnockbackMultiplier ?? 1);
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
  const damage = Math.max(1, Math.round(GAME_DATA.tuning.dashDamage * (attacker.dashDamageMultiplier ?? 1)));
  const knockback = attacker.facing * 260 * (attacker.dashKnockbackMultiplier ?? 1);
  boss.hp = Math.max(0, boss.hp - damage);
  boss.vx += knockback;
}

function isShadowCloakActive(player, now = game.now) {
  if (!player || player.hp <= 0) {
    return false;
  }
  return player.character?.id === "shadow-ninja" && now < (player.invisibleUntil ?? 0);
}

function applyHitToPlayer(player, damage, stun, knockbackX, knockbackMultiplier = 1) {
  if (!player || player.hp <= 0) {
    return false;
  }
  if (isShadowCloakActive(player)) {
    return false;
  }
  player.hp = Math.max(0, player.hp - damage);
  player.vx += knockbackX;
  player.stunnedUntil = Math.max(player.stunnedUntil, game.now + stun);
  addChiyanChargeKnockback(player, knockbackMultiplier);
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
  if (player.lingmuReviveUsed) {
    return false;
  }

  player.lingmuReviveUsed = true;
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
  applyHitToPlayer(
    target,
    projectile.damage ?? 0,
    projectile.stun ?? 0,
    knockback,
    projectile.knockbackMultiplier ?? 1
  );

  if (projectile.effectType === "web") {
    spawnWebZone(target, projectile.x, projectile.y, projectile.webTrapRadius ?? 92, projectile.owner);
    showTip(`${target.id} 陷入缓行咒区域`);
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

  boss.hp = Math.max(0, boss.hp - (projectile.damage ?? 0));
  boss.vx += Math.sign(projectile.vx || 0) * 180;
}

function spawnWebZone(target, x, y, radius, ownerId) {
  const web = GAME_DATA.effects.web;
  game.webZones.push({
    id: `web-${Math.random().toString(36).slice(2, 10)}`,
    x,
    y,
    radius,
    targetId: target.id,
    ownerId,
    slowMultiplier: web.moveMultiplier,
    permanentSlowPct: web.permanentSlowPct,
    touching: false,
    consumed: false,
    expiresAt: Number.POSITIVE_INFINITY
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

function updateTimedEffects(now) {
  game.sandstorms = game.sandstorms.filter((storm) => now < storm.expiresAt);
  game.webZones = game.webZones.filter((zone) => !zone.consumed || now < zone.expiresAt);
  game.fireCurtains = game.fireCurtains.filter((effect) => now < effect.expiresAt);

  for (const player of game.players) {
    if (player.hp <= 0) {
      player.windMark = null;
      cancelChiyanCharge(player, false);
    }
    tickPoisonDamage(player, now);
  }
  if (game.boss) {
    tickPoisonDamage(game.boss, now);
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
    const damage = target.poisonStacks.length * sand.poisonDamagePerStack;
    target.hp = Math.max(0, target.hp - damage);
    if (target.side) {
      tryTriggerLingmuRevive(target);
    }
    target.poisonTickAt += sand.poisonTickInterval;
  }
}

function refreshWebZoneEffects(now) {
  for (const player of game.players) {
    player.webSlowMultiplier = 1;
    player.jumpLocked = false;
    const zones = game.webZones.filter((zone) => !zone.consumed && zone.targetId === player.id);

    if (player.hp <= 0) {
      for (const zone of zones) {
        zone.consumed = true;
        zone.touching = false;
        zone.expiresAt = now + 0.15;
      }
      player.webZoneId = null;
      continue;
    }

    const circle = getEntityHitCircle(player);
    let inAnyZone = false;
    let slowMultiplier = 1;
    let leftCount = 0;
    let totalPermanentSlow = 0;

    for (const zone of zones) {
      const isInside = distance(zone.x, zone.y, circle.x, circle.y) <= zone.radius;
      if (isInside) {
        inAnyZone = true;
        zone.touching = true;
        slowMultiplier = Math.min(slowMultiplier, zone.slowMultiplier);
        continue;
      }

      if (zone.touching) {
        zone.touching = false;
        zone.consumed = true;
        zone.expiresAt = now + 0.15;
        leftCount += 1;
        totalPermanentSlow += zone.permanentSlowPct;
      }
    }

    if (leftCount > 0) {
      const maxPermanentSlow = (GAME_DATA.effects.web.permanentSlowPct || 0.05) * NEGATIVE_LAYER_CAP;
      player.permanentSlowPct = clamp(player.permanentSlowPct + totalPermanentSlow, 0, maxPermanentSlow);
      showTip(`${player.id} 离开缓行咒：永久移速 -${Math.round(totalPermanentSlow * 100)}%`);
    }

    player.webSlowMultiplier = inAnyZone ? slowMultiplier : 1;
    player.jumpLocked = inAnyZone;
  }
}

function getEffectiveMoveSpeed(player, now) {
  let speed = GAME_DATA.tuning.moveSpeed * (player.baseMoveSpeedMultiplier ?? 1);
  speed *= 1 - (player.permanentSlowPct ?? 0);
  if (now < (player.speedBuffUntil ?? 0)) {
    speed *= GAME_DATA.effects.sand.speedBuffMultiplier;
  }
  if (now < (player.speedDebuffUntil ?? 0)) {
    speed *= GAME_DATA.effects.sand.speedDebuffMultiplier;
  }
  speed *= player.webSlowMultiplier ?? 1;
  return Math.max(120, speed);
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
  renderNegativeStatusRow(p1, ui.p1StatusRow, game.now);
  updatePlayerSkillHud(
    p2,
    ui.p2WeaponCdFill,
    ui.p2WeaponCdText,
    ui.p2CharacterCdFill,
    ui.p2CharacterCdText
  );
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
  const weaponCooldown = weaponSkill?.cooldown ?? 0;
  const weaponState = getCooldownState(player.weaponSkillReadyAt, weaponCooldown, now);
  weaponFill.style.width = `${(weaponState.progress * 100).toFixed(1)}%`;
  weaponText.textContent = weaponState.remaining > 0
    ? `武器: ${weaponState.remaining.toFixed(1)}s`
    : "武器: 就绪";

  const characterSkill = getCharacterSkillConfig(player);
  if (!characterSkill) {
    characterFill.style.width = "100%";
    characterText.textContent = "角色: 无";
    return;
  }

  if (characterSkill.passive) {
    const ready = player.lingmuReviveUsed ? 0 : 1;
    characterFill.style.width = `${(ready * 100).toFixed(1)}%`;
    characterText.textContent = player.lingmuReviveUsed ? "角色: 被动已触发" : "角色: 被动待命";
    return;
  }

  if (characterSkill.type === "flame-curtain" && player.chiyanCharge?.active) {
    const chargeNeed = characterSkill.chargeSeconds ?? 3;
    const chargeProgress = clamp((now - player.chiyanCharge.startedAt) / chargeNeed, 0, 1);
    characterFill.style.width = `${(chargeProgress * 100).toFixed(1)}%`;
    characterText.textContent = `角色: 蓄力 ${Math.round(chargeProgress * 100)}%`;
    return;
  }

  const characterCooldown = characterSkill.cooldown ?? 0;
  const characterState = getCooldownState(player.characterSkillReadyAt, characterCooldown, now);
  characterFill.style.width = `${(characterState.progress * 100).toFixed(1)}%`;
  characterText.textContent = characterState.remaining > 0
    ? `角色: ${characterState.remaining.toFixed(1)}s`
    : "角色: 就绪";
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

  const perLayer = GAME_DATA.effects.web.permanentSlowPct || 0.05;
  const permanentSlowLayers = clamp(
    Math.round((player.permanentSlowPct ?? 0) / perLayer),
    0,
    NEGATIVE_LAYER_CAP
  );
  if (permanentSlowLayers > 0) {
    statuses.push({ symbol: "缓", layers: permanentSlowLayers, title: "永久减速" });
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

function preparePlayerForBattle(player) {
  player.maxHp = player.character?.baseHp ?? GAME_DATA.tuning.maxHp;
  player.hp = player.maxHp;
  player.baseMoveSpeedMultiplier = player.character?.moveSpeedMultiplier ?? 1;
  player.maxJumps = player.character?.maxJumps ?? 1;
  player.jumpCount = 0;
  player.dashDamageMultiplier = player.character?.dashDamageMultiplier ?? 1;
  player.dashKnockbackMultiplier = player.character?.dashKnockbackMultiplier ?? 1;
  player.speedBuffUntil = 0;
  player.speedDebuffUntil = 0;
  player.permanentSlowPct = 0;
  player.poisonStacks = [];
  player.poisonTickAt = 0;
  player.webZoneId = null;
  player.webSlowMultiplier = 1;
  player.jumpLocked = false;
  player.stunnedUntil = 0;
  player.weaponSkillReadyAt = 0;
  player.characterSkillReadyAt = 0;
  player.dashUntil = 0;
  player.dashRecoverAt = 0;
  player.dashRecoveryPending = false;
  player.dashHitMarks.clear();
  player.dashCooldownUntil = 0;
  player.windMark = null;
  player.chiyanCharge.active = false;
  player.chiyanCharge.startedAt = 0;
  player.chiyanCharge.breakAccum = 0;
  player.lingmuReviveUsed = false;
  player.invisibleUntil = 0;
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
  game.boss = null;
  game.portals = createPortals();
  game.backgroundTimer = 0;
  game.result.title = "";
  game.result.description = "";

  const p1 = game.players[0];
  const p2 = game.players[1];
  p1.hp = p1.maxHp;
  p2.hp = p2.maxHp;
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
  p1.stunnedUntil = 0;
  p2.stunnedUntil = 0;
  p1.maxHp = GAME_DATA.tuning.maxHp;
  p2.maxHp = GAME_DATA.tuning.maxHp;
  p1.baseMoveSpeedMultiplier = 1;
  p2.baseMoveSpeedMultiplier = 1;
  p1.maxJumps = 1;
  p2.maxJumps = 1;
  p1.jumpCount = 0;
  p2.jumpCount = 0;
  p1.dashDamageMultiplier = 1;
  p2.dashDamageMultiplier = 1;
  p1.dashKnockbackMultiplier = 1;
  p2.dashKnockbackMultiplier = 1;
  p1.speedBuffUntil = 0;
  p2.speedBuffUntil = 0;
  p1.speedDebuffUntil = 0;
  p2.speedDebuffUntil = 0;
  p1.permanentSlowPct = 0;
  p2.permanentSlowPct = 0;
  p1.poisonStacks = [];
  p2.poisonStacks = [];
  p1.poisonTickAt = 0;
  p2.poisonTickAt = 0;
  p1.webZoneId = null;
  p2.webZoneId = null;
  p1.webSlowMultiplier = 1;
  p2.webSlowMultiplier = 1;
  p1.jumpLocked = false;
  p2.jumpLocked = false;
  p1.weaponSkillReadyAt = 0;
  p2.weaponSkillReadyAt = 0;
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
  p1.lingmuReviveUsed = false;
  p2.lingmuReviveUsed = false;
  p1.invisibleUntil = 0;
  p2.invisibleUntil = 0;
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
  drawWebZones(now);
  drawFireCurtains(now);
  for (const projectile of game.projectiles) {
    drawProjectile(projectile);
  }
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

  if (invisible || player.chiyanCharge?.active) {
    const labels = [];
    if (invisible) {
      labels.push("隐身");
    }
    if (player.chiyanCharge?.active) {
      labels.push("蓄力");
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
  if (poisonCount > 0) {
    ctx.fillStyle = "rgba(201, 255, 180, 0.96)";
    ctx.font = "bold 13px Microsoft YaHei";
    ctx.fillText(`涓瘨 x${poisonCount}`, boss.x + boss.w / 2, boss.y + boss.h + 36);
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
  for (const zone of game.webZones) {
    if (zone.consumed || now >= zone.expiresAt) {
      continue;
    }
    const pulse = 0.75 + Math.sin(now * 6 + zone.x * 0.01) * 0.12;
    ctx.save();
    ctx.globalAlpha = 0.22 * pulse;
    ctx.fillStyle = "#7a8cff";
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.62 * pulse;
    ctx.strokeStyle = "#b4bdff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
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
  if (characterId === "ling-mu") {
    return 118;
  }
  if (characterId === "shadow-ninja") {
    return 212;
  }
  return 0;
}

function getCharacterSkillPanelText(character) {
  if (!character?.characterSkill) {
    return "无";
  }
  const skill = character.characterSkill;
  if (skill.type === "wind-mark") {
    return "风印瞬移/落点小范围2伤害（冷却6s）";
  }
  if (skill.type === "flame-curtain") {
    return "长按蓄力3s，成功后前方全域7伤害（冷却6s）";
  }
  if (skill.type === "verdant-revival") {
    return "被动：濒死复苏20%生命并眩晕敌方3s（每局1次）";
  }
  if (skill.type === "shadow-cloak") {
    return "隐身1.5s并免疫非附加伤害（冷却6s）";
  }
  return "无";
}

preloadAssets().then(init);

