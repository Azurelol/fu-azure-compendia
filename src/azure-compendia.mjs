import { AzureCompendiaEvents } from "./events.mjs";
import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import {AzureCompendiaDatabase} from "./database.mjs";
import {StoryKitSheet} from "./documents/story-kit-sheet.mjs";
import {StoryKitDataModel} from "./documents/story-kit-data-model.mjs";

/**
 * Preloads templates for partials
 */
function preloadTemplates()
{
    let templates = [
        //"partials/pressure-pool",
    ];

    templates = templates.map((t) => AzureCompendiaSettings.getTemplatePath(t));
    foundry.applications.handlebars.loadTemplates(templates);
}

// Invoked by the foundry system
Hooks.once('init', () => {
    AzureCompendiaSettings.registerSettings();
    AzureCompendiaEvents.subscribe();

    // Set up sequencer
    Hooks.on("sequencerReady", () => {
        Sequencer.Database.registerEntries(AzureCompendiaSettings.moduleId, AzureCompendiaDatabase.entries);
    });
    // Register documents
    CONFIG.JournalEntryPage.dataModels[AzureCompendiaSettings.prefixed("storyKit")] = StoryKitDataModel;
    foundry.applications.apps.DocumentSheetConfig.registerSheet(JournalEntryPage, AzureCompendiaSettings.moduleId, StoryKitSheet, {
        types: [AzureCompendiaSettings.prefixed("storyKit")],
        label: 'Story Kit Page',
        makeDefault: false,
    });

    // Load templates
    preloadTemplates();
    // Emit salutations
    Azurecompendia.log('Hello World!');
});


