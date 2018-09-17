/**
 * Server Side JavaScript with RESTful api handlers and middleware functions to get and post data between the client and server.
 *
 * The Week 9 complete app example by Dr Kasim Terzić proved a great base into understanding how to implement the server side
 *
 * @author tmep
 * @date August 8th 2018
 * @module js/api
 */

(function() {

  let express = require('express');
  let bodyParser = require('body-parser');
  let fs = require('fs');
  let path = require('path');

  let thePort;

  // Export the public methods of the module so we can run it from JS
  module.exports = {
    /**
     * Runs the application
     * @function
     * @returns {Object}    The newly created Express app
     */
    runApp,

    /**
     * Configure the app processing pipeline. Call directly instead of runApp() for
     * testing etc.
     * @function
     */
    configureApp,
  };

  /***********************************************************************************
   * Express Application
   ***********************************************************************************/

  /**
   * Run the app on the default port 8080. Makes use of configureApp to set up the
   * processing pipeline.
   *
   * @returns {Object} The newly created Express app
   */
  function runApp() {
    thePort = 9998;

    let app = express();
    configureApp(app);
    console.log("Listening on port " + thePort);
    return app.listen(thePort);
  }

  /**
   * Configure the app processing pipeline. Call directly instead of runApp() for
   * testing etc.
   */
  function configureApp(app) {

    // This will parse anything submitted to us by assuming it is JSON.
    // The parsed object will be added as "body" to the request object and passed
    // on. This is useful if we exchange a lot of JSON documents, as we tend to do
    app.use(bodyParser.json());


    // If we get a "get" request for a URL in the form: /getItems
    // then call the getObject handler
    app.post("/writeFile", writeFile);

    app.get("/getJSONFile", getJSONFile);
    // For everything else, serve a static page from the
    // "static" directory. This would, e.g. be the HTML and
    // CSS files and any client-side js files requested
    // by the browser
    app.use('/', express.static('static'));
  }

  var writeFile = function(req, res, next) {

    var path = require('path');
    var filePath = path.join('/cs/home/tmep/Documents/Dissertation/DesignTool/draftProgram/static/last-saved-file', 'savedProgress.json')
    var jsonobj = req.body.allData;

    var string = JSON.stringify(jsonobj)

    fs.writeFile(filePath, string, function(err) {
      if (err) {
        console.log(err);
      };
      res.status(200).end(JSON.stringify(string));
    });
  }

  var getJSONFile = function(req, res, next) {
    try {
    var filePath = path.join('/cs/home/tmep/Documents/Dissertation/DesignTool/draftProgram/static/last-saved-file/', 'savedProgress.json')
    var data = fs.readFileSync(filePath, 'utf8');
    if (data.length > 0) {
      var jsonData = JSON.parse(data);
      res.status(201).end(JSON.stringify(jsonData));
    } else {
      console.log("There are no previously saved sessions to import");
    }
  }

    catch (error) {
      console.error(error);
      res.status(500).send('Error - Something went wrong')
    };
  }

})();
