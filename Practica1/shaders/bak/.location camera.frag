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
#define t iGlobalTime*2.
 
void main(void){
	vec2 vPos=-1.0+2.0*gl_FragCoord.xy/iResolution.xy;
	vec2 mPos= ((iMouse.xy/iResolution.xy)-0.5);
	//Camera
	vec3 vuv = normalize(vec3(.0,1.,0.));
	
	//prp = camera pos
	vec3 prp = vec3(iLoc.x*100,iLoc.z*100+10,iLoc.y*100.-40);
	
	//vpd = fov (higher number = lower field of view)
	float vpd=3.;  

	if (iMouse.x == 0)
	{
		mPos.y += .5;
		mPos.x += .5;
	}
	//forward vector (camera direction vector)
	vec3 vpn=normalize(vec3(mPos,1.));
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
		vec4 pt =vec4(sin(i/4.+t)*2.,i/4.,cos(i/4.+t)*5.,1.);
		pt=pt*cm;
		vec2 xy=(pt/(-pt.z/vpd)).xy+vPos*vec2(iResolution.x/iResolution.y,1.);
		//brightness
		float c=0.15/length(xy);
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