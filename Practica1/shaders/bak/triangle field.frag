uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/lsl3zH
float triangle(vec2 p, float s)
{
	return max(abs(p.x) * 0.866025 + p.y * 0.5, -p.y) - s * 0.5;
}

float dist(vec2 p)
{
	float s = pow(2.0, fract(iGlobalTime));
	float d = 1.0;
	for (int i = 0; i < 10; i++)
	{
		p.x = abs(p.x);
		s /= 2.0;
		p.x = p.x - s * 2.0;
		d = min(d, triangle(vec2(p.x, p.y + s), s));
	}
	return d;
}

void main(void)
{
	vec2 uv = -1.0 + 2.0 * gl_FragCoord.xy / iResolution.xy;
	uv.y -= 1.0;
	float d = dist(uv);
	vec3 color = vec3(0.0);
	if (d < 0.0) color.r = smoothstep(0.01, 0.0, abs(d));
	gl_FragColor = vec4(color, 1.0);
	//gl_FragColor = vec4(dist(uv));
}