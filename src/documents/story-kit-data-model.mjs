/**
 *
 */
export class StoryKitDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            hooks: new fields.ArrayField(
                new fields.StringField(),
                { required: true, initial: [] }, { max: 3}
            ),
            introduction: new fields.HTMLField({ required: true }),
            // Act as timers, rolled to build tension
            pressurePools: new fields.ArrayField(
                new fields.SchemaField({
                    title: new fields.StringField({ required: true }),
                    entries: new fields.ArrayField(new fields.StringField())
                })
            ),

            sections: new fields.ArrayField(
                new fields.SchemaField({
                    title: new fields.StringField({ required: true }),
                    content: new fields.HTMLField()
                })
            ),

            setup: new fields.ArrayField(
                new fields.SchemaField({
                    title: new fields.StringField({ required: true }),
                    checklist: new fields.ArrayField(new fields.StringField(), { max: 3})
                })
            ),

            mixItUp: new fields.StringField()
        };
    }
}
