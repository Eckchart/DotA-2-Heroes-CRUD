import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Ability } from "../domain/Ability";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { act } from "@testing-library/react";


const initialFormValues: Ability = new Ability('', 0, 0, 1);

function AddAbility()
{
    const [ability, setAbility] = useState<Ability>(initialFormValues);
    let history = useNavigate();

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        try
        {
            await axios.post("http://localhost:3001/api/abilities",
            {
                name: ability.name,
                mana_cost: ability.mana_cost,
                cooldown: ability.cooldown,
                hero_id: ability.hero_id,
            });
            act(() => history("/abilities"));
        }
        catch (error)
        {
            console.error("Error creating ability: ", error);
        }
    };
    
    return (
        <div>
            <Form className="d-grid gap-2" style={{margin: "15rem"}}>
                <Form.Group className="mb-3" controlId="formAbilityName">
                    <Form.Control type="text" placeholder="Enter ability name" required onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(e.target.value, prevAbility.mana_cost, prevAbility.cooldown, prevAbility.hero_id);
                        return updatedAbility;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formManaCost">
                    <Form.Control type="number" placeholder="Enter ability mana cost" required onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(prevAbility.name, parseInt(e.target.value || "0"), prevAbility.cooldown, prevAbility.hero_id);
                        return updatedAbility;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCooldown">
                    <Form.Control type="number" placeholder="Enter ability cooldown" required onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(prevAbility.name, prevAbility.mana_cost, parseInt(e.target.value || "0"), prevAbility.hero_id);
                        return updatedAbility;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formForeignHeroId">
                    <Form.Control type="number" placeholder="Enter hero id for this ability" required onChange={(e) => setAbility((prevAbility: Ability) => {
                        const updatedAbility: Ability = new Ability(prevAbility.name, prevAbility.mana_cost, prevAbility.cooldown, parseInt(e.target.value || "1"));
                        return updatedAbility;
                    })} />
                </Form.Group>

                <Button data-testid="submit-ability-btn" onClick={(elem) => handleSubmit(elem)} type="submit">Submit</Button>
            </Form>
        </div>
    )
}

export default AddAbility;
