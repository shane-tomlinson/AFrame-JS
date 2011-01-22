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
* @class AFrame.FieldPlaceholderDecorator
* @static
*/
AFrame.FieldPlaceholderDecorator = {
    init: function() {
        var decorated = AFrame.Field.prototype;

        this.decorators = {};
        
        // All functions are called as if they were on the Field.  We are overriding init, bindEvents,
        // set, display, and save.  These functions pertain to our handling of the placeholder text.
        this.decorate( 'init', this.decoratorInit );
        this.decorate( 'bindEvents', this.decoratorBindEvents );
        this.decorate( 'set', this.decoratorSet );
        this.decorate( 'save', this.decoratorSave );
        this.decorate( 'display', this.decoratorDisplay );
    },
    
    decorate: function( name, decorator ) {
        var decorated = AFrame.Field.prototype;
        
        this[ '_' + name ] = decorated[ name ];
        decorated[ name ] = decorator;
    },

    decoratorInit: function( config ) {
        AFrame.FieldPlaceholderDecorator._init.call( this, config );
        
        // display the placeholder text until the value is set.
        this.display( AFrame.FieldPlaceholderDecorator.getPlaceholder.call( this ) );
    },
    
    decoratorBindEvents: function() {
        var target = this.getTarget();
        
        // we care about the focus and blur evnts.
        this.bindDOMEvent( target, 'focus', AFrame.FieldPlaceholderDecorator.onFieldFocus, this );
        this.bindDOMEvent( target, 'blur', AFrame.FieldPlaceholderDecorator.onFieldBlur, this );

        AFrame.FieldPlaceholderDecorator._bindEvents.call( this );
    },
    
    decoratorSet: function( val ) {
        val = val || AFrame.FieldPlaceholderDecorator.getPlaceholder.call( this );
        AFrame.FieldPlaceholderDecorator._set.call( this, val );
    },

    decoratorDisplay: function( val ) {
        var target = this.getTarget();
        var func = val == AFrame.FieldPlaceholderDecorator.getPlaceholder.call( this ) ? 'addClass' : 'removeClass';
        AFrame.DOM[ func ](target, 'empty' );

        AFrame.FieldPlaceholderDecorator._display.call( this, val );
    },
    
    decoratorSave: function() {
        var placeholder = AFrame.FieldPlaceholderDecorator.getPlaceholder.call( this );
        
        var placeHolderDisplayed = this.getDisplayed() == placeholder;
        
        if( placeHolderDisplayed ) {
            this.display( '' );
        }
        
        AFrame.FieldPlaceholderDecorator._save.call( this );

        if( placeHolderDisplayed ) {
            this.display( placeholder );
        }
    },
    
    onFieldFocus: function() {
        if( this.getDisplayed() == AFrame.FieldPlaceholderDecorator.getPlaceholder.call( this ) ) {
            this.display( '' );
        }
    },
    
    onFieldBlur: function() {
        if( '' === this.getDisplayed() ) {
            this.display( AFrame.FieldPlaceholderDecorator.getPlaceholder.call( this ) );
        }
    },
    
    getPlaceholder: function() {
        var target = this.getTarget();
        return AFrame.DOM.getAttr( target, 'placeholder' ) || '';
    }

    
};


(function() {
    // we only want to initialize the FieldPlaceholderDecorator if the browser does not support HTML5
    var inp = document.createElement( 'input' );
    if( !( 'placeholder' in inp ) ) {
        AFrame.FieldPlaceholderDecorator.init();
    }
    
})();

