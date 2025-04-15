# Shelve Scanner

A web application that allows users to scan their bookshelves, detect books, and sell them.

## Features

- Camera-based bookshelf scanning
- Book detection and price estimation
- Shopping cart functionality
- Mobile-friendly interface
- Works offline (PWA)

## Mobile Installation

### Option 1: Install as a Progressive Web App (PWA)

1. Open the Shelve Scanner website in your mobile browser (Chrome, Safari, etc.)
2. You'll see an "Install" button at the bottom of the page
3. Tap the "Install" button to add the app to your home screen
4. The app will now be available as a standalone application on your device

### Option 2: Add to Home Screen Manually

#### For Android (Chrome):
1. Open the Shelve Scanner website in Chrome
2. Tap the menu button (three dots) in the top-right corner
3. Select "Add to Home screen"
4. Follow the prompts to add the app to your home screen

#### For iOS (Safari):
1. Open the Shelve Scanner website in Safari
2. Tap the share button (square with an arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Follow the prompts to add the app to your home screen

## Deployment Instructions

To deploy the Shelve Scanner as a PWA:

1. Host the files on a web server with HTTPS (required for PWAs)
2. Make sure all files are in the correct directory structure:
   ```
   /
   ├── index.html
   ├── app.js
   ├── styles.css
   ├── manifest.json
   ├── service-worker.js
   └── images/
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```
3. Access the website through a mobile browser to install it as a PWA

## Development

### Local Testing

To test the PWA locally:

1. Install a local server (like `http-server` or `live-server`)
2. Run the server in the project directory
3. Access the website through `localhost` in your browser

### Building Icons

The icons for the PWA can be generated using the included `generate-icons.html` file:

1. Open `generate-icons.html` in a browser
2. Click the "Generate Icons" button
3. Save each icon to the `images` directory with the appropriate name

## Browser Compatibility

The Shelve Scanner works best on modern browsers that support:
- Progressive Web Apps
- Camera API
- Local Storage

## License

MIT 