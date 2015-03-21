uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//Based on Merry Christmas! by @paulofalcao

float PI=3.14159265;
#define t iGlobalTime
 
void main(void){
	vec2 vPos=-1.0+2.0*gl_FragCoord.xy/iResolution.xy;

	//Camera
	//vuv = view up vector
	//vec3 vuv=normalize(vec3(sin(t)*0.3,1,0));
	vec3 vuv = normalize(vec3(.0,1.,0.));
	
	//vrp = camera target
	//vec3 vrp=vec3(0,cos(t*0.5)*0.01+2.5,0);
	vec3 vrp = vec3(.0,10.,0.);
	
	//prp = camera pos
	vec3 prp = vec3(sin(t*2.)*12.,11.,cos(t*2.)*12.);
	
	//vec3 prp=vec3(sin(t*0.5)*(sin(t*0.39)*.01+3.5),sin(t*0.5)+3.5,cos(t*0.5)*(cos(t*0.45)*2.0+3.5));
	float vpd=1.1;  

	//Camera setup
	//forward vector (camera direction vector)
	vec3 vpn=normalize(vrp-prp);
	vec3 u=normalize(cross(vuv,vpn));
	vec3 v=cross(vpn,u);
	vec3 scrCoord=prp+vpn*vpd+vPos.x*u*iResolution.x/iResolution.y+vPos.y*v;
	vec3 scp=normalize(scrCoord-prp);

	//2d lights
	mat4 cm=mat4(
		u.x,   u.y,   u.z,   -dot(u,prp),
		v.x,   v.y,   v.z,   -dot(v,prp),
		vpn.x, vpn.y, vpn.z, -dot(vpn,prp),
		0.0,   0.0,   0.0,   1.0);
 
	vec4 rz=vec4(0,0,0,0);
	const float maxl=80.0;
	for(float i=0.0;i<maxl;i++)
	{
		vec4 pt =vec4(sin(i/4.)*2.,i/4.,cos(i/4.)*2.,1.);
		
		pt=pt*cm*2.;
		vec2 xy=(pt/(-pt.z/vpd)).xy+vPos*vec2(iResolution.x/iResolution.y,1.);
		
		//brightness
		float c=0.4/length(xy);
		
		//result
		vec4 val=vec4((sin(i/maxl*PI))*c,
				 (cos(i/maxl*PI))*c,
				 (sin(i/maxl))*c,0.0);
		rz+= val;
	}
	rz=rz/maxl;

	rz=smoothstep(0.0,1.1,rz);
	
	gl_FragColor=vec4(vec3(rz),1);
}