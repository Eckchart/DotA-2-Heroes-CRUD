import dbRepo from "../repository/databaseRepository.js";


export class databaseServices
{
    constructor(dbRepo)
    {
        this._dbRepo = dbRepo;
    }

    get dbRepo()
    {
        return this._dbRepo;
    }


    // HEROES
    
    async getAllHeroes()
    {
        return this._dbRepo.getAllHeroes();
    }

    async getTotalFilteredHeroesCount(filterText)
    {
        return this._dbRepo.getTotalFilteredHeroesCount(filterText);
    }

    async getStrCategories()
    {
        return this._dbRepo.getStrCategories();
    }

    async getFilteredSortedPaginatedHeroes(sortOrder, filterText, firstItemIdx, lastItemIdx)
    {
        return this._dbRepo.getFilteredSortedCurPageHeroes(sortOrder, filterText, firstItemIdx, lastItemIdx);
    }

    async createHero(name, str, agi, int, ms)
    {
        const heroData = {
            heroName: name,
            baseStr: str,
            baseAgi: agi,
            baseInt: int,
            baseMs: ms
        };

        return this._dbRepo.createHero(heroData);
    }

    async updateHero(heroId, updatedHero)
    {
        const updatedHeroData = {
            heroName: updatedHero.name,
            baseStr: updatedHero.str,
            baseAgi: updatedHero.agi,
            baseInt: updatedHero.int,
            baseMs: updatedHero.ms
        };

        return this._dbRepo.updateHero(heroId, updatedHeroData);
    }

    async deleteHero(heroId)
    {
        this._dbRepo.deleteHero(heroId);
    }
    
    // ABILITIES
    
    async getAllAbilities()
    {
        return this._dbRepo.getAllAbilities();
    }
    
    async createAbility(name, mana_cost, cooldown, hero_id)
    {
        const abilityData = {
            abilityName: name,
            abilityManaCost: mana_cost,
            abilityCooldown: cooldown,
            heroID: hero_id
        };

        return this._dbRepo.createAbility(abilityData);
    }

    async updateAbility(abilityId, updatedAbility)
    {
        const updatedAbilityData = {
            abilityName: updatedAbility.name,
            abilityManaCost: updatedAbility.mana_cost,
            abilityCooldown: updatedAbility.cooldown,
            heroID: updatedAbility.hero_id
        };

        return this._dbRepo.updateAbility(abilityId, updatedAbilityData);
    }

    async deleteAbility(abilityId)
    {
        return this._dbRepo.deleteAbility(abilityId);
    }
}

const dbServices = new databaseServices(dbRepo);
export default dbServices;
