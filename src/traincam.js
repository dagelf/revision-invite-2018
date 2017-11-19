(function(global) {
  class traincam extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          camera: new NIN.Output()
        }
      });

      this.camera = new THREE.PerspectiveCamera(25, 16/9, 1, 100000);
      this.outputs.camera.value = this.camera;
    }

    update(frame) {
      this.camera.position.x = 3;
      this.camera.position.y = 3;
      this.camera.position.z = -5  -(frame - 5258) / 30;
      this.camera.rotation.x = 0;
      this.camera.rotation.y = 0;
      this.camera.rotation.z = 0;

      if(frame >= FRAME_FOR_BEAN(2064 -2) && frame < FRAME_FOR_BEAN(2112)) {
        if(frame >= FRAME_FOR_BEAN(2064 + 10)) {
          this.camera.position.z = 0;
          this.camera.position.y = 4;
          this.camera.position.x = 4;
        } else if(frame >= FRAME_FOR_BEAN(2064 + 4)) {
          this.camera.position.z = -15;
          this.camera.position.y = -2;
          this.camera.position.x = -2;
        } else {
          this.camera.position.z = -10;
          this.camera.position.y = 0;
          this.camera.position.x = 2;
        }
      }
      if(frame >= FRAME_FOR_BEAN(2112)) {
        const t = (frame - FRAME_FOR_BEAN(2136)) / (FRAME_FOR_BEAN(2160) - FRAME_FOR_BEAN(2136));
        this.camera.position.z = smoothstep(-0.8, -5, t);
        this.camera.position.y = smoothstep(4, 1.9, t);
        this.camera.position.x = smoothstep(4, .75, t);

        const newT = (frame - FRAME_FOR_BEAN(2160)) / (FRAME_FOR_BEAN(2208) - FRAME_FOR_BEAN(2160));
        this.camera.position.z = easeIn(this.camera.position.z, .6, newT);
        this.camera.position.y = easeIn(this.camera.position.y, 2.2, newT);
        this.camera.position.x = easeIn(this.camera.position.x, .25, newT);
      }

      this.outputs.camera.value = this.camera;

    }
  }

  global.traincam = traincam;
})(this);
