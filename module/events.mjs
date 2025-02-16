import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";

const assetsDirectory = "modules/fu-azure-compendia/assets";
const soundsDirectory = assetsDirectory + "/sounds";

async function playSoundEffect(name) {
    const path = `${soundsDirectory}/${name}.ogg`
    console.debug(`Playing sound ${path}`);
    foundry.audio.AudioHelper.play({ src: path, volume: 0.5 }, true);
}

function subscribe() {

    const enabled = AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.enableSoundEffects);
    if (!enabled) {
        Azurecompendia.log(`Sound effects were not enabled`)
        return;
    }

    Hooks.on('projectfu.events.damage', async event => {
        Azurecompendia.log(`Playing sound effect for damage event: ${event.type} on token: ${event.token.name}`);
        switch (event.type) {
            case "physical":
                playSoundEffect('physical');
                break;
            default:
                break;
        }
    });

    Hooks.on('projectfu.events.gain', async event => {
        Azurecompendia.log(`Playing sound effect for gain event: ${event.resource} on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.loss', async event => {
        Azurecompendia.log(`Playing sound effect for loss event: ${event.resource} on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.crisis', async event => {
        Azurecompendia.log(`Playing sound effect for crisis event on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.status', async event => {
        Azurecompendia.log(`Playing sound effect for status event: ${event.status}, enabled=${event.enabled}, on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.combat', async event => {        
        switch (event.type) {
            case 'FU.StartOfCombat':
            case 'FU.EndOfCombat':
                Azurecompendia.log(`Playing sound effect for combat event: ${event.type}`);
                break;

            case 'FU.StartOfTurn':
                Azurecompendia.log(`Playing sound effect for combat event ${event.type} on token ${event.token.name}`);
                break;
            case 'FU.EndOfTurn':
                Azurecompendia.log(`Playing sound effect for combat event ${event.type} on token ${event.token.name}`);
                break;
            default:
                break;
        }
    });
}


export const AzureCompendiaEvents = Object.freeze({
    subscribe
})