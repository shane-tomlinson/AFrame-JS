/**
* A decorator on a [Field](AFrame.Field.html) that takes care of displaying placeholder text if the browser does not 
*   natively support this feature.  This class never needs called directly and will be automatically
*   attached to the [Field](AFrame.Field.html) if the behavior is needed.  For browsers that do
*   not support placeholder text natively, the decorator will come into play to add it.  The idea
*   of placeholder text is if the field has no value displayed, but the element has text in its 
*   placeholder attribute, the text will be displayed until either a value is entered or the user
*   places the mouse into the input.  If the user still has not entered text whenever the element
*   loses focus, the placeholder text is again displayed.  Any element that has its placeholder text
*   shown will have the "empty" class attached.  Note, in CSS, this is different to the :empty class
*   which the browser can natively add.
*
*#Example of Using Placeholder Text#
*
*     <input type="text" data-field name="username" placeholder="Log in name" />
*
* @class Placeholder
* @static
*/
AFrame.FieldPluginPlaceholder = ( function() {
    var Placeholder = {
        init: function() {
            this.decorators = {};
            
            // All functions are called as if they were on the Field.  We are overriding init, bindEvents,
            // set, display, and save.  These functions pertain to our handling of the placeholder text.
            decorate( 'init', decoratorInit );
            decorate( 'bindEvents', decoratorBindEvents );
            decorate( 'get', decoratorGet );
            decorate( 'getDisplayed', decoratorGetDisplayed );
            decorate( 'save', decoratorSave );
            decorate( 'display', decoratorDisplay );
        }
    };
    
    function decorate( name, decorator ) {
        var decorated = AFrame.Field.prototype;
        
        Placeholder[ '_' + name ] = decorated[ name ];
        decorated[ name ] = decorator;
    }

    function decoratorInit( config ) {
        Placeholder._init.call( this, config );
        
        // display the placeholder text until the value is set.
        this.display( this.getDisplayed() );
    }
    
    function decoratorBindEvents() {
        var target = this.getTarget();
        
        // we care about the focus and blur evnts.
        this.bindDOMEvent( target, 'focus', onFieldFocus );
        this.bindDOMEvent( target, 'blur', onFieldBlur );

        Placeholder._bindEvents.call( this );
    }

    function decoratorGet() {
        var placeholder = getPlaceholder.call( this );
        var val = Placeholder._get.call( this );

        if( val === placeholder ) {
            var undefined;
            val = undefined;
        }
        
        return val;
    }

    function decoratorGetDisplayed() {
        var placeholder = getPlaceholder.call( this );
        var val = Placeholder._getDisplayed.call( this );

        if( val === placeholder ) {
            val = '';
        }
        
        return val;
    }

    function decoratorDisplay( val ) {
        Placeholder._display.call( this, val );
        updatePlaceholder.call( this );
    }
    
    function decoratorSave() {
        var placeholder = getPlaceholder.call( this );
        
        var placeHolderDisplayed = this.getDisplayed() == placeholder;
        
        if( placeHolderDisplayed ) {
            this.display( '' );
        }
        
        Placeholder._save.call( this );

        if( placeHolderDisplayed ) {
            this.display( placeholder );
        }
    }
    
    function onFieldFocus() {
        this.focused = true;
        updatePlaceholder.call( this );
    }
    
    function onFieldBlur() {
        this.focused = false;
        updatePlaceholder.call( this );
    }
    
    function updatePlaceholder() {
        var placeholder = getPlaceholder.call( this );
        var displayed = Placeholder._getDisplayed.call( this );

        var target = this.getTarget();
        AFrame.DOM.removeClass( target, 'empty' );
        
        if( this.focused ) {
            if( placeholder == displayed ) {
                Placeholder._display.call( this, '' );
            }
        }
        else if( '' === Placeholder._getDisplayed.call( this ) ) {
            AFrame.DOM.addClass( target, 'empty' );
            
            Placeholder._display.call( this, getPlaceholder.call( this ) );
        }
    }
    
    function getPlaceholder() {
        var target = this.getTarget();
        return AFrame.DOM.getAttr( target, 'placeholder' ) || '';
    }    

    // we only want to initialize the Placeholder if the browser does not support HTML5
    var inp = document.createElement( 'input' );
    if( !( 'placeholder' in inp ) ) {
        Placeholder.init();
    }

    return Placeholder;
}() );

