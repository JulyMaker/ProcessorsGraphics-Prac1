uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4sSGD1

void main(void)
{
	vec2 pixel = gl_FragCoord.xy - iResolution.xy*.5;
	
	// pixellate
	const float pixelSize = 4.0;
	pixel = floor(pixel/pixelSize);
	
	vec2 offset = vec2(iGlobalTime*3000.0,pow(max(-sin(iGlobalTime*.2),.0),2.0)*16000.0)/pixelSize;
	
	vec3 col;
	for ( int i=0; i < 8; i++ )
	{
		// parallax position, whole pixels for retro feel
		float depth = 20.0+float(i);
		vec2 uv = pixel + floor(offset/depth);
		
		uv /= iResolution.y;
		uv *= depth/20.0;
		uv *= .4*pixelSize;
		
		col = texture2D( iChannel0, uv+.5 ).rgb;
		
		if ( 1.0-col.y < float(i+1)/8.0 )
		{
			col = mix( vec3(.4,.6,.7), col, exp2(-float(i)*.1) );
			break;
		}
	}
	
	gl_FragColor = vec4(col,1.0);
}