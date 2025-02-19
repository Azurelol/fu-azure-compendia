import { AzureCompendiaEvents } from "./module/events.mjs";
import { Azurecompendia } from "./module/main.mjs";
import { AzureCompendiaSettings } from "./module/settings.mjs";
import {AzureCompendiaDatabase} from "./module/database.mjs";

Hooks.once('init', () => {
    AzureCompendiaSettings.registerSettings();
    AzureCompendiaEvents.subscribe();

    Hooks.on("sequencerReady", () => {
        Sequencer.Database.registerEntries(AzureCompendiaSettings.moduleId, AzureCompendiaDatabase.entries);
    });
});

Azurecompendia.log('Hello World!');


