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
		/**
		 * function to call to do add
		 * @config addCallback
		 * @type function
		 */
		this.addCallback = config.addCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do save
		 * @config removeCallback
		 * @type function
		 */
		this.saveCallback = config.saveCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do load
		 * @config loadCallback
		 * @type function
		 */
		this.loadCallback = config.loadCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do delete
		 * @config deleteCallback
		 * @type function
		 */
		this.deleteCallback = config.deleteCallback || this.noPersistenceOp;
		
		AFrame.CollectionPluginPersistence.superclass.init.apply( this, arguments );
	},

	noPersistenceOp: function( data, meta, callback ) {
		callback( data, meta );
	},

	setPlugged: function( plugged ) {
		plugged.add = this.add.bind( this );
		plugged.load = this.load.bind( this );
		plugged.del = this.del.bind( this );
		plugged.save = this.save.bind( this );
		
		AFrame.CollectionPluginPersistence.superclass.setPlugged.apply( this, arguments );
	},

	/**
	 * Add an item to the collection.
	 * @method add
	 * @param {object} data - data to add
	 * @param {object} meta - meta information.  If callback is supplied in the
	 * 	meta information, the callback will be called when operation is complete.
	 */
	add: function( data, meta ) {
		meta = this.getMeta( meta );
		this.addCallback( data, meta, function() {
			this.getPlugged().insert( data, meta );
			meta.callback && meta.callback( data, meta );
		}.bind( this ) );
	},

	/**
	 * load the collection
	 * @method load
	 * @param {object} meta - meta information.  If callback is supplied in the
	 * 	meta information, the callback will be called when operation is complete.
	 */
	load: function( meta ) {
		meta = this.getMeta( meta );
		this.loadCallback( meta, function( items ) {
			if( items ) {
				var plugged = this.getPlugged();
				items.forEach( function( item, index ) {
					plugged.insert( item );
				} );
			}
			meta.callback && meta.callback( items, meta );
		}.bind( this ) );
	},

	/**
	 * delete an item in the collection
	 * @method delete
	 * @param {id} itemID - id of item to remove
	 * @param {object} meta - meta information.  If callback is supplied in the
	 * 	meta information, the callback will be called when operation is complete.
	 */
	del: function( itemID , meta ) {
		var data = this.getPlugged().get( itemID );
		
		if( data ) {
			meta = this.getMeta( meta );
			this.deleteCallback( data, meta, function() {
				this.getPlugged().remove( itemID, meta );
				meta.callback && meta.callback( data, meta );
			}.bind( this ) );
		}
	},

	/**
	 * save an item in the collection
	 * @method save
	 * @param {id} itemID - id of item to save
	 * @param {object} meta - meta information.  If callback is supplied in the
	 * 	meta information, the callback will be called when operation is complete.
	 */
	save: function( itemID, meta ) {
		var data = this.getPlugged().get( itemID );

		if( data ) {
			meta = this.getMeta( meta );
			this.saveCallback( data, meta, function() {
				meta.callback && meta.callback( data, meta );
			}.bind( this ) );
		}
	},

	getMeta: function( meta ) {
		meta = meta || {};
		meta.store = this;
		return meta;
	}
} );
