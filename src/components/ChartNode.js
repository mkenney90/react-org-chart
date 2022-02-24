import useFormatSalary from "../hooks/useFormatSalary";
import styles from "./ChartNode.module.css";

export default function ChartNode({ name, salary, level = 1, last = false, onClick }) {
	const formatSalary = useFormatSalary(salary);

	return (
        <div className={styles.node_wrapper}>
            <div className={`${styles["level_"+level]} ${styles.rectangle} ${last ? styles.lastNode : ""}`} onClick={onClick}>
                <span data-testid="nameText" className={styles.name}>{name}</span>
                <span data-testid="salaryText" className={styles.salary}>Salary: {formatSalary}</span>
            </div>
        </div>
	);
}
