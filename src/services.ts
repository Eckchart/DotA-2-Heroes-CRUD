import { Hero } from "./domain";
import Repo, { Repository } from "./repository";


export class Services
{
    private _repo: Repository;

    constructor(repo: Repository)
    {
        this._repo = repo;
    }

    public add(hero_name: string, base_str: number, base_agi: number, base_int: number, base_ms: number): boolean
    {
        let hero = new Hero(hero_name, base_str, base_agi, base_int, base_ms);
        return this._repo.add(hero);
    }
    
    public update(idx: number, hero: Hero): void
    {
        this._repo.update(idx, hero);
    }

    public delete(hero_id: number): boolean
    {
        return this._repo.delete(hero_id);
    }

    get repo(): Repository
    {
        return this._repo;
    }

    get heroes(): Hero[]
    {
        return this._repo.heroes;
    }

    set heroes(new_val: Hero[])
    {
        this._repo.heroes = new_val;
    }
}


const MyServices: Services = new Services(Repo);
export default MyServices;
