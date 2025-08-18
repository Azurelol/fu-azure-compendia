const fields = foundry.data.fields;

const stringOptions = { required: true };

/**
 * @description Acts as a timer, rolled to build escalation and keep things moving
 */
export class PressurePoolDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new fields.StringField({ required: true, initial: "" }),
            clock: new fields.NumberField({ initial: 6, min: 0, max: 6, integer: true }),
            event1: new fields.StringField({ required: true, initial: "" }),
            event2: new fields.StringField({ required: true, initial: "" }),
            event3: new fields.StringField({ required: true, initial: "" }),
        };
    }
}

/**
 * Useful pieces, props, NPCs and more that form the backbone.
 */
export class ThreadDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new fields.StringField({ required: true, initial: "Label" }),
            description: new fields.StringField({ required: true, initial: "" }),
            entry1: new fields.StringField({ required: true, initial: "" }),
            entry2: new fields.StringField({ required: true, initial: "" }),
            entry3: new fields.StringField({ required: true, initial: "" }),
        };
    }
}

export class SetupDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new fields.StringField({ required: true, initial: "" }),
            description: new fields.StringField({ required: true, initial: "" }),
            extended: new fields.BooleanField({required:true}),
            choices: new fields.ArrayField(new fields.SchemaField({
                text: new fields.StringField({required:true}),
                checked: new fields.BooleanField()
            }),  { required: true, validate: (value, model) => {
                    if (model.source.extended) {
                        while (value.length < 10) {
                            value.push({ text: "", checked: false });
                        }
                    }
                    else {
                        while (value.length < 5) {
                            value.push({ text: "", checked: false });
                        }
                        if (value.length > 5) {
                            value.splice(5);
                        }
                    }
                },},),
        };
    }
}

export class ChallengeDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new fields.StringField({ required: true, initial: "" }),
            clock: new fields.NumberField({ initial: 0, min: 0, max: 8, integer: true }),
            linked: new fields.BooleanField({required:true}),
            traits: new fields.ArrayField(new fields.StringField({required:true}), { validate: (value) => {
                    while (value.length < 3) {
                        value.push("");
                    }
                }}),
            moves: new fields.ArrayField(new fields.StringField({required:true}), { validate: (value) => {
                    while (value.length < 3) {
                        value.push("");
                    }
                }}),
            failState: new fields.StringField({required:true}),
            description: new fields.HTMLField({ required: true, initial: "" }),
        };
    }

    get valid() {
        return this.label !== ""
    }

    get hasMoves() {
        return this.moves.filter(t => t.length > 0).length > 0;
    }

    get hasFailState(){
        return this.failState !== ""
    }
}

export class StoryKitDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {

        return {
            // Hooks
            hook1: new fields.StringField(stringOptions),
            hook2: new fields.StringField(stringOptions),
            hook3: new fields.StringField(stringOptions),
            // Introduction blurb
            introduction: new fields.HTMLField({ required: true }),
            // Pressure Pools
            prelude: new fields.EmbeddedDataField(PressurePoolDataModel, {}),
            escalation: new fields.EmbeddedDataField(PressurePoolDataModel, {}),
            climax: new fields.EmbeddedDataField(PressurePoolDataModel, {}),
            // Threads
            thread1: new fields.EmbeddedDataField(ThreadDataModel, {}),
            thread2: new fields.EmbeddedDataField(ThreadDataModel, {}),
            thread3: new fields.EmbeddedDataField(ThreadDataModel, {}),
            // Setup
            setup1: new fields.EmbeddedDataField(SetupDataModel, {}),
            setup2: new fields.EmbeddedDataField(SetupDataModel, {}),
            setup3: new fields.EmbeddedDataField(SetupDataModel, {}),
            // Challenges
            challenge1: new fields.EmbeddedDataField(ChallengeDataModel, {}),
            challenge2: new fields.EmbeddedDataField(ChallengeDataModel, {}),
            challenge3: new fields.EmbeddedDataField(ChallengeDataModel, {}),
            challenge4: new fields.EmbeddedDataField(ChallengeDataModel, {}),
            // Mix it up
            twist: new fields.StringField(),
            author: new fields.StringField()
        };
    }
}
