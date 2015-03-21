uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/XssGDn
//"Lasers & Bubbles" by Kali

//comment next line to disable DOF
#define DOF 


//Rotation function by Syntopia
mat3 rotmat(vec3 v, float angle)
{
	float c = cos(angle);
	float s = sin(angle);
	
	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,
		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,
		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z
		);
}

//Distance Field
vec4 de(vec3 pos) {
	vec3 A=vec3(4.);
	vec3 p = abs(A-mod(pos,2.0*A)); //tiling fold by Syntopia
	float sph=length(p)-.6;
	float cyl=length(p.xy)-.012;
	cyl=min(cyl,length(p.xz))-.012;
	cyl=min(cyl,length(p.yz))-.012;
	p=p*rotmat(normalize(vec3(0,0,1.)),radians(45.));
	if (max(abs(pos.x),abs(pos.y))>A.x) {
	cyl=min(cyl,length(p.xy))-.012;
	cyl=min(cyl,length(p.xz))-.012;
	cyl=min(cyl,length(p.yz))-.012;
	}
   float d=min(cyl,sph);
	vec3 col=vec3(0.);
	if (sph<cyl && d<.1) col=vec3(.9,.85,.7); else col=vec3(1.2,0.2,0.1);
	return vec4(col,d);	
	
}


void main(void)
{
	float time = iGlobalTime; //just because it's more handy :)

	// mouse functions
	vec2 mouse=iMouse.xy/iResolution.xy;
	float viewangle=-45.+iMouse.x/iResolution.x*90.; 
	float focus=iMouse.y/iResolution.y*.4;
	if (mouse.x+mouse.y<.01) { //default settings
		focus=.13;	
		viewangle=0.;		
	}
	
	//camera
	mat3 rotview=rotmat(vec3(0.,1.,0.),radians(viewangle));
	vec2 coord = gl_FragCoord.xy / iResolution.xy *2.2 - vec2(1.);
	coord.y *= iResolution.y / iResolution.x;
	float fov=min((time*.2+.2),0.9); //animate fov at start
	vec3 from = vec3(0.,sin(time*.5)*2.,time*5.);
	
	vec3 p;
	float totdist=-1.5;
	float intens=1.;
	float maxdist=90.;
	vec3 col=vec3(0.);
	vec3 dir;
	for (int r=0; r<150; r++) {
		if (totdist<maxdist){
		dir=normalize(vec3(coord.xy*fov,1.))*rotview 
			*rotmat(normalize(vec3(0.05,0.05,1.)),time*.3+totdist*.015); //rotate ray
		vec4 d=de(p); //get de and color
		float distfactor=totdist/maxdist;
		float fade=exp(-.06*distfactor*distfactor); //distance fade
		float dof=min(.15,1.-exp(-2.*pow(abs(distfactor-focus),2.))); //focus
		float dd=abs(d.w); 
		#ifdef DOF
			totdist+=max(0.007+dof,dd); //bigger steps = out of focus
		#else
			totdist+=max(0.007,dd);
		#endif
		p=from+totdist*dir;
		intens*=fade; //lower bright with distance
		col+=d.xyz*intens; //accumulate color
		}
	}
	
	col=col/maxdist; //average colors (kind of)
	col*=pow(length(col),1.3)*.5; //contrast & brightness
	
	//light
	col+=vec3(1.1,.95,.85)*pow(max(0.,dot(dir,vec3(0.,0.,1.))),12.)*.8; 
	col+=vec3(.2,.17,.12)*pow(max(0.,dot(dir,vec3(0.,0.,1.))),200.);
	
	col*=min(1.,time); //fade in

	gl_FragColor = vec4(col,1.0);	
}