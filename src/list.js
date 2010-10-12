/**
 * A generic HTML list class
 * @class AFrame.List
 * @extends AFrame.Display
 * @constructor
 */
/**
 * A template to use for the list and list items.
 * @config template
 * @type {element || selector}
 */
AFrame.List = function() {
	AFrame.List.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.List, AFrame.Display, {
	init: function( config ) {
		this.template = $( config.template ).html();
		
		AFrame.List.superclass.init.apply( this, arguments );
	},

	/**
	 * Insert an item into the list
	 * @method insert
	 * @param {number} index - index to insert at.
	 * @param {object} data - data to use for list item
	 */
	insert: function( index, data ) {
		var elementToInsert = $( '<div/>' ).setTemplate( this.template ).processTemplate( data ).first().children( 0 );

		this.getTarget().append( elementToInsert );
		
		this.triggerEvent( 'onInsert', index, elementToInsert, data );
	},

	/**
	 * Remove an item from the list
	 * @method remove
	 * @param {number} index - index of item to remove
	 */
	remove: function( index ) {
		this.getTarget().children( 'li:eq(' + index + ')' ).remove();
	}
} );