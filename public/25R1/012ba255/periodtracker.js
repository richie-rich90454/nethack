//asking
let person = prompt("May we know your name?")
document.getElementById("name").textContent = person

document.getElementById("periodForm").addEventListener("submit", function (event) {
    event.preventDefault()

    const lastPeriodDateInput = document.getElementById("lastPeriodDate").value
    const lastingDays = parseInt(document.getElementById("lastingDays").value)
    const cycleLength = parseInt(document.getElementById("cycleLength").value)

    if (isNaN(lastingDays) || isNaN(cycleLength) || !lastPeriodDateInput) {
        alert("Please fill in all fields with valid values.")
        return
    }

    const lastPeriodDate = new Date(lastPeriodDateInput)
    if (isNaN(lastPeriodDate.getTime())) {
        alert("Please enter a valid date.")
        return
    }

    const nextPeriodDate = new Date(lastPeriodDate.getTime() + cycleLength * 24 * 60 * 60 * 1000)

    const resultDiv = document.getElementById("result")
    resultDiv.innerHTML = `Your next period is expected to start on: ${nextPeriodDate.toDateString()}`
    resultDiv.innerHTML += `<br>Lasting days: ${lastingDays}`
    resultDiv.innerHTML += `<br>Average cycle length: ${cycleLength} days`
})

let currentDate = new Date()
let currentMonth = currentDate.getMonth()
let currentYear = currentDate.getFullYear()
//document.getElementById("monthYear").innerHTML = currentDate;

const monthYear = document.getElementById("monthyear")
const calendarDays = document.getElementById("calendarDays")

document.getElementById("before").addEventListener("click", () => changeMonth(-1))
document.getElementById("next").addEventListener("click", () => changeMonth(1))

function updateCalendar() {
    monthYear.textContent = `${monthNames(currentMonth)} ${currentYear}`

    firstDay = new Date(currentYear, currentMonth, 1).getDay()
    totalDays = new Date(currentYear, currentMonth + 1, 0).getDate()

    calendarDays.innerHTML = ""

    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML += "<div class='empty'></div>"
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement("div")
        dayElement.textContent = day

        // Highlight today
        if (
            day === currentDate.getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()
        ) {
            dayElement.classList.add("today")
        }
        if (
            day === currentDate.getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()
        ) {
            dayElement.classList.add("periodStart")
        }
        if (
            day === currentDate.getDate() &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()
        ) {
            dayElement.classList.add("periodStart")
        }

        calendarDays.appendChild(dayElement)
    }
}
function monthNames(monthIndex) {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    return monthNames[monthIndex]
}
function changeMonth(direction) {
    currentMonth += direction

    // If current month is less than 0, move to previous year
    if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
    }

    // If current month is greater than 11, move to next year
    if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
    }

    updateCalendar()
}

updateCalendar()
