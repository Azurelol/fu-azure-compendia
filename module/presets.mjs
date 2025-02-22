
// Uses: https://fantasycomputer.works/FoundryVTT-Sequencer/#/
/**
 * @property {String[]} animations
 * @property {String} sound
 * @property {Number} duration If set, the maximum duration
 */
class Preset {
    constructor(...animations) {
        this.animations = animations;
    }

    withSound(sound) {
        this.sound = sound;
        return this;
    }

    get animation() {
        const length = this.animations.length;
        if (length > 1) {
            const randomIndex = Math.floor(Math.random() * length);
            return this.animations[randomIndex];
        }
        return this.animations[0];
    }

    withDuration(duration) {
        this.duration = duration;
        return this;
    }
}

/**
 * @type {Object<String, Preset>}
 */
const presets = Object.freeze({
    // Damage Types
    ice: new Preset("jb2a.impact_themed.ice_shard.blue").withSound("fu-azure-compendia.sounds.damage.ice"),
    fire: new Preset("jb2a.cast_generic.fire.01.orange.0").withSound("fu-azure-compendia.sounds.damage.fire"),
    bolt: new Preset("jb2a.thunderwave.center.blue").withSound("fu-azure-compendia.sounds.damage.bolt"),
    earth: new Preset("jb2a.cast_generic.earth.01.browngreen.0").withSound("fu-azure-compendia.sounds.damage.earth"),
    dark: new Preset("jb2a.healing_generic.200px.purple").withSound("fu-azure-compendia.sounds.damage.dark"),
    light: new Preset("jb2a.twinkling_stars.points04.white").withSound("fu-azure-compendia.sounds.damage.light"),
    poison: new Preset("jb2a.energy_strands.in.green.01.0").withSound("fu-azure-compendia.sounds.damage.poison"),
    air: new Preset("jb2a.energy_strands.overlay.blue.01").withSound("fu-azure-compendia.sounds.damage.air"),
    physical: new Preset("jb2a.impact.007.yellow").withSound("fu-azure-compendia.sounds.damage.physical"),
    untyped: new Preset("jb2a.cast_generic.fire.01.orange.0"),
    // Resources    
    hp: new Preset("jb2a.healing_generic.200px.green").withSound("fu-azure-compendia.sounds.gain.hp"),
    mp: new Preset("jb2a.healing_generic.200px.blue").withSound("fu-azure-compendia.sounds.gain.mp"),
    // Weapons
    bow: new Preset("jb2a.arrow.physical.blue").withSound("fu-azure-compendia.sounds.weapon.bow"),
    sword: new Preset("jb2a.sword.melee").withSound("fu-azure-compendia.sounds.weapon.sword"),
    dagger: new Preset("jb2a.dagger.melee").withSound("fu-azure-compendia.sounds.weapon.dagger"),
    spear: new Preset("jb2a.spear").withSound("fu-azure-compendia.sounds.weapon.spear"),
    heavy: new Preset("jb2a.melee_attack.02.battleaxe").withSound("fu-azure-compendia.sounds.weapon.heavy"),
    brawling: new Preset("jb2a.unarmed_strike.physical").withSound("fu-azure-compendia.sounds.weapon.brawling"),
    thrown: new Preset("jb2a.dagger.throw").withSound("fu-azure-compendia.sounds.weapon.thrown"),
    firearm: new Preset("jb2a.bullet").withSound("fu-azure-compendia.sounds.weapon.firearm"),
    // Status
    shaken: new Preset("jb2a.icon.fear").withSound("fu-azure-compendia.sounds.status.shaken").withDuration(1.5),
    poisoned: new Preset("jb2a.icon.poison").withSound("fu-azure-compendia.sounds.status.poisoned").withDuration(1.5),
    dazed: new Preset("jb2a.icon.stun").withSound("fu-azure-compendia.sounds.status.dazed").withDuration(1.5),
    weak: new Preset("jb2a.icon.shield_cracked").withSound("fu-azure-compendia.sounds.status.weak").withDuration(1.5),
    enraged: new Preset("jb2a.icon.drop").withSound("fu-azure-compendia.sounds.status.enraged").withDuration(1.5),
    slow: new Preset("jb2a.icon.snowflake").withSound("fu-azure-compendia.sounds.status.slow").withDuration(1.5),
    // Default attack
    meleeAttack: new Preset('jb2a.melee_generic'),
    rangedAttack: new Preset('jb2a.ranged.03'),
    // Specific: Will be used if found (Skills, Attacks, Misc. Abilities)
    claw: new Preset('jb2a.claws'),
    bite: new Preset('jb2a.bite'),
    fist: new Preset('jb2a.melee_generic.creature_attack.fist'),
    pincer: new Preset('jb2a.melee_generic.creature_attack.pincer'),
    splash: new Preset('jb2a.water_splash'),
    // Action Animations
    spell: new Preset("jb2a.magic_signs.circle.02.conjuration.intro").withSound("fu-azure-compendia.sounds.action.spell").withDuration(2),
    // Spells
    fireAttack: new Preset('jb2a.scorching_ray'),

});

/**
 * @typedef {"arcane", "bow", "brawling", "dagger", "firearm", "flail", "heavy", "spear", "sword", "thrown", "custom"} WeaponCategory
 */

const supportedWeapons = new Set([
    "arcane",
    "bow",
    "brawling",
    "dagger",
    "firearm",
    "flail",
    "heavy",
    "spear",
    "sword",
    "thrown",
    "custom"
]);

const supportedAttacks = new Set([
    "claw",
    "bite",
    "fist",
    "pincer",
    "splash",
]);

/**
 * @returns {Preset}
 */
function resolveWeapon(traits) {
    const matches = [...supportedWeapons].filter(item => traits.has(item));
    if (matches.length === 1) {
        return get(matches[0])
    }
    return null;
}

const name_trait = "name:"

/**
 * @returns {Preset}
 */
function resolveAttack(traits) {
    const nameTrait = [...traits].find(value => value.startsWith(name_trait));
    if (nameTrait) {
        const name = nameTrait.replace(name_trait, "");
        for (const atk of supportedAttacks) {
            if (name.includes(atk)) {
                return get(atk);
            }
        }
    }
    if (traits.has("melee")) {
        return presets.meleeAttack;
    }
    else if (traits.has("ranged")) {
        return presets.rangedAttack;
    }
    return null;
}

/**
 * @returns {Preset}
 */
function resolveSpell(traits) {
    return presets.rangedAttack;
}

/**
 * @returns {Preset}
 */
function get(name) {
    return presets[name];
}

export const AzureCompendiaPresets = Object.freeze({
    get,
    resolveWeapon,
    resolveAttack,
    resolveSpell
})