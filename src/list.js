/**
 * A generic HTML list class.  A list is any list of data.  A List shares
 *  the majority of its interface with a <a href="docs/AFrame.CollectionArray.html">CollectionArray</a> 
 *  since lists are inherently ordered (even if they are ULs).  There are two methods
 *  for inserting an item into the list, either passing an already created
 *  element to [insertElement](#method_insertElement) or by passing data to [insert](#method_insert). 
 *  If using insert, a factory function (listElementFactory) must be specified in the configuration.
 *  The factory function can either create an element directly or use some sort of prototyping system
 *  to create the element.  The factory function must return the element to be inserted.
 *
 * 
 *    <ul id="clientList">
 *    </ul>
 *   
 *    ---------
 *    // Set up a factory to create list elements.  This can create the elements 
 *    // directly or use sort of templating system.
 *    var factory = function( index, data ) {
 *       var listItem = $( '<li>' + data.name + ', ' + data.employer + '</li>' );
 *       return listItem;
 *    };
 *   
 *    var list = AFrame.construct( {
 *       type: AFrame.List,
 *       config: {
 *           target: '#clientList',
 *           listElementFactory: factory
 *       }
 *    } );
 *   
 *    // Creates a list item using the factory function, item is inserted
*     // at the end of the list
 *    list.insert( {
 *       name: 'Shane Tomlinson',
 *       employer: 'AFrame Foundary'
 *    } );
 *   
 *    // Inserts a pre-made list item at the head of the list
 *    list.insertRow( $( '<li>Joe Smith, the Coffee Shop</li>' ), 0 );
 *    ---------
 *
 *    <ul id="clientList">
 *       <li>Joe Smith, The Coffee Shop</li>
 *       <li>Shane Tomlinson, AFrame Foundary</li>
 *    </ul>
 *
 * @class AFrame.List
 * @extends AFrame.Display
 * @uses AFrame.ArrayCommonFuncsMixin
 * @uses AFrame.EnumerableMixin
 * @constructor
 */
/**
 * A function to call to create a list element.  function will be called with two parameters, an data and index.  
 *  If not specified, then the internal factory that returns an empty LI element will be used.  See 
 *  [listElementFactory](#method_listElementFactory).
 * @config listElementFactory
 * @type {function} (optional)
 * @default this.listElementFactory
 */
AFrame.List = ( function() {
    "use strict";
    
    var List = function() {
        List.sc.constructor.apply( this, arguments );
    };
    AFrame.extend( List, AFrame.Display, AFrame.ArrayCommonFuncsMixin, AFrame.EnumerableMixin, {
        init: function( config ) {
            if( config.listElementFactory ) {
                this.listElementFactory = config.listElementFactory;
            }
            
            List.sc.init.apply( this, arguments );
        },

        /**
         * Clear the list
         * @method clear
         */
        clear: function() {
            this.getTarget().html( '' );
        },
        
        /**
        * The factory used to create list elements.
        *
        *    // overriden listElementFactory
        *    listElementFactory: function( index, data ) {
        *       var listItem = $( '<li>' + data.name + ', ' + data.employer + '</li>' );
        *       return listItem;
        *    }
        *
        * @method listElementFactory
        * @param {object} data - data used on insert
        * @param {number} index - index where item should be inserted
        * @return {Element} element to insert
        */
        listElementFactory: function() {
            return $( '<li />' );
        },
        
        /**
         * Insert a data item into the list, the list item is created 
         *  using the listElementFactory.
         *
         *   
         *    // Creates a list item using the factory function, 
         *    // item is inserted at the end of the list.
         *    list.insert( {
         *       name: 'Shane Tomlinson',
         *       employer: 'AFrame Foundary'
         *    } );
         *   
         *   
         *    // Item is inserted at index 0, the first item in the list.
         *    list.insert( {
         *       name: 'Shane Tomlinson',
         *       employer: 'AFrame Foundary'
         *    }, 0 );
         *   
         *    // Item is inserted at the end of the list
         *    list.insert( {
         *       name: 'Shane Tomlinson',
         *       employer: 'AFrame Foundary'
         *    }, -1 );
         *   
         *    // Item is inserted two from the end
         *    list.insert( {
         *       name: 'Shane Tomlinson',
         *       employer: 'AFrame Foundary'
         *    }, -2 );
         *   
         * @method insert
         * @param {object} data - data to use for list item
         * @param {number} index (optional) - index to insert at
         * If index > current highest index, inserts at end.
         * 	If index is negative, item is inserted from end.
         * 	-1 is at the end.  If not given, inserts at end.
         * @return {number} index the item is inserted at.
         */
        insert: function( data, index ) {
            index = this.getActualInsertIndex( index );

            var rowElement = this.listElementFactory( data, index );
            index = this.insertElement( rowElement, index );
            
            /**
            * Triggered whenever a row is inserted into the list
            * @event onInsert
            * @param {element} rowElement - the row's list element
            * @param {object} options - information about the insert
            * @param {element} options.rowElement - row's element
            * @param {object} options.data - data that was inserted
            * @param {object} options.index - index where row was inserted
            */
            this.triggerEvent( {
                rowElement: rowElement,
                index: index,
                data: data,
                type: 'onInsert'
            } );

            return index;
        },

        /**
         * Insert an element into the list.
         *   
         *    // Item is inserted at index 0, the first item in the list.
         *    list.insertElement( $( '<li>Shane Tomlinson, AFrame Foundary</li>' ), 0 );
         *   
         * @method insertElement
         * @param {element} rowElement - element to insert
         * @param {number} index (optional) - index where to insert element.
         * If index > current highest index, inserts at end.
         * 	If index is negative, item is inserted from end.  -1 is at the end.
         * @return {number} index - the index the item is inserted at.
         */
        insertElement: function( rowElement, index ) {
            var target = this.getTarget();
            var children = target.children();
            
            index = this.getActualInsertIndex( index );
            if( index === children.length ) {
                target.append( rowElement );
            }
            else {
                var insertBefore = children.eq( index );
                rowElement.insertBefore( insertBefore );
            }

            /**
            * Triggered whenever an element is inserted into the list
            * @event onInsertElement
            * @param {object} options - information about the insert
            * @param {element} options.rowElement - row's element
            * @param {object} options.index - index where row was inserted
            */
            
            this.triggerEvent( {
                rowElement: rowElement,
                index: index,
                type: 'onInsertElement'
            } );
            
            return index;
        },

        /**
         * Remove an item from the list
         *   
         *    // Remove first item in the list.
         *    list.remove( 0 );
         *   
         * @method remove
         * @param {number} index - index of item to remove
         */
        remove: function( index ) {
            var removeIndex = this.getActualIndex( index );
            var rowElement = this.getTarget().children().eq( removeIndex ).remove();
            
            /**
            * Triggered whenever an element is removed from the list
            * @event onRemoveElement
            * @param {object} options - information about the insert
            * @param {element} options.rowElement - row's element
            * @param {object} options.index - index where row was inserted
            */

            this.triggerEvent( {
                rowElement: rowElement,
                index: index,
                type: 'onRemoveElement'
            } );
        },
        
        /**
        * Call a callback for each element in the list.  The callback will be called 
        * with the rowElement and the index
        * @method forEach
        * @param {function} callback - callback to call
        * @param {object} context (optional) - context to call the callback in
        */
        forEach: function( callback, context ) {
            var children = this.getTarget().children();
            children.each( function( index, element ) {
                callback.call( context, element, index );
            } );
        }
    } );
    
    return List;
} )();