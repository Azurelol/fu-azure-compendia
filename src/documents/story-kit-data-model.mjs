const fields = foundry.data.fields;

const stringOptions = { required: true };

/**
 * @description Acts as a timer, rolled to build escalation and keep things moving
 */
export class PressurePoolDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            label: new fields.StringField({ required: true, initial: "Pool Label" }),
            size: new fields.NumberField({ initial: 6, min: 0, max: 6, integer: true }),
            event1: new fields.StringField({ required: true, initial: "Event 1" }),
            event2: new fields.StringField({ required: true, initial: "Event 2" }),
            event3: new fields.StringField({ required: true, initial: "Event 3" }),
        };
    }
}

export class ThreadDataModel extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            description: new fields.StringField({ required: true, initial: "Label: Succinct paragraph." }),
            entry1: new fields.StringField({ required: true, initial: "Entry 1" }),
            entry2: new fields.StringField({ required: true, initial: "Entry 2" }),
            entry3: new fields.StringField({ required: true, initial: "Entry 3" }),
        };
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
            setup: new fields.ArrayField(
                new fields.SchemaField({
                    title: new fields.StringField({ required: true }),
                    checklist: new fields.ArrayField(new fields.StringField(), { max: 3})
                })
            ),
            mixItUp: new fields.StringField(),
            author: new fields.StringField()
        };
    }
}
