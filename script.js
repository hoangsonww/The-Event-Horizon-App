const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

const eventTitle = document.getElementById("event-title");
const eventDropdown = document.getElementById("event-dropdown");
const customEventInput = document.getElementById("custom-event");

let currentEventDate = "1 Jan 2024";

const customEventNameInput = document.getElementById("custom-event-name");
const aboutText = document.getElementById("about-text");
const dateWarning = document.getElementById("date-warning");

const quotes = [
    "Life isn’t about finding yourself. Life is about creating yourself.",
    "Inspiration does exist, but it must find you working.",
    "Don’t wait for inspiration. It comes while one is working.",
    "Dream big and dare to fail.",
    "Our greatest glory is not in never falling, but in rising every time we fall.",
    "All our dreams can come true, if we have the courage to pursue them.",
    "The best way to predict the future is to create it.",
    "Believe you can and you're halfway there."
];

const bgImages = [
    {url: 'url("./snow.jpg")', isDark: false}, // Mostly white
    {url: 'url("R.jfif")', isDark: true},      // Mostly dark
    {url: 'url("R (1).jfif")', isDark: true},  // Mostly dark (assuming from your description)
    {url: 'url("j1O8bCz.jpg")', isDark: true}, // Mostly dark (assuming from your description)
    {url: 'url("wp4670197.jpg")', isDark: true}, // Mostly dark (assuming from your description)
    {url: 'url("wp4511352.jpg")', isDark: true}  // Mostly dark (assuming from your description)
];

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteElement = document.getElementById('inspirational-quote');
    quoteElement.textContent = `“${quotes[randomIndex]}”`;
}

function setRandomBackgroundImage() {
    const randomIndex = Math.floor(Math.random() * bgImages.length);
    const chosenImage = bgImages[randomIndex];
    document.body.style.backgroundImage = chosenImage.url;
    const textColor = chosenImage.isDark ? "white" : "black";

    document.getElementById('inspirational-quote').style.color = textColor;
    document.getElementById('event-title').style.color = textColor;
    document.getElementById('custom-events-list').style.color = textColor;
    document.body.style.color = textColor;

    const labels = document.querySelectorAll('.event-selector label');
    labels.forEach(label => label.style.color = textColor);

    if (aboutText) {
        aboutText.style.color = textColor;
    }
}

function updateEvent() {
    const selectedDate = new Date(customEventInput.value);
    const currentDate = new Date();
    dateWarning.textContent = "";
    dateWarning.classList.remove("warning-active");
    if (selectedDate.setHours(0,0,0,0) < currentDate.setHours(0,0,0,0)) {
        dateWarning.textContent = "Please choose a future date!";
        dateWarning.classList.add("warning-active");
        return;
    }
    if (customEventInput.value && customEventNameInput.value.trim() !== "") {
        const customDate = new Date(customEventInput.value);
        eventTitle.textContent = customEventNameInput.value.trim();
        currentEventDate = customDate.toDateString();
        countdown();
    }
    else if (customEventInput.value) {
        const customDate = new Date(customEventInput.value);
        eventTitle.textContent = customDate.toDateString();
        currentEventDate = customDate.toDateString();
        countdown();
    }
    const eventToSave = {
        name: eventTitle.textContent,
        date: currentEventDate
    };
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];

    if (customEvents.length === 0) {
        eventTitle.textContent = "New Year 2024";
        currentEventDate = "1 Jan 2024";
    }

    localStorage.setItem('lastEvent', JSON.stringify(eventToSave));

    if (customEventInput.value) {
        addCustomEventToList(eventToSave.name, eventToSave.date);
    }
}

eventDropdown.addEventListener("change", function() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    switch(eventDropdown.value) {
        case "1 Jan":
            eventTitle.textContent = `New Year ${currentYear + 1}`;
            currentEventDate = `1 Jan ${currentYear + 1}`;
            break;
        case "10 Feb":
            eventTitle.textContent = `Lunar New Year ${currentYear + 1}`;
            currentEventDate = `10 Feb ${currentYear + 1}`;  // You might need a logic to calculate the exact Lunar New Year, as it's based on the lunar calendar
            break;
        case "9 Nov":
            eventTitle.textContent = `My Birthday ${currentYear}`;
            currentEventDate = `9 Nov ${currentYear}`;  // Update if you need to change for the next year
            break;
    }
    countdown();
});

document.addEventListener('DOMContentLoaded', (event) => {
    setRandomBackgroundImage();
});


document.addEventListener('DOMContentLoaded', function() {
    const lastEvent = JSON.parse(localStorage.getItem('lastEvent'));
    if (lastEvent) {
        eventTitle.textContent = lastEvent.name;
        currentEventDate = lastEvent.date;
    } else { // This part is the fallback to default event
        eventTitle.textContent = "New Year 2024";
        currentEventDate = "1 Jan 2024";
    }
    countdown();
    displayCustomEvents();
    setRandomBackgroundImage();
});

function addCustomEventToList(name, date) {
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
    customEvents.push({ name, date });
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
    displayCustomEvents();
}

function displayCustomEvents() {
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
    const ul = document.querySelector('#custom-events-list ul');
    ul.innerHTML = "";
    customEvents.forEach((event, index) => {
        const li = document.createElement('li');

        // Create the event text span
        const eventSpan = document.createElement('span');
        eventSpan.textContent = `${event.name} (${event.date})`;
        eventSpan.addEventListener('click', function() {
            eventTitle.textContent = event.name;
            currentEventDate = event.date;
            countdown();
        });

        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            customEvents.splice(index, 1);
            localStorage.setItem('customEvents', JSON.stringify(customEvents));
            displayCustomEvents();
        });

        li.appendChild(eventSpan);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
}

function countdown() {
    const targetDate = new Date(currentEventDate); // This line correctly gets the date of the current event
    const currentDate = new Date();

    const totalSeconds = (targetDate - currentDate) / 1000;  // Use targetDate here

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    daysEl.innerHTML = days;
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(mins);
    secondsEl.innerHTML = formatTime(seconds);
}

function navigateToAboutPage() {
    window.location.href = "about.html";
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

countdown();

displayRandomQuote();

setRandomBackgroundImage();

setInterval(countdown, 1000);