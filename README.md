## Updates Made To Improve Performance

The [live optimized version](https://web-performance.firebaseapp.com) of the site.

### General changes:

1. Added a package.json file to provide description for the project and identify development dependencies.
1. Added a gulpfile.js file to automate the build process.
  a. Added gulp-uglify to reduce the size of the javascript files.
  b. Added gulp-jshint to lint the javascript files.
  c. Added gulp-minify-css to reduce the size of the CSS files.
  d. Added gulp-image to optimize the image files.
  e. Added gulp-responsive-images to automatically reduce the size of the images to required sizes.
  f. Added gulp-livereload to aid in development. Automatically reloads the browser on change.
  g. Other gulp modules added to support the activities above.

1. Restructured the directories to aid the deployment cycle. Moved all of the original files into the src directory.
1. Added a firebase.json file to aid in loading the dist directory to Firebase for external testing purposes.

### index.html Specific Changes

The following changes were made to the [index.html](src/index.html) file in order improve the page speed to greater than 90.

Changes made to the head node of the file.

1. Removed the call to fonts.googleapis.com for the Open Sans font. There did not appear to be any need to make this call, at least with the three browsers tested. Perhaps this one change was an oversight due to system configuration.
1. Inlined the styles originally identified in the [style.css](src/css/style.css) file.
1. Added the media attribute to the [print.css](src/css/print.css) file and set it to print. Removes the file from the critical resource path.
1. Added an 'async' attribute to the analytics.js script tag.

Also, reduced the size of the pizzeria.jpg file to a more reasonable size, considering the site does not require a 2048px wide image. This change will also become important in part 2 of this project.

### pizza.html Specific Changes, including JavaScript Changes

1. [style.css](src/views/css/style.css) Changed the width of the mover class to 73px. Also created a pizza.png image the same width named pizza_73w.png.
1. [main.js](src/views/js/main.js) Changes
     a. Added variables movers (Array), ticking (boolean) and scTop.
     a. updatePositions Function - Moved the document.body.scrollTop / 1250 calculation outside of for loop.
     a. updatePositions Function - Now uses the movers array that is set once in DOMContentLoaded listener.
     a. updatePositions Function - now uses transform for the element style vs left style.
     a. implemented an onScroll function to be called by the scroll lisenter instead of calling updatePositions directly.
     a. incorporated requestAnimationFrame into the onScroll function.
     a. changePizzaSizes Function - Refactored to remove need to determineDx function. Deleted determineDx function.
     a. DOMContentLoaded now only creates 32 pizzas vs. the 200 previously.
     a. DOMContentLoaded created an image 73px in width of pizza.png and now gets set to the src attribute.
     a. DOMContentLoaded removed the height and width styles from the element since the image is now reduced to a more reasonable size.
1. Copied, resized and optimized all the images to fit according to the required sizes. 
1. [pizza.html](src/views/pizza.html) Added viewport meta field to the head node of the file.

## Website Performance Optimization portfolio project (Original Information Provided Below)

Your challenge, if you wish to accept it (and we sure hope you will), is to optimize this online portfolio for speed! In particular, optimize the critical rendering path and make this page render as quickly as possible by applying the techniques you've picked up in the [Critical Rendering Path course](https://www.udacity.com/course/ud884).

To get started, check out the repository, inspect the code,

### Getting started

####Part 1: Optimize PageSpeed Insights score for index.html

Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder
  $> ngrok 8080
  ```

1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights! Optional: [More on integrating ngrok, Grunt and PageSpeed.](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)

Profile, optimize, measure... and then lather, rinse, and repeat. Good luck!

####Part 2: Optimize Frames per Second in pizza.html

To optimize views/pizza.html, you will need to modify views/js/main.js until your frames per second rate is 60 fps or higher. You will find instructive comments in main.js. 

You might find the FPS Counter/HUD Display useful in Chrome developer tools described here: [Chrome Dev Tools tips-and-tricks](https://developer.chrome.com/devtools/docs/tips-and-tricks).

### Optimization Tips and Tricks
* [Optimizing Performance](https://developers.google.com/web/fundamentals/performance/ "web performance")
* [Analyzing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/analyzing-crp.html "analyzing crp")
* [Optimizing the Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path.html "optimize the crp!")
* [Avoiding Rendering Blocking CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css.html "render blocking css")
* [Optimizing JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript.html "javascript")
* [Measuring with Navigation Timing](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp.html "nav timing api"). We didn't cover the Navigation Timing API in the first two lessons but it's an incredibly useful tool for automated page profiling. I highly recommend reading.
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/eliminate-downloads.html">The fewer the downloads, the better</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer.html">Reduce the size of text</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization.html">Optimize images</a>
* <a href="https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching.html">HTTP caching</a>

### Customization with Bootstrap
The portfolio was built on Twitter's <a href="http://getbootstrap.com/">Bootstrap</a> framework. All custom styles are in `dist/css/portfolio.css` in the portfolio repo.

* <a href="http://getbootstrap.com/css/">Bootstrap's CSS Classes</a>
* <a href="http://getbootstrap.com/components/">Bootstrap's Components</a>

### Sample Portfolios

Feeling uninspired by the portfolio? Here's a list of cool portfolios I found after a few minutes of Googling.

* <a href="http://www.reddit.com/r/webdev/comments/280qkr/would_anybody_like_to_post_their_portfolio_site/">A great discussion about portfolios on reddit</a>
* <a href="http://ianlunn.co.uk/">http://ianlunn.co.uk/</a>
* <a href="http://www.adhamdannaway.com/portfolio">http://www.adhamdannaway.com/portfolio</a>
* <a href="http://www.timboelaars.nl/">http://www.timboelaars.nl/</a>
* <a href="http://futoryan.prosite.com/">http://futoryan.prosite.com/</a>
* <a href="http://playonpixels.prosite.com/21591/projects">http://playonpixels.prosite.com/21591/projects</a>
* <a href="http://colintrenter.prosite.com/">http://colintrenter.prosite.com/</a>
* <a href="http://calebmorris.prosite.com/">http://calebmorris.prosite.com/</a>
* <a href="http://www.cullywright.com/">http://www.cullywright.com/</a>
* <a href="http://yourjustlucky.com/">http://yourjustlucky.com/</a>
* <a href="http://nicoledominguez.com/portfolio/">http://nicoledominguez.com/portfolio/</a>
* <a href="http://www.roxannecook.com/">http://www.roxannecook.com/</a>
* <a href="http://www.84colors.com/portfolio.html">http://www.84colors.com/portfolio.html</a>
