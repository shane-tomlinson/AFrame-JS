YUI().use( 'test', function( Y ) {
    var TestRunner = Y.Test.Runner;
    
    testObservable( Y );
    testCore( Y );
    testAObject( Y );
    testMVCHash( Y );
    testMVCArray( Y );
    testDisplay( Y );
    
    TestRunner.run();
} );
