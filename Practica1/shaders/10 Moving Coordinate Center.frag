// MOVING THE COORDINATE CENTER TO THE CENTER OF THE FRAME
//
// Instead of mapping [0, iResolution.x]x[0, iResolution.y] region to
// [0,1]x[0,1], lets map it to [-1,1]x[-1,1]. This way the coordinate
// (0,0) will not be at the lower left corner of the screen, but in the
// middle of the screen.

uniform vec3 iResolution;

void main(void)
{
	vec2 r = vec2( gl_FragCoord.xy - 0.5*iResolution.xy );
	// [0, iResolution.x] -> [-0.5*iResolution.x, 0.5*iResolution.x]
	// [0, iResolution.y] -> [-0.5*iResolution.y, 0.5*iResolution.y]
	r = 2.0 * r.xy / iResolution.xy;
	// [-0.5*iResolution.x, 0.5*iResolution.x] -> [-1.0, 1.0]
	
	vec3 backgroundColor = vec3(1.0);
	vec3 axesColor = vec3(0.0, 0.0, 1.0);
	vec3 gridColor = vec3(0.5);

	// start by setting the background color. If pixel's value
	// is not overwritten later, this color will be displayed.
	vec3 pixel = backgroundColor;
	
	// Draw the grid lines
	// we used "const" because loop variables can only be manipulated
	// by constant expressions.
	const float tickWidth = 0.1;
	for(float i=-1.0; i<1.0; i+=tickWidth) {
		// "i" is the line coordinate.
		if(abs(r.x - i)<0.004) pixel = gridColor;
		if(abs(r.y - i)<0.004) pixel = gridColor;
	}
	// Draw the axes
	if( abs(r.x)<0.006 ) pixel = axesColor;
	if( abs(r.y)<0.007 ) pixel = axesColor;
	
	gl_FragColor = vec4(pixel, 1.0);
}