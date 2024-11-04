export const ranks = [
    '👶 Noob',
    '🏅 Citizen',
    '👼 Baby Wizard',
    '🧙‍♀️ Wizard Goddess',
    '🧙‍♂️ Wizard Lord',
    '🔴 Relic',
    '⚫ Relic II',
    '⚪ Relic III',
    '🔹 Ace',
    '🔸 Ace II',
    '🔷 Ace Dominator',
    '🔶️ Ace Master',
    '💠 Supreme',
    '💍 Supreme II',
    '💎 Supreme III',
    '🔮 Supreme Master',
    '👻 Ghost',
    '☠️ Ghost Return',
    '💀 Ghost Reborn',
    '🧚 Fairy',
    '🧚‍♂️ Fairy Rise',
    '🧜 Fairy Pass',
    '🧜‍♂️ Fairy End',
    '⚡ Lynx',
    '🥷 Hermit',
    '🗡 Butcher',
    '🐜 Wasp',
    '🧛‍♀️ Widow',
    '⛩ Shogun',
    '🐼 Panda',
    '🗿 Titan',
    '👹 Demon Lord',
    '❄️ Frost',
    '⛄ Frost Giant',
    '🌟 Legendary ',
    '⭐ Legendary II',
    '🦄 Hobbit',
    '🥀 Akureyri',
    '🛡 Guardian',
    '🏹 Guardian II',
    '⚔ Hercules',
    '🦇 Dracula',
    '🌑 Deja Vu',
    '🐲 Immortal'
]

export const getStats = (level: number): { requiredXpToLevelUp: number; rank: string } => {
    let required = 100
    for (let i = 1; i <= level; i++) required += 5 * (i * 50) + 100 * i * (i * (i + 1)) + 300
    const rank = level > ranks.length ? ranks[ranks.length - 1] : ranks[level - 1]
    return {
        requiredXpToLevelUp: required,
        rank
    }
}
