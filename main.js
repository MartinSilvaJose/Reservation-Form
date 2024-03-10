// ----------DECLARATION-----------
let fDate = document.getElementsByClassName('fDate')[0];
let eDate = document.getElementsByClassName('eDate')[0];
let nAdults = document.getElementsByClassName('nAdults')[0];
let nChilds = document.getElementsByClassName('nChilds')[0];
let nRooms = document.getElementsByClassName('nRooms')[0];
let btnReserve = document.getElementsByClassName('btnReserve')[0];
let btnReset = document.getElementsByClassName('btnReset')[0];
let successText = document.getElementsByClassName('successText')[0];
let fields = Array.from(document.querySelectorAll('input'));
let today = new Date();
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

    loadSelect();

    setInterval(timerCalculation, 1000);

    // if local storage exists we load it
    if (localStorage.getItem('reserveForm')) {
        downloadLocalStorage();
    } else {
        fDate.valueAsDate = today;
        eDate.valueAsDate = addDaysToDate(today, 1);
    }


    fDate.addEventListener('input', validityDate);
    eDate.addEventListener('input', validityDate);

    nAdults.addEventListener('input', allowSend);
    nChilds.addEventListener('input', allowSend);

    // Add events to buttons
    btnReserve.addEventListener('click', () =>{
        successText.removeAttribute('hidden');
        //Move scroll to the success text
        window.scrollBy(0, 100);
    })
    btnReset.addEventListener('click',resetForm);


    sRooms.addEventListener('input', () => {
        price.textContent = `Precio de la Habitación: ${document.querySelector('option:checked').value} €`
        allowSend();
    })

    summaryZone();
}


function validityDate() {
    let thisDate = new Date(this.value);
    if (thisDate < today) {
        this.setCustomValidity('La fecha debe de ser posterior a la de hoy');

        this.classList.add('fieldError');

    } else {
        this.setCustomValidity('');
        this.classList.remove('fieldError');
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

        eDate.classList.add('.fieldError');
    } else {
        eDate.classList.remove('fieldError');
        eDate.setCustomValidity('');
    }

    // ----------PERSONS-----------
    if (nAdults.value < 0) nAdults.value = 0;

    if (nChilds.value < 0) nChilds.value = 0;

    if(nAdults.value == 0){
        nAdults.setCustomValidity('Tiene que haber al menos 1 adulto.');

        nAdults.classList.add('fieldError');
    } else {
        nAdults.classList.remove('fieldError');
        nAdults.setCustomValidity('');
    }
    document.querySelector('.nAdultsError').textContent = nAdults.validationMessage;
    // ----------VALIDITY-----------

    let allValid = fields.every((field) => field.validity.valid);

    // When all fields its valids we save in local storage and create summary 
    if (allValid) {
        uploadLocalStorage();
        summaryZone();
    }

    successText.setAttribute('hidden', '');

    btnReserve.disabled = !allValid;
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
    summary[0].textContent = ` ((${nAdults.value} adultos x ${sRooms.value} € + ${nChilds.value} niños x ${sRooms.value / 2} €) x  ${timeDifference()} días) = ${priceCalculation()} €`;
    summary[1].textContent = ` ${priceCalculation() * 21 / 100} €`;
    summary[2].textContent = ` ${priceCalculation() + priceCalculation() * 21 / 100} €`;
}

function timeDifference() {
    let timeBefore = new Date(fDate.value);
    let timeAfter = new Date(eDate.value);
    let difference = timeAfter.getTime() - timeBefore.getTime();

    let hoursDifference = difference / 1000 / 60 / 60;

    //Return days difference
    return Math.round(hoursDifference / 24);
}

function priceCalculation() {
    return ((nAdults.value * sRooms.value + nChilds.value * sRooms.value / 2) * timeDifference());
}

function timerCalculation() {

    prepareTimer.setTime(prepareTimer.getTime() - 1000);

    if (prepareTimer.getMinutes() == 0 && prepareTimer.getSeconds() == 0) {
        location.reload()
    }

    timer.textContent = `${prepareTimer.getMinutes()} : ${prepareTimer.getSeconds()}`;

}

// ----------LOCAL STORAGE-----------

function uploadLocalStorage() {
    //Create JSON for save all fields values
    const reserveForm = {
        firstDate: fDate.value,
        endDate: eDate.value,
        numberAdults: nAdults.value,
        numberChilds: nChilds.value,
        //Save value selected 
        tipeRoom: document.querySelector('option:checked').value,
    }
    //Transform the JSON object into a string to load it into local storage
    localStorage.setItem('reserveForm', JSON.stringify(reserveForm));

}

function downloadLocalStorage() {
    // Transform the string into a JSON object.
    let fillForm = JSON.parse(localStorage.getItem('reserveForm'));

    //Fill fields
    fDate.value = fillForm.firstDate;
    eDate.value = fillForm.endDate;
    nAdults.value = fillForm.numberAdults;
    nChilds.value = fillForm.numberChilds;

    // Search type of room that we have saved and select it
    Array.from(document.querySelectorAll('option')).map((a)=>{
        if(a.value === fillForm.tipeRoom){
            a.setAttribute('selected', '')
            console.log(a);
        }
    })  

}


function resetForm(){

    //Reset fields for defaults
    fDate.valueAsDate = today;
    eDate.valueAsDate = addDaysToDate(today, 1);
    nAdults.value = 1;
    nChilds.value = 0;
    Array.from(document.querySelectorAll('option'))[0].setAttribute('selected','');
    allowSend();
}