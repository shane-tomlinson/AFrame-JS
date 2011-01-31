[AFrameJS](http://www.aframejs.com) - The Javascript Application Framework
================================================

[http://www.aframejs.com](http://www.aframejs.com)

### See a sample app in action - [MobileNotes](https://github.com/stomlinson/MobileNotes) ###


-----------------------

AFrame is a Javascript MVC library that aims to provide a foundation for developing applications in Javascript using the same
methodologies other languages have been using for years.  This is NOT another DOM manipulation library. There are
plenty of DOM manipulation libraries (jQuery, MooTools, Prototype, Dojo, YUI), other libraries that provide 
hundreds of widgets (Dojo, YUI, Sencha Labs) and others that shield you from writing Javascript (Cappachino).  But why?
There is a need for a light weight APPLICATION library which provide a clean way to write apps in a traditional MVC style.
Backbone and Knockout-JS are two similar options, and now AFrame addresses this need.

AFrame has no dependency on any DOM framework in particular, all DOM interaction is done through DOM adapters.  Currently,
there are adapters for jQuery, MooTools, and Prototype.  Adapters for YUI, Ext, and possibly Dojo are planned as I get time.
If there is an adapter that you need that is not written, code it up, make sure it passes the unit tests, and I will gladly accept submissions!

Unit tests use the YUI Unit test library.  These can be run by browsing to the tests directory and opening index.html

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


### See a sample app in action ###
1. Check out [MobileNotes](https://github.com/stomlinson/MobileNotes) 

### Licensing ###
AFrameJS is released under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/).

### Contributing ###
AFrameJS is still in heavy development and has a long way to go to be a polished product.  Any suggestions, any feedback, and any
contributions will be taken seriously.  

I am especially in need at the moment of more people using AFrameJS to create simple apps
that help point out where pain points, difficulties and down right strangenesses are.  A clean API makes life so much easier, with
help, I'd like to make AFrameJS the cleanest Javascript MVC library that exists.

A second area that needs help is to write DOM adapters for various DOM libraries.  Adapters are needed for [YUI](http://developer.yahoo.com/yui/), 
[Dojo](http://dojotoolkit.org/), [Ext](http://www.sencha.com/products/js/), and any other DOM libraries out there that are used.

### Keeping up to date ###
1. Follow [@AFrameJS](http://twitter.com/#!/AFrameJS) on Twitter
2. Keep up with the [site.](http://www.aframejs.com)
3. Check back here.

### About Me: Shane Tomlinson###
1. set117 (show me a sign) yahoo.com
2. [http://www.shanetomlinson.com](http://www.shanetomlinson.com)
3. [@shane_tomlinson](http://twitter.com/#!/shane_tomlinson)
