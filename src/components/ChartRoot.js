import { useEffect, useState } from "react";
import useFormatSalary from "../hooks/useFormatSalary";
import Loading from "./Loading";
import ChartNode from "./ChartNode";
import styles from "./ChartRoot.module.css";

const ChartRoot = ({ bigBoss, employees }) => {
	const [chart, setchart] = useState({});
	const [chartReady, setchartReady] = useState(false);
	const [salary, setSalary] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [startingPerson, setStartingPerson] = useState(null);

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

	}, [employees, bigBoss, chartReady, startingPerson]);

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

    const handleClick = (e) => {
        if (e.level === 1) return;
        changeStartingPoint(e);
    }

    const handleReset = () => {
        if (startingPerson !== bigBoss) {
            setchartReady(false);
            setStartingPerson(bigBoss);
        }
        setInputValue("");
    }

    const changeStartingPoint = (employee) => {
        setchartReady(false);
        setSalary(null);
        setStartingPerson(employee);
    }

    const finalSalary = useFormatSalary(salary);

	return chartReady ? (
        <div className={styles.container}>
            <header className={styles.searchBar}>
				<input
					placeholder="Start from employee..."
					onChange={handleChange}
                    value={inputValue}
				></input>
                <button
                    className={styles.btn}
                    onClick={handleReset}
                >Reset</button>
			</header>
            <ChartNode
                onClick={handleClick}
                {...chart}
            />
			<footer>
				<span className={`${chartReady ? styles.normalDisplay : styles.flashDisplay}`}>Total Salary: {finalSalary}</span>
			</footer>
		</div>
	) : (
		<Loading />
	);
};

export default ChartRoot;
