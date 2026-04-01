import { AzureCompendiaEvents } from "./events.mjs";
import { Azurecompendia } from "./main.mjs";
import { AzureCompendiaSettings } from "./settings.mjs";
import {AzureCompendiaDatabase} from "./database.mjs";
import {AzureCompendiaTargeting} from "./targeting.mjs";

Hooks.once('init', () => {
    AzureCompendiaSettings.registerSettings();
    AzureCompendiaEvents.subscribe();
    AzureCompendiaTargeting.initialize()


    Hooks.on("sequencerReady", () => {
        Sequencer.Database.registerEntries(AzureCompendiaSettings.moduleId, AzureCompendiaDatabase.entries);
    });
    Azurecompendia.log('Hello World!');

    // TODO: Add something??
    // Hooks.on('projectfu.sheets.extensions', (extensions) => {
    //     if (extensions.party) {
    //         extensions.party.registerTab('fu-azure-compendia', {
    //             group: 'primary',
    //             active: 'false',
    //             label: 'Azure Compendia',
    //             icon: 'ra ra-book'
    //         },
    //             {
    //               template: 'modules/fu-azure-compendia/templates/party-sheet-tab.hbs'
    //             },
    //             (context) => {
    //         });
    //     }
    // });
});


