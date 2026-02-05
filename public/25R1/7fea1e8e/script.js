let tape = []
let currentState = "q0"
let machinePosition
let rulesTable = {}
let allowedSymbols = ["0", "1"]

function loadCustomTape() {
    updateSymbols()
    let customTape = document.getElementById("customTape").value.trim()
    tape = customTape.split("")
    machinePosition = Math.floor(tape.length / 2)
    showTape()
}

function updateSymbols() {
    let symbols = document.getElementById("symbolInput").value
    if (symbols) {
        allowedSymbols = symbols.split("")
    } else {
        allowedSymbols = ["0", "1"]
    }
}

function generateTape() {
    updateSymbols()
    let length = 100
    let symbolsArray = Array.from(allowedSymbols)
    tape = Array.from({ length }, () => symbolsArray[Math.floor(Math.random() * symbolsArray.length)])
    machinePosition = Math.floor(tape.length / 2)
    showTape()
}

function showTape() {
    const divTape = document.getElementById("tape")
    divTape.innerHTML = ""
    divTape.style.display = "flex"
    divTape.style.overflowX = "scroll"
    divTape.style.whiteSpace = "nowrap"

    tape.forEach((symbol, index) => {
        let cell = document.createElement("div")
        cell.textContent = symbol
        cell.className = "tapeCell"

        if (index == machinePosition) {
            cell.classList.add("machineHeadCell")
        }
        divTape.appendChild(cell)
    })
}

function addRules() {
    let inputText = document.getElementById("inputRules").value
    rulesTable = loadRules(inputText)
    console.log(rulesTable)
}

function loadRules(inputText) {
    let updatedRulesTable = {}
    let rules = inputText.split("\n")
    let states = {}
    for (let rule of rules) {
        let components = rule.split(" ")
        let [currentState, readSymbol, writeSymbol, direction, nextState] = components
        if (!states[currentState]) {
            states[currentState] = new Set()
        }
        states[currentState].add(readSymbol)
        if (!updatedRulesTable[currentState]) {
            updatedRulesTable[currentState] = {}
        }
        updatedRulesTable[currentState][readSymbol] = [writeSymbol, direction, nextState]
    }
    return updatedRulesTable
}

function stepMachine() {
    let currentReading = tape[machinePosition]
    let [newSymbol, direction, newState] = rulesTable[currentState][currentReading]
    tape[machinePosition] = newSymbol
    currentState = newState
    if (direction == "L") {
        machinePosition--
        if (machinePosition < 0) {
            let randomSymbol = allowedSymbols[Math.floor(Math.random() * allowedSymbols.length)]
            tape.unshift(randomSymbol)
            machinePosition = 0
            showTape()
            document.getElementById("tape").scrollRight = 0
        }
    } else if (direction == "R") {
        machinePosition++
        if (machinePosition >= tape.length) {
            let randomSymbol = allowedSymbols[Math.floor(Math.random() * allowedSymbols.length)]
            tape.push(randomSymbol)
            showTape()
        }
    }

    showTape()
}

function startMachine() {
    showTape()
    runStep()
}

function runStep() {
    if (currentState == "qH") {
        return
    }
    stepMachine()
    setTimeout(runStep, 200)
}

function resetMachine() {
    currentState = "q0"
    machinePosition = 0
    generateTape()
}
