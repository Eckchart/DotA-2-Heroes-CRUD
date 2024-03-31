import React, { useState } from "react";
import {Button, Form} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyServices from "../services";
import { Hero } from "../domain";
import { useNavigate } from "react-router-dom";


const initialFormValues: Hero = new Hero('', 0, 0, 0, 0);


function Add()
{
    const [hero, setHero] = useState<Hero>(initialFormValues);
    let history = useNavigate();

    const handleSubmit = (elem: React.FormEvent) =>
    {
        elem.preventDefault();
        MyServices.add(hero.name, hero.str, hero.agi, hero.int, hero.ms);
        history("/heroes");
    }
    
    return (
        <div>
            <Form className="d-grid gap-2" style={{margin: "15rem"}}>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Control type="text" placeholder="Enter hero name" required onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(e.target.value, prevHero.str, prevHero.agi, prevHero.int, prevHero.ms);
                        return updatedHero;
                    })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStr">
                    <Form.Control type="number" placeholder="Enter hero strength" required onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, parseFloat(e.target.value || "0"), prevHero.agi, prevHero.int, prevHero.ms);
                        return updatedHero;
                    })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAgi">
                    <Form.Control type="number" placeholder="Enter hero agility" required onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, prevHero.str, parseFloat(e.target.value || "0"), prevHero.int, prevHero.ms);
                        return updatedHero;
                    })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formInt">
                    <Form.Control type="number" placeholder="Enter hero intelligence" required onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, prevHero.str, prevHero.agi, parseFloat(e.target.value || "0"), prevHero.ms);
                        return updatedHero;
                    })}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formMs">
                    <Form.Control type="number" placeholder="Enter hero move speed" required onChange={(e) => setHero((prevHero: Hero) => {
                        const updatedHero: Hero = new Hero(prevHero.name, prevHero.str, prevHero.agi, prevHero.int, parseInt(e.target.value || "0"));
                        return updatedHero;
                    })}
                    />
                </Form.Group>
                <Button data-testid="submit-btn" onClick={(elem) => handleSubmit(elem)} type="submit">Submit</Button>
            </Form>
        </div>
    )
}

export default Add;
