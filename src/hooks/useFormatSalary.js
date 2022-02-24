const useFormatSalary = (salary) => {
	return salary ? `$${salary.toLocaleString()}` : null;
};

export default useFormatSalary;
