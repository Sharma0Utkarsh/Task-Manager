const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const BASE_URL = 'http://localhost:2000/api/tasks';

// Fetch tasks 
const fetchTasks = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showNotification('Error', 'Failed to load tasks');
    }
};

// Render tasks 
const renderTasks = (tasks) => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content">
                <span class="task-title">${task.title}</span>
                ${task.notes ? `<div class="task-notes">${task.notes}</div>` : ''}
                ${task.timer.minutes > 0 || task.timer.seconds > 0 ? 
                    `<div class="task-timer">Timer: ${String(task.timer.minutes).padStart(2, '0')}:${String(task.timer.seconds).padStart(2, '0')}</div>` : ''}
                <div class="task-category">${task.category}</div>
            </div>
            <div class="task-actions">
                <button class="toggle-btn" onclick="toggleTask('${task._id}', ${task.completed})">
                    ${task.completed ? '<i class="fas fa-undo"></i>' : '<i class="fas fa-check"></i>'}
                </button>
                <button class="delete-btn" onclick="deleteTask('${task._id}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="priority-btn" onclick="changePriority('${task._id}', ${task.priority})">
                    <i class="fas fa-exclamation"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
};

// Submit 
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const minutes = parseInt(document.getElementById('task-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('task-seconds').value) || 0;
    const notes = document.getElementById('task-notes').value.trim();
    const category = document.getElementById('task-category').value;

    if (!title) return;

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                timer: { minutes, seconds }, 
                notes,
                category
            }),
        });

        if (!response.ok) throw new Error('Failed to add task');

        showNotification('Task Added', `"${title}" has been added`);
        document.getElementById('task-title').value = '';
        document.getElementById('task-minutes').value = '';
        document.getElementById('task-seconds').value = '';
        document.getElementById('task-notes').value = '';
        fetchTasks();
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Error', 'Failed to add task');
    }
});

// task completion
const toggleTask = async (id, completed) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !completed }),
        });

        if (!response.ok) throw new Error('Failed to update task');

        fetchTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
        showNotification('Error', 'Failed to update task');
    }
};

//  task priority
const changePriority = async (id, currentPriority) => {
    const newPriority = currentPriority === 1 ? 3 : currentPriority - 1;
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority: newPriority }),
        });

        if (!response.ok) throw new Error('Failed to update priority');
        

        fetchTasks();
    } catch (error) {
        console.error('Error changing priority:', error);
        showNotification('Error', 'Failed to update priority');
    }
};

// Delete task
const deleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${BASE_URL}/${id}`, { 
            method: 'DELETE' 
        });

        if (!response.ok) throw new Error('Failed to delete task');

        showNotification('Task Deleted', 'Task has been removed');
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error', 'Failed to delete task');
    }
};

// Timer 
let timerInterval;
let totalSeconds = 0;
let isTimerRunning = false;


function startTimer() {
    if (isTimerRunning) return;
    
    const minutesInput = parseInt(document.getElementById('minutes').value) || 0;
    const secondsInput = parseInt(document.getElementById('seconds').value) || 0;
    totalSeconds = minutesInput * 60 + secondsInput;
    
    if (totalSeconds <= 0) {
        alert('Please set a valid time');
        return;
    }
    
    isTimerRunning = true;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        totalSeconds--;
        updateTimerDisplay();
        
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            showNotification('Timer Complete', 'Your timer has finished!');
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    totalSeconds = 0;
    updateTimerDisplay();
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('display').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Notification
function showNotification(title, body) {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}

// Dark Mode 
const toggle = document.getElementById('toggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
}

toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', 
        document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

//Chatbot

function toggleChat() {
    const chatPopup = document.getElementById('chatPopup');
    if (chatPopup.style.display === 'block') {
        chatPopup.style.display = 'none';
    } else {
        chatPopup.style.display = 'block';
    }
}

const API_KEY = "AIzaSyCe9z9fVRfuMmvQROCcqiNoGPIaxwwelHY"; 
    async function sendMessage() {
      const inputEl = document.getElementById("userInput");
      const userText = inputEl.value;
      if (!userText) return;

      appendMessage("user", userText,true);
      inputEl.value = "";

      start()

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents: [
            {
              parts: [{ text: userText }]
            }
          ]}),
      })

      stop()
  
      const data = await res.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      appendMessage("bot", botReply);   
    }

    function appendMessage(role, text, processing) {
      const div = document.createElement("div");
      div.className = `message ${role}`;
      div.innerText = text;
      document.getElementById("chatBox").appendChild(div);
    }

    const button = document.getElementById("sendButton");
button.addEventListener("click",()=> {
    sendMessage();
})

let processing = null;

function start(){
    const chatBox = document.getElementById("chatBox");
    const text = document.getElementById("chatBox").innerText; 
    let i = 0;
    processing = setInterval(() => {
        chatBox.innerText = text + ".".repeat(i + 1) 
        i = (i + 1)%3;
    },500);
}

function stop() {
    clearInterval(processing)
}
function toggleChat() {
  const chatPopup = document.getElementById('chatPopup');
  if (chatPopup.style.display === 'block') {
      chatPopup.style.display = 'none';
  } else {
      chatPopup.style.display = 'block';
  }
}
// Initial Load
fetchTasks();