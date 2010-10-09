$( function() {

	function handleTestResult(data){
		var TestRunner = YAHOO.tool.TestRunner;
		
		switch(data.type) {
			case TestRunner.TEST_FAIL_EVENT:
				console.error( "Test named '" + data.testName + "' failed with message: '" + data.error.message + "'." );
				break;
			case TestRunner.TEST_PASS_EVENT:
				console.log( "Test named '" + data.testName + "' passed." );
				break;
			case TestRunner.TEST_IGNORE_EVENT:
				console.log( "Test named '" + data.testName + "' was ignored." );
				break;
		}
		
		if( message ) {
			
		}
	 
	}
	 
	var TestRunner = YAHOO.tool.TestRunner;
	TestRunner.subscribe(TestRunner.TEST_FAIL_EVENT, handleTestResult);
	TestRunner.subscribe(TestRunner.TEST_IGNORE_EVENT, handleTestResult);
	TestRunner.subscribe(TestRunner.TEST_PASS_EVENT, handleTestResult);
 
	TestRunner.run();
	
} );