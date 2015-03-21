uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/MsjGDz

void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	float pattern= 0.5*texture2D(iChannel0,0.1*uv).x;
	pattern+= 0.25*texture2D(iChannel0,0.2*uv).x;
	pattern+= 0.125*texture2D(iChannel0,0.4*uv).x;
	pattern+= 0.0625*texture2D(iChannel0,0.8*uv).x;
	//shapes
	float pattern1=smoothstep(0.15,0.16,pattern);
	float pattern2=smoothstep(0.17,0.18,pattern);
	float pattern3=smoothstep(0.2,0.21,pattern);
	float pattern4=smoothstep(0.23,0.24,pattern);
	float pattern5=smoothstep(1.16,1.2,uv.y+pattern)*smoothstep(0.26,0.31,pattern);
	float pattern6=smoothstep(0.31,0.32,pattern);
	float pattern7=smoothstep(0.36,0.37,pattern);
	//cols
	vec3 orange=vec3(247.0,184.0,27.0);
	vec3 sand=vec3(244.0,204.0,112.0);
	vec3 yellow=vec3(229.0,234.0,114.0);
	vec3 grass=vec3(200.0,222.0,121.0);
	vec3 green=vec3(151.0,204.0,83.0);
	vec3 sky=vec3(93.0,191.0,233.0);
	vec3 blue=vec3(35.0,182.0,237.0);
	vec3 white=vec3(248.0,252.0,253.0);
	//draw
	vec3 land = mix(mix( mix( mix(orange,
								  sand,  pattern1),
							      yellow,pattern2),
						          grass, pattern3),
					              green, pattern4);
									  
									  

	vec3 water = mix(sky,blue,pattern7);
	vec3 col_map=mix(land,water,pattern6);
	col_map = mix(col_map,white, pattern5);
	col_map*= 1.1-0.3*pattern;
	
	//grid
	float i = mod(uv.x*20.0,2.0);
	i = smoothstep(1.95,1.98,i);
	vec3 col_grid=vec3(74.0,144.0,172.0);
	gl_FragColor = vec4(mix(col_map,col_grid,i)/255.0,1.0);
	//gl_FragColor = vec4(col/255.0,1.0);
}
