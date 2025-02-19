const moduleId = 'fu-azure-compendia';

// A key for each specific setting
export const keys = Object.freeze({
  enableAnimationSystem : "enableAnimationSystem",
  enableMeleeDash: "enableMeleeDash"
})

/**
 * Register module settings with Foundry.
 * @example https://foundryvtt.com/api/classes/client.ClientSettings.html#register
 */
function registerSettings() {

  game.settings.register(moduleId, keys.enableAnimationSystem, {
    name: "Enable Animation System",
    hint: "Whether to animate tokens due to combat events",
    scope: "world",  // "client" for per-user settings, "world" for global settings
    config: true,     // Show in settings menu
    type: Boolean,     // Data type: String, Number, Boolean, Object
    default: true,  // The default value for the setting
    requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
    onChange: value => console.log(`Animations enabled ? ${value}`)
  }); 

  game.settings.register(moduleId, keys.enableMeleeDash, {
    name: "Enable Melee Dash",
    hint: "Whether to animate characters dashing towards target to melee",
    scope: "world", 
    config: true,   
    type: Boolean,  
    default: true,  
    requiresReload: true,
    onChange: value => console.log(`Dash enabled ? ${value}`)
  }); 

}

function getSetting(key) {
  return game.settings.get(moduleId, key);
}

export const AzureCompendiaSettings = Object.freeze({
    registerSettings,
    getSetting,
    moduleId,
    keys,
});