import { render, fireEvent, screen } from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import HeroesTable from "../HeroesTable";
import MyServices from "../../services";
import Add from "../AddPage";
import { Hero } from "../../domain";


describe("Add Page", () =>
{
    beforeEach(() =>
    {
        MyServices.heroes =
        [
            new Hero("Medusa", 0, 25, 22, 275),
            new Hero("Ogre Magi", 23, 14, 0, 290),
            new Hero("Riki", 18, 30, 14, 315)
        ]
    });

    it("should add a hero to the table when pressing the submit button", () =>
    {
        render (
            <MemoryRouter initialEntries={['/heroes', '/heroes/add']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/add" element={<Add/>}/>
                </Routes>
            </MemoryRouter>
        )
        fireEvent.change(screen.getByPlaceholderText("Enter hero name"),
        {
            target: { value: "Timbersaw" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero strength"),
        {
            target: { value: "25" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero agility"),
        {
            target: { value: "20" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero intelligence"),
        {
            target: { value: "19" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero move speed"),
        {
            target: { value: "285" }
        });
        const submitBtn = screen.getByTestId("submit-btn");
        fireEvent.click(submitBtn);
        const newNrHeroes: number = MyServices.heroes.length;
        expect(newNrHeroes).toBe(4);
        let new_hero_idx: number = -1;
        for (let i = 0; i < newNrHeroes; ++i)
        {
            if (MyServices.heroes[i].name === "Timbersaw")
            {
                new_hero_idx = i;
                break;
            }
        }
        expect(new_hero_idx).not.toBe(-1);
        expect(MyServices.heroes[new_hero_idx].name === "Timbersaw");
        expect(MyServices.heroes[new_hero_idx].ms === 285);
    });
})