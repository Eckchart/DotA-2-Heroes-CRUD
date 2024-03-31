import "./App.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import HeroesTable from "./components/HeroesTable";
import Add from "./components/AddPage";
import Edit from "./components/Edit";
import BarChart from "./components/BarChart";


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
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;