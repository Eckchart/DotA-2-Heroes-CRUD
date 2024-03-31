import { Hero } from './domain'


export class Repository
{
    private _heroes: Hero[];

    constructor(heroes: Hero[])
    {
        this._heroes = heroes;
    }

    /**
     * @returns true if the given hero was added to the repository, else false.
     */
    public add(hero: Hero): boolean
    {
        // We can't have two of the same heroes in the repository.
        for (const item of this._heroes)
        {
            if (item.isEqual(hero))
            {
                return false;
            }
        }
        this._heroes.push(hero);
        return true;
    }
    
    /**
     * @brief Updates the element at index 'idx' with 'hero' Hero.
     */
    public update(idx: number, hero: Hero): void
    {
        this._heroes[idx] = hero;
    }

    /**
     * @returns true if the given hero was deleted from the repository, else false.
     */
    public delete(hero_id: number): boolean
    {
        let idx_to_del: number = -1;
        for (let i = 0; i < this._heroes.length; ++i)
        {
            if (this._heroes[i].hero_id === hero_id)
            {
                idx_to_del = i;
                break;
            }
        }
        if (idx_to_del === -1)
        {
            return false;
        }
        this._heroes.splice(idx_to_del, 1);
        return true;
    }
    
    get heroes(): Hero[]
    {
        return this._heroes;
    }

    set heroes(new_val: Hero[])
    {
        this._heroes = new_val;
    }
}


export const Heroes: Hero[] =
[
    new Hero("Medusa", 0, 25, 22, 275),
    new Hero("Ogre Magi", 23, 14, 0, 290),
    new Hero("Riki", 18, 30, 14, 315)
]
const Repo: Repository = new Repository(Heroes);
export default Repo;