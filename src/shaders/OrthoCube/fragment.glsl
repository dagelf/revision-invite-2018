precision mediump float; // or lowp
#define M_PI 3.1415926535897932384626433832795

uniform float frame;
uniform float BEAN;
uniform float BEAT;
uniform float kickThrob;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const int MAX_MARCHING_STEPS = 128;
const float EPSILON = 0.001;
const float END = 100.0;
const float START = 0.0;

float uni(float d1, float d2) {
    return min(d1, d2);
}

float sub(float d1, float d2) {
    return max(-d1, d2);
}

float inter(float d1, float d2) {
    return max(d1, d2);
}

float sphere(vec3 p, float s) {
    return length(p)-s;
}


vec2 sphereCube(vec3 p, float sphereSize, float gap){
    float d = END + EPSILON;
    float minD = d;
    float cD = 0.0;
    float oID = 1.0;
    float currentID = 0.0;
    for(float x = -1.0; x <= 1.0; x++){
        for(float y = -1.0; y <= 1.0; y++){
            for(float z = -1.0; z <= 1.0; z++){
                cD = sphere((p-vec3(x*gap, y*gap, z*gap)), sphereSize);
                if(cD < d){
                    d = cD;
                    currentID = oID;
                }
                oID = oID + 1.0;
            }
        }
    }
    return vec2(d, currentID);
}

mat4 rotateX(float theta) {
    float c = cos(-theta);
    float s = sin(-theta);

    return mat4(
            vec4(1, 0, 0, 0),
            vec4(0, c, -s, 0),
            vec4(0, s, c, 0),
            vec4(0, 0, 0, 1)
            );
}
mat4 rotateY(float theta) {
    float c = cos(-theta);
    float s = sin(-theta);

    return mat4(
            vec4(c, 0, s, 0),
            vec4(0, 1, 0, 0),
            vec4(-s, 0, c, 0),
            vec4(0, 0, 0, 1)
            );
}
mat4 rotateZ(float theta) {
    float c = cos(-theta);
    float s = sin(-theta);

    return mat4(
            vec4(c, -s, 0, 0),
            vec4(s, c, 0, 0),
            vec4(0, 0, 1, 0),
            vec4(0, 0, 0, 1)
            );
}

vec2 sdf(vec3 p) {
    vec3 cubeP = p;
    float cubeSize = 1.0;

    float nframe  = frame;

    if(BEAN < 240.0){ //Pre-scene (begins at 208)
    }else if(BEAN <= 252.0){
        float rotZ = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 240.0)/(252.0-240.0));
        cubeP = (rotateZ(rotZ) * vec4(p, 1.0)).xyz;
    }else if(BEAN <= 264.0){
    }else if(BEAN <= 276.0){
        float rotZ = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 264.0)/(276.0-264.0));
        cubeP = (rotateZ(rotZ) * vec4(p, 1.0)).xyz;
    }
    else if(BEAN <= 288.0){}
    else if(BEAN <= 300.0){
        float rotY = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 264.0)/(276.0-264.0));
        cubeP = (rotateY(rotY) * vec4(p, 1.0)).xyz;
    }
    else if(BEAN <= 312.0){ 
    }
    else if(BEAN <= 324.0){ 
        float rotY = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 264.0)/(276.0-264.0));
        cubeP = (rotateY(rotY) * vec4(p, 1.0)).xyz;
    }
    else if(BEAN <= 336.0){ //248
    }
    else if(BEAN <= 348.0){ 
        float rotX = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 264.0)/(276.0-264.0));
        cubeP = (rotateX(rotX) * vec4(p, 1.0)).xyz;
    }
    else if(BEAN <= 360.0){ 
    }
    else if(BEAN <= 372.0){ 
        float rotX = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 264.0)/(276.0-264.0));
        float rotY = 0.5 * M_PI * mix(0.0, 1.0, (BEAN - 264.0)/(276.0-264.0));
        cubeP = (rotateX(rotX) * rotateY(rotY) * vec4(p, 1.0)).xyz;
    }
    else if(BEAN <= 384.0){ 
        float rotX = 0.5 * M_PI;
        float rotY = 0.5 * M_PI;
        cubeP = (rotateX(rotX) * rotateY(rotY) * vec4(p, 1.0)).xyz;
    }

    else{
        cubeP = (rotateX((nframe - 344.0)/45.0) * vec4(p, 1.0)).xyz;
        cubeP = (rotateY((nframe - 344.0)/45.0) * vec4(cubeP, 1.0)).xyz;
        cubeSize = 1.0 + 1.5 * sin((16.0 + nframe) * 3.1415 / 30.0);
        float shrink = mix(1.0, 0.1, pow(max(0.0,(BEAN-426.0))/5.0, 1.0/3.0));
        cubeSize *= shrink;
    }


    float sphereSize = 0.3;
    vec2 distoid = sphereCube(cubeP, sphereSize, cubeSize);
    return distoid;
}


//Returns vec4(depth, objectID, numberOfSteps)
vec3 march(vec3 eye, vec3 dir, float start, float end) {
    float depth = start;
    float closestDist = END;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        vec2 distoid = sdf(eye + depth * dir);
        float dist = distoid.x;
        if(dist < closestDist){
            closestDist = dist;
        }
        if (dist < EPSILON) {
            return vec3(depth, distoid.y, i);
        }
        depth+=dist;
        if (depth >= end) {
            return vec3(end, 0.0, i);;
        }
    }
    return vec3(end, 0.0, MAX_MARCHING_STEPS);
}

void main() {
    vec3 color1 = vec3(255.0/255.0, 73.0/255.0, 130.0/255.0);
    vec3 color2 = vec3(119.0/255.0, 225.0/255.0, 93.0/255.0);
    vec3 white  = vec3(1.0, 1.0, 1.0);
    vec3 dark   = vec3(55.0/255.0, 60.0/255.0, 63.0/255.0);

    //vec3 pos = vec3(cos(frame/20.0)*10.0, 5.0, sin(frame/20.0)*10.0);
    vec3 pos = vec3(0.0, 0.0, -10.0);
    vec3 dir = normalize(-pos);

    vec2 propUV = vUv - vec2(0.5, 0.5);
    propUV = propUV * vec2(16, 9);

    //NOTE: Math assumes camera is always pointing in Z+
    //do not rotate the camera without fixing math
    vec3 eye = pos + vec3(propUV, 0.0);

    vec3  distOid = march(eye, dir, START, END);
    float dist = distOid.x;

    vec3 color;

    if (dist >= END-EPSILON) {
        color = dark;
    }else{
        float oID = distOid.y;

        vec3 p = eye + dir * dist;
        color = mod(oID, 2.0) == 0.0 ? white : color2;
        if(BEAN >= 240.0){
            color += 0.3 * kickThrob;
        }
        //float gray = + 0.1 + 0.5 * kickThrob;
    }
    
    /*  MSAA experiments. Disregard for now
    if(distOid.z > 49.0){ //MSAA time
        for(float x = -1.0; x <= 1.0; x+=2.0){
            for(float y = -1.0; y <= 1.0; y+=2.0){
                distOid = march(eye+vec3(x*0.05, y*0.05,0.0), dir, START, END);
                dist = distOid.x;
                if (dist >= END-EPSILON) {
                    color += vec3(55.0/255.0, 60.0/255.0, 63.0/255.0);
                }else{
                    float oID = distOid.y;
                    vec3 p = eye + dir * dist;
                    float gray = 1.0 * mod(oID, 2.0) + 0.1 + 0.5 * kickThrob;
                    color += vec3(gray, gray, gray);
                }
            }
        }

        color /= 5.0;
        color += vec3(0.5,0.0,0.0);
    }
    */

    gl_FragColor = vec4(color, 1.0);

}

