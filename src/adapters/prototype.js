/**
* A DOM Manipulation adapter for Prototype.
* @class AFrame.DOM
* @static
*/
AFrame.DOM = ( function() {
    
    var getRoot = function( selector ) {
        return AFrame.DOM.getElements( selector )[ 0 ];
    };
    
    var collectionOp = function( selector, opName ) {
        var elements = DOM.getElements( selector );
        var args = Array.prototype.slice.call( arguments, 2 );
        
        for( var index = 0, element; element = elements[ index ]; ++index ) {
            element[ opName ].apply( element, args );
        }
    };
    
    var DOM = {
        /**
        * Get a set of elements that match the selector
        * @method getElements
        * @param {selector || element} selector - if a string, a selector to search for.
        * @return {array} array of elements
        */
        getElements: function( selector ) {
            if( AFrame.array( selector ) ) {
                return selector;
            }
            else if( selector instanceof Element ) {
                return [ selector ];
            }
            return $$( selector );
        },
        
        /**
        * Get a set of descendent elements that match the selector
        * @method getDescendentElements
        * @param {string} selector - The selector to search for.
        * @param {element} root - root node to search from
        * @return {array} array of elements
        */
        getDescendentElements: function( selector, root ) {
            root = getRoot( root );
            return root && root.select( selector );
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
            root = getRoot( root );
            var set = DOM.getDescendentElements( selector, root );
            if( root.match( selector ) ) {
                set = [ root ].concat( set );
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
            return getRoot( selector ).childElements();
        },
        
        /**
        * Get the nth child element
        * @method getNthChild
        * @param {selector || element} selector - element to get children for
        * @param {number} index - index of the child to get
        * @return {element} the nth child if it exists.
        */
        getNthChild: function( selector, index ) {
            return DOM.getChildren( selector )[ index ];
        },
        
        /**
        * Iterate over a set of elements
        * @method forEach
        * @param {Elements} elements - elements to iterate over
        * @param {function} callback - callback to call.  Callback called with: callback( element, index );
        * @param {context} context - context to callback in
        */        
        forEach: function( elements, callback, context ) {
            elements = DOM.getElements( elements );
            for( var index = 0, element; element = elements[ index ]; ++index ) {
                callback.call( context, element, index );
            }
        },
        
        /**
        * Remove an element
        * @method removeElement
        * @param {selector || element} selector - element to remove
        */
        removeElement: function( selector ) {
            collectionOp( selector, 'remove' );
        },
        
        /**
        * Bind to an elements DOM Event
        * @method bindEvent
        * @param {selector || element} selector to bind on
        * @param {string} eventName - name of event
        * @param {function} callback - callback to call
        */
        bindEvent: function( selector, eventName, callback ) {
            collectionOp( selector, 'observe', eventName, callback );
        },
        
        /**
        * Unbind an already bound DOM Event from an element.
        * @method unbindEvent
        * @param {selector || element} selector to unbind from
        * @param {string} eventName - name of event
        * @param {function} callback - callback
        */
        unbindEvent: function( selector, eventName, callback ) {
            collectionOp( selector, 'stopObserving', eventName, callback );
        },        
        /**
        * Fire a DOM event on an element
        * @method fireEvent
        * @param {selector || element} selector
        * @param {string} eventName - event to fire
        */
        fireEvent: function( selector, eventName ) {
            var elements = DOM.getElements( selector );
            for( var index = 0, element; element = elements[ index ]; ++index ) {
                dispatch( element );
            }
            
            function dispatch( element ) {
                var evt;
                
                if ( document.createEventObject ){
                    // IE
                    evt = document.createEventObject();
                    evt.target = element;
                }
                else {
                    // w3c
                    evt = document.createEvent("HTMLEvents");
                    evt.initEvent( eventName, true, true );
                }

                if( !evt.isDefaultPrevented ) {
                    evt._preventDefault = evt.preventDefault;
                    evt.preventDefault = function() {
                        this.__defaultPrevented = true;
                        this._preventDefault && this._preventDefault();
                    };
                    
                    evt.isDefaultPrevented = function() {
                        return !!this.__defaultPrevented;
                    };
                }
            
                
                if ( document.createEventObject ) {
                    return element.fireEvent( 'on'+event, evt );
                }
                else {
                    return !element.dispatchEvent(evt);
                }            
            }
        },
        
        /**
        * Set the inner value of an element, including input elements
        * @method setInner
        * @param {selector || element} selector - element to set
        * @param {string} value - value to set
        */
        setInner: function( selector, value ) {
            var elements = DOM.getElements( selector );
            elements.each( function( element, index ) {
                if( isValBased( element ) ) {
                    element.value = value;
                }
                else {
                    element.update( value );
                }
            } );
        },
        
        /**
        * Get the inner value of an element, including input elements
        * @method getInner
        * @param {selector || element} selector
        * @return {string} inner value of the element
        */
        getInner: function( selector ) {
            var target = getRoot( selector );
            if( isValBased( target ) ) {
                return target.value;
            }
            else {
                return target.innerHTML;
            }
        },
        
        /**
        * Set an element's attribute.
        * @method setAttr
        * @param {selector || element} element
        * @param {string} attrName - the attribute name
        * @param {string} value - value to set
        */
        setAttr: function( selector, attrName, value ) {
            collectionOp( selector, 'writeAttribute', attrName, value );
        },
        
        /**
        * Get an element's attribute.
        * @method getAttr
        * @param {selector || element} selector
        * @param {string} attrName - the attribute name
        * @return {string} attribute's value
        */
        getAttr: function( selector, attrName ) {
            var target = getRoot( selector );
            return target.readAttribute( attrName );
        },
        
        /**
        * Check if an element has an attribute
        * @method hasAttr
        * @param {selector || element} selector
        * @param {string} attrName - the attribute name
        * @return {boolean} true if the element has the attribute, false otw.
        */
        hasAttr: function( selector, attrName ) {
            var target = getRoot( selector );
            return target.hasAttribute( attrName );
        },
        
        /**
        * Add a class to an element
        * @method addClass
        * @param {selector || element} element
        * @param {string} className
        */
        addClass: function( selector, className ) {
            collectionOp( selector, 'addClassName', className );
        },
        
        /**
        * Remove a class from an element
        * @method removeClass
        * @param {selector || element} element
        * @param {string} className
        */
        removeClass: function( selector, className ) {
            collectionOp( selector, 'removeClassName', className );
        },
        
        /**
        * Check if an element has a class
        * @method hasClass
        * @param {selector || element} element
        * @param {string} className
        * @return {boolean} true if element has class, false otw.
        */
        hasClass: function( selector, className ) {
            var target = getRoot( selector );
            return target.hasClassName( className );
        },
        
        /**
        * Create an element
        * @method createElement
        * @param {string} type - element type
        * @param {string} html (optional) - inner HTML
        * @return {element} created element
        */
        createElement: function( type, html ) {
            var element = new Element( type );
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
            getRoot( elementToAppendTo ).insert( {
                bottom: getRoot( elementToInsert )
            } );
        },
        
        /**
        * Insert an element before another element
        * @method insertBefore
        * @param {selector || element} elementToInsert
        * @param {selector || element} elementToInsertBefore
        */
        insertBefore: function( elementToInsert, elementToInsertBefore ) {
            getRoot( elementToInsertBefore ).insert( {
                before: getRoot( elementToInsert )
            } );
        },
        
        /**
        * Insert as the nth child of an element
        * @method insertAsNthChild
        * @param {selector || element} elementToInsert
        * @param {selector || element} parent
        * @param {number} index
        */
        insertAsNthChild: function( elementToInsert, parent, index ) {
            var children = DOM.getChildren( parent );
            if( index === children.length ) {
                this.appendTo( elementToInsert, parent );
            }
            else {
                var insertBefore = children[ index ];
                this.insertBefore( elementToInsert, insertBefore );
            }
        
        }
        
        
    };
    
    function isValBased( target ) {
        return target.match( 'input' );
    }
    
    return DOM;
}() );