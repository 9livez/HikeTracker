# HikeTracker 🏕️

HikeTracker is a highly interactive, web-based tool designed to trace, record, and aestheticize your long-distance hiking and backpacking routes directly on Google Maps.

Powered by React, Vite, and the official `@vis.gl/react-google-maps` library, HikeTracker automatically snaps your drawn paths to realistic roads and walking trails using the Google Directions API. It is designed heavily with user experience, flawless UI interactions, and beautiful cartography in mind.

## ✨ Key Features

- **Smart Path Drawing & Editing**
  - **Drawing Toll:** Click anywhere to create a route. Every point you plot automatically talks to the Google Server to snap the vector path realistically to real-world pedestrian streets and trails.
  - **Auto-Anchor Insertion:** Click anywhere on an existing active polyline to automatically split the line and insert a Draggable Anchor exactly at the interaction point.
  - **Refining & Erasing:** Grab an anchor and flawlessly adjust the waypoints, or instantly switch to Erase mode to pop anchors off your map in real time.

- **Multiple Track Management & UI Isolation**
  - Plot multiple independent routes simultaneously across continents.
  - Only one route engages in an "Editing" state at any given moment, ensuring completely protected and predictable pointer interactions.

- **Per-Path Fine Styling System**
  - Customize the exact thickness (2px to 12px) and select from vibrant preset neon colors (Indigo, Emerald, Violet, Amber, etc.) independently for *every single route* you've walked. Makes distinguishing trips from different years trivial.

- **Global View & Screenshot Mode 🌌**
  - Click the **Eye icon** to dive into a distraction-free overview.
  - It globally strips the map of all anchors, editing tools, and interface clutter. 
  - Overrides all independent path styles with a cohesive, unified color and stroke, locking all clicks to prevent accidents.
  - Unveils a fluid **Fractional Zoom Slider** allowing for microscopic (0.05x) camera tuning before capturing the ultimate screenshot of your journey.
  
- **Real-Time Distance Tracking 📏**
  - Instantly see the length of your active route as you draw or adjust anchors.
  - Enter **Global View Mode** to see the total cumulative distance of every trail on your map.
  - Smart formatting automatically switches between meters (m) and kilometers (km) with high precision.

- **Universal Export & Safety 🛡️**
  - **Multi-Format Export**: Choose between **JSON** for a full state backup (preserving all editable anchors) or **KML** to directly import your routes into the official Google Maps app or Google Earth.
  - **Safe Clear**: Use the dedicated Clear button to reset your canvas. Includes a mandatory safety check that prompts you to export a backup before data is wiped.
  - **Cache Automatic Saving**: Unintentionally closed the tab? Your 1,000+ kilometer hike is flawlessly preserved locally via `localStorage`.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed. You must also have a Google Cloud Console account with billing enabled to obtain a Maps SDK Key.

### API Requirements
Ensure the following Google Cloud libraries are enabled for your API key:
- **Maps JavaScript API**
- **Directions API**

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file at the root of the project to store your secret key securely.
   ```bash
   echo "VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE" > .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🛠 Tech Stack
- Frontend Framework: **React 18**
- Build Tool: **Vite**
- Map Rendering: **@vis.gl/react-google-maps** 
- Dynamic Mathematics: **google.maps.geometry / routes Library**
- UI Iconography: **Lucide React**

## 📝 Usage Note on Performance limits
HikeTracker is purely a local, static progressive web app. 
- While Google allows near-unlimited coordinates inside polylines without lagging, you may experience drops in framerate if you keep over **1,000+ active editable anchors** visible simultaneously depending on browser Canvas limits. 
- You can utilize **Global View Mode** to instantly purge anchor renders for a buttery-smooth pan across your entire mapping history.
- The browser limits `localStorage` to about 5MB, which will safely hold tens of thousands of deeply precise coordinates. Remember to routinely Export JSON backups for massive global trips!
