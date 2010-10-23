YUI( { logInclude: { TestRunner: true } } ).use( 'console', 'overlay', 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;

    testsToRun.forEach( function( test, index ) {
	test( Y );
    } );

    //initialize the console
    var yconsole = new Y.Console( {
    	newestOnTop: true
    } );
	yconsole.render( '#log' );

    TestRunner.run();
} );
