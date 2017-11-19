uniform float frame;
uniform float snareThrob;
uniform float kickThrob;
uniform float twistAmount;
uniform vec3 trainCameraPosition;
uniform vec3 trainCameraRotation;
uniform sampler2D tDiffuse;

# define FRAME_OFFSET 200.

varying vec2 vUv;

#define PI 3.141592653589793

#define SPEED 16.

float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}


float sdPlane(vec3 p) {
    return p.y;
}

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdEllipsoid(vec3 p, vec3 r) {
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float udRoundBox(vec3 p, vec3 b, float r) {
    return length(max(abs(p)-b,0.0))-r;
}

float sdTorus(vec3 p, vec2 t) {
    return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
}

float sdHexPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    float d1 = q.z-h.y;
    float d2 = max((q.x*0.866025+q.y*0.5),q.y)-h.x;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}

float sdEquilateralTriangle(vec2 p) {
    const float k = sqrt(3.0);
    p.x = abs(p.x) - 1.0;
    p.y = p.y + 1.0/k;
    if( p.x + k*p.y > 0.0 ) p = vec2( p.x - k*p.y, -k*p.x - p.y )/2.0;
    p.x += 2.0 - 2.0*clamp( (p.x+2.0)/2.0, 0.0, 1.0 );
    return -length(p)*sign(p.y);
}

float sdTriPrism(vec3 p, vec2 h) {
    vec3 q = abs(p);
    float d1 = q.z-h.y;
    float d2 = max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float sdCylinder(vec3 p, vec2 h) {
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCone(in vec3 p, in vec3 c) {
    vec2 q = vec2( length(p.xz), p.y );
    float d1 = -q.y-c.z;
    float d2 = max( dot(q,c.xy), q.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float sdConeSection(vec3 p, float h, float r1, float r2) {
    float d1 = -p.y - h;
    float q = p.y - h;
    float si = 0.5*(r1-r2)/h;
    float d2 = max( sqrt( dot(p.xz,p.xz)*(1.0-si*si)) + q*si - r2, q );
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

// h = { cos a, sin a, height }
float sdPryamid4(vec3 p, vec3 h ) {
    // Tetrahedron = Octahedron - Cube
    float box = sdBox( p - vec3(0,-2.0*h.z,0), vec3(2.0*h.z) );
 
    float d = 0.0;
    d = max( d, abs( dot(p, vec3( -h.x, h.y, 0 )) ));
    d = max( d, abs( dot(p, vec3(  h.x, h.y, 0 )) ));
    d = max( d, abs( dot(p, vec3(  0, h.y, h.x )) ));
    d = max( d, abs( dot(p, vec3(  0, h.y,-h.x )) ));
    float octa = d - h.z;
    return max(-box,octa); // Subtraction
 }

float length2( vec2 p ) {
    return sqrt( p.x*p.x + p.y*p.y );
}

float length6( vec2 p ) {
    p = p*p*p; p = p*p;
    return pow( p.x + p.y, 1.0/6.0 );
}

float length8( vec2 p ) {
    p = p*p; p = p*p; p = p*p;
    return pow( p.x + p.y, 1.0/8.0 );
}

float sdTorus82( vec3 p, vec2 t ) {
    vec2 q = vec2(length2(p.xz)-t.x,p.y);
    return length8(q)-t.y;
}

float sdTorus88( vec3 p, vec2 t ) {
    vec2 q = vec2(length8(p.xz)-t.x,p.y);
    return length8(q)-t.y;
}

float sdCylinder6( vec3 p, vec2 h ) {
    return max( length6(p.xz)-h.x, abs(p.y)-h.y );
}

//------------------------------------------------------------------

float opS( float d1, float d2 )
{
    return max(-d2,d1);
}

vec2 opU( vec2 d1, vec2 d2 ) {
    return (d1.x<d2.x) ? d1 : d2;
}

float smin( float a, float b, float k) {
        float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0 );
            return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 opUsmooth(vec2 d1, vec2 d2, float k) {

    float material = (d1.x<d2.x) ? d1.y : d2.y;
    float dist = smin(d1.x, d2.x, k);
    return vec2(dist, material);
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}

vec3 opTwist( vec3 p )
{
    float  c = cos(10.0*p.y+10.0);
    float  s = sin(10.0*p.y+10.0);
    mat2   m = mat2(c,-s,s,c);
    return vec3(m*p.xz,p.y);

}

//------------------------------------------------------------------

float wheel(vec3 pos, float size) {
    pos = (rotationMatrix(vec3(-1., 0., 0.), SPEED * (frame + FRAME_OFFSET) / 60.) * vec4(pos, 1.)).xyz;
    vec3 rotated = (rotationMatrix(vec3(0., 0., 1.), PI / 2.) * vec4(pos, 1.)).xyz;
    float res = sdCylinder(rotated, vec2(.4 * size, .05));
    res = smin(res, sdCylinder(rotated + vec3(0., .05, 0.), vec2(.44 * size, .01)), 0.05);
    res = max(res, -sdCylinder(rotated, vec2(.35 * size, 0.1)));
    res = min(res, sdCylinder(rotated, vec2(.1 * size, 0.04)));
    res = min(res, sdCylinder(rotated, vec2(.1 * size, 0.04)));

    float spokes = 1e9;
    float width = 0.03;
    mat4 spokeRotation = rotationMatrix(vec3(0., 1., 0.), PI / 2. / 3.);
    spokes = smin(spokes, sdCylinder(rotated + vec3(0., width, 0.), vec2(.38 * size, 0.05  - width / 2.)), 0.04);
    res = min(res, spokes);
    return res;
}

float cabin(vec3 pos, bool far) {

    float cabinLength = 100.;
    if(!far) {
        cabinLength = 1.;
    }

    float roof = sdBox(pos + vec3(0., 0.75 - cabinLength, 0.), vec3(1., cabinLength + 0.1, 1.1));
    roof = max(roof, sdCylinder(pos - vec3(0., 0., 1.25), vec2(2., cabinLength)));
    roof = max(roof, -sdCylinder(pos - vec3(0., 0., 1.35), vec2(2., cabinLength)));

    float res = sdBox(pos + vec3(0., 0.75 - cabinLength, 0.), vec3(0.95, cabinLength, 1.));
    res = max(res, sdCylinder(pos - vec3(0., 0., 1.25), vec2(2., cabinLength)));
    res = min(res, roof);

    if(!far) {
        return res;
    }

    float gapsBetweenCars = sdBox(opRep(pos + vec3(0., 3.75, 0.), vec3(0., 10., 0.)), vec3(10., .3, 10.));
    res = max(res, -gapsBetweenCars);

    float interior = sdBox(pos - vec3(0., 0., 0.2), vec3(0.9, cabinLength, 0.7));
    res = max(res, -interior);

    float windows = sdBox(opRep(pos - vec3(0., 1.1, 0.), vec3(0., 10.3 / 2., 0.)), vec3(2., 1.7, .3));
    res = max(res, -windows);

    return res;
}

float chimneyCone(vec3 pos) {
    float res = sdCone(pos, normalize(vec3(.5, .2, 1.)));
    res = smin(res, sdCylinder(pos + vec3(0., -.1, 0), vec2(.2, 0.95)), .1);
    return res;
}

vec2 train(vec3 pos) {

    float material = 1.;
    vec4 p4 = vec4(pos, 1.);
    vec3 rotated = (rotationMatrix(vec3(1., 0., 0.), PI / 2.) * p4).xyz;
    vec3 lifter = vec3(0., 0., 1.5);
    vec3 lifted = rotated + lifter;
    float res = sdCylinder(lifted, vec2(.7, 2.));

    /* nose */
    rotated.y = -rotated.y;
    res = smin(res, sdSphere(rotated - vec3(0., 2.02, -1.5), .01), 1.);
    rotated.y = -rotated.y;

    /* rings */
    float rings = sdCylinder(opRep(lifted, vec3(0., .7, 0.)), vec2(.72, .05));
    rings = max(rings, sdBox(lifted, vec3(5., 2.15, 2.5)));
    res = smin(rings, res, .02);

    /* cabins */
    float size = 1. - 0.4 * step(1.45, pos.z);
    vec3 mirrored = pos;
    mirrored.x = -abs(mirrored.x);
    res = min(res, cabin(lifted + vec3(0., -2.2, .3), true));
    res = smin(res, cabin(lifted + vec3(0., -2.2, .3), false), .01);

    rotated = (rotationMatrix(vec3(1., 0., 0.), PI / 2.) * vec4(rotated, 1.)).xyz;
    res = smin(res, chimneyCone(rotated + vec3(0., 1.9, -1.4)), .15);
    res = max(res, -chimneyCone(rotated * 0.98 + vec3(0., 1.9, 0.98 * -1.4)));

    float wheels = wheel(opRep(mirrored + vec3(0., -.35, 0.) + vec3(0., .15 - size / PI, 1.25), vec3(1.1, .0, size * 0.9)), size);
    wheels = max(wheels, sdBox(lifted + vec3(0., -.45, 0.), vec3(1.2, 100., 2.5)));
    float gapsBetweenCars = sdBox(opRep(rotated + vec3(0., 0., 8.6), vec3(0., 0., 10.)), vec3(10., 10., .54));
    wheels = max(wheels, -gapsBetweenCars);
    res = min(res, wheels);

    /* wheel box */
    float wheelBox = sdBox(lifted - vec3(0., 100. - 2., 0.4 * 2.), vec3(.45, 100., .4));
    wheelBox = max(wheelBox, sdBox(lifted + vec3(0., -.45, 0.), vec3(1.2, 100., 2.5)));
    wheelBox = max(wheelBox, -gapsBetweenCars);
    res = smin(res, wheelBox, .05);

    vec2 final = opU(vec2(res, 2.), vec2(wheels, 1.));

    return final;
}

float tracks(vec3 pos) {
    pos -= vec3(0., 0., PI / 4. * SPEED * (frame + FRAME_OFFSET) / 60.);
    vec3 repped = opRep(pos, vec3(.56 * 2., .2, 0.));
    float res = sdBox(repped, vec3(.04, .01, 10000.));
    res = smin(res, sdBox(opRep(pos, vec3(.56 * 2., 0., 0.)), vec3(.01, .04, 100000.)), .1);
    res = min(res, sdBox(opRep(pos + vec3(0., .2, 0.), vec3(0., 0., 1.)), vec3(1., .1, .1)));
    res = max(res, sdBox(pos, vec3(1., .2, 100000.)));
    return res;
}

vec2 twister(vec3 pos) {
    float size = 0.2 + 0.1 * snareThrob;
    float res = sdBox(pos, vec3(size, size, 100.));
    res = max(res, sdBox(pos + vec3(0., 0., -105.), vec3(size, size, 100.)));
    return vec2(res, 3.);
}

float rotationAmount(float z) {
    return (sin((frame + FRAME_OFFSET) / 60.) + 5. * sin(1. - z / 10. + (frame + FRAME_OFFSET) / 100. + .5 * cos((frame + FRAME_OFFSET) / 100. - z / 7.)));
}

vec3 twistPosition(vec3 pos) {
    return (rotationMatrix(vec3(0., 0., 1.), rotationAmount(pos.z)) * vec4(pos, 1.)).xyz;
}

vec2 map(vec3 pos) {
    pos = pos * (1. - kickThrob * 0.1);
    pos.z += -10. + ((frame + FRAME_OFFSET) - 5258.) / 20.;
    pos -= vec3(0., 1.5, 0.);
    pos = (rotationMatrix(vec3(0., 0., 1.), twistAmount * (sin(frame / 60.) + 5. * sin(1. - pos.z / 10. + frame / 100. + .5 * cos(frame / 100. - pos.z / 7.)))) * vec4(pos, 1.)).xyz;
    pos += vec3(0., 1.5, 0.);

    vec2 res = train(pos);

    vec3 twistedPos = twistPosition(pos - vec3(0., 1.5, 0.));
    twistedPos -= vec3(0., 0.2, 0.);
    res = opU(res, twister(twistedPos));

    res = opU(res, vec2(tracks(pos), 1.));
    return res;
}

vec2 castRay( vec3 ro, vec3 rd ) {
    float tmin = .01;
    float tmax = 200.0;
    
    float t = tmin;
    float m = -1.0;
    for( int i=0; i<128; i++ ) {
        float precis = 0.0005*t;
        vec2 res = map( ro+rd*t );
        if( res.x<precis || t>tmax ) break;
        t += res.x;
        m = res.y;
    }

    //if( t>tmax ) m=-1.0;
    return vec2( t, m );
}


float softshadow(vec3 ro, vec3 rd, float mint, float tmax) {
    float res = 1.0;
    float t = mint;
    for( int i=0; i<16; i++ )
    {
        float h = map( ro + rd*t ).x;
        res = min( res, 8.0*h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 calcNormal(vec3 pos) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
                      e.yyx*map( pos + e.yyx ).x + 
                      e.yxy*map( pos + e.yxy ).x + 
                      e.xxx*map( pos + e.xxx ).x );
}

float calcAO(vec3 pos, vec3 nor ) {
    float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ ) {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map( aopos ).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 render( in vec3 ro, in vec3 rd ) { 
    vec3 green = vec3(0., 224. / 255., 79. / 255.);
    vec3 black = vec3(55. / 255., 60. / 255., 63. / 255.);
    vec3 pink = vec3(255. /255., 73. / 255., 130. / 255.);
    vec3 white = vec3(.7);
    vec3 col = white;
    col = pow( col, 1. / vec3(0.4545) );
    vec2 res = castRay(ro,rd);
    float t = res.x;
    float m = res.y;
    float emissive = 0.;
    if( m>-0.5 )
    {
        vec3 pos = ro + t*rd;
        vec3 nor = calcNormal( pos );
        vec3 ref = reflect( rd, nor );
        
        // material        
        //col = 0.45 + 0.35*sin( vec3(0.05,0.08,0.10)*(m-1.0) );
        if(m > 3.5) {
            col = pow(green, 1. / vec3(.4545));
        }
        if(m > 2.5) {
            float z = pos.z + -10. + ((frame + FRAME_OFFSET) - 5258.) / 20.;
            float amount = rotationAmount(z);
            vec2 normalizedPos = vec2(pos.x, pos.y - 1.5) / 0.3;
            normalizedPos -= vec2(-sin(amount) * 0.2, cos(amount) * 0.2) / 0.3;
            float angle = -amount + atan(normalizedPos.y, normalizedPos.x);
            vec2 uv = vec2(z, 0.);
            uv.y = mod(angle / PI * 2. + 0.5, 1.);
            uv.x = mod(1. - uv.x, 1.);
            col = pow(texture2D(tDiffuse, mod(uv, 1.)).rgb, 1. / vec3(.4545));
            col *= snareThrob;
            emissive = step(0.02, col.r);
        } else if(m > 1.5) {
            col = pow(white, 1./vec3(.4545));
        } else if(m > .5) {
            col = pow(black, 1./vec3(.4545));
        } else {
            col = pow(white, 1. / vec3(.4545));
        }

        // lighitng        
        float occ = calcAO( pos, nor );
        vec3  lig = normalize( vec3(-0.4, 0.7, -0.6) );
        float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
        float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
        float dom = smoothstep( -0.1, 0.1, ref.y );
        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
        float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);
        
        dif *= softshadow( pos, lig, 0.02, 2.5 );
        dom *= softshadow( pos, ref, 0.02, 2.5 );

        vec3 lin = vec3(0.0);
        lin += 1.30*dif*vec3(1.00,0.80,0.55);
        lin += 2.00*spe*vec3(1.00,0.90,0.70)*dif;
        lin += 0.40*amb*vec3(0.40,0.60,1.00)*occ;
        lin += 0.50*dom*vec3(0.40,0.60,1.00)*occ;
        lin += 0.50*bac*vec3(0.25,0.25,0.25)*occ;
        lin += 0.25*fre*vec3(1.00,1.00,1.00)*occ;
        col = mix(col * lin, col, emissive);

        col = mix( col, vec3(0.8,0.9,1.0), 1.0-exp( -0.0002*t*t*t ) );
    }

    return vec3( clamp(col, 0.0, 1.0) );
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
    vec3 cw = normalize(ta-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}

void main() {
    
    float time = 15.0 + (frame + FRAME_OFFSET) / 1000. * 60.;

    
    vec3 tot = vec3(0.0);
    vec2 p = (vUv - 0.5) * 2.;
    p.x = p.x / 9. * 16.;

    // camera   
    float cameraTime = 0.05 * time + 1.;
    float dist = 1.2 + 2. * smoothstep(0., 1., clamp((frame - 5227.) / (5759. - 5227.), 0., 1.));
    vec3 ro = dist * vec3( -0.5+3.5*cos(cameraTime), 2.0, 0.5 + 4.0*sin(cameraTime) );
    vec3 ta = vec3( -0.5, 0.8, 0.5 );
    // camera-to-world transformation
    ro = trainCameraPosition;
    mat3 ca = setCamera(ro, ta, 0.0 );
    // ray direction
    vec3 rd = ca * normalize( vec3(p.xy,2.0) );

    // render   
    vec3 col = render( ro, rd );

    // gamma
    col = pow( col, vec3(0.4545) );

    tot += col;

    gl_FragColor = vec4( tot, 1.0 );
}
