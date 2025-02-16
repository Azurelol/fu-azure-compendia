const moduleId = 'fu-azure-compendia';

// A key for each specific setting
export const keys = Object.freeze({
  enableSoundEffects : "enableSoundEffects"
})

/**
 * Register module settings with Foundry.
 * @example https://foundryvtt.com/api/classes/client.ClientSettings.html#register
 */
function registerSettings() {

  game.settings.register(moduleId, keys.enableSoundEffects, {
    name: "Enable Event Sound Effects",
    hint: "Whether to play sound effects during events",
    scope: "world",  // "client" for per-user settings, "world" for global settings
    config: true,     // Show in settings menu
    type: Boolean,     // Data type: String, Number, Boolean, Object
    default: false,  // The default value for the setting
    requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
    onChange: value => console.log(`Setting changed to: ${value}`)
}); 
}

function getSetting(key) {
  return game.settings.get(moduleId, key);
}

export const AzureCompendiaSettings = Object.freeze({
    registerSettings,
    getSetting,
    keys,
});