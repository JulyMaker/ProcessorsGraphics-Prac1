// RGB COLOR MODEL AND COMPONENTS OF VECTORS
//
// After initialized, the components of vectors can be reached using
// the dot "." notation.
//
// RGB: http://en.wikipedia.org/wiki/RGB_color_model
// A color is represented by three numbers (here in the range [0.0, 1.0])
// The model assumes the addition of pure red, green and blue lights
// of given intensities.
//
// If you lack design skills like me, and having hard time
// in choosing nice looking, coherent set of colors 
// you can use one of these websites to choose color palettes, where
// you can browse different sets of colors 
// https://kuler.adobe.com/create/color-wheel/
// http://www.colourlovers.com/palettes
// http://www.colourlovers.com/colors
void main(void)
{
	// play with these numbers:
	float redAmount = 0.6; // amount of redness
	float greenAmount = 0.2; // amount of greenness
	float blueAmount = 0.9; // amount of blueness
	
	vec3 color = vec3(0.0); 
	// Here we only input a single argument. It is a third way of
	// contructing vectors.
	// "vec3(x)" is equivalent to vec3(x, x, x);
	// This vector is initialized as
	// color.x = 0.0, color.y = 0.0; color.z = 0.0;
	color.x = redAmount;
	color.y = greenAmount;
	color.z = blueAmount;
	
	float alpha = 1.0;
	vec4 pixel = vec4(color, alpha);	
	gl_FragColor = pixel;
}