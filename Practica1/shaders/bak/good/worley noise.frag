uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4djGRh
// Tileable Cells. By David Hoskins. 2013.

#define NUM_CELLS	20.0	// Needs to be a multiple of TILES!
#define TILES 		1.0		// Normally set to 1.0 for a creating a tileable texture.

vec2 Hash2(vec2 p)
{
	
	float r = 523.0*sin(dot(p, vec2(53.3158, 43.6143)));
	return vec2(fract(15.32354 * r), fract(17.25865 * r));
	
}

float Cells(in vec2 p, in float numCells)
{
	p *= numCells;
	float d = 1.0;
	for (int xo = -1; xo <= 1; xo++)
	{
		for (int yo = -1; yo <= 1; yo++)
		{
			vec2 tp = floor(p) + vec2(xo, yo);
			d = min(d, length(p - tp - Hash2(mod(tp, numCells / TILES))));
		}
	}
	return d;
	// return 1.0 - d;// ...Bubbles.
}

//------------------------------------------------------------------------
void main(void)
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	
	float c = Cells(uv, NUM_CELLS);

	vec3 col = vec3(c*.83, c, min(c*1.3, 1.0));

	gl_FragData[0] = vec4(col, 1.0);
}
