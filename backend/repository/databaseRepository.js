import SeqHero from "../sequelize_models/Hero.js";
import SeqAbility from "../sequelize_models/Ability.js";
import { Sequelize } from "sequelize";


export class databaseRepository
{
    // HEROES QUERIES

    async getAllHeroes()
    {
        return SeqHero.findAll();
    }
    
    async getTotalFilteredHeroesCount(filterText)
    {
        const count = await SeqHero.count({
            where:
            {
                heroName: { [Sequelize.Op.like]: `%${filterText}%` }
            }
        });

        return count;
    }

    async getStrCategories()
    {
        const categories = await SeqHero.findAll({
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

        return categories;
    }

    async getFilteredSortedCurPageHeroes(sortOrder, filterText, firstItemIdx, lastItemIdx)
    {
        const filterCondition = {
            heroName:
            {
                [Sequelize.Op.like]: `%${filterText}%`
            }
        };

        const resSortOrder = sortOrder === "asc" ? [["baseStr", "asc"]] : [["baseStr", "desc"]];

        const filteredSortedCurPageHeroes = await SeqHero.findAll({
            where: filterCondition,
            order: resSortOrder,
            offset: firstItemIdx,
            limit: lastItemIdx - firstItemIdx + 1
        });
    
        return filteredSortedCurPageHeroes;
    }
    
    async createHero(heroData)
    {
        /*
         * heroData would be like of the form:
         * const heroData = {
         *      heroName: 'HeroName',
         *      baseStr: 100,
         *      baseAgi: 80,
         *      baseInt: 60,
         *      baseMs: 300
         *  };
         */
        const newHero = await SeqHero.create(heroData);

        return newHero;
    }

    async updateHero(heroID, updatedHeroData)
    {
        /*
         * updatedHeroData would be like of the form:
         * const updatedHeroData = {
         *      heroName: 'HeroName',
         *      baseStr: 100,
         *      baseAgi: 80,
         *      baseInt: 60,
         *      baseMs: 300
         *  };
         */
        const hero = await SeqHero.findByPk(heroID);
        if (!hero)
        {
            console.log(`Hero with ID ${heroID} not found.`);
            return null;
        }

        await hero.update(updatedHeroData);

        return hero;
    }

    async deleteHero(heroID)
    {
        const hero = await SeqHero.findByPk(heroID);
        if (!hero)
        {
            console.log(`Hero with ID ${heroID} not found.`);
            return null;
        }

        await hero.destroy();
    }


    // ABILITIES QUERIES

    async getAllAbilities()
    {
        return SeqAbility.findAll();
    }

    async createAbility(abilityData)
    {
        const newAbility = await SeqAbility.create(abilityData);

        return newAbility;
    }

    async updateAbility(abilityID, updatedAbilityData)
    {
        const ability = await SeqAbility.findByPk(abilityID);
        if (!ability)
        {
            console.log(`Ability with ID ${abilityID} not found.`);
            return null;
        }

        await ability.update(updatedAbilityData);

        return ability;
    }

    async deleteAbility(abilityID)
    {
        const ability = await SeqAbility.findByPk(abilityID);
        if (!ability)
        {
            console.log(`Ability with ID ${abilityID} not found.`);
            return null;
        }

        await ability.destroy();

        return SeqAbility.findAll();
    }
}

const dbRepo = new databaseRepository();
export default dbRepo;
