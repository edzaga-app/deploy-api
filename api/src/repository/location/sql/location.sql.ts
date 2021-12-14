export enum LocationSql {
    getCountries = `select id,name as 'description' from countries order by name`,
    getStates = `select id,name as 'description' from states where country_id = ? order by name`,
    getCities = `select id,name as 'description' from cities where state_id = ? order by name`,

}