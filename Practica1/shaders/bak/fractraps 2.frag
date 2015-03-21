uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/XdX3DB
#define zoom .45
#define offset vec2(1.,1.1)

#define iterations 9
#define scale 1.3+iMouse.y/iResolution.y
#define minscale .4
#define trans .75-iMouse.x/iResolution.x

#define orbittraps vec3(3.,2.,1.)
#define trapswidths vec3(1.5,1.,.5)

#define trap1color vec3(1.00,0.40,0.10)
#define trap2color vec3(0.35,0.25,1.00)
#define trap3color vec3(1.,1.,0.05)

#define trapsbright vec3(1.2,1.5,1.)
#define trapscontrast vec3(10.)

#define rotspeed .2

#define saturation .5
#define brightness 2.
#define contrast 1.5

#define antialias 4. //max 4


vec2 rotate(vec2 p, float angle) {
return p*mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
}

void main(void)
{
	vec3 aacolor=vec3(0.);
	vec2 uv=gl_FragCoord.xy / iResolution.xy - 0.5;
	float aspect=iResolution.x/iResolution.y;
	vec2 pos=uv;
	pos.x*=aspect;
	float zoo=1./zoom;
	pos+=offset;
	pos*=zoo; 
	vec2 pixsize=1./iResolution.xy*zoo;
	pixsize.x*=aspect;
	float av=0.;
	vec3 its=vec3(0.);
	float t=iGlobalTime*rotspeed;
	for (float aa=0.; aa<16.; aa++) {
		vec3 otrap=vec3(1000.);
		if (aa<antialias*antialias) {
			vec2 aacoord=floor(vec2(aa/antialias,mod(aa,antialias)));
			vec2 z=pos+aacoord*pixsize/antialias;
			for (int i=0; i<iterations; i++) {
				z=abs(z)-aspect*trans;
				z=rotate(z,-t+3.3);
				float l=dot(z,z);
				z/=clamp(l,minscale,1.);
				z=z*scale-1.;
				vec3 ot=abs(vec3(l)-orbittraps);
				if (ot.x<otrap.x) {
					otrap.x=ot.x;
					its.x=float(iterations-i);	
				}
				if (ot.y<otrap.y) {
					otrap.y=ot.y;
					its.y=float(iterations-i);	
				}
				if (ot.z<otrap.z) {
					otrap.z=ot.z;
					its.z=float(iterations-i);	
				}
			}
		}
		otrap=pow(max(vec3(0.),trapswidths-otrap)/trapswidths,trapscontrast);
		its=its/float(iterations);
		vec3 otcol1=otrap.x*pow(trap1color,3.5-vec3(its.x*3.))*trapsbright.x;
		vec3 otcol2=otrap.y*pow(trap2color,3.5-vec3(its.y*3.))*trapsbright.y;
		vec3 otcol3=otrap.z*pow(trap3color,3.5-vec3(its.z*3.))*trapsbright.z;
		aacolor+=(otcol1+otcol2+otcol3)/3.;
	}
	aacolor=aacolor/(antialias*antialias);
	vec3 color=mix(vec3(length(aacolor)),aacolor,saturation)*brightness;
	color=pow(color,vec3(contrast));		
	color*=vec3(1.2,1.15,1.);
	color*=1.-pow(max(0.,max(abs(uv.x),abs(uv.y))-.4)/.1,8.);
	gl_FragColor = vec4(color,1.0);
}