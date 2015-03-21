uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/XsfGDS
// I/O fragment shader by movAX13h, August 2013

#define SHOW_BLOCKS

float rand(float x)
{
    return fract(sin(x) * 4358.5453123);
}

float rand(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5357);
}

float box(vec2 p, vec2 b, float r)
{
  return length(max(abs(p)-b,0.0))-r;
}

void main(void)
{
	float t = iGlobalTime;
	const float speed = 0.8;
	const float ySpread = 1.6;
	const int numBlocks = 70;

	float pulse = pow(sin(t * 5.)*.03+.85,5.);
	pulse *= pow(sin(t*11.)*.03+1.,5.);
	pulse *= pow(sin(t*17.)*.03+1.,5.);
	pulse *= pow(sin(t*10.)*.03+1.,5.);
	pulse *= pow(sin(t*9.)*.03+1.,5.);
	
	vec2 uv = gl_FragCoord.xy / iResolution.xy - 0.5;
	float aspect = iResolution.x / iResolution.y;
	vec3 baseColor = uv.x > 0.0 ? vec3(0.0,0.3, 0.6) : vec3(0.6, 0.0, 0.3);
	
	vec3 color = pulse*baseColor*0.5*(0.9-cos(uv.x*8.0));
	uv.x *= aspect;
	
	for (int i = 0; i < numBlocks; i++)
	{
	//int i = 1;
		float z = 1.0-0.7*rand(float(i)*1.4333); // 0=far, 1=near
		float tickTime = iGlobalTime*z*speed + float(i)*1.23753;
		float tick = floor(tickTime);
		
		vec2 pos = vec2(0.6*aspect*(rand(tick)-0.5), sign(uv.x)*ySpread*(0.5-fract(tickTime)));
		pos.x += 0.24*sign(pos.x); // move aside
		if (abs(pos.x) < 0.1) pos.x++; // stupid fix; sign sometimes returns 0
		
		vec2 size = 1.8*z*vec2(0.04, 0.04 + 0.1*rand(tick+0.2));
		float b = box(uv-pos, size, 0.01);
		float dust = z*smoothstep(0.22, 0.0, b)*pulse*0.5;
		#ifdef SHOW_BLOCKS
		float block = 0.2*z*smoothstep(0.002, 0.0, b);
		float shine = 0.6*z*pulse*smoothstep(-0.002, b, 0.007);
		color += dust*baseColor + block*z + shine;
		#else
		color += dust*baseColor;
		#endif
	}
	
	color -= rand(uv)*0.04;
	gl_FragColor = vec4(color, 1.0);
}