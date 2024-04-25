import TestSeqAbility from "../sequelize_models/testAbility.js";
import TestSeqHero from "../sequelize_models/testHero.js";


describe("Ability queries", () =>
{
    beforeAll(async () =>
    {
        await TestSeqAbility.sync();
        await TestSeqHero.sync();

        // create some heroes to link the abilities to
        await TestSeqHero.create({
            heroName: "Naga Siren",
            baseStr: 30,
            baseAgi: 25,
            baseInt: 20,
            baseMs: 300
        });
        await TestSeqHero.create({
            heroName: "Visage",
            baseStr: 28,
            baseAgi: 21,
            baseInt: 16,
            baseMs: 280
        });
        await TestSeqHero.create({
            heroName: "Shadow Fiend",
            baseStr: 24,
            baseAgi: 26,
            baseInt: 20,
            baseMs: 300
        });
        await TestSeqHero.create({
            heroName: "Witch Doctor",
            baseStr: 21,
            baseAgi: 22,
            baseInt: 18,
            baseMs: 290
        });
        await TestSeqHero.create({
            heroName: "Techies",
            baseStr: 16,
            baseAgi: 18,
            baseInt: 14,
            baseMs: 270
        });
    });

    afterAll(async () =>
    {
        // Remove all Hero records after we are done with the Ability tests.
        await TestSeqHero.destroy({
            where: {},
           truncate: true
        });
    });

    beforeEach(async () =>
    {
        // Remove all records between tests.
        await TestSeqAbility.destroy({
            where: {},
            truncate: true
        });
    });

    it("should create and retrieve an ability", async () =>
    {
        const shadowFiend = await TestSeqHero.findOne({ where: { heroName: "Shadow Fiend" } });
        const shadowraze = await TestSeqAbility.create({
            abilityName: "Shadowraze",
            abilityManaCost: 75,
            abilityCooldown: 10,
            heroID: shadowFiend.heroID
        });

        const retrievedAbility = await TestSeqAbility.findOne({ where: { abilityID: shadowraze.AbilityID } });

        expect(retrievedAbility.abilityName).toBe("Shadowraze");
        expect(retrievedAbility.abilityManaCost).toBe(75);
    });

    it("should create, update, and retrieve an ability", async () =>
    {
        const shadowFiend = await TestSeqHero.findOne({ where: { heroName: "Shadow Fiend" } });
        const techies = await TestSeqHero.findOne({ where: { heroName: "Techies" } });
        const visage = await TestSeqHero.findOne({ where: { heroName: "Visage" } });
        await TestSeqAbility.create({
            abilityName: "Shadowraze",
            abilityManaCost: 75,
            abilityCooldown: 10,
            heroID: shadowFiend.heroID
        });
        await TestSeqAbility.create({
            abilityName: "Sticky Bomb",
            abilityManaCost: 100,
            abilityCooldown: 13,
            heroID: techies.heroID
        });
        let summonFamiliars = await TestSeqAbility.create({
            abilityName: "Summon Familiars",
            abilityManaCost: 150,
            abilityCooldown: 130,
            heroID: visage.heroID
        });

        const updatedAbilityData = {
            abilityManaCost: 300,
            abilityCooldown: 220
        };
        
        await summonFamiliars.update(updatedAbilityData);

        summonFamiliars = await TestSeqAbility.findOne({ where: { abilityName: "Summon Familiars" }});
        expect(summonFamiliars.abilityManaCost).toBe(300);
        expect(summonFamiliars.abilityCooldown).toBe(220);
        expect(summonFamiliars.heroID).toBe(visage.heroID);
    });

    it("should create abilities, delete an ability, and check that the ability is no longer present in the database", async () =>
    {
        const shadowFiend = await TestSeqHero.findOne({ where: { heroName: "Shadow Fiend" } });
        const techies = await TestSeqHero.findOne({ where: { heroName: "Techies" } });
        const visage = await TestSeqHero.findOne({ where: { heroName: "Visage" } });
        await TestSeqAbility.create({
            abilityName: "Shadowraze",
            abilityManaCost: 75,
            abilityCooldown: 10,
            heroID: shadowFiend.heroID
        });
        let stickyBomb = await TestSeqAbility.create({
            abilityName: "Sticky Bomb",
            abilityManaCost: 100,
            abilityCooldown: 13,
            heroID: techies.heroID
        });
        await TestSeqAbility.create({
            abilityName: "Summon Familiars",
            abilityManaCost: 150,
            abilityCooldown: 130,
            heroID: visage.heroID
        });

        await stickyBomb.destroy();

        stickyBomb = await TestSeqAbility.findOne({ where: { abilityName: "Sticky Bomb" } });
        expect(stickyBomb).toBe(null);
    });
});
