window.GAME_DATA = {
  backgrounds: [
    "Images/Background/1.jpg",
    "Images/Background/2.svg",
    "Images/Background/3.svg",
    "Images/Background/4.svg",
    "Images/Background/5.svg"
  ], 
  portals: {
    pvp: "Images/Portal/PVP.png",
    pve: "Images/Portal/PVE.svg"
  },
  characters: [
    {
      id: "qing-lan",
      name: "青岚行者", 
      sprite: {
        p1: "Images/Character/1p.svg",
        p2: "Images/Character/2P.svg"
      },
      description: "高机动角色，可在风印与当前位置间切换。",
      baseHp: 100,
      moveSpeedMultiplier: 1.24,
      characterSkill: {
        type: "wind-mark",
        cooldown: 6,
        aoeDamage: 2,
        aoeRadius: 82,
        hoverSeconds: 0.5
      },
      stats: {
        生命: 100,
        移速倍率: "1.24x",
        机动: 8,
        控场: 6,
        生存: 6
      }
    },
    {
      id: "chi-yan",
      name: "赤焰斗客",
      sprite: {
        p1: "Images/Character/1p.svg",
        p2: "Images/Character/2P.svg"
      },
      description: "可长按蓄力释放火幕，蓄力期间会被击退打断。",
      baseHp: 100,
      moveSpeedMultiplier: 0.82,
      characterSkill: {
        type: "flame-curtain",
        cooldown: 6,
        chargeSeconds: 3,
        breakKnockback: 4,
        damage: 15,
        effectSeconds: 0.42
      },
      stats: {
        生命: 100,
        移速倍率: "0.82x",
        机动: 6,
        控场: 5,
        生存: 6
      }
    },
    {
      id: "ling-mu",
      name: "灵木守望",
      sprite: {
        p1: "Images/Character/1p.svg",
        p2: "Images/Character/2P.svg"
      },
      description: "高生命防守角色，带一次复苏反制。",
      baseHp: 120,
      moveSpeedMultiplier: 0.9,
      characterSkill: {
        type: "verdant-revival",
        passive: true,
        reviveHpRatio: 0.2,
        stunSeconds: 3
      },
      stats: {
        生命: 120,
        移速倍率: "0.90x",
        机动: 4,
        控场: 7,
        生存: 9
      }
    },
    {
      id: "shadow-ninja",
      name: "夜影忍者",
      sprite: {
        p1: "Images/Character/1p.svg",
        p2: "Images/Character/2P.svg"
      },
      description: "可二段跳，冲撞偏弱，具备短时隐身免伤。",
      baseHp: 95,
      moveSpeedMultiplier: 1.14,
      characterSkill: {
        type: "shadow-cloak",
        cooldown: 6,
        duration: 1.5,
        alpha: 0.5
      },
      maxJumps: 2,
      dashDamageMultiplier: 0.6,
      dashKnockbackMultiplier: 0.65,
      stats: {
        生命: 95,
        移速倍率: "1.14x",
        跳跃: "二段跳",
        冲撞效果: "较弱"
      }
    }
  ],
  weapons: [
    {
      id: "chaos-orb",
      name: "混沌宝珠",
      icon: "Images/Weapon/basic.svg",
      description: "向面向方向发射基础混沌宝珠，弹道稳定。",
      stats: {
        冷却: "1 秒",
        伤害: "3",
        控制: "无眩晕"
      },
      skill: {
        type: "projectile",
        speed: 760,
        damage: 3,
        stun: 0,
        cooldown: 1,
        radius: 15,
        life: 3.5,
        spinSpeed: 9
      }
    },
    {
      id: "chaos-orb-swift",
      name: "混沌宝珠·疾",
      icon: "Images/Weapon/basic.svg",
      description: "更快的弹道，伤害略低，适合追击移动目标。",
      stats: {
        冷却: "0.9 秒",
        伤害: "2",
        控制: "无眩晕"
      },
      skill: {
        type: "projectile",
        speed: 920,
        damage: 2,
        stun: 0,
        cooldown: 0.9,
        radius: 14,
        life: 3.2,
        spinSpeed: 12
      }
    },
    {
      id: "chaos-orb-heavy",
      name: "混沌宝珠·重",
      icon: "Images/Weapon/basic.svg",
      description: "飞行较慢但命中反馈更强。",
      stats: {
        冷却: "1.2 秒",
        伤害: "5",
        控制: "眩晕 0.6 秒"
      },
      skill: {
        type: "projectile",
        speed: 620,
        damage: 5,
        stun: 0.6,
        cooldown: 1.2,
        radius: 18,
        life: 3.8,
        spinSpeed: 7
      }
    },
    {
      id: "wind-blade",
      name: "追风刃",
      icon: "Images/Weapon/wing.svg",
      description: "高速旋转的飞刃，弹道快，伤害高。",
      stats: {
        冷却: "1 秒",
        伤害: "5",
        控制: "无眩晕",
        特性: "高速自转与快弹道"
      },
      skill: {
        type: "projectile",
        speed: 1080,
        damage: 5,
        stun: 0,
        cooldown: 1,
        radius: 13,
        life: 2.6,
        spinSpeed: 22
      }
    },
    {
      id: "blood-fang",
      name: "饮血牙",
      icon: "Images/Weapon/fang.svg",
      description: "命中造成伤害，并在吸血冷却结束时回复持有者生命，飞行时不旋转。",
      stats: {
        冷却: "1 秒",
        伤害: "4",
        控制: "无眩晕",
        特性: "命中回复 2 点生命，回血效果每 3 秒触发一次"
      },
      skill: {
        type: "fang",
        speed: 780,
        damage: 4,
        stun: 0,
        cooldown: 1,
        radius: 15,
        life: 3.1,
        spinSpeed: 0,
        healOnHit: 2,
        healCooldown: 3
      }
    },
    {
      id: "kunpeng-dust",
      name: "鲲鹏尘",
      icon: "Images/Weapon/dust.svg",
      description: "每4秒生成一枚鲲鹏尘环绕自身，武器键可发射一枚，环绕或命中都可造成伤害。",
      stats: {
        冷却: "无冷却",
        伤害: "2",
        特性: "每4秒生成1枚，环绕上限20，环绕碰撞或发射命中都可造成伤害"
      },
      skill: {
        type: "kunpeng-dust",
        speed: 920,
        damage: 2,
        stun: 0,
        cooldown: 0,
        radius: 11,
        life: 3.6,
        spinSpeed: 0,
        generationInterval: 4,
        maxOrbiting: 20,
        orbitSpeed: 1.9,
        orbitPadding: 4,
        orbitRadiusStep: 18,
        orbitRingSize: 8
      }
    },
    {
      id: "mountain-stone",
      name: "镇岳石",
      icon: "Images/Weapon/heavy.svg",
      description: "可空中释放，角色获得上跃并在原位下砸花瓣。",
      stats: {
        冷却: "1 秒",
        伤害: "5",
        控制: "眩晕 1 秒"
      },
      skill: {
        type: "heavy-drop",
        cooldown: 1,
        jumpBoostRatio: 0.72,
        dropSpeed: 860,
        gravity: 1800,
        damage: 5,
        stun: 1,
        radius: 22.5,
        life: 2.4,
        spinSpeed: 10
      }
    },
    {
      id: "sand-talisman",
      name: "飞沙符",
      icon: "Images/Weapon/sand.svg",
      description: "命中后附加中毒和沙尘满目，并强化己方机动。",
      stats: {
        冷却: "1 秒",
        中毒: "10 秒，每秒 1 点，可叠加",
        特性: "沙尘遮蔽 + 己方加速 + 敌方减速"
      },
      skill: {
        type: "sand",
        speed: 760,
        damage: 0,
        stun: 0,
        cooldown: 1,
        radius: 14,
        life: 3.2,
        spinSpeed: 14
      }
    },
    {
      id: "slow-curse",
      name: "缓行咒",
      icon: "Images/Weapon/web.svg",
      description: "命中后生成蛛网区域，目标离开区域时叠加“束缚”。",
      stats: {
        冷却: "1 秒",
        伤害: "3",
        特性: "离开蛛网区域时叠加束缚：6秒，移速-11%，最多5层"
      },
      skill: {
        type: "web",
        speed: 640,
        damage: 3,
        stun: 0,
        cooldown: 1,
        radius: 16,
        life: 3,
        spinSpeed: 8,
        trapRadius: 92
      }
    }
  ],
  bosses: [
    {
      id: "shadow-warden",
      name: "影渊守卫",
      sprite: "Images/Character/2P.svg",
      description: "均衡型 Boss，追击与远程压制都较稳定。",
      stats: {
        生命: 120,
        速度: "中",
        技能冷却: "2.3 秒"
      },
      hp: 120,
      moveSpeed: 210,
      projectile: {
        speed: 500,
        damage: 6,
        cooldown: 2.3,
        stun: 0.18
      }
    },
    {
      id: "storm-idol",
      name: "雷鸣神像",
      sprite: "Images/Character/2P.svg",
      description: "攻击频率高、弹道快，但血量偏低。",
      stats: {
        生命: 105,
        速度: "快",
        技能冷却: "1.9 秒"
      },
      hp: 105,
      moveSpeed: 240,
      projectile: {
        speed: 640,
        damage: 5,
        cooldown: 1.9,
        stun: 0.15
      }
    },
    {
      id: "ancient-sage",
      name: "古律贤者",
      sprite: "Images/Character/2P.svg",
      description: "慢速高血 Boss，控制强，容错更高。",
      stats: {
        生命: 145,
        速度: "慢",
        技能冷却: "2.8 秒"
      },
      hp: 145,
      moveSpeed: 170,
      projectile: {
        speed: 440,
        damage: 7,
        cooldown: 2.8,
        stun: 0.25
      }
    }
  ],
  effects: {
    sand: {
      poisonDuration: 10,
      poisonTickInterval: 1,
      poisonDamagePerStack: 1,
      speedBuffMultiplier: 1.2,
      speedDebuffMultiplier: 0.8,
      speedEffectDuration: 10,
      stormDuration: 10
    },
    web: {
      bindDuration: 6,
      bindMoveMultiplier: 0.89,
      zoneDuration: 6,
      zoneMoveMultiplier: 0.89,
      trapRadius: 92,
      lockJumpWhileInside: false
    }
  },
  tuning: {
    maxHp: 100,
    gravity: 2200,
    jumpHeightRatio: 0.3,
    groundHeightRatio: 0.86,
    moveSpeed: 360,
    accel: 2200,
    friction: 1800,
    dashSpeed: 960,
    dashDuration: 0.18,
    dashSelfStun: 0,
    dashDamage: 5,
    dashCooldown: 0,
    dashChargeMax: 3,
    dashChargeInterval: 3,
    portalRadius: 94,
    portalEntrySeconds: 2,
    portalSwitchSeconds: 5
  }
};
