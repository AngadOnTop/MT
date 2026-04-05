# 📊 HSC Marks Tracker

> A sleek, modern web application for tracking HSC assessments, subject weights, and final marks across Years 10-12.

**Made by the goat Angad** ✨

---

## 🎯 Features

- **Multi-Subject Tracking**: Manage multiple subjects with ease
- **Assessment Management**: Track individual assessments and their weights
- **Real-Time Calculations**: Automatic computation of weighted averages and final marks
- **Term-Based Organization**: Organize assessments by terms throughout the year
- **Dark Mode**: Comfortable viewing with built-in dark/light theme toggle
- **Year Selection**: Support for Years 10, 11, and 12
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: All your data is automatically saved locally

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AngadOnTop/MT.git
cd MT
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

---

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx
│   ├── ChartsPanel.jsx
│   ├── SummaryCards.jsx
│   ├── SubjectBlock.jsx
│   └── TermControls.jsx
├── App.jsx             # Main application component
├── useStore.js         # State management store
├── main.jsx            # Entry point
└── styles/             # CSS modules
```

---

## 🎨 Tech Stack

- **React** - UI library
- **Vite** - Build tool & dev server
- **CSS Modules** - Scoped styling
- **JavaScript** - Core language

---

## 📝 Usage

1. **Add a Subject**: Enter the subject name and click "Add Subject"
2. **Add Assessments**: Click on a subject to expand and add individual assessments
3. **Set Weights**: Assign weightage percentages to each assessment
4. **Switch Terms**: Use term controls to organize assessments by term
5. **Change Year**: Click on the year badge to update your current HSC year
6. **Toggle Theme**: Use the sun/moon button to switch between light and dark modes

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (600px - 1200px)
- Mobile (< 600px)

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 💬 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Happy tracking! 🎓**
