// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Timer state management
const timers = {
    stopwatch: { time: 0, interval: null, isRunning: false },
    laptimer: { time: 0, interval: null, isRunning: false, laps: [] }
};

function formatTime(ms) {
    const date = new Date(ms);
    return date.toISOString().substr(11, 11);
}

function updateDisplay(timerId) {
    document.querySelector(`#${timerId} .time-display`).textContent = formatTime(timers[timerId].time);
}

function startStop(timerId) {
    const timer = timers[timerId];
    const button = document.querySelector(`#${timerId}-startstop`);
    
    if (timer.isRunning) {
        clearInterval(timer.interval);
        button.textContent = 'Start';
    } else {
        timer.interval = setInterval(() => {
            timer.time += 10; // Increment by 10 ms
            updateDisplay(timerId);
        }, 10);
        button.textContent = 'Stop';
    }
    timer.isRunning = !timer.isRunning;
}

function reset(timerId) {
    const timer = timers[timerId];
    clearInterval(timer.interval);
    timer.time = 0;
    timer.isRunning = false;
    updateDisplay(timerId);
    document.querySelector(`#${timerId}-startstop`).textContent = 'Start';
    
    if (timerId === 'laptimer') {
        timer.laps = [];
        document.getElementById('lap-list').innerHTML = '';
    }
}

// Stopwatch event listeners
document.getElementById('stopwatch-startstop').addEventListener('click', () => startStop('stopwatch'));
document.getElementById('stopwatch-reset').addEventListener('click', () => reset('stopwatch'));

// Lap Timer event listeners
document.getElementById('laptimer-startstop').addEventListener('click', () => startStop('laptimer'));
document.getElementById('laptimer-reset').addEventListener('click', () => reset('laptimer'));
document.getElementById('laptimer-lap').addEventListener('click', () => {
    const timer = timers.laptimer;
    if (timer.isRunning) {
        timer.laps.push(timer.time);
        const lapItem = document.createElement('div');
        lapItem.classList.add('lap-item');
        lapItem.innerHTML = `<span>Lap ${timer.laps.length}</span><span>${formatTime(timer.time)}</span>`;
        document.getElementById('lap-list').prepend(lapItem);
    }
});

// Alarm functionality
let alarmTimeout;
const alarmSound = document.getElementById('alarm-sound');

function playAlarmSound() {
    alarmSound.play();
}

function stopAlarmSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

document.getElementById('alarm-set').addEventListener('click', () => {
    const input = document.getElementById('alarm-time');
    const alarmButton = document.getElementById('alarm-set');
    
    if (alarmButton.textContent === 'Set Alarm') {
        const now = new Date();
        const [hours, minutes] = input.value.split(':');
        const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        
        if (alarmDate <= now) {
            alarmDate.setDate(alarmDate.getDate() + 1);
        }
        
        const timeDiff = alarmDate - now;
        clearTimeout(alarmTimeout);
        alarmTimeout = setTimeout(() => {
            document.getElementById('alarm-display').textContent = 'ALARM!';
            document.getElementById('alarm-display').classList.add('alarm-ringing');
            playAlarmSound();
        }, timeDiff);
        
        document.getElementById('alarm-display').textContent = `Alarm set for ${input.value}`;
        alarmButton.textContent = 'Cancel Alarm';
    } else {
        clearTimeout(alarmTimeout);
        stopAlarmSound();
        document.getElementById('alarm-display').textContent = '';
        document.getElementById('alarm-display').classList.remove('alarm-ringing');
        alarmButton.textContent = 'Set Alarm';
    }
});
