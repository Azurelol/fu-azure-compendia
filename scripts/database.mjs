import {AzureCompendiaSettings} from "./settings.mjs";

// A sequencer database
const assetsDirectory = "modules/fu-azure-compendia/assets/sounds";

function toEntry(name) {
    return `${assetsDirectory}/${name}.ogg`;
}

const entries = {
    sounds: {
        damage: {
            physical: [
                toEntry("melee-hit-2"),
            ],
            bolt: [
                toEntry(`lightning-impact-1`),
                toEntry(`lightning-impact-2`),
                toEntry(`lightning-impact-3`),
            ],
            fire: [
                toEntry('explosion-1'),
                toEntry('explosion-2'),
            ],
            ice: [
                toEntry(`ice-blast-1`),
            ],
            earth: [
                toEntry("Fear")
            ],
            dark: [
                toEntry("necrotic-short-1"),
                toEntry(`necrotic-short-2`),
            ],
            light: [
                toEntry("radiant-impact-1")
            ],
            air: [
                toEntry("spell-air-moving-2")
            ],
            poison: [
                toEntry("poison-nova-1"),
                toEntry("poison-puff-1"),
            ]
        },
        gain: {
            hp: [
                toEntry("heal"),
            ],
            mp: [
                toEntry("enchant"),
            ],
            zenit: [
                toEntry("zenit"),
            ]
        },
        loss: {
            hp: [
                toEntry("melee-hit-1"),
            ],
            mp: [
                toEntry("spell-whoosh-16"),
            ]
        },
        status: {
            shaken: [
                toEntry("spell-whispers-8")
            ],
            dazed:[
                toEntry("Moon-Beam")
            ],
            weak:[
                toEntry("Constrict_Snare")
            ],
            slow: [
                toEntry("Net_Web")
            ],
            enraged: [
                toEntry("Rage")
            ],
            poisoned: [
                toEntry("poison-puff-4")
            ],
            crisis: [
                toEntry('heartbeat')
            ],
            ko: [
                toEntry('spell-teleport-short-4')
            ]
        },
        effect: {
            boon: [
                toEntry('spell-buff-short-3')
            ],
            bane: [
                toEntry('spell-decrescendo-short-1')
            ]
        },
        weapon: {
            bow: [
                toEntry("arrow-fly-by-1"),
                toEntry("arrow-fly-by-2"),
                toEntry("arrow-fly-by-3"),
            ],
            sword:[
                toEntry("slashing-swing-1"),
            ],
            dagger:[
                toEntry("slashing-blood-1"),
            ],
            spear:[
                toEntry("piercing-impact-metal-1"),
            ],
            heavy:[
                toEntry("bludgeoning-swing-impact-blunt-1"),
                toEntry("bludgeoning-swing-impact-blunt-2"),
            ],
            brawling:[
                toEntry("melee-hit-2"),
                toEntry("melee-hit-3"),
            ],
            thrown:[
                toEntry("throw-hit-1")
            ],
            firearm: [
                toEntry("firearm-gunshot-1"),
                toEntry("firearm-gunshot-2"),
                toEntry("firearm-shotgun-1"),
            ]
        },
        attack: {
            bite: [
                toEntry("melee-impact-rip-1")
            ]
        },
        check: {
            critical: [
                toEntry("slashing-electric-1")
            ],
            miss: [
                toEntry("melee-miss-1"),
            ],
            fumble: [
                toEntry("melee-miss-2"),
            ]
        },
        action: {
            spell: [
                toEntry("Thaumaturgy")
            ],
            skill: [
                toEntry('Constrict_Snare')
            ],
            dash: [
                toEntry('sand')
            ],
            launchSingle: [
                toEntry['spell-launch-single-1']
            ],
            launchMultiple: [
                toEntry('spell-launch-multiple-1')
            ],
        },
        skill: {
            verse: [
                toEntry('spell-lively-3')
            ],
            dance: [
                toEntry('spell-lively-2')
            ],
            encourage: [
                toEntry('cheer')
            ],
            counterattack: [
                toEntry('piercing-impact-metal-1')
            ]
        },
        spell: {
            heal: [
                toEntry('blessing2')
            ]
        }
    }
}

export const AzureCompendiaDatabase = Object.freeze({
    entries,
})