import {Azurecompendia} from "./main.mjs";
import {moduleId} from "./settings.mjs";

async function updateAdversaries() {
    Azurecompendia.log("Updating adversaries...");
    // const actorPacks = game.packs.filter(p =>
    //     p.metadata.packageName === moduleId && p.documentName === "Actor"
    // );


    const pack = game.packs.get(`${moduleId}.adversaries`);
    await pack.configure({ locked: false });
    const index = await pack.getIndex(); // Collection of { _id, name, type, img }

    let entries = []
    for (const entry of index) {
        if (entry.type === 'npc') {
            entries.push(entry);
        }
    }

    // TODO: Confirm with dialog
    let confirm = false;
    if (confirm) {
        for (const entry of entries) {
            const actor = await pack.getDocument(entry._id);
            if (actor) {
                // TODO: Remove unarmed strikes, migrate all items
                console.debug(`Updating ${actor.name}`)
            }
        }
    }


}

export const AzureCompendiaUtils = {
    updateAdversaries,
};
