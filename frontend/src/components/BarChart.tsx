import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Button } from "react-bootstrap";
import { Chart, registerables } from "chart.js/auto";
import axios from "axios";
Chart.register(...registerables);


function BarChart()
{
    type categoryCount =
    {
        category: number,
        count: number
    };
    const [strCategories, setStrCategories] = useState<categoryCount[]>([]);
    
    useEffect(() =>
    {
        const fetchStrCategories = async () =>
        {
            try
            {
                const response = await axios.get<categoryCount[]>("http://localhost:3001/api/heroes/bar_chart");
                setStrCategories(response.data);
            }
            catch (error)
            {
                console.error("Error fetching str categories:", error);
            }
        };

        fetchStrCategories();
    }, []);
    
    const categoryLength = 4;
    const myData = {
        labels: strCategories.map((catCnt: categoryCount) => catCnt.category.toString() + " - " + (catCnt.category + categoryLength).toString()),
        datasets: [
            {
                backgroundColor: ["#8B0000"],  // dark red
                label: "# of heroes",
                data: strCategories.map((catCnt: categoryCount) => catCnt.count)
            }
        ]
    };

    return (
        <div style={{ width: "50%", margin: "auto", marginTop: "20px"}}>
            <Bar data={myData}/>

            <br/>

            <Link to="/heroes">
                <Button data-testid="goBackBtn">Go Back</Button>
            </Link>
        </div>
        
    )
}

export default BarChart;
