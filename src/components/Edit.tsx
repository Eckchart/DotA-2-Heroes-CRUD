import React, {useState, useEffect} from "react";
import {Button, Form} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyServices from "../services";
import { Hero } from "../domain";
import { useNavigate } from "react-router-dom";


const initialFormValues: Hero = new Hero('', 0, 0, 0, 0);


function Edit()
{
    const [hero, setHero] = useState<Hero>(initialFormValues);
    const [id, setId] = useState(0);
    let history = useNavigate();

    useEffect(() =>
    {
        const storedId: string = localStorage.getItem("Hero Id") || "0";
        const storedName = localStorage.getItem("Hero Name") || "";
        const storedStr = localStorage.getItem("Hero Strength") || "0";
        const storedAgi = localStorage.getItem("Hero Agility") || "0";
        const storedInt = localStorage.getItem("Hero Intelligence") || "0";
        const storedMs = localStorage.getItem("Hero Move Speed") || "0";
        setId(parseInt(storedId));
        setHero(new Hero(storedName, parseFloat(storedStr), parseFloat(storedAgi), parseFloat(storedInt), parseInt(storedMs)));
    }, []);

    const handleUpdate = (e: React.FormEvent) =>
    {
        e.preventDefault();
        let cur_idx = MyServices.heroes.map((item: Hero) => 
        {
            return item.hero_id;
        }).indexOf(id);
        MyServices.update(cur_idx, hero);
        history('/heroes');
    }

    return (
        <div>
            <Form className="d-grid gap-2" style={{margin: "15rem"}}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder="Enter hero name" required value={hero.name} onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(e.target.value, prevHero.str, prevHero.agi, prevHero.int, prevHero.ms);
                        return updatedHero;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStr">
                    <Form.Control type="number" placeholder="Enter hero strength" required value={hero.str} onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, parseFloat(e.target.value), prevHero.agi, prevHero.int, prevHero.ms);
                        return updatedHero;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAgi">
                    <Form.Control type="number" placeholder="Enter hero agility" required value={hero.agi} onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, prevHero.str, parseFloat(e.target.value), prevHero.int, prevHero.ms);
                        return updatedHero;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formInt">
                    <Form.Control type="number" placeholder="Enter hero intelligence" required value={hero.int} onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, prevHero.str, prevHero.agi, parseFloat(e.target.value), prevHero.ms);
                        return updatedHero;
                    })} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formMs">
                    <Form.Control type="number" placeholder="Enter hero move speed" required value={hero.ms} onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, prevHero.str, prevHero.agi, prevHero.int, parseInt(e.target.value));
                        return updatedHero;
                    })} />
                </Form.Group>

                <Button data-testid="update-btn" onClick={(elem) => handleUpdate(elem)} type="submit">Update</Button>
            </Form>
        </div>
    )
}

export default Edit;