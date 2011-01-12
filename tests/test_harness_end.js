YUI( { logInclude: { TestRunner: true } } ).use( 'console', 'overlay', 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;
    var TestCase = Y.Test.Case;
    window.Assert = Y.Assert;
    window.Mock = Y.Mock;
    
    testsToRun.forEach( function( testConfig, index ) {
	    var test = new TestCase( testConfig );
        TestRunner.add( test );
    } );

    //initialize the console
    var yconsole = new Y.Console( {
    	newestOnTop: true
    } );
	yconsole.render( '#log' );

    TestRunner.run();
} );
