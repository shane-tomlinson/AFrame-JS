AFrame.Class = ( function() {
    "use strict";

    /**
    * A shortcut to create a new class with a default constructor.  A default
    *   constructor does nothing unless it has a superclass, where it calls the
    *   superclasses constructor.  If the first parameter to Class is a function,
    *   the parameter is assumed to be the superclass.  All other parameters
    *   should be objects which are mixed in to the new classes prototype.
    *
    * If a new class needs a non-standard constructor, the class constructor should
    *   be created manually and then any mixins/superclasses set up using the
    *   [AFrame.extend](#method_extend) function.
    *
    *     // Create a class that is not subclassed off of anything
    *     var Class = AFrame.Class( {
    *        anOperation: function() {
    *           // do an operation here
    *        }
    *     } );
    *
    *     // Create a Subclass of AFrame.AObject
    *     var SubClass = AFrame.Class( AFrame.AObject, {
    *        anOperation: function() {
    *           // do an operation here
    *        }
    *     } );
    *
    * @method AFrame.Class
    * @param {function} superclass (optional) - superclass to use.  If not given, class has
    *   no superclass.
    * @param {object}
    * @return {function} - the new class.
    */
    var Class = function() {
        var F;

        var args = Array.prototype.slice.call( arguments, 0 );

        // we have a superclass, do everything related to a superclass
        if( AFrame.func( args[ 0 ] ) ) {
            F = function() {
                F.sc.constructor.call( this );
            };
            AFrame.extend( F, args[ 0 ] );
            args.splice( 0, 1 );
        }
        else {
            // no superclass.  Create a base class.
            F = function() {};
        }

        for( var mixin, index = 0; mixin = args[ index ]; ++index ) {
            AFrame.mixin( F.prototype, mixin );
        }

        // Always set the constructor last in case any mixins overwrote it.
        F.prototype.constructor = F;

		AFrame.addCreate( F );

        return F;
    };

    /**
    * Walk the class chain of an object.  The object must be an AFrame.Class/AFrame.extend based.
    *
    *    // Walk the object's class chain
    *    // SubClass is an AFrame.Class based class
    *    var obj = AFrame.create( SubClass );
    *    AFrame.Class.walkChain( function( currClass ) {
    *        // do something.  Context of function is the obj
    *    }, obj );
    *
    * @method AFrame.Class.walkChain
    * @param {function} callback - callback to call.  Called with two parameters, currClass and
    *   obj.
    * @param {AFrame.Class} obj - object to walk.
    */
    Class.walkChain = function( callback, obj ) {
        var currClass = obj.constructor;
        do {
            callback.call( obj, currClass );
            currClass = currClass.superclass;
        } while( currClass );
    };

    return Class;
}() );
