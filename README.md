# Death Clock

A modern Death Clock application that counts down to your estimated death date. This project is built with Next.js and Tailwind CSS.

## Features

- Interactive clock visualization showing time passing
- Countdown timer to your estimated death year
- Daily inspirational quotes
- Quick search functionality with multiple search engines
- Quick links to frequently used websites
- Daily goal setting
- Bank balance tracking
- Multiple language support
- Sound effects (ticking clock)
- Local weather information based on your current location

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/death-clock.git
cd death-clock
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Optional: Configure environment variables:

   - Copy `.env.example` to `.env.local`
   - Add your OpenWeatherMap API key (get one at [openweathermap.org](https://openweathermap.org/api))
   - The app will use a free fallback API if no key is provided

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app directory
  - `components/` - React components
    - `LeftSection/` - Components for the left side of the screen
      - `Weather.js` - Weather component showing local conditions
    - `RightSection/` - Components for the right side (clock)
    - `Dialogs/` - Dialog components
  - `context/` - React context for state management
  - `globals.css` - Global styles
  - `layout.js` - Root layout component
  - `page.js` - Main page component

## Weather Feature

The weather component displays current weather conditions for your location:

- Uses geolocation to determine your current position
- Shows current temperature, weather conditions, and location
- Provides additional details like "feels like" temperature, humidity, and wind speed
- Displays appropriate weather icons based on current conditions
- Supports both day and night mode icons
- Falls back to a free weather API if no OpenWeatherMap API key is provided

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [OpenWeatherMap API](https://openweathermap.org/api) - Weather data (optional)
- [WeatherAPI](https://www.weatherapi.com/) - Fallback weather data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various death clock applications
- Clock design inspired by analog clocks and time visualization techniques
