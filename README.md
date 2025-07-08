# 🏕 StayExplorer

StayExplorer is a full-stack web application where users can **explore, list, and manage favorite travel destinations**, complete with **authentication**, **chat support**, and **MongoDB integration**.

---

## 🌟 Features

- 🧾 **User Signup & Login**
- 🔐 Password **Hashing with bcrypt**
- ✨ **Session-based Authentication** using `express-session` and `connect-mongo`
- 🏕 Users can **create listings** with:
  - Title, Price, Location, Country, Description, Image
- ❤️ Add listings to **Favorites**
- 💬 Comment system per listing
- 🤖 Integrated **ChatBot** to help with listing queries
- 📱 Fully **responsive design**
- 🗂️ **MVC architecture** with clean folder structure
- 🧰 Custom **middleware** for error handling, auth checking, and request logging

---

## 🔧 Tech Stack

| Layer         | Tech Used                       |
|--------------|----------------------------------|
| Frontend     | HTML, CSS, Bootstrap, JS, EJS    |
| Backend      | Node.js, Express.js              |
| Database     | MongoDB + Mongoose               |
| Authentication | express-session, connect-mongo |
| Chatbot      | (e.g., Gemini API or custom bot) |

---

## 📂 Folder Structure (MVC)


---

## 🛠 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Omkarop0808/stay-explorer.git
cd stay-explorer
Install Dependencies
npm install
DB_URL=mongodb+srv://<your-cluster-url>
SESSION_SECRET=your_session_secret
GEMINI_API_KEY=your_chatbot_key   # if using chatbot
npm run dev
