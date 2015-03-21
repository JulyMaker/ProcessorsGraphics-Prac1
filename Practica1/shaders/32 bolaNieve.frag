uniform float iGlobalTime; 
uniform vec3 iResolution; 
uniform vec4 iDate;
uniform sampler2D iChannel0; 
uniform vec4 iLoc;
 
#define PI (3.1415926535897932384626433832795)
 
const vec3 e = vec3(0.001,0.0,0.0);
 
#define GetNormal(fun, p) normalize(vec3(fun(p+e.xyy) - fun(p-e.xyy), fun(p+e.yxy) - fun(p-e.yxy), fun(p+e.yyx) - fun(p-e.yyx)));
 
float dot2( in vec3 v ){return dot(v,v);}
float sdPlane( vec3 p, vec4 n ){return dot(p,n.xyz) + n.w;}
float sdSphere( vec3 p, float s ){return length(p)-s;}
float udRoundBox( vec3 p, vec3 b, float r ) {return length(max(abs(p)-b,0.0))-r;}
float udBox( vec3 p, vec3 b )                                                       {return length(max(abs(p)-b,0.0));}
float sdCappedCylinder( vec3 p, vec2 h ){
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}
 
float phong(vec3 l, vec3 e, vec3 n, float power){
    float nrm = (power + 8.0) / (PI * 8.0);
    return pow(max(dot(l,reflect(e,n)),0.0), power) * nrm;
}

 
mat3 rX(float a) {return mat3(1.0,0.0,0.0,0.0,cos(a),-sin(a),0.0,sin(a), cos(a));}
mat3 rY(float a) {return mat3(cos(a),0.0,sin(a),0.0,1.0,0.0,-sin(a),0.0,cos(a));}
mat3 rZ(float a) {return mat3(cos(a),-sin(a),0.0,sin(a),cos(a),0.0,0.0,0.0,1.0);}
 
vec3 triPlanar(in sampler2D tex, in vec3 p, in vec3 n)
{
    mat3 texMat = mat3(texture2D(tex, p.yz).rgb, texture2D(tex, p.xz).rgb, texture2D(tex, p.xy).rgb);
    return texMat * abs(n);;
}
 
//----------------------------------------------------------------
// SHAPES
const float maxd = 10.0;
 
float shapeBall(in vec3 pos){
    return sdSphere( pos, 0.6 );
}
 
float traceBall(in vec3 pos, in vec3 ray){
                float r = 0.6; 
                float t = dot(-pos,ray);              
                float p = length(-pos-t*ray);
                if ( p > r )
                     return 0.0;
                return t-sqrt(r*r-p*p);
}
 
float shapeSupport(in vec3 pos){
    vec3 p = pos;
    p.y += 0.45;
   
    return sdCappedCylinder(p, vec2(0.55, 0.2)) - 0.03;;
}
 
float traceSupport(in vec3 pos, in vec3 ray)
{
    float h = 1.0;
    float t = 0.0;
    for( int i=0; i<60; i++ )
    {
        if( h<0.01 || t>maxd ) break;
        h = shapeSupport(pos+ray*t);
        t += h;
    }
 
    if( t>maxd ) t=-1.0;
               
    return t;
}
 
float smin( float a, float b, float k ){
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
 
float hash( float n ){
	return fract(sin(n)*43758.5453123);
}
 
float noise( in vec3 x ){
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
    return res;
}
 
float shapeSnow(in vec3 pos){
    float dp = sdPlane( pos, vec4(0.0, 1.0, 0.0, 0.3) );
   
    vec3 poss1 = pos + vec3(0.0, 0.2, 0.0);
    poss1 *= 0.99 + noise(pos * 200.0) * 0.01;
   
    vec3 poss2 = pos - vec3(0.0, 0.05, 0.0);
    poss2 *= 0.99 + noise(pos * 200.0) * 0.02;
   
    // Definición de la R de Raquel
    vec3 aux=vec3(poss2.x+0.1,poss2.y+0.05,poss2.z+0.01);
    float ds1 = sdSphere(aux, 0.10);
    aux=vec3(poss2.x+0.1,poss2.y+0.2,poss2.z+0.01);
    float ds2 = sdSphere(aux,0.10);
    aux=vec3(poss2.x+0.1,poss2.y-0.11,poss2.z+0.01);
    float ds3 = sdSphere(aux,0.10);
    aux=vec3(poss2.x+0.1,poss2.y-0.28,poss2.z+0.01);
    float ds4 = sdSphere(aux,0.10);
    aux=vec3(poss2.x-0.08,poss2.y-0.3,poss2.z+0.01);
    float ds5 = sdSphere(aux,0.10);
    aux=vec3(poss2.x-0.17,poss2.y-0.15,poss2.z+0.01);
    float ds6 = sdSphere(aux,0.10);
    aux=vec3(poss2.x-0.08,poss2.y-0.06,poss2.z+0.01);
    float ds7 = sdSphere(aux,0.10);
    aux=vec3(poss2.x-0.14,poss2.y+0.10,poss2.z+0.01);
    float ds8 = sdSphere(aux,0.10);
    aux=vec3(poss2.x-0.2,poss2.y+0.2,poss2.z+0.01);
    float ds9 = sdSphere(aux,0.10);
    
   
    ds1 = smin(ds1, ds2, 0.03);
    ds1 = smin(ds1, ds3,0.03);
    ds1 = smin(ds1, ds4,0.03);
    ds1 = smin(ds1, ds5,0.03);
    ds1 = smin(ds1, ds6,0.03);
    ds1 = smin(ds1, ds7,0.03);
    ds1 = smin(ds1, ds8,0.03);
    ds1 = smin(ds1, ds9,0.03);
    dp = smin(dp, ds1, 0.05);
   
    return max(dp, shapeBall(pos + 0.1));
}
 
vec3 normSnow(in vec3 po){
    return normalize(vec3(
        shapeSnow(po+e.xyy) - shapeSnow(po-e.xyy),
        shapeSnow(po+e.yxy) - shapeSnow(po-e.yxy),
        shapeSnow(po+e.yyx) - shapeSnow(po-e.yyx)));
}
 
float traceSnow(in vec3 pos, in vec3 ray){
    float h = 1.0;
    float t = 0.0;
    for( int i=0; i<60; i++ ){
        if( h<0.01 || t>maxd ) break;
        h = shapeSnow(pos+ray*t);
        t += h;
    }
 
    if( t>maxd ) t=-1.0;
               
    return t;
}
 
 
//----------------------------------------------------------------
 
float map( in vec3 pos )
{
    float d1 = shapeBall(pos);
    float d3 = shapeSupport(pos);
   
    return min(d1, d3);
}
 
//----------------------------------------------------------------
// SHADING
vec3 lig = normalize(vec3(1.0,0.9,0.7));
 
float calcSoftshadow( in vec3 _lo, in float _k ){
    float _res = 1.0;
    float _t = 0.0;
                float _h = 1.0;
   
    for( int _i=0; _i<16; _i++ )
    {
        _h = map(_lo + lig * _t);
        _res = min( _res, _k *_h / _t );
                                _t += clamp( _h, 0.01, 1.0 );
                               
        if( _h<0.001 ) break;
    }
   
    return clamp(_res,0.0,1.0);
}
 
float calcOcclusion( in vec3 pos, in vec3 nor )
{
    float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<4; i++ )
    {
        float hr = 0.02 + 0.025*float(i*i);
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return 1.0 - clamp( occ, 0.0, 1.0 );
}
 
vec3 shadeSupport(in vec3 pos, in vec3 ray){
    vec3 col = vec3(1.0);
    vec3 norm = GetNormal(shapeSupport, pos);
   
    float sha = calcSoftshadow( pos + norm*0.1, 8.0 );
    float occ = calcOcclusion( pos, norm );
   
   
    float spec = phong(lig, ray, norm, 1.0);
    float atten = dot(norm, lig);
   
    float f = 1.0 - smoothstep(0.3, 0.31, pos.y + 0.95);
   
    col = mix(vec3(0.8, 0.1, 0.7), vec3(1.0), f);
    col *= atten * 0.5 + 0.5;
    col *= sha * 0.5 + 0.5;
    col *= occ;
   
    col += max(spec * sha * 2.0, 0.0);
    col *= 0.8 * 0.5;
   
    return col;
}
 
vec3 shadeSnow(in vec3 po, in vec3 ray){
    vec3 col = vec3(0.8);
    vec3 norm = normSnow(po);
    float atten = dot(norm, lig);
   
    float colorTime=mod(iGlobalTime/6.7,2.0*PI)*3.0/4.0;
    vec3 sphereColor=normalize(clamp(vec3(
		sin(colorTime),
		sin(colorTime-PI/2.0),
		max(sin(colorTime-PI),sin(colorTime+PI/2.0))
	),0.0,1.0));

    sphereColor *= 0.85 + atten * 0.3;
   
    return sphereColor;
}
 
#define SNOW_STEPS 16
 
float snowFlakes(in vec3 pos, in vec3 ray){
    float total = 0.0;
   
    vec3 p2 = pos;
   
    p2.y += iGlobalTime / 8.0;
    p2.x += iGlobalTime / 20.0;
   
    const float stepSize = 0.6 / float(SNOW_STEPS);
   
    for (int i=0;i<SNOW_STEPS;i++)
    {
        p2 += ray * stepSize * sqrt(float(i));
        
        vec3 p21, p22, p23;
        
        p21 = p2 * rX(45.0) * rY(45.0) * rZ(45.0);
        p22 = p21 * rX(-45.0) * rY(-45.0) * rZ(-45.0);
        p23 = p22 * rX(-45.0) * rY(45.0) * rZ(-45.0);
       
        float val = noise(p21.xyz * 64.0) * noise(p22.yzx * 32.0) * noise(p23.zxy * 16.0);
        total += pow(val * 2.0, 8.0);
    }
   
    return clamp(total, 0.0, 1.0) * 0.7;
}
 
vec3 shadeBall(in vec3 pos, in vec3 ray){

    float ior = 0.98;
    vec3 norm = normalize(pos);
   
    vec3 refrRay = normalize(refract(ray, norm, ior));
    vec3 refrPos = pos + refrRay * 0.001;
   
    //reflection
    vec3 reflRay = normalize(reflect(ray, norm));
    vec3 reflPos = pos + reflRay * 0.001;
   
    float tb = traceBall(refrPos, refrRay);
    float ts = traceSnow(refrPos, refrRay);
      
    vec3 refl = vec3(0.0);
       
    vec3 col = vec3(0.0);
   
    if (ts > 0.0)
        col = shadeSnow(refrPos + refrRay * ts, refrRay) * 0.95;
    else
    {
        vec3 norm2 = normalize(refrPos + refrRay * tb);
        vec3 newRay2 = refract(refrRay, norm2, ior);
        vec3 newPos2 = refrPos + refrRay * tb;
 
        float tsup = traceSupport(newPos2 + newRay2 * 0.001, newRay2);
 
    }
   
    float flakes = snowFlakes(refrPos, refrRay); 
    col += flakes;
    float spec = phong(lig, ray, norm, 16.0); 
    col += max(spec, 0.0);    
    col = mix(col, refl, pow(1.0 - dot(norm, -ray), 1.0));
    col += (1.0 - dot(norm, -ray)) * 0.2; 
    return col;
}
 
 
//----------------------------------------------------------------
// Calculo de la camara 
void camPolar( out vec3 pos, out vec3 dir, in vec3 origin, in vec2 rotation, in float dist, in float zoom, in vec2 offset )
{
    // Coeficientes de rotacion
    vec2 c = cos(rotation);
    vec4 s;
    s.xy = sin(rotation);
    s.zw = -s.xy;

    // 
    
    dir.xy = gl_FragCoord.xy - iResolution.xy*.5 + offset;
    dir.z = iResolution.y*zoom;
    dir = normalize(dir);

    // rotate ray
    dir.yz = dir.yz*c.x + dir.zy*s.zx;
    dir.xz = dir.xz*c.y + dir.zx*s.yw;

    // position camera
    pos = origin - dist*vec3(c.x*s.y,s.z,c.x*c.y);
}
 
// Ruido para la iluminacion
 float noise(float t) {
	return fract(sin(t)*4397.33);
}

// Calculo de la luminosidad
float field(vec3 p) {
	float d = 0.4;
	for (int i = 0; i < 7; ++i) {
		d = max(d, exp(-float(i) / 7.) * (length(max(p - .4, vec3(0.))) - 10));
	}
	return d;
}

void main(void){

	// Color de fondo
    vec3 col = vec3(0.0); 
   
    //Resolucion
    vec2 p = -1.0 + 2.0*(gl_FragCoord.xy / iResolution.xy); 
    p.x *= iResolution.x/iResolution.y;

    //Posicion y rotacion de la camara 
    vec3 camPos = vec3(0.0, 0.0, 0.0);          
    vec2 camRot = vec2(0.3, iGlobalTime * 0.2);
    camRot.x += 0.0;

    vec3 ro, rd;    
    camPolar(ro, rd, camPos, camRot, 1.8 + 2.0  * 0.002, 1.0, vec2(0.0));

    // Calculo del soporte y de la bola de nieve
    float tBall = traceBall(ro,rd);
    float tSupport = traceSupport(ro, rd);
    int hit = 0;

    // Renderizado del soporte y de la bola de nieve
    vec3 renderColor = vec3(0.0);
    if ((tBall > 0.0) && (tBall < tSupport || tSupport < 0.0)){
        renderColor = shadeBall(ro+rd*tBall, rd);
    }else if ((tSupport > 0.0)){
        renderColor = shadeSupport(ro+rd*tSupport, rd);
    }

    //////// Fondo Tenue e Iluminado /////////
    float dSum = 0.;
	float dMax = 0.;
	
	float variance = mix(3., 1., pow(.5 + .5*sin(iGlobalTime), 8.));
	variance -= .05 * log(1.e-6 + noise(iGlobalTime));
	
	for (int i = 0; i < 64; ++i) {
		float d = field(ro);
		float weight = 1. + .2 * (exp(-10. * abs(2.*fract(abs(4.*ro.y)) - 1.)));
		float value = exp(-variance * abs(d)) * weight;
		dSum += value;
		dMax = max(dMax, value);
	}
	float t = max(dSum / 32., dMax) * mix(.92, 1., noise(p.x + noise(p.y + iGlobalTime)));

	// Calculo final de la escena
    col += renderColor*vec4(t * vec3(t*t*1.3, t*1.3, 1.), 1.);
               
    gl_FragColor = vec4(col, 1.0);
}