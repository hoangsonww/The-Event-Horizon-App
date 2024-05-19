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
    const textColor = "black";

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
        eventTitle.textContent = "New Year 2025";
        currentEventDate = "1 Jan 2025";
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
        eventTitle.textContent = "New Year 2025";
        currentEventDate = "1 Jan 2025";
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

    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        console.log('Text copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
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
        deleteBtn.style.font = 'inherit';
        deleteBtn.style.fontSize = '11px';
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
    const responses = [
        {
            keywords: ["hello", "hi", "hey"],
            response: "Hello! How can I help you with your event countdowns today?"
        },
        {
            keywords: ["about"],
            response: "EventHorizon is an app to help you count down to significant events in your life. You can select from predefined events or set up your custom events."
        },
        {
            keywords: ["how are you"],
            response: "I'm just a bot, but I'm here and ready to help!"
        },
        {
            keywords: ["event"],
            response: "You can create countdowns for different events. If you have a custom event, just specify its name and date!"
        },
        {
            keywords: ["background"],
            response: function() {
                setRandomBackgroundImage();
                displayRandomQuote();
                return "Background and quote updated!";
            }
        },
        {
            keywords: ["quote"],
            response: function() {
                displayRandomQuote();
                return "Quote refreshed!";
            }
        },
        {
            keywords: ["thanks", "thank you"],
            response: "You're welcome! Let me know if you have more questions."
        },
        {
            keywords: ["who are you"],
            response: "I'm the EventHorizon Assistant. I'm here to guide you on using this app and answer any questions you might have."
        },
        {
            keywords: ["features"],
            response: "You can set countdowns for different events, choose from predefined ones or create your custom event, change the background, get inspired by a quote, and now you can chat with me for more information!"
        },
        {
            keywords: ["joke"],
            response: "Why did the calendar factory get shut down? Because it took a day off!"
        },
        {
            keywords: ["countdown"],
            response: "EventHorizon helps you create countdowns for special events in your life, keeping track of the days, hours, minutes, and seconds until your event!"
        },
        {
            keywords: ["custom event"],
            response: "You can create a custom event by entering its name and date. Just use the 'Set Event' button!"
        },
        {
            keywords: ["inspiration"],
            response: "Get inspired! Ask for an inspirational quote, and I'll provide you with some motivational words."
        },
        {
            keywords: ["help"],
            response: "I'm here to assist! Feel free to ask about events, backgrounds, quotes, or any questions you have about EventHorizon."
        },
        {
            keywords: ["bye", "goodbye"],
            response: "Farewell! Don't hesitate to return if you have more questions. Happy event-planning!"
        },
        {
            keywords: ["weather"],
            response: "You can check the weather by entering a city name. I'll tell you the temperature, weather, humidity, and chance of rain."
        },
        {
            keywords: ["share"],
            response: "You can share your event with friends by clicking on the 'Share' button. You can share via Facebook, Twitter, or Email."
        },
        {
            keywords: ["notes"],
            response: "You can take notes for your event by clicking on the 'Notes' button. You can save your notes and view them later."
        },
        {
            keywords: ["reminder", "set reminder"],
            response: "You can set a reminder for your event by entering the number of hours before the event you want to be reminded. I'll let you know when it's time!"
        },
        {
            keywords: ["chatbot"],
            response: "You can chat with me! Just click on the + button to open the chatbot."
        },
        {
            keywords: ["edit"],
            response: "You can edit your event by clicking on the 'Edit Event' button. You can change the event name and date."
        },
        {
            keywords: ["delete"],
            response: "You can delete your custom event by clicking on the 'Delete' button next to the event."
        },
        {
            keywords: ["facebook"],
            response: "You can share your event on Facebook by clicking on the 'Share on Facebook' button."
        },
        {
            keywords: ["twitter"],
            response: "You can share your event on Twitter by clicking on the 'Share on Twitter' button."
        },
        {
            keywords: ["email"],
            response: "You can share your event via Email by clicking on the 'Share via Email' button."
        },
        {
            keywords: ["copy"],
            response: "You can copy your event link by clicking on the 'Copy' button."
        },
        {
            keywords: ["minimize"],
            response: "You can minimize the chatbot by clicking on the '-' button."
        },
        {
            keywords: ["maximize"],
            response: "You can maximize the chatbot by clicking on the '+' button."
        },
        {
            keywords: ["close"],
            response: "You can close the chatbot by clicking on the 'x' button."
        },
        {
            keywords: ["open"],
            response: "You can open the chatbot by clicking on the '+' button."
        }
    ];

    for (let responseObj of responses) {
        for (let keyword of responseObj.keywords) {
            if (lowerMessage.includes(keyword)) {
                return typeof responseObj.response === 'function' ? responseObj.response() : responseObj.response;
            }
        }
    }

    return "I'm not sure about that, can you ask differently or specify more?";
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
changeBackgroundBtn.style.font = "inherit";
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
        alert("Predefined events like New Year or Lunar New Year cannot be edited.");
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
