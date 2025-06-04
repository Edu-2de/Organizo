# Organizo

Organizo is a web application for personal organization, focused on productivity, tasks, calendar, and daily motivation. The project was developed with React (Next.js), TypeScript, and TailwindCSS, featuring a modern, responsive, and theme-customizable interface.

## Features

- **Task List:** Create, edit, complete, and organize tasks and subtasks.
- **Weekly Calendar:** View your week, see appointments and events with highlights for the current day and marked events.
- **Custom Themes:** Choose between themes like Classic, Sunset, and Ocean, each with unique visuals and colors.
- **Productivity Chart:** Track your performance over the last 7 days in a visual and interactive way.
- **Motivational Card:** Receive daily motivational quotes, with options to copy or change the phrase.
- **Accessibility:** Accessible interface, with keyboard navigation and theme-adjusted contrast.

## Technologies Used

- **Frontend:** React, Next.js, TypeScript
- **Styling:** TailwindCSS, CSS Modules
- **Icons:** Heroicons
- **Theme Management:** Context API

## Project Structure

```
frontend/
  ├── src/
  │   ├── components/
  │   │   ├── CalendarWeek.tsx
  │   │   ├── ProductivityChart.tsx
  │   │   ├── MotivationalCard.tsx
  │   │   ├── Card.tsx
  │   │   ├── ThemeContext.tsx
  │   │   └── ...
  │   ├── pages/
  │   └── ...
  └── ...
```

## How to run the project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/organizo.git
   cd organizo/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access at:**  
   [http://localhost:3000](http://localhost:3000)

## Theme Customization

- Access the theme settings in the app menu.
- Themes change not only the colors, but also the look of cards, buttons, and calendar elements.

## Contribution

Contributions are welcome!  
Open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---