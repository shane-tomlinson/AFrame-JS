$( function() {

	function handleTestResult(data){
		var TestRunner = YAHOO.tool.TestRunner;
		var message;
		
		switch(data.type) {
			case TestRunner.TEST_FAIL_EVENT:
				message = "Test named '" + data.testName + "' failed with message: '" + data.error.message + "'.";
				break;
			case TestRunner.TEST_PASS_EVENT:
				message = "Test named '" + data.testName + "' passed.";
				break;
			case TestRunner.TEST_IGNORE_EVENT:
				message = "Test named '" + data.testName + "' was ignored.";
				break;
		}
		
		if( message ) {
			console.log( message );
		}
	 
	}
	 
	var TestRunner = YAHOO.tool.TestRunner;
	TestRunner.subscribe(TestRunner.TEST_FAIL_EVENT, handleTestResult);
	TestRunner.subscribe(TestRunner.TEST_IGNORE_EVENT, handleTestResult);
	TestRunner.subscribe(TestRunner.TEST_PASS_EVENT, handleTestResult);
 
	TestRunner.run();
	
} );