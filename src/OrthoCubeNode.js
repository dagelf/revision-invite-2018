(function(global) {
  class OrthoCubeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.kickThrob = 0;
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 0;
      this.kickThrob *= 0.8;
      if(BEAT && BEAN % 12 == 0) {
        this.kickThrob = 1;
      }

      this.uniforms.kickThrob.value = this.kickThrob;
      this.uniforms.frame.value = frame;
      this.uniforms.BEAN.value = BEAN;
      this.uniforms.BEAT.value = BEAT;
    }
  }

  global.OrthoCubeNode = OrthoCubeNode;
})(this);
