import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";


function Home()
{
    return (
        <div className="container">
            <header>
                <h1 className="title">DotA 2 Heroes</h1>
            </header>
            <main>
                <Link to="/heroes">
                    <Button data-testid="view-btn" size="lg">View Heroes</Button>
                </Link>
                &nbsp;
                <Link to="/abilities">
                    <Button data-testid="view-abilities-btn" size="lg">View Abilities</Button>
                </Link>
            </main>
        </div>
    );
}

export default Home;
