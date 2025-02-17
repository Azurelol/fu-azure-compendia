import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";

const assetsDirectory = "modules/fu-azure-compendia/assets";
const soundsDirectory = assetsDirectory + "/sounds";

// Uses: https://fantasycomputer.works/FoundryVTT-Sequencer/#/
/**
 * @property {String[]} animations
 * @property {String} sound
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
}

/**
 * @type {Object<String, Preset>}
 */
const presets = Object.freeze({
    // Damage Types
    ice: new Preset("jb2a.impact_themed.ice_shard.blue"),
    fire: new Preset("jb2a.cast_generic.fire.01.orange.0"),
    bolt: new Preset("jb2a.thunderwave.center.blue"),
    earth: new Preset("jb2a.cast_generic.earth.01.browngreen.0"),
    dark: new Preset("jb2a.healing_generic.200px.purple"),
    light: new Preset("jb2a.twinkling_stars.points04.white"),
    poison: new Preset("jb2a.energy_strands.in.green.01.0"),
    air: new Preset("jb2a.energy_strands.overlay.blue.01"),
    physical: new Preset("jb2a.impact.007.yellow"),
    untyped: new Preset("jb2a.cast_generic.fire.01.orange.0"),
    // Resources    
    hp: new Preset("jb2a.healing_generic.200px.green"),
    mp: new Preset("jb2a.healing_generic.200px.blue"),
    // Weapons
    bow: new Preset("jb2a.arrow.physical.blue"),
    sword: new Preset("jb2a.sword.melee.01.white.0"),
    dagger: new Preset("jb2a.dagger.melee.02.white"),
    spear: new Preset("jb2a.spear.melee.01.white.0"),
    heavy: new Preset("jb2a.melee_attack.02.battleaxe"),
    brawling: new Preset("jb2a.unarmed_strike.physical"),
    thrown: new Preset("jb2a.dagger.throw"),
    firearm: new Preset("jb2a.bullet")
});

/**
 * @description Dispatched when an actor suffers damage
 * @typedef DamageEvent
 * @property {FU.damageTypes} type
 * @property {Number} amount
 * @property {FUActor} actor
 * @property {Token} token
 * @property {FUActor} sourceActor
 * @property {Token} sourceToken
 * @property {Set<String>} traits
 */

/**
 * @typedef {"arcane", "bow", "brawling", "dagger", "firearm", "flail", "heavy", "spear", "sword", "thrown", "custom"} WeaponCategory
 */

///////////////////////////////
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
    if (chosenWeapons.length == 1) {
        return chosenWeapons[0]
    }
    return null;
}
///////////////////////////////

/**
 * @param {DamageEvent} event 
 */
async function playDamagePreset(event) {

    if (event.traits.has("melee")) {
        const weapon = getWeapon(event.traits);
        if (weapon) {
            await playMeleeAnimation(presets[weapon], event.sourceToken, event.token);
        }
    }
    else if (event.traits.has("ranged")) {
        const weapon = getWeapon(event.traits);
        if (weapon) {
            await playRangedAnimation(presets[weapon], event.sourceToken, event.token);
        }
    }

    // Damage on token based on type
    await playAnimationOnToken(presets[event.type], event.token)
}

async function playSoundEffect(name) {
    if (!name) {
        return;
    }
    const path = `${soundsDirectory}/${name}.ogg`
    console.debug(`Playing sound ${path}`);
    // foundry.audio.AudioHelper.play({ src: path, volume: 0.5 }, true);


    new Sequence()
        .sound()
        .file(path)  // Specify your sound file
        .volume(0.5)  // Adjust volume (optional)
        .delay(100)   // Optional delay before sound plays (in milliseconds)
        .play();
}


/**
 * @param {Preset} preset 
 */
async function playAnimationOnToken(preset, token) {

    playSoundEffect(preset.sound);
    const path = preset.animation;
    return new Sequence()
        .effect()
        .file(path)
        .atLocation(token)
        .scaleToObject(1.5, {
            considerTokenScale: true
        })
        .play();
}

/**
 * @param {Preset} preset 
 */
async function playMeleeAnimation(preset, sourceToken, targetToken) {
    if (!sourceToken || !targetToken) {
        return;
    }

    if (!preset) {
        Azurecompendia.log("No preset was given");
        return;
    }

    playSoundEffect(preset.sound);
    const path = preset.animation;
    return new Sequence()
        .effect()
        .file(path)
        .atLocation(sourceToken)
        .rotateTowards(targetToken)
        .play();
}

/**
 * @param {Preset} preset 
 */
async function playRangedAnimation(preset, sourceToken, targetToken) {
    if (!sourceToken || !targetToken) {
        return;
    }

    if (!preset) {
        Azurecompendia.log("No preset was given");
        return;
    }

    playSoundEffect(preset.sound);
    const path = preset.animation;
    return new Sequence()
        .effect()
        .file(path)
        .atLocation(sourceToken)
        .stretchTo(targetToken)
        .play();
}

function subscribe() {

    const enabled = AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.enableSoundEffects);
    if (!enabled) {
        Azurecompendia.log(`Sound effects were not enabled`)
        return;
    }

    if (!game.modules.get("sequencer")?.active) {
        console.debug("Sequencer not installed and active!");
        return;
    }

    if (!game.modules.get("JB2A_DnD5e")?.active) {
        console.debug("JB2A module not installed and active!");
        return;
    }

    Hooks.on('projectfu.events.damage', async event => {
        Azurecompendia.log(`Playing preset for damage event: ${event.type} on token: ${event.token.name} with traits: ${event.traits}`);
        playDamagePreset(event);
    });

    Hooks.on('projectfu.events.gain', async event => {
        Azurecompendia.log(`Playing preset for gain event: ${event.resource} on token: ${event.token.name}`);
        playAnimationOnToken(presets[event.resource], event.token);
    });

    Hooks.on('projectfu.events.loss', async event => {
        Azurecompendia.log(`Playing preset for loss event: ${event.resource} on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.crisis', async event => {
        Azurecompendia.log(`Playing preset for crisis event on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.status', async event => {
        Azurecompendia.log(`Playing  preset for status event: ${event.status}, enabled=${event.enabled}, on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.combat', async event => {
        switch (event.type) {
            case 'FU.StartOfCombat':
            case 'FU.EndOfCombat':
                Azurecompendia.log(`Playing preset for combat event: ${event.type}`);
                break;

            case 'FU.StartOfTurn':
                Azurecompendia.log(`Playing preset for combat event ${event.type} on token ${event.token.name}`);
                break;
            case 'FU.EndOfTurn':
                Azurecompendia.log(`Playing preset for combat event ${event.type} on token ${event.token.name}`);
                break;
            default:
                break;
        }
    });
}


export const AzureCompendiaEvents = Object.freeze({
    subscribe
})