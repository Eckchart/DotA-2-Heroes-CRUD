import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Ability } from "../domain/Ability";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { act } from "@testing-library/react";


const initialFormValues: Ability = new Ability('', 0, 0, 1);

function EditAbility()
{
    const [ability, setAbility] = useState<Ability>(initialFormValues);
    const [id, setId] = useState(0);
    let history = useNavigate();

    useEffect(() =>
    {
        const storedId: string = localStorage.getItem("Ability Id") || "0";
        const storedAbilityName = localStorage.getItem("Ability Name") || "";
        const storedManaCost = localStorage.getItem("Ability Mana Cost") || "0";
        const storedCooldown = localStorage.getItem("Ability Cooldown") || "0";
        const storedForeignHeroId = localStorage.getItem("Ability Hero Id") || "1";
        setId(parseInt(storedId));
        setAbility(new Ability(storedAbilityName, parseInt(storedManaCost), parseInt(storedCooldown), parseInt(storedForeignHeroId), id));
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        try
        {
            await axios.put(`http://localhost:3001/api/abilities/${id}`,
            {
                name: ability.name,
                mana_cost: ability.mana_cost,
                cooldown: ability.cooldown,
                hero_id: ability.hero_id,
                ability_id: id
            });
            act(() => history("/abilities"));
        }
        catch (error)
        {
            console.error("Error updating ability:", error);
        }
    };

    return (
        <div>
            <Form className="d-grid gap-2" style={{margin: "15rem"}}>
                <Form.Group className="mb-3" controlId="formAbilityName">
                    <Form.Control type="text" placeholder="Enter ability name" required value={ability.name} onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(e.target.value, prevAbility.mana_cost, prevAbility.cooldown, prevAbility.hero_id);
                        return updatedAbility;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formManaCost">
                    <Form.Control type="number" placeholder="Enter ability mana cost" required value={ability.mana_cost} onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(prevAbility.name, parseInt(e.target.value), prevAbility.cooldown, prevAbility.hero_id);
                        return updatedAbility;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCooldown">
                    <Form.Control type="number" placeholder="Enter ability cooldown" required value={ability.cooldown} onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(prevAbility.name, prevAbility.mana_cost, parseInt(e.target.value), prevAbility.hero_id);
                        return updatedAbility;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formForeignHeroId">
                    <Form.Control type="number" placeholder="Enter hero id for this ability" required value={ability.hero_id} onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(prevAbility.name, prevAbility.mana_cost, prevAbility.cooldown, parseInt(e.target.value));
                        return updatedAbility;
                    })} />
                </Form.Group>

                <Button data-testid="update-ability-btn" onClick={(elem) => handleUpdate(elem)} type="submit">Update</Button>
            </Form>
        </div>
    )
}

export default EditAbility;
