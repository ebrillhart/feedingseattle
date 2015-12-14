# Feeding Seattle
Uses Socrata Open Data to display a list and map of meal programs for homeless and low-income individuals. Registered users can create a list of saved/favorite programs. 

####Technologies Used
* HTML5/CSS3
* JavaScript
* AngularJS
* Node.js
* Express
* MongoDB/NoSQL
* Socrata Open Data API
* Heroku
* Bootstrap
* BootstrapUI for AngularJS
* NgMap (Google Maps for AngularJS)
* Font Awesome
* Google Fonts

####Biggest Challenges and Things I Would Change
* Some of the markers for the venue locations don't show up on the Google maps, and I'm not sure why. The maps also don't always render beyond a grey box, and will only center on the correct location sometimes. I think some of this has to do with the Angular plug-in I used, and were I to do the project over, I would use a different plug-in. 
* Had to work around the XHTTP header being sent when a user was logged in to be able to access the data from the Socrata API endpoint. Originally, the data would only display if the user was logged out.
