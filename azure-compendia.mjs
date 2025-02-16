import { AzureCompendiaEvents } from "./module/events.mjs";
import { Azurecompendia } from "./module/main.mjs";
import { AzureCompendiaSettings } from "./module/settings.mjs";

Hooks.once('init', () => {
    AzureCompendiaSettings.registerSettings();
    AzureCompendiaEvents.subscribe();
});

Azurecompendia.log('Hello World!');


