YUI( { logInclude: { TestRunner: true } } ).use( 'console', 'overlay', 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;
    var TestCase = Y.Test.Case;
    window.Assert = Y.Assert;
    window.Mock = Y.Mock;
    var testCases = [];
    
    testsToRun.forEach( function( testConfig, index ) {
    	var test = new TestCase( testConfig );
        testCases.push( test );
        
        jQuery( '<li><input type="checkbox" value="' + index + '" />' + test.name + '</li>' ).appendTo( jQuery( '#testList' ) );
    } );

    //initialize the console
    var yconsole = new Y.Console( {
    	newestOnTop: true
    } );
    yconsole.render( '#log' );

    var items = [];
    var cookie = jQuery.cookie( 'tests_to_run' );
    if( cookie ) {
        items = JSON.parse( cookie ) || [];
    }
    else {
        items.push( 'all' );
    }
    
    items.forEach( function( itemID, index ) {
        jQuery( '#testList input[type=checkbox][value=' + itemID + ']' ).attr( 'checked', true );
    } );
    runItems( items );
    
    jQuery( '#btnRunTests' ).click( function() {
        var items = getChecked();
        runItems( items );
    } );
    
    jQuery( '#chkAllTests' ).click( function( event ) {
        var checked = jQuery( this ).is( ':checked' );
        
        if( checked ) {
            jQuery( '#testList input[type=checkbox]' ).attr( 'checked', true );
        }
        else {
            jQuery( '#testList input[type=checkbox]' ).removeAttr( 'checked' );
        }
    } );
    
    jQuery( '#testList input[type=checkbox]' ).click( function( event ) {
        var el = jQuery( this );
        if( false == el.is( '#chkAllTests' ) ) {
            var checked = el.is( ':checked' );
            if( false == checked ) {
                jQuery( '#chkAllTests' ).removeAttr( 'checked' );
            }
        }
    } );

    
    jQuery( window ).bind( 'beforeunload', function( event ) {
        var items = getChecked();
        var cookie = JSON.stringify( items );
        jQuery.cookie( 'tests_to_run', cookie );
    } );

    function getChecked() {
        var checkedIndex = [];

        jQuery( '#testList input[type=checkbox]:checked' ).each( function( index, item ) {
            var testID = jQuery( item ).val();
            
            checkedIndex.push( testID );
        } );
        
        return checkedIndex;
    }

    function runItems( items ) {
        TestRunner.clear();
        
        if( items.indexOf( 'all' ) > -1 ) {
            testCases.forEach( function( test ) {
                TestRunner.add( test );
            } );
        }
        else {
            items.forEach( function( testID, index ) {
                TestRunner.add( testCases[ testID ] );
            } );
        }

        TestRunner.run();
    }
} );

