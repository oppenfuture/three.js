/**
 * @author mrdoob / http://mrdoob.com/
 */
import { platform } from '../platform'


var _context;

var AudioContext = {

	getContext: function () {

		if ( _context === undefined ) {

			_context = new ( platform.window.AudioContext || window.webkitAudioContext )();

		}

		return _context;

	},

	setContext: function ( value ) {

		_context = value;

	}

};

export { AudioContext };
