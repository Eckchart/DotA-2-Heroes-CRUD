import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios  from "axios";
import HeroesTable from "../HeroesTable";
import Add from "../AddPage";

jest.mock("axios");


describe("Add Page", () =>
{
    beforeEach(() =>
    {
        jest.resetAllMocks();
    });
    
    it("should add a hero to the table when pressing the submit button", () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 }
        ];

        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: 1 });
            }
            return Promise.resolve({ data: mockHeroesData });
        });

        render(
            <MemoryRouter initialEntries={['/heroes/add']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/add" element={<Add/>}/>
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter hero name"),
        {
            target: { value: "Timbersaw" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero strength"),
        {
            target: { value: 25 }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero agility"),
        {
            target: { value: 20 }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero intelligence"),
        {
            target: { value: 19 }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero move speed"),
        {
            target: { value: 285 }
        });
        const submitBtn = screen.getByTestId("submit-btn");
        fireEvent.click(submitBtn);

        expect(axios.post).toHaveBeenCalledWith(`http://localhost:3001/api/heroes`,
            {
                name: "Timbersaw",
                str: 25,
                agi: 20,
                int: 19,
                ms: 285
            }
        );
    });

    it("should throw when creating a hero with move speed equal to 200", () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 }
        ];
        const mockErrorResponse = {
            response: {
                status: 400,
                data: { error: "ms should be between 270 and 330!" }
            }
        };

        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: 1 });
            }
            return Promise.resolve({ data: mockHeroesData });
        });
        (axios.post as jest.Mock).mockRejectedValue(mockErrorResponse);

        render(
            <MemoryRouter initialEntries={['/heroes/add']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/add" element={<Add/>}/>
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("Enter hero name"),
        {
            target: { value: "Timbersaw" }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero strength"),
        {
            target: { value: 25 }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero agility"),
        {
            target: { value: 20 }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero intelligence"),
        {
            target: { value: 19 }
        });
        fireEvent.change(screen.getByPlaceholderText("Enter hero move speed"),
        {
            target: { value: 200 }
        });
        const submitBtn = screen.getByTestId("submit-btn");
        fireEvent.click(submitBtn);

        expect(axios.post).toHaveBeenCalledWith(`http://localhost:3001/api/heroes`,
            {
                name: "Timbersaw",
                str: 25,
                agi: 20,
                int: 19,
                ms: 200
            }
        );
        expect(axios.post).rejects.toEqual(mockErrorResponse);
    });
});
