export const yearFilter = (degree) => {
    const uniqueYears = [...new Set(degree.map(deg => deg.degreeYear))];
    return uniqueYears.map((uniqueYear) => {
        const degreeList = degree.filter(deg => deg.degreeYear === uniqueYear);
        return {
            year_id: uniqueYear,
            yearName: formatDateString(uniqueYear),
            degreeList: degreeList,
            agentList: [...new Set(degreeList.map(deg => deg.degreeAgent))]
        }
    })
}

export const formatDateString = (dateString) => {
        // Split the input string by underscore
        const [month, year] = dateString.split('_');

        // Capitalize the first letter of the month and lowercase the rest
        const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

        // Combine the formatted month and year with a space
        return `${formattedMonth} ${year}`;
    }

export const degreeFilter = (degree, degreeYear) => {
    const yearName = degreeYear
    const filteredDegree = degree.filter((degree)=>{
        return degree.degreeYear === yearName
    })
    return {filteredDegree, yearName}
}

export const degreeFilterByAgent = (degree, degreeYear, id) => {
    const yearName = degreeYear
    const filteredDegree = degree.filter((degree)=>{
        return (degree.degreeYear === yearName && degree.degreeAgent._id === id)
    })
    return {filteredDegree, yearName}
}