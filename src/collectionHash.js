/**
* A hash collection.  Items stored in the hash can be accessed/removed by a key.  The item's key
* is first searched for on the item's cid field, if the item has no cid field, a cid will be assigned
* to it.  The CID used is returned from the insert function.
*
* CollectionHash is different from a [CollectionArray](AFrame.CollectionArray.html) which is accessed
* by index.
*
*    Create the hash
*    var collection = AFrame.construct( {
*       type: CollectionHash
*    } );
*
*    // First item is inserted with a cid
*    var cid = collection.insert( { cid: 'cid1',
*                             name: 'AFrame Foundary',
*                             city: 'London',
*                             country: 'United Kingdom'
*                           } );
*    // cid variable will be 'cid1'
*
*    var googleCID = collection.insert( { name: 'Google',
*                                   city: 'Santa Clara',
*                                   country: 'United States'
*                                 } );
*    // googleCID will be assigned by the system
*
*    // Getting an item from the hash.
*    var item = collection.get( 'cid1' );
*    // item will be the AFrame Foundary item
*
*    var googleItem = collection.remove( googleCID );
*    // googleItem will be the google item that was inserted
*
* @class AFrame.CollectionHash
* @extends AFrame.AObject
* @constructor
*/
AFrame.CollectionHash = ( function() {
    var CollectionHash = function() {
        CollectionHash.sc.constructor.apply( this, arguments );
    };
    CollectionHash.currID = 0;
    AFrame.extend( CollectionHash, AFrame.AObject, {
        init: function( config ) {
            this.hash = {};
            
            CollectionHash.sc.init.apply( this, arguments );
        },
        
        teardown: function() {
            for( var cid in this.hash ) {
                AFrame.remove( this.hash, cid );
            }
            AFrame.remove( this, 'hash' );
            
            CollectionHash.sc.teardown.apply( this, arguments );
        },
        
        /**
        * Get an item from the hash.
        *
        *    // using data from example at top of page
        *    var item = hash.get( 'cid1' );
        *    // item will be the AFrame Foundary item
        *
        * @method get
        * @param {id} cid - cid of item to get
        * @return {variant} item if it exists, undefined otw.
        */
        get: function( cid ) {
            return this.hash[ cid ];
        },
        
        /**
        * Remove an item from the store.
        *
        *    // using data from example at top of page
        *    var googleItem = hash.remove( googleCID );
        *    // googleItem will be the google item that was inserted
        *
        * @method remove
        * @param {id} cid - cid of item to remove
        * @return {variant} item if it exists, undefined otw.
        */
        remove: function( cid ) {
            var item = this.get( cid );
            
            if( item ) {
                /**
                * Triggered before remove happens.
                * @event onBeforeRemove
                * @param {object} data - data field passed.
                * @param {CollectionHash} data.collection - collection causing event.
                * @param {variant} data.item - item removed
                */
                this.triggerEvent( {
                    collection: this,
                    item: item,
                    cid: cid,
                    type: 'onBeforeRemove'
                } );
                AFrame.remove( this.hash, cid );
                /**
                * Triggered after remove happens.
                * @event onRemove
                * @param {object} data - data has two fields, item and meta.
                * @param {CollectionHash} data.collection - collection causing event.
                * @param {variant} data.item - item removed
                */
                this.triggerEvent(  {
                    collection: this,
                    item: item,
                    cid: cid,
                    type: 'onRemove'
                } );
            }
            
            return item;
        },
        
        /**
        * Insert an item into the hash.  CID is gotten first from the item's cid field.  If this doesn't exist,
        * it is then assigned.  Items with duplicate cids are not allowed, this will cause a 'duplicate cid' 
        * exception to be thrown.  If the item being inserted is an Object and does not already have a cid, the
        * item's cid will be placed on the object under the cid field.
        *
        *    // First item is inserted with a cid
        *    var cid = hash.insert( { cid: 'cid1',
        *                             name: 'AFrame Foundary',
        *                             city: 'London',
        *                             country: 'United Kingdom'
        *                           } );
        *    // cid variable will be 'cid1'
        *
        *    var googleCID = hash.insert( { name: 'Google',
        *                                   city: 'Santa Clara',
        *                                   country: 'United States'
        *                                 } );
        *    // googleCID will be assigned by the system
        *
        * @method insert
        * @param {variant} item - item to insert
        * @return {id} cid of the item.
        */
        insert: function( item ) {
            var cid = item.cid || AFrame.getUniqueID();

            if( 'undefined' != typeof( this.get( cid ) ) ) {
                throw 'duplicate cid';
            }
            
            // store the CID on the item.
            if( item instanceof Object ) {
                item.cid = cid;
            }
            
            
            /**
             * Triggered before insertion happens.
             * @event onBeforeInsert
             * @param {object} data - data has two fields.
             * @param {CollectionHash} data.collection - collection causing event.
             * @param {variant} data.item - item inserted
             */
            this.triggerEvent( {
                collection: this,
                item: item,
                cid: cid,
                type: 'onBeforeInsert'
            } );                
            this.hash[ cid ] = item;
            
            /**
             * Triggered after insertion happens.
             * @event onInsert
             * @param {object} data - data has two fields, item and meta.
             * @param {CollectionHash} data.collection - collection causing event.
             * @param {variant} data.item - item inserted
             */
            this.triggerEvent( {
                collection: this,
                item: item,
                cid: cid,
                type: 'onInsert'
            } );                
            
            return cid;
        },
        
        /**
        * Clear the hash
        *
        *    // remove all items from the hash.
        *    hash.clear();
        *
        * @method clear
        */
        clear: function() {
            for( var cid in this.hash ) {
                this.remove( cid );
            }
        },
        
        /**
        * Get the current count of items
        *
        *    // using hash from top of the page
        *    var count = hash.getCount();
        *
        * @method getCount
        * @return {number} current count
        */
        getCount: function() {
            var count = 0;
            
            for( var cid in this.hash ) {
                count++;
            }
            
            return count;
        },
        
        /**
        * Iterate over the collection, calling a function once for each item in the collection.
        *
        *    // iterate over the collection
        *    collection.forEach( function( item, id ) {
        *        // perform some action on item.
        *    } );
        *
        * @method forEach
        * @param {function} callback - callback to call for each item.  Will be called with two parameters, 
        *   the first is the item, the second the identifier (id type depends on type of collection).
        * @param {object} context - optional context to call callback in.
        */
        forEach: function( callback, context ) {
            var hash = this.hash;
            for( var cid in hash ) {
                callback.call( context, hash[ cid ], cid );
            }
        },
        
        /**
        * Get a set of items in the collection using the search function.  The search function will
        *   be called once for each item in the collection.  Any time the search function returns true,
        *   the item will be added to the results list.
        *
        *    // Filter the collection to find a set of items that have company == 'AFrame Foundary'
        *    var matches = collection.filter( function( item, id, collection ) {
        *        // do search here, returning true if item matches.
        *        return item.company == 'AFrame Foundary';
        *    } );
        *
        * @method filter
        * @param {function} search - the search function
        * @return {array} array of results.  If no results are found, returns an empty array.
        */
        filter: function( search ) {
            var items = [];
            
            this.forEach( function( item, id ) {
                if( true === search( item, id, this ) ) {
                    items.push( item );
                }
            }, this );
            
            return items;
        },
        
        /**
        * Search for the first item in the collection that matches the search function.
        *
        *    // search for the first item with company == 'AFrame Foundary'
        *    var item = collection.search( function( item, id, collection ) {
        *        return item.company == 'AFrame Foundary';
        *    } );
        *
        * @method search
        * @param {function} search - the search function.
        * @return {item} item if an item matches, undefined otw.
        */
        search: function( search ) {
            return this.filter( search )[ 0 ];
        }
    } );

    return CollectionHash;
} )();