/**
 * A plugin to a collection to give the collection db ops.  This is part of what is usually called an Adapter
 *  when referring to collections with a hookup to a database.  The CollectionPluginPersistence is not the actual 
 *  Adapter but binds a collection to an Adapter.  The CollectionPluginPersistence adds load, add, save, del 
 *  functions to the collection, all four functions are assumed to operate asynchronously.  
 *  When configuring the plugin, 4 parameters can be specified, each are optional.
 *  The four paramters are addCallback, saveCallback, loadCallback, and deleteCallback.  When the callbacks are called, they
 *  will be called with two parameters, item, options.  item is the item currently being operated on. options is
 *  options data that will contain at least two fields, collection and onComplete. onComplte should be called by the 
 *  adapter when the adapter function
 *  has completed.
 *
 *     // set up the adapter
 *     var dbAdapter = {
 *         load: function( options ) {
 *              // functionality here to do the load
 *              // a variable named items is set with an array of items.
 *              if( options.onComplete ) {
 *                  options.onComplete( items );
 *              }
 *         },
 *         add: function( item, options ) {
 *              // functionality here to do the add
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         del: function( item, options ) {
 *              // functionality here to do the delete
 *              
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *         },
 *         save: function( item, options ) {   
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
 *     // Loads the initial items
 *     collection.load( {
 *          onComplete: function( items, options ) {
 *              alert( 'Collection is loaded' );
 *          }
 *     } );
 *      
 *     // Adds an item to the collection.  Note, a cid is not given back
 *     // because this operation is asynchronous and a cid will not be
 *     // assigned until the persistence operation completes.  A CID
 *     // will be placed on the item.
 *     collection.add( {
 *          name: 'AFrame',
 *          company: 'AFrame Foundary'
 *     }, {
 *          onComplete: function( item, options ) {
 *              // cid is available here in either options.cid or item.cid
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
AFrame.CollectionPluginPersistence = ( function() {
    "use strict";
    
    var Plugin = function() {
        Plugin.sc.constructor.apply( this, arguments );
    };
    AFrame.extend( Plugin, AFrame.Plugin, {
        init: function( config ) {
            /**
             * function to call to do add.  Will be called with two parameters, data, and options.
             * @config addCallback
             * @type function (optional)
             */
            this.addCallback = config.addCallback || this.noPersistenceOp;
            
            /**
             * function to call to do save.  Will be called with two parameters, data, and options.
             * @config saveCallback
             * @type function (optional)
             */
            this.saveCallback = config.saveCallback || this.noPersistenceOp;
            
            /**
             * function to call to do load.  Will be called with one parameter, options.
             * @config loadCallback
             * @type function (optional)
             */
            this.loadCallback = config.loadCallback || this.noPersistenceOp;
            
            /**
             * function to call to do delete.  Will be called with two parameters, data, and options.
             * @config deleteCallback
             * @type function (optional)
             */
            this.deleteCallback = config.deleteCallback || this.noPersistenceOp;
            
            Plugin.sc.init.apply( this, arguments );
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
            
            Plugin.sc.setPlugged.apply( this, arguments );
        },

        /**
         * Add an item to the collection.  The item will be inserted into the collection once the addCallback
         *  is complete.  Because of this, no cid is returned from the add function, but one will be placed into
         *  the options item passed to the onComplete callback.
         *      
         *     // Adds an item to the collection.  Note, a cid is not given back
         *     // because this operation is asynchronous and a cid will not be
         *     // assigned until the persistence operation completes.  A CID
         *     // will be placed on the item.
         *     collection.add( {
         *          name: 'AFrame',
         *          company: 'AFrame Foundary'
         *     }, {
         *          onComplete: function( item, options ) {
         *              // cid is available here in either options.cid or item.cid
         *              alert( 'add complete, cid: ' + options.cid );
         *          }
         *     } );
         *     
         * @method add
         * @param {object} item - item to add
         * @param {object} options - options information.  
         * @param {function} options.onComplete (optional) - callback to call when complete
         *	Will be called with two parameters, the item, and options information.
         * @param {function} options.insertAt (optional) - data to be passed as second argument to the collection's 
         *  insert function.  Useful when using CollectionArrays to specify the index
         */
        add: function( item, options ) {
            options = getOptions.call( this, options );
            var callback = options.onComplete;
            
            var plugged = this.getPlugged();
            var event = plugged.triggerEvent( getEvent( 'onBeforeAdd', item, options ) );
            
            if( plugged.shouldDoAction( options, event ) ) {
                options.onComplete = function() {
                    var cid = plugged.insert( item, options.insertAt );
                    options.cid = cid;
                    options.onComplete = callback;
                    callback && callback( item, options );
                    
                    plugged.triggerEvent( getEvent( 'onAdd', item, options ) );
                }.bind( this );
                
                this.addCallback( item, options );
            }
        },

        /**
         * load the collection
         *
         *     // Loads the initial data
         *     collection.load( {
         *          onComplete: function( items, options ) {
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
            options = getOptions.call( this, options );
            var callback = options.onComplete;
            var plugged = this.getPlugged();
            
            /**
            * Triggered on the plugged object whenever a load is requested
            * @event onLoadStart
            * @param {object} eventInfo - event information, has the collection field.
            * @param {CollectionHash} eventInfo.collection - collection causing event.
            */
            plugged.triggerEvent( 'onLoadStart' );
            options.onComplete = function( items ) {
                if( items ) {
                    items.forEach( function( item, index ) {
                        plugged.insert( item );
                    } );
                }
                options.onComplete = callback;
                callback && callback( items, options );
                
                /**
                * Triggered on the plugged object whenever a load is requested
                * @event onLoadComplete
                * @param {object} eventInfo - event information, has collection and items fields.
                * @param {CollectionHash} eventInfo.collection - collection causing event.
                * @param {variant} eventInfo.items- items loaded inserted
                */
                plugged.triggerEvent( {
                    items: items,
                    type: 'onLoadComplete'
                } );
            }.bind( this );
            
            this.loadCallback( options );
        },

        /**
         * delete an item in the collection
         *
         *     // delete an item with cid 'cid'.
         *     collection.del( 'cid', {
         *          onComplete: function( item, options ) {
         *              alert( 'delete complete' );
         *          }
         *     } );
         *
         * @method del
         * @param {id || index} itemID - id or index of item to remove
         * @param {object} options - options information.
         * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
         *	Callback will be called with two parameters, the item, and options information.
         */
        del: function( itemID, options ) {
            var plugged = this.getPlugged();
            var item = plugged.get( itemID );
            
            if( item ) {
                var event = plugged.triggerEvent( getEvent( 'onBeforeDelete', item, options ) );
            
                if( plugged.shouldDoAction( options, event ) ) {
                    options = getOptions.call( this, options );
                    var callback = options.onComplete;
                    
                    options.onComplete = function() {
                        plugged.remove( itemID, options );
                        options.onComplete = callback;
                        callback && callback( item, options );
                    }.bind( this );
                    
                    this.deleteCallback( item, options );
                    
                    plugged.triggerEvent( getEvent( 'onDelete', item, options ) );
                }
                
            }
        },

        /**
         * save an item in the collection
         *
         *     // save an item with cid 'cid'.
         *     collection.save( 'cid', {
         *          onComplete: function( item, options ) {
         *              alert( 'save complete' );
         *          }
         *     } );
         *
         * @method save
         * @param {id || index} itemID - id or index of item to save
         * @param {object} options - options information.
         * @param {function} options.onComplete (optional) - the callback will be called when operation is complete.
         *	Callback will be called with two parameters, the item, and options information.
         */
        save: function( itemID, options ) {
            var item = this.getPlugged().get( itemID );

            if( item ) {
                options = getOptions.call( this, options );
                var callback = options.onComplete;
                
                options.onComplete = function() {
                    options.onComplete = callback;
                    callback && callback( item, options );
                }.bind( this );
                
                this.saveCallback( item, options );
            }
        }
    } );
    
    function getOptions( options ) {
        options = options || {};
        options.collection = this.getPlugged();
        return options;
    }
    
    function getEvent( type, item, options ) {
        var event = {
            type: type,
            item: item
        };
        
        if( item.cid ) {
            event.cid = item.cid;
        }
        
        if( options && options.force ) {
            event.force = true;
        }
        
        return event;
    }
    
    return Plugin;
} )();