/**
 * A plugin that binds a list to a collection.  When the collection is updated, the list
 *  is automatically updated to reflect the change.  List updates occure when 
 *  the collection trigger the onInsert or onRemove events.
 * This plugin adds <a href="#method_getIndex">getIndex</a> to the plugged list.
 *
 *
 *    <ul id="clientList">
 *    </ul>
 *   
 *    ---------
 *    // A List with the same results as the previous example is 
 *    //    the expected result
 *   
 *    // First we need to set up the collection
 *    var collection = AFrame.construct( {
 *       type: AFrame.CollectionArray
 *    } );
 *   
 *   
 *    var factory = function( index, data ) {
 *       var listItem = AFrame.DOM.createElement( 'li', 'data.name + ', ' + data.employer );
 *       return listItem;
 *    };
 *
 *    // Sets up our list with the ListPluginBindToCollection.  Notice the 
 *    //    ListPluginBindToCollection has a collection config parameter.
 *    var list = AFrame.construct( {
 *       type: AFrame.List,
 *       config: {
 *           target: '#clientList',
 *           listElementFactory: factory
 *       },
 *       plugins: [
 *           {
 *               type: AFrame.ListPluginBindToCollection,
 *               config: {
 *                   collection: collection
 *               }
 *           }
 *       ]
 *    } );
 *   
 *    collection.insert( {
 *       name: 'Shane Tomlinson',
 *       employer: 'AFrame Foundary'    
 *    } );
 *   
 *    collection.insert( {
 *       name: 'Joe Smith',
 *       employer: 'The Coffee Shop'    
 *    }, 0 );
 *   
 *    // The same list as in the example above is shown
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Joe Smith, The Coffee Shop</li>
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 *
 *    ----------
 *   
 *    collection.remove( 0 );
 *   
 *    // Joe Smith has been removed
 *   
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 * 
 *
 * @class AFrame.ListPluginBindToCollection
 * @extends AFrame.Plugin
 * @constructor
 */
AFrame.ListPluginBindToCollection = ( function() { 
    "use strict";
    
    var Plugin = function() {
        Plugin.sc.constructor.apply( this, arguments );
    };

    AFrame.extend( Plugin, AFrame.Plugin, {
        init: function( config ) {
            /**
             * The collection to bind to
             * @config collection
             * @type {Collection}
             */
            this.collection = config.collection;
            this.collection.bindEvent( 'onInsert', this.onInsert, this );
            this.collection.bindEvent( 'onRemove', this.onRemove, this );

            this.cids = [];
            
            Plugin.sc.init.apply( this, arguments );
        },
        
        setPlugged: function( plugged ) {
            plugged.getIndex = this.getIndex.bind( this );
            
            Plugin.sc.setPlugged.apply( this, arguments );
        },
        
        onInsert: function( event ) {
            var index = this.getPlugged().insert( event.item, event.index || -1 );

            this.cids.splice( index, 0, event.cid );
        },
        
        onRemove: function( event ) {
            var index = this.cids.indexOf( event.cid );
            
            this.getPlugged().remove( index );
            
            this.cids.splice( index, 1 );
        },
        
        /**
         * Given an index or cid, get the index.
         * @param {number || id} indexCID - either the index or the cid of an item
         * @return {number} index of item
         */
        getIndex: function( indexCID ) {
            var index = indexCID;
            
            if( 'string' == typeof( indexCID ) ) {
                index = this.cids.indexOf( indexCID );
            }
            
            return index;
        }
    } );
    
    return Plugin;
}() );
