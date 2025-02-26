import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import { AzureCompendiaPresets } from "./presets.mjs";
import {AzureCompendiaSequences} from "./sequences.mjs";

/**
 * @description Dispatched when an actor makes an attack (skill/spell)
 * @typedef AttackEvent
 * @property {ItemReference} item
 * @property {FU.damageTypes} type
 * @property {Set<String>} traits
 * @property {FUActor} actor
 * @property {Token} token
 * @property {EventTarget[]} targets
 */

/**
 * @typedef ItemReference
 * @property {String} name
 * @property {String} fuid
 */

/**
 * @description Contains both information about a target in a combat event
 * @typedef EventTarget
 * @property {Token} token
 * @property {FUActor} actor
 * @property {TargetData} data
 */

/**
 * @description Handles an event where a character performs an attack
 * @param {AttackEvent} event
 */
async function animateAttack(event) {

    const traitString = new Array(...event.traits).join(' ')
    Azurecompendia.log(`Animating attack event: ${event.type} on token: ${event.token.name} with traits: ${JSON.stringify(traitString)}`);

    let sequence = new Sequence();

    if (event.traits.has('spell')) {
        AzureCompendiaSequences.playSpellAttack(sequence, event.traits, event.type, event.token, event.targets);
    }
    else if (event.traits.has("melee")) {
        AzureCompendiaSequences.playMeleeAnimation(sequence, event.item, event.traits, event.type, event.token, event.targets);
    }
    else if (event.traits.has("ranged")) {
        AzureCompendiaSequences.playRangedAnimation(sequence, event.traits, event.type, event.token, event.targets);
    }

    await sequence.play({
        preload: true
    });
}

/**
 * @description Dispatched when an actor performs a spell without a magic check.
 * @typedef SpellEvent
 * @property {ItemReference} item
 * @property {Set<String>} traits
 * @property {FUActor} actor
 * @property {Token} token
 * @property {EventTarget[]} targets
 */

/**
 * @description Handles an event where a character takes damage
 * @param {SpellEvent} event
 */
async function animateSpell(event) {
    let sequence = new Sequence();
    AzureCompendiaSequences.playSpell(sequence, event.item, event.traits, event.token, event.targets);
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
        AzureCompendiaSequences.playStatusChangeOnToken(sequence, AzureCompendiaPresets.get(event.status), event.token);
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

    Hooks.on('projectfu.events.attack', async event => {
        await animateAttack(event);
    });

    Hooks.on('projectfu.events.spell', async event => {
        await animateSpell(event);
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