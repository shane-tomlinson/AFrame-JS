$( function() {
	var TestRunner = YAHOO.tool.TestRunner;
	var Assert = YAHOO.util.Assert;
	
	var testObservable = new YAHOO.tool.TestCase( {
	 
		name: "TestCase AFrame.Observable",
	 
		setUp : function () {		
			this.observable = AFrame.Observable.getInstance();		    
			this.boundCalled = false;
			this.args;
			var me=this;
			this.bindFunc = function() {
			    me.boundCalled = true;
			    me.args = Array.prototype.slice.call( arguments, 0 );
			    this.thisBound = true;
			};
		},
	 
		tearDown : function () {
			this.observable.unbindAll();
			this.observable = null;
			delete this.observable;
		},
	 
		testGetInstance: function () {
		    Assert.isObject( this.observable, 'observable created, getInstance works' );
		},
		
		testBindTrigger: function() {
		    this.observable.bind( this.bindFunc );
		    this.observable.trigger();
		    
		    Assert.isTrue( this.boundCalled, 'bindFunc function called' );
		    Assert.areEqual( 0, this.args.length, 'arguments length is 0' );
		    
		    this.observable.trigger( 1, 2 );
		    Assert.areEqual( 2, this.args.length, 'arguments length correctly passed' );
		},
		
		testUnbind: function() {
		    var bindID = this.observable.bind( this.bindFunc );
		    this.observable.unbind( bindID );
		    this.observable.trigger();
		    Assert.isFalse( this.boundCalled, 'bound function unbound' );
		},
		
		testUnbindAll: function() {
		    var secondBound = false;
		    var secondBindFunc = function() {
			secondBound = true;
		    }
		    
		    this.observable.bind( this.bindFunc );
		    this.observable.bind( secondBound );
		    
		    this.observable.unbindAll()
		    
		    this.observable.trigger();
		    Assert.isFalse( this.boundCalled, 'bound function unbound' );
		    Assert.isFalse( secondBound, 'secondBound function unbound' );
		},
		
		testTeardown: function() {
		    this.observable.teardown();
		}
	} );
	
	
	
	TestRunner.add( testObservable );
} );