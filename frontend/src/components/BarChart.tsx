import { base_backend_url } from "./baseBackendUrl.ts";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Button } from "react-bootstrap";
import { Chart, registerables } from "chart.js/auto";
import axios from "axios";
import { Socket } from "socket.io-client";
Chart.register(...registerables);


interface BarChartProps
{
    socket: Socket
}


const BarChart: React.FC<BarChartProps> = ({ socket }) =>
{
    let history = useNavigate();
    type categoryCount =
    {
        category: number,
        count: number
    };
    const [strCategories, setStrCategories] = useState<categoryCount[]>([]);
    const [webSocketFlag, setWebSocketFlag] = useState<number>(0);

    socket.on("changed-heroes-table", () =>
    {
        setWebSocketFlag(webSocketFlag ^ 1);
    });
    
    useEffect(() =>
    {
        const fetchStrCategories = async () =>
        {
            try
            {
                const token = localStorage.getItem("jwt_token");
                if (!token)
                {
                    history("/login");
                    return;
                }
                const response = await axios.get<categoryCount[]>(`${base_backend_url}/api/heroes/bar_chart`,
                {
                    headers:
                    {
                        'Authorization': `Bearer ${token}`
                    }
                }
                );
                setStrCategories(response.data);
            }
            catch (error)
            {
                console.error("Error fetching str categories:", error);
            }
        };

        fetchStrCategories();
    }, [webSocketFlag, history]);
    
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
