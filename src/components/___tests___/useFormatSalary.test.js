<script type="module" src="main.js"></script>

import React from "react";
import useFormatSalary from "../../hooks/useFormatSalary";

test("format salary", () => {
    const salary = 65000;
    const formattedSalary = useFormatSalary(salary);

    expect(formattedSalary).toEqual("$65,000");
});