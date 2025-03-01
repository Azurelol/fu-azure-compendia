import { AzureCompendiaEvents } from "./events.mjs";
import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import {AzureCompendiaDatabase} from "./database.mjs";

Hooks.once('init', () => {
    AzureCompendiaSettings.registerSettings();
    AzureCompendiaEvents.subscribe();

    Hooks.on("sequencerReady", () => {
        Sequencer.Database.registerEntries(AzureCompendiaSettings.moduleId, AzureCompendiaDatabase.entries);
    });
    Azurecompendia.log('Hello World!');
});


