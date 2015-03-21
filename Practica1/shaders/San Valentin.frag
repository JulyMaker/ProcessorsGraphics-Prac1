uniform float iGlobalTime;
uniform vec3 iResolution;
uniform vec3 iMouse;
#define PI 3.14159265359



float noise(float t) {
	return fract(sin(t)*4397.33);
}

float field(vec3 p) {
	float d = 0.8;
	for (int i = 0; i < 7; ++i) {
		d = max(d, exp(-float(i) / 7.) * (length(max(p - .4, vec3(0.))) - 10));
	}
	return d;
}

void main() {
	vec2 uv = 2. * gl_FragCoord.xy / iResolution.xy - 1.;
	uv *= iResolution.xy / min(iResolution.x, iResolution.y);

	vec3 ro = vec3(0., 0., 2.7);
	vec3 rd = normalize(vec3(uv.x, -uv.y, -1.5));
	float dSum = 0.;
	float dMax = 0.;
	
 

	float variance = mix(3., 1., pow(.5 + .5*sin(iGlobalTime), 8.));
	variance -= .05 * log(1.e-6 + noise(iGlobalTime));
	
	for (int i = 0; i < 64; ++i) {
		float d = field(ro);
		float weight = 1. + .2 * (exp(-10. * abs(2.*fract(abs(4.*ro.y)) - 1.)));
		float value = exp(-variance * abs(d)) * weight;
		dSum += value;
		dMax = max(dMax, value);
	}
	
	// shape
    float a = atan(uv.x,uv.y+0.1)/PI;
    float r = length(uv);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
	vec3 hcol = vec3(1.0,0.5*r,0.3)*.5;
    vec3 bcol = vec3(1.0,0.8,0.7-0.07*uv.y)*(1.0-0.25*length(uv));
    vec3 col = mix( bcol, hcol, smoothstep( -0.2, 0.2, d-r) );
    vec4 col2 = vec4 (col,1.0);

	float t = max(dSum / 32., dMax) * mix(.92, 1., noise(uv.x + noise(uv.y + iGlobalTime)));
	gl_FragColor = col2*vec4(t * vec3(t*t*1.3, t*1.3, 1.), 1.);
}