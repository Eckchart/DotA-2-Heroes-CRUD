import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import HeroesTable from "./components/HeroesTable";
import Add from "./components/AddPage";
import Edit from "./components/Edit";
import BarChart from "./components/BarChart";
import AbilitiesTable from "./components/AbilitiesTable";
import EditAbility from "./components/EditAbility";
import AddAbility from "./components/AddAbilityPage";


function App()
{
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/add" element={<Add/>}/>
                    <Route path="/heroes/edit" element={<Edit/>}/>
                    <Route path="/heroes/bar_chart" element={<BarChart/>}/>
                    <Route path="/abilities" element={<AbilitiesTable/>}/>
                    <Route path="/abilities/add" element={<AddAbility/>}/>
                    <Route path="/abilities/edit" element={<EditAbility/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
