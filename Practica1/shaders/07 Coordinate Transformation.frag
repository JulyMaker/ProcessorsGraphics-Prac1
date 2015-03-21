// COORDINATE TRANSFORMATION
// 
// Instead of working on screen coordinates, using our own coordinate
// system is more convenient most of the time.
//
// Here we will make and use a new coordinate system "r", instead of
// the absolute screen coordinates "gl_FragCoord". In "r"
// the x and y coordinates will go from 0 to 1. For x, 0 is the left
// side and 1 is the right side. For y, 0 is the bottom side, and 1 is
// the upper side.
//
// Using "r" let's divide the screen into 3 parts.

uniform vec3 iResolution;

void main(void)
{
	vec2 r = vec2(gl_FragCoord.x / iResolution.x,
				  gl_FragCoord.y / iResolution.y);
	// r is a vec2. Its first component is pixel x-coordinate divided by
	// the frame width. And second component is the pixel y-coordinate
	// divided by the frame height.
	//
	// For example, on my laptop, the full screen frame size is
	// 1440 x 900. Therefore iResolution is (1440.0, 900.0).
	// The main function should be run 1440*900=1296000 times to
	// generate a frame.
	// gl_FragCoord.x will have values between 0 and 1439, and
	// gl_FragCoord.y will have values between 0 and 899, whereas
	// r.x and r.y will have values between [0,1].
	
	vec3 color1 = vec3(0.841, 0.582, 0.594);
	vec3 color2 = vec3(0.884, 0.850, 0.648);
	vec3 color3 = vec3(0.348, 0.555, 0.641);
	vec3 pixel;
	
	// sugar syntax for "if" conditional. It says
	// "if the x coordinate of a pixel is greater than the half of
	// the width of the screen, then use color1, otherwise use
	// color2."
	if( r.x < 1.0/3.0) {
		pixel = color1;
	} else if( r.x < 2.0/3.0 ) {
		pixel = color2;
	} else {
		pixel = color3;
	}
			
	// pixel = ( r.x < 1.0/3.0 ) ? color1 : (r.x<2.0/3.0) ? color2: color3;
	// same code, single line.
	
	gl_FragColor = vec4(pixel, 1.0);
}