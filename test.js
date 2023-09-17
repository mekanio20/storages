
function br1() {
    const oby = {
        name: "addidas sad"
    }
    const data = br2(oby)
    return data 
}

function br2(oby) {
    oby.name = oby.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + oby.name.slice(1).toLowerCase()
    return oby
}

let result = br1()

console.log(result);

// let brand = 'addidAs sads '
// brand = brand.trim().split(' ').join(' ').charAt(0).toUpperCase() + brand.slice(1).toLowerCase()
// console.log(brand);