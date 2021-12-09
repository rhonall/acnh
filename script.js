const search = document.querySelector("form")
const input = document.querySelector('input[type="text"]')
const category = document.querySelector("#category")
const container = document.querySelector("#container")
const favLists = document.querySelectorAll(".favList")
const favBugsList = document.querySelector("#favBugs-ul")
const favFishesList = document.querySelector("#favFishes-ul")
const favFossilsList = document.querySelector("#favFossils-ul")
const favVillagersList = document.querySelector("#favVillagers-ul")
const favBugsArr = []
const favFishesArr = []
const favFossilsArr = []
const favVillagersArr = []
const villagers = []

window.addEventListener("load", fetchVillagers, { once: true} )

// Fetch Villagers data from API and store it in an array
function fetchVillagers() {
    let ACNHVillagers = `https://acnhapi.com/v1/villagers/`
    fetch(ACNHVillagers)
        .then(response => response.json())
        .then(data => {
            for (let key in data) {
                let v = Object.assign({fileName: `${key}`}, {name: `${data[key]["name"]["name-USen"]}`.toLowerCase()})
                villagers.push(v)
            }
        })
        .catch(error => console.log(error))
}


// Favourite Button
function addFav(arr, name) {
    const favBtn = document.querySelector("#favourite")
    favBtn.addEventListener("click", (e) => {
        if (e.target.innerHTML == "🤍") {
            e.target.innerHTML = "❤️" // red heart
            // if (!arr.includes(name)){
            //     arr.push(name)
            // }
            // if (!arr.includes(name))
            //     arr.push(name)
            // if (!arr.includes(name)) arr.push(name)
            !arr.includes(name) && arr.push(name)
            fav(arr)
        } else {
            e.target.innerHTML = "🤍"
            arr.pop(name)
            fav(arr)
        }
    })
}

// Check which fav array has been added
function fav(arr) {
    if (arr == favBugsArr) {
        printFavList(favBugsArr, favBugsList)
    } else if (arr == favFishesArr) {
        printFavList(favFishesArr, favFishesList)
    } else if (arr == favFossilsArr) {
        printFavList(favFossilsArr, favFossilsList)
    } else {
        printFavList(favVillagersArr, favVillagersList)
    }
} 

// Print fav list
function printFavList(favArr, favList) {
    favList.innerHTML = ""
    favArr.forEach((element, index) => {
        const li = document.createElement("li")
        li.innerText = element
        const span = document.createElement("span")
        span.addEventListener("click", () => {
            favArr.splice(index, 1)
            printFavList(favArr, favList)
        })
        span.innerText = "x"
        li.appendChild(span)
        favList.appendChild(li)
    })
}

// Check if item has been liked
function checkifLoved (arr, data) {
    if (arr.includes(data["name"]["name-USen"])) {
        container.innerHTML += `<button id="favourite">❤️</button>`
    } else {
        container.innerHTML += `<button id="favourite">🤍</button>`
    }
}

// Update content according to categories
function makeFishOrBug(cat, data) {
    container.innerHTML = `
    <h1>${data["name"]["name-USen"].toUpperCase()}</h1>
    <img src="${data["icon_uri"]}" alt="${name}'s image">
    <h4>Price: ${data["price"]} Bells</h4>
    <h4>Northern Hemisphere: ${data["availability"]["month-northern"]}</h4>
    <h4>Southern Hemisphere: ${data["availability"]["month-southern"]}</h4>
    <h4>Location: ${data["availability"]["location"]}</h4>
    <h4>Rarity: ${data["availability"]["rarity"]}</h4>
    <h4 id="catch-phrase">"${data["catch-phrase"]}"</h4>   
    `
    cat == "fish" ? checkifLoved (favFishesArr, data) : checkifLoved (favBugsArr, data) 
}

function makeFossil(data) {
    container.innerHTML = `
    <h1>${data["name"]["name-USen"].toUpperCase()}</h1>
    <img src="${data["image_uri"]}" alt="${name}'s image">
    <h4>Price: ${data["price"]} Bells</h4>
    <h4 id="catch-phrase">${data["museum-phrase"]}</h4> 
    `
    checkifLoved (favFossilsArr, data) 
}

function makeVillager(data) {
    container.innerHTML = `
    <h1>${data["name"]["name-USen"].toUpperCase()}</h1>
    <img src="${data["icon_uri"]}" alt="${name}'s image">
    <h4>Personality: ${data["personality"]}</h4>
    <h4>Birthday: ${data["birthday-string"]}</h4>
    <h4>Species: ${data["species"]}</h4>
    <h4>Gender: ${data["gender"]}</h4>
    <h4 id="catch-phrase">"${data["catch-phrase"]}"</h4>
    <button id="favourite">🤍</button>    
    `
    checkifLoved (favVillagersArr, data) 
}

// Fetch data from ACNH API
function fetchData(cat, name) {
    let ACNHAPI = `https://acnhapi.com/v1/${cat}/` + name
    fetch(ACNHAPI)
        .then(response => response.json())
        .then(function(data) {
            if (cat == "fish" || cat == "bugs") {
                makeFishOrBug(cat, data)
                if (cat == "fish") {
                    addFav(favFishesArr, `${data["name"]["name-USen"]}`)
                } else {
                    addFav(favBugsArr, `${data["name"]["name-USen"]}`)
                }
            } else if (cat == "fossils") {
                makeFossil(data)
                addFav(favFossilsArr, `${data["name"]["name-USen"]}`)
            } else {
                makeVillager(data)
                addFav(favVillagersArr, `${data["name"]["name-USen"]}`)
            }
        })
        .catch(function(error) {
            console.log(error)
            container.innerHTML = `
            <h2 id="error">Can't find <span>${name}</span>, please try again!</h2>
        ` 
        })
}

// Search bar
search.addEventListener("submit", (e) => {
	e.preventDefault()  
    let canSearch = true
    let val = input.value.toLowerCase().replace(/ /g, "_")
    if (val == ''){
        canSearch = false
        alert("Input can't be empty")
    }
    let cat = category.value
    if (cat == "villagers") {
        try {
            let a = villagers.find(element => element["name"] == val)
            val = a["fileName"]
        } 
        catch (error) {
            canSearch = false
            container.innerHTML = `
            <h2 id="error">Can't find <span>${val}</span>, please try again!</h2>
        ` 
        } 
    }
    search.reset()
    if (canSearch) {
        fetchData(cat, val)
    }
})



