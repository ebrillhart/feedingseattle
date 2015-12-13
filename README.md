# feedingseattle
Uses Socrata OpenData to display a list and map of meal programs for homeless and low-income individuals. Registered users can create a list of saved/favorite programs. 

####Biggest Challenges and Things I Would Change
* I wasn't able to do ng-repeat when creating map markers, so I had to create all of the markers manually. Obviously this was not ideal from a time-consumption or DRY perspective. It also needs to be updated manually whenever the database changes.
* Had to work around the XHTTP header being sent when a user was logged in to be able to access the data from the Socrata API endpoint. Originally, the data would only display if the user was logged out.
