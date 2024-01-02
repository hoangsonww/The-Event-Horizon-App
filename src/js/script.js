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
    {url: 'url("./images/snow.jpg")', isDark: false}, // Mostly white
    {url: 'url("./images/R.jfif")', isDark: true},      // Mostly dark
    {url: 'url("./images/R (1).jfif")', isDark: false},  // Mostly dark
    {url: 'url("./images/j1O8bCz.jpg")', isDark: true}, // Mostly dark
    {url: 'url("./images/wp4670197.jpg")', isDark: true}, // Mostly dark
    {url: 'url("./images/wp4511352.jpg")', isDark: true}  // Mostly dark
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
    const currentYear = new Date().getFullYear();
    switch(eventDropdown.value) {
        case "1 Jan":
            setEvent("New Year", new Date(`1 Jan ${currentYear + 1}`));
            break;
        case "10 Feb":
            setEvent("Lunar New Year", new Date(`10 Feb ${currentYear + 1}`));
            break;
        case "9 Nov":
            setEvent("My Birthday", new Date(`9 Nov ${currentYear}`));
            break;
    }
});

function setEvent(eventName, eventDate) {
    eventTitle.textContent = eventName;
    currentEventDate = eventDate.toISOString();
    countdown();
}

document.addEventListener('DOMContentLoaded', (event) => {
    const lastViewedCity = localStorage.getItem('lastViewedCity');
    if (lastViewedCity) {
        document.getElementById('weatherLocation').value = lastViewedCity;
        fetchWeather();
    }
    setRandomBackgroundImage();
});

document.addEventListener('DOMContentLoaded', function() {
    const lastEvent = JSON.parse(localStorage.getItem('lastEvent'));
    if (lastEvent) {
        eventTitle.textContent = lastEvent.name;
        currentEventDate = lastEvent.date;
    }
    else {
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

function shareEvent() {
    const shareModal = document.getElementById('shareModal');
    const shareLinkInput = document.getElementById('shareLink');
    const eventName = eventTitle.textContent;
    const eventDate = currentEventDate;
    const shareLink = `${window.location.href}?event=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventDate)}`;
    shareLinkInput.value = shareLink;

    document.getElementById('facebookShare').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    document.getElementById('twitterShare').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventName)}&url=${encodeURIComponent(shareLink)}`;
    document.getElementById('emailShare').href = `mailto:?subject=${encodeURIComponent(eventName)}&body=Check out this event: ${encodeURIComponent(shareLink)}`;
    shareModal.style.display = 'block';
}

function closeModal() {
    const shareModal = document.getElementById('shareModal');
    shareModal.style.display = 'none';
}

function copyToClipboard() {
    const shareLinkInput = document.getElementById('shareLink');
    shareLinkInput.select();
    document.execCommand('copy');
}

function displayCustomEvents() {
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
    const ul = document.querySelector('#custom-events-list ul');
    ul.innerHTML = "";

    customEvents.forEach((event, index) => {
        const li = document.createElement('li');
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toDateString(); // Format to 'Sat Dec 30 2023'

        const eventSpan = document.createElement('span');
        eventSpan.textContent = `${event.name} (${formattedDate})`;
        eventSpan.addEventListener('click', function() {
            eventTitle.textContent = event.name;
            currentEventDate = event.date;
            countdown();
        });

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

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function elizaResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        return "Hello! How can I help you with your event countdowns today?";
    } else if (lowerMessage.includes("about")) {
        return "EventHorizon is an app to help you count down to significant events in your life. You can select from predefined events or set up your custom events.";
    } else if (lowerMessage.includes("how are you")) {
        return "I'm just a bot, but I'm here and ready to help!";
    } else if (lowerMessage.includes("event")) {
        return "You can create countdowns for different events. If you have a custom event, just specify its name and date!";
    } else if (lowerMessage.includes("background")) {
        setRandomBackgroundImage();
        displayRandomQuote();
        return "Background and quote updated!";
    } else if (lowerMessage.includes("quote")) {
        displayRandomQuote();
        return "Quote refreshed!";
    } else if (lowerMessage.includes("thanks") || lowerMessage.includes("thank you")) {
        return "You're welcome! Let me know if you have more questions.";
    } else if (lowerMessage.includes("who are you")) {
        return "I'm the EventHorizon Assistant. I'm here to guide you on using this app and answer any questions you might have.";
    } else if (lowerMessage.includes("features")) {
        return "You can set countdowns for different events, choose from predefined ones or create your custom event, change the background, get inspired by a quote, and now you can chat with me for more information!";
    } else if (lowerMessage.includes("joke")) {
        return "Why did the calendar factory get shut down? Because it took a day off!";
    } else if (lowerMessage.includes("countdown")) {
        return "EventHorizon helps you create countdowns for special events in your life, keeping track of the days, hours, minutes, and seconds until your event!";
    } else if (lowerMessage.includes("custom event")) {
        return "You can create a custom event by entering its name and date. Just use the 'Set Event' button!";
    } else if (lowerMessage.includes("inspiration")) {
        return "Get inspired! Ask for an inspirational quote, and I'll provide you with some motivational words.";
    } else if (lowerMessage.includes("help")) {
        return "I'm here to assist! Feel free to ask about events, backgrounds, quotes, or any questions you have about EventHorizon.";
    } else if (lowerMessage.includes("bye") || lowerMessage.includes("goodbye")) {
        return "Farewell! Don't hesitate to return if you have more questions. Happy event-planning!";
    } else if (lowerMessage.includes("weather")) {
        return "You can check the weather by entering a city name. I'll tell you the temperature, weather, humidity, and chance of rain.";
    } else if (lowerMessage.includes("share")) {
        return "You can share your event with friends by clicking on the 'Share' button. You can share via Facebook, Twitter, or Email.";
    } else if (lowerMessage.includes("notes")) {
        return "You can take notes for your event by clicking on the 'Notes' button. You can save your notes and view them later.";
    } else if (lowerMessage.includes("reminder")) {
        return "You can set a reminder for your event by entering the number of hours before the event you want to be reminded. I'll let you know when it's time!";
    } else if (lowerMessage.includes("chatbot")) {
        return "You can chat with me! Just click on the + button to open the chatbot.";
    } else if (lowerMessage.includes("edit")) {
        return "You can edit your event by clicking on the 'Edit Event' button. You can change the event name and date.";
    } else if (lowerMessage.includes("delete")) {
        return "You can delete your custom event by clicking on the 'Delete' button next to the event.";
    } else if (lowerMessage.includes("facebook")) {
        return "You can share your event on Facebook by clicking on the 'Share on Facebook' button.";
    } else if (lowerMessage.includes("twitter")) {
        return "You can share your event on Twitter by clicking on the 'Share on Twitter' button.";
    } else if (lowerMessage.includes("email")) {
        return "You can share your event via Email by clicking on the 'Share via Email' button.";
    } else if (lowerMessage.includes("copy")) {
        return "You can copy your event link by clicking on the 'Copy' button.";
    } else if (lowerMessage.includes("minimize")) {
        return "You can minimize the chatbot by clicking on the '-' button.";
    } else if (lowerMessage.includes("maximize")) {
        return "You can maximize the chatbot by clicking on the '+' button.";
    } else if (lowerMessage.includes("close")) {
        return "You can close the chatbot by clicking on the 'x' button.";
    } else if (lowerMessage.includes("open")) {
        return "You can open the chatbot by clicking on the '+' button.";
    } else if (lowerMessage.includes("set reminder")) {
        return "You can set a reminder for your event by entering the number of hours before the event you want to be reminded. I'll let you know when it's time!";
    } else {
        return "I'm not sure about that, can you ask differently or specify more?";
    }
}

const chatbotInput = document.getElementById("chatbotInput");
const chatbotBody = document.getElementById("chatbotBody");

chatbotInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage(chatbotInput.value);
        chatbotInput.value = "";
    }
});

function sendMessage(message) {
    chatbotBody.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px; color: white;">${message}</div>
    `;
    let botReply = elizaResponse(message);
    setTimeout(() => {
        chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: white;">${botReply}</div>
        `;
    }, 1000);
}

const changeBackgroundBtn = document.createElement("button");
changeBackgroundBtn.textContent = "Change Background";
changeBackgroundBtn.style.position = "fixed";
changeBackgroundBtn.style.bottom = "10px";
changeBackgroundBtn.style.left = "10px";
changeBackgroundBtn.id = "changeBackgroundBtn";
changeBackgroundBtn.onclick = function() {
    setRandomBackgroundImage();
    displayRandomQuote();
};
document.body.appendChild(changeBackgroundBtn);

countdown();
displayRandomQuote();
setRandomBackgroundImage();
setInterval(countdown, 1000);

const reminderInput = document.getElementById('reminder-time');

function setReminder() {
    const reminderHours = reminderInput.value;
    const reminderTime = new Date(currentEventDate);
    reminderTime.setHours(reminderTime.getHours() - reminderHours);

    localStorage.setItem('eventReminder', JSON.stringify({ date: reminderTime, eventName: eventTitle.textContent }));
    alert(`Reminder set for ${eventTitle.textContent} ${reminderHours} hours before the event. You will be notified ${reminderHours} hours before the event.`);
}

function checkForReminders() {
    const reminderData = JSON.parse(localStorage.getItem('eventReminder'));
    if (reminderData) {
        const now = new Date();
        const reminderTime = new Date(reminderData.date);

        if (now >= reminderTime) {
            alert(`Reminder: ${reminderData.eventName} is coming up!`);
            localStorage.removeItem('eventReminder');
        }
    }
}

setInterval(checkForReminders, 60000);

const notesInput = document.getElementById('eventNotes');

function saveNotes() {
    const notes = notesInput.value;
    localStorage.setItem('eventNotes', notes);
    alert('Notes saved!');
}

function loadNotes() {
    const savedNotes = localStorage.getItem('eventNotes');
    if (savedNotes) {
        notesInput.value = savedNotes;
    }
}

document.addEventListener('DOMContentLoaded', loadNotes);

function toggleNotes() {
    const notesContent = document.getElementById('notesContent');
    const toggleNotesButton = document.getElementById('toggleNotesButton');

    if (notesContent.style.display === 'none') {
        notesContent.style.display = 'block';
        toggleNotesButton.textContent = '−';
    }
    else {
        notesContent.style.display = 'none';
        toggleNotesButton.textContent = '+';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    if (!notesInput.value) {
        toggleNotes();
    }
});

const openWeatherUrl = '593309284d3eb093ee96647eb294905b';

document.getElementById('weatherLocation').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});

async function fetchWeather() {
    const location = document.getElementById('weatherLocation').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openWeatherUrl}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        displayWeather(data);
        localStorage.setItem('lastViewedCity', location);
    }
    catch (error) {
        console.error('Failed to fetch weather data:', error);
        alert('Failed to fetch weather data');
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const temperature = Math.round(data.main.temp);
    const chanceOfRain = data.rain ? data.rain['1h'] : '0';

    weatherDisplay.innerHTML = `
        <p><strong>${data.name}</strong></p>
        <p>Temperature: <strong>${temperature}°C</strong></p>
        <p>Weather: <strong>${data.weather[0].main}</strong></p>
        <p>Humidity: <strong>${data.main.humidity}%</strong></p>
        <p>Chance of Rain: <strong>${chanceOfRain}%</strong></p>
    `;
}

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbotBody');
    const chatbotInput = document.getElementById('chatbotInput');
    const minimizeChatbot = document.getElementById('minimizeChatbot');

    if (chatbotBody.style.display === 'none') {
        chatbotBody.style.display = 'block';
        chatbotInput.style.display = 'block';
        minimizeChatbot.textContent = '−';
    }
    else {
        chatbotBody.style.display = 'none';
        chatbotInput.style.display = 'none';
        minimizeChatbot.textContent = '+';
    }
}

toggleChatbot();

function isPredefinedEvent(eventName) {
    const predefinedEvents = ["New Year", "Lunar New Year", "My Birthday"];
    return predefinedEvents.includes(eventName);
}

function openEditModal() {
    if (isPredefinedEvent(eventTitle.textContent)) {
        alert("Events like New Year or Lunar New Year cannot be edited.");
        return;
    }

    const editEventModal = document.getElementById('editEventModal');
    editEventModal.style.display = 'block';

    document.getElementById('newEventName').value = eventTitle.textContent;
    const currentEventDateTime = new Date(currentEventDate);
    document.getElementById('newEventDate').value = currentEventDateTime.toISOString().slice(0, 16);
}

function closeEditModal() {
    const editEventModal = document.getElementById('editEventModal');
    editEventModal.style.display = 'none';
}

function updateEventDetails() {
    const newEventName = document.getElementById('newEventName').value;
    let newEventDateTime = document.getElementById('newEventDate').value;

    if (newEventName && newEventDateTime) {
        newEventDateTime = new Date(newEventDateTime);
        newEventDateTime.setMinutes(newEventDateTime.getMinutes() - newEventDateTime.getTimezoneOffset());

        eventTitle.textContent = newEventName;
        currentEventDate = newEventDateTime.toISOString();

        const eventToSave = {
            name: newEventName,
            date: currentEventDate
        };
        localStorage.setItem('lastEvent', JSON.stringify(eventToSave));
        updateCustomEvents(eventToSave);

        countdown();
        closeEditModal();
    }
    else {
        alert("Please fill in all fields.");
    }
}

function updateCustomEvents(updatedEvent) {
    const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
    const existingEventIndex = customEvents.findIndex(event => event.name === eventTitle.textContent);

    if (existingEventIndex >= 0) {
        customEvents[existingEventIndex] = updatedEvent;
    }
    else {
        customEvents.push(updatedEvent);
    }

    localStorage.setItem('customEvents', JSON.stringify(customEvents));
    displayCustomEvents();
}

function countdown() {
    const targetDate = new Date(currentEventDate);
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = formatTime(days);
        hoursEl.textContent = formatTime(hours);
        minsEl.textContent = formatTime(minutes);
        secondsEl.textContent = formatTime(seconds);
    }
    else {
        daysEl.textContent = hoursEl.textContent = minsEl.textContent = secondsEl.textContent = "00";
    }
    setTimeout(countdown, 1000);
}

document.addEventListener('DOMContentLoaded', countdown);
document.getElementById('editEventButton').addEventListener('click', openEditModal);
