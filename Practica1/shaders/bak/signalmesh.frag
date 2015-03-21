uniform vec3 iResolution; 
uniform float iGlobalTime; 
uniform vec4 iLoc; 
uniform float iChannelTime[4]; 
uniform vec3 iChannelResolution[4]; 
uniform sampler2D iChannel0; 
uniform vec3 iMouse; 
uniform vec4 iDate; 
//https://www.shadertoy.com/view/MsSGW1
//Inspired by Farbrausch - 43 and TDA - Embers

//#define lowdef //comment out for more magic

#ifdef lowdef
const float MAXDIST = 30.0;
const float EPSILON = 0.01;
const int   MAXITER = 25;
#else
const float MAXDIST = 100.0;
const float EPSILON = 0.001;
const int   MAXITER = 150;
#endif

struct RayResult {
	vec3 pos;
	vec3 normal;
	float dist;
	float mindist;
	float totaldist;
};

float defRepeat(float p, float s){
	return mod(p,s)-s*0.5;	
}

vec3 rotX(vec3 p, float a){
	mat4 m = mat4(
		1.0,0.0,0.0,0.0,
		0.0,cos(a),sin(a),0.0,
		0.0,-sin(a),cos(a),0.0,
		0.0,0.0,0.0,1.0);
	return (m*vec4(p,1.0)).xyz;
}

vec3 rotZ(vec3 p, float a){
	mat4 m = mat4(
		cos(a),sin(a),0.0,0.0,
		-sin(a),cos(a),0.0,0.0,
		0.0,0.0,1.0,0.0,
		0.0,0.0,0.0,1.0);
	return (m*vec4(p,1.0)).xyz;
}

float cylinderX(vec3 p, float radius){
	return length(p.zy)-radius;
}

float box(vec3 p, vec3 size){
	return length(max(abs(p)-size,0.0));
}

float boxZ(vec3 p, vec2 size){
	return length(max(abs(p.xy)-size,0.0));
}

float rbox(vec3 p, vec3 size, float r){
	return length(max(abs(p)-size,0.0))-r;
}

float mesh(vec3 p, float size, float thick){
	p = mod(p,size)-size*0.5;
	float x = length(max(abs(p.yz)-vec2(size*thick),0.0));
	float y = length(max(abs(p.xz)-vec2(size*thick),0.0));
	float z = length(max(abs(p.xy)-vec2(size*thick),0.0));
	return min(x,min(y,z))-thick*0.1;
}


float sceneDist(vec3 p){
	p = rotZ(p,0.4*sin(p.z*0.4+iGlobalTime)+iGlobalTime);
	
	float v1 = mesh(p,0.35,0.1);
	
	float b1 = boxZ(p,vec2(1.0,1.0));
	
	return max(b1,v1);
}

vec3 getNormal(vec3 pos){
	vec2 eps = vec2(0.0, EPSILON);
	return normalize(vec3(
			sceneDist(pos + eps.yxx) - sceneDist(pos - eps.yxx),
			sceneDist(pos + eps.xyx) - sceneDist(pos - eps.xyx),
			sceneDist(pos + eps.xxy) - sceneDist(pos - eps.xxy)));
}

RayResult castRay(vec3 rPos, vec3 rDir){
	RayResult result;
	result.dist=MAXDIST;
	result.mindist=MAXDIST;
	result.totaldist=0.0;
	
	for (int i = 0; i < MAXITER; i++)
	{
		
		if (result.dist < result.mindist) { result.mindist = result.dist;}
		if (result.dist < EPSILON || result.dist > MAXDIST) {continue;}
		
		result.dist = sceneDist(rPos); // Evalulate the distance at the current point
		result.totaldist += result.dist;
		rPos += result.dist * rDir; // Advance the point forwards in the ray direction by the distance
	}
	result.pos = rPos;
	result.normal = getNormal(result.pos);
	return result;
}


vec3 getC(float x, float k){
	float y=clamp(1.0-x,0.0,1.0);
	x = clamp(x,0.0,1.0);
	y *= k;
	return vec3(exp(-y*0.1)+0.2,
				exp(-y*0.3),
				exp(-y*0.7)
			   )*(1.0-exp(-x*k));
}

float ss(float x){
	return 0.5+0.5*sin(x);
}

#define mBpm 147.75 // useless really
const float sBeat = 1.0/(mBpm / 60.0);
#define mStart 9.75
vec3 getCamPos(){
	vec3 p;
	float t = iChannelTime[0];
	if(t<mStart){
		p = vec3(-2.0,0.0,0.0);
	}
	else if(t<mStart+sBeat*32.0){
		p = vec3(-4.0*sin(-t*0.3),-4.0*cos(-t*0.3),0.0);	
	}
	else if(t<mStart+sBeat*64.0){
		p = vec3(0.0,0.0,t*0.2);	
	}	
	else if(t<mStart+sBeat*96.0){
		p = vec3(1.7,-3.0,-t*30.0);	
	}	
	else{
		p = vec3(1.7,-2.0,-t*15.0);	
	}
	
	return p;
}

vec3 getCamTarget(){
	vec3 p;
	float t = iChannelTime[0];
	if(t<mStart){
		p = vec3(0.0,0.0,0.0);
	}
	else if(t<mStart+sBeat*64.0){
		p = vec3(0.0,0.0,3.0);	
	}else if(t<mStart+sBeat*96.0){
		p = vec3(0.0,0.0,-t*30.0-2.5*ss(t*0.7));
	}else{
		p = vec3(0.0,0.0,-t*15.0+3.0);	
	}
	
	return p;	
}

vec3 renderWorld(vec2 uv){
	
	float t = iGlobalTime;
	
	
	vec3 camPos = getCamPos();
	vec3 camTarget = getCamTarget();
	
	vec3 camDir = normalize(camTarget-camPos);
	vec3 camRight = normalize(cross(camDir,vec3(0.0,1.0,0.0))); // right is normal to forward and up
	vec3 camUp = normalize(cross(camDir,camRight)); // up is normal to forward and right
	
	
	RayResult ray = castRay(camPos,normalize(camRight*uv.x + camUp*uv.y + camDir));
	
	vec3 c;
	
	if(ray.dist<EPSILON){
		float vDiffuse = max(0.0, dot(ray.normal,-camDir )   );
		
		c = getC(vDiffuse+0.4*pow(ss(ray.pos.z*0.5-iGlobalTime*6.0),5.0),
				 40.0);
	}else{
		c = getC(1.0-clamp(ray.mindist,0.0,.8),400.0);	
	}
	
	return c;
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy / iResolution.xy - 0.5) //centre
		* vec2(2.0,2.0/(iResolution.x/iResolution.y)); //normalise x to [-1,1], y adjusts aspect
	
	
	vec3 c = renderWorld(uv);
	
	gl_FragColor = vec4(c,1.0);
}