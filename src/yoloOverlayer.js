(function (global) {

  function T(startBean, endBean, frame) {
    const startFrame = FRAME_FOR_BEAN(startBean);
    const endFrame = FRAME_FOR_BEAN(endBean);
    return (frame - startFrame) / (endFrame - startFrame);
  }

  class yoloOverlayer extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.tDiffuse = new NIN.TextureInput();
      super(id, options);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasTexture.minFilter = THREE.LinearFilter;

      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');

      this.resize();
    }

    warmup(renderer) {
      this.update(2764);
      this.render(renderer);
    }

    resize() {
      super.resize();
      if (this.canvas) {
        this.canvas.width = 16 * GU;
        this.canvas.height = 9 * GU;
      }
    }

    update(frame) {

      this.frame = frame;
      this.uniforms.frame.value = frame;
      var start = 23.11;
      let t = Math.pow(Math.max(0, T(start * 48, start * 48 + 12, frame)), 2.5);

      this.uniforms.translationOverX.value = easeIn(0.5, 0, t);
      this.uniforms.translationUnderX.value = easeIn(0, -0.15, t);

      var end = 24.75 - 3 / 48;
      if (BEAN >= end * 48) {
        t = 1 - T(end * 48, end * 48 + 12, frame);
        this.uniforms.translationOverX.value = easeIn(0.5, 0, t);
        this.uniforms.translationUnderX.value = easeIn(0, -0.15, t);
      }

      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.translationOverX.value = 0;
      this.uniforms.translationUnderX.value = 0;
      this.frame = frame;
    }


    render(renderer) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.save();
      this.ctx.scale(GU, GU);

      const nudger = 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, 16 / 3);
      this.ctx.lineTo(16 / 3 + nudger, 9);
      this.ctx.lineTo(0, 9);
      this.ctx.lineTo(0, 0);
      this.ctx.fillStyle = '#282b2d';
      this.ctx.fill();

        this.ctx.save();
        this.ctx.translate(0.4, 8);
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'alphabetic';
        this.ctx.font = 'bold 1pt schmalibre';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 0.15;
      const text = this.text || '';
      const scale = 1 + 0.01 * Math.sin(this.frame * Math.PI * 2 / 60 / 60 * 115);
      this.ctx.scale(scale, scale);
        this.ctx.strokeText(text, 0, 0.51);
        this.ctx.fillText(text, 0, 0.51);
        this.ctx.restore();

      this.ctx.font = 'bold 1pt schmalibre';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.translate(16 / 3 - nudger, 9 / 2);
      this.ctx.fillStyle = 'white';
      this.ctx.translate(-4.5, 2.5);
      this.ctx.translate(0, 1.5);
      const bouncyScale = Math.cos(this.frame / 100);
      this.ctx.scale(1 / GU, 1 / GU * bouncyScale);
      this.ctx.translate(0, -1.5 * GU);
      const step = 4;
      for (let i = 0; i < this.textCanvas.height; i += step) {
        this.ctx.drawImage(
          this.textCanvas,
          0,
          i,
          this.textCanvas.width,
          step + 1,
          0,
          i,
          this.textCanvas.width,
          step + 1);
      }

      this.ctx.restore();
      this.canvasTexture.needsUpdate = true;
      this.uniforms.overlay.value = this.canvasTexture;
      super.render(renderer);
    }
  }

  global.yoloOverlayer = yoloOverlayer;
})(this);
