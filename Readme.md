# 🏙️ UrbanNest — Modern Real Estate Platform

UrbanNest is a full-stack real estate web application that helps users discover, search, and explore properties with ease.  
It offers powerful filtering, seamless search, and a clean user experience designed for modern property platforms.

---

## 🌐 Live Demo

🔗 **Live URL:** _Coming Soon_

---

## 📸 Screenshots

> _Add screenshots here_

```

📷 Home Page
📷 Search & Filters
📷 Property Details
📷 User Profile / Listings

```

---

## ✨ Features

- 🔍 Advanced property search with filters
- 🏘️ Browse **rent** & **sale** listings
- 🎯 Filter by amenities (parking, furnished, offers)
- 💰 Sort by price and latest listings
- 🖼️ Image sliders for featured properties
- 👤 User authentication (JWT-based)
- 🏡 Create, update, and delete listings
- 📱 Fully responsive design
- ⚡ Fast and optimized API queries

---

## 🧑‍💻 Tech Stack

### Frontend

- ⚛️ React.js
- 🌬️ Tailwind CSS
- 🔁 Redux Toolkit
- 🚦 React Router
- 🎠 Swiper.js
- 🎨 React Icons

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB & Mongoose
- 🔐 JWT Authentication

### Tools & Utilities

- Axios / Fetch API
- RESTful APIs
- Environment Variables
- Git & GitHub

---

## 🏗️ Project Structure

```bash
urban-nest/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── config/
│   │   └── main.jsx
│
├── server/          # Node + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
│
└── README.md
```

---

## 🔎 Search & Filtering Capabilities

UrbanNest supports advanced search using query parameters:

```http
/search?searchTerm=house&type=rent&parking=true&offer=true
```

Supported filters:

- Search keyword
- Rent / Sale
- Parking
- Furnished
- Special offers
- Price sorting
- Pagination (Show more)

---

## 🧠 API Example

```http
GET /api/listing/get-listings?type=rent&offer=true&limit=9
```

Response:

```json
{
  "success": true,
  "count": 9,
  "data": [ ...listings ]
}
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/AqibNiazi/urban-nest.git
cd urban-nest
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🚀 Future Improvements

- 🗺️ Google Maps integration
- ❤️ Favorite / saved listings
- 📊 Admin dashboard
- 💬 Chat between buyer & seller
- 📈 Analytics & insights
- 🌙 Dark mode

---

## 📌 Screenshots To Add Later

- Home page hero section
- Search results with filters
- Property detail page
- Profile & listings management

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Muhammad Aqib Javed**
💻 Full Stack Software Engineer
🌐 GitHub: [@AqibNiazi](https://github.com/AqibNiazi)

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub!
