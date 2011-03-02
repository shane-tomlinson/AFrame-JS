/**
* A basic plugin, used to extend functionality of an object without either subclassing or directly
*	extending that object.  Plugins make it easy to create configurable objects by adding
*	small units of coherent functionality and plugging a base object.  When creating an object,
*	if the functionality is needed, add the plugin, if not, leave it out.  When the plugged
*	object is torn down, the plugin will automatically be torn down as well.
* @class AFrame.Plugin
* @extends AFrame.AObject
* @constructor
*/
AFrame.Plugin = ( function() {
    "use strict";
    
    var Plugin = AFrame.Class( AFrame.AObject, {
        /**
        * Set the reference to the plugged object.  Subclasses can override this function to bind event
        *	listeners to the plugged object, especially onInit.  Binding to onInit allows the plugin to
        *	do setup as soon as the plugged object is ready.  If a subclass overrides this function,
        *	the base setPlugged must still be called.
        * @method setPlugged
        * @param {AFrame.AObject} plugged - the plugged object
        */
        setPlugged: function( plugged ) {
            this.plugged = plugged;
            
            plugged.bindEvent( 'onTeardown', this.teardown, this );
            plugged.bindEvent( 'onInit', this.onPluggedInit, this );
        },
        
        /**
        * Get a reference to the plugged object.
        * @method getPlugged
        * @return {AFrame.AObject} the plugged object
        */
        getPlugged: function() {
            return this.plugged;
        },
        
        teardown: function() {
            AFrame.remove( this, 'plugged' );
            Plugin.sc.teardown.call( this );
        },
        
        /**
        * Override to do some specialized handling when a plugged object is initialized.
        * @method onPluggedInit
        */
        onPluggedInit: function() {
            // do nothing
        }
    } );

    return Plugin;
}() );
