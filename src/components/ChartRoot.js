import { useEffect, useState, useRef } from "react";
//import useFormatSalary from "../hooks/useFormatSalary";
import Loading from "./Loading";
import ChartNode from "./ChartNode";
import styles from "./ChartRoot.module.css";
import nodeStyles from "./ChartNode.module.css";

const ChartRoot = ({ bigBoss, employees }) => {
	const [chart, setchart] = useState({});
	const [chartReady, setchartReady] = useState(false);
	const [salary, setSalary] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [startingPerson, setStartingPerson] = useState(null);
    const searchInput = useRef(null);

	useEffect(() => {
        let subSalary = 0;
        const recursiveFindEmployees = (personItem) => {
            subSalary += personItem.salary;
            const myEmployees = employees.filter(
                (person) => person.boss === personItem.name
            );
            if (myEmployees.length) {
                personItem["employees"] = myEmployees;
                myEmployees.forEach((empl) => recursiveFindEmployees(empl));
            } else {
                setSalary(subSalary);
                personItem["employees"] = [];
            }
            return personItem;
		};

		if (employees.length) {
			if (!chartReady) {
				const tempEmployees = recursiveFindEmployees(
                    startingPerson !== null ? startingPerson : bigBoss
                );
				setchart(tempEmployees);
				setchartReady(true);
			}
		}

	}, [employees, bigBoss, salary, startingPerson]);

    // loop through employees and apply proper classes based on hierarchy
    // give the last "row" on display a class to prevent drawing unnecessary lines
    let employeeLevel = 1;
	const RecursiveBranches = (startingBranch) => {
		if (startingBranch.employees.length) {
            employeeLevel += 1;
			return (
				<ul className={nodeStyles["level_"+employeeLevel+"_wrapper"]}>
					{startingBranch.employees.map((person, idx) => (
						<li key={`${person.boss}-${person.name}`}>
							<ChartNode 
                                name={person.name} 
                                salary={person.salary} 
                                level={employeeLevel} 
                                last={idx + 1 === startingBranch.employees.length && !person.employees.length}
                                onClick={() => changeStartingPoint(person)}
                            />
							{RecursiveBranches(person)}
						</li>
					))}
				</ul>
			);
		}
	};

    const handleChange = (e) => {
        setInputValue(e.target.value);
		const employeeMatch = employees.filter((emp) =>
            emp.name.toLowerCase() === e.target.value.toLowerCase()
		);

        // if input matches an employee name, change the org chart starting point
        if (employeeMatch.length) {
            changeStartingPoint(employeeMatch[0]);
        } else {
            setStartingPerson(null);
        }
	};

    const changeStartingPoint = (employee) => {
        setchartReady(false);
        setSalary(null);
        setStartingPerson(employee);
    }

    const handleReset = () => {
        if (startingPerson !== bigBoss) {
            setchartReady(false);
            setStartingPerson(bigBoss);
        }
        setInputValue("");
    }

	const finalSalary = (totalSalary) => '$'.concat(totalSalary);

	return chartReady ? (
        <div className={styles.container}>
            <header className={styles.searchBar}>
				<input
					placeholder="Start from employee..."
					onChange={handleChange}
                    value={inputValue}
                    ref={searchInput}
				></input>
                <button
                    className={styles.btn}
                    onClick={handleReset}
                >Reset</button>
			</header>
            <ChartNode 
                name={chart.name} 
                salary={chart.salary} 
                last={!chart.employees.length} 
            />
            {RecursiveBranches(chart)}
			<footer>
				<span className={`${chartReady ? styles.normalDisplay : styles.flashDisplay}`}>Total Salary: {finalSalary(salary)}</span>
			</footer>
		</div>
	) : (
		<Loading />
	);
};

export default ChartRoot;
