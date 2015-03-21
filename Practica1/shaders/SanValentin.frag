#define HARD_SHADOW
#define GLOW
#define EDGES
#define NUM_TENTACLES 170
#define BUMPS
#define NUM_BUMPS 10
#define BACKGROUND
#define SUN_POS vec3(40.0, 15.0, -15.0)

#define SPHERE_COL vec3(0.6, 0.3, 0.1)
#define MOUTH_COL vec3(0.9, 0.6, 0.1)
#define TENTACLE_COL vec3(0.06)

#define GAMMA 2.2

//---
uniform float iGlobalTime;
uniform vec3 iResolution;
uniform vec3 iMouse;
#define resolution iResolution
#define mouse iMouse
#define pi2 6.283185307179586476925286766559
#define pih 1.5707963267949

const float pi= 3.1415927;
const int NUM_OCTAVES = 4;
float hash(float n) { return fract(sin(n) * 1e4); } 
float hash(vec2 p){return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 +p.x))));}
float noise(float x) { float i = floor(x);float f = fract(x); float u = f * f * (3.0 - 2.0 * f);
	return mix(hash(i),hash(i+1.0),u);}
float noise(vec2 x){vec2 i=floor(x);vec2 f=fract(x);	float a = hash(i); float b=hash(i + vec2(1.0,0.0));
	float c=hash(i+vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); 
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y; }
float NOISE(vec2 x){ 
	float v = 0.0; 
	float a = 0.5; 
	vec2 shift=vec2(100);
	mat2 rot=mat2(cos(0.5),sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES;++i) {v+=a*noise(x);x = rot* x * 2.0 + shift; a *= 0.5; }
    return v; 
}
float square(float x) { return x * x;}
mat3 rotation(float yaw, float pitch){return mat3(cos(yaw),0,-sin(yaw), 0, 1, 0, sin(yaw), 0, cos(yaw)) * mat3(1, 0, 0, 0, cos(pitch), sin(pitch), 0, -sin(pitch), cos(pitch)); }
vec3 nebula(vec3 dir) { float purple = abs(dir.x); float yellow = noise(dir.y);vec3 streakyHue = vec3(purple + yellow, yellow * 0.7, purple);vec3 puffyHue = vec3(0.8, 0.1, 1.0);float streaky = min(1.0, 8.0 * pow(NOISE(dir.yz*square(dir.x) * 13.0+ dir.xy * square(dir.z) * 7.0 + vec2(150.0, 2.0)),10.0));float puffy=square(NOISE(dir.xz * 4.0 + vec2(30, 10)) * dir.y);
return pow(clamp(puffyHue * puffy * (1.0 - streaky) + streaky * streakyHue, 0.0, 1.0), vec3(1.0/2.2));}


float noise2(float t) {
	return fract(sin(t)*4397.33);
}

float field(vec3 p) {
	float d = 0.8;
	for (int i = 0; i < 7; ++i) {
		d = max(d, exp(-float(i) / 7.) * (length(max(p - .4, vec3(0.))) - 11));
	}
	return d;
}

float sdBox( vec3 p, vec3 b ) 
{	
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdSphere(vec3 p, float r)
{
	return length(p)-r;
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xy),p.z)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

vec2 rotate(vec2 p, float a)
{
	vec2 r;
	r.x = p.x*cos(a) - p.y*sin(a);
	r.y = p.x*sin(a) + p.y*cos(a);
	return r;
}

// polynomial smooth min (k = 0.1); by iq
float smin(float a, float b, float k)
{
    float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
}

// globals
float time = iGlobalTime;
float glow = max(0.0, min(1.0, 2.0*sin(time*0.7-5.0)));
float bite = smoothstep(0.0, 1.0, 1.6*sin(time*0.7));
vec3 sphere_col = SPHERE_COL*glow;
vec3 sun = normalize(SUN_POS);
float focus = 5.0;
float far = 23.0;

struct Hit
{
	float d;
	vec3 color;
	float edge;
};

Hit scene(vec3 p)
{
	float d, d1, d2, d3, f, e = 0.15;
	
	vec3 q = p;
	q.xy = rotate(q.xy, 1.5);
	
	// center sphere
	d1 = sdSphere(q, 0.3);
	d = d1; 
    vec3 col = sphere_col; 
    
	// tentacles
	float r = length(q);
	float a = atan(q.z, q.x);
	a += 0.4*sin(r-time);
	
	q = vec3(a*float(NUM_TENTACLES)/pi2,q.y,length(q.xz)); // circular domain
	q = vec3(mod(q.x,1.0)-0.5*1.0,q.y,q.z); // repetition
	
	d3 = sdCappedCylinder(q-vec3(0.0,0.0,0.9+bite), vec2(0.1-(r-bite)/18.0,0.8));
	d2 = min(d3, sdBox(q-vec3(0.0, 0.0, 0.1+bite), vec3(0.2, 0.2, 0.2))); // close box
	
    f = smoothstep(0.11, 0.28, d2-d1);
	col = mix(MOUTH_COL, col, f);
	e = mix(e, 0.0, f);
	d = smin(d1, d2, 0.24);
    
	col = mix(TENTACLE_COL, col, smoothstep(0., 0.48, d3-d));
	
	return Hit(d, col, e);
}

vec3 normal(vec3 p)
{
	float c = scene(p).d;
	vec2 h = vec2(0.01, 0.0);
	return normalize(vec3(scene(p + h.xyy).d - c, 
						  scene(p + h.yxy).d - c, 
		                  scene(p + h.yyx).d - c));
}

vec3 colorize(Hit hit, vec3 n, vec3 dir, const in vec3 lightPos)
{
	float diffuse = 0.3*max(0.0, dot(n, lightPos));
	
	vec3 ref = normalize(reflect(dir, n));
	float specular = 0.4*pow(max(0.0, dot(ref, lightPos)), 6.5);

	return (hit.color.rgb + 
			diffuse * vec3(0.9) +
			specular * vec3(1.0));
}

void main(void) 
{
    vec2 pos = (gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
	
	float d = clamp(1.5*sin(0.3*time), 0.5, 1.0);
	vec3 cp = vec3(10.0*d, -2.3*d, -6.2*d+4.0*clamp(2.0*sin(time*0.5), 0.0, 1.0)); // anim curious spectator
	
	
    vec3 ct = vec3(0.0, 0.0, 0.0);
   	vec3 cd = normalize(ct-cp);
    vec3 cu  = vec3(0.0, 1.0, 0.0);
    vec3 cs = cross(cd, cu);
    vec3 dir = normalize(cs*pos.x + cu*pos.y + cd*focus);
	
    Hit h;
	vec3 col = vec3(0.16);
	vec3 ray = cp;
	float dist = 0.0;
	
	// raymarch scene
    for(int i=0; i < 60; i++) 
	{
        h = scene(ray);
		
		if(h.d < 0.0001) break;
		
		dist += h.d;
		ray += dir * h.d * 0.9;

        if(dist > far) 
		{ 
			dist = far; 
			break; 
		}
    }

	float m = (1.0 - dist/far);
	vec3 n = normal(ray);
	col = colorize(h, n, dir, sun)*m;
    
	//////////////////////////////////////////////////////////////////////////////
	vec2 uv = 2. * gl_FragCoord.xy / iResolution.xy - 1.;
	uv *= iResolution.xy / min(iResolution.x, iResolution.y);

	vec3 ro = vec3(0., 0., 2.7);
	vec3 rd = normalize(vec3(uv.x, -uv.y, -1.5));
	float dSum = 0.;
	float dMax = 0.;
	
 

	float variance = mix(3., 1., pow(.5 + .5*sin(iGlobalTime), 2.));
	variance -= .05 * log(1.e-6 + noise2(iGlobalTime));
	
	for (int i = 0; i < 64; ++i) {
		float d = field(ro);
		float weight = 1. + .2 * (exp(-10. * abs(2.*fract(abs(4.*ro.y)) - 1.)));
		float value = exp(-variance * abs(d)) * weight;
		dSum += value;
		dMax = max(dMax, value);
	}
	float t = max(dSum / 32., dMax) * mix(.92, 1., noise(uv.x + noise(uv.y + iGlobalTime)));

	gl_FragColor = vec4(col, 1.0)*vec4(t * vec3(t*t*1.3, t*1.3, 1.), 1.);
}