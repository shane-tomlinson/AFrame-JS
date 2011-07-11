/**
 * A generic HTML list class.  A list is any list of data.  A List shares the
 * majority of its interface with a 
 * <a href="AFrame.CollectionArray.html">CollectionArray</a> since lists are 
 * inherently ordered (even if they are ULs).  There are two methods for 
 * inserting an item into the list, either passing an already created element to
 * [insertElement](#method_insertElement) or by passing data to 
 * [insert](#method_insert). If using insert, a factory function 
 * (renderItem) must be specified in the configuration. The factory 
 * function can either create an element directly or use some sort of 
 * prototyping system to create the element.  The factory function must return
 * the element to be inserted.
 *
 *
 *    <ul id="clientList">
 *    </ul>
 *
 *    ---------
 *    // Set up a factory to create list elements.  This can create the elements
 *    // directly or use sort of templating system.
 *    var factory = function( data, index ) {
 *       var listItem = AFrame.DOM.createElement( 'li', data.name + ', ' 
 *          + data.employer );
 *       return listItem;
 *    };
 *
 *    var list = AFrame.List.create( {
 *        target: '#clientList',
 *        renderItem: factory
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
 *    list.insertRow( AFrame.DOM.createElement( 'li', 'Joe Smith, the Coffee' +
 *      ' Shop' ), 0 );
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
 * A function to call to create a list element.  function will be called with 
 * two parameters, an data and index. If not specified, then the internal 
 * factory that returns an empty LI element will be used.  See
 *  [renderItem](#method_renderItem).
 * @config renderItem
 * @type {function} (optional)
 * @default this.renderItem
 */
AFrame.List = ( function() {
    "use strict";

    var List = AFrame.Display.extend( AFrame.ArrayCommonFuncsMixin, 
        AFrame.EnumerableMixin, {
        init: function( config ) {
            var me=this;
            me.renderItem = config.renderItem 
                || me.renderItem;

            List.sc.init.call( me, config );
        },

        /**
         * Clear the list
         * @method clear
         */
        clear: function() {
            AFrame.DOM.setInner( this.getTarget(), '' );
        },

        /**
        * The factory used to create list elements.
        *
        *    // overriden renderItem
        *    renderItem: function( data, index ) {
        *       var listItem = AFrame.DOM.createElement( 'li', data.name 
        *           + ', ' + data.employer );
        *       return listItem;
        *    }
        *
        * @method renderItem
        * @param {object} data - data used on insert
        * @param {number} index - index where item should be inserted
        * @return {Element} element to insert
        */
        renderItem: function() {
            return AFrame.DOM.createElement( 'li' );
        },

        /**
         * Insert a data item into the list, the list item is created
         *  using the renderItem.
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
            var me=this;
            index = me.getActualInsertIndex( index );

            var rowElement = me.renderItem( data, index );
            index = me.insertElement( rowElement, index );

            /**
            * Triggered whenever a row is inserted into the list
            * @event onInsert
            * @param {object} options - information about the insert
            * @param {element} options.rowElement - row's element
            * @param {object} options.data - data that was inserted
            * @param {object} options.index - index where row was inserted
            */
            trigger( me, 'onInsert', rowElement, index, data );

            return index;
        },

        /**
         * Insert an element into the list.
         *
         *    // Item is inserted at index 0, the first item in the list.
         *    list.insertElement( AFrame.DOM.createElement( 'li', 'Shane '
         *      + 'Tomlinson, AFrame Foundary' ), 0 );
         *
         * @method insertElement
         * @param {element} rowElement - element to insert
         * @param {number} index (optional) - index where to insert element.
         * If index > current highest index, inserts at end.
         * 	If index is negative, item is inserted from end.  -1 is at the end.
         * @return {number} index - the index the item is inserted at.
         */
        insertElement: function( rowElement, index ) {
            var me=this,
                target = me.getTarget();

            index = me.getActualInsertIndex( index );
            AFrame.DOM.insertAsNthChild( rowElement, target, index );

            /**
            * Triggered whenever an element is inserted into the list
            * @event onInsertElement
            * @param {object} options - information about the insert
            * @param {element} options.rowElement - row's element
            * @param {object} options.index - index where row was inserted
            */

            trigger( me, 'onInsertElement', rowElement, index );

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
            var me=this,
                removeIndex = me.getActualIndex( index ),
                rowElement = AFrame.DOM.getNthChild( me.getTarget(), removeIndex );
            AFrame.DOM.removeElement( rowElement );

            /**
            * Triggered whenever an element is removed from the list
            * @event onRemoveElement
            * @param {object} options - information about the insert
            * @param {element} options.rowElement - row's element
            * @param {object} options.index - index where row was inserted
            */

            trigger( me, 'onRemoveElement', rowElement, index );
        },

        /**
        * Call a callback for each element in the list.  The callback will be called
        * with the rowElement and the index
        * @method forEach
        * @param {function} callback - callback to call
        * @param {object} context (optional) - context to call the callback in
        */
        forEach: function( callback, context ) {
            var children = AFrame.DOM.getChildren( this.getTarget() );
            AFrame.DOM.forEach( children, callback, context );
        }
    } );

    function trigger( me, message, rowElement, index, data ) {
        me.triggerEvent( {
            rowElement: rowElement,
            index: index,
            data: data,
            type: message 
        } );
    } 

    return List;
} )();
