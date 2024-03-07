// ----------DECLARATION-----------
fDate = document.getElementsByClassName('fDate')[0];
eDate = document.getElementsByClassName('eDate')[0];
nAdults = document.getElementsByClassName('nAdults')[0];
nChilds = document.getElementsByClassName('nChilds')[0];
nRooms = document.getElementsByClassName('nRooms')[0];
btnReserve = document.getElementsByClassName('btnReserve')[0];
let fields = Array.from(document.querySelectorAll('input'));
today = new Date();
let sRooms = document.getElementsByClassName('sRooms')[0];
let price = document.getElementsByClassName('price')[0];

let rooms = {
    "habitaciones": [
        {
            "numero": 101,
            "descripcion": "Habitación Estándar",
            "precioBasePorDia": 100
        },
        {
            "numero": 102,
            "descripcion": "Suite de Lujo",
            "precioBasePorDia": 200
        },
        {
            "numero": 103,
            "descripcion": "Habitación Familiar",
            "precioBasePorDia": 150
        }
    ]
}
let summary = document.getElementsByClassName('summary');
let timer = document.getElementsByClassName('timer')[0];
let prepareTimer = new Date('2024', '02', '6', '0', '10');
window.addEventListener('load', init);

function init() {

    setInterval(timerCalculation , 1000)

    // playTimer = new Date(startTimer);
    // console.log(playTimer.toLocaleTimeString());
    // timerCalculation();

    fDate.valueAsDate = today;
    eDate.valueAsDate = addDaysToDate(today, 1);


    fDate.addEventListener('input', validityDate);
    eDate.addEventListener('input', validityDate);

    nAdults.addEventListener('input', allowSend);
    nChilds.addEventListener('input', allowSend);

    loadSelect();

    sRooms.addEventListener('input', () => {
        price.textContent = `Precio de la Habitación: ${document.querySelector('option:checked').value} €`
        allowSend();
    })
    summaryZone()
}


function validityDate() {
    let thisDate = new Date(this.value);
    if (thisDate < today) {
        this.setCustomValidity('La fecha debe de ser posterior a la de hoy');

        this.classList.add('error');

    } else {
        this.setCustomValidity('');
        this.classList.remove('error');
    }
    if (this.className.split(' ')[0] === 'fDate') eDate.valueAsDate = addDaysToDate(thisDate, 1);
    document.querySelector(`.${this.className.split(' ')[0]}Error`).textContent = this.validationMessage;
    allowSend();

}


function allowSend() {
    // ----------DATES-----------
    let firstDate = new Date(fDate.value);
    let endDate = new Date(eDate.value);

    if (firstDate >= endDate) {
        eDate.setCustomValidity('La fecha final debe de ser posterior a la de inicio');

        eDate.classList.add('error');
    } else {
        eDate.classList.remove('error');
        eDate.setCustomValidity('');
    }

    // ----------PERSONS-----------
    if (nAdults.value < 1) nAdults.value = 1;

    if (nChilds.value < 0) nChilds.value = 0;

    // ----------VALIDITY-----------

    let todosValidos = fields.every((field) => field.validity.valid);

    if(todosValidos) summaryZone();

    btnReserve.disabled = !todosValidos;
}

function loadSelect() {
    for (const room of rooms.habitaciones) {
        thisOption = document.createElement('option');

        thisOption.value = room.precioBasePorDia;
        thisOption.textContent = `${room.numero} - ${room.descripcion}`;

        sRooms.appendChild(thisOption);

    }
    price.textContent = `Precio de la Habitación: ${document.querySelector('option:checked').value} €`;

}


function addDaysToDate(date, days) {
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
}

function summaryZone() {
    summary[0].textContent = ` ((${nAdults.value} adultos * ${sRooms.value} € + ${nChilds.value} niños * ${sRooms.value/2} €) *  ${timeDifference()} días) = ${priceCalculation()}`;
    summary[1].textContent =  ` ${priceCalculation()*21/100} €`;
    summary[2].textContent = ` ${priceCalculation() + priceCalculation()*21/100} €`;
}

function timeDifference(){
    let timeBefore = new Date(fDate.value);
    let timeAfter = new Date(eDate.value);
    let difference = timeAfter.getTime() - timeBefore.getTime();

    let hoursDifference = difference / 1000 / 60 / 60;
    //Return days difference
    return Math.round(hoursDifference /24);
}

function priceCalculation(){
    return ((nAdults.value * sRooms.value + nChilds.value * sRooms.value/2) * timeDifference()); 
}

function timerCalculation(){

    prepareTimer.setTime(prepareTimer.getTime() - 1000);

    if(prepareTimer.getMinutes() == 0 && prepareTimer.getSeconds() == 0){
        location.reload()
    }

    timer.textContent = `${prepareTimer.getMinutes()} : ${prepareTimer.getSeconds()}`
    
}