
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
    // Specific: Will be used if found (Skills, Attacks, Misc. Abilities)




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

function getWeapon(traits) {
    const chosenWeapons = [...supportedWeapons].filter(item => traits.has(item));
    if (chosenWeapons.length === 1) {
        return chosenWeapons[0]
    }
    return null;
}

/**
 * @returns {Preset}
 */
function get(name) {
    return presets[name];
}

export const AzureCompendiaPresets = Object.freeze({
    get,
    getWeapon
})