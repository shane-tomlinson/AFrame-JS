AFrame JS - The Javascript Application Framework
================================================

[http://www.aframejs.com](http://www.aframejs.com)
-----------------------

AFrame is an MVC library that aims to provide a foundation for developing applications in Javascript using the same
methodologies other languages have been using for years.  This is NOT another DOM manipulation library. There are
plenty of DOM manipulation libraries (jQuery, MooTools, Prototype, Dojo, YUI), other libraries that provide 
hundreds of widgets (Dojo, YUI, Sencha Labs) and others that shield you from writing Javascript (Cappachino).  But why?
There is a need for a light weight APPLICATION library which provide a clean way to write apps in a traditional MVC style.
Backbone and Knockout-JS are two similar options, and now AFrame addresses this need.

AFrame has no dependency on any DOM framework in particular, all DOM interaction is done through DOM adapters.  Currently,
there are adapters for jQuery, MooTools, and Prototype.  Adapters for YUI, Ext, and possibly Dojo are planned as I get time.
If there is an adapter that you need that is not written, code it up, make sure it passes the unit tests, and I will gladly accept submissions!

To use AFrame without compilation, you can grab the current version in dist/aframe-current-XXX.js or dist/aframe-current-XXX.min.js
where XXX is the adapter of your choice.

Unit tests use the YUI Unit test library.  These can be run by browsing to the tests directory and opening index.html

### To download and build the libraries and docs ###

1. Apache Ant is required.  Go get it.
2. Check out a copy of the code from [GitHub](https://github.com/stomlinson/AFrame-JS).
3. The sample per_user.properties.sample must be personalized and copied to per_user.properties
4. run "ant all" to do a full build. Since I do development both in Linux and Windows, the build script works with both.

### Build options ###
1. "ant all" does a full build.
2. "ant compress" concatinates and compresses javascript
3. "ant docs" builds the docs
4. "and jslint" runs a javascript linter to check for errors
5. "ant clean" cleans up any messes

### To see a sample app in action ###
1. Check out [MobileNotes](https://github.com/stomlinson/MobileNotes) 


Shane Tomlinson
set117 (show me a sign) yahoo.com
