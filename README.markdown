AFrame JS - The Javascript Application Framework
================================================

[http://www.aframejs.com](http://www.aframejs.com)
-----------------------

AFrame is being developed out of the frustration of not having a proper application framework at my disposal when I first
started using Javascript to write web applications.  There are plenty of DOM manipulation libraries (jQuery, Prototype, Dojo, YUI),
some that provide hundreds of widgets (Dojo, YUI, Sencha Labs) and others that shield you from writing Javascript (Cappachino) but
at the cost of massive libraries.  There is a need for a light weight APPLICATION framework which provide a clean way to write
in a traditional MVC style.  Backbone and Knockout-JS are two similar options, and now AFrame addresses this need.

AFrame right now depends on jQuery, in particular the Sizzle engine, this is used to work with displays.  I am hoping to remove this
dependency to keep things as flexible as possible.

To use AFrame without compilation, you can grab the current version in dist/aframe-current.js or dist/aframe-current.min.js

Unit tests use the YUI Unit test library.  These can be run by browsing to the tests directory and opening index.html


### To download and build the libraries and docs ###

1. Apache Ant is required.  Go get it.
2. The sample per_user.properties.sample must be personalized and copied to per_user.properties
3. Since I do development both in Linux and Windows, the build script works with both.
4. run "ant all" to do a full build.

### Build options ###
1. "ant all" does a full build.
2. "ant compress" concatinates and compresses javascript
3. "ant docs" builds the docs
4. "and jslint" runs a javascript linter to check for errors
5. "ant clean" cleans up any messes



