const moduleId = 'fu-azure-compendia';

// A key for each specific setting
const keys = Object.freeze({
  enableAnimationSystem : "enableAnimationSystem",
  playSounds: "playSounds",
  dashOnMelee: "dashOnMelee",
  fadeOnDefeat: "fadeOnDefeat",
  dodgeOnMiss: 'dodgeOnMiss',
})

/**
 * Register module settings with Foundry.
 * @example https://foundryvtt.com/api/classes/client.ClientSettings.html#register
 */
function registerSettings() {
  registerToggle(keys.enableAnimationSystem, "Combat Tuned Realistic Pose and Locomotion Rendering", "Animate canvas tokens on combat events");
  registerToggle(keys.playSounds, "Play Sounds", "Whether sounds are enabled");
  registerToggle(keys.dashOnMelee, "Dash on Melee", "Whether for tokens to dash towards target on melee attacks");
  registerToggle(keys.fadeOnDefeat, "Fade on KO", "Whether to fade out NPC tokens on defeat");
  registerToggle(keys.dodgeOnMiss, "Dodge On Miss", "Whether to animate tokens dodging attacks on a missed check")
}

function registerToggle(key, name, hint) {
  game.settings.register(moduleId, key, {
    name: name,
    hint: hint,
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: value => console.log(`${name}? ${value}`)
  });
}

function getSetting(key) {
  return game.settings.get(moduleId, key);
}

function isEnabled(key) {
  const value = getSetting(key);
  return value === true;
}

export const AzureCompendiaSettings = Object.freeze({
    registerSettings,
    getSetting,
    isEnabled,
    moduleId,
    keys,
});