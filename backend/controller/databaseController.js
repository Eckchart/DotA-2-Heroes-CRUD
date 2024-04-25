import dbServices from "../services/databaseServices.js";
import Joi from "joi";
import { Hero } from "../domain/Hero.js";
import { Ability } from "../domain/Ability.js";


// HEROES

const idxSchema = Joi.object({
    idx: Joi.number().min(-1)
});

const sortOrderSchema = Joi.object({
    sortOrder: Joi.string().allow("asc").allow("desc")
});

const heroIdSchema = Joi.object({
    hero_id: Joi.number().positive().required()
});

const filterTextSchema = Joi.object({
    filterText: Joi.string().allow('').regex(/^[a-zA-z ]+$/).max(25)  // should only contain letters AND SPACES
});

const heroSchema = Joi.object({
    name: Joi.string().allow('').regex(/^[a-zA-z ]+$/).min(2).max(25),  // should only contain letters AND SPACES
    str: Joi.number().positive().allow(0).min(5).max(35),
    agi: Joi.number().positive().allow(0).min(5).max(35),
    int: Joi.number().positive().allow(0).min(5).max(35),
    ms: Joi.number().positive().allow(0).min(270).max(330)
});


export const getAllHeroes = async (req, res) =>
{
    try
    {
        const heroes = await dbServices.getAllHeroes();
        res.status(200).json(heroes);
    }
    catch (error)
    {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getStrCategories = async (req, res) =>
{
    try
    {
        const strCategories = await dbServices.getStrCategories();
        res.status(200).json(strCategories);
    }
    catch (error)
    {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getTotalFilteredHeroesCount = async (req, res) =>
{
    const { error } = filterTextSchema.validate({ filterText: req.query.filterText });
    if (error)
    {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const filterText = req.query.filterText;
    try
    {
        const totalFilteredHeroesCount = await dbServices.getTotalFilteredHeroesCount(filterText);
        res.status(200).json(totalFilteredHeroesCount);
    }
    catch (error)
    {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFilteredSortedPaginatedHeroes = async (req, res) =>
{
    const { error: sortOrderError } = sortOrderSchema.validate({ sortOrder: req.query.sortOrder });
    if (sortOrderError)
    {
        return res.status(400).json({ error: sortOrderError.details[0].message });
    }

    const { error: filterTextError } = filterTextSchema.validate({ filterText: req.query.filterText });
    if (filterTextError)
    {
        return res.status(400).json({ error: filterTextError.details[0].message });
    }

    const { error: firstItemIdxError } = idxSchema.validate({ idx: req.query.firstItemIdx });
    if (firstItemIdxError)
    {
        return res.status(400).json({ error: firstItemIdxError.details[0].message });
    }

    const { error: lastItemIdxError } = idxSchema.validate({ idx: req.query.lastItemIdx });
    if (lastItemIdxError)
    {
        return res.status(400).json({ error: lastItemIdxError.details[0].message });
    }

    const sortOrder = req.query.sortOrder;
    const filterText = req.query.filterText;

    // if we don't convert them to integers here weird stuff happens..
    const firstItemIdx = parseInt(req.query.firstItemIdx);
    const lastItemIdx = parseInt(req.query.lastItemIdx);
    try
    {
        const filteredSortedPaginatedHeroes = await dbServices.getFilteredSortedPaginatedHeroes(sortOrder, filterText, firstItemIdx, lastItemIdx);
        res.status(200).json(filteredSortedPaginatedHeroes);
    }
    catch (error)
    {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createHero = async (req, res) =>
{
    const { error } = heroSchema.validate({
        name: req.body.name,
        str: req.body.str,
        agi: req.body.agi,
        int: req.body.int,
        ms: req.body.ms
    });
    if (error)
    {
        return res.status(400).json({ error: error.details[0].message });
    }

    const newHero = req.body;
    try
    {
        const createdHero = await dbServices.createHero(newHero.name, newHero.str, newHero.agi, newHero.int, newHero.ms);
        res.status(201).json(createdHero);
    }
    catch (error)
    {
        return res.status(400).json({ error: "Error creating hero." });
    }
}

export const updateHero = async (req, res) =>
{
    const { error: idError } = heroIdSchema.validate({ hero_id: req.params.id });
    if (idError)
    {
        return res.status(400).json({ error: idError.details[0].message });
    }

    const { error: updHeroError } = heroSchema.validate({
        name: req.body.name,
        str: req.body.str,
        agi: req.body.agi,
        int: req.body.int,
        ms: req.body.ms
    });
    if (updHeroError)
    {
        return res.status(400).json({ error: updHeroError.details[0].message });
    }
    
    const req_hero_id = parseInt(req.params.id);
    const updatedHero = req.body;
    const instanceHero = new Hero(updatedHero.name, updatedHero.str, updatedHero.agi, updatedHero.int, updatedHero.ms, req_hero_id);
    try
    {
        const updHero = await dbServices.updateHero(req_hero_id, instanceHero);
        res.status(200).json(updHero);
    }
    catch (error)
    {
        return res.status(400).json({ error: "Error updating hero." });
    }
}

export const deleteHero = async (req, res) =>
{
    const { error } = heroIdSchema.validate({ hero_id: req.params.id });
    if (error)
    {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    const req_hero_id = parseInt(req.params.id);
    try
    {
        await dbServices.deleteHero(req_hero_id);
        res.status(200).json({ message: "Hero deleted successfully" });
    }
    catch (error)
    {
        return res.status(400).json({ error: "Error deleting hero." });
    }
};


// ABILITIES

const abilityIdSchema = Joi.object({
    ability_id: Joi.number().positive().required()
});

const abilitySchema = Joi.object({
    ability_name: Joi.string().allow(''),
    mana_cost: Joi.number().min(0).max(2000),
    cooldown: Joi.number().min(0).max(400),  // in seconds, btw
});


export const getAllAbilities = async (req, res) =>
{
    try
    {
        const abilities = await dbServices.getAllAbilities();
        res.status(200).json(abilities);
    }
    catch (error)
    {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createAbility = async (req, res) =>
{
    const { error } = abilitySchema.validate({
        ability_name: req.body.name,
        mana_cost: req.body.mana_cost,
        cooldown: req.body.cooldown
    });
    if (error)
    {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { error: foreignHeroIdError } = heroIdSchema.validate({ hero_id: req.body.hero_id });
    if (foreignHeroIdError)
    {
        return res.status(400).json({ error: foreignHeroIdError.details[0].message });
    }

    const newAbility = req.body;
    try
    {
        const createdAbility = await dbServices.createAbility(newAbility.name, newAbility.mana_cost, newAbility.cooldown, newAbility.hero_id);
        res.status(201).json(createdAbility)
    }
    catch (error)
    {
        if (error.name === "SequelizeForeignKeyConstraintError")
        {
            return res.status(404).json({ error: "Hero with the given ID doesn't exist in the database." });
        }
        return res.status(400).json({ error: "Error creating ability." });
    }
};

export const updateAbility = async (req, res) =>
{
    const { error: abilityIdError } = abilityIdSchema.validate({ ability_id: req.params.id });
    if (abilityIdError)
    {
        return res.status(400).json({ error: abilityIdError.details[0].message });
    }

    const { error: foreignHeroIdError } = heroIdSchema.validate({ hero_id: req.body.hero_id });
    if (foreignHeroIdError)
    {
        return res.status(400).json({ error: foreignHeroIdError.details[0].message });
    }

    const { error: updAbilityError } = abilitySchema.validate({
        ability_name: req.body.name,
        mana_cost: req.body.mana_cost,
        cooldown: req.body.cooldown
    });
    if (updAbilityError)
    {
        return res.status(400).json({ error: updAbilityError.details[0].message });
    }

    const req_ability_id = parseInt(req.params.id);
    const updatedAbility = req.body;
    const instanceAbility = new Ability(updatedAbility.name, updatedAbility.mana_cost, updatedAbility.cooldown, updatedAbility.hero_id, req_ability_id);
    try
    {
        const updAbility = await dbServices.updateAbility(req_ability_id, instanceAbility);
        res.status(200).json(updAbility);
    }
    catch (error)
    {
        return res.status(400).json({ error: "Error updating ability." });
    }
};

export const deleteAbility = async (req, res) =>
{
    const { error } = abilityIdSchema.validate({ ability_id: req.params.id });
    if (error)
    {
        return res.status(400).json({ error: error.details[0].message });
    }

    const req_ability_id = parseInt(req.params.id);
    try
    {
        // resulting abilities after deleting the given hero
        const resAbilities = await dbServices.deleteAbility(req_ability_id);
        res.status(200).json(resAbilities);
    }
    catch (error)
    {
        return res.status(400).json({ error: "Error deleting ability." });
    }
};
