uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/XdB3zw
#define t iGlobalTime/4.0

void main(void) {
	vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
	vec2 mp = iMouse.xy/iResolution.xy*0.5+0.5;
		
	float s = 1.0;
	for (int i=0; i < 7; i++) {
		s = max(s,abs(p.x)-0.375);
		p = abs(p*2.25)-mp*1.25;
		p *= mat2(cos(t+mp.x),-sin(t+mp.y),sin(t+mp.y),cos(t+mp.x));
	}
	
	vec3 col = vec3(4.0,2.0,1.0)/abs(atan(p.y,p.x))/s;
	
	gl_FragColor = vec4(col,1.0);
}