// class Azurecompendia {

//     static ID = 'fu-azure-compendia';

//     static Tier = Object.freeze({
//         // In the heroic tier, your character is already a hero, set apart from the common people by your natural talents, 
//         // learned skills, and some hint of a greater destiny that lies before you.
//         // From L5+
//         Heroic: "heroic",
//         // In the paragon tier, your character is a shining example of heroism, set well apart from the masses.In the paragon tier, 
//         // your character is a shining example of heroism, set well apart from the masses.
//         // From L20+
//         Paragon: "paragon",
//         // In the epic tier, your character’s capabilities are truly superheroic. 
//         // From L40+
//         Epic: "epic"
//     });

//     static Effect = Object.freeze({
//         Minor: 0,
//         Heavy: 1,
//         Massive: 2
//     });

//     // Keys represent the level range cap (exclusive) per tier and must be in ascending order
//     static damagePerTier = new Map([
//         [this.Tier.Heroic, [10, 30, 40]],  // For levels 0+ apply these tier values
//         [this.Tier.Paragon, [20, 40, 60]], // For levels 20+ apply these tier values
//         [this.Tier.Epic, [30, 50, 80]], // For levels 40+ apply these tier values
//     ]);

//     // Gets the tier based from the level
//     static getCharacterTier(level) {
//         if (level >= 40) {
//             return this.Tier.Epic
//         }
//         else if (level >= 20) {
//             return this.Tier.Paragon
//         }
//         return this.Tier.Heroic
//     }

//     // Tier, Effect
//     static calculateImprovisedDamageFromTier(tier, effect) {
//         return 0
//         //const damage = damagePerTier[tier][effect]
//         //return damage
//     }

//     /**
//      * A small helper function which leverages developer mode flags to gate debug logs.
//      * 
//      * @param {boolean} force - forces the log even if the debug flag is not on
//      * @param  {...any} args - what to log
//    */
//     static logIf(force, ...args) {
//         const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

//         if (shouldLog) {
//             console.log(this.ID, '|', ...args);
//         }
//     }

//     /**
//      * A small helper function which leverages developer mode flags to gate debug logs.
//      * 
//      * @param  {...any} args - what to log
//     */
//     static log(...args) {
//         this.logIf(true, args)
//     }

// }

// Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
//     registerPackageDebugFlag(ToDoList.ID);
// });

// Azurecompendia.log('Hello World!');