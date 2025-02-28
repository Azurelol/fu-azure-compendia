
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

    withInternalSound(path) {
        this.sound = `fu-azure-compendia.sounds.${path}`
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

const effectLength = 1.5;

/**
 * @type {Object<String, Preset>}
 */
const presets = Object.freeze({
    // Damage Types
    ice: new Preset("jb2a.impact_themed.ice_shard.blue").withSound("fu-azure-compendia.sounds.damage.ice"),
    fire: new Preset("jb2a.cast_generic.fire.01.orange.0").withSound("fu-azure-compendia.sounds.damage.fire"),
    bolt: new Preset("jb2a.thunderwave.center.blue").withSound("fu-azure-compendia.sounds.damage.bolt"),
    earth: new Preset("jb2a.impact.ground_crack").withSound("fu-azure-compendia.sounds.damage.earth"),
    dark: new Preset("jb2a.smoke.puff.centered.grey").withSound("fu-azure-compendia.sounds.damage.dark"),
    light: new Preset("jb2a.twinkling_stars.points04.white").withSound("fu-azure-compendia.sounds.damage.light"),
    poison: new Preset("jb2a.energy_strands.in.green.01.0").withSound("fu-azure-compendia.sounds.damage.poison"),
    air: new Preset("jb2a.energy_strands.overlay.blue.01").withSound("fu-azure-compendia.sounds.damage.air"),
    physical: new Preset("jb2a.impact.007.yellow").withSound("fu-azure-compendia.sounds.damage.physical"),
    untyped: new Preset("jb2a.cast_generic.fire.01.orange.0"),

    // Resources    
    hp_gain: new Preset("jb2a.healing_generic.200px.green").withSound("fu-azure-compendia.sounds.gain.hp"),
    mp_gain: new Preset("jb2a.healing_generic.200px.blue").withSound("fu-azure-compendia.sounds.gain.mp"),
    hp_loss: new Preset('jb2a.healing_generic.200px.purple').withSound("fu-azure-compendia.sounds.loss.hp"),
    mp_loss: new Preset('jb2a.healing_generic.400px.yellow').withSound("fu-azure-compendia.sounds.loss.mp"),
    //zenit_gain: new Preset('').withInternalSound('gain.zenit'),

    // Weapons
    bow: new Preset("jb2a.arrow.physical.blue").withSound("fu-azure-compendia.sounds.weapon.bow"),
    sword: new Preset("jb2a.sword.melee").withSound("fu-azure-compendia.sounds.weapon.sword"),
    sword_two_handed: new Preset('jb2a.greatsword.melee').withSound("fu-azure-compendia.sounds.weapon.sword"),
    dagger: new Preset("jb2a.dagger.melee").withSound("fu-azure-compendia.sounds.weapon.dagger"),
    spear: new Preset("jb2a.spear").withSound("fu-azure-compendia.sounds.weapon.spear"),
    heavy: new Preset("jb2a.melee_attack.02.battleaxe").withSound("fu-azure-compendia.sounds.weapon.heavy"),
    brawling: new Preset("jb2a.unarmed_strike.physical").withSound("fu-azure-compendia.sounds.weapon.brawling"),
    thrown: new Preset("jb2a.dagger.throw").withSound("fu-azure-compendia.sounds.weapon.thrown"),
    firearm: new Preset("jb2a.bullet").withSound("fu-azure-compendia.sounds.weapon.firearm"),

    // Effects (All '-' get replaced by '_')
    shaken: new Preset("jb2a.condition.curse.01.006").withSound("fu-azure-compendia.sounds.status.shaken").withDuration(effectLength),
    poisoned: new Preset("jb2a.condition.curse.01.016").withSound("fu-azure-compendia.sounds.status.poisoned").withDuration(effectLength),
    dazed: new Preset("jb2a.condition.curse.01.003").withSound("fu-azure-compendia.sounds.status.dazed").withDuration(effectLength),
    weak: new Preset("jb2a.condition.curse.01.010").withSound("fu-azure-compendia.sounds.status.weak").withDuration(effectLength),
    enraged: new Preset("jb2a.condition.curse.01.002").withSound("fu-azure-compendia.sounds.status.enraged").withDuration(effectLength),
    slow: new Preset("jb2a.condition.curse.01.004").withSound("fu-azure-compendia.sounds.status.slow").withDuration(effectLength),
    crisis: new Preset("jb2a.ui.heartbeat.02").withInternalSound("status.crisis").withDuration(),
    ko: new Preset("jb2a.condition.curse.01.005").withInternalSound("status.ko").withDuration(effectLength),
    guard: new Preset('jb2a.condition.boon.01.011').withInternalSound('effect.boon').withDuration(effectLength),
    mig_up: new Preset('jb2a.condition.boon.01.020').withInternalSound('effect.boon').withDuration(effectLength),
    wlp_up: new Preset('jb2a.condition.boon.01.004').withInternalSound('effect.boon').withDuration(effectLength),
    ins_up: new Preset('jb2a.condition.boon.01.005').withInternalSound('effect.boon').withDuration(effectLength),
    dex_up: new Preset('jb2a.condition.boon.01.015').withInternalSound('effect.boon').withDuration(effectLength),
    mig_down: new Preset('jb2a.condition.curse.01.009').withInternalSound('effect.bane').withDuration(effectLength),
    wlp_down: new Preset('jb2a.condition.curse.01.011').withInternalSound('effect.bane').withDuration(effectLength),
    ins_down: new Preset('jb2a.condition.curse.01.020').withInternalSound('effect.bane').withDuration(effectLength),
    dex_down: new Preset('jb2a.condition.curse.01.008').withInternalSound('effect.bane').withDuration(effectLength),

    // Default attack
    meleeAttack: new Preset('jb2a.melee_generic'),
    rangedAttack: new Preset('jb2a.ranged.03'),

    // Action Animations (Before skills or spells)
    miss: new Preset('jb2a.ui.miss').withInternalSound('check.miss'),
    critical: new Preset('jb2a.ui.critical').withSound('fu-azure-compendia.sounds.check.critical'),
    fumble: new Preset('jb2a.ui.critical_miss').withSound('fu-azure-compendia.sounds.check.fumble'),
    skill: new Preset("jb2a.static_electricity").withSound("fu-azure-compendia.sounds.action.skill").withDuration(2),
    spell: new Preset("jb2a.static_electricity").withSound("fu-azure-compendia.sounds.action.spell").withDuration(2),
    launchSingle: new Preset('').withInternalSound('action.launchSingle'),
    launchMultiple: new Preset('').withInternalSound('action.launchMultiple'),
    dash: new Preset('jb2a.teleport').withSound('fu-azure-compendia.sounds.action.dash'),

    // Spells (attack)
    fireSingle: new Preset('jb2a.scorching_ray'),
    fireMultiple: new Preset('jb2a.explosion.01'),
    iceSingle: new Preset('jb2a.ray_of_frost'),
    iceMultiple: new Preset('jb2a.ice_spikes.radial.burst'),
    boltSingle: new Preset('jb2a.lightning_bolt'),
    boltMultiple: new Preset('jb2a.thunderwave.center'),
    earthSingle: new Preset('jb2a.boulder'),
    earthMultiple: new Preset('jb2a.falling_rocks.top'),
    poisonSingle: new Preset('jb2a.ranged.04.projectile.01.green'),
    poisonMultiple: new Preset('jb2a.toll_the_dead.green.skull_smoke'),
    lightSingle: new Preset('jb2a.ranged.03.projectile.01.bluegreen'),
    lightMultiple: new Preset('jb2a.sacred_flame.target'),
    darkSingle: new Preset('jb2a.eldritch_blast.purple'),
    darkMultiple: new Preset('jb2a.sphere_of_annihilation.200px.purple').withDuration(2),
    airSingle: new Preset('jb2a.gust_of_wind.veryfast'),
    airMultiple: new Preset('jb2a.template_circle.whirl'),

    // Specific: Will be used if found (Skills, Attacks, Misc. Abilities)
    claw: new Preset('jb2a.claws'),
    bite: new Preset('jb2a.bite').withInternalSound('attack.bite'),
    fist: new Preset('jb2a.melee_generic.creature_attack.fist'),
    pincer: new Preset('jb2a.melee_generic.creature_attack.pincer'),
    splash: new Preset('jb2a.water_splash'),

    // Breaths
    fireBreath: new Preset('jb2a.breath_weapons.fire.cone'),
    iceBreath: new Preset('jb2a.breath_weapons.cold.cone'),
    poisonBreath: new Preset('jb2a.breath_weapons.poison.cone'),
    boltBreath: new Preset('jb2a.breath_weapons.lightning.line'),

    // Spells/Skills
    elemental_weapon: new Preset('jb2a.magic_signs.rune.enchantment.intro'),
    heal: new Preset('jb2a.healing_generic.03'),
    cleanse: new Preset('jb2a.cure_wounds.200px'),
    shadow_strike: new Preset('jb2a.bats.loop.01'),
    cheap_shot: new Preset('jb2a.sneak_attack.dark_green'),
    bladestorm: new Preset('jb2a.energy_strands.overlay.blue'),
    counterattack: new Preset('jb2a.melee_generic.whirlwind.01')
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

const twoHandedTrait = 'two-handed';

/**
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @returns {Preset}
 */
function resolveWeapon(item, traits) {
    const itemName = item.name.toLowerCase()
    const matches = [...supportedWeapons].filter(weapon => traits.has(weapon) || itemName.includes(weapon));
    if (matches.length === 1) {
        const name = matches[0];
        if (traits.has(twoHandedTrait)) {
            const twoHandedVariant = `${name}_two_handed`;
            if (presets[twoHandedVariant]) {
                return presets[twoHandedVariant];
            }
        }
        return get(name)
    }
    return null;
}

const name_trait = "name:"

/**
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @returns {Preset}
 */
function resolveAttack(item, traits) {

    const weapon = resolveWeapon(item, traits);
    if (weapon) {
        return weapon;
    }

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
 * @typedef SpellPreset
 * @property {Preset} preset
 * @property {Boolean} aoe
 */

/**
 * @param {ItemReference} item
 * @param {String} type
 * @param {Boolean} multiple
 * @param {Set<String>} traits
 * @returns {SpellPreset}
 */
function resolveSpellAttack(item, type, multiple, traits) {
    // Specific
    const name = item.name.toLowerCase();
    switch (item.fuid) {
        case "ignis": return { preset: presets.fireSingle, aoe: false};
        case "fulgur": return { preset: presets.boltSingle, aoe: false};
        case "lux": return { preset: presets.lightSingle, aoe: false};
        default:
            break;
    }
    // Resolve based on type/multiple
    const qualifier = multiple ? 'Multiple' : 'Single';
    const resolvedPreset = presets[`${type}${qualifier}`];
    if (resolvedPreset) {
        return {
            preset: resolvedPreset,
            aoe: multiple,
        }
    }
    // No match (Untyped?)
    return {
        preset: resolvedPreset,
        aoe: false,
    };
}

/**
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @returns {Preset}
 */
function resolveAction(item, traits) {
    const fromFuid = get(item.fuid);
    if (fromFuid) {
        return fromFuid;
    }
    // TODO: Fallbacks
    return null;
}

/**
 * @returns {Preset}
 */
function get(name) {
    name = name.replace('-', '_')
    const preset =  presets[name];
    if (!preset){
        console.warn(`Did not find preset ${name}`)
    }
    return preset;
}


export const AzureCompendiaPresets = Object.freeze({
    get,
    resolveWeapon,
    resolveAttack,
    resolveSpellAttack,
    resolveAction
})