uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/XdSGzh
// Lissajous curve
// http://en.wikipedia.org/wiki/Lissajous_curve

const float PI = 3.14159;
//very low steps = cool fx
const int steps = 200;

vec2 lissajous(float t, float a, float b, float d)
{
	return vec2(sin(a*t+d), sin(b*t));
}

float line( vec2 a, vec2 b, vec2 p )
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy / iResolution.xy)*2.0-1.0;
	uv.x *= iResolution.x / iResolution.y;
	vec2 mouse = iMouse.xy / iResolution.xy;

	float a = 2.0;
	float b = 3.0;
	float d = iGlobalTime;	// phase
	
	float m = 1.0;
	float period = PI*2.0;
    vec2 lp = lissajous(iGlobalTime, a, b, d)*0.8;
    for(int i = 1; i <= steps; i++) 
    {
        float t = float(i)*period / float(steps);
		t += iGlobalTime;
        vec2 p = lissajous(t, a, b, d)*0.8;
		
		// distance to line
        vec2 pa = uv - p;
        vec2 ba = lp - p;
        float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
        vec2 q = pa - ba*h;
        m = min( m, dot( q, q ) );
        lp = p;
    }
    m = sqrt( m*iResolution.x*0.0003 );
	m = smoothstep(0.01, 0.0, m);
	
	gl_FragColor = mix(vec4(0.0), vec4(0.2, 1.0, 0.1, 1.0), m);
}