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
 *              // Method 1: this does not override the initial item
 *              if( options.onComplete ) {
 *                  options.onComplete();
 *              }
 *
 *              // Method 2: this overrides the initial item to create a model which is inserted
 *              // into the collection.  Note, getModel is an imaginary function used only for
 *              // demo purposes.
 *              if( options.onComplete ) {
 *                  var model = getModel( item );
 *                  options.onComplete( model );
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
    
    var Plugin = AFrame.Class( AFrame.Plugin, {
        init: function( config ) {
            /**
             * function to call to do add.  Will be called with two parameters, data, and options.
             * @config addCallback
             * @type function (optional)
             */
            this.addCallback = config.addCallback || noPersistenceOp;
            
            /**
             * function to call to do save.  Will be called with two parameters, data, and options.
             * @config saveCallback
             * @type function (optional)
             */
            this.saveCallback = config.saveCallback || noPersistenceOp;
            
            /**
             * function to call to do load.  Will be called with one parameter, options.
             * @config loadCallback
             * @type function (optional)
             */
            this.loadCallback = config.loadCallback || noPersistenceOp;
            
            /**
             * function to call to do delete.  Will be called with two parameters, data, and options.
             * @config deleteCallback
             * @type function (optional)
             */
            this.deleteCallback = config.deleteCallback || noPersistenceOp;
            
            Plugin.sc.init.apply( this, arguments );
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
         * @param {boolean} options.force (optional) - If set to true, an add will be forced even if
         *  onBeforeAdd has its preventDefault called.
         */
        add: function( item, options ) {
            options = getOptions( this, options );
            var callback = options.onComplete;
            
            var plugged = this.getPlugged();
            /**
            * Triggered on the collection before an add is sent to persistence.  If the event has preventDefault called,
            *   the add will be cancelled as long as the options.force is not set to true
            * @event onBeforeAdd
            * @param {AFrame.Event} event - event object
            * @param {variant} event.item - the item being added
            * @param {boolean} event.force - whether the add is being forced.
            */
            var event = plugged.triggerEvent( getEvent( 'onBeforeAdd', item, options ) );
            
            if( plugged.shouldDoAction( options, event ) ) {
                options.onComplete = function( overriddenItem ) {
                    // For the insert item, use the item given by the db access layer, if they pass one back.  If 
                    //  no override is given, use the original item.
                    item = overriddenItem || item;
                    var cid = plugged.insert( item, options.insertAt );
                    options.cid = cid;
                    options.onComplete = callback;
                    
                    callback && callback( item, options );
                    
                    /**
                    * Triggered on the collection after an item is sent to persistence and is added to the Collection.  
                    * @event onAdd
                    * @param {AFrame.Event} event - event object
                    * @param {variant} event.item - the item being added
                    * @param {boolean} event.force - whether the add is being forced.
                    * @param {id} event.cid - item's cid
                    */
                    plugged.triggerEvent( getEvent( 'onAdd', item, options ) );
                };
                
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
            options = getOptions( this, options );
            var plugged = this.getPlugged();

            /**
            * Triggered on the collection before a load occurs.  If the listener calls preventDefault on the event,
            *   the load will be cancelled unless the load is forced.
            * @event onBeforeLoad
            * @param {object} event - event information
            * @param {boolean} event.force - whether the load is being forced.
            */
            var event = plugged.triggerEvent( {
                type: 'onBeforeLoad',
                force: options && options.force
            } );
            if( plugged.shouldDoAction( options, event ) ) {
                var callback = options.onComplete;
                /**
                * Triggered on the collection whenever a load is starting
                * @event onLoadStart
                * @param {object} event - event information
                * @param {boolean} event.force - whether the load is being forced.
                */
                plugged.triggerEvent( {
                    type: 'onLoadStart',
                    force: options && options.force
                } );
                options.onComplete = onComplete.bind( this, callback, options );
                
                this.loadCallback( options );
            }
            
            function onComplete( callback, options, items ) {
                if( items ) {
                    items.forEach( function( item, index ) {
                        plugged.insert( item );
                    } );
                }
                options.onComplete = callback;
                callback && callback( items, options );
                
                /**
                * Triggered on the collection whenever a load has completed
                * @event onLoad
                * @param {object} event - event information, has collection and items fields.
                * @param {variant} event.items- items loaded inserted
                * @param {boolean} event.force - whether the load is being forced.
                */
                plugged.triggerEvent( {
                    items: items,
                    type: 'onLoad',
                    force: options && options.force
                } );
            }
            
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
                /**
                * Triggered on the collection before a delete is sent to persistence.  If the event has preventDefault called,
                *   the delete will be cancelled as long as the options.force is not set to true
                * @event onBeforeDelete
                * @param {AFrame.Event} event - event object
                * @param {variant} event.item - the item being deleted
                * @param {boolean} event.force - whether the delete is being forced.
                */
                var event = plugged.triggerEvent( getEvent( 'onBeforeDelete', item, options ) );
            
                if( plugged.shouldDoAction( options, event ) ) {
                    options = getOptions( this, options );
                    var callback = options.onComplete;
                    
                    options.onComplete = function() {
                        plugged.remove( itemID, options );
                        options.onComplete = callback;
                        callback && callback( item, options );
                    };
                    
                    this.deleteCallback( item, options );
                    
                    /**
                    * Triggered on the collection after an item is deleted from persistence and is removed from the Collection.  
                    * @event onDelete
                    * @param {AFrame.Event} event - event object
                    * @param {variant} event.item - the item being deleted
                    * @param {boolean} event.force - whether the delete is being forced.
                    * @param {id} event.cid - item's cid
                    */
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
            var plugged = this.getPlugged();
            var item = plugged.get( itemID );

            if( item ) {
                /**
                * Triggered on the collection before a save is sent to persistence.  If the event has preventDefault called,
                *   the save elete will be cancelled as long as the options.force is not set to true
                * @event onBeforeSave
                * @param {AFrame.Event} event - event object
                * @param {variant} event.item - the item being saved
                * @param {boolean} event.force - whether the save is being forced.
                */
                var event = plugged.triggerEvent( getEvent( 'onBeforeSave', item, options ) );
                if( plugged.shouldDoAction( options, event ) ) {

                    options = getOptions( this, options );
                    var callback = options.onComplete;
                    
                    options.onComplete = function() {
                        options.onComplete = callback;
                        callback && callback( item, options );
                    }.bind( this );
                    
                    this.saveCallback( item, options );

                    /**
                    * Triggered on the collection after an item is saved to persistence.  
                    * @event onSave
                    * @param {AFrame.Event} event - event object
                    * @param {variant} event.item - the item being saved
                    * @param {boolean} event.force - whether the save is being forced.
                    * @param {id} event.cid - item's cid
                    */
                    plugged.triggerEvent( getEvent( 'onSave', item, options ) );
                }
            }
        }
    } );
    
    /**
    * Get the persistence options
    * @method getOptions
    * @private
    */
    function getOptions( context, options ) {
        options = options || {};
        options.collection = context.getPlugged();
        return options;
    }
    
    /**
    * Get an event object.  Used when triggering the on[Add|Delete|Save|Load]* events
    * @method getEvent
    * @private
    */
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
    
    /**
    * A NoOp type function that just calls the onComplete function, used for persistence functions
    *   where no callback is specified.
    * @method noPersistenceOp
    * @private
    */
    function noPersistenceOp( data, options ) {
        var callback = options.onComplete;
        callback && callback( data, options );
    }
    
    return Plugin;
} )();