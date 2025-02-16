import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";

const assetsDirectory = "modules/fu-azure-compendia/assets";
const soundsDirectory = assetsDirectory + "/sounds";

/**
 * @typedef Preset
 * @property {String} animation
 * @property {String} sound
 */

const presets = Object.freeze({
    ice: {
        animation: "jb2a.impact_themed.ice_shard.blue",
        sound: ""
    },
    fire: {
        animation: "jb2a.cast_generic.fire.01.orange.0",
        sound: ""
    },
    bolt: {
        animation: "jb2a.thunderwave.center.blue",
        sound: ""
    },
    earth: {
        animation: "jb2a.cast_generic.earth.01.browngreen.0",
        sound: ""
    },
    dark: {
        animation: "jb2a.healing_generic.200px.purple",
        sound: ""
    },
    light: {
        animation: "jb2a.twinkling_stars.points04.white",
        sound: ""
    },
    poison: {
        animation: "jb2a.energy_strands.in.green.01.0",
        sound: ""
    },
    air: {
        animation: "jb2a.energy_strands.overlay.blue.01",
        sound: ""
    },
    physical: {
        animation: "jb2a.impact.007.yellow",
        sound: ""
    },
    untyped: {
        animation: "jb2a.cast_generic.fire.01.orange.0",
        sound: ""
    },
    none: {
        animation: "",
        sound: ""
    },
    hp: {
        animation: "jb2a.healing_generic.200px.green",
        sound: ""
    },
    mp: {
        animation: "jb2a.healing_generic.200px.blue",
        sound: ""
    },
});

async function playPreset(name, token) {
    const preset = presets[name];
    if (preset) {
        if (preset.sound) {
            playSoundEffect(preset.sound);
        }
        if (preset.animation) {
            playAnimation(preset.animation, token);
        }
    }
}

async function playSoundEffect(name) {
    const path = `${soundsDirectory}/${name}.ogg`
    console.debug(`Playing sound ${path}`);
    foundry.audio.AudioHelper.play({ src: path, volume: 0.5 }, true);
}

// Uses: https://fantasycomputer.works/FoundryVTT-Sequencer/#/
async function playAnimation(path, token) {
    if (!game.modules.get("sequencer")?.active) {
        console.debug("Sequencer not installed and active!");
    }

    if (!game.modules.get("JB2A_DnD5e")?.active) {
        console.debug("JB2A module not installed and active!");
    }

    new Sequence()
        .effect()
        .file(path)
        .atLocation(token)
        .scaleToObject(1.5, {
            considerTokenScale : true
        })
        .play();
}

function subscribe() {

    const enabled = AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.enableSoundEffects);
    if (!enabled) {
        Azurecompendia.log(`Sound effects were not enabled`)
        return;
    }

    Hooks.on('projectfu.events.damage', async event => {
        Azurecompendia.log(`Playing preset for damage event: ${event.type} on token: ${event.token.name}`);
        playPreset(event.type, event.token);
    });

    Hooks.on('projectfu.events.gain', async event => {
        Azurecompendia.log(`Playing preset for gain event: ${event.resource} on token: ${event.token.name}`);
        playPreset(event.resource, event.token);
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