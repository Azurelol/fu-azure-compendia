import { AzureCompendiaEvents } from "./events.mjs";
import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import {AzureCompendiaDatabase} from "./database.mjs";
import {StoryKitSheet} from "./documents/story-kit-sheet.mjs";
import {StoryKitDataModel} from "./documents/story-kit-data-model.mjs";

Hooks.once('init', () => {
    AzureCompendiaSettings.registerSettings();
    AzureCompendiaEvents.subscribe();

    // Set up sequencer
    Hooks.on("sequencerReady", () => {
        Sequencer.Database.registerEntries(AzureCompendiaSettings.moduleId, AzureCompendiaDatabase.entries);
    });
    // Register documents
    CONFIG.JournalEntryPage.dataModels["storyKit"] = StoryKitDataModel;
    foundry.applications.apps.DocumentSheetConfig.registerSheet(JournalEntryPage, AzureCompendiaSettings.moduleId, StoryKitSheet, {
        types: ["fu-azure-compendia.storyKit"],
        label: 'Story Kit Page',
        makeDefault: false,
    });

    Azurecompendia.log('Hello World!');
});


