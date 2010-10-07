$( function() {
	var testExtend = new YAHOO.tool.TestCase( {
	 
		name: "TestCase AFrame.extend",
	 
		//---------------------------------------------
		// Setup and tear down
		//---------------------------------------------
	 
		setUp : function () {
			function SuperClass() {
			}
			SuperClass.prototype = {
				hasFunc: function() {
					return true;
				}
			}
			
			function SubClass() {
			}
			AFrame.extend( SubClass, SuperClass );
			
			this.subInstance = new SubClass();
			
		},
	 
		tearDown : function () {
			this.subInstance = null;
			delete this.subInstance;
		},
	 
		//---------------------------------------------
		// Tests
		//---------------------------------------------
	 
		testExtendBase: function () {
			var Assert = YAHOO.util.Assert;
			
			Assert.isTrue( this.subInstance.hasFunc() );
		} 
	} );
	
	
	
	
	
	
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
 
	TestRunner.add( testExtend );
	TestRunner.run();
	
} );