#define PI 3.1415926535
uniform vec3 iResolution;
uniform float iGlobalTime;

vec3 backgroundColor = vec3(1.0,1.0,1.0);
vec3 colorcorazon = vec3(0.5, 0.5, 0.5);

float heart(vec2 p)
{
    //Forma del corazon
    // shape
    float a = atan(p.x,p.y)/PI;
    float r = length(p);
    float h = abs(a);
    float d =(13.0*h - 22.0*h*h + 10.0*h*h*h)/(30.0-29.0*h+8);

    return d-r;
}

void main(void)
{
    vec2 p = vec2(gl_FragCoord.xy / iResolution.xy);
    vec2 r =  2.0*vec2(gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;

    //Para saber cual es el valor de la x más alta
    float xMax = iResolution.x/iResolution.y;

    //Asignamos el color de fondo por defecto
    vec3 col=backgroundColor;

    //Para que la oscilacion se repita cada 8 segundos
    float time = mod(iGlobalTime, 8);

    if(p.x < 1./5.) { // Part I
        //Para que el punto dependa de la parte de la pantalla en la que estemos
        vec2 q = r + vec2(xMax*4./5.,0.);
        //Para que la oscilacion dependa del tiempo
        if (time<2.0)
            //Para que el corazón se mueva en el eje y (hacia abajo)
            q.y -= 0.95 - sin(time) * 0.73;
        else
            q.y -= 0.95 - sin(2) * 0.73;
        //Para mezclar el color del dibujo del corazón con lo que ya hay en la escena
        col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q)));
    } 
    else if(p.x < 2./5.) { // Part II
        vec2 q1 = r + vec2(xMax*2./5.,0.);
        vec2 q2 = r + vec2(xMax*2./5.,0.);
        if (time<1.0){
            q1.y -= 0.95 - sin(time) * 0.73*2.0;
            q2.y -= 0.95 - sin(time) * 0.73*2.0;
        }
        else if (time<2.92){
            q2.y -= 0.95 - sin(time) * 0.73*2.0;
            q1.y -= 0.95 - sin(1) * 0.73*2.0;
        }
        else{
            q1.y -= 0.95 - sin(1) * 0.73*2.0;
            q2.y -= 0.95 - 0.15 - sin(3) * 0.73*2.0;
        }
        col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q1)));
        col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q2)));
    } 

    else if(p.x < 3./5.) { // Part III
        vec2 q1 = r + vec2(xMax*0./5.,0.);
        vec2 q2 = r + vec2(xMax*0./5.,0.);
       if (time<1.0){
            q1.y -= + 0.95 - sin(time) * 0.93*2.0;
            q2.y -= 0.95 - sin(time) * 0.93*2.0;
        }
        else if (time<2.85){
            q2.y -= 0.95 - sin(time) * 0.93*2.0;
            q1.y -= + 0.95 - sin(1) * 0.93*2.0;
        }
        else{
            q1.y -= +0.95 - sin(1) * 0.93*2.0;
            q2.y -= 0.95 - 0.15 - sin(2.95) * 0.93*2.0;
        }col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q1)));
        col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q2)));
    } 

    else if(p.x < 4./5.) { // Part VI
        vec2 q1 = r + vec2(-xMax*2./5.,0.);
        vec2 q2 = r + vec2(-xMax*2./5.,0.);
        if (time<1.0){
            q1.y -= 0.95 - sin(time) * 0.73*2.0;
            q2.y -= 0.95 - sin(time) * 0.73*2.0;
        }
        else if (time<2.92){
            q2.y -= 0.95 - sin(time) * 0.73*2.0;
            q1.y -= 0.95 - sin(1) * 0.73*2.0;
        }
        else{
            q1.y -= 0.95 - sin(1) * 0.73*2.0;
            q2.y -= 0.95 - 0.15 - sin(3) * 0.73*2.0;
        }col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q1)));
        col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q2)));
    } 
    else if(p.x < 5./5.) { // Part V
        vec2 q = r + vec2(-xMax*4./5.,0.);
         if (time<2.0)
            q.y -= 0.95 - sin(time) * 0.73;
        else
            q.y -= 0.95 - sin(2) * 0.73;
        col = mix(col, colorcorazon, smoothstep( -0.001, 0.001, heart(q)));
        } 

    //Raya horizontal
    vec2 rRayaHorizontal = vec2( gl_FragCoord.xy / iResolution.xy );
    vec3 suelo = vec3(0.5, 0.5, 0.5);
    if(abs(rRayaHorizontal.y - 0.05)<0.05){
 	 gl_FragColor = vec4(suelo,1.0);
    }else{
         gl_FragColor = vec4(col,1.0);
    }
}