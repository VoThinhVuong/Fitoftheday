# Fit for the day
* Fitfortheday is a simple, user-friendly website that helps users with deciding on what to wear for the day when you can't be bothered to make that decision. Simply add as many wardrobes and as many fits to those wardrobes as you like, add your city to get the weather type and get a fit! Never again will you spend more than 1 minute to decide on what to wear based on the weather outside.

# Distinctiveness and Complexity
* Fitfortheday is a twist on the simple note-taking applications where rather than saving notes, you save outfits. The website lets you add outfits that you would like to wear into different wardrobes for different weather conditions and on the home page, it randomly chooses the outfit for you based on the weather. The website does not have any functionality for communicating with other users or letting users put wardrobes on sale. Thus, it satisfies the distinctiveness requirement.
* With regard to complexity, I believe that this project is more complex than the previous projects of the course for a few reasons:
    * Micro-animations (pop-ups, on-hovers, etc) are integrated at all pages to help create a satisfying user experience.
    * Real-time weather reading through the use of OpenWeatherMap's API to support the website's outfit recommendation feature.
    * The website supports full CRUD operations on all user-created items.
    * Allow showing/hiding of input forms to help with minimizing visual clutter.
    * Implemented a sliding picture view for the outfits to replace the horizontal scrollbar and keep the navigation bar in view (which helps with page navigations as the number of outfits increases).
    * Used reactive icons in place of buttons to create a more appealing UI.
    * Implemented all of the points above with mobile-responsiveness in mind for better user experience on mobile devices.


# What's contained in each file
Aside from the files/folder created by Django, the files I created are:
* In the gallery folder of the templates, this folder contains the following html files to be rendered by Django:
* login.html/register.html: used for logging in/ registering an account.
* layout.html: the main layout used for inheritance by other pages.
* index.html: homepage where the user gets the current weather and a random fit from their wardrobes.
* wardrobe.html: a page for viewing, adding and deleting wardrobes.
* fits.html: a page for viewing, adding and deleting fits of a selected wardrobe.
* In the gallery folder of the static folder, this folder contains the following files to be used in the website's frontend:
* gallery.js: used on the homepage to help with editing the users' locations, fetching the weather type from OpenWeatherMap, fetching the random fit from the database and handling the animation of adding a new fit.
* wardrobe.js:  used for handling the add-wardrobe form's display, handling of post request for adding a new wardrobe and deleting an existing wardrobe.
* fit.js: used for handling of add-fit form's display, handling of post request for adding a new fit, handling of post request for deleting an existing fit and implementation of the sliding picture-design.
* styles.css : used for styling the pages and making them mobile-responsive.
* In the assets folder of the static folder, this folder contains svg files used for rendering the icons found in pages.

# Running the application
* Open cmd and run $cd {the file path to the project}$.
* Run $python manage.py migrate$.
* Run $python manage.py runserver$ to start the application.
