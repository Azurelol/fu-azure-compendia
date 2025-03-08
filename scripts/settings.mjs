const moduleId = 'fu-azure-compendia';

// A key for each specific setting
const keys = Object.freeze({
  enableAnimationSystem : "enableAnimationSystem",
  playSounds: "playSounds",
  volume: "volume",
  dashOnMelee: "dashOnMelee",
  fadeOnDefeat: "fadeOnDefeat",
  dodgeOnMiss: 'dodgeOnMiss',
  animateCheck: 'animateCheck',
  animateCombatEvent: 'animateCombatEvent',
})

/**
 * Register module settings with Foundry.
 * @example https://foundryvtt.com/api/classes/client.ClientSettings.html#register
 */
function registerSettings() {
  registerToggle(keys.enableAnimationSystem, "Combat Tuned Realistic Pose and Locomotion Rendering", "Animate canvas tokens based on combat events (attack, spells, skills)", true);
  registerToggle(keys.playSounds, "Play Sounds", "Whether sounds are enabled");
  registerToggle(keys.dashOnMelee, "Dash on Melee", "Whether for tokens to dash towards target on melee attacks");
  registerToggle(keys.fadeOnDefeat, "Fade on KO", "Whether to fade out NPC tokens on defeat");
  registerToggle(keys.dodgeOnMiss, "Dodge On Miss", "Whether to animate tokens dodging attacks on a missed check");
  registerToggle(keys.animateCheck, 'Animate Check', "Whether to show text for the result of the check on targeted tokens");
  registerToggle(keys.animateCombatEvent, 'Animate Combat Events', "Whether to animate combat lifetime events (turns, rounds, etc)");
  registerSlider(keys.volume, "Volume", "The volume of sound effects", 0.25, 0, 1, 0.1);
}

function registerToggle(key, name, hint, reload = false) {
  game.settings.register(moduleId, key, {
    name: name,
    hint: hint,
    scope: "world",
    config: true,
    type: Boolean,
    requiresReload: reload,
    default: true,
    onChange: value => console.log(`${name}? ${value}`)
  });
}

function registerSlider(key, name, hint, base, min, max, step) {
  game.settings.register(moduleId, key, {
    name: name,
    hint: hint,
    scope: "client",
    config: true,
    default: base,
    type: Number,
    range: {
      min: min,
      max: max,
      step: step
    }});
}

function getSetting(key) {
  return game.settings.get(moduleId, key);
}

function isEnabled(key) {
  const value = getSetting(key);
  return value === true;
}

/**
 * @returns {Number}
 */
function getVolume() {
  return getSetting(keys.volume);
}

export const AzureCompendiaSettings = Object.freeze({
    registerSettings,
    getSetting,
    isEnabled,
    moduleId,
    keys,
    getVolume
});