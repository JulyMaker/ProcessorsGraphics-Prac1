uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4dl3zS
//based on Rotated Ball 2D by maq/floppy
#define R 0.2      // to play

float hash( float n )
{
    return fract(sin(n)*43758.5453);
}

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
			d = min(d, length(p - tp - Hash2(mod(tp, numCells))));
		}
	}
	//return d;
	return 1.0 - d;// ...Bubbles.
}

float grid(vec2 uv,float size)
{
	float rz;
	float uvx = uv.x / size*10.;
	float uvy = uv.y / size*10.;
		
	rz += mod(uvx,1.);
	rz += mod(uvy,1.);
	rz = pow(rz,1000.)*0.09;

	return rz;
}

float tgrid(vec2 uv, float size, bool dots)
{
	float rz;
	float uvx = uv.x / size;
	float uvy = uv.y / size;
	
	rz = max(pow((sin(uvx*60.)),4.)-0.85,0.)*3.; //-0.85
	rz += max(pow((sin(uvy*60.)),4.)-0.85,0.)*3.;
	if (dots)rz = smoothstep(0.3,0.9,max(0.5,rz));
	else rz+=(rz*5.);
	return rz;
}

void main(void)
{
	float t = iGlobalTime;
	vec3 col;
	vec2 uv = -0.5+gl_FragCoord.xy / iResolution.xy;
	uv.y *= iResolution.y/iResolution.x;
	//uv.y*=0.666; // hack to get ar nice on 16:10
	//uv /= sin(t*0.5)-2.;
	vec2 p = uv;
	float d=sqrt(dot(p,p));
	float fac,fac2;
	p *= 3.;
	if(d<R)
	{
		uv.x=p.x/(R+sqrt(R-d));
		uv.y=p.y/(R+sqrt(R-d));
		fac = 0.005;
		fac2 = 5.0;
	}
	else
	{
		uv.x-=sin(0.2*t)*0.6-iMouse.x*0.002;
		uv.y-=sin(0.4*t)*0.6-iMouse.y*0.002;
		//uv = uv;
		/*uv.x=p.x/(d*d);
		uv.y=p.y/(d*d);
		fac = 0.02;
		fac2 = 25.0;*/
	}
	
	uv.x=uv.x-iMouse.x*fac+fac*500.0*sin(0.2*t);
	uv.y=uv.y-iMouse.y*fac+fac*500.0*sin(0.4*t);
	
	
	col = vec3(Cells(uv,5.));
	//col = vec3(grid(uv,5.));
	//col = vec3(tgrid(uv,4.,true));
	
	col = col*exp(-3.0*(d-R)); // some lighting
	col = col*(1.1-exp(-8.0*(abs(d-R)))); // and shading
	col.g *= sin(t*2.)*.1+.4;
	col.b *= .001*uv.x;
	col = smoothstep(0.,.8,col);
	
	gl_FragColor = vec4(col,1.0);
}