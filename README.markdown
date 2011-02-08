[AFrameJS](http://www.aframejs.com) - The Javascript Application Framework
================================================

[http://www.aframejs.com](http://www.aframejs.com)

### See a sample app in action - [MobileNotes](https://github.com/stomlinson/MobileNotes) ###


-----------------------
AFrameJS is a Javascript MVC application development library, not a DOM manipulation library!  AFrameJS leaves the DOM manipulation to jQuery, MooTools, or Prototype, instead providing the parts necessary to create MVC applications.

Web development is maturing, MVC based applications are becoming increasingly common.  AFrameJS is being developed to fill the need of having a true MVC framework to develop applications with.  [Backbone](http://documentcloud.github.com/backbone/) and [Knockout-JS](http://knockoutjs.com/) are two similar libraries that address this need, now AFrameJS does too.

AFrameJS is DOM library agnostic, meaning it can be used with any DOM library.  All DOM manipulation within the library is done using DOM adapters, currently there are adapters for jQuery, MooTools and Prototype. Adapters for YUI, Ext, and possibly Dojo are planned as I get time. If there is an adapter that you need that is not written, code it up, make sure it passes the unit tests, and I will gladly accept submissions!

### Quick AFrameJS Example ###
Presented below is a simple MVC application that combines many of AFrameJS' concepts.  Models are created and contained in a Collection and then a List of Views presents the data contained in the models.  AFrameJS's special object construct mechanism is used, allowing the developer to use object Plugins.

    &lt;script type="text/javascript&gt;
    // The "main" Controller.
                
    // Define the "layout" of model using a SchemaConfig.
    var friendSchemaConfig = {
        name: { type: 'text' }
    };

    // Use a collection to keep track of the friend models.  When data items are
    // inserted into collection, models will be created automatically using the
    // layout defined in the friendSchemaConfig
    var friendsCollection = AFrame.create( AFrame.CollectionArray, {
        // Whenever data is inserted into the collection, create a model for the
        //  data using the layout defined in friendSchemaConfig.
        plugins: [ [ AFrame.CollectionPluginModel, {
            schema: friendSchemaConfig
        } ] ]
    } );

    // This is a list of friends.  It will display the data held by each of Friend models.
    // The list is bound to the friendsCollection, any time a friend is added or removed 
    // from the collection, the list will be automatically updated.
    var friendsList = AFrame.create( AFrame.List, {
        target: '#friendList',
        listElementFactory: function( model, index ) {
            // whenever a model is inserted into the collection, create a list item
            //  using the data from the model.
            return AFrame.DOM.createElement( 'li', model.get( 'name' ) );
        },
        // Bind the list to the collection, causing the list to update automatically
        //  whenever friends are added or removed from the collection.
        plugins: [ [ AFrame.ListPluginBindToCollection, {
                collection: friendsCollection
            }
        ] ]
    } );

    // Once the user enters a name, insert the new "friend" data into the friendsCollection.
    // A friend Model will be created, and the list will be updated - all automatically.
    $( '#add-friend' ).click( function( event ) {
           var friend_name = prompt( "Who is your friend?" );
           friendsCollection.insert( { name: friend_name } );
    } );            
    &lt;/script&gt;

### Using AFrameJS without compilation ###

Grab a pre-compiled version of the library:

* [jQuery Uncompressed](https://github.com/stomlinson/AFrame-JS/raw/master/dist/aframe-current-jquery.js)
* [jQuery Compressed](https://github.com/stomlinson/AFrame-JS/raw/master/dist/aframe-current-jquery.min.js)
* [MooTools Uncompressed](https://github.com/stomlinson/AFrame-JS/raw/master/dist/aframe-current-mootools.js)
* [MooTools Compressed](https://github.com/stomlinson/AFrame-JS/raw/master/dist/aframe-current-mootools.min.js)
* [Prototype Uncompressed](https://github.com/stomlinson/AFrame-JS/raw/master/dist/aframe-current-prototype.js)
* [Prototype Compressed](https://github.com/stomlinson/AFrame-JS/raw/master/dist/aframe-current-prototype.min.js)


Create a script tag inside of your HTML document:

    <script type="text/javascript" src="aframe-current-xxx.js"></script>

where xxx is the version that you downloaded.

### Tutorials and API Documentation ###
* [Tutorial](http://www.aframejs.com/tutorial.html)
* [API Documentation](http://www.aframejs.com/docs/index.html)

### To download and build the libraries and docs ###

1. [Apache Ant](http://ant.apache.org/) is required.  [Go get it.](http://ant.apache.org/)
2. [Ant-contrib](http://ant-contrib.sourceforge.net/) is also required.  [Go get it.](http://ant-contrib.sourceforge.net/)
3. Check out a copy of the code from [GitHub](https://github.com/stomlinson/AFrame-JS).
4. The sample per_user.properties.sample must be personalized and copied to per_user.properties
5. run "ant all" to do a full build. Since I do development both in Linux and Windows, the build script works with both.

### Build options ###
1. "ant all" does a full build.
2. "ant compress" concatinates and compresses javascript
3. "ant docs" builds the docs
4. "and jslint" runs a javascript linter to check for errors
5. "ant clean" cleans up any messes


### Licensing ###
AFrameJS is released under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/).

### Contributing ###
AFrameJS is still in heavy development and has a long way to go to be a polished product.  Any suggestions, any feedback, and any
contributions will be taken seriously.  

I am especially in need at the moment of more people using AFrameJS to create simple apps
that help point out where pain points, difficulties and down right strangenesses are.  A clean API makes life so much easier, with
help, I'd like to make AFrameJS the cleanest Javascript MVC library that exists.

A second area that could use attention is in documentation.  I have tried my best to document as I have gone along, but some more 
detailed documentation as well as some simple HOWTOs are needed.

A third area that needs help is to write DOM adapters for various DOM libraries.  Adapters are needed for [YUI](http://developer.yahoo.com/yui/), 
[Dojo](http://dojotoolkit.org/), [Ext](http://www.sencha.com/products/js/), and any other DOM libraries out there that are used.

### Keeping up to date ###
1. Follow [@AFrameJS](http://twitter.com/#!/AFrameJS) on Twitter
2. Keep up with the [site.](http://www.aframejs.com)
3. Check back here.

### About Me: Shane Tomlinson###
1. set117 (show me a sign) yahoo.com
2. [http://www.shanetomlinson.com](http://www.shanetomlinson.com)
3. [@shane_tomlinson](http://twitter.com/#!/shane_tomlinson)
