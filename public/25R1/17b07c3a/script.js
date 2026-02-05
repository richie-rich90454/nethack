let balance = 10000
const numStocks = 4
const stockPrices = Array(numStocks).fill(0)
const stockQuantities = Array(numStocks).fill(0)
const priceHistories = Array.from({ length: numStocks }, () => [0])
const colors = ["blue", "green", "red", "orange"]
const maxHistoryLength = 20
const numRealEstates = 12
const realEstatePrices = [
    30000, 50000, 80000, 120000, 200000, 350000, 500000, 700000, 900000, 1200000, 1500000, 2000000
]
const realEstateOwnership = Array(numRealEstates).fill(false)
const realEstatePriceHistories = Array.from({ length: numRealEstates }, () => [])
const realEstateRentInfo = [
    { rentFee: 300, rentTime: 1 },
    { rentFee: 500, rentTime: 1 },
    { rentFee: 800, rentTime: 2 },
    { rentFee: 1200, rentTime: 2 },
    { rentFee: 2000, rentTime: 3 },
    { rentFee: 3500, rentTime: 3 },
    { rentFee: 5000, rentTime: 3 },
    { rentFee: 7000, rentTime: 4 },
    { rentFee: 9000, rentTime: 4 },
    { rentFee: 12000, rentTime: 5 },
    { rentFee: 15000, rentTime: 5 },
    { rentFee: 20000, rentTime: 6 }
]
const realEstateRentEndTimes = Array(numRealEstates).fill(null)
let bankSavings = 0
let bankLoan = 0
const livingExpense = 20
let currentPeriod = 0
const trendInterval = 15
let currentTrend = null
const canvas = document.getElementById("stock-graph")
const ctx = canvas.getContext("2d")
const stocksContainer = document.getElementById("stocks-container")
const balanceDisplay = document.getElementById("balance-display")
const totalStockValueDisplay = document.getElementById("total-stock-value")
const toggleSidebar = document.getElementById("toggle-sidebar")
const sidebar = document.getElementById("sidebar")
const realEstateContainer = document.getElementById("real-estate-container")
const realEstatePortfolioValueDisplay = document.getElementById("real-estate-portfolio-value")
const totalRealEstateValueDisplay = document.getElementById("total-real-estate-value")
const realEstateOwnershipDiv = document.getElementById("real-estate-ownership")
const stockSection = document.getElementById("stock-section")
const realEstateSection = document.getElementById("real-estate-section")
const bankSection = document.getElementById("bank-section")
const stockButton = document.getElementById("stock-investment")
const realEstateButton = document.getElementById("real-estate-investment")
const bankButton = document.getElementById("bank-investment")

function showInvestmentSection(sectionToShow) {
    stockSection.style.display = "none"
    realEstateSection.style.display = "none"
    bankSection.style.display = "none"
    sectionToShow.style.display = "block"
}

stockButton.addEventListener("click", function () {
    showInvestmentSection(stockSection)
})

realEstateButton.addEventListener("click", function () {
    showInvestmentSection(realEstateSection)
})

bankButton.addEventListener("click", function () {
    showInvestmentSection(bankSection)
})

toggleSidebar.addEventListener("click", function () {
    if (sidebar.style.display == "none") {
        sidebar.style.display = "block"
    } else {
        sidebar.style.display = "none"
    }
})

function createStockUI() {
    for (let i = 0; i < numStocks; i++) {
        const stockDiv = document.createElement("div")
        stockDiv.classList.add("stock")
        stockDiv.innerHTML = `
            <span class="color-indicator" style="background-color: ${colors[i]};"></span>
            <p>Stock ${i + 1} Price: <span id="stock-price-${i}">${stockPrices[i].toFixed(3)}</span> $</p>
            <p>Your Stock ${i + 1} Quantity: <span id="stock-quantity-${i}">${stockQuantities[i]}</span></p>
            <p>Stock ${i + 1} Portfolio Value: <span id="portfolio-value-${i}">0</span> $</p>
            <label for="buy-quantity-${i}">Buy Quantity for Stock ${i + 1}:</label>
            <input type="number" id="buy-quantity-${i}" min="1">
            <button onclick="buyStock(${i})">Buy</button>
            <label for="sell-quantity-${i}">Sell Quantity for Stock ${i + 1}:</label>
            <input type="number" id="sell-quantity-${i}" min="1">
            <button onclick="sellStock(${i})">Sell</button>
            <button onclick="sellAllStocks(${i})">Sell All</button>
        `
        stocksContainer.appendChild(stockDiv)
    }
}

function createRealEstateUI() {
    for (let i = 0; i < numRealEstates; i++) {
        const realEstateDiv = document.createElement("div")
        realEstateDiv.classList.add("real-estate")
        realEstateDiv.innerHTML = `
            <p>Real Estate ${i + 1} Price: <span id="real-estate-price-${i}">${realEstatePrices[i].toFixed(3)}</span> $</p>
            <p>Your Ownership: <span id="real-estate-ownership-${i}">${realEstateOwnership[i] ? "Owned" : "Not Owned"}</span></p>
            <button id="buy-real-estate-${i}" onclick="buyRealEstate(${i})">Buy</button>
            <button id="sell-real-estate-${i}" onclick="sellRealEstate(${i})" ${!realEstateOwnership[i] ? "disabled" : ""}>Sell</button>
            <button id="rent-real-estate-${i}" onclick="rentRealEstate(${i})" ${!realEstateOwnership[i] || realEstateRentEndTimes[i] !== null ? "disabled" : ""}>Rent</button>
            <p id="rent-status-${i}" ${realEstateRentEndTimes[i] === null ? 'style="display: none;"' : ""}>Rented until period ${realEstateRentEndTimes[i]}</p>
        `
        realEstateContainer.appendChild(realEstateDiv)
        if (realEstateOwnership[i]) {
            realEstateDiv.style.backgroundColor = "#e0e0e0"
        }
    }
}

function updateUI() {
    let totalStockValue = 0
    for (let i = 0; i < numStocks; i++) {
        const portfolioValue = stockQuantities[i] * stockPrices[i]
        document.getElementById(`stock-price-${i}`).textContent = stockPrices[i].toFixed(3)
        document.getElementById(`stock-quantity-${i}`).textContent = stockQuantities[i]
        document.getElementById(`portfolio-value-${i}`).textContent = portfolioValue.toFixed(3)
        totalStockValue += portfolioValue
    }

    let totalRealEstateValue = 0
    for (let i = 0; i < numRealEstates; i++) {
        if (realEstateOwnership[i]) {
            totalRealEstateValue += realEstatePrices[i]
        }
        document.getElementById(`real-estate-price-${i}`).textContent = realEstatePrices[i].toFixed(3)
        document.getElementById(`real-estate-ownership-${i}`).textContent = realEstateOwnership[i]
            ? "Owned"
            : "Not Owned"
        document.getElementById(`buy-real-estate-${i}`).disabled = realEstateOwnership[i]
        document.getElementById(`sell-real-estate-${i}`).disabled = !realEstateOwnership[i]
        const rentButton = document.getElementById(`rent-real-estate-${i}`)
        rentButton.disabled = !realEstateOwnership[i] || realEstateRentEndTimes[i] !== null
        const rentStatus = document.getElementById(`rent-status-${i}`)
        if (realEstateRentEndTimes[i] !== null) {
            rentStatus.style.display = "block"
            rentStatus.textContent = `Rented until period ${realEstateRentEndTimes[i]}`
        } else {
            rentStatus.style.display = "none"
        }
        const realEstateDiv = document.querySelector(`.real-estate:nth-child(${i + 1})`)
        if (realEstateOwnership[i]) {
            realEstateDiv.style.backgroundColor = "#e0e0e0"
        } else {
            realEstateDiv.style.backgroundColor = "white"
        }
    }

    balanceDisplay.textContent = balance.toFixed(3)
    totalStockValueDisplay.textContent = totalStockValue.toFixed(3)
    totalRealEstateValueDisplay.textContent = totalRealEstateValue.toFixed(3)
    realEstatePortfolioValueDisplay.textContent = totalRealEstateValue.toFixed(3)

    realEstateOwnershipDiv.innerHTML = ""
    for (let i = 0; i < numRealEstates; i++) {
        if (realEstateOwnership[i]) {
            const p = document.createElement("p")
            p.textContent = `Real Estate ${i + 1}: $${realEstatePrices[i].toFixed(3)}`
            realEstateOwnershipDiv.appendChild(p)
        }
    }

    const totalNetWorth = balance + bankSavings + totalStockValue + totalRealEstateValue - bankLoan
    document.getElementById("total-net-worth").textContent = totalNetWorth.toFixed(3)

    document.getElementById("bank-savings").textContent = bankSavings.toFixed(3)
    document.getElementById("bank-loan").textContent = bankLoan.toFixed(3)

    drawGraph()
}

function buyStock(stockIndex) {
    const buyQuantity = parseInt(document.getElementById(`buy-quantity-${stockIndex}`).value)
    if (isNaN(buyQuantity) || buyQuantity <= 0) {
        alert("Please enter a valid quantity.")
        return
    }
    const totalCost = buyQuantity * stockPrices[stockIndex]
    if (totalCost > balance) {
        alert("Insufficient funds.")
        return
    }
    balance -= totalCost
    stockQuantities[stockIndex] += buyQuantity
    updateUI()
}

function sellStock(stockIndex) {
    const sellQuantity = parseInt(document.getElementById(`sell-quantity-${stockIndex}`).value)
    if (isNaN(sellQuantity) || sellQuantity <= 0) {
        alert("Please enter a valid quantity.")
        return
    }
    if (sellQuantity > stockQuantities[stockIndex]) {
        alert("You do not have enough stocks to sell.")
        return
    }
    const totalIncome = sellQuantity * stockPrices[stockIndex]
    balance += totalIncome
    stockQuantities[stockIndex] -= sellQuantity
    updateUI()
}

function sellAllStocks(stockIndex) {
    if (stockQuantities[stockIndex] > 0) {
        const totalIncome = stockQuantities[stockIndex] * stockPrices[stockIndex]
        balance += totalIncome
        stockQuantities[stockIndex] = 0
        updateUI()
    } else {
        alert("You do not have any stocks of this type to sell.")
    }
}

function buyRealEstate(realEstateIndex) {
    if (realEstateOwnership[realEstateIndex]) {
        alert("You already own this real estate.")
        return
    }
    const totalCost = realEstatePrices[realEstateIndex]
    if (totalCost > balance) {
        alert("Insufficient funds.")
        return
    }
    balance -= totalCost
    realEstateOwnership[realEstateIndex] = true
    updateUI()
}

function sellRealEstate(realEstateIndex) {
    if (!realEstateOwnership[realEstateIndex]) {
        alert("You do not own this real estate.")
        return
    }
    if (realEstateRentEndTimes[realEstateIndex] !== null) {
        alert("You cannot sell a rented property.")
        return
    }
    const totalIncome = realEstatePrices[realEstateIndex]
    balance += totalIncome
    realEstateOwnership[realEstateIndex] = false
    realEstateRentEndTimes[realEstateIndex] = null
    updateUI()
}

function rentRealEstate(realEstateIndex) {
    if (!realEstateOwnership[realEstateIndex]) {
        alert("You do not own this real estate to rent.")
        return
    }
    if (realEstateRentEndTimes[realEstateIndex] !== null) {
        alert("This property is already rented.")
        return
    }
    const rentInfo = realEstateRentInfo[realEstateIndex]
    const rentFee = rentInfo.rentFee
    const rentTime = rentInfo.rentTime
    const currentPeriod = getCurrentPeriod()
    realEstateRentEndTimes[realEstateIndex] = currentPeriod + rentTime
    balance += rentFee
    updateUI()
}

function autoRentRealEstate() {
    for (let i = 0; i < numRealEstates; i++) {
        if (realEstateOwnership[i] && realEstateRentEndTimes[i] === null) {
            rentRealEstate(i)
        }
    }
}

function updateStockPrices() {
    currentPeriod++
    if (currentPeriod % trendInterval === 0) {
        const chance = Math.random()
        if (chance < 0.5) {
            currentTrend = "up"
        } else {
            currentTrend = "down"
        }
    }

    for (let i = 0; i < numStocks; i++) {
        let change
        if (currentTrend === "up") {
            change = Math.random() * 10
            if (stockPrices[i] >= 85) {
                if (Math.random() < 0.1) {
                    change = Math.abs(change)
                } else {
                    change = -Math.abs(change)
                }
            } else {
                if (Math.random() < 0.6) {
                    change = Math.abs(change)
                } else {
                    change = -Math.abs(change)
                }
            }
        } else if (currentTrend === "down") {
            change = Math.random() * 10
            if (stockPrices[i] <= 10) {
                if (Math.random() < 0.1) {
                    change = -Math.abs(change)
                } else {
                    change = Math.abs(change)
                }
            } else {
                if (Math.random() < 0.6) {
                    change = -Math.abs(change)
                } else {
                    change = Math.abs(change)
                }
            }
        } else {
            change = Math.random() * 10
            if (stockPrices[i] >= 85) {
                if (Math.random() < 0.1) {
                    change = Math.abs(change)
                } else {
                    change = -Math.abs(change)
                }
            } else if (stockPrices[i] <= 10) {
                if (Math.random() < 0.1) {
                    change = -Math.abs(change)
                } else {
                    change = Math.abs(change)
                }
            } else {
                if (Math.random() < 0.55) {
                    change = Math.abs(change)
                } else {
                    change = -Math.abs(change)
                }
            }
        }

        let newPrice = stockPrices[i] + change
        newPrice = Math.max(0, Math.min(100, newPrice))
        stockPrices[i] = newPrice
        priceHistories[i].push(newPrice)
        if (priceHistories[i].length > maxHistoryLength) {
            priceHistories[i].shift()
        }
    }

    updateUI()
}
function updateRealEstatePrices() {
    for (let i = 0; i < numRealEstates; i++) {
        let change = Math.random() * 10000 - 5000
        if (Math.random() < 0.6) {
            change = Math.abs(change)
        } else {
            change = -Math.abs(change)
        }
        let newPrice = realEstatePrices[i] + change
        newPrice = Math.max(10000, newPrice)
        realEstatePrices[i] = newPrice
        realEstatePriceHistories[i].push(newPrice)
        if (realEstatePriceHistories[i].length > maxHistoryLength) {
            realEstatePriceHistories[i].shift()
        }
    }
    updateUI()
}

function updateRentStatus() {
    const currentPeriod = getCurrentPeriod()
    for (let i = 0; i < numRealEstates; i++) {
        if (realEstateRentEndTimes[i] !== null && realEstateRentEndTimes[i] <= currentPeriod) {
            realEstateRentEndTimes[i] = null
        }
    }
    balance = Math.max(0, balance - livingExpense)
    autoRentRealEstate()
    updateUI()
}

function getCurrentPeriod() {
    return Math.floor(Date.now() / 5000)
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const minPrice = 0
    const maxPrice = 100
    const priceRange = maxPrice - minPrice
    const xScale = canvas.width / (maxHistoryLength - 1)
    const yScale = (canvas.height - 10) / priceRange - 0.1
    ctx.font = "12px Arial"
    ctx.fillStyle = "#333"
    const numMarkers = 5
    for (let i = 0; i <= numMarkers; i++) {
        const price = minPrice + (i / numMarkers) * priceRange
        const y = canvas.height - (price - minPrice) * yScale - 10
        ctx.fillText(price.toFixed(3), 5, y + 5)
        ctx.beginPath()
        ctx.moveTo(20, y)
        ctx.lineTo(30, y)
        ctx.strokeStyle = "#ccc"
        ctx.stroke()
    }
    for (let i = 0; i < numStocks; i++) {
        const priceHistory = priceHistories[i]
        if (priceHistory.length === 0) continue
        ctx.beginPath()
        ctx.moveTo(0, canvas.height - (priceHistory[0] - minPrice) * yScale)
        for (let j = 1; j < priceHistory.length; j++) {
            const x = j * xScale
            const y = canvas.height - (priceHistory[j] - minPrice) * yScale
            ctx.lineTo(x, y)
        }
        ctx.strokeStyle = colors[i]
        ctx.lineWidth = 2
        ctx.stroke()
    }
}

function depositToBank() {
    const depositAmount = parseInt(document.getElementById("deposit-amount").value)
    if (isNaN(depositAmount) || depositAmount <= 0) {
        alert("Please enter a valid deposit amount.")
        return
    }
    if (depositAmount > balance) {
        alert("Insufficient funds to make this deposit.")
        return
    }
    balance -= depositAmount
    bankSavings += depositAmount
    updateUI()
}

function withdrawFromBank() {
    const withdrawAmount = parseInt(document.getElementById("withdraw-amount").value)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        alert("Please enter a valid withdrawal amount.")
        return
    }
    if (withdrawAmount > bankSavings) {
        alert("You do not have enough savings to withdraw this amount.")
        return
    }
    balance += withdrawAmount
    bankSavings -= withdrawAmount
    updateUI()
}

function takeLoan() {
    const loanAmount = parseInt(document.getElementById("loan-amount").value)
    if (isNaN(loanAmount) || loanAmount <= 0) {
        alert("Please enter a valid loan amount.")
        return
    }
    balance += loanAmount
    bankLoan += loanAmount
    updateUI()
}

function repayLoan() {
    if (bankLoan === 0) {
        alert("You do not have an outstanding loan.")
        return
    }
    if (balance < bankLoan) {
        alert("Insufficient funds to repay the entire loan.")
        return
    }
    balance -= bankLoan
    bankLoan = 0
    updateUI()
}

setInterval(updateStockPrices, 2500)
setInterval(updateRealEstatePrices, 5000)
setInterval(updateRentStatus, 5000)

createStockUI()
createRealEstateUI()
updateUI()
showInvestmentSection(stockSection)
