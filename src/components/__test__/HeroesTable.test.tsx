import { render, fireEvent, screen } from "@testing-library/react";
import {MemoryRouter, BrowserRouter, Route, Routes} from "react-router-dom";
import Add from "../AddPage";
import HeroesTable from "../HeroesTable";
import MyServices from "../../services";
import { Hero } from "../../domain";


describe("Heroes Table", () =>
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
    
    it("should have as many heroes initially as there are in the repository", () =>
    {
        render(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HeroesTable/>}/>
            </Routes>
        </BrowserRouter>);
            
        const heroTableRows = screen.getAllByTestId("hero-row");
        expect(heroTableRows.length).toBe(MyServices.heroes.length);
    });

    it("should delete a hero when pressing the delete button AND confirming", () =>
    {
        render(
        <MemoryRouter initialEntries={['/heroes']}>
            <Routes>
                <Route path="/heroes" element={<HeroesTable/>}/>
            </Routes>
        </MemoryRouter>);

        const initialRowCount = screen.getAllByTestId("hero-row").length;
        const deleteBtns = screen.getAllByTestId("delete-btn");
        window.confirm = jest.fn(() => true);
        fireEvent.click(deleteBtns[0]);

        const updatedRowCount = screen.getAllByTestId("hero-row").length;
        expect(updatedRowCount).toBe(initialRowCount - 1);
        expect(MyServices.heroes.length).toBe(2);
    });

    it("should NOT delete a hero when pressing the delete button but NOT confirming", () =>
    {
        render(
        <MemoryRouter initialEntries={['/heroes']}>
            <Routes>
                <Route path="/heroes" element={<HeroesTable/>}/>
            </Routes>
        </MemoryRouter>);

        const initialRowCount = screen.getAllByTestId("hero-row").length;
        const deleteBtns = screen.getAllByTestId("delete-btn");
        window.confirm = jest.fn(() => false);
        fireEvent.click(deleteBtns[0]);

        const updatedRowCount = screen.getAllByTestId("hero-row").length;
        expect(updatedRowCount).toBe(initialRowCount);
        expect(MyServices.heroes.length).toBe(3);
    });

    it("should only display 2 heroes when filtering by 'a'", () =>
    {
        render(
        <MemoryRouter initialEntries={['/heroes']}>
            <Routes>
                <Route path="/heroes" element={<HeroesTable/>}/>
            </Routes>
        </MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText("Filter by name"),
        {
            target: { value: "a" }
        });
        const tableRowCount: number = screen.getAllByTestId("hero-row").length;
        expect(tableRowCount).toBe(2);
        const medusa = screen.getByText("Medusa");
        expect(medusa).toBeInTheDocument();
        const ogre_magi = screen.getByText("Ogre Magi");
        expect(ogre_magi).toBeInTheDocument();
        const riki = screen.queryByText("Riki");
        expect(riki).toBeNull();
    });

    it("should only display medusa when filtering by 'med'", () =>
    {
        render(
        <MemoryRouter initialEntries={['/heroes']}>
            <Routes>
                <Route path="/heroes" element={<HeroesTable/>}/>
            </Routes>
        </MemoryRouter>);
        fireEvent.change(screen.getByPlaceholderText("Filter by name"),
        {
            target: { value: "med" }
        });
        const tableRowCount: number = screen.getAllByTestId("hero-row").length;
        expect(tableRowCount).toBe(1);
        const medusa = screen.getByText("Medusa");
        expect(medusa).toBeInTheDocument();
        const riki = screen.queryByText("Riki");
        expect(riki).toBeNull();
    });

    it("should display a second page when adding a new hero (assuming there are only 3 heroes per page)", () =>
    {
        render(
        <MemoryRouter initialEntries={['/heroes']}>
            <Routes>
                <Route path="/heroes" element={<HeroesTable/>}/>
                <Route path="/heroes/add" element={<Add/>}/>
            </Routes>
        </MemoryRouter>);
        const createBtn = screen.getByTestId("create-btn");
        fireEvent.click(createBtn);
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
        expect(MyServices.heroes.length).toBe(4);
        let newHeroName = screen.queryByText("Timbersaw");
        expect(newHeroName).toBeNull();
        let nextBtn = screen.queryByTestId("next-btn");
        expect(nextBtn).toBeInTheDocument();
        fireEvent.click(nextBtn as HTMLElement);
        newHeroName = screen.queryByText("Timbersaw");
        expect(newHeroName).toBeInTheDocument();
    });

    it("should display 3 heroes when we select to have 3 items per page, and 4 heroes when we select to have 4 items per page and have added a new hero", () =>
    {
        render(
        <MemoryRouter initialEntries={['/heroes']}>
            <Routes>
                <Route path="/heroes" element={<HeroesTable/>}/>
                <Route path="/heroes/add" element={<Add/>}/>
            </Routes>
        </MemoryRouter>);

        let selectMenu = screen.getByTestId("select-nr-items-page") as HTMLSelectElement;
        fireEvent.change(selectMenu,
        {
            target: { value: "2" }
        });
        expect(selectMenu.value).toBe("2");

        let riki = screen.queryByText("Riki");
        expect(riki).toBeNull();
        fireEvent.change(selectMenu,
        {
            target: { value: "3" }
        });
        expect(selectMenu.value).toBe("3");
        riki = screen.queryByText("Riki");
        expect(riki).toBeInTheDocument();
    });
})