import { useEffect, useState } from "react";
import Loading from "./Loading";

import styles from "./OrgList.module.css";

const OrgList = ({ employees }) => {
	const [allNames, setAllNames] = useState([]);
	const [list, setList] = useState([]);

	const handleChange = (e) => {
		setList(
			allNames.filter((ele) =>
				ele.toLowerCase().includes(e.target.value.toLowerCase())
			)
		);
	};

	useEffect(() => {
		let names = employees.map((emp) => emp.name).sort();
		setAllNames(names);
		setList(names);
	}, [employees]);

	return (
		<section>
			<header className={styles.searchBar}>
				<input
					placeholder="Search for an employee..."
					onChange={handleChange}
					onSubmit={handleChange}
				></input>
			</header>
			<ul className={styles.list}>
				{allNames.length ? (
					list.length ? (
						list.map((each, i) => <li key={`${each}-${i}`}>{each}</li>)
					) : (
						<li>No Results Found.</li>
					)
				) : (
					<Loading />
				)}
			</ul>
		</section>
	);
};

export default OrgList;
