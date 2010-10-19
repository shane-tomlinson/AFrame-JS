/**
 * A plugin to a collection to give the collection db ops.  Provides
 * load, add, save, delete
 * @class AFrame.CollectionPluginPersistence
 * @extend AFrame.Plugin
 * @constructor
 */
AFrame.CollectionPluginPersistence = function() {
	AFrame.CollectionPluginPersistence.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.CollectionPluginPersistence, AFrame.Plugin, {
	init: function( config ) {
		AFrame.CollectionPluginPersistence.superclass.init.apply( this, arguments );
	},

	setPlugged: function( plugged ) {
		plugged.add = this.add.bind( this );
		plugged.load = this.load.bind( this );
		plugged[ 'delete' ] = this[ 'delete' ].bind( this );
		plugged.save = this.save.bind( this );
		
		AFrame.CollectionPluginPersistence.superclass.setPlugged.apply( this, arguments );
	},
	
	add: function( data, meta ) {
		this.insert( data, meta );
	},

	load: function( meta ) {
		
	},

	'delete': function( rowID ) {
		
	},

	save: function( rowID ) {
		
	}
} );
