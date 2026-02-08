import {Azurecompendia} from "./main.mjs";
import {AzureCompendiaSettings} from "./settings.mjs";

/**
 * @typedef TargetData
 * @property {String} name
 * @property {String} combatantId
 * @property {String} actorId
 * @property {String} tokenId
 */

/**
 * @typedef TargetingData
 * @property {TargetData[]} targets
 */

/**
 * @param action
 */
function updateTargetingData(action) {
    const data = AzureCompendiaSettings.modifyData(AzureCompendiaSettings.keys.targetingCache, action);
}

/**
 * @param {CombatEvent} event
 * @return {Combatant[]}
 */
function getTargets(event) {
    const combatants = Array.from(event.combatants.values());
    return combatants.filter(c => c.token.disposition === 1);
}

/**
 * @param {Combatant[]} targets
 * @returns {Combatant}
 */
function selectTarget(targets) {
    const targetIndex =  Math.floor(Math.random() * targets.length);
    return targets[targetIndex];
}

function cryptoShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// TODO: Threat meter???
/**
 * @param {Combatant[]} targets
 * @returns {Combatant[]}
 */
function prioritizeTargets(targets) {
    return cryptoShuffle(targets);
}

/**
 * @param {*} actor
 * @param {Boolean} add
 */
function targetToken(actor, add) {
    if (!actor) {
        return;
    }
    for (const token of actor.getActiveTokens(true)) {
        token.setTarget(true, {
            user: game.user,
            releaseOthers: !add
        });
    }
}

/**
 * @param {CombatEvent} event
 * @returns {Promise<void>}
 */
async function select(event) {
    const actor = event.actor;
    const targets = getTargets(event);
    if (targets.length === 0) {
        return;
    }

    const prioritizedTargets = prioritizeTargets(targets);
    const content = await foundry.applications.handlebars.renderTemplate('modules/fu-azure-compendia/templates/evil-eye.hbs', {
        actor: actor,
        targets: prioritizedTargets
    });
    const flags = {
        [AzureCompendiaSettings.moduleId] : {
        }
    }

    const messageData = {
        user: game.user.id,
        speaker: {
            alias: 'Evil Eye',
        },
        flags: flags,
        content: content
    };

    if (!AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.publicTargetingMessage)){
        messageData.whisper = ChatMessage.getWhisperRecipients("GM")
    }

    ChatMessage.create(messageData);

    if (AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.autoTargetOnTurnStart)) {
        targetToken(prioritizedTargets[0].actor, false)
    }
}

function initialize(){
    Hooks.on("renderChatMessageHTML", (message, html) => {
        if (!message.flags[AzureCompendiaSettings.moduleId]) {
            return;
        }

        const elements = html.querySelectorAll?.("[data-action='afcTargetCombatant']");
        if (!elements?.length) return;

        for (const el of elements) {
            el.addEventListener("click", async event => {
                event.preventDefault();
                event.stopPropagation();

                if (!game.user.isGM) {
                    return;
                }

                const add = event.shiftKey;
                const uuid = el.dataset.uuid;
                const actor = await fromUuid(uuid);
                if (!actor) return;

                targetToken(actor, add)
            });
        }
    });
}

export const AzureCompendiaTargeting = Object.freeze({
    select,
    initialize
})
