YUI( { logInclude: { TestRunner: true } } ).use( 'console', 'overlay', 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;
    var TestCase = Y.Test.Case;
    window.Assert = Y.Assert;
    window.Mock = Y.Mock;
    var testCases = [];
    
    testsToRun.forEach( function( testConfig, index ) {
	    var test = new TestCase( testConfig );
        testCases.push( test );
        TestRunner.add( test );
        
        $( '<li><input type="checkbox" value="' + index + '" checked />' + test.name + '</li>' ).appendTo( $( '#testList' ) );
    } );

    //initialize the console
    var yconsole = new Y.Console( {
    	newestOnTop: true
    } );
	yconsole.render( '#log' );

    TestRunner.run();
    
    
    $( '#btnRunTests' ).click( function() {
        TestRunner.clear();
        
        $( 'input[type=checkbox]:checked' ).each( function( index, item ) {
            var index = ~~$( item ).val();
            
            TestRunner.add( testCases[ index ] );
        } );
        
        TestRunner.run();
    } );
    
    $( '#chkAllTests' ).click( function( event ) {
        var checked = $( this ).is( ':checked' );
        
        if( checked ) {
            $( 'input[type=checkbox]' ).attr( 'checked', true );
        }
        else {
            $( 'input[type=checkbox]' ).removeAttr( 'checked' );
        }
    } );
    
    $( 'input[type=checkbox]' ).click( function( event ) {
        var el = $( this );
        if( false == el.is( '#chkAllTests' ) ) {
            var checked = el.is( ':checked' );
            if( false == checked ) {
                $( '#chkAllTests' ).removeAttr( 'checked' );
            }
            
        }
    } );

} );

