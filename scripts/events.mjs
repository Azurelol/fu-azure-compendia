import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import { AzureCompendiaPresets } from "./presets.mjs";
import {AzureCompendiaSequences} from "./sequences.mjs";
import {AzureCompendiaFilters} from "./filters.mjs";

/**
 * @typedef CombatEvent
 * @description Dispatched by the combat during its lifetime
 * @property {FU.combatEvent} type The type of event
 * @property {Number} round The round the event is taking place in
 * @property {Combatant} combatant The current combatant taking a turn, which can be null.
 * @property {FUActor|*} actor The actor involved in the event, which can be null.
 * @property {Token|*} token The token of the combatant taking a turn, which can be null.
 * @property {Combatant[]} combatants The actors involved in the combat
 * @property {FUActor[]} actors The actors involved in the combat
 * @remarks Depending on the {@linkcode type} of the event, some properties will be assigned and others will not.
 * Combat and round events will include all combatants, whereas turn events are relegated to the single combatant.
 */

/**
 * @typedef Combatant
 * @property {Number} id
 * @property {Number} actorId
 * @property {FUActor} actor
 * @property {TokenDocument} token
 * @property {Boolean} isNPC
 * @property {Boolean} visible
 * @property {Boolean} isDefeated
 * @remarks {@link https://foundryvtt.com/api/classes/client.Combatant.html}
 */

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
        AzureCompendiaSequences.playSpellAttack(sequence, event.item, event.traits, event.type, event.token, event.targets);
    }
    else if (event.traits.has("melee")) {
        if (AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.dashOnMelee)) {
            AzureCompendiaSequences.animateMeleeDash(sequence, event.item, event.traits, event.type, event.token, event.targets);
        }
        else {
            AzureCompendiaSequences.animateMeleeAttack(sequence, event.item, event.traits, event.type, event.token, event.targets);
        }
    }
    else if (event.traits.has("ranged")) {
        AzureCompendiaSequences.playRangedAnimation(sequence, event.item, event.traits, event.type, event.token, event.targets);
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

async function animateSpell(event) {
    let sequence = new Sequence();
    AzureCompendiaSequences.animateSpell(sequence, event.item, event.traits, event.token, event.targets);
    await sequence.play();
}

/**
 * @description Dispatched when an actor performs a skill without am accuracy check.
 * @typedef SkillEvent
 * @property {ItemReference} item
 * @property {Set<String>} traits
 * @property {FUActor} actor
 * @property {Token} token
 * @property {EventTarget[]} targets
 */
async function animateSkill(event) {
    let sequence = new Sequence();
    AzureCompendiaSequences.animateSkill(sequence, event.token, event.item, event.traits);
    await sequence.play();
}

/**
 * @description Dispatched when an actor performs a skill without am accuracy check.
 * @typedef ItemEvent
 * @property {ItemReference} item
 * @property {String} type The item type
 * @property {FUActor} actor
 * @property {Token} token
 * @property {EventTarget[]} targets
 */

async function animateItem(event) {
    let sequence = new Sequence();
    AzureCompendiaSequences.animateItem(sequence, event.item, event.type, event.actor, event.token, event.targets);
    await sequence.play();
}

/**
 * @description Dispatched when an actor performs a study check
 * @typedef StudyEvent
 * @property {FUActor} actor
 * @property {Token} token
 * @property {EventTarget[]} targets
 */

async function animateStudy(event) {
    Azurecompendia.log(`Playing preset for study event`);
    let sequence = new Sequence();
    const preset = AzureCompendiaPresets.get("study");
    for(const target of event.targets){
        AzureCompendiaSequences.playAnimationOnToken(sequence, preset, target.token, 2);
    }
    await sequence.play();
}

async function playResourcePreset(event, type) {
    Azurecompendia.log(`Playing preset for gain event: ${event.resource} on token: ${event.token.name}`);
    let sequence = new Sequence();
    const name = `${event.resource}_${type}`
    AzureCompendiaSequences.playAnimationOnToken(sequence, AzureCompendiaPresets.get(name), event.token);
    await sequence.play();
}

async function playStatusPreset(event) {
    Azurecompendia.log(`Playing preset for status event: ${event.status}, enabled=${event.enabled}, on token: ${event.token.name}`);
    if (event.enabled) {
        let sequence = new Sequence();
        AzureCompendiaSequences.animateEffectAboveToken(sequence, AzureCompendiaPresets.get(event.status), event.token);
        await sequence.play();
    }
    else{
        // TODO: Handle?
        // if (event.status === "ko") {
        //     let sequence = new Sequence();
        //     sequence.animation(event.token).show(true)
        //     await sequence.play()
        // }
    }
}

async function animateDefeat(event){
    if (fadeOnDefeat()) {
        let sequence = new Sequence();
        AzureCompendiaSequences.playDefeatAnimation(sequence, event.actor, event.token);
        await sequence.play();
    }
}

/**
 * @param {CombatEvent} event
 * @returns {Promise<void>}
 */
async function animateCombatEvent(event) {
    if (!AzureCompendiaSettings.isEnabled(AzureCompendiaSettings.keys.animateCombatEvent)) {
        return;
    }

    let sequence = new Sequence();

    switch (event.type) {
        case 'FU.StartOfCombat':
            AzureCompendiaSequences.playSoundEffect(sequence, AzureCompendiaPresets.combatPresets.startOfCombat);
            break;
        case 'FU.EndOfCombat':
            Azurecompendia.log(`Playing preset for combat event: ${event.type}`);
            AzureCompendiaFilters.clearTokenFilters(event.combatants)
            break;
        case 'FU.StartOfTurn':
            Azurecompendia.log(`Playing preset for combat event ${event.type} on token ${event.token.name}`);
            AzureCompendiaFilters.toggleTokenOutline(event.combatant, event.token, true)
            AzureCompendiaSequences.playSoundEffect(sequence, AzureCompendiaPresets.combatPresets.startOfTurn);
            break;
        case 'FU.EndOfTurn':
            Azurecompendia.log(`Playing preset for combat event ${event.type} on token ${event.token.name}`);
            AzureCompendiaFilters.toggleTokenOutline(event.combatant, event.token, false)
            AzureCompendiaSequences.playSoundEffect(sequence, AzureCompendiaPresets.combatPresets.endOfTurn);
            break;
        default:
            break;
    }

    await sequence.play();
}

function isEnabled() {
    return AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.enableAnimationSystem);
}

function fadeOnDefeat(){
    return AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.fadeOnDefeat);
}

/**
 * @description Subscribes to the system combat events
 */
function subscribe() {

    if (!isEnabled()) {
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

    Hooks.on('projectfu.events.skill', async event => {
        await animateSkill(event);
    });

    Hooks.on('projectfu.events.item', async event => {
        await animateItem(event);
    });

    Hooks.on('projectfu.events.study', async event => {
        await animateStudy(event);
    });

    Hooks.on('projectfu.events.gain', async event => {
        await playResourcePreset(event, "gain");
    });

    Hooks.on('projectfu.events.loss', async event => {
        await playResourcePreset(event, "loss");
    });

    Hooks.on('projectfu.events.crisis', async event => {
        Azurecompendia.log(`Playing preset for crisis event on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.status', async event => {
        await playStatusPreset(event);
    });

    Hooks.on('projectfu.events.defeat', async event => {
        await animateDefeat(event);
    });

    Hooks.on('projectfu.events.combat', async event => {
        await animateCombatEvent(event)
    });
}

export const AzureCompendiaEvents = Object.freeze({
    subscribe
})