function DOMTest( adapter ) {
    var events;
    var DOM = AFrame.DOM;
    
    var genericHandler = function( event ) {
        events[ event.type ] = event;
    };
    
    return {
        name: "TestCase DOM",
        
        setUp: function() {
            events = {};
        },
        
        tearDown: function() {
        },
        
        testGetElements: function() {
            var elements = DOM.getElements( 'body' );
            
            Assert.areEqual( 1, elements.length, 'getElements returns an array' );
        },
        
        testGetDescendentElements: function() {
            var body = DOM.getElements( 'body' );
            var buttons = DOM.getDescendentElements( '.button', body );
            
            Assert.isNumber( buttons.length, 'getDescendentElements returns an array like object' );
        },

        testGetElementsIncludeRoot: function() {
            var root = DOM.getElements( '.DOMSelection' );
            var divsIncludingRoot = DOM.getElementsIncludeRoot( 'div', root );
            
            Assert.areEqual( 4, divsIncludingRoot.length, 'getElementsIncludeRoot gets the correct number of elements' );
        },
        
        testBindEvent: function() {
            DOM.bindEvent( '.DOMSelection', 'click', genericHandler );
            
            $( '.DOMSelection' ).trigger( 'click' );
            
            Assert.isObject( events.click, 'bindEvent is working right' );
        },
        
        testUnbindEvent: function() {
            DOM.unbindEvent( '.DOMSelection', 'click', genericHandler );
            
            $( '.DOMSelection' ).trigger( 'click' );
            
            Assert.isUndefined( events.click, 'unbindEvent is working right' );
        },
        
        testFireEvent: function() {
            DOM.bindEvent( '.DOMSelection', 'click', genericHandler );
            
            DOM.fireEvent( '.DOMSelection', 'click' );
            Assert.isObject( events.click, 'fireEvent is working right' );

            DOM.unbindEvent( '.DOMSelection', 'click', genericHandler );
        },
        
        testSetInnerInput: function() {
            DOM.setInner( '#validationField', 'test element value' );
            
            Assert.areEqual( 'test element value', $( '#validationField' ).val(), 'setInner working on input' );
        },
        
        testSetInnerNonInput: function() {
            DOM.setInner( '#testSetInnerNonInput', 'test element value' );
            
            Assert.areEqual( 'test element value', $( '#testSetInnerNonInput' ).html(), 'setInner working on div' );
        },
        
        testGetInnerInput: function() {
            DOM.setInner( '#validationField', 'test element value' );
            
            Assert.areEqual( 'test element value', DOM.getInner( '#validationField' ), 'getInner working on input' );
        },
        
        testGetInnerNonInput: function() {
            DOM.setInner( '#testSetInnerNonInput', 'test element value' );
            
            Assert.areEqual( 'test element value', DOM.getInner( '#testSetInnerNonInput' ), 'getInner working on div' );
        },
        
        testSetAttr: function() {
            DOM.setAttr( '#testSetInnerNonInput', 'data-attr', 'test attr' );
            
            Assert.areEqual( 'test attr', $( '#testSetInnerNonInput' ).attr( 'data-attr' ), 'setAttr working' );
        },
        
        testGetAttr: function() {
            DOM.setAttr( '#testSetInnerNonInput', 'data-attr', 'test attr' );
            
            Assert.areEqual( 'test attr', DOM.getAttr( '#testSetInnerNonInput', 'data-attr' ), 'getAttr working' );
        },
        
        testHasAttr: function() {
            Assert.isTrue( DOM.hasAttr( '#testSetInnerNonInput', 'data-attr' ), 'hasAttr working with element with attribute' );
            Assert.isFalse( DOM.hasAttr( '#validationField', 'data-attr' ), 'hasAttr working with element without attribute' );
        },
        
        testAddClass: function() {
            DOM.addClass( '#testSetInnerNonInput', 'testClass' );
            
            Assert.isTrue( $( '#testSetInnerNonInput' ).hasClass( 'testClass' ), 'addClass is working' );
        },
        
        testRemoveClass: function() {
            DOM.addClass( '#testSetInnerNonInput', 'testClass' );
            DOM.removeClass( '#testSetInnerNonInput', 'testClass' );
            
            Assert.isFalse( $( '#testSetInnerNonInput' ).hasClass( 'testClass' ), 'removeClass is working' );
        },

        testHasClass: function() {
            DOM.addClass( '#testSetInnerNonInput', 'testClass' );
            Assert.isTrue( DOM.hasClass( '#testSetInnerNonInput', 'testClass' ), 'hasClass is working when class exists' );

            DOM.removeClass( '#testSetInnerNonInput', 'testClass' );
            Assert.isFalse( DOM.hasClass( '#testSetInnerNonInput', 'testClass' ), 'hasClass is working when no class' );
        }
    };
}
testsToRun.push( DOMTest( AFrame.DOM ) );