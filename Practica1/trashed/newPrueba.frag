uniform float iGlobalTime; 
uniform vec3 iResolution; 
uniform vec4 iDate;
uniform vec3 iMouse;
uniform sampler2D iChannel0; 
uniform vec4 iLoc;


float fract(float x){

    return (x - floor(x));

}
float rand(point co){

    return fract(sin(dot(co,point(12.9898,78.233,0))) * 43758.5453);
}
float noise2f(point p){

    point ip = point(floor(p[0]),floor(p[1]),0);
    point u = point(fract(p[0]),fract(p[1]),0);
    u = u*u*(3.0-2.0*u);
    float res = mix(
        mix(rand(ip),rand(ip+point(1.0,0.0,0.0)),u[0]),
        mix(rand(ip+point(0.0,1.0,0.0)),rand(ip+point(1.0,1.0,0.0)),u[0]),
        u[1]);
    return res*res;

}

point cMul(point a, point b){   

    return point(a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0], 0);

}

shader NoiseFract(
    float Mul = 5,
    float Decay = 0.5,
    color color1 = color(0,1,0),
    color color2 = color(1,0,0),
    color color3 = color(0,1,0),
    output closure color CL = background()
    )
{
    //
    float fbm(point c){
    // Iterations [0,1,19] -- Mul [0,2,10] -- Decay [0,0.5,2]
    float f = 0.0;
    float w = 1.0;
    for(int i = 0; i < 19; i++){
        f+= w*noise2f(c);
        c*= Mul;
        w*= Decay; 
    }
    return f;    
    }
    point p = P;
    point q = 0;
    point r = 0;
    q[0] = fbm(p +0.01*1);
    q[1] = fbm(p +point(1));   
    r[0] = fbm(p +1.0*q + point(1.7, 9.2, 0)+0.15*1);
    r[1] = fbm(p +1.0*q + point(8.3, 2.8, 0)+0.126*1);   
    float f = fbm(P +1.0*r + 0.0*1);
    color Cl_temp = mix(color1,color2,clamp((f*f)*4.0,0.0,1.0));
    Cl_temp += color2;
    Cl_temp += color(mix(Cl_temp,color3,clamp(length(q),0,1)));
    normal n = calculatenormal(P + length(vector(pow(Cl_temp,6)))/10000000*Ng);
    CL = diffuse(n)*clamp(Cl_temp,0.0,1.0);
    return;
}