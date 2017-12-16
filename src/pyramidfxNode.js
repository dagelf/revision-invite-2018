(function(global) {
  class pyramidfxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.tDiffuse = new NIN.TextureInput();
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      const startBean = 2400 - 1;
      const endBean = 2400 + 4;
      this.uniforms.barSize.value = elasticOut(
        0,
        0.13,
        1.1,
        (frame - FRAME_FOR_BEAN(startBean)) / (
          FRAME_FOR_BEAN(endBean) - FRAME_FOR_BEAN(startBean)));
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.pyramidfxNode = pyramidfxNode;
})(this);
