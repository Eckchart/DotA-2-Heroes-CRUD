export class Hero
{
    private _hero_id: number;
    private _hero_name: string;
    private _base_str: number;
    private _base_agi: number;
    private _base_int: number;
    private _base_ms: number;
    private static last_id: number = 0;

    constructor(hero_name: string, base_str: number, base_agi: number, base_int: number, base_ms: number)
    {
        this._hero_id   = ++Hero.last_id;
        this._hero_name = hero_name;
        this._base_str  = base_str;
        this._base_agi  = base_agi;
        this._base_int  = base_int;
        this._base_ms   = base_ms;
    }

    isEqual(other: Hero): boolean
    {
        return this._hero_id === other._hero_id;
    }

    get hero_id(): number
    {
        return this._hero_id;
    }

    get name(): string
    {
        return this._hero_name;
    }

    set name(new_val: string)
    {
        this._hero_name = new_val;
    }

    get str(): number
    {
        return this._base_str;
    }

    set str(new_val: number)
    {
        this._base_str = new_val;
    }

    get agi(): number
    {
        return this._base_agi;
    }

    set agi(new_val: number)
    {
        this._base_agi = new_val;
    }

    get int(): number
    {
        return this._base_int;
    }

    set int(new_val: number)
    {
        this._base_int = new_val;
    }

    get ms(): number
    {
        return this._base_ms;
    }

    set ms(new_val: number)
    {
        this._base_ms = new_val;
    }
}
