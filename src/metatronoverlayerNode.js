(function(global) {

  function T(startBean, endBean, frame) {
    const startFrame = FRAME_FOR_BEAN(startBean);
    const endFrame = FRAME_FOR_BEAN(endBean);
    return (frame - startFrame) / (endFrame - startFrame);
  }

  class metatronoverlayerNode extends NIN.ShaderNode {
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
      if(this.canvas) {
        this.canvas.width = 16 * GU;
        this.canvas.height = 9 * GU;
      }
    }

    update(frame) {
      if(this.textCanvas) {
        this.textCanvas.width = 9 * GU;
        this.textCanvas.height = 4 * GU;

        this.textCtx.save();
        this.textCtx.scale(0.9*GU, 0.9*GU);
        this.textCtx.translate(5, 1);
        this.textCtx.textAlign = 'center';
        this.textCtx.textBaseline = 'middle';
        this.textCtx.font = 'bold 1pt schmalibre';
        this.textCtx.fillStyle = 'white';
        this.textCtx.fillText('NO EUCLIDEAN', 0, 0);
        this.textCtx.restore();

        this.textCtx.save();
        this.textCtx.scale(0.9*GU, 0.9*GU);
        this.textCtx.translate(5, 2.5);
        this.textCtx.textAlign = 'center';
        this.textCtx.textBaseline = 'middle';
        this.textCtx.font = 'bold 1pt schmalibre';
        this.textCtx.fillStyle = 'white';
        this.textCtx.fillText('GEOMETRIES', 0, 0);
        this.textCtx.restore();
      }
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
    }

    render(renderer) {
      this.ctx.save();
      this.ctx.scale(GU, GU);

      const nudger = 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(16 / 3 - nudger, 0);
      this.ctx.lineTo(16 / 3 + nudger, 9);
      this.ctx.lineTo(0, 9);
      this.ctx.lineTo(0, 0);
      this.ctx.fillStyle = '#282b2d';
      this.ctx.fill();

      this.ctx.font = 'bold 1pt schmalibre';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.translate(16 / 3 - nudger, 9 / 2);
      this.ctx.rotate(Math.PI / 2 - 0.11);
      this.ctx.fillStyle = 'white';
      this.ctx.translate(-4.5, -.5);
      this.ctx.translate(0, 1.5);
      const bouncyScale = 1;
      this.ctx.scale(1 / GU, 1 / GU * bouncyScale);
      this.ctx.translate(0, -1.5 * GU);
      const step = 4;
      for(let i  = 0; i < this.textCanvas.height; i+=step) {
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

  global.metatronoverlayerNode = metatronoverlayerNode;
})(this);
