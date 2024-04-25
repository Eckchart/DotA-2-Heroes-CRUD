import { Fragment, useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { act } from "@testing-library/react";
import { Ability } from "../domain/Ability";


function AbilitiesTable()
{
    let history = useNavigate();
    const [fetchedAbilities, setFetchedAbilities] = useState<Ability[]>([]);

    useEffect(() =>
    {
        const fetchData = async (): Promise<void> =>
        {
            try
            {
                const response = await axios.get<Ability[]>("http://localhost:3001/api/abilities");
                act(() =>
                    setFetchedAbilities(response.data.map(abilityData =>
                        new Ability(abilityData.abilityName,
                                    abilityData.abilityManaCost,
                                    abilityData.abilityCooldown,
                                    abilityData.heroID,
                                    abilityData.AbilityID)
                )));
            }
            catch (error)
            {
                console.error("Error fetching abilities:", error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (ability_id: number): Promise<void> =>
    {
        const confirmed: boolean = window.confirm("Are you sure you want to delete this item?");
        if (confirmed)
        {
            try
            {
                const response = await axios.delete<Ability[]>(`http://localhost:3001/api/abilities/${ability_id}`);
                act(() =>
                    setFetchedAbilities(response.data.map(abilityData =>
                        new Ability(abilityData.abilityName,
                                    abilityData.abilityManaCost,
                                    abilityData.abilityCooldown,
                                    abilityData.heroID,
                                    abilityData.AbilityID)
                )));
                act(() => history("/abilities"));
            }
            catch (error)
            {
                console.error("Error deleting item:", error);
            }
        }
    };

    const handleEdit = (ability: Ability) =>
    {
        localStorage.setItem("Ability Id", ability.ability_id.toString());
        localStorage.setItem("Ability Name", ability.name);
        localStorage.setItem("Ability Mana Cost", ability.mana_cost === null ? "0" : (ability.mana_cost as number).toString());
        localStorage.setItem("Ability Cooldown", ability.cooldown === null ? "0" : (ability.cooldown as number).toString());
        localStorage.setItem("Ability Hero Id", ability.hero_id === null ? "1" : (ability.hero_id as number).toString());
    };
    
    return (
        <Fragment>
            <div style={{margin: "8rem"}}>
                <Table bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Mana Cost</th>
                            <th>Cooldown</th>
                            <th>Hero ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fetchedAbilities && fetchedAbilities.length > 0
                            ?
                            fetchedAbilities.map((item: Ability) =>
                            {
                                return (
                                    <tr key={item.ability_id} data-testid="ability-row">
                                        <td>{item.name}</td>
                                        <td>{item.mana_cost}</td>
                                        <td>{item.cooldown}</td>
                                        <td>{item.hero_id}</td>
                                        <td>
                                            <Button data-testid="delete-ability-btn" onClick={() => handleDelete(item.ability_id)}>Delete</Button>
                                            &nbsp;
                                            <Link to="/abilities/edit">
                                                <Button data-testid="edit-ability-btn" onClick={() => handleEdit(item)}>Edit</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan={6}>No data available.</td>
                            </tr>
                        }
                    </tbody>
                </Table>

                <br/>
                
                <Link to="/abilities/add">
                    <Button data-testid="create-ability-btn" size="lg">Create</Button>
                </Link>
                &nbsp;
                <Link to="/">
                    <Button size="lg">Home</Button>
                </Link>
            </div>
        </Fragment>
    )
}

export default AbilitiesTable;
