uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/4slGWS
const float detail=.001;
const float Saturation= 1.;
const float ColorDensity= 3.;
const float ColorOffset= 0.;
const vec3 Color1= vec3(.7,.9,.5);
const vec3 Color2= vec3(1.,.7,.5);
const vec3 Color3= vec3(1.,.5,.4)*.5;


#define PI  3.141592

vec3 lightdir=vec3(1.,-1.,0.5);

float colindex;

float ot;

float tree(vec3 p3) {
	vec2 p;
	vec3 np=normalize(p3);
	p.x=atan(np.x,np.z)+np.y*3.;
	p.y=np.y;
	p*=.5;
	ot=1000.;
	for (int i=0; i<8; i++) {
		float l=dot(p,p);
		ot=min(ot,abs(l-1.));
		p=abs(p)/l-.6;
  
	}
	return pow(clamp(length(p*.7),0.,1.),4.);
}

float de (in vec3 p)
{
	float d=length(p)-2.;
	d=(d-tree(p)*.3)*clamp(d*.05,0.05,1.);
	return d;
}

vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,detail,0.0);
	
	return normalize(vec3(
			de(p+e.yxx)-de(p-e.yxx),
			de(p+e.xyx)-de(p-e.xyx),
			de(p+e.xxy)-de(p-e.xxy)
			)
		);	
}

float AO(in vec3 p, in vec3 n) {
	float ao = 0.0;
	float des = de(p);
	float wSum = 0.0;
	float w = 1.0;
    float d = 5.0;
	float aodetail=detail*4.;
	for (float i =1.0; i <6.0; i++) {
		float D = (de(p+ d*n*i*i*aodetail) -des)/(d*i*i*aodetail);
		w *= 0.6;
		ao += w*clamp(1.0-D,0.0,1.0);
		wSum += w;
	}
	return clamp(ao/wSum, 0.0, 1.0);
}

float shadow(in vec3 p) 
{
	vec3 ldir=-normalize(lightdir);
	float totdist=detail; 
	float sh;
	float d=10.;
	for (int i=0; i<50; i++){;
		if (d>detail) {
			d=de(p+totdist*ldir);
			totdist+=d;	
			sh=1.;
		} else sh=.3;
	}
	return sh;
}


vec3 getcolor(float index) {
	float cx=index*ColorDensity+ColorOffset*PI*3.;
	vec3 col;
	float ps=PI/1.5;
	float f1=max(0.,sin(cx));
	float f2=max(0.,sin(cx+ps));
	float f3=max(0.,sin(cx+ps*2.));
	col=mix(Color1,Color2,f1);
	col=mix(col,mix(Color3,Color1,f3),f2);
	col=mix(vec3(length(col)),col,Saturation);
	return col;
}

float light(in vec3 p, in vec3 dir) {
	vec3 ldir=normalize(lightdir);
	vec3 n=normal(p);
	float sh=shadow(p);
	float diff=max(0.,dot(ldir,-n))*sh+.3;
	diff*=(1.-AO(p,n)*.6);
	vec3 r = reflect(ldir,n);
	float spec=max(0.,dot(dir,-r))*sh;
	return diff*.8+pow(spec,15.)*0.4;	
		}

vec3 raymarch(in vec3 from, in vec3 dir) 
{
	float totdist=0., detail=0.005;
	vec3 col, p;
	float d=10.;
	float g=0.;
	for (int i=0; i<200; i++) {
		if (d>detail && totdist<15.) {
			p=from+totdist*dir;
			d=de(p);
			totdist+=d; 
			g+=max(0.,.1-d);
		}
	}
	if (d<detail) {
		col=vec3(.3+tree(p))*light(p-detail*dir*10., dir); 
	} else { 
		col=dir.yyy*.8+vec3(g*.02)+.1;
	}
	return col+vec3(g*.01);
}

// Main code
void main(void)
{
	float ang=iGlobalTime*2.;
	mat2 rot=mat2(cos(ang),sin(ang),-sin(ang),cos(ang));
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv=uv*2.-1.;
	uv.y*=iResolution.y/iResolution.x;
	vec3 from=vec3(0.,0.,-11.+pow(abs(sin(iGlobalTime*.5)),5.)*5.5);
	vec3 dir=normalize(vec3(uv*.5,1.));
	from.xz*=rot; dir.xz*=rot; lightdir.xz*=rot;
	vec3 col=vec3(0.);
	col=raymarch(from,dir); // raymarch a bit from there for the texture
	
	gl_FragColor = vec4(col*1.5+.03,1.0);
}