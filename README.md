🧠 Productivity Master
Productivity Master is a full-featured task management web app designed to help users stay focused, manage tasks efficiently, and boost productivity. With features like dark mode, a task timer, chatbot assistance (Gemini API), and MongoDB-backed task storage, it provides a seamless and engaging experience.

🔧 Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MongoDB (via Mongoose)

Chatbot: Gemini API integration

🚀 Features
📝 Add, delete, and manage daily tasks

⏲️ Built-in task timer to enhance focus

🌙 Toggle dark mode for better eye comfort

🤖 Integrated AI chatbot for task assistance

💾 Persistent task storage with MongoDB

📁 Project Structure
bash
Copy
Edit
Productivity-Master/
├── index.html          # Frontend UI
├── styles.css          # Custom styling
├── app.js              # Express server logic
├── server.js           # Entry point and DB connection
├── Task.js             # Mongoose schema for task management
🖥️ Screenshots
(Add screenshots or screen recordings here to visually represent your project UI)

⚙️ Setup Instructions
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/productivity-master.git
cd productivity-master
Install dependencies

bash
Copy
Edit
npm install
Configure MongoDB

Make sure MongoDB is installed and running.

Update your MongoDB connection URI in server.js.

Run the app

bash
Copy
Edit
node server.js
Open your browser and visit: http://localhost:3000

📌 Future Enhancements
Add user authentication using JWT

Enable task categorization and priority levels

Implement task completion analytics and progress stats

Export tasks to PDF or Excel
