$( function() {
    var openExample;
    
    var showExample = function( event ) {
        event.preventDefault();
        event.stopPropagation();
        
        openExample && openExample.fadeOut();
        
        openExample = $( event.currentTarget ).next( '.example' );
        openExample.fadeIn();
    };
    
    var hideOpenExample = function() {
        openExample && openExample.fadeOut();
        openExample = null;
    };
    
    var hideExample = function( event ) {
        event.preventDefault();
        hideOpenExample();
    };
    
    var stopEvent = function( event ) {
        event.preventDefault();
        event.stopPropagation();
    };
    
    $( 'body' ).bind( 'click', hideOpenExample ).bind( 'keyup', function( event ) {
        if( event.which == 27 && openExample ) {
            hideOpenExample();
        }
    } );
    
    var examples = $( 'td.description > pre' );
    examples.each( function( index, item ) {
        var example = $( item );
        var anchor = $( '<a href="#" class="btnSeeExample">See Example</a>' );
        anchor.insertBefore( example );
        
        var container = $( '<div class="example"><h3>Example Usage</h3><a href="#" class="btnClose">Close<a></div>' );
        container.append( example );
        container.insertAfter( anchor );
        
        $( container ).bind( 'click', stopEvent );
        
        $( '.btnClose', container ).bind( 'click', hideExample );
        
        anchor.bind( 'click', showExample );
    } );
    
    /**
    * Remove the code parent and put it directly into the pre so that we can
    *   do code highlighting
    */
    $( 'pre > code' ).each( function( index, element ) {
        element = $( element );
        var parent = element.parent();
        parent.html( element.html() );
    } );
    
    SyntaxHighlighter.defaults['toolbar'] = false;
    SyntaxHighlighter.defaults['gutter'] = false;
    SyntaxHighlighter.all( { brush: 'js' } );     
} );