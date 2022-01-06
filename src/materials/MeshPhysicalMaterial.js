import { Vector2 } from '../math/Vector2.js';
import { MeshStandardMaterial } from './MeshStandardMaterial.js';
import { Color } from '../math/Color.js';
import { MathUtils } from '../math/MathUtils.js';

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  clearcoat: <float>,
 *  clearcoatMap: new THREE.Texture( <Image> ),
 *  clearcoatRoughness: <float>,
 *  clearcoatRoughnessMap: new THREE.Texture( <Image> ),
 *  clearcoatNormalScale: <Vector2>,
 *  clearcoatNormalMap: new THREE.Texture( <Image> ),
 *
 *  ior: <float>,
 *  reflectivity: <float>,
 *
 *  sheen: <Color>,
*
 *  transmission: <float>,
 *  transmissionMap: new THREE.Texture( <Image> ),
 *
 *  thickness: <float>,
 *  thicknessMap: new THREE.Texture( <Image> ),
 *  attenuationDistance: <float>,
 *  attenuationColor: <Color>,
 * }
 */

function MeshPhysicalMaterial( parameters ) {

	MeshStandardMaterial.call( this );

	this.defines = {

		'STANDARD': '',
		'PHYSICAL': ''

	};

	this.type = 'MeshPhysicalMaterial';

	this.clearcoat = 0.0;
	this.clearcoatMap = null;
	this.clearcoatRoughness = 0.0;
	this.clearcoatRoughnessMap = null;
	this.clearcoatNormalScale = new Vector2( 1, 1 );
	this.clearcoatNormalMap = null;

	this.reflectivity = 0.5; // maps to F0 = 0.04

	Object.defineProperty( this, 'ior', {
		get: function () {

			return ( 1 + 0.4 * this.reflectivity ) / ( 1 - 0.4 * this.reflectivity );

		},
		set: function ( ior ) {

			this.reflectivity = MathUtils.clamp( 2.5 * ( ior - 1 ) / ( ior + 1 ), 0, 1 );

		}
	} );

	this.sheen = null; // null will disable sheen bsdf

	this._transmission = 0;
	this.transmissionMap = null;

	this.thickness = 0;
	this.thicknessMap = null;
	this.attenuationDistance = 0.0;
	this.attenuationColor = new Color( 1, 1, 1 );

	this.refraction = 0.0;

	this.setValues( parameters );

}

MeshPhysicalMaterial.prototype = Object.create( MeshStandardMaterial.prototype );
MeshPhysicalMaterial.prototype.constructor = MeshPhysicalMaterial;

MeshPhysicalMaterial.prototype.isMeshPhysicalMaterial = true;

MeshPhysicalMaterial.prototype.copy = function ( source ) {

	MeshStandardMaterial.prototype.copy.call( this, source );

	this.defines = {

		'STANDARD': '',
		'PHYSICAL': ''

	};

	this.clearcoat = source.clearcoat;
	this.clearcoatMap = source.clearcoatMap;
	this.clearcoatRoughness = source.clearcoatRoughness;
	this.clearcoatRoughnessMap = source.clearcoatRoughnessMap;
	this.clearcoatNormalMap = source.clearcoatNormalMap;
	this.refraction = source.refraction;
	this.clearcoatNormalScale.copy( source.clearcoatNormalScale );

	this.reflectivity = source.reflectivity;

	if ( source.sheen ) {

		this.sheen = ( this.sheen || new Color() ).copy( source.sheen );

	} else {

		this.sheen = null;

	}

	this.transmission = source.transmission;
	this.transmissionMap = source.transmissionMap;

	this.thickness = source.thickness;
	this.thicknessMap = source.thicknessMap;
	this.attenuationDistance = source.attenuationDistance;
	this.attenuationColor.copy( source.attenuationColor );

	return this;

};

Object.defineProperty( MeshPhysicalMaterial.prototype, 'transmission', {

	get: function () {

		return this._transmission;

	},

	set: function ( value ) {

		if ( this._transmission > 0 !== value > 0 ) {

			this.version ++;

		}

		this._transmission = value;

	}

} );

export { MeshPhysicalMaterial };
