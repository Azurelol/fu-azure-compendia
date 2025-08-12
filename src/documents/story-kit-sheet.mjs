import {AzureCompendiaSettings} from "../settings.mjs";

export class StoryKitSheet extends foundry.applications.sheets.journal.JournalEntryPageHandlebarsSheet   {
    /** @override */
    static DEFAULT_OPTIONS = {
        classes: ["story-kit"],
        window: {
            icon: "fa-brands fa-markdown"
        }
    };

    /** @inheritDoc */
    static EDIT_PARTS = {
        header: super.EDIT_PARTS.header,
        content: {
            template: AzureCompendiaSettings.getTemplatePath("journal/pages/story-kit-edit")
        },
        footer: super.EDIT_PARTS.footer
    };

    /** @override */
    static VIEW_PARTS = {
        content: {
            template: AzureCompendiaSettings.getTemplatePath("journal/pages/story-kit-view"),
            classes: ["story-kit"],
            root: true
        }
    };
}
