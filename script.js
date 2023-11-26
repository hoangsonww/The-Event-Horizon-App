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
    {url: 'url("R (1).jfif")', isDark: false},  // Mostly dark
    {url: 'url("j1O8bCz.jpg")', isDark: true}, // Mostly dark
    {url: 'url("wp4670197.jpg")', isDark: true}, // Mostly dark
    {url: 'url("wp4511352.jpg")', isDark: true}  // Mostly dark
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
    const lastViewedCity = localStorage.getItem('lastViewedCity');
    if (lastViewedCity) {
        document.getElementById('weatherLocation').value = lastViewedCity;
        fetchWeather(); // Fetch weather for the last viewed city
    }
    setRandomBackgroundImage();
});

document.addEventListener('DOMContentLoaded', function() {
    const lastEvent = JSON.parse(localStorage.getItem('lastEvent'));
    if (lastEvent) {
        eventTitle.textContent = lastEvent.name;
        currentEventDate = lastEvent.date;
    } else {
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
    // Assuming you have a modal element in your HTML to show the shareable link
    const shareModal = document.getElementById('shareModal');
    const shareLinkInput = document.getElementById('shareLink');

    // Get event details
    const eventName = eventTitle.textContent;
    const eventDate = currentEventDate;

    // Generate a shareable link
    const shareLink = `${window.location.href}?event=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventDate)}`;
    shareLinkInput.value = shareLink;

    document.getElementById('facebookShare').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
    document.getElementById('twitterShare').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(eventName)}&url=${encodeURIComponent(shareLink)}`;
    document.getElementById('emailShare').href = `mailto:?subject=${encodeURIComponent(eventName)}&body=Check out this event: ${encodeURIComponent(shareLink)}`;

    // Show the modal
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

        const eventSpan = document.createElement('span');
        eventSpan.textContent = `${event.name} (${event.date})`;
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

function elizaResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
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

function generateUniqueLink(name, date) {
    // Encode the event details into a query string
    return `${window.location.origin}${window.location.pathname}?event=${encodeURIComponent(name)}&date=${encodeURIComponent(date)}`;
}

function getEventDetailsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('event');
    const eventDate = urlParams.get('date');
    return { eventName, eventDate };
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

    // Save reminder time in localStorage or a suitable place
    localStorage.setItem('eventReminder', JSON.stringify({ date: reminderTime, eventName: eventTitle.textContent }));

    // Show a message to the user
    alert(`Reminder set for ${eventTitle.textContent} ${reminderHours} hours before the event.`);
}

// Function to check for any reminders
function checkForReminders() {
    const reminderData = JSON.parse(localStorage.getItem('eventReminder'));
    if (reminderData) {
        const now = new Date();
        const reminderTime = new Date(reminderData.date);

        if (now >= reminderTime) {
            alert(`Reminder: ${reminderData.eventName} is coming up!`);
            localStorage.removeItem('eventReminder'); // Remove the reminder after notifying
        }
    }
}

// Call checkForReminders at regular intervals
setInterval(checkForReminders, 60000); // Check every minute

const notesInput = document.getElementById('eventNotes');

function saveNotes() {
    const notes = notesInput.value;
    localStorage.setItem('eventNotes', notes);
    alert('Notes saved!');
}

// Function to load notes when the app starts
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

    // Check if the content is currently displayed
    if (notesContent.style.display === 'none') {
        notesContent.style.display = 'block'; // Show the content
        toggleNotesButton.textContent = '−';   // Set the button to indicate minimizing
    } else {
        notesContent.style.display = 'none';  // Hide the content
        toggleNotesButton.textContent = '+';   // Set the button to indicate expanding
    }
}

// Ensure the content area is hidden on page load if there are no notes
document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    if (!notesInput.value) {
        toggleNotes(); // Minimize if the textarea is empty
    }
});

const openWeatherApiKey = '593309284d3eb093ee96647eb294905b';

async function fetchWeather() {
    const location = document.getElementById('weatherLocation').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openWeatherApiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data not found');
        }
        const data = await response.json();
        displayWeather(data);
        // Save the city name in local storage if the fetch was successful
        localStorage.setItem('lastViewedCity', location);
    }
    catch (error) {
        console.error('Failed to fetch weather data:', error);
        alert('Failed to fetch weather data');
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const temperature = Math.round(data.main.temp); // Round to the nearest integer
    const chanceOfRain = data.rain ? data.rain['1h'] : '0'; // Assuming '1h' data is available

    weatherDisplay.innerHTML = `
        <p><strong>${data.name}</strong></p>
        <p>Temperature: <strong>${temperature}°C</strong></p>
        <p>Weather: <strong>${data.weather[0].main}</strong></p>
        <p>Humidity: <strong>${data.main.humidity}%</strong></p>
        <p>Chance of Rain: <strong>${chanceOfRain}%</strong></p>
    `;
}

const eventTips = [
    "Tip: Start planning early to avoid last-minute stress.",
    "Tip: Use a theme to make your event memorable.",
    "Tip: Check your guest list twice to make sure no one's missed.",
    "Tip: Always have a plan B in case of unexpected changes.",
    "Tip: Remember to send out invitations at least three weeks in advance.",
    "Tip: Consider dietary restrictions and preferences when planning your menu.",
    "Tip: Create a playlist to set the mood for your event.",
    "Tip: If it's an outdoor event, always have an indoor backup plan.",
    "Tip: Engage your guests with interactive activities or ice-breakers.",
    "Tip: Personalize your event with custom decorations or favors.",
    "Tip: Allocate tasks to a team to make event management smoother.",
    "Tip: Use digital tools for RSVPs to keep track of your guest list easily.",
    "Tip: Keep a checklist to track all your event planning details.",
    "Tip: Follow up with your vendors a week before the event to confirm details.",
    "Tip: Don't forget to check the weather forecast to prepare for any outdoor events.",
    "Tip: Create a checklist to keep track of all the tasks you need to complete before the event.",
    "Tip: Send out invitations early to ensure your guests can save the date.",
    "Tip: Consider dietary restrictions and allergies when planning the event menu.",
    "Tip: Delegate tasks to friends or family to help ease the planning process.",
    // And many more...
];

function displayDailyTip() {
    const dailyTipElement = document.getElementById('dailyTip');
    const randomIndex = Math.floor(Math.random() * eventTips.length);
    dailyTipElement.textContent = eventTips[randomIndex];
}

document.addEventListener('DOMContentLoaded', displayDailyTip);

function toggleChatbot() {
    const chatbotBody = document.getElementById('chatbotBody');
    const chatbotInput = document.getElementById('chatbotInput');
    const minimizeChatbot = document.getElementById('minimizeChatbot');

    if (chatbotBody.style.display === 'none') {
        chatbotBody.style.display = 'block';
        chatbotInput.style.display = 'block';
        minimizeChatbot.textContent = '−';
    } else {
        chatbotBody.style.display = 'none';
        chatbotInput.style.display = 'none';
        minimizeChatbot.textContent = '+';
    }
}

// Call this function to initialize the chatbot as minimized
toggleChatbot();
