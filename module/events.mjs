import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import { AzureCompendiaPresets } from "./presets.mjs";
import {AzureCompendiaSequences} from "./sequences.mjs";

/**
 * @description Dispatched when an actor suffers damage
 * @typedef DamageEvent
 * @property {String} type
 * @property {Number} amount
 * @property {FUActor} actor
 * @property {Token} token
 * @property {FUActor} sourceActor
 * @property {Token} sourceToken
 * @property {Set<String>} traits
 */

/**
 * @description Handles an event where a character takes damage
 * @param {DamageEvent} event 
 */
async function playDamagePreset(event) {

    const traitString = new Array(...event.traits).join(' ')
    Azurecompendia.log(`Animating damage event: ${event.type} on token: ${event.token.name} with traits: ${JSON.stringify(traitString)}`);

    let sequence = new Sequence();

    if (event.traits.has('spell')) {
        AzureCompendiaSequences.playSpellAnimation(sequence, event.traits, event.type, event.sourceToken, event.token);
    }
    else if (event.traits.has("melee")) {
        AzureCompendiaSequences.playMeleeAnimation(sequence, event.traits, event.type, event.sourceToken, event.token);
    }
    else if (event.traits.has("ranged")) {
        AzureCompendiaSequences.playRangedAnimation(sequence, event.traits, event.type, event.sourceToken, event.token);
    }

    await sequence.play();
}

async function playResourceGainPreset(event) {
    Azurecompendia.log(`Playing preset for gain event: ${event.resource} on token: ${event.token.name}`);
    let sequence = new Sequence();
    AzureCompendiaSequences.playAnimationOnToken(sequence, AzureCompendiaPresets.get(event.resource), event.token);
    await sequence.play();
}

async function playStatusPreset(event) {
    Azurecompendia.log(`Playing preset for status event: ${event.status}, enabled=${event.enabled}, on token: ${event.token.name}`);
    if (event.enabled) {
        let sequence = new Sequence();
        AzureCompendiaSequences.playAnimationOnToken(sequence, AzureCompendiaPresets.get(event.status), event.token);
        await sequence.play();
    }
}

/**
 * @description Subscribes to the system combat events
 */
function subscribe() {

    const enabled = AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.enableAnimationSystem);
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
        await playDamagePreset(event);
    });

    Hooks.on('projectfu.events.gain', async event => {
        await playResourceGainPreset(event);
    });

    Hooks.on('projectfu.events.loss', async event => {
        Azurecompendia.log(`Playing preset for loss event: ${event.resource} on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.crisis', async event => {
        Azurecompendia.log(`Playing preset for crisis event on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.status', async event => {
        await playStatusPreset(event);
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