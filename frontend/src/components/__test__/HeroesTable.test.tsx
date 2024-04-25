import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom";
import Add from "../AddPage";
import HeroesTable from "../HeroesTable";

jest.mock("axios");


describe("Heroes Table", () =>
{
    beforeEach(() =>
    {
        jest.resetAllMocks();
    });

    it("should delete a hero when pressing the delete button AND confirming", async () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 },
            { _hero_id: 11, _hero_name: "Faceless Void", _base_str: 18, _base_agi: 22, _base_int: 19, _base_ms: 290 }
        ];
        const mockDeleteResponse = [
            { _hero_id: 11, _hero_name: "Faceless Void", _base_str: 18, _base_agi: 22, _base_int: 19, _base_ms: 290 }
        ];

        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: 1 });
            }
            if (url.includes("sort_order"))
            {
                return Promise.resolve({ data: "asc" });
            }
            return Promise.resolve({ data: mockHeroesData });
        });
        (axios.delete as jest.Mock).mockResolvedValue({ data: mockDeleteResponse });

        render(
            <MemoryRouter initialEntries={['/heroes']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                </Routes>
            </MemoryRouter>
        );

        // Wait for API call to complete and data to be rendered
        await screen.findByText("Drow Ranger");

        const deleteBtns = screen.getAllByTestId("delete-btn");
        window.confirm = jest.fn(() => true);
        fireEvent.click(deleteBtns[0]);

        expect(axios.delete).toHaveBeenCalledWith(`http://localhost:3001/api/heroes/10`);
    });

    it("should NOT delete a hero when pressing the delete button but NOT confirming", async () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 },
            { _hero_id: 11, _hero_name: "Faceless Void", _base_str: 18, _base_agi: 22, _base_int: 19, _base_ms: 290 }
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
            <MemoryRouter initialEntries={['/heroes']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                </Routes>
            </MemoryRouter>
        );

        // Wait for API call to complete and data to be rendered
        await screen.findByText("Drow Ranger");

        const deleteBtns = screen.getAllByTestId("delete-btn");
        window.confirm = jest.fn(() => false);
        fireEvent.click(deleteBtns[0]);

        expect(axios.delete).not.toHaveBeenCalled();
    });

    it("should only display 1 hero (Drow Ranger) when filtering by 'g'", async () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 },
            { _hero_id: 11, _hero_name: "Faceless Void", _base_str: 18, _base_agi: 22, _base_int: 19, _base_ms: 290 }
        ];

        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: 1 });
            }
            if (url.includes("filter"))
            {
                // has to be wrapped in a list!!11
                return Promise.resolve({ data: [mockHeroesData[0]] });
            }
            return Promise.resolve({ data: mockHeroesData });
        });

        render(
            <MemoryRouter initialEntries={['/heroes']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                </Routes>
            </MemoryRouter>
        );

        // Wait for API call to complete and data to be rendered
        await screen.findByText("Drow Ranger");

        fireEvent.change(screen.getByPlaceholderText("Filter by name"),
        {
            target: { value: "g" }
        });
        const tableRowCount: number = screen.getAllByTestId("hero-row").length;
        expect(tableRowCount).toBe(1);
    });

    it("should display a second and a third page when there are 3 heroes in total and we have selected to display 1 hero per page", async () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 16, _base_agi: 20, _base_int: 15, _base_ms: 300 },
            { _hero_id: 11, _hero_name: "Faceless Void", _base_str: 20, _base_agi: 19, _base_int: 15, _base_ms: 300 },
            { _hero_id: 12, _hero_name: "Tidehunter", _base_str: 27, _base_agi: 15, _base_int: 18, _base_ms: 300 }
        ];

        let curPage: number = 1;
        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: curPage });
            }
            if (url.includes("sort_order"))
            {
                return Promise.resolve({ data: "asc" });
            }
            return Promise.resolve({ data: mockHeroesData });
        });
        (axios.put as jest.Mock).mockImplementation(() =>
        {
            return Promise.resolve({ data: curPage });
        });

        render(
            <MemoryRouter initialEntries={['/heroes']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/add" element={<Add/>}/>
                </Routes>
            </MemoryRouter>
        );

        // Wait for API call to complete and data to be rendered
        await screen.findByText("Drow Ranger");

        let selectMenu = screen.getByTestId("select-nr-items-page") as HTMLSelectElement;
        fireEvent.change(selectMenu,
        {
            target: { value: 1 }
        });
        expect(selectMenu.value).toBe("1");

        let fvoid = screen.queryByText("Faceless Void");
        expect(fvoid).toBeNull();

        let nextBtn = screen.getByTestId("next-btn");
        expect(nextBtn).toBeInTheDocument();
        curPage = 2;
        fireEvent.click(nextBtn as HTMLElement);  // curPage should be 2 after this
        fvoid = await screen.findByText("Faceless Void");
        expect(fvoid).toBeInTheDocument();

        let tide = screen.queryByText("Tidehunter");
        expect(tide).toBeNull();
        curPage = 3;
        fireEvent.click(nextBtn as HTMLElement);  // curPage should be 3 after this
        tide = await screen.findByText("Tidehunter");
        expect(tide).toBeInTheDocument();
    });
});
