import TestSeqHero from "../sequelize_models/testHero.js";
import { Sequelize } from "sequelize";


describe("Hero queries", () =>
{
    beforeAll(async () => {
        await TestSeqHero.sync();
    });

    beforeEach(async () => {
        // Remove all records between tests.
        await TestSeqHero.destroy({
            where: {},
            truncate: true
        });
    });

    it("should create and retrieve a hero", async () => {
        const hero = await TestSeqHero.create({
            heroName: "Bounty Hunter",
            baseStr: 23,
            baseAgi: 23,
            baseInt: 18,
            baseMs: 300
        });

        const retrievedHero = await TestSeqHero.findOne({ where: { heroID: hero.heroID } });

        expect(retrievedHero.heroName).toBe("Bounty Hunter");
        expect(retrievedHero.baseMs).toBe(300);
    });

    it("should return the count of all the heroes in the database after filtering them", async () => {
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

        // Should only find VisaGe and NaGa Siren => count = 2.
        const count = await TestSeqHero.count({
            where:
            {
                heroName: { [Sequelize.Op.like]: "%g%" }
            }
        });

        expect(count).toBe(2);
    });

    it("should return the strength categories and the count of the heroes belonging to the category", async () => {
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

        const strCategories = await TestSeqHero.findAll({
            attributes:
                [
                    [
                        Sequelize.literal("floor(baseStr / 5) * 5"),
                        "category"
                    ],
                    [
                        Sequelize.fn("count", Sequelize.col("*")),
                        "count"
                    ]
                ],
            group: Sequelize.literal("category")
        });

        expect(strCategories.some(catCnt => (catCnt.getDataValue("category") === 20 && catCnt.getDataValue("count") === 1))).toBe(true);
        expect(strCategories.some(catCnt => (catCnt.getDataValue("category") === 25 && catCnt.getDataValue("count") === 1))).toBe(true);
        expect(strCategories.some(catCnt => (catCnt.getDataValue("category") === 30 && catCnt.getDataValue("count") === 1))).toBe(true);
    });

    it("should return the heroes after filtering, sorting and paginating them", async () => {
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

        const filterCondition = {
            heroName:
            {
                [Sequelize.Op.like]: "%a%"
            }
        };

        const resSortOrder = [["baseStr", "asc"]];

        const filteredSortedPaginatedHeroes = await TestSeqHero.findAll({
            where: filterCondition,
            order: resSortOrder,
            offset: 1,
            limit: 1
        });

        // Should have received only Visage:
        expect(filteredSortedPaginatedHeroes.length).toBe(1);
        expect(filteredSortedPaginatedHeroes[0].heroName).toBe("Visage");
        expect(filteredSortedPaginatedHeroes[0].baseInt).toBe(16);
    });

    it("should create, update, and retrieve a hero", async () => {
        await TestSeqHero.create({
            heroName: "Naga Siren",
            baseStr: 30,
            baseAgi: 25,
            baseInt: 20,
            baseMs: 300
        });
        let visage = await TestSeqHero.create({
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

        const updatedHeroData = {
            baseStr: 35,
            baseInt: 24,
            baseMs: 330
        };

        await visage.update(updatedHeroData);

        visage = await TestSeqHero.findOne({ where: { heroName: "Visage" }});
        expect(visage.baseStr).toBe(35);
        expect(visage.baseAgi).toBe(21);
        expect(visage.baseInt).toBe(24);
        expect(visage.baseMs).toBe(330);
    });

    it("should create heroes, delete a hero, and check that the hero is no longer present in the database", async () => {
        let naga = await TestSeqHero.create({
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

        await naga.destroy();

        naga = await TestSeqHero.findOne({ where: { heroName: "Naga Siren" }});
        expect(naga).toBe(null);
    });
});
