import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Button } from "react-bootstrap";
import {Chart, registerables} from "chart.js/auto";
import MyServices from "../services";
Chart.register(...registerables);


function BarChart()
{
    const categoryLength: number = 4;
    type Tuple = [number, number];

    // first element of the tuple/pair: the beginning number for a category;
    // these numbers have to be a multiple of `categoryLength + 1`;
    // second element of the tuple/pair: the number of strength values that we
    // have which fall into that category.
    const strCategories: Tuple[] = [];
    for (let hero of MyServices.heroes)
    {
        // check if the current strength already belongs to an existing category
        // (one in the strCategories array)
        let existsCategory: boolean = false;
        for (let catNr of strCategories)
        {
            if (catNr[0] === (hero.str - (hero.str % (categoryLength + 1))))
            {
                ++catNr[1];
                existsCategory = true;
                break;  // A given strength value can only belong to a single category.
            }
        }
        if (!existsCategory)
        {
            strCategories.push([hero.str - (hero.str % (categoryLength + 1)), 1]);
        }
    }

    strCategories.sort((a: Tuple, b: Tuple) =>
    {
        return a[0] - b[0];
    });

    const myData = {
        labels: strCategories.map((cat: Tuple) => cat[0].toString() + " - " + (cat[0] + categoryLength).toString()),
        datasets: [
            {
                backgroundColor: ["#8B0000"],  // dark red
                label: "# of heroes",
                data: strCategories.map((cat: Tuple) => cat[1])
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