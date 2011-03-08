
/**
 * The AFrame base namespace.  Provides some useful utility functions.  The most commonly used functions are [Class](#method_Class) and [create](#method_create).
 *
 *
 * @class AFrame
 * @static
*/
var AFrame = ( function() {
    "use strict";
    
    var AFrame = {
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
        * @method Class
        * @param {function} superclass (optional) - superclass to use.  If not given, class has
        *   no superclass.
        * @param {object} 
        * @return {function} - the new class.
        */
        Class: function() {
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
            
            return F;
        },
        
        /**
        * Used to extend a class with another class and optional functions.
        *
        *    AFrame.NewClass = function() {
        *        AFrame.NewClass.sc.constructor.apply( this, arguments );
        *    }
        *    AFrame.extend( AFrame.NewClass, AFrame.AObject, {
        *        someFunc: function() { 
        *            // do something here
        *        }
        *    } );
        *
        * @method extend
        * @param {function} derived - class to extend
        * @param {function} sc - class to extend with.
        * @param {object} extrafuncs (optional) - all additional parameters will have their functions mixed in.
        */
        extend: function( derived, sc ) {
            var F = function() {};
            F.prototype = sc.prototype;
            derived.prototype = new F();
            derived.superclass = sc;        // superclass and sc are different.  sc points to the superclasses prototype, superclass points to the superclass itself.
            derived.sc = sc.prototype;

            var mixins = Array.prototype.slice.call( arguments, 2 );
            for( var mixin, index = 0; mixin = mixins[ index ]; ++index ) {
                AFrame.mixin( derived.prototype, mixin );
            }
            derived.prototype.constructor = derived;
        },

        /**
        * extend an object with the members of another object.
        *
        *    var objectToMixinTo = {
        *         name: 'AFrame'
        *    };
        *    AFrame.mixin( objectToMixinTo, '{ version: 1.0 } );
        *
        * @method mixin
        * @param {object} toExtend - object to extend
        * @param {object} mixin (optional) - object with optional functions to extend bc with
        */
        mixin: function( toExtend, mixin ) {
            toExtend = jQuery.extend( toExtend, mixin );
        },


        /**
        * Instantiate an [AFrame.AObject](#AFrame.AObject.html) compatible object.  
        * When using the construct function,  any Plugins are automatically created 
        * and bound, and init is called on  the created object.  It is recommended to 
        * use [create](#method_AFrame.create) instead as it has more concise syntax.
        *
        *    var newObj = AFrame.construct( {
        *       type: AFrame.SomeObject,
        *       config: {
        *           param1: val1
        *       },
        *       plugins: [ {
        *         type: AFrame.SomePlugin
        *       } ]
        *    } );
        *
        * @method construct
        * @param {object} obj_config - configuration.
        * @param {function} obj_config.type - Function to use as the constructor
        * @param {object} obj_config.config - configuration to pass to object's init function
        * @param {array} obj_config.plugins - Array of AFrame.Plugin to attach to object.
        * @return {object} - created object.
        */
        
        /**
        * Deprecated in favor of [AFrame.create](#method_AFrame.create)
        * @deprecated
        */
        construct: function( obj_config ) {
            var constuct = obj_config.type;
            var retval;

            if( constuct ) {
                var config = obj_config.config || {};
                var plugins = obj_config.plugins || [];
                try {
                    retval = new constuct;
                } catch ( e ) {
                    console.log( e.toString() );
                }

                for( var index = 0, plugin; plugin = plugins[ index ]; ++index ) {
                    var pluginObj = AFrame.construct( plugin );

                    pluginObj.setPlugged( retval );
                }

                retval.init( config );
            }
            else {
                throw 'Class does not exist.';
            }

            return retval;
        },
        
        /**
        * Instantiate an [AFrame.AObject](#AFrame.AObject.html) compatible object.  
        * When using the create function, any Plugins are automatically created 
        * and bound, and init is called on the created object.
        *
        *    // create an object with no config, no plugins
        *    var newObj = AFrame.create( AFrame.SomeObject );
        *
        *    // create an object with config, no plugins
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       configItem1: configVal1
        *    } );
        *    
        *    // create an object with a plugin, but no other config
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       plugins: [ AFrame.SomePlugin ]
        *    } );
        *
        *    // create an object with a plugin, and other config
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       plugins: [ AFrame.SomePlugin ],
        *       configItem1: configVal1
        *    } );
        *
        *    // create an object with a plugin that also has configuration
        *    var newObj = AFrame.create( AFrame.SomeObject, {
        *       plugins: [ [ AFrame.SomePlugin, {
        *           pluginConfigItem1: pluginConfigVal1
        *       } ] ]
        *    } );
        *
        * @method create
        * @param {function} constructor - constructor to create
        * @param {object} config (optional) - configuration.
        * @param {array} config.plugins (optional) - Any plugins to attach
        */
        create: function( construct, config ) {
            var retval;
            if( construct ) {
                try {
                    retval = new construct;
                } catch ( e ) {
                    console.log( e.toString() );
                }
                
                config = config || {};
                var plugins = config.plugins || [];
                
                // recursively create and bind any plugins
                for( var index = 0, plugin; plugin = plugins[ index ]; ++index ) {
                    plugin = AFrame.array( plugin ) ? plugin : [ plugin ];
                    var pluginObj = AFrame.create( plugin[ 0 ], plugin[ 1 ] );
                    pluginObj.setPlugged( retval );
                }
                
                retval.init( config );
            }
            else {
                throw 'Class does not exist.';
            }
            return retval;
            
        },

        /**
         * Remove an item from an object freeing the reference to the item.
         *
         *     var obj = {
         *        name: 'AFrame'
         *     };
         *     AFrame.remove( obj, 'name' );
         *     
         * @method remove
         * @param {object} object to remove item from.
         * @param {string} key of item to remove
         */
        remove: function( object, key ) {
          object[ key ] = null;
          delete object[ key ];
        },

        currentID: 0,
        
        /**
         * Get a unique ID
         *
         *     var uniqueID = AFrame.getUniqueID();
         *     
         * @method getUniqueID
         * @return {id} a unique id
         */
        getUniqueID: function() {
            this.currentID++;
            return 'cid' + this.currentID;
        },

        /**
         * Check whether an item is defined
         *
         *     var isDefined = AFrame.func( valueToCheck );
         *     
         * @method defined
         * @param {variant} itemToCheck
         * @return {boolean} true if item is defined, false otw.
         */
        defined: function( itemToCheck ) {
            return 'undefined' != typeof( itemToCheck );
        },
        
        /**
        * Check whether an item is a function
         *
         *     var isFunc = AFrame.func( valueToCheck );
         *     
        * @method func
        * @param {variant} itemToCheck
        * @return {boolean} true if item is a function, false otw.
        */
        func: function( itemToCheck ) {
            return 'function' == typeof( itemToCheck );
        },
        
        /**
        * Check whether an item is a string
        *
        *    var isString = AFrame.string( valueToCheck );
        *
        * @method string
        * @param {variant} itemToCheck
        * @return {boolean} true if item is a string, false otw.
        */
        string: function( itemToCheck ) {
            return '[object String]' === Object.prototype.toString.apply( itemToCheck );
        },
        
        /**
        * Check whether an item is an array
        *
        *    // returns true
        *    var isArray = AFrame.array( [] );
        *
        *    // returns true
        *    isArray = AFrame.array( new Array() );
        *
        *    // returns false
        *    isArray = AFrame.array( '' );
        *
        * @method array
        * @param {variant} itemToCheck
        * @return {boolean} true if item is an array, false otw.
        */
        array: function( itemToCheck ) {
            return '[object Array]' === Object.prototype.toString.apply( itemToCheck );
        }
    };
    
    return AFrame;

}() );
