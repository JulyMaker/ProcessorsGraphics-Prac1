uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4sBGRh
void main(void)
{	
	vec2 uv=gl_FragCoord.xy*(1./128.0);
	float res=min(iResolution.x,iResolution.y);
	float pixel=1.0/res;
	vec2 p = (gl_FragCoord.xy-iResolution.xy*0.5) * pixel;	
	
	float ink=0.0,theta=0.0;
	float rr=res;
	float ofs=0.02+0.00051*iGlobalTime+(iMouse.x)*pixel*0.25;
	for (int iter=0;iter<100;++iter) {
		ink+=  max(0.0,1.0-abs(length(p)-0.37)*rr);
		rr/=1.1;
		p*=1.1;
		p.x+=ofs*sin(theta);
		p.y+=ofs*cos(theta);		
		theta+=iGlobalTime*0.1;
	}
	ink=sqrt(ink)*0.5;	
	vec3 col = vec3(0.75+0.2) * smoothstep(1.0,0.0,ink);	
	gl_FragColor=vec4(pow(col*vec3(0.99,0.98,0.97),vec3(0.55)),1.0);

}