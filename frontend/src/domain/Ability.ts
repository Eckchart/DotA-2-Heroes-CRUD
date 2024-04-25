export class Ability
{
    public _ability_id: number;
    public _ability_name: string;
    public _mana_cost: number;
    public _cooldown: number;
    public _hero_id: number;
    private static last_id: number = 0;

    /**
     * @param hero_id the id of the hero to which this ability belongs (foreign key)
     */
    constructor(ability_name: string, mana_cost: number, cooldown: number, hero_id: number, ability_id: number = -1)
    {
        if (ability_id === -1)
        {
            this._ability_id = ++Ability.last_id;
        }
        else
        {
            this._ability_id = ability_id;
        }
        this._ability_name = ability_name;
        this._mana_cost = mana_cost;
        this._cooldown = cooldown;
        this._hero_id = hero_id;
    }

    isEqual(other: Ability): boolean
    {
        return this._ability_id === other.ability_id;
    }

    get ability_id(): number
    {
        return this._ability_id;
    }

    get name(): string
    {
        return this._ability_name;
    }

    get mana_cost(): number
    {
        return this._mana_cost;
    }

    get cooldown(): number
    {
        return this._cooldown;
    }

    get hero_id(): number
    {
        return this._hero_id;
    }

    set name(new_val: string)
    {
        this._ability_name = new_val;
    }

    set mana_cost(new_val: number)
    {
        this._mana_cost = new_val;
    }

    set cooldown(new_val: number)
    {
        this._cooldown = new_val;
    }

    set hero_id(new_val: number)
    {
        this._hero_id = new_val;
    }

    get AbilityID(): number
    {
        return this._ability_id;
    }

    get abilityName(): string
    {
        return this._ability_name;
    }

    get abilityManaCost(): number
    {
        return this._mana_cost;
    }

    get abilityCooldown(): number
    {
        return this._cooldown;
    }

    get heroID(): number
    {
        return this._hero_id;
    }
}
