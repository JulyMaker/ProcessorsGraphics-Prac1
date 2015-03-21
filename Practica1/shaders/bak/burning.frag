uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/ldsGzH
float mod289(float x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 perm(vec4 x)
{
    return mod289(((x * 34.0) + 1.0) * x);
}

float noise3d(vec3 p)
{
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main(void)
{
	vec2 uv = 2.0 * gl_FragCoord.xy / iResolution.xy - 1.0;
	
    vec3 water[4];
    vec3 fire[4];

    mat3 r = mat3(0.36, 0.48, -0.8, -0.8, 0.60, 0.0, 0.48, 0.64, 0.60);
    vec3 p_pos = r * vec3(uv * vec2(16.0, 9.0), 0.0);
    vec3 p_time = r * vec3(0.0, 0.0, iGlobalTime * 2.0);

    /* Noise sampling points for fire */
    p_pos = 16.0 * p_pos - r * vec3(0.0, mod289(iGlobalTime) * 128.0, 0.0);
    fire[0] = p_pos / 2.0 + p_time * 2.0;
    fire[1] = p_pos / 4.0 + p_time * 1.5;
    fire[2] = p_pos / 8.0 + p_time;
    fire[3] = p_pos / 16.0 + p_time;

    mat2 rot = mat2(cos(iGlobalTime), sin(iGlobalTime), -sin(iGlobalTime), cos(iGlobalTime));

	vec2 poszw = rot * uv;
	
    vec4 n = vec4(noise3d(fire[0]),
                  noise3d(fire[1]),
                  noise3d(fire[2]),
                  noise3d(fire[3]));

    vec4 color;

	/* Use noise results for fire */
	float p = dot(n, vec4(0.125, 0.125, 0.25, 0.5));
	
	/* Fade to black on top of screen */
	p -= uv.y * 0.8 + 0.25;
	p = max(p, 0.0);
	p = min(p, 1.0);
	
	float q = p * p * (3.0 - 2.0 * p);
	float rr = q * q * (3.0 - 2.0 * q);
	color = vec4(min(q * 2.0, 1.0),
				 max(rr * 1.5 - 0.5, 0.0),
				 max(q * 8.0 - 7.3, 0.0),
				 1.0);

	gl_FragColor = color;
}