(function(global) {
  class toonNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
        coloring: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      this.uniforms.coloring.value = this.inputs.coloring.getValue();
    }
  }

  global.toonNode = toonNode;
})(this);