class Azurecompendia {

    /**
     * The id of the package in the manifest
     */
    static ID = 'fu-azure-compendia';

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

    /**
     * Behaves like C# string format
     * @param {*} s 
     * @param  {...any} args 
     * @returns 
     */
    static fmt(s, ...args) {
        for (var arg in args) {
            s = s.replace("{" + arg + "}", args[arg]);
        }
        return s;
    };

    Definition

    /**
     * The character tier
     */
    static Tier = Object.freeze({
        // In the heroic tier, your character is already a hero, set apart from the common people by your natural talents, 
        // learned skills, and some hint of a greater destiny that lies before you.
        // From L5+
        Heroic: 0,
        // In the paragon tier, your character is a shining example of heroism, set well apart from the masses.In the paragon tier, 
        // your character is a shining example of heroism, set well apart from the masses.
        // From L20+
        Paragon: 1,
        // In the epic tier, your character’s capabilities are truly superheroic. 
        // From L40+
        Epic: 2
    });

    /**
     * The effect level
     */
    static Effect = Object.freeze({
        Minor: 0,
        Heavy: 1,
        Massive: 2
    });
    
    static effectList = [
        {
          label: "Minor",
          value: "0",
        },
        {
          label: "Heavy",
          value: "1",
        },
        {
          label: "Massive",
          value: "2",
        }
      ];

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
    static damageTypeData = [
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

    /**
     * @param {Tier} tier The character tier
     * @param {Effect} effect The effect level
     * @returns 
     */
    static calculateImprovisedScalar(tier, effect) {
        const damage = this.damagePerTier[tier][effect]
        return damage
    }

    /**
     * @param {number} level The level of the character
     * @returns The character tier
     */
    static getCharacterTier(level) {
        if (level >= 40) {
            return this.Tier.Epic
        }
        else if (level >= 20) {
            return this.Tier.Paragon
        }
        return this.Tier.Heroic
    }

    static getSelectedActor(){
        let tokens  = canvas.tokens.controlled
        if (tokens.length > 0) {
            return tokens.at(0).actor
        }
        console.warn("No token selected")
        return null
    }

    static getActorLevel(actor) {
        return actor?.system?.level?.value ?? 0;
    }

    static getActorTier(actor){
        const level = this.getActorLevel(actor)
        return this.getCharacterTier(level)
    }

    static forSelectedActors() {
        
    }

    static gainHitPointsForSelection(effect) {
        const actor = this.getSelectedActor()
        if (actor == null) {
            return
        }

        const tier = this.getActorTier(actor)
        const amount = this.calculateImprovisedScalar(tier, effect)
        const newAmount = actor.system.resources.hp.value + amount;
        actor.update({'system.resources.hp.value': Math.min(newAmount, actor.system.resources.hp.max)});

        ChatMessage.create({
            user: game.user._id,
            content: `<b>${actor.name}</b> gains <b>${amount}</b> hit points`
          });
    }

    static gainMindPointsForSelection(effect) {
        const actor = this.getSelectedActor()
        if (actor == null) {
            return
        }

        const tier = this.getActorTier(actor)
        const amount = this.calculateImprovisedScalar(tier, effect)
        const newAmount = actor.system.resources.mp.value + amount;
        actor.update({'system.resources.mp.value': Math.min(newAmount, actor.system.resources.mp.max)});

        ChatMessage.create({
            user: game.user._id,
            content: `<b>${actor.name}</b> gains <b>${amount}</b> mind points`
          });
    }

    static loseMindPointsForSelection(effect) {
        const actor = this.getSelectedActor()
        if (actor == null) {
            return
        }

        const tier = this.getActorTier(actor)
        const amount = this.calculateImprovisedScalar(tier, effect)
        const newAmount = actor.system.resources.mp.value - amount;
        actor.update({'system.resources.mp.value': Math.min(0, newAmount)});

        ChatMessage.create({
            user: game.user._id,
            content: `<b>${actor.name}</b> loses <b>${amount}</b> mind points`
          });
    }
}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(ToDoList.ID);
});

Azurecompendia.log('Hello World!');