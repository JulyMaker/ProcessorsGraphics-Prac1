uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 

//parameters
const int iterations=20;
const float scale=1.3;
const vec2 fold=vec2(.5);
const vec2 translate=vec2(1.5);
const float zoom=.25;
const float brightness=7.;
const float saturation=.65;
const float texturescale=.55;
const float rotspeed=.1;
const float colspeed=.05;
const float antialias=2.;


vec2 rotate(vec2 p, float angle) {
return vec2(p.x*cos(angle)-p.y*sin(angle),
		   p.y*cos(angle)+p.x*sin(angle));
}

// 1D random numbers
float rand(float n)
{
    return fract(sin(n) * 43758.5453123);
}

// 2D random numbers
vec2 rand2(in vec2 p)
{
	return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
}

// 1D noise
float noise1(float p)
{
	float fl = floor(p);
	float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}

void main(void)
{
	float t = iGlobalTime;
	vec3 aacolor=vec3(0.);
	vec2 pos=gl_FragCoord.xy / iResolution.xy-.5;
	float aspect=iResolution.y/iResolution.x;
	pos.y*=aspect;
	pos/=zoom; 
	vec2 pixsize=max(1./zoom,100.-t*50.)/iResolution.xy;
	pixsize.y*=aspect;
	for (float aa=0.; aa<25.; aa++) {
		if (aa+1.>antialias*antialias) break;
		vec2 aacoord=floor(vec2(aa/antialias,mod(aa,antialias)));
		vec2 p=pos+aacoord*pixsize/antialias;
		p+=fold;
		float expsmooth=0.;
		vec2 average=vec2(0.);
		float l=length(p);
		for (int i=0; i<iterations; i++) {
			p=abs(p-fold)+fold;
			p=p*scale-translate;
			if (length(p)>20.) break;
			p=rotate(p,t*rotspeed);
			average+=p;
		}
		average/=float(iterations);
		vec2 coord=average+vec2(t*colspeed);
		vec3 color = vec3(noise1(coord.x),noise1(coord.y),0.5);
		//vec3 color = vec3(0.5,0.5,0.5);
		color*=min(1.1,length(average)*brightness);
		color=mix(vec3(length(color)),color,saturation);
		aacolor+=color;
	}
	gl_FragColor = vec4(aacolor/(antialias*antialias),1.0);
}