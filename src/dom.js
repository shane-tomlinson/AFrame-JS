/**
* A DOM Manipulation adapter.  DOM functionality is being ported over to use this instead
*   of direct jQuery access so that we can write adapters for Mootools, YUI, etc.
* @class AFrame.DOM
* @static
*/
AFrame.DOM = ( function() {
    var DOM = {
        /**
        * Get a set of elements that match the selector
        * @method getElements
        * @param {selector || element} selector - if a string, a selector to search for.
        * @return {array} array of elements
        */
        getElements: function( selector ) {
            return $( selector );
        },
        
        /**
        * Get a set of descendent elements that match the selector
        * @method getDescendentElements
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getDescendentElements: function( selector, root ) {
            return $( root ).find( selector );
        },
        
        /**
        * Get a set of descendent elements that match the selector, include the root node if it
        *   matches the selector
        * @method getElementsIncludeRoot
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getElementsIncludeRoot: function( selector, root ) {
            root = $( root );
            var set = root.find( selector );
            if( root.is( selector ) ) {
                set = root.add( set );
            }
            return set;
        },
        
        /**
        * Get the children for an element
        * @method getChildren
        * @param {selector || element} selector - element to get children for
        * @return {array} an array of children
        */
        getChildren: function( selector ) {
            return $( selector ).children();
        },
        
        /**
        * Get the nth child element
        * @method getNthChild
        * @param {selector || element} selector - element to get children for
        * @param {number} index - index of the child to get
        * @return {element} the nth child if it exists.
        */
        getNthChild: function( selector, index ) {
            return $( selector ).children()[ index ];
        },
        
        /**
        * Remove an element
        * @method removeElement
        * @param {selector || element} selector - element to remove
        */
        removeElement: function( selector ) {
            $( selector ).remove();
        },
        
        /**
        * Bind to an elements DOM Event
        * @method bindEvent
        * @param {selector || element} element to bind on
        * @param {string} eventName - name of event
        * @param {function} callback - callback to call
        */
        bindEvent: function( element, eventName, callback ) {
            return $( element ).bind( eventName, callback );
        },
        
        /**
        * Unbind an already bound DOM Event from an element.
        * @method unbindEvent
        * @param {selector || element} element to unbind from
        * @param {string} eventName - name of event
        * @param {function} callback - callback
        */
        unbindEvent: function( element, eventName, callback ) {
            return $( element ).unbind( eventName, callback );
        },
        
        /**
        * Fire a DOM event on an element
        * @method fireEvent
        * @param {selector || element} element
        * @param {string || event object} event - event to fire
        */
        fireEvent: function( element, event ) {
            return $( element ).trigger( event );
        },
        
        /**
        * Set the inner value of an element, including input elements
        * @method setInner
        * @param {selector || element} element - element to set
        * @param {string} value - value to set
        */
        setInner: function( element, value ) {
            var target = $( element );
            if( isValBased( target ) ) {
                target.val( value );
            }
            else {
                target.html( value );
            }

        },
        
        /**
        * Get the inner value of an element, including input elements
        * @method getInner
        * @param {selector || element} element
        * @return {string} inner value of the element
        */
        getInner: function( element ) {
            var target = $( element );
            var retval = '';
            
            if( isValBased( target ) ) {
                retval = target.val();
            }
            else {
                retval = target.html();
            }
            return retval;
        },
        
        /**
        * Set an element's attribute.
        * @method setAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @param {string} value - value to set
        */
        setAttr: function( element, attrName, value ) {
            $( element ).attr( attrName, value );
        },
        
        /**
        * Get an element's attribute.
        * @method getAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @return {string} attribute's value
        */
        getAttr: function( element, attrName ) {
            return $( element ).attr( attrName );
        },
        
        /**
        * Check if an element has an attribute
        * @method hasAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @return {boolean} true if the element has the attribute, false otw.
        */
        hasAttr: function( element, attrName ) {
            var val = $( element )[ 0 ].getAttribute( attrName );
            return val !== null;
        },
        
        /**
        * Add a class to an element
        * @method addClass
        * @param {selector || element} element
        * @param {string} className
        */
        addClass: function( element, className ) {
            $( element ).addClass( className );
        },
        
        /**
        * Remove a class from an element
        * @method removeClass
        * @param {selector || element} element
        * @param {string} className
        */
        removeClass: function( element, className ) {
            $( element ).removeClass( className );
        },
        
        /**
        * Check if an element has a class
        * @method hasClass
        * @param {selector || element} element
        * @param {string} className
        * @return {boolean} true if element has class, false otw.
        */
        hasClass: function( element, className ) {
            return $( element ).hasClass( className );
        },
        
        /**
        * Create an element
        * @method createElement
        * @param {string} type - element type
        * @param {string} html (optional) - inner HTML
        * @return {element} created element
        */
        createElement: function( type, html ) {
            var element = $( '<' + type + '/>' );
            if( html ) {
                AFrame.DOM.setInner( element, html );
            }
            return element;
        },
      
        /**
        * Append an element as the last child of another element
        * @method appendTo
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToAppendTo
        */
        appendTo: function( elementToInsert, elementToAppendTo ) {
            $( elementToInsert ).appendTo( $( elementToAppendTo ) );
        },
        
        /**
        * Insert an element before another element
        * @method insertBefore
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToInsertBefore
        */
        insertBefore: function( elementToInsert, elementToInsertBefore ) {
            $( elementToInsert ).insertBefore( elementToInsertBefore );
        },
        
        /**
        * Insert as the nth child of an element
        * @method insertAsNthChild
        * @param {selector || element} elementToInsert
        * @param {selector || element} parent
        * @param {number} index
        */
        insertAsNthChild: function( elementToInsert, parent, index ) {
            var children = $( parent ).children();
            if( index === children.length ) {
                elementToInsert.appendTo( parent );
            }
            else {
                var insertBefore = children.eq( index );
                elementToInsert.insertBefore( insertBefore );
            }
        
        }
        
        
    };
    
    function isValBased( target ) {
        return target.is( 'input' ) || target.is( 'textarea' );
    }
    
    return DOM;
}() );