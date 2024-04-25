export class Hero
{
    static last_id = 0;

    constructor(hero_name, base_str, base_agi, base_int, base_ms, hero_id = -1)
    {
        if (hero_id === -1)
        {
            this._hero_id = ++Hero.last_id;
        }
        else
        {
            this._hero_id = hero_id;
        }
        this._hero_name = hero_name;
        this._base_str  = base_str;
        this._base_agi  = base_agi;
        this._base_int  = base_int;
        this._base_ms   = base_ms;
    }

    isEqual(other)
    {
        return this._hero_id === other._hero_id;
    }

    get hero_id()
    {
        return this._hero_id;
    }

    get name()
    {
        return this._hero_name;
    }

    set name(new_val)
    {
        this._hero_name = new_val;
    }

    get str()
    {
        return this._base_str;
    }

    set str(new_val)
    {
        this._base_str = new_val;
    }

    get agi()
    {
        return this._base_agi;
    }

    set agi(new_val)
    {
        this._base_agi = new_val;
    }

    get int()
    {
        return this._base_int;
    }

    set int(new_val)
    {
        this._base_int = new_val;
    }

    get ms()
    {
        return this._base_ms;
    }

    set ms(new_val)
    {
        this._base_ms = new_val;
    }
}
