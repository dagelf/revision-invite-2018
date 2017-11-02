(function(global) {
  class butterflies extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera = new THREE.PerspectiveCamera(.5, 16/9, 1, 100000);

      function CustomSinCurve(offset) {
        THREE.Curve.call(this);
        this.offset = offset;
        this.scale = 10 + Math.random() * 5;
        this.scale /= 10;
      }

      CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
      CustomSinCurve.prototype.constructor = CustomSinCurve;

      CustomSinCurve.prototype.getPoint = function(t) {
        const x = t * 20 * 2;
        t += this.offset;
        const y = 0.5 * (Math.cos( 2 + t/353) + 2 * Math.sin(t / 10) + Math.sin(2 * Math.PI * t));
        const z = 0.5 * (Math.cos( 2 + t/142) + 3 * Math.sin(t / 40) + Math.sin(2 * Math.PI * t * 1.4));
        return new THREE.Vector3(x, y, z).multiplyScalar(10);
      };

      this.bg = new THREE.Mesh(
          new THREE.CylinderGeometry(10000, 10000, 1000, 32),
          new THREE.MeshStandardMaterial({
            color: 0x222222,
            map: Loader.loadTexture('res/bg.jpg'),
            side: THREE.BackSide,
          }));
      this.bg.material.map.wrapS = THREE.RepeatWrapping;
      this.bg.material.map.wrapT = THREE.RepeatWrapping;
      this.bg.material.map.repeat.set(20, 1);
      this.scene.add(this.bg);

      this.colors = [
        0x0db3d6,
        0x7eb40b,
        0x803d73,
        0xfbdc09,
        0xc8331a,
        0x64686b,
      ];

      this.lines = [];

      this.butterflies = [];

      this.particleSystem = new window.ParticleSystem({
        color: new THREE.Color(0xfffffff)
      });
      //this.scene.add(this.particleSystem.particles);

      for(let i = 0; i < 6; i++) {
        var path = new CustomSinCurve(i / 6 + Math.random() * Math.PI * 2);
        var geometry = new THREE.TubeGeometry(path, 50, 0.2, 8);
        var material = new THREE.ShaderMaterial(SHADERS.butterflylines).clone();
        const color = new THREE.Color(this.colors[i]);
        material.uniforms.r.value = color.r;
        material.uniforms.g.value = color.g;
        material.uniforms.b.value = color.b;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.path = path;
        mesh.scale.x = 0.5;
        this.scene.add(mesh);
        this.lines.push(mesh);
        mesh.percentageOffset = Math.random() * 0.1 * 0.5;

        const butterflyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 32 , 32),
          new THREE.MeshBasicMaterial({color: 0xffffff}));
        this.butterflies.push(butterflyMesh);
        this.scene.add(butterflyMesh);
        butterflyMesh.light = new THREE.PointLight(this.colors[i], 0.2);
        this.scene.add(butterflyMesh.light);
      }
    }


    update(frame) {
      super.update(frame);
      const frameStart = 7011;
      this.camera.position.x = (frame - frameStart) / 2 / 2;

      const t = (frame - frameStart - 250) / 80;
      const fov = easeIn(5, 45, t);
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = smoothstep(500, 0, t);
      this.camera.position.x -= smoothstep(0, 50, t / 2);
      this.camera.position.x += smoothstep(0, 50, t);
      this.camera.position.y += 0;
      const xOffset = smoothstep(0, 200, t);
      this.camera.lookAt(new THREE.Vector3(this.camera.position.x - xOffset, 0, 0));

      for(let i = 0; i < this.lines.length; i++) {
        const percentage = (frame - frameStart) / 500 / 2 + this.lines[i].percentageOffset;
        this.lines[i].material.uniforms.percentage.value = percentage;
        this.butterflies[i].position.copy(this.lines[i].path.getPoint(percentage));
        this.butterflies[i].position.x /= 2;
        this.butterflies[i].light.position.copy(this.butterflies[i].position);
        const angle = Math.random() * Math.PI * 2;
        const amplitude = 0.05;
        const dy = amplitude * Math.cos(angle);
        const dz = amplitude * Math.cos(angle);
        this.particleSystem.spawn(this.butterflies[i].position, {
          x: -0.001 * Math.random(),
          y: dy * Math.random(),
          z: dz * Math.random(),
        });
      }

      this.particleSystem.update();

      this.bg.scale.y = smoothstep(1, 0.02, t);
      this.bg.scale.x = smoothstep(1, 0.1, t);
      this.bg.scale.z = smoothstep(1, 0.1, t);
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(34 / 255, 34 / 255, 34 / 255));
      this.particleSystem.render();
      super.render(renderer);
    }
  }

  global.butterflies = butterflies;
})(this);
