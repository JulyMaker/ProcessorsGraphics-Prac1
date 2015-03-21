uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/ldX3Wn
void main(void)
{
	vec2 p=(2.0*gl_FragCoord.xy-iResolution.xy)/max(iResolution.x,iResolution.y);
	
	for(int i=1;i<40;i++)
	{
		float t = iGlobalTime;
		vec2 newp=p;
		newp.x+=0.5/float(i)*cos(float(i)*p.y+iGlobalTime*cos(t)*0.3/40.0+0.03*float(i))+10.0;		
		newp.y+=0.5/float(i)*cos(float(i)*p.x+iGlobalTime*t*0.3/50.0+0.03*float(i+10))+15.0;
		p=newp;
	}
	
	vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}