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
                toEntry("melee-hit-2.mp3"),
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
            ],
            earth: [
                toEntry("Fear.mp3")
            ],
            dark: [
                toEntry("necrotic-short-1.mp3"),
                toEntry(`necrotic-short-2.mp3`),
            ],
            light: [
                toEntry("radiant-impact-1.ogg")
            ],
            air: [
                toEntry("spell-air-moving-2.mp3")
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
        status: {
            shaken: [
                toEntry("spell-whispers-8.mp3")
            ],
            dazed:[
                toEntry("Moon-Beam.mp3")
            ],
            weak:[
                toEntry("Constrict_Snare.mp3")
            ],
            slow: [
                toEntry("spell-decrescendo-short-1.mp3")
            ],
            enraged: [
                toEntry("Rage.mp3")
            ],
            poisoned: [
                toEntry("poison-puff-4.mp3")
            ]
        },
        weapon: {
            bow: [
                toEntry("arrow-fly-by-1.mp3"),
                toEntry("arrow-fly-by-2.mp3"),
                toEntry("arrow-fly-by-3.mp3"),
            ],
            sword:[
                toEntry("slashing-swing-1.mp3"),
            ],
            dagger:[
                toEntry("slashing-blood-1.mp3"),
            ],
            spear:[
                toEntry("piercing-impact-metal-1.mp3"),
            ],
            heavy:[
                toEntry("bludgeoning-swing-impact-blunt-1.mp3"),
                toEntry("bludgeoning-swing-impact-blunt-2.mp3"),
            ],
            brawling:[
                toEntry("melee-hit-2.mp3"),
                toEntry("melee-hit-3.mp3"),
            ],
            thrown:[
                toEntry("throw-hit-1.mp3")
            ],
            firearm: [
                toEntry("firearm-gunshot-1.mp3"),
                toEntry("firearm-gunshot-2.mp3"),
                toEntry("firearm-gunshot-3.mp3"),
            ]
        },
        check: {
            critical: [
                toEntry("slashing-swing-1.mp3")
            ],
            miss: [
                toEntry("melee-miss-1.mp3"),
                toEntry("melee-miss-2.mp3"),
            ]
        },
        action: {
            spell: [
                toEntry("radiant-build-up-1.mp3")
            ],
            skill: [
            ]
        }

    }
}

export const AzureCompendiaDatabase = Object.freeze({
    entries,
})