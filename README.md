# solarSystem
 This app displays an interactive rendering of the solar system both to scale and with an 'easy view' mode to make observing the planets easier. To enable the easy view mode open the control panel in the upper right corner and select the box next to "easy view". To interact with the solar system you can use normal zoom in/out and drag motions to manipulate the system. 

 You will also find a folder in the controls called facts that offers a option to display a fact for each planet. After you begin viewing facts you must select none to turn off the facts. 

# Instructions for installation
If you don't have git installed:
- gitforwindows.org follow instruction prompt, default options should be sufficient
If you don't have node/npm installed:
- nodejs.org/en/download select windows installer
General Instructions:
- Open a command prompt and enter the following commands
- `git clone https://github.com/ruudkas/solarSystem.git`
- `cd solarSystem`
- `npm i`
- `npm run start:dev`
- Navigate to localhost:1234 in a browser
- To terminate the app when you are done reopen the command prompt and type CTRL + C

# Organization in this repo
- Speeds for rotation and orbit are found [here](./src/js/constants/speedConstants.js)
- Distances between planets/sun and moon/planets are found [here](./src/js/constants/distanceConstants.js)
- Sizes of planets and moons are found [here](./src/js/constants/sizeConstants.js)
- Texture maps for all objects are found [here](./src/img)
- The main script that runs the app is found [here](./scripts.js)

# Sources
https://celestiamotherlode.net/catalog/jupiter.html
https://www.britannica.com/place/Io-satellite-of-Jupiter
https://www.nhm.ac.uk/discover/factfile-the-sun.html
https://solarsystem.nasa.gov/planets/mars/overview/#:~:text=It%20is%20half%20the%20size,volcanoes%2C%20canyons%2C%20and%20weather
https://solarsystem.nasa.gov/planets/mercury/overview/
https://solarsystem.nasa.gov/planets/venus/overview/
https://solarsystem.nasa.gov/planets/earth/overview/
https://solarsystem.nasa.gov/planets/jupiter/overview/
https://solarsystem.nasa.gov/planets/saturn/overview/
https://solarsystem.nasa.gov/planets/uranus/overview/
https://solarsystem.nasa.gov/planets/neptune/overview/
https://solarsystem.nasa.gov/planets/dwarf-planets/pluto/overview/
https://www.youtube.com/watch?v=0ZW3xrFhY3w
http://www.celestiamotherlode.net/addon/addon_1508.html
http://www.celestiamotherlode.net/catalog/saturn.html

