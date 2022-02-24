import './App.css';
import { useState, useEffect } from 'react';
import { Link, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import OrgList from "./OrgList";
import ChartRoot from './ChartRoot';

function App() {

    const [data, setData] = useState([]);
	const [bigBoss, setBigBoss] = useState({});
	const [employees, setEmployees] = useState([]);
	const [tab, setTab] = useState("tree");

    const getData = async () => {
        const data = await fetch(
            "employees.json",
        );

        const employeesJSON = await data.json();

        setData(employeesJSON);
    };

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (data.length) {
			setBigBoss(data.find((person) => !person.hasOwnProperty("boss")));
			setEmployees([...data]);
			setData([]);
		}
	}, [data]);

	const handleNav = (which) => {
		setTab(which);
	};

    return (
        <div>
			<Router>
				<header>Employee Org Chart</header>
				<main>
					<nav>
						<Link
							to="/"
							onClick={handleNav.bind(null, "tree")}
							className={tab === "tree" ? "active" : ""}
						>
							Org Chart
						</Link>
						<Link
							to="/list"
							onClick={handleNav.bind(null, "list")}
							className={tab === "list" ? "active" : ""}
						>
							Org List
						</Link>
					</nav>
					<article>
						<Routes>
							<Route exact path="/"
								element={<ChartRoot bigBoss={bigBoss} employees={employees} />}
							/>
							<Route path="/list"
								element={<OrgList employees={employees} />}
							/>
						</Routes>
					</article>
				</main>
			</Router>
		</div>
  );
}

export default App;
