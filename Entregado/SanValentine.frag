uniform float iGlobalTime; 
uniform vec3 iResolution; 
uniform vec4 iDate;
uniform vec3 iMouse;
uniform sampler2D iChannel0; 
uniform vec4 iLoc;

///SAN VALENTIN SHADER
/*
vec3 bgCol = vec3(0.3);
vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
vec3 col3 = vec3(0.867, 0.910, 0.247); // red
vec3 red = vec3(1.,0.,0.);
vec3 black = vec3(0.,0.,0.);
vec3 white = vec3(1.,1.,1.);

#define PI 3.141592653589

vec3 heart(float dx, float dy, float r, float scale, float phase)
{
	float phasedtime = iGlobalTime + phase * 2. * PI;
	mat2 rotationmatrix = mat2( cos(r), -sin(r), sin(r), cos(r));
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	vec2 xy = uv - vec2(0.5, 0.5);
	xy = xy* rotationmatrix;
	float x = xy.x - dx;
	float y = xy.y - dy;
	x = x / scale;
	y = y / scale;
	//float val = pow(x,1.9)+pow((y-pow(x,2.2/3.0)),2.2);
    float val = pow(abs(x),1.9)+pow(abs(y-pow(abs(x),2.2/3.0)),2.2);
	val = val * (sin(phasedtime*(3.+2.*phase))*0.1+1.0);

	if (val < 0.01)
	{
		float t = val * 100.;
		t = pow(t, 2.);
		return (mix(red,mix(red,black,0.6),t));
	}
	else
		return (black);
}

float disk(vec2 r, vec2 center, float radius) {
	return 1.0 - smoothstep( radius-0.5, radius+0.5, length(r-center));
}

vec3 flower(vec2 p, float m)
{
   	vec3 col=vec3(0.0);
   	p -= vec2(1.5-0.2*sin(iGlobalTime*m),1.5);
   	float r = sqrt(dot(p,p));
   	float f=1.1;
   	float listki=5.0;
  	float at = atan(p.y/p.x);
   	float phi =  at+(sin(iGlobalTime*m)-sin(iGlobalTime*m+0.4)*sin(r));
	float phi2 = at+sin(iGlobalTime*m*1.0+0.3)-sin(iGlobalTime*m*1.0+0.6)*sin(r);

  	if(r<exp(r*2.6)*0.1+(0.01+abs(sin(listki*phi)))) 
      f=r;           
   	else
      col = mix( vec3(0.9,0.9,0.9), vec3(0.9,0.7,0.7),f) ;

   	if(r<0.1+abs(sin(listki*phi2+(1.0+sin(iGlobalTime))*0.5)))
   	{   
   	  f = r; 
      col = mix( vec3(0.97+0.0025*m,0.97+0.0025*m,0), vec3(1,1,1), 10.0*f) ;
   	}
   	return col;
}

//vec3 box()

void main(void)
{
	vec2 p = vec2(gl_FragCoord.xy / iResolution.xy);
	vec2 r =  2.0*vec2(gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
	float xMax = iResolution.x/iResolution.y;
	
	// background color depends on the x coordinate of the cursor
	vec3 bgCol = vec3(iMouse.x / iResolution.x);
	vec3 col1 = vec3(0.216, 0.471, 0.698); // blue
	vec3 col2 = vec3(1.00, 0.329, 0.298); // yellow
	vec3 col3 = vec3(0.867, 0.910, 0.247); // red
	
	vec3 ret = bgCol;
	
	vec2 center;
	// draw the big yellow disk
	center = vec2(100., iResolution.y/2.);
	float radius = 60.;
	// if the cursor coordinates is inside the disk
	if( length(iMouse.xy-center)>radius ) {
		// use color3
		ret = mix(ret, col3, disk(gl_FragCoord.xy, center, radius));
	}
	else {
		// else use color2
		ret = mix(ret, col2, disk(gl_FragCoord.xy, center, radius));
	}	
	
	// draw the small blue disk at the cursor
	center = iMouse.xy;
	//ret = mix(ret, col1, disk(gl_FragCoord.xy, center, 20.));
	//ret = mix(ret, red, smoothstep( -0.01, 0.01, heart(iMouse)));
	ret = mix(ret, red, heart(0.4,-0.15,.2,0.8,0.55));
	ret = mix(ret, red, flower((p.xy+vec2(-0.5,-0.8))*9.2,5.5));
	
	//ret *= length (p - iMouse);

	vec3 pixel = ret;
	gl_FragColor = vec4(pixel, 1.0);
}
*/

//#define MaxIter 128
#define MaxIter 100
#define PI 3.141592653589
const vec3 Center = vec3(0.0, -0.63, 0.0);
const float Scale = 0.58;
const float n = 6.0;

const vec3 bgCol = vec3(0.3,0.3,0.3);
vec3 InsideColor = vec3(0,0,0);
const vec3 OutsideColor1 = vec3(0,0,1);
const vec3 OutsideColor2 = vec3(0.8,0.2,0);
vec3 red = vec3(1.,0.,0.);
vec3 black = vec3(0.,0.,0.);
vec3 white = vec3(1.,1.,1.);
vec3 pink = vec3(1.,.5,.9);

vec2 halfRes = iResolution.xy / vec2(2.0);

vec3 mandelbulb_slice(vec3 Pos)
{
    float R;
    
    float x = Pos.x / Scale - Center.x;
    float y = Pos.y / Scale - Center.y;
    float z = Pos.z / Scale - Center.z;

    int Iter2 = 0;
    for(int Iter = 0; Iter < MaxIter; ++Iter)
    {
        // source of formula: skytopia.com mandelbulb
        float r = sqrt(x * x + y * y + z * z);
        float theta = atan(sqrt(x * x + y * y), z);
        float phi = atan(y, x);

        if(r > 2.0)
        {
            R = r;
            Iter2 = Iter;
            break;
        }

        float r_pow_n = pow(r, n);

        float newx = x + r_pow_n * sin(theta * n) * cos(phi * n);
        float newy = y + r_pow_n * sin(theta * n) * sin(phi * n);
        float newz = z + r_pow_n * cos(theta * n);
        x = newx;
        y = newy;
        z = newz;
    }

    vec3 OutsideColor = mix(pink, OutsideColor2, fract(float(Iter2) * 0.2));
    vec3 Color = mix(InsideColor, OutsideColor, step(0.5, R));

    return Color;
}

float distHeart(vec2 pos, float scale) {
	float amp = 0.5;

	float size = 1.0 * cos(amp);
	float sizePow = size < 0.0 ? 8.0 : 67.0;
	size = 0.7 + 0.3 * abs(pow(size, sizePow));
	pos /= (scale * size);

	pos.y -= 0.3;
	float xx1 = pos.x * 7.0;
	pos.y += 0.1 * cos(abs(xx1));
	float xx2 = max(0.0, 0.5 - abs(pos.x));
	pos.y += 0.5 * abs(xx2);
	float r = length(pos) * 3.0;

    return 1.0 - clamp(75.0 * (1.0 - r), 0.0, 1.0);
}

float distSmallHearts(vec2 pos) {
	float dis = 3.0;
	int i = 0;
	for (int i = 0 ; i < 40 ; ++i) {
		float ii = 3 * float(i) / 2;
		float jj = ii;
		float kk = 5.0 * ii;
		float x = cos(jj) + 0.15 * tan(kk + 8.0 * iGlobalTime);
		float y = 1.4 * sin(jj + 0.7 * iGlobalTime) + 0.35 * cos(kk + 5.4 * iGlobalTime);
		vec2 xy = 0.002 * halfRes * vec2(x,y);
		dis = min(dis, distHeart(pos + xy, 0.1));
	}
	return dis;
}

float heart(vec2 p,float t)
{
	// shape
    float a = atan(p.x,p.y*1.5)/3.14;
    float r = length(p);
    float h = abs(a);
    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);

    return d-r;
}

void main(void)
{
	vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/min(iResolution.y,iResolution.x);
	
	p.y -= 0.25;

    
	// color
	vec3 bgCol = vec3(iMouse.x / iResolution.x);

	//vec3 man = mandelbulb_slice(vec3(p, 0.5 * sin(2.0 * PI * iGlobalTime / 10.0)));
	vec2 center = vec2(iResolution.x/2., iResolution.y/2.-0.6);
	float radius = 	200.0;
	if( length(iMouse.xy-center)>radius ) {
		// use white inside the heart
		InsideColor=(1.,1.,1.);
	}
	else {
		// use white inside the heart
		InsideColor=bgCol;
	}

	vec3 man = mandelbulb_slice(vec3(p, 0.5 * sin(2.0 * PI * iGlobalTime / 10.0)));
	
	vec2 smallPos = p * 1.5 + vec2(0.66, 0.0);
	vec3 col = mix(pink,bgCol,min (bgCol, distSmallHearts(smallPos)));
	
	col = mix( col, man, smoothstep( -0.01, 0.01, heart(p,iGlobalTime)) );

    gl_FragColor = vec4(col,1.0);
}


