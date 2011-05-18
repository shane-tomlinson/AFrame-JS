testsToRun.push( {

		name: "TestCase AFrame.DataValidation",

        testRequired: function() {
            var criteria = {
                required: true
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.valueMissing, 'field is invalid' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: 'a',
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.valueMissing, 'field is valid' );

        },

        testRequiredText: function() {
            var criteria = {
                required: true,
                type: 'text'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                criteria: criteria,
                data: ''
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.valueMissing, 'field is invalid' );

            fieldValidityState = AFrame.DataValidation.validate( {
                criteria: criteria,
                data: 'a'
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.valueMissing, 'field is valid' );
        },

        testMin: function() {
            var criteria = {
                min: 10,
                type: 'number'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 1,
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.rangeUnderflow, 'value is too low' );

            fieldValidityState = AFrame.DataValidation.validate(  {
                data: 10,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeUnderflow, 'value is good' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: 100,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeUnderflow, 'value is good' );
        },

        testMax: function() {
            var criteria = {
                max: 10,
                type: 'number'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 100,
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.rangeOverflow, 'value is too high' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: 10,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeOverflow, 'value is good' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: 1,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.rangeOverflow, 'value is good' );
        },

        testMaxLength: function() {
            var criteria = {
                maxlength: 10,
                type: 'text'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: '',
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.tooLong, 'value is ok length' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: '1234567890',
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.tooLong, 'value is ok length' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: '12345678901',
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.tooLong, 'value is too long' );
        },

        testPattern: function() {
            var criteria = {
                pattern: '[0-9][A-Z]{3}',
                type: 'text'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: '',
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.patternMismatch, 'pattern does not match' );

            fieldValidityState = AFrame.DataValidation.validate( {
                data: '0ABC',
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.patternMismatch, 'pattern matches' );
        },

        testStep: function() {
            var criteria = {
                step: 2,
                type: 'number'
            };

            // step, no min, should use 0 as the min.
            var fieldValidityState = AFrame.DataValidation.validate( {
                data: .33,
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'field is invalid' );
            Assert.isTrue( fieldValidityState.stepMismatch, '.33 is an invalid step' );

            // step, no min, should use 0 as the min.
            fieldValidityState = AFrame.DataValidation.validate( {
                data: 2,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'field is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '2 is a valid step' );

            // Add a non-standard min to see if it works.
            criteria.min = 3;

            fieldValidityState = AFrame.DataValidation.validate( {
                data: 3,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, '3 is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '3 is a valid step when .33 is min' );

            // step, with min
            fieldValidityState = AFrame.DataValidation.validate( {
                data: 5,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, '5 is valid' );
            Assert.isFalse( fieldValidityState.stepMismatch, '5 is a valid step when .33 is min' );

            // step, with min
            fieldValidityState = AFrame.DataValidation.validate( {
                data: 4,
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, '4 is an invalid step' );
            Assert.isTrue( fieldValidityState.stepMismatch, '4 is an invalid step when 3 is min' );
        },

        testType: function() {
            var criteria = {
                type: 'text'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 1,
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'text field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, '1 is not text' );


            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 'asdf',
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'text field is valid' );
            Assert.isFalse( fieldValidityState.typeMismatch, 'asdf is text' );

            var criteria = {
                type: 'number'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 1,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'number field is valid' );
            Assert.isFalse( fieldValidityState.typeMismatch, '1 is a number' );

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 'asdf',
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'number field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, 'asdf is not a number' );

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: '1',
                criteria: criteria
            } );

            Assert.isFalse( fieldValidityState.valid, 'number field is invalid' );
            Assert.isTrue( fieldValidityState.typeMismatch, "'1' is not a number" );
        },

        testSetCustomValidator: function() {
            var validator = function( data, fieldValidityState, criteria, allCriteria ) {
                fieldValidityState.setCustomValidity( 'randomValidationError' );
            };

            AFrame.DataValidation.setValidator( 'randomtype', 'min', validator );

            var criteria = {
                min: 1234,
                type: 'randomtype'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 1,
                criteria: criteria
            } );


            Assert.isFalse( fieldValidityState.valid, 'randomValidationError caused invalid field' );
            Assert.isTrue( fieldValidityState.customError, 'randomValidationError caused customError' );
            Assert.areEqual( 'randomValidationError', fieldValidityState.validationMessage, 'randomValidationError set for validationMessage' );
        },

        testTypeNonExistent: function() {
            var criteria = {
                type: 'nonexistenttype'
            };

            var fieldValidityState = AFrame.DataValidation.validate( {
                data: 1,
                criteria: criteria
            } );

            Assert.isTrue( fieldValidityState.valid, 'unknown type does not raise a fieldValidityState.typeMismatch' );
            Assert.isFalse( fieldValidityState.typeMismatch, 'unknown type does not raise a fieldValidityState.typeMismatch' );

        },

        testIntegerType: function() {
			var criteria = {
				type: 'integer'
			};

			var fieldValidityState = AFrame.DataValidation.validate( {
				data: 1.23,
				criteria: criteria
			} );

			Assert.isFalse( fieldValidityState.valid, 'cannot set an integer to a real number' );
			Assert.isTrue( fieldValidityState.typeMismatch, 'typeMismatch is set' );

			var fieldValidityState = AFrame.DataValidation.validate( {
				data: 2,
				criteria: criteria
			} );

			Assert.isTrue( fieldValidityState.valid, 'integer set' );
			Assert.isFalse( fieldValidityState.typeMismatch, 'typeMismatch is not set' );
        }

} );
