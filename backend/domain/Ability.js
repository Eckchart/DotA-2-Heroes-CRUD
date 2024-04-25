export class Ability
{
    static last_id = 0;

    /**
     * @param hero_id the id of the hero to which this ability belongs (foreign key)
     */
    constructor(ability_name, mana_cost, cooldown, hero_id, ability_id = -1)
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

    isEqual(other)
    {
        return this._ability_id === other._ability_id;
    }

    get ability_id()
    {
        return this._ability_id;
    }

    get name()
    {
        return this._ability_name;
    }

    get mana_cost()
    {
        return this._mana_cost;
    }

    get cooldown()
    {
        return this._cooldown;
    }

    get hero_id()
    {
        return this._hero_id;
    }

    set name(new_val)
    {
        this._ability_name = new_val;
    }

    set mana_cost(new_val)
    {
        this._mana_cost = new_val;
    }

    set cooldown(new_val)
    {
        this._cooldown = new_val;
    }

    set hero_id(new_val)
    {
        this._hero_id = new_val;
    }
}
