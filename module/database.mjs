import {AzureCompendiaSettings} from "./settings.mjs";

// A sequencer database
const assetsDirectory = "modules/fu-azure-compendia/assets/sounds";

function toEntry(name) {
    return `${assetsDirectory}/${name}`;
}

const entries = {
    sounds: {
        damage: {
            physical: [
                toEntry("physical.ogg"),
            ],
            bolt: [
                toEntry(`lightning-impact-1.mp3`),
                toEntry(`lightning-impact-2.mp3`),
                toEntry(`lightning-impact-3.mp3`),
            ],
            fire: [
                toEntry('fire-blast-binaural-1.mp3'),
                toEntry('fire-blast-binaural-2.mp3'),
                toEntry('fire-blast-binaural-3.mp3'),
            ],
            ice: [
                toEntry(`ice-blast-1.mp3`),
                toEntry(`ice-blast-2.mp3`),
                toEntry(`ice-blast-3.mp3`),
            ],
            earth: [

            ],
            dark: [

            ],
            light: [

            ],
            air: [

            ],
            poison: [
                toEntry("poison-nova-1.mp3"),
                toEntry("poison-puff-1.mp3"),
            ]
        },
        gain: {
            hp: [
                toEntry("hp-gain.ogg"),
            ],
            mp: [
                toEntry("mp-gain.ogg"),
            ]
        },
        weapon: {
            bow: [
            ],
            sword:[
            ],
            dagger:[
            ],
            spear:[
            ],
            heavy:[
            ],
            brawling:[
            ],
            thrown:[
            ],
            firearm: [
                toEntry("firearm-gunshot-1.mp3"),
                toEntry("firearm-gunshot-2.mp3"),
                toEntry("firearm-gunshot-3.mp3"),
            ]

        }

    }
}

export const AzureCompendiaDatabase = Object.freeze({
    entries,
})