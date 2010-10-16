YUI( { logInclude: { TestRunner: true } } ).use( 'console', 'overlay', 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;
    
    testObservable( Y );
    testCore( Y );
    testAObject( Y );
    testPlugin( Y );
    testMVCHash( Y );
    testMVCArray( Y );
    testDisplay( Y );
    testList( Y );
    testListPluginBindToCollection( Y );

    //initialize the console
    var yconsole = new Y.Console( {
    	newestOnTop: false
    } );
    yconsole.render('#log');

    TestRunner.run();
} );
