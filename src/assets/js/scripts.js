//get ingredient data from API
async function getIngredientsList(type){
    const apiKey = "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf"
    const headers = {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
    }

    const requestOptions = {
        method: 'GET',
        headers: headers
    }

    const loaders = document.querySelectorAll(`.${type}-loader`)
    loaders.forEach(loader => loader.classList.remove('hidden'))

    try {
        const response = await fetch(`https://api.tech.redventures.com.br/${type}s`, requestOptions)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Cannot get data from API', error )
    } finally{
        loaders.forEach(loader => loader.classList.add('hidden'))
    }
}

//list ingredients
function showIngredientsList(type, items){
    const listElement = document.getElementById(`${type}s`)

    items.forEach(item => {
        const itemCard = document.createElement('li')
        itemCard.classList.add('ingredients__card')
        itemCard.classList.add(`ingredients__card--${type}s`)
        itemCard.setAttribute('id', `${type}-${item.id}`)
        itemCard.setAttribute('image-inactive', item.imageInactive)
        itemCard.setAttribute('image-active', item.imageActive)
        itemCard.setAttribute('onClick', `selectIngredient('${type}', '${type}-${item.id}')`)
        itemCard.innerHTML = `
        <img src="${item.imageInactive}" alt="">
        <h3>${item.name}</h3>
        <p class="ingredients-card-description">${item.description}</p>
        <p class="ingredients-card-price">US$ ${item.price}</p>
        `
        listElement.appendChild(itemCard)
    })
}

//select ingredient
window.selectIngredient = function selectIngredient(type, id) {
    const ingredientElement = document.getElementById(id)
    const isSelected = ingredientElement.classList.contains(`${type}-selected`)

    if (isSelected) {
        ingredientElement.classList.remove(`${type}-selected`)
        const selectedImg = ingredientElement.querySelector('img')
        selectedImg.src = ingredientElement.getAttribute('image-inactive')
    } else {
        const allItemImages = document.querySelectorAll(`.ingredients__card--${type}s img`)
        
        allItemImages.forEach(image => {
            image.setAttribute('src', image.parentNode.getAttribute('image-inactive'))
            image.parentNode.classList.remove(`${type}-selected`)
        });
        
        ingredientElement.classList.add(`${type}-selected`)
        
        const selectedImg = ingredientElement.querySelector('img')
        selectedImg.src = ingredientElement.getAttribute('image-active')
    }
}

function loadIngredients(){
    Promise.all([getIngredientsList('broth'), getIngredientsList('protein')]).then(([broths, proteins]) => {

        showIngredientsList('broth', broths)
        showIngredientsList('protein', proteins)
    
        document.querySelectorAll('.ingredients__card').forEach(card => {
            card.addEventListener('click', () => {
                const makeOrder = document.getElementById('makeOrder')
                const orderCreated = document.getElementById('orderCreated')
                const button = document.getElementById('placeOrder')
    
                const selectedBroth = document.querySelector('.broth-selected')
                const selectedProtein = document.querySelector('.protein-selected')
                if (selectedBroth && selectedProtein) {
                    button.removeAttribute('disabled')
                    button.addEventListener('click', () => {
                        makeOrder.style.display = 'none'
                        orderCreated.style.display = 'block'
                    })
                } else {
                    button.setAttribute('disabled', true)
                }
            })
        })
    })
}

loadIngredients()

async function makeOrderRequest(brothId, proteinId) {
    const apiKey = "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf"
    const headers = {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
    }
    const requestBody = JSON.stringify({
        brothId: brothId,
        proteinId: proteinId
    })

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: requestBody
    }

    try {
        const loader = document.getElementById('loader')
        loader.classList.remove('hidden')

        const existingOrder = document.querySelector('.order-infos__content')
        if (existingOrder) {
            existingOrder.parentNode.removeChild(existingOrder)
        }

        const response = await fetch('https://api.tech.redventures.com.br/orders', requestOptions)
        const data = await response.json()

        const orderContainer = document.getElementById('orderContainer')

        const orderInfos = document.createElement('div')
        orderInfos.classList.add('order-infos__content')
        orderInfos.innerHTML = `
            <img src="${data.image}">
            <p>Your Order:</p>
            <h1>${data.description}</h1>
        `;
        orderContainer.insertBefore(orderInfos, orderContainer.firstChild)
    } catch (error) {
        console.error('Error when placing the order:', error)
    } finally {
        const loader = document.getElementById('loader')
        loader.classList.add('hidden')
    }
}


function showOrderPlaced(){
    const button = document.getElementById('placeOrder')
    
    button.addEventListener('click', () => {
        const selectedBroth = document.querySelector('.broth-selected');
        const selectedProtein = document.querySelector('.protein-selected');
        if (selectedBroth && selectedProtein) {
            const brothId = selectedBroth.getAttribute('id').split('-')[1];
            const proteinId = selectedProtein.getAttribute('id').split('-')[1];
            makeOrderRequest(brothId, proteinId);
        }
    })
}

showOrderPlaced()

window.backToOrder = function backToOrder(){
    const makeOrder = document.getElementById('makeOrder')
    const orderCreated = document.getElementById('orderCreated')
    const button = document.getElementById('placeOrder')
    makeOrder.style.display = 'block'
    orderCreated.style.display = 'none'

    const selectedBroth = document.querySelector('.broth-selected')
    const selectedProtein = document.querySelector('.protein-selected')
    
    let selectedBrothImg = selectedBroth.querySelector('img')
    selectedBrothImg.src = selectedBroth.getAttribute('image-inactive')

    let selectedProteinImg = selectedProtein.querySelector('img')
    selectedProteinImg.src = selectedProtein.getAttribute('image-inactive')

    selectedProtein.classList.remove('protein-selected')
    selectedBroth.classList.remove('broth-selected')
    button.setAttribute('disabled', true)
}
