/**
* A collection of functions common to enumerable objects.  When mixing in 
* this class, the class being mixed into must define a forEach function.
*
* @class AFrame.EnumerableMixin
* @static
*/
AFrame.EnumerableMixin = ( function() {
    "use strict";
    
    var Mixin = {
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
            
            this.forEach( function( item ) {
                count++;
            } );
            
            return count;
        }
    };
    
    return Mixin;

}() );