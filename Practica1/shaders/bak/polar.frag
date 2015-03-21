uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4sSGDR
//Polar Coordinate Function, drag to move the origin around. Fullscreen is better:) 
//modified from my previous shader : https://www.shadertoy.com/view/Msj3zw 
//functions from http://poncelet.math.nthu.edu.tw/disk3/exp02/11/

const float PI = 3.1415926;

// ---- change scale here ----
float scale = 3.0;
float time_offset = 0.0;

// ---- change function here -----
float function( float r, float t ) {
//	return 2.0 - cos( 6.0 * t ) - cos( 31.0 * 6.0 * t / 32.0 ) - r;
	return 2.0 - cos( 3.0 * t ) - cos( 31.0 * 3.0 * t / 32.0 ) - r;
//	return 2.0 - cos( 3.0 * t ) - cos( 31.0 * 3.0 * t / 32.0 ) - sin( r );
//	return 2.0 - cos( 6.0 * t ) - cos( 31.0 * 3.0 * t / 32.0 ) - cos( r * 4.0 );
//form nim
//return tan( 1.0 * t )-sin(t*3.14)*3. - r;
}

float solve( vec2 p ) {
	float time = iGlobalTime + time_offset;

	float r = length( p );
	float t = atan( p.y, p.x ) - time * 0.1;
	
	float v = 1000.0;
	for ( int i = 0; i < 32; i++ ) {
		if ( t > time * 1.5 ) {
			continue;
		}
		v = min( v, abs( function( r, t ) ) );
		t += PI * 2.0;
	}
	return v;
}

float value( vec2 p, float size ) {
	float error = size * 1.6;
	return 1.0 / max( solve( p ) / error, 1.0 );
}

float grid( vec2 p, float width ) {
	p += width * 0.5;
	
	float grid_width = 1.0;
	float k = 1.0;
	
	k *= step( width * 2.0, abs( p.x ) );
	k *= step( width * 2.0, abs( p.y ) );
	
	grid_width *= 0.25;
	k *= min( step( width, abs( floor( p.x / grid_width + 0.5 ) * grid_width - p.x ) ) + 0.75, 1.0 );
	k *= min( step( width, abs( floor( p.y / grid_width + 0.5 ) * grid_width - p.y ) ) + 0.75, 1.0 );

	return k;	
}

void main(void)
{
	float width = 1.0 / min( iResolution.x, iResolution.y );
	vec2 control = mix( iResolution.xy * 0.5, iMouse.xy, 1.0 - step( iMouse.z, 0.0 ) );
	vec2 uv = ( gl_FragCoord.xy - control ) * width * 2.0;

	float k_grid = grid( uv, width );
	float k_func = value( uv * scale, width * scale );
	
	gl_FragColor = vec4( ( 1.0 - k_func ) * k_grid );
}