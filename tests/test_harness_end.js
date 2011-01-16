YUI( { logInclude: { TestRunner: true } } ).use( 'console', 'overlay', 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;
    var TestCase = Y.Test.Case;
    window.Assert = Y.Assert;
    window.Mock = Y.Mock;
    var testCases = [];
    
    testsToRun.forEach( function( testConfig, index ) {
    	var test = new TestCase( testConfig );
        testCases.push( test );
        
        $( '<li><input type="checkbox" value="' + index + '" />' + test.name + '</li>' ).appendTo( $( '#testList' ) );
    } );

    //initialize the console
    var yconsole = new Y.Console( {
    	newestOnTop: true
    } );
    yconsole.render( '#log' );

    var items = [];
    var cookie = $.cookie( 'tests_to_run' );
    if( cookie ) {
        items = JSON.parse( cookie ) || [];
    }
    else {
        items.push( 'all' );
    }
    
    items.forEach( function( itemID, index ) {
        $( '#testList input[type=checkbox][value=' + itemID + ']' ).attr( 'checked', true );
    } );
    runItems( items );
    
    $( '#btnRunTests' ).click( function() {
        var items = getChecked();
        runItems( items );
    } );
    
    $( '#chkAllTests' ).click( function( event ) {
        var checked = $( this ).is( ':checked' );
        
        if( checked ) {
            $( '#testList input[type=checkbox]' ).attr( 'checked', true );
        }
        else {
            $( '#testList input[type=checkbox]' ).removeAttr( 'checked' );
        }
    } );
    
    $( '#testList input[type=checkbox]' ).click( function( event ) {
        var el = $( this );
        if( false == el.is( '#chkAllTests' ) ) {
            var checked = el.is( ':checked' );
            if( false == checked ) {
                $( '#chkAllTests' ).removeAttr( 'checked' );
            }
        }
    } );

    
    $( window ).bind( 'beforeunload', function( event ) {
        var items = getChecked();
        var cookie = JSON.stringify( items );
        $.cookie( 'tests_to_run', cookie );
    } );

    function getChecked() {
        var checkedIndex = [];

        $( '#testList input[type=checkbox]:checked' ).each( function( index, item ) {
            var testID = $( item ).val();
            
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

