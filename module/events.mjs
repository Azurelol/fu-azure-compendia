import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import { AzureCompendiaPresets } from "./presets.mjs";

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

//////////
// UTILITY
//////////
function isTooClose(source, target) {
    const gridSize = canvas.grid.size;
    return (target.bounds.pad(gridSize * (0.5), gridSize * (0.5))).intersects(source.bounds);
}

function canMeleeDash() {
    return AzureCompendiaSettings.getSetting(AzureCompendiaSettings.keys.enableMeleeDash);
}

/**
 * @param {Sequence} sequence
 * @param {Preset} preset *
 * @param sourceToken
 * @param targetToken
 */
function playMeleeAnimation(sequence, preset, sourceToken, targetToken) {
    if (!sourceToken || !targetToken) {
        return;
    }

    if (!preset) {
        Azurecompendia.log("No preset was given");
        return;
    }

    // Optional dash
    const gridSize = canvas.grid.size;
    let hitPosition = Ray.towardsPoint(targetToken.center, sourceToken.center, gridSize).B;

    const dash = !isTooClose(sourceToken, targetToken);
    if (dash) {
        sequence.effect()
            .file("jb2a.gust_of_wind.veryfast")
            .playbackRate(2)
            .atLocation(sourceToken, {
                cacheLocation: true
            })
            .stretchTo(targetToken)
            .randomizeMirrorY()
            .belowTokens();


        let hitRay = new Ray(sourceToken.center, targetToken.center);
        const randomId = foundry.utils.randomID();
        const duration = 1500;

        sequence.effect()
            .file(sourceToken.document.texture.src)
            .atLocation(sourceToken, {
                cacheLocation: true
            })
            .scaleToObject(Math.max(sourceToken.document.texture.scaleX, sourceToken.document.texture.scaleY), {
                uniform: false,
                considerTokenScale: true
            })
            .mirrorX(sourceToken.document.texture.scaleX < 0)
            .mirrorY(sourceToken.document.texture.scaleY < 0)
            .anchor({
                x: sourceToken.document.texture.anchorX,
                y: sourceToken.document.texture.anchorY
            })
            .moveTowards(hitPosition, {
                rotate: false,
                ease: "easeOutQuint"
            })
            .duration(duration)
            .fadeOut(500)
            .name(randomId)
            .animation()
            .on(sourceToken)
            .fadeOut(50)
    }

    // Animate the hit
    playSoundEffect(sequence, preset.sound);
    const path = preset.animation;
    sequence.effect()
        .file(path)
        .rotateTowards(targetToken)
        .atLocation(hitPosition)
        .waitUntilFinished();

    // Return
    if (dash) {
        sequence.animation()
            .on(sourceToken)
            .fadeIn(500);
    }
}

/**
 * @param {Sequence} sequence
 * @param target
 */
function shakeTarget(sequence, source, target) {

    // "Provided" by Element_Re
    // Here is some Maths that we use for the "Shake" animation of the targets, move along... nothing to see here :D
    const amplitude = Sequencer.Helpers.random_float_between(0.0, 0.2);
    let hitRay = new Ray(source.center, target.center);
    const easeOption = "easeInOutSine";
    const shakeDirection = {
        x: Math.sign(hitRay.dx),
        y: Math.sign(hitRay.dy)
    };
    const values = {
        x: [0, -amplitude * shakeDirection.y, amplitude * shakeDirection.y, (-amplitude * shakeDirection.y) / 4, (amplitude * shakeDirection.y) / 4, 0],
        y: [0, amplitude * shakeDirection.x, -amplitude * shakeDirection.x, (amplitude * shakeDirection.x) / 4, (-amplitude * shakeDirection.x) / 4, 0]
    }
    const interval = 50;

    sequence.animation()
        .on(target)
        .fadeOut(50)

        .effect()
        .file(target.document.texture.src)
        .atLocation(target, {
            cacheLocation: true
        })
        .anchor({
            x: target.document.texture.anchorX,
            y: target.document.texture.anchorY
        })
        .scaleToObject(Math.max(target.document.texture.scaleX, target.document.texture.scaleX), {
            uniform: false,
            considerTokenScale: true
        })
        .loopProperty("sprite", "position.x", {
            values: values.x,
            duration: interval - ((interval * amplitude) / 2),
            gridUnits: true,
            ease: easeOption
        })
        .loopProperty("sprite", "position.y", {
            values: values.y,
            duration: interval - ((interval * amplitude) / 2),
            gridUnits: true,
            ease: easeOption
        })
        .duration(interval * 9)
        .zIndex(1)
        .waitUntilFinished(-150)

        .animation()
        .on(target)
        .fadeIn(50)
}

/**
 * @param {Sequence} sequence
 * @param {Preset} preset *
 * @param sourceToken
 * @param targetToken
 */
function playRangedAnimation(sequence, preset, sourceToken, targetToken) {
    if (!sourceToken || !targetToken) {
        return;
    }

    if (!preset) {
        Azurecompendia.log("No preset was given");
        return;
    }

    playSoundEffect(sequence, preset.sound);
    const path = preset.animation;
    sequence.effect()
        .file(path)
        .atLocation(sourceToken)
        .stretchTo(targetToken)
        .waitUntilFinished()
}

/**
 * @param {Sequence} sequence
 * @param {String} name
 */
function playSoundEffect(sequence, name) {
    if (!name) {
        return;
    }

    //const path = `${soundsDirectory}/${name}.ogg`
    console.debug(`Playing sound ${name}`);
    // foundry.audio.AudioHelper.play({ src: path, volume: 0.5 }, true);

    sequence
        .sound()
        .file(name)  // Specify your sound file
        .volume(0.5)  // Adjust volume (optional)
        .delay(100)   // Optional delay before sound plays (in milliseconds)
}

/**
 * @param {Sequence} sequence
 * @param {Preset} preset
 * @param token
 */
function playAnimationOnToken(sequence, preset, token) {

    playSoundEffect(sequence, preset.sound);

    sequence.effect()
        .file(preset.animation)
        .atLocation(token)
        .scaleToObject(1.5, {
            considerTokenScale: true
        })
}

/////////////////
// EVENT HANDLING
/////////////////
/**
 * @description Handles an event where a character takes damage
 * @param {DamageEvent} event 
 */
async function playDamagePreset(event) {

    let sequence = new Sequence();

    if (event.traits.has("melee")) {
        const weapon = AzureCompendiaPresets.getWeapon(event.traits);
        if (weapon) {
            playMeleeAnimation(sequence, AzureCompendiaPresets.get(weapon), event.sourceToken, event.token);
        }
    }
    else if (event.traits.has("ranged")) {
        const weapon = AzureCompendiaPresets.getWeapon(event.traits);
        if (weapon) {
            playRangedAnimation(sequence, AzureCompendiaPresets.get(weapon), event.sourceToken, event.token);
        }
    }

    // Damage on token based on type
    playAnimationOnToken(sequence, AzureCompendiaPresets.get(event.type), event.token)
    shakeTarget(sequence, event.sourceToken, event.token);

    await sequence.play();
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
        Azurecompendia.log(`Playing preset for damage event: ${event.type} on token: ${event.token.name} with traits: ${event.traits}`);
        playDamagePreset(event);
    });

    Hooks.on('projectfu.events.gain', async event => {
        Azurecompendia.log(`Playing preset for gain event: ${event.resource} on token: ${event.token.name}`);
        let sequence = new Sequence();
        playAnimationOnToken(sequence, AzureCompendiaPresets.get(event.resource), event.token);
    });

    Hooks.on('projectfu.events.loss', async event => {
        Azurecompendia.log(`Playing preset for loss event: ${event.resource} on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.crisis', async event => {
        Azurecompendia.log(`Playing preset for crisis event on token: ${event.token.name}`);
    });

    Hooks.on('projectfu.events.status', async event => {
        Azurecompendia.log(`Playing preset for status event: ${event.status}, enabled=${event.enabled}, on token: ${event.token.name}`);
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