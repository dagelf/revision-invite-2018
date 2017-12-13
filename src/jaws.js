(function(global) {

  class jaws extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
    }

    render() {
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.strokeStyle = 'rgb(55, 60, 63)';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.lineWidth = 0.05;

      const startBEAN = 32 * 48;
      const timings = {
        0: FRAME_FOR_BEAN(startBEAN),
        2: FRAME_FOR_BEAN(startBEAN + 9),
        4: FRAME_FOR_BEAN(startBEAN + 18),
        6: FRAME_FOR_BEAN(startBEAN + 24),
        8: FRAME_FOR_BEAN(startBEAN + 28),
        10: FRAME_FOR_BEAN(startBEAN + 34),
        12: FRAME_FOR_BEAN(startBEAN + 36),
        14: FRAME_FOR_BEAN(startBEAN + 40),
        16: FRAME_FOR_BEAN(startBEAN + 41),
        18: FRAME_FOR_BEAN(startBEAN + 42),
        20: FRAME_FOR_BEAN(startBEAN + 46),
        22: FRAME_FOR_BEAN(startBEAN + 48),
        24: FRAME_FOR_BEAN(startBEAN + 54),
        26: FRAME_FOR_BEAN(startBEAN + 60),
        28: FRAME_FOR_BEAN(startBEAN + 64),
        30: FRAME_FOR_BEAN(startBEAN + 70),
      };

      for(let i = 0; i < 32; i+=2) {
        if(i % 4 != 0) {
          this.ctx.fillStyle = 'rgb(255, 73, 130)';
          this.ctx.fillStyle = '#77e15d';
          this.ctx.fillStyle = 'white';
          this.ctx.fillStyle = '#77e15d';
          this.ctx.fillStyle = 'rgb(55, 60, 53)';
          this.ctx.fillStyle = 'rgb(255, 73, 130)';
          this.ctx.fillStyle = '#77e15d';
          this.ctx.fillStyle = '#98d19b';
        } else {
          this.ctx.fillStyle = 'rgb(255, 73, 130)';
          this.ctx.fillStyle = '#77e15d';
          this.ctx.fillStyle = 'rgb(55, 60, 53)';
          this.ctx.fillStyle = 'rgb(255, 73, 130)';
          this.ctx.fillStyle = 'white';
          this.ctx.fillStyle = '#77e15d';
        }
        const t = 
          easeIn(1, 0, (this.frame - timings[i] + 15) / 15);
        this.ctx.save();
        this.ctx.translate(8, 4.5);
        this.ctx.rotate(+Math.PI * 2 * i / 32 - this.frame / 100 + 1 + Math.PI / 2);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 10 * t);
        this.ctx.lineTo(0 - 1.5, 10 + 10 * t);
        this.ctx.lineTo(0 + 1.5, 10 + 10 * t);
        this.ctx.lineTo(0, 10 * t);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();

      }

      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.beginPath();
      let t2 = elasticOut(0, 0.4, 1.5, (this.frame - 4006 + 10) / 20);
      for (const timing of Object.values(timings)) {
        if (timing <= this.frame) {
          t2 = lerp(0.6, 0.4, (this.frame - timing) / 10);
        }
      }
      this.ctx.arc(8, 4.5, t2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = 'rgb(0, 0, 255)';
      const t = easeOut(0, 1, (this.frame - timings[30]) / 120);
      this.ctx.beginPath();
      this.ctx.arc(8, 4.5, 10 * t, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.jaws = jaws;
})(this);
