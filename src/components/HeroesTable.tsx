import {Fragment, useState, useEffect, ChangeEvent} from 'react';
import {Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import MyServices from "../services";
import { Hero } from "../domain";


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
                       className={`page-link ${curPage === 1 ? "disabled" :""}`}>
                        Previous
                    </a>
                </li>
                {pageNrs.map((pageNr: number) => (
                    <li key={pageNr} className="page-item">
                        <a onClick={(e) => { e.preventDefault(); changePage(pageNr) }}
                           href="!#"
                           className={`page-link ${curPage === pageNr ? "active" : ""}`}>
                        {pageNr}
                        </a>
                    </li>
                ))}
                <li className="page-item">
                    <a data-testid="next-btn" onClick={(e) => { e.preventDefault(); changePage(curPage + 1) }}
                       href="!#"
                       className={`page-link ${curPage === lastPage ? "disabled" :""}`}>
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
    const [filterText, setFilterText] = useState("");
    const [curPage, setCurPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(
        (localStorage.getItem("items-per-page") == null ? null : parseInt(localStorage.getItem("items-per-page") as string)) || 3
    );

    useEffect(() =>
    {
        localStorage.setItem("items-per-page", itemsPerPage.toString());
    }, [itemsPerPage]);

    const handleDelete = (hero_id: number) =>
    {
        const confirmed: boolean = window.confirm("Are you sure you want to delete this item?");
        if (confirmed)
        {
            MyServices.delete(hero_id);
            history("/heroes");  // To trigger a re-render.
        }
    }

    const handleEdit = (hero: Hero) =>
    {
        localStorage.setItem("Hero Id", hero.hero_id.toString());
        localStorage.setItem("Hero Name", hero.name);
        localStorage.setItem("Hero Strength", hero.str.toString());
        localStorage.setItem("Hero Agility", hero.agi.toString());
        localStorage.setItem("Hero Intelligence", hero.int.toString());
        localStorage.setItem("Hero Move Speed", hero.ms.toString());
    }

    const filteredHeroes: Hero[] = MyServices.heroes.filter((hero: Hero) =>
    {
        return hero.name.toLowerCase().includes(filterText.toLowerCase());
    });
    
    const changePage = (pageNr: number) =>
    {
        setCurPage(pageNr);
    };

    const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) =>
    {
        const newNrItemsPerPage = parseInt(e.target.value);
        if (newNrItemsPerPage > itemsPerPage)
        {
            changePage(1);
        }
        setItemsPerPage(newNrItemsPerPage);
    };

    const lastItemIdx = curPage * itemsPerPage - 1;
    const firstItemIdx = lastItemIdx - itemsPerPage + 1;
    const curPageItems = filteredHeroes.slice(firstItemIdx, lastItemIdx + 1);  // items to be displayed for the current page

    return (
        <Fragment>
            <div style={{margin: "8rem"}}>
                <div className="pagination-filter-comps">
                    <Pagination nrItemsPerPage={itemsPerPage} totalNrItems={filteredHeroes.length} curPage={curPage} changePage={changePage}/>

                    <select data-testid="select-nr-items-page" value={itemsPerPage} onChange={handleItemsPerPageChange}
                            style={{marginLeft: "1rem", width:"40px", height: "37px"}}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>

                    <input value={filterText} placeholder="Filter by name" onChange={(e) => setFilterText(e.target.value)}
                           style={{marginLeft: "24rem", width:"200px", height:"40px", textAlign: "center"}}/>
                </div>
                
                <Table bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Strength</th>
                            <th>Agility</th>
                            <th>Intelligence</th>
                            <th>Move speed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            curPageItems && curPageItems.length > 0
                            ?
                            curPageItems.map((item: Hero) =>
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
                            "No data available."
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
