import useFormatSalary from "../hooks/useFormatSalary";
import styles from "./ChartNode.module.css";

export default function ChartNode({name, salary, employees, level = 1, last, onClick}) {
	const formatSalary = useFormatSalary(salary);

    const handleClick = () => {
        if (level === 1) return;
        onClick({
            name,
            salary,
            employees
        });
    }

	return (
            <div className={styles.node_wrapper}>
                <div className={`${styles["level_"+level]} ${styles.rectangle} ${last && styles.lastNode}`} onClick={handleClick}>
                    <span data-testid="nameText" className={styles.name}>{name}</span>
                    <span data-testid="salaryText" className={styles.salary}>Salary: {formatSalary}</span>
                </div>
                
                {employees.length 
                ?
                <div className={styles[`level_${level+1}_wrapper`]}>
                    {employees.map((e, idx) => (
                        <ChartNode level={level + 1} last={idx + 1 === employees.length} onClick={onClick} {...e} />
                    ))}
                </div>
                :
                <></>
            }
            </div>
	);
}
