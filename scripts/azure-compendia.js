class Azurecompendia {

    /**
     * The id of the package in the manifest
     */
    static ID = 'fu-azure-compendia';

    /**
     * The character tier
     */
    static Tier = Object.freeze({
        // In the heroic tier, your character is already a hero, set apart from the common people by your natural talents, 
        // learned skills, and some hint of a greater destiny that lies before you.
        // From L5+
        Heroic: "heroic",
        // In the paragon tier, your character is a shining example of heroism, set well apart from the masses.In the paragon tier, 
        // your character is a shining example of heroism, set well apart from the masses.
        // From L20+
        Paragon: "paragon",
        // In the epic tier, your character’s capabilities are truly superheroic. 
        // From L40+
        Epic: "epic"
    });

    /**
     * The effect level
     */
    static Effect = Object.freeze({
        Minor: 0,
        Heavy: 1,
        Massive: 2
    });

    /**
     * Damage per character tier and effect level
     */
    static damagePerTier = {
        [this.Tier.Heroic]: [10, 30, 40],
        [this.Tier.Paragon]: [20, 40, 60],
        [this.Tier.Epic]: [30, 50, 80],
    }

    /**
    * An array of damage types
    */
    static damageTypes = [
        {
            label: "Physical",
            value: "physical",
            icon: "<i class=\"fun fu-phys\"></i>"
        },
        {
            label: "Air",
            value: "air",
            icon: "<i class=\"fun fu-wind\"></i>"
        },
        {
            label: "Bolt",
            value: "bolt",
            icon: "<i class=\"fun fu-bolt\"></i>"
        },
        {
            label: "Dark",
            value: "dark",
            icon: "<i class=\"fun fu-dark\"></i>"
        },
        {
            label: "Earth",
            value: "earth",
            icon: "<i class=\"fun fu-earth\"></i>"
        },
        {
            label: "Fire",
            value: "fire",
            icon: "<i class=\"fun fu-fire\"></i>"
        },
        {
            label: "Ice",
            value: "ice",
            icon: "<i class=\"fun fu-ice\"></i>"
        },
        {
            label: "Light",
            value: "light",
            icon: "<i class=\"fun fu-light\"></i>"
        },
        {
            label: "Poison",
            value: "poison",
            icon: "<i class=\"fun fu-poison\"></i>"
        },
        {
            label: "Untyped",
            value: "untyped",
            icon: "<i class=\"fun ful-martial\"></i>"
        }
    ];

    // Tier, Effect
    static calculateImprovisedDamage(tier, effect) {
        const damage = this.damagePerTier[tier][effect]
        return damage
    }

    // Gets the tier based from the level
    static getCharacterTier(level) {
        if (level >= 40) {
            return this.Tier.Epic
        }
        else if (level >= 20) {
            return this.Tier.Paragon
        }
        return this.Tier.Heroic
    }


    /**
     * A small helper function which leverages developer mode flags to gate debug logs.
     * 
     * @param {boolean} force - forces the log even if the debug flag is not on
     * @param  {...any} args - what to log
   */
    static logIf(force, ...args) {
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

        if (shouldLog) {
            console.log(this.ID, '|', ...args);
        }
    }

    /**
     * A small helper function which leverages developer mode flags to gate debug logs.
     * 
     * @param  {...any} args - what to log
    */
    static log(...args) {
        this.logIf(true, args)
    }

}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(ToDoList.ID);
});

Azurecompendia.log('Hello World!');