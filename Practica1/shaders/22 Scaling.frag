// COORDINATE TRANSFORMATIONS: SCALING
//
// Scaling the coordinate system.

uniform vec3 iResolution;

// a function that draws an (anti-aliased) grid of coordinate system
float coordinateGrid(vec2 r) {
	vec3 axesCol = vec3(0.0, 0.0, 1.0);
	vec3 gridCol = vec3(0.5);
	float ret = 0.0;
	
	// Draw grid lines
	const float tickWidth = 0.1;
	for(float i=-2.0; i<2.0; i+=tickWidth) {
		// "i" is the line coordinate.
		ret += 1.-smoothstep(0.0, 0.008, abs(r.x-i));
		ret += 1.-smoothstep(0.0, 0.008, abs(r.y-i));
	}
	// Draw the axes
	ret += 1.-smoothstep(0.001, 0.015, abs(r.x));
	ret += 1.-smoothstep(0.001, 0.015, abs(r.y));
	return ret;
}
// returns 1.0 if inside circle
float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.005, radius+0.005, length(r-center));
}
// returns 1.0 if inside the disk
float rectangle(vec2 r, vec2 topLeft, vec2 bottomRight) {
	float ret;
	float d = 0.005;
	ret = smoothstep(topLeft.x-d, topLeft.x+d, r.x);
	ret *= smoothstep(topLeft.y-d, topLeft.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.y-d, bottomRight.y+d, r.y);
	ret *= 1.0 - smoothstep(bottomRight.x-d, bottomRight.x+d, r.x);
	return ret;
}

void main(void)
{
	vec2 p = vec2(gl_FragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;	
	
	vec3 bgCol = vec3(1.0);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
		
	vec3 ret = bgCol;
	
	// original
	float scaleFactor = 2.0; // zoom in this much
	ret = mix(ret, col1, coordinateGrid(r)/2.0);
	// scaled
	vec2 q = 0.3*r;
	ret = mix(ret, col2, coordinateGrid(q));

	ret = mix(ret, col2, disk(q, vec2(0.0, 0.0), 0.1));	
	ret = mix(ret, col1, disk(r, vec2(0.0, 0.0), 0.1));
	
	ret = mix(ret, col1, rectangle(r, vec2(-0.5, 0.0), vec2(-0.2, 0.2)) );
	ret = mix(ret, col2, rectangle(q, vec2(-0.5, 0.0), vec2(-0.2, 0.2)) );
	
	// not how the rectangle that are not centered at the coordinate origin
	// changed its location after scaling, but the disks at the center
	// remained where they are.
	// This is because scaling is done by multiplying all pixel
	// coordinates with a constant.
	
	vec3 pixel = ret;
	gl_FragColor = vec4(pixel, 1.0);
}
