// create two separate instances of Instafeed
var playTagFeed = new Instafeed({
    target: 'playTag',
    get: 'tagged',
    tagName: 'play',
    clientId: 'XXXXX',
    // rest of settings
});
var glassTagFeed = new Instafeed({
    target: 'glassTag',
    get: 'tagged',
    tagName: 'glass',
    clientId: 'XXXXX',
    // rest of settings
});

// run both feeds
playTagFeed.run();
glassTagFeed.run();


+++++++++++++++++++++++++++And include the following divs in your page:
<div id="playTag"></div>
<div id="glassTag"></div>
