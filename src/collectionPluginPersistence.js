/**
 * A plugin to a collection to give the collection db ops.  This is part of what is usually called an Adapter
 *  when referring to collections with a hookup to a database.  The CollectionPluginPersistence is not the actual 
 *  Adapter but binds a collection to an Adapter.  The CollectionPluginPersistence adds load, add, save, del 
 *  functions to the collection, all four functions are assumed to operate asynchronously.  
 *  When configuring the plugin, 4 parameters can be specified, each are optional.
 *  The four paramters are addCallback, saveCallback, loadCallback, and deleteCallback.  When the callbacks are called, they
 *  will be called with three parameters, data, options.  data is the data currently being operated on. options is
 *  options data that will contain at least two fields, collection and onComplete. onComplte should be called by the 
 *  adapter when the adapter function
 *  has completed.
 *
 *     // set up the adapter
 *     var dbAdapter = {
 *         load: function( options ) {
 *              // functionality here to do the load
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         add: function( data, options ) {
 *              // functionality here to do the add
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         del: function( data, options ) {
 *              // functionality here to do the delete
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         save: function( data, options ) {   
 *              // functionality here to do the save
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         }
 *     };
 *
 *     var collection = AFrame.construct( {
 *          type: AFrame.CollectionArray,
 *          plugins: [ {
 *              type: AFrame.CollectionPluginPersistence,
 *              config: {
 *                  // specify each of the four adapter functions
 *                  loadCallback: dbAdapter.load,
 *                  addCallback: dbAdapter.load,
 *                  deleteCallback: dbAdapter.del,
 *                  saveCallback: dbAdapter.save
 *              }
 *          } ]
 *     } );
 *     
 *     // Loads the initial data
 *     collection.load( {
 *          onComplete: function() {
 *              alert( 'Collection is loaded' );
 *          }
 *     } );
 *      
 *     // Adds an item to the collection.  Note, a cid is not given back
 *     // because this operation is asynchronous and a cid will not be
 *     // assigned until the persistence operation completes.  A CID
 *     // will be placed on the items data.
 *     collection.add( {
 *          name: 'AFrame',
 *          company: 'AFrame Foundary'
 *     }, {
 *          onComplete: function( data, options ) {
 *              // cid is available here in either options.cid or data.cid
 *              alert( 'add complete, cid: ' + options.cid );
 *          }
 *     } );
 *
 *     // delete an item with cid 'cid'.
 *     collection.del( 'cid', {
 *          onComplete: function() {
 *              alert( 'delete complete' );
 *          }
 *     } );
 *
 *     // save an item with cid 'cid'.
 *     collection.save( 'cid', {
 *          onComplete: function() {
 *              alert( 'save complete' );
 *          }
 *     } );
 *
 * @class AFrame.CollectionPluginPersistence
 * @extends AFrame.Plugin
 * @constructor
 */
AFrame.CollectionPluginPersistence = function() {
	AFrame.CollectionPluginPersistence.superclass.constructor.apply( this, arguments );
};
AFrame.extend( AFrame.CollectionPluginPersistence, AFrame.Plugin, {
	init: function( config ) {
		/**
		 * function to call to do add.  Will be called with three parameters, data, options, and callback.
		 * @config addCallback
		 * @type function (optional)
		 */
		this.addCallback = config.addCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do save.  Will be called with three parameters, data, options, and callback.
		 * @config saveCallback
		 * @type function (optional)
		 */
		this.saveCallback = config.saveCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do load.  Will be called with two parameters, options, and callback.
		 * @config loadCallback
		 * @type function (optional)
		 */
		this.loadCallback = config.loadCallback || this.noPersistenceOp;
		
		/**
		 * function to call to do delete.  Will be called with three parameters, data, options, and callback.
		 * @config deleteCallback
		 * @type function (optional)
		 */
		this.deleteCallback = config.deleteCallback || this.noPersistenceOp;
		
		AFrame.CollectionPluginPersistence.superclass.init.apply( this, arguments );
	},

	noPersistenceOp: function( data, options ) {
        var callback = options.onComplete;
		callback && callback( data, options );
	},

	setPlugged: function( plugged ) {
		plugged.add = this.add.bind( this );
		plugged.load = this.load.bind( this );
		plugged.del = this.del.bind( this );
		plugged.save = this.save.bind( this );
		
		AFrame.CollectionPluginPersistence.superclass.setPlugged.apply( this, arguments );
	},

	/**
	 * Add an item to the collection.  The item will be inserted into the collection once the addCallback
     *  is complete.  Because of this, no cid is returned from the add function, but one will be placed into
     *  the options data passed to the onComplete callback.
     *      
     *     // Adds an item to the collection.  Note, a cid is not given back
     *     // because this operation is asynchronous and a cid will not be
     *     // assigned until the persistence operation completes.  A CID
     *     // will be placed on the items data.
     *     collection.add( {
     *          name: 'AFrame',
     *          company: 'AFrame Foundary'
     *     }, {
     *          onComplete: function( data, options ) {
     *              // cid is available here in either options.cid or data.cid
     *              alert( 'add complete, cid: ' + options.cid );
     *          }
     *     } );
     *     
	 * @method add
	 * @param {object} data - data to add
	 * @param {object} options - options information.  
     * @param {function} options.onComplete (optional) - callback to call when complete
	 *	Will be called with two parameters, the data, and options information.
     * @param {function} options.insertAt (optional) - data to be passed as second argument to the collection's 
     *  insert function.  Useful when using CollectionArrays to specify the index
	 */
	add: function( data, options ) {
		options = this.getOptions( options );
        var callback = options.onComplete;
        
        options.onComplete = function() {
            var cid = this.getPlugged().insert( data, options.insertAt );
            options.cid = cid;
            options.onComplete = callback;
			callback && callback( data, options );
		}.bind( this );
        
		this.addCallback( data, options );
	},

	/**
	 * load the collection
     *
     *     // Loads the initial data
     *     collection.load( {
     *          onComplete: function() {
     *              alert( 'Collection is loaded' );
     *          }
     *     } );
     *      
	 * @method load
	 * @param {object} options - options information.  
     * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
	 *	Callback will be called with two parameters, the items, and options information.
	 */
	load: function( options ) {
		options = this.getOptions( options );
        var callback = options.onComplete;
        
        options.onComplete = function( items ) {
			if( items ) {
				var plugged = this.getPlugged();
				items.forEach( function( item, index ) {
					plugged.insert( item );
				} );
			}
            options.onComplete = callback;
			callback && callback( items, options );
		}.bind( this );
        
		this.loadCallback( options );
	},

	/**
	 * delete an item in the collection
     *
     *     // delete an item with cid 'cid'.
     *     collection.del( 'cid', {
     *          onComplete: function() {
     *              alert( 'delete complete' );
     *          }
     *     } );
     *
     * @method del
	 * @param {id || index} itemID - id or index of item to remove
	 * @param {object} options - options information.
     * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
	 *	Callback will be called with two parameters, the data, and options information.
	 */
	del: function( itemID, options ) {
        var plugged = this.getPlugged();
		var data = plugged.get( itemID );
		
		if( data ) {
			options = this.getOptions( options );
            var callback = options.onComplete;
            
            options.onComplete = function() {
				plugged.remove( itemID, options );
                options.onComplete = callback;
				callback && callback( data, options );
			}.bind( this );
            
			this.deleteCallback( data, options );
		}
	},

	/**
	 * save an item in the collection
     *
     *     // save an item with cid 'cid'.
     *     collection.save( 'cid', {
     *          onComplete: function() {
     *              alert( 'save complete' );
     *          }
     *     } );
     *
	 * @method save
	 * @param {id || index} itemID - id or index of item to save
	 * @param {object} options - options information.
     * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
	 *	Callback will be called with two parameters, the data, and options information.
	 */
	save: function( itemID, options ) {
		var data = this.getPlugged().get( itemID );

		if( data ) {
			options = this.getOptions( options );
            var callback = options.onComplete;
            
            options.onComplete = function() {
                options.onComplete = callback;
				callback && callback( data, options );
			}.bind( this );
            
			this.saveCallback( data, options );
		}
	},

	getOptions: function( options ) {
		options = options || {};
		options.collection = this.getPlugged();
		return options;
	}
} );
