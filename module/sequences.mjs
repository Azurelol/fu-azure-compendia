import {AzureCompendiaSettings} from "./settings.mjs";
import {Azurecompendia} from "./main.mjs";
import {AzureCompendiaPresets} from "./presets.mjs";

function isTooClose(source, target) {
    const gridSize = canvas.grid.size;
    return (target.bounds.pad(gridSize * (0.5), gridSize * (0.5))).intersects(source.bounds);
}

/**
 * @param {Sequence} sequence
 * @param {Preset} preset
 */
function playSoundEffect(sequence, preset) {
    if (!preset.sound) {
        return;
    }

    Azurecompendia.log(`Playing sound ${preset.sound}`);

    let section = sequence
        .sound()
        .file(preset.sound)  // Specify your sound file
        .volume(0.2)  // Adjust volume (optional)
        .delay(100)   // Optional delay before sound plays (in milliseconds)

    if (preset.duration) {
        section.duration(preset.duration * 1000)
    }
}

/**
 * @param {Sequence} sequence
 * @param {Token} source
 * @param {Token} target
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

const skillDuration = 1.5;

/**
 * @param {Sequence} sequence
 * @param {Token} sourceToken
 * @param {String} name
 * @param {String} fuid
 */
function animateSkill(sequence, sourceToken, name, fuid) {
    const skill = AzureCompendiaPresets.resolveSpell(name, fuid);
    if (skill) {
        const section = playAnimationOnToken(sequence, skill, sourceToken, skillDuration);
        section.waitUntilFinished();
    }
}

/**
 * @param {Sequence} sequence
 * @param {Set<String>} traits
 * @param {String} name
 * @param {String} fuid
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function playMeleeAnimation(sequence, name, fuid, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Select the attack animation to use
    let attack = AzureCompendiaPresets.resolveWeapon(traits);
    if (!attack) {
        attack = AzureCompendiaPresets.resolveAttack(traits);
    }

    const gridSize = canvas.grid.size;
    const attackDelay = 250
    const dashDuration = 1250;
    const fadeOut = 500;

    // Optional skill if found
    if (traits.has('skill')){
        animateSkill(sequence, sourceToken, name, fuid);
    }

    // Animate leaving
    sequence.effect()
        .file(AzureCompendiaPresets.get('dash').animation)
        .playbackRate(2)
        .atLocation(sourceToken, {
            cacheLocation: true
        })
        //.stretchTo(target.token)  // Gust Of Wind
        .randomizeMirrorY()
        .belowTokens();

    for (const target of targets) {
        let hitPosition = Ray.towardsPoint(target.token.center, sourceToken.center, gridSize).B;
        const miss = target.data.result === "miss";
        const randomId = foundry.utils.randomID();

        // Animate the dash towards target
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
            .missed(miss)
            .duration(dashDuration)
            .fadeOut(fadeOut)
            .name(randomId)
            .animation()
            .on(sourceToken)
            .fadeOut(50)
            .waitUntilFinished()

        // Animate the hit
        playSoundEffect(sequence, attack);
        sequence.effect()
            .file(attack.animation)
            .atLocation(hitPosition)
            .rotateTowards(target.token)
            .missed(miss)
            .scaleToObject(1.25, {
                considerTokenScale: true
            })

        // Animate damage on token based on type
        if (!miss) {
            playAnimationOnToken(sequence, AzureCompendiaPresets.get(type), target.token)
            shakeTarget(sequence, sourceToken, target.token);
        }

        sequence.wait(attackDelay)
    }

    // Return
    sequence.wait(fadeOut)
    sequence.animation()
        .on(sourceToken)
        .fadeIn(500);
}

/**
 * @param {Sequence} sequence
 * @param {Set<String>} traits
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function playRangedAnimation(sequence, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Select the attack animation to use
    let attack = AzureCompendiaPresets.resolveWeapon(traits);
    if (!attack) {
        attack = AzureCompendiaPresets.resolveAttack(traits);
    }

    // Animate ranged attack from source to target
    for(const target of targets){
        const miss = target.data.result === "miss";
        playSoundEffect(sequence, attack);
        sequence.effect()
            .file(attack.animation)
            .atLocation(sourceToken)
            .missed(miss)
            .stretchTo(target.token)

        // Animate damage on token based on type
        playAnimationOnToken(sequence, AzureCompendiaPresets.get(type), target.token)
        shakeTarget(sequence, sourceToken, target.token);
    }
}

/**
 * @param {Sequence} sequence
 * @param {Token} sourceToken
 */
function animmateSpellCast(sequence, sourceToken) {
    const cast = AzureCompendiaPresets.get("spell");
    const section = playAnimationOnToken(sequence, cast, sourceToken, skillDuration);
    section.waitUntilFinished();
}

/**
 * @param {Sequence} sequence
 * @param {Set<String>} traits
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function playSpellAttack(sequence, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Animate spell circle
    animmateSpellCast(sequence, sourceToken);

    // Select the spell animation to use
    const multiple = targets.length > 1;
    const spell = AzureCompendiaPresets.resolveSpellAttack(type, multiple, traits);

    // If multiple targets..
    if (multiple) {
        const maxTargetY = Math.max(...targets.map(t => t.token.bounds.top));
        const maxTargetX = Math.max(...targets.map(t => t.token.bounds.right));
        const minTargetY = Math.min(...targets.map(t => t.token.bounds.bottom));
        const minTargetX = Math.min(...targets.map(t => t.token.bounds.left));
        const targetHeight = maxTargetY - minTargetY;
        const targetWidth = maxTargetX - minTargetX;
        const aoeScale = 2

        playSoundEffect(sequence, spell);
        const spellSequence= sequence.effect()
            .file(spell.animation)
            .atLocation({ x: maxTargetX - targetWidth / 2, y: maxTargetY - targetHeight / 2 })
            .size(Math.max(targetHeight, targetWidth) * aoeScale)

        if (spell.duration) {
            spellSequence.duration(spell.duration)
        }

        for (const target of targets) {
            const miss = target.data.result === "miss";
            if (!miss){
                playAnimationOnToken(sequence, AzureCompendiaPresets.get(type), target.token)
                shakeTarget(sequence, sourceToken, target.token);
            }
        }
    }
    else{
        // Animate ranged attack from source to target
        for(const target of targets){
            const miss = target.data.result === "miss";
            playSoundEffect(sequence, spell);
            sequence.effect()
                .file(spell.animation)
                .atLocation(sourceToken)
                .missed(miss)
                .stretchTo(target.token)

            // Animate damage on token based on type
            if (!miss){
                playAnimationOnToken(sequence, AzureCompendiaPresets.get(type), target.token)
                shakeTarget(sequence, sourceToken, target.token);
            }
        }
    }
}

/**
 * @param {Sequence} sequence
 * @param {String} name
 * @param {String} fuid
 * @param {Set<String>} traits
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function playSpell(sequence, name, fuid, traits, sourceToken, targets) {

    if (!sourceToken) {
        return;
    }

    // Animate spell circle
    animmateSpellCast(sequence, sourceToken);
    const spell = AzureCompendiaPresets.resolveSpell(name, fuid, traits);
    if (spell) {
        playAnimationOnToken(sequence, spell, sourceToken, 2);
    }
}

/**
 * @param {Sequence} sequence
 * @param {Preset} preset
 * @param token
 * @param {Number} scale
 * @returns {EffectSection}
 */
function playAnimationOnToken(sequence, preset, token, scale = 1) {
    if (!preset){
        return null;
    }

    const animation = preset.animation;
    Azurecompendia.log(`Playing animation ${animation} on token ${token.name}`);
    playSoundEffect(sequence, preset);
    let section = sequence.effect()
        .file(animation)
        .atLocation(token)
        .scaleToObject(scale, {
            considerTokenScale: true
        })


    if (preset.duration) {
        section.duration(preset.duration * 1000);
    }

    return section
}

/**
 * @param {Sequence} sequence
 * @param {Preset} preset
 * @param token
 * @returns {EffectSection}
 */
function playStatusChangeOnToken(sequence, preset, token) {
    if (!preset){
        return null;
    }

    playSoundEffect(sequence, preset);
    const maxY = token.bounds.top;
    const margin = 16;
    const position = { x: token.center.x, y: maxY - margin };
    let section = sequence.effect()
        .file(preset.animation)
        .atLocation(position)
        .scaleToObject(1, {
            considerTokenScale: true
        })

    if (preset.duration) {
        section.duration(preset.duration * 1000);
    }

    return section
}

export const AzureCompendiaSequences = Object.freeze({
    playSoundEffect,
    shakeTarget,
    playRangedAnimation,
    playAnimationOnToken,
    playMeleeAnimation,
    playSpellAttack,
    playSpell,
    playStatusChangeOnToken
})