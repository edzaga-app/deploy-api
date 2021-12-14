export enum CustomerSql {
    save = `insert into customers (id,name,lastname,age,cellphone,email,address,cityId,fileId,isActive)
     values(?,?,?,?,?,?,?,?,?,?)`,
    
    update = `update customers set id=?,name=?,lastname=?,age=?,cellphone=?, email=?, address=?,cityId=?,
    fileId=?,isActive=? where customerId = ?`,

    getAll = `select customerId,
        id,
        name,
        lastname,
        age,
        cellphone,
        email,
        address,
        cityId,
        fileId,
        isActive,
        case when cityId <> 0 then (Select state_id from cities where id = cityID) else 0 end as idState,
        case when cityId <> 0 then (Select country_id from cities where id = cityId) else 0 end as idCountry
        from customers
        where isActive = 'T'
        order by name`,

    deleteById = `update customers set isActive = 'F' where customerId = ?`,

    getById = `select 
    customers.customerId,
    customers.id,
    customers.name,
    customers.lastname,
    customers.age,
    customers.cellphone,
    customers.email,
    customers.address,
    customers.cityId,
    customers.fileId,
    customers.isActive,
    case when cityId <> 0 then (Select state_id from cities where id = cityID) else 0 end as idState,
    case when cityId <> 0 then (Select country_id from cities where id = cityId) else 0 end as idCountry,
    cities.name as cityDescription
    from customers
    left join cities on customers.cityId = cities.id
    where customerId = ?`,
    
}