// TIME, MOTION AND ANIMATION
//
// One of the inputs that a shader gets can be the time.
// In ShaderToy, "iGlobalTime" variable holds the value of the
// time in seconds since the shader is started.
//
// Let's change some variables in time!

uniform vec3 iResolution;
uniform float iGlobalTime;
#define PI 3.14159265359
#define TWOPI 6.28318530718

float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}

float rect(vec2 r, vec2 bottomLeft, vec2 topRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(bottomLeft.x-d, bottomLeft.x+d, r.x);
	ret *= smoothstep(bottomLeft.y-d, bottomLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(topRight.y-d, topRight.y+d, r.y);
	ret *= 1.0 - smoothstep(topRight.x-d, topRight.x+d, r.x);
	return ret;
}

void main(void)
{
	vec2 p = vec2(gl_FragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret;
		
	if(p.x < 1./5.) { // Part I
		vec2 q = r + vec2(xMax*4./5.,0.);
		ret = vec3(0.2);
		// y coordinate depends on time
		float y = iGlobalTime;
		// mod constraints y to be between 0.0 and 2.0,
		// and y jumps from 2.0 to 0.0
		// substracting -1.0 makes why jump from 1.0 to -1.0
		y = mod(y, 2.0) - 1.0;
		ret = mix(ret, col1, disk(q, vec2(0.0, y), 0.1) );
	} 
	else if(p.x < 2./5.) { // Part II
		vec2 q = r + vec2(xMax*2./5.,0.);
		ret = vec3(0.3);
		// oscillation
		float amplitude = 0.8;
		// y coordinate oscillates with a period of 0.5 seconds
		float y = amplitude*sin(0.5*iGlobalTime*TWOPI);
		// radius oscillates too
		float radius = 0.15 + 0.05*sin(iGlobalTime*8.0);
		ret = mix(ret, col1, disk(q, vec2(0.0, y), radius) );		
	} 
	else if(p.x < 3./5.) { // Part III
		vec2 q = r + vec2(xMax*0./5.,0.);
		ret = vec3(0.4);
		// booth coordinates oscillates
		float x = 0.2*cos(iGlobalTime*5.0);
		// but they have a phase difference of PI/2
		float y = 0.3*cos(iGlobalTime*5.0 + PI/2.0);
		float radius = 0.2 + 0.1*sin(iGlobalTime*2.0);
		// make the color mixture time dependent
		vec3 color = mix(col1, col2, sin(iGlobalTime)*0.5+0.5);
		ret = mix(ret, color, rect(q, vec2(x-radius, y-radius), vec2(x+radius, y+radius)) );		
		// try different phases, different amplitudes and different frequencies
		// for x and y coordinates
	}
	else if(p.x < 4./5.) { // Part IV
		vec2 q = r + vec2(-xMax*2./5.,0.);
		ret = vec3(0.3,0.0,0.6);
		for(float i=-1.0; i<1.0; i+= 0.2) {
			float x = 0.2*cos(iGlobalTime*5.0 + i*PI);
			// y coordinate is the loop value
			float y = i;
			vec2 s = q - vec2(x, y);
			// each box has a different phase
			float angle = iGlobalTime*5. + i;
			mat2 rot = mat2(cos(angle), -sin(angle), sin(angle),  cos(angle));
			s = rot*s;
			ret = mix(ret, col1, rect(s, vec2(-0.06, -0.06), vec2(0.06, 0.06)) );			
		}
	}
	else if(p.x < 5./5.) { // Part V
		vec2 q = r + vec2(-xMax*4./5., 0.);
		ret = vec3(0.2);
		// let stop and move again periodically
		float speed = 2.0;
		float t = iGlobalTime*speed;
		float stopEveryAngle = PI/2.0;
		float stopRatio = 0.9;
		float t1 = (floor(t) + smoothstep(0.0, 1.0-stopRatio, fract(t)) )*stopEveryAngle;
		
		float x = -0.2*cos(t1);
		float y = 0.3*sin(t1);
		float dx = 0.1 + 0.03*sin(t*10.0);
		float dy = 0.1 + 0.03*sin(t*10.0+PI);
		ret = mix(ret, col1, rect(q, vec2(x-dx, y-dy), vec2(x+dx, y+dy)) );		
	}
	
	vec3 pixel = ret;
	gl_FragColor = vec4(pixel, 1.0);
}