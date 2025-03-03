import {Azurecompendia} from "./main.mjs";

/**
 * @description Filters managed by the system
 * @type {Map<any, any>}
 */
const tokenFilters = new Map();
const partyColor = new PIXI.Color("#00A2FF")
const adversaryColor = new PIXI.Color('#DC143C')
const alliedColor = new PIXI.Color('#00C957')

function toggleTokenOutline(combatant, token, enabled) {
    Azurecompendia.log(`Toggle Token Outline for ${token.name} (${token.disposition})  ? ${enabled}`)
    // https://api.pixijs.io/@pixi/filter-outline/PIXI/filters/OutlineFilter.html
    if (enabled) {
        const color = getDispositionColor(token.disposition);
        const filter = new PIXI.filters.OutlineFilter(1, color)
        gsap.to(filter, { thickness: 3, duration: 1, yoyo: true, repeat: -1});
        tokenFilters.set(token, filter);
        token.object.mesh.filters.push(filter)
    }
    else{
        const filter = tokenFilters.get(token);
        if (filter) {
            const index = token.object.mesh.filters.indexOf(filter);
            filter.destroy()
            token.object.mesh.filters.splice(index);
        }
    }
}

function clearTokenFilters(combatants) {
    for (const combatant of combatants) {
        const filtersToDestroy = combatant.token.object.mesh.filters;
        // Remove filters from the mesh
        combatant.token.object.mesh.filters = [];
        // Now safely destroy them
        filtersToDestroy.forEach(filter => {
            if (filter && typeof filter.destroy === "function") {
                filter.destroy();
            }
        });
    }
}

function getDisposition(index) {
    switch (index) {
        case -1: return "HOSTILE";
        case 1: return "FRIENDLY"
    }
    return "NEUTRAL";
}

function getDispositionColor(index) {
    const disposition = getDisposition(index)
    switch (disposition) {
        case "HOSTILE": return adversaryColor;
        case "FRIENDLY": return partyColor;
    }
    return alliedColor;
    // Foundry defaults
    // return CONFIG.Canvas.dispositionColors[getDisposition(index)];
}

export const AzureCompendiaFilters = Object.freeze({
    toggleTokenOutline,
    clearTokenFilters
})