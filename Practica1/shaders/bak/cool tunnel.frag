uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4sX3RM
float rand(vec2 co){
    return 0.5+0.5*fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 tunl(vec2 uv, float t)
{
	float j = sin(uv.y*1.0*3.14+uv.x*0.0+t*5.0);
	float i = sin(uv.x*10.0-uv.y*2.0*3.14+t*10.0);
	
	float p = clamp(i,0.0,0.2)*clamp(j,0.0,0.2);
	float n = -clamp(i,-0.2,0.0)-0.0*clamp(j,-0.2,0.0);
	
	return 5.0*(vec4(1.0,0.25,0.125,1.0)*n + vec4(1.0,1.0,1.0,1.0)*p);
	
}

void main(void)
{
    float t = iGlobalTime;
	vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / iResolution.xy;
    vec2 uv;
	
	p += vec2(sin(t*0.5)*0.2, sin(-t*0.5)*0.2);


	float r = sqrt(dot(p,p));
	r = pow(r,3.);
	float a = atan(p.y*(0.3+0.2*cos(t*2.0+p.y)),p.x*(0.3+0.2*sin(t+p.x)))+t;
	
	
    uv.x = t + 1.0/( r + .01);
    uv.y = 4.0*a/3.1416;
	
    gl_FragColor = tunl(uv,t)*r*4.0;
}