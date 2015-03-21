uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/MslGD8
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#define ANIMATE

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

vec2 hash( vec2 p )
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return fract(sin(p)*43758.5453);
}

vec2 voronoi( in vec2 x )
{
    vec2 n = floor( x );
    vec2 f = fract( x );

	vec2 m = vec2( 8.0 );
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 g = vec2( float(i),float(j) );
        vec2 o = hash( n + g );
		#ifdef ANIMATE
        o = 0.5 + 0.5*sin( iGlobalTime + 6.2831*o );
        #endif	
		vec2 r = g - f + o;

		float d = dot(r,r);
        if( d<m.x )
        {
            m.x = d;
            m.y = hash( dot(n+g,vec2(7.0,113.0) ) );
        }
    }
    return vec2( sqrt(m.x), m.y );
}

void main( void )
{
    vec2 p = gl_FragCoord.xy/iResolution.xx;
    vec2 c = voronoi( 8.0*p );

    vec3 col = 0.5 + 0.5*sin( c.y*100.0 + vec3(0.0,0.8,1.0) );	
    col *= 0.8 - 0.4*c.x;
    col += 0.4*(2.0-smoothstep( 0.0, 0.12, c.x)-smoothstep( 0.0, 0.04, c.x));
	
    gl_FragColor = vec4( col, 1.0 );
}