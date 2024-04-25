import { Fragment, useState, useEffect, ChangeEvent } from 'react';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { act } from "@testing-library/react";
import { Hero } from "../domain/Hero";


const Pagination = ({nrItemsPerPage, totalNrItems, curPage, changePage}:
    {nrItemsPerPage: number, totalNrItems: number, curPage: number, changePage: (pageNr: number) => void}) =>
{
    const lastPage = Math.ceil(totalNrItems / nrItemsPerPage);
    const pageNrs = [];
    for (let i = 1; i <= lastPage; ++i)
    {
        pageNrs.push(i);
    }
    return (
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a onClick={(e) => { e.preventDefault(); changePage(curPage - 1) }}
                       href="!#"
                       className={`page-link ${curPage === 1 ? "disabled" : ""}`}>
                        Previous
                    </a>
                </li>
                { pageNrs.map((pageNr: number) => (
                    <li key={pageNr} className="page-item">
                        <a onClick={(e) => { e.preventDefault(); changePage(pageNr) }}
                           href="!#"
                           className={`page-link ${curPage === pageNr ? "active" : ""}`}>
                        {pageNr}
                        </a>
                    </li>
                )) }
                <li className="page-item">
                    <a data-testid="next-btn" onClick={(e) => { e.preventDefault(); changePage(curPage + 1) }}
                       href="!#"
                       className={`page-link ${curPage === lastPage ? "disabled" : ""}`}>
                       Next
                    </a>
                </li>
            </ul>
        </nav>
    )
}


function HeroesTable()
{
    let history = useNavigate();
    const [filterText, setFilterText] = useState<string>("");
    const [curPage, setCurPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(
        localStorage.getItem("items-per-page") == null ? 3 : parseInt(localStorage.getItem("items-per-page") as string)
    );
    const [fetchedFilteredSortedCurPageHeroes, setFetchedFilteredSortedCurPageHeroes] = useState<Hero[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [totalFilteredHeroesCount, setTotalFilteredHeroesCount] = useState<number>(0);

    useEffect(() =>
    {
        const fetchTotalFilteredHeroesCount = async (): Promise<void> =>
        {
            try
            {
                const response = await axios.get<string>(`http://localhost:3001/api/heroes/count?filterText=${encodeURIComponent(filterText)}`);
                act(() => setTotalFilteredHeroesCount(parseInt(response.data)));
            }
            catch (error)
            {
                console.error("Error fetching total heroes count:", error);
            }
        };

        fetchTotalFilteredHeroesCount();
    }, [filterText]);

    useEffect(() =>
    {
        localStorage.setItem("items-per-page", itemsPerPage.toString());
    }, [itemsPerPage]);
    
    useEffect(() =>
    {
        const fetchFilteredSortedCurPageHeroes = async (): Promise<void> =>
        {
            try
            {
                const lastItemIdx: number = curPage * itemsPerPage - 1;
                const firstItemIdx: number = lastItemIdx - itemsPerPage + 1;

                const response = await axios.get<Hero[]>(`http://localhost:3001/api/heroes/filteredSortedCurPageItems?sortOrder=${encodeURIComponent(sortOrder)}` +
                    `&filterText=${encodeURIComponent(filterText)}` +
                    `&firstItemIdx=${encodeURIComponent(firstItemIdx)}` +
                    `&lastItemIdx=${encodeURIComponent(Math.min(totalFilteredHeroesCount - 1, lastItemIdx))}`);
                act(() =>
                    setFetchedFilteredSortedCurPageHeroes(response.data.map(heroData =>
                        // these have to conform to the table column names!
                        new Hero(heroData.heroName,
                                 heroData.baseStr,
                                 heroData.baseAgi,
                                 heroData.baseInt,
                                 heroData.baseMs,
                                 heroData.heroID)
                )));
            }
            catch (error)
            {
                console.error("Error fetching filtered, sorted, paginated heroes:", error);
            }
        };

        fetchFilteredSortedCurPageHeroes();
    }, [sortOrder, filterText, totalFilteredHeroesCount, itemsPerPage, curPage]);

    const handleDelete = async (hero_id: number): Promise<void> =>
    {
        const confirmed: boolean = window.confirm("Are you sure you want to delete this item?");
        if (confirmed)
        {
            try
            {
                await axios.delete<string>(`http://localhost:3001/api/heroes/${hero_id}`);
                act(() => history("/heroes"));
            }
            catch (error)
            {
                console.error("Error deleting item:", error);
            }
            try
            {
                // The total number of heroes has decreased, so we need to update it.
                const response = await axios.get<string>(`http://localhost:3001/api/heroes/count?filterText=${encodeURIComponent(filterText)}`);
                act(() => setTotalFilteredHeroesCount(parseInt(response.data)));
            }
            catch (error)
            {
                console.error("Error fetching total heroes count:", error);
            }
        }
    };

    const changePage = (pageNr: number): void =>
    {
        setCurPage(pageNr);
    };

    const handleEdit = (hero: Hero) =>
    {
        localStorage.setItem("Hero Id", hero.hero_id.toString());
        localStorage.setItem("Hero Name", hero.name);
        localStorage.setItem("Hero Strength", hero.str === null ? "0" : (hero.str as number).toString());
        localStorage.setItem("Hero Agility", hero.agi === null ? "0" : (hero.agi as number).toString());
        localStorage.setItem("Hero Intelligence", hero.int === null ? "0" : (hero.int as number).toString());
        localStorage.setItem("Hero Move Speed", hero.ms === null ? "0" : (hero.ms as number).toString());
    };
    
    const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) =>
    {
        const newNrItemsPerPage = parseInt(e.target.value);
        const newNrPages = Math.ceil(totalFilteredHeroesCount / newNrItemsPerPage);
        if (curPage > newNrPages)
        {
            changePage(1);
        }
        setItemsPerPage(newNrItemsPerPage);
    };

    return (
        <Fragment>
            <div style={{margin: "8rem"}}>
                <div className="pagination-filter-comps">
                    <Pagination nrItemsPerPage={itemsPerPage} totalNrItems={totalFilteredHeroesCount} curPage={curPage} changePage={changePage}/>

                    <select data-testid="select-nr-items-page" value={itemsPerPage} onChange={handleItemsPerPageChange}
                            style={{marginLeft: "1rem", width:"40px", height: "37px"}}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>

                    <input value={filterText} placeholder="Filter by name" onChange={(e) => setFilterText(e.target.value)}
                           style={{marginLeft: "24rem", width:"200px", height:"40px", textAlign: "center"}}/>
                </div>
                
                <Table bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>Strength {sortOrder === "asc" ? '↑' : '↓'}</th>
                            <th>Agility</th>
                            <th>Intelligence</th>
                            <th>Move speed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fetchedFilteredSortedCurPageHeroes && fetchedFilteredSortedCurPageHeroes.length > 0
                            ?
                            fetchedFilteredSortedCurPageHeroes.map((item: Hero) =>
                            {
                                return (
                                    <tr key={item.hero_id} data-testid="hero-row">
                                        <td>{item.name}</td>
                                        <td>{item.str}</td>
                                        <td>{item.agi}</td>
                                        <td>{item.int}</td>
                                        <td>{item.ms}</td>
                                        <td>
                                            <Button data-testid="delete-btn" onClick={() => handleDelete(item.hero_id)}>Delete</Button>
                                            &nbsp;
                                            <Link to="/heroes/edit">
                                                <Button data-testid="edit-btn" onClick={() => handleEdit(item)}>Edit</Button>
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
                
                <Link to="/heroes/add">
                    <Button data-testid="create-btn" size="lg">Create</Button>
                </Link>
                &nbsp;
                <Link to="/">
                    <Button size="lg">Home</Button>
                </Link>
                &nbsp;
                <Link to="/heroes/bar_chart">
                    <Button data-testid="strength-bar-chart-btn" size="lg">Strength Bar Chart</Button>
                </Link>
            </div>
        </Fragment>
    )
}

export default HeroesTable;
