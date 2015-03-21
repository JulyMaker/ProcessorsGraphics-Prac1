// PLASMA EFFECT
//
// We said that the a pixel's color only depends on its coordinates
// and other inputs (such as time)
// 
// There is an effect called Plasma, which is based on a mixture of
// complex function in the form of f(x,y).
//
// Let's write a plasma!
//
// http://en.wikipedia.org/wiki/Plasma_effect

uniform vec3 iResolution;
uniform float iGlobalTime;
#define PI 3.14159265359

void main(void)
{
	vec2 p = vec2(gl_FragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float t = iGlobalTime;
    r = r * 8.0;
	
    float v1 = sin(r.x +t);
    float v2 = sin(r.y +t);
    float v3 = sin(r.x+r.y +t);
    float v4 = sin(sqrt(r.x*r.x+r.y*r.y) +1.7*t);
	float v = v1+v2+v3+v4;
	
	vec3 ret;
	
	if(p.x < 1./10.) { // Part I
		// vertical waves
		ret = vec3(v1);
	} 
	else if(p.x < 2./10.) { // Part II
		// horizontal waves
		ret = vec3(v2);
	} 
	else if(p.x < 3./10.) { // Part III
		// diagonal waves
		ret = vec3(v3);
	}
	else if(p.x < 4./10.) { // Part IV
		// circular waves
		ret = vec3(v4);
	}
	else if(p.x < 5./10.) { // Part V
		// the sum of all waves
		ret = vec3(v);
	}	
	else if(p.x < 6./10.) { // Part VI
		// Add periodicity to the gradients
		ret = vec3(sin(2.*v));
	}
	else if(p.x < 10./10.) { // Part VII
		// mix colors
		v *= 1.0;
		ret = vec3(sin(v), sin(v+0.5*PI), sin(v+1.0*PI));
	}	
	
	ret = 0.5 + 0.5*ret;
	
    vec3 pixel = ret;
    gl_FragColor = vec4(pixel, 1.);
}
