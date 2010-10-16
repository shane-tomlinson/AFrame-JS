/**
* A basic plugin, used to extend functionality of an object without either subclassing or directly
*	extending that object.  Plugins make it easy to create configurable objects by adding
*	small units of coherent functionality and plugging a base object.  When creating an object,
*	if the functionality is needed, add the plugin, if not, leave it out.
* @class AFrame.Plugin
* @extends AFrame.AObject
* @constructor
*/
AFrame.Plugin = function() {
	AFrame.Plugin.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.Plugin, AFrame.AObject, {
	setPlugged: function( plugged ) {
		this.plugged = plugged;
	},
	
	getPlugged: function() {
		return this.plugged;
	}
} );