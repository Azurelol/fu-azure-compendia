import {Azurecompendia} from "./main.mjs";
import {AzureCompendiaPresets} from "./presets.mjs";
import {AzureCompendiaSettings} from "./settings.mjs";

function isTooClose(source, target) {
    const gridSize = canvas.grid.size;
    return (target.bounds.pad(gridSize * (0.5), gridSize * (0.5))).intersects(source.bounds);
}

// Constants
const skillScale = 1.5;

/**
 * @typedef Ray
 * @description A ray for the purposes of computing sight and collision Given points A[x,y] and B[x,y]
 * @property distance The distance (length) of the Ray in pixels. The distance is computed lazily (only if required) and cached.
 * @remarks https://foundryvtt.com/api/classes/client.Ray.html
 */

/**
 * @param {Sequence} sequence
 * @param {Preset} preset
 */
function playSoundEffect(sequence, preset) {
    if (!preset.sound) {
        return;
    }
    if (!AzureCompendiaSettings.isEnabled(AzureCompendiaSettings.keys.playSounds)) {
        return;
    }

    Azurecompendia.log(`Playing sound ${preset.sound}`);

    let section = sequence
        .sound()
        .file(preset.sound)
        .volume(AzureCompendiaSettings.getVolume())


    if (preset.duration) {
        const duration = preset.duration * 1000;
        section.timeRange(0, duration).fadeOutAudio(duration)
    }
}

/**
 * @param {Sequence} sequence
 * @param {Token} source
 * @param {Token} target
 */
function dodgeTarget(sequence, source, target) {
    if (!AzureCompendiaSettings.isEnabled(AzureCompendiaSettings.keys.dodgeOnMiss)) {
        return;
    }
    // Record the starting position of target
    // Get ray from source to target
    let hitRay = new Ray(source.center, target.center);
    // Get a new ray from the target to the dodge point
    // using the angle from the hitRay drawn from the source to target.
    const distanceMod = 50;
    const dodgeRay = Ray.fromAngle(target.x, target.y, hitRay.angle, distanceMod);
    const dodgeSpeed = 3;
    // Move away from target then back, with given move speed.
    // The return animation timing seems to fail some of the time due to a race condition.
    sequence.animation()
        .on(target)
        .moveTowards(dodgeRay.B, {ease: 'easeInOutSine'})
        .moveSpeed(dodgeSpeed)
        // Without this millisecond extra delay, the return animation always fails.
        // With the delay it still fails some of the time.
        .waitUntilFinished(1)
        .animation()
        .on(target)
        .moveTowards(dodgeRay.A, {ease: 'easeInOutSine'})
        .moveSpeed(dodgeSpeed)
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

/**
 * @param {Sequence} sequence
 * @param {Token} sourceToken
 * @param {ItemReference} item
 * @param {Set<String>} traits
 */
function animateSkill(sequence, sourceToken, item, traits) {
    const skill = AzureCompendiaPresets.resolveAction(item, traits);
    if (skill) {
        if (!skill.sound) {
            playSoundEffect(sequence, AzureCompendiaPresets.get('skill'))
        }
        const section = playAnimationOnToken(sequence, skill, sourceToken, skillScale);
        section.waitUntilFinished();
    }
}

const missPreset = AzureCompendiaPresets.get('miss');
const criticalPreset = AzureCompendiaPresets.get('critical');
const fumblePreset = AzureCompendiaPresets.get('fumble');


function animateCheck(sequence, miss, traits, token) {
    if (!AzureCompendiaSettings.isEnabled(AzureCompendiaSettings.keys.animateCheck)) {
        return;
    }
    if (miss) {
        playSoundEffect(sequence, missPreset);
        return true;
    }
    else if (traits.has('critical')) {
        playSoundEffect(sequence, criticalPreset);
        //playAnimationOnToken(sequence, criticalPreset, token);
        return true;
    }
    else if (traits.has('fumble')) {
        playSoundEffect(sequence, fumblePreset);
        //playAnimationOnToken(sequence, fumblePreset, token);
        return true;
    }
    return false;
}

/**
 * @param {Sequence} sequence
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function animateMeleeDash(sequence, item, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Select the attack animation to use
    const attack = AzureCompendiaPresets.resolveAttack(item, traits);

    const gridSize = canvas.grid.size;
    const attackDelay = 250
    const dashDuration = 1250;
    const fadeOut = 500;

    // Optional skill if found
    if (traits.has('skill')){
        animateSkill(sequence, sourceToken, item, traits);
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
        let dash = sequence.effect()
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

        // Animate the hit
        playSoundEffect(sequence, attack);
        sequence.effect()
            .file(attack.animation)
            .atLocation(hitPosition)
            .rotateTowards(target.token)
            .missed(miss)
            .scaleToObject(2)
            .waitUntilFinished(-1250)

        animateDamageTaken(sequence, sourceToken, target.token, type, traits, miss);
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
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function animateMeleeAttack(sequence, item, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Select the attack animation to use
    const attack = AzureCompendiaPresets.resolveAttack(item, traits);
    const gridSize = canvas.grid.size;

    // Optional skill if found
    if (traits.has('skill')){
        animateSkill(sequence, sourceToken, item, traits);
    }

    for (const target of targets) {
        let hitPosition = Ray.towardsPoint(target.token.center, sourceToken.center, gridSize).B;
        const miss = target.data.result === "miss";
        // Animate the attack
        playSoundEffect(sequence, attack);
        sequence.effect()
            .file(attack.animation)
            .atLocation(target.token)
            .missed(miss)
            .scaleToObject(1.5)
        animateDamageTaken(sequence, sourceToken, target.token, type, traits, miss);
    }
}

/**
 * @param {Sequence} sequence
 * @param {Token} sourceToken
 * @param {Token} targetToken
 * @param {String} type
 * @param {Set<String>} traits
 * @param {Boolean} miss
 */
function animateDamageTaken(sequence, sourceToken, targetToken, type, traits, miss) {
    animateCheck(sequence, miss, traits, targetToken)
    if (!miss) {
        playAnimationOnToken(sequence, AzureCompendiaPresets.get(type), targetToken)
        shakeTarget(sequence, sourceToken, targetToken);
    }
    else{
        dodgeTarget(sequence, sourceToken, targetToken);
    }
}

/**
 * @param {Sequence} sequence
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function playRangedAnimation(sequence, item, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Select the attack animation to use
    const attack = AzureCompendiaPresets.resolveAttack(item, traits);

    // Animate ranged attack from source to target
    for(const target of targets){
        const miss = target.data.result === "miss";
        playSoundEffect(sequence, attack);

        if (attack.stretch){
            sequence.effect()
                .file(attack.animation)
                .atLocation(sourceToken)
                .missed(miss)
                .stretchTo(target.token)
        }
        else {
            let nsa = sequence.effect()
                .file(attack.animation)
                .atLocation(target.token)
                .missed(miss)
            if (attack.duration) {
                nsa.duration(attack.duration * 1000)
            }
        }

        animateDamageTaken(sequence, sourceToken, target.token, type, traits, miss);
    }
}

/**
 * @param {Sequence} sequence
 * @param {Token} sourceToken
 */
function animmateSpellChannel(sequence, sourceToken) {
    const cast = AzureCompendiaPresets.get("spell");
    const section = playAnimationOnToken(sequence, cast, sourceToken, skillScale);
    section.waitUntilFinished();
}

/**
 * @param {Sequence} sequence
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @param {String} type
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function playSpellAttack(sequence, item, traits, type, sourceToken, targets) {
    if (!sourceToken || !targets || targets.length === 0) {
        return;
    }

    // Animate spell circle
    animmateSpellChannel(sequence, sourceToken);

    // Select the spell animation to use
    const multiple = targets.length > 1;
    const preset = AzureCompendiaPresets.resolveSpellAttack(item, type, multiple, traits);
    const spell = preset.preset;

    // If multiple targets..
    if (multiple && preset.aoe) {
        console.log(`Animating AOE Spell from ${sourceToken.name}`)
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
            spellSequence.duration(spell.duration * 1000)
        }

        // Animate damage
        for (const target of targets) {
            const miss = target.data.result === "miss";
            animateDamageTaken(sequence, sourceToken, target.token, type, traits, miss);
        }
    }
    else{
        // Animate ranged attack from source to target
        //playSoundEffect(sequence, AzureCompendiaPresets.get(multiple ? 'launchMultiple' : 'launchSingle'))
        for(const target of targets){
            const miss = target.data.result === "miss";
            playSoundEffect(sequence, spell);
            let atk = sequence.effect()
                .file(spell.animation)
                .atLocation(sourceToken)
                .missed(miss)
                .stretchTo(target.token)
            animateDamageTaken(atk, sourceToken, target.token, type, traits, miss);
        }
    }
}

/**
 * @param {Sequence} sequence
 * @param {ItemReference} item
 * @param {Set<String>} traits
 * @param {Token} sourceToken
 * @param {EventTarget[]} targets
 */
function animateSpell(sequence, item, traits, sourceToken, targets) {
    if (!sourceToken) {
        return;
    }
    const spell = AzureCompendiaPresets.resolveAction(item, traits);
    if (spell) {
        playAnimationOnToken(sequence, spell, sourceToken, 2);
    }
    else{
        animmateSpellChannel(sequence, sourceToken);
    }
}

/**
 * @param {Sequence} sequence
 * @param {ItemReference} item
 * @param {String} type
 * @param actor
 * @param token
 * @param {EventTarget[]} targets
 */
function animateItem(sequence, item, type, actor, token, targets){

    let preset = AzureCompendiaPresets.get(type);

    // If there's targets, throw the item
    if (targets.length > 0){
        // Animate ranged attack from source to target
        for(const target of targets){
            playSoundEffect(sequence, preset);
            sequence.effect()
                .file(preset.animation)
                .atLocation(token)
                .stretchTo(target.token)
                .waitUntilFinished()
            playAnimationOnToken(sequence, AzureCompendiaPresets.get('splash'), target.token);
        }
    }
    // Otherwise, use self? Perhaps not needed as IP is spent
    else{
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
function animateEffectAboveToken(sequence, preset, token) {
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

/**
 * @param {Sequence} sequence
 * @param actor
 * @param token
 * @returns {EffectSection|null}
 */
function playDefeatAnimation(sequence, actor, token){
    if (!AzureCompendiaSettings.isEnabled(AzureCompendiaSettings.keys.fadeOnDefeat)) {
        return null;
    }

    const isPC = token.document.disposition === 1;
    if (isPC) {
        return;
    }

    const rank = actor.system.rank.value;
    // TODO: Different animation for elites, champions

    const defeatDuration = 3;

    sequence
        .animation(token)
            .fadeOut(defeatDuration * 1000)
            .waitUntilFinished()
        .animation(token)
            .hide(true)
            .fadeIn(0)
}

export const AzureCompendiaSequences = Object.freeze({
    playSoundEffect,
    shakeTarget,
    playRangedAnimation,
    playAnimationOnToken,
    animateMeleeDash,
    animateMeleeAttack,
    playSpellAttack,
    animateSpell,
    animateSkill,
    animateItem,
    playDefeatAnimation,
    animateEffectAboveToken,
})