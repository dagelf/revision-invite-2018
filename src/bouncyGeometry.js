(function (global) {
  class bouncyGeometry extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      /*
      Author: Iver
      */

      // MISC
      this.random = new Random(666);

      // SCENE
      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });

      // CAMERA
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      // TEXT
      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');
      this.textTexture = new THREE.Texture(this.textCanvas);
      this.textTexture.minFilter = THREE.LinearFilter;
      this.textTexture.magFilter = THREE.LinearFilter;
      this.textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
          map: this.textTexture,
        })
      );
      this.scene.add(this.textPlane);


      // HEXAGONS
      const whiteColor = 0xffffff;
      const grayColor = 0x373c3f;
      const greenColor = 0x77e15d;
      const pinkColor = 0xff4982;
      this.colors = {
        0: new THREE.MeshBasicMaterial({ color: grayColor }),
        1: new THREE.MeshBasicMaterial({ color: whiteColor }),
        2: new THREE.MeshBasicMaterial({ color: greenColor }),
        3: new THREE.MeshBasicMaterial({ color: pinkColor }),
      };
      this.numHexagonsX = 22;
      this.numHexagonsY = 21;
      const cylinderRadius = 0.2;
      const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderRadius / 4, 6);
      const padding = 0.1;
      const distanceBetweenHexagonCores = (2 * Math.sqrt(3.0) / 2.0) * cylinderRadius + padding;
      const offsetX = Math.sin(Math.PI / 6.0) * distanceBetweenHexagonCores;
      const offsetY = Math.cos(Math.PI / 6.0) * distanceBetweenHexagonCores;

      this.hexagons = new THREE.Object3D();
      for (let y = 0; y < this.numHexagonsY; y++) {
        for (let x = 0; x < this.numHexagonsX; x++) {
          const cylinder = new THREE.Mesh(
            cylinderGeometry,
            this.colors[0],
          );

          cylinder.rotation.x = Math.PI / 2;
          cylinder.rotation.y = Math.PI / 2;

          const offset = x % 2 === 1 ? offsetX : 0;
          cylinder.position.x = x * offsetY;
          cylinder.position.y = 2 * y * offsetX + offset;
          cylinder.x = x;
          cylinder.y = y;
          this.hexagons.add(cylinder);
        }
      }
      this.hexagons.position.x = -(this.numHexagonsX - 1) * offsetY / 2;
      this.hexagons.position.y = -(this.numHexagonsY - 0.5) * offsetX;
      this.hexagons.position.z = -80;

      // BALL
      this.ballGeometry = new THREE.SphereGeometry(1, 8, 8);
      this.ballTexture = Loader.loadTexture('res/checkers_color.png');
      this.ballTexture.minFilter = THREE.LinearFilter;
      this.ballTexture.magFilter = THREE.LinearFilter;
      this.ballMaterial = new THREE.MeshBasicMaterial(
        {map: this.ballTexture}
      );
      this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
      this.scene.add(this.ball);

      // BEAMS
      this.beamMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      this.beamGeometry = new THREE.BoxGeometry(.05, .05, 20);
      this.numBeams = 777;
      this.randomBeamNumbers = [];
      this.beams = [];
      for (let i = 0; i < this.numBeams; i++) {
        const beamMesh = new THREE.Mesh(this.beamGeometry, this.beamMaterial);
        this.randomBeamNumbers.push(this.random());
        this.beams.push(beamMesh);
        this.scene.add(beamMesh);
      }
      this.beamThicknessScalers = [1, 1, 1, 1, 1, 1];
      // TODO: turn into an object with direct property access, for performance reasons
      this.chordStabBeans = [
        0, 4, 10, 22, 24, 28, 34, 40, 42, 44, 46,
        48, 52, 58, 72, 76, 82, 96, 100, 106, 118,
        120, 124, 130, 136, 138, 130, 142, 144,
        148, 154, 168, 172, 178,

        192, 4 + 192, 10 + 192, 22 + 192, 24 + 192, 28 + 192, 34 + 192, 40 + 192, 42 + 192, 44 + 192, 46 + 192,
        48 + 192, 52 + 192, 58 + 192, 72 + 192, 76 + 192, 82 + 192, 96 + 192, 100 + 192, 106 + 192, 118 + 192,
        120 + 192, 124 + 192, 130 + 192, 136 + 192, 138 + 192, 130 + 192, 142 + 192,
        148 + 192, 154 + 192, 168 + 192, 172 + 192, 178 + 192,
      ];  // + 2976
      this.updateChordStabBeans = function(frame) {
        for (let i = 0; i < this.beamThicknessScalers.length; i++) {
          this.beamThicknessScalers[i] = Math.max(0.8, this.beamThicknessScalers[i] * 0.95);
        }
        const idx = this.chordStabBeans.indexOf(BEAN - 2976);
        if (idx !== -1) {
          let scalerIdx = idx % this.beamThicknessScalers.length;
          this.beamThicknessScalers[scalerIdx] = 4;
        }
      };

      // TODO: turn into an object with direct property access, for performance reasons
      this.leadBeans = [
        3072, 3082, 3090, 3094, 3096, 3102, 3106, 3112, 3114, 3118, 3120, 3130, 3138, 3142, 3144, 3150, 3154, 3168,
        3178, 3186, 3190, 3192, 3198, 3202, 3210, 3214, 3216, 3226, 3234, 3238, 3240, 3244, 3246, 3250, 3264, 3274,
        3282, 3286, 3288, 3294, 3298, 3306, 3310,
      ];

      // FRACTURE
      /*
      this.fractureMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      this.fractureSize = 0.3;
      this.fractureGeometry = new THREE.BoxGeometry(this.fractureSize, this.fractureSize, this.fractureSize);
      this.numfractureParts = 225;
      this.fractureParts = [];
      for (let i = 0; i < this.numfractureParts; i++) {
        const fractureMesh = new THREE.Mesh(this.fractureGeometry, this.fractureMaterial);
        this.fractureParts.push(fractureMesh);
        this.scene.add(fractureMesh);
      }
      */

      // REVISION LOGO
      this.revisionLogoSegments = [
        [],
        [[0, 360]],
        [[-158, -101]],
        [[48, 87], [161, 177], [-71, -27]],
        [[31, 122], [137, 166], [-95, 18]],
        [[0, 360]],
        [[62,73], [91, 115], [173, -126], [-99, -72], [-46, -34], [-17, 1]],
        [[0, 360]],
        [[2, 61], [-135, -127]]
      ];


      // PARTICLES
      this.generateParticleSprite = function() {
        const canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';

        // https://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
        function star(ctx, x, y, r, p, m) {
          ctx.save();
          ctx.beginPath();
          ctx.translate(x, y);
          ctx.moveTo(0, 0 - r);
          for (let i = 0; i < p; i++) {
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - (r * m));
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - r);
          }
          ctx.fill();
          ctx.restore();
        }

        star(ctx, 8, 8, 7, 5, 0.5);

        return canvas;
      };
      this.ps = new ParticleSystem({
        color: new THREE.Color(0xffffff),
        amount: 3000,
        decayFactor: 0.98,
        gravity: 0,
        generateSprite: this.generateParticleSprite
      });
      this.ps.particles.position.x = 0;
      this.ps.particles.position.y = 0;
      this.ps.particles.position.z = 0;
      this.ps.particles.visible = true;
      this.scene.add(this.ps.particles);
    }

    setBeamsVisibility(visible) {
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        beam.visible = visible;
      }
    }

    update(frame) {
      this.updateChordStabBeans(frame);
      if (BEAN >= 2976 && BEAN < 3024) {
        return this.updatePart1(frame);
      } else if (BEAN >= 3024 && BEAN < 3072) {
        return this.updatePart2(frame);
      } else if (BEAN >= 3072 && BEAN < 3120) {
        return this.updatePart3(frame);
      } else if (BEAN >= 3120 && BEAN < 3312) {
        return this.updatePart4(frame);
      } else if (BEAN >= 3312) {
        return this.updateLastTextPart(frame);
      }
    }

    // 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    updatePart1(frame) {
      demo.nm.nodes.bloom.opacity = 0.1;

      this.scene.remove(this.textPlane);
      this.scene.add(this.ball);
      this.ps.particles.visible = false;
      this.scene.remove(this.hexagons);

      this.ps.decayFactor = 0.98;

      const startFrame = FRAME_FOR_BEAN(2976);
      const endFrame = FRAME_FOR_BEAN(3024);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      // BALL
      this.ball.position.x = 0;
      this.ball.position.y = 0;
      this.ball.position.z = 0;
      this.ball.rotation.x = frame / 40;
      this.ball.rotation.y = frame / 45;

      // BEAMS
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.position.z = -180 + (1.66 * frame + i) % 190;
        beam.scale.z = 1;
        beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
      }

      // CAMERA
      this.camera.position.x = lerp(0, 0.8, progress);
      this.camera.position.y = 0;
      this.camera.position.z = 6;
      this.camera.lookAt(this.ball.position);
    }

    // 22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
    updatePart2(frame) {
      demo.nm.nodes.bloom.opacity = 0.1;

      this.scene.remove(this.textPlane);
      this.scene.add(this.ball);
      this.ps.particles.visible = true;
      this.setBeamsVisibility(true);
      this.scene.remove(this.hexagons);

      this.ps.decayFactor = 0.98;

      const startFrame = FRAME_FOR_BEAN(3024);
      const endFrame = FRAME_FOR_BEAN(3072);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      // BALL
      this.ball.position.x = 0;
      this.ball.position.y = 0;
      this.ball.position.z = lerp(60, -60, progress);
      this.ball.rotation.x = frame / 40;
      this.ball.rotation.y = frame / 45;

      // CAMERA
      const cameraRotationBefore = this.camera.rotation.y;
      const cameraMovement = Math.pow(progress + 0.1, 3);
      this.camera.position.x = 6;
      this.camera.position.y = 0;
      this.camera.position.z = 12  - 32 * cameraMovement;
      this.camera.lookAt(this.ball.position);
      const cameraRotationDelta = Math.abs(this.camera.rotation.y - cameraRotationBefore) || 0.2;

      const beamScale = 0.3 * progress * progress + cameraRotationDelta * 2.2;

      // BEAMS
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.scale.z = 0.02 + beamScale * 5;
        beam.position.z = (-190 / 2 +  (1 * frame + i) % 190) + 20 * beam.scale.z / 2;
        beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
      }

      // PARTICLES
      for(let i = 0; i < 50; i++) {
        const angle = this.random() * Math.PI * 2;
        const angle2 = this.random() * Math.PI;
        const radius = 0.8;
        const velocityAngle = this.random() * Math.PI * 2;
        const velocityAngle2 = this.random() * Math.PI * 2;
        const velocityRadius = 0.05;
        this.ps.spawn(
          {
            x: this.ball.position.x + Math.sin(angle) * radius,
            y: this.ball.position.y + Math.cos(angle) * radius,
            z: this.ball.position.z + Math.sin(angle2) * radius + 2 * (1 - progress),
          },
          {
            x: Math.sin(velocityAngle2) * velocityRadius,
            y: Math.sin(velocityAngle) * velocityRadius,
            z: 0,
          },
          0.012
        );
      }
      this.ps.update();

      // FRACTURE PARTS
      /*
      for (let i = 0; i < this.fractureParts.length; i++) {
        const fracturePart = this.fractureParts[i];
        fracturePart.position.x = this.fractureSize * (i % 15) - 7.5 * this.fractureSize;
        fracturePart.position.y = this.fractureSize * ((i / 15) | 0)  - 7.5 * this.fractureSize;
        fracturePart.position.z = -80;
        fracturePart.rotation.x = 0;
        fracturePart.rotation.y = 0;
        fracturePart.rotation.z = 0;
      }
      */
    }

    // 33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
    updatePart3(frame) {
      demo.nm.nodes.bloom.opacity = 0.1;

      this.scene.remove(this.textPlane);
      this.scene.add(this.ball);
      this.ps.particles.visible = true;
      this.setBeamsVisibility(true);
      this.scene.add(this.hexagons);

      this.ps.decayFactor = 0.98;

      const startFrame = FRAME_FOR_BEAN(3072);
      const endFrame = FRAME_FOR_BEAN(3120);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      this.camera.position.x = 6 * Math.cos(frame / 85 - 1.5);
      this.camera.position.y = 6 * Math.sin(frame / 85 - 0.5);
      this.camera.position.z = -70;

      // PARTICLES
      for(let i = 0; i < 10; i++) {
        const angle = this.random() * Math.PI * 2;
        const angle2 = this.random() * Math.PI;
        const radius = 0.8;
        const velocityAngle = this.random() * Math.PI * 2;
        const velocityAngle2 = this.random() * Math.PI * 2;
        const velocityRadius = 0.01;
        this.ps.spawn(
          {
            x: this.ball.position.x + Math.sin(angle) * radius,
            y: this.ball.position.y + Math.cos(angle) * radius,
            z: this.ball.position.z + Math.sin(angle2) * radius + 2 * (1 - progress),
          },
          {
            x: Math.sin(velocityAngle2) * velocityRadius,
            y: Math.sin(velocityAngle) * velocityRadius,
            z: 0,
          },
          0.012
        );
      }
      this.ps.update();

      // BEAMS
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.position.z = -190 + (0.09 * frame + i) % 190;
        beam.scale.z = 1;
        beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
      }

      // BALL
      this.ball.position.x = 0;
      this.ball.position.y = 0;
      this.ball.position.z = lerp(-70, -79, progress);
      this.ball.rotation.x = lerp(2, 0, progress);
      this.ball.rotation.y = lerp(2, 0, progress);

      this.camera.lookAt(new THREE.Vector3(0, 0, -80));

      // HEXAGONS
      for (let i = 0; i < this.hexagons.children.length; i++) {
        const hexagon = this.hexagons.children[i];
        hexagon.traverse((obj) => {
          obj.material = this.colors[0]; // grey
        });
      }

      // FRACTURE PARTS
      /*
      for (let i = 0; i < this.fractureParts.length; i++) {
        const fracturePart = this.fractureParts[i];
        fracturePart.position.x = this.fractureSize * (i % 15) - 7.5 * this.fractureSize;
        fracturePart.position.y = this.fractureSize * ((i / 15) | 0)  - 7.5 * this.fractureSize;
        fracturePart.position.z = -80;
        fracturePart.rotation.x = 0;
        fracturePart.rotation.y = 0;
        fracturePart.rotation.z = 0;
      }
      */
    }

    // 44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444
    updatePart4(frame) {
      this.scene.add(this.hexagons);

      const startFrame = FRAME_FOR_BEAN(3120);
      const endFrame = FRAME_FOR_BEAN(3168);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      this.ps.decayFactor = 0.99999;

      demo.nm.nodes.bloom.opacity = Math.max(0.1, demo.nm.nodes.bloom.opacity - 0.03);
      if (BEAN === 3120) {
        this.cameraShakeAngularVelocity.x = (this.random() - 0.5) * 0.05;
        this.cameraShakeAngularVelocity.y = (this.random() - 0.5) * 0.05;
        this.cameraShakeAngularVelocity.z = (this.random() - 0.5) * 0.05;
        demo.nm.nodes.bloom.opacity = 1.99;
      }

      this.camera.lookAt(new THREE.Vector3(0, 0, lerp(-80, -90, progress)));

      this.cameraShakeAcceleration.x = -this.cameraShakePosition.x * 0.05;
      this.cameraShakeAcceleration.y = -this.cameraShakePosition.y * 0.05;
      this.cameraShakeAcceleration.z = -this.cameraShakePosition.z * 0.05;
      this.cameraShakeAngularAcceleration.x = -this.cameraShakeRotation.x * 0.05;
      this.cameraShakeAngularAcceleration.y = -this.cameraShakeRotation.y * 0.05;
      this.cameraShakeAngularAcceleration.z = -this.cameraShakeRotation.z * 0.05;
      this.cameraShakeVelocity.add(this.cameraShakeAcceleration);
      this.cameraShakeAngularVelocity.add(this.cameraShakeAngularAcceleration);
      this.cameraShakeVelocity.multiplyScalar(0.95);
      this.cameraShakeAngularVelocity.multiplyScalar(0.95);
      this.cameraShakePosition.add(this.cameraShakeVelocity);
      this.cameraShakeRotation.add(this.cameraShakeAngularVelocity);

      this.camera.position.x = 6 * Math.cos(frame / 85 - 2);
      this.camera.position.y = 6 * Math.sin(frame / 85 - lerp(1, 2, progress));
      this.camera.position.z = -70;

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;

      // BALL
      this.ball.position.x = 0;
      this.ball.position.y = 0;
      this.ball.position.z = -79 + 5 * progress;
      this.ball.rotation.x = lerp(0, 2, progress);
      this.ball.rotation.y = lerp(0, 2, progress);

      // HEXAGONS

      const idx = this.leadBeans.indexOf(BEAN);
      if (idx !== -1) {
        if (idx >= 10) {
          this.hexagonRadius = (idx - 9) * 0.9;
        }
      }
      if (!this.hexagonRadius) {
        this.hexagonRadius = 0;
      }

      for (let i = 0; i < this.hexagons.children.length; i++) {
        const hexagon = this.hexagons.children[i];
        hexagon.traverse((obj) => {
          const x = obj.position.x + this.hexagons.position.x;
          const y = obj.position.y + this.hexagons.position.y;
          const distanceToCenter = Math.sqrt(x * x + y * y);
          if (distanceToCenter <= this.hexagonRadius) {
            obj.material = this.colors[i % 4];
          } else {
            //obj.visible = false;
          }
        });
      }

      // FRACTURE PARTS
      /*
      for (let i = 0; i < this.fractureParts.length; i++) {
        const fracturePart = this.fractureParts[i];
        let x = this.fractureSize * (i % 15) - 7.5 * this.fractureSize;
        let y = this.fractureSize * ((i / 15) | 0)  - 7.5 * this.fractureSize;
        const distanceToCenter = Math.sqrt(x * x + y * y);
        const impact = 1 / (distanceToCenter +   1);
        fracturePart.position.x = x + 2.2 * progress * x * impact;
        fracturePart.position.y = y + 2.2 * progress * y * impact;
        fracturePart.position.z = -80 - 20 * progress * impact;
        fracturePart.rotation.x = 0;
        fracturePart.rotation.y = 0;
        fracturePart.rotation.z = 0;

        // PARTICLES
        if (BEAN >= 3120) {
          const beanDiff = BEAN - 3120;
          const factor = 0 | (5 * impact / (beanDiff / 2 + 1));
          for (let i = 0; i < factor; i++) {
            const angle = this.random() * Math.PI * 2;
            const angle2 = this.random() * Math.PI;
            const radius = 0.8;
            const velocityAngle = this.random() * Math.PI * 2;
            const velocityAngle2 = this.random() * Math.PI * 2;
            const velocityRadius = 0.01;
            this.ps.spawn(
              {
                x: fracturePart.position.x + Math.sin(angle) * radius,
                y: fracturePart.position.y + Math.cos(angle) * radius,
                z: fracturePart.position.z + Math.sin(angle2) * radius,
              },
              {
                x: Math.sin(velocityAngle2) * velocityRadius,
                y: Math.sin(velocityAngle) * velocityRadius,
                z: -0.1 * this.random(),
              },
              0.014
            );
          }
        }
      }
      */

      // BEAMS
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.position.z = -190 + (0.09 * frame + i) % 190;
        beam.scale.z = 1;
        beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
      }

      this.ps.update();
    }

    // ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
    updateLastTextPart(frame) {
      demo.nm.nodes.bloom.opacity = 0.1;
      this.scene.add(this.textPlane);
      this.scene.remove(this.ball);
      this.scene.remove(this.hexagons);
      this.ps.particles.visible = false;

      const white = 'white';
      let text = '';
      let foregroundColor = white;
      if (BEAN >= 3312 && BEAN < 3316) {
        foregroundColor = '#373C3F';
        text = 'At';
      } else if (BEAN >= 3316 && BEAN < 3322) {
        foregroundColor = white;
        text = 'At Easter'
      } else if (BEAN >= 3322 && BEAN < 3336) {
        foregroundColor = '#373C3F';
        text = 'At Easter 2018';
      } else if (BEAN >= 3336 && BEAN < 3340) {
        text = 'things';
        foregroundColor = white;
      } else if (BEAN >= 3340 && BEAN < 3346) {
        text = 'things will be';
        foregroundColor = '#373C3F';
      } else if (BEAN >= 3346) {
        text = 'things will be different';
        foregroundColor = white;
      }
      const backgroundColor = foregroundColor === white ? '#373C3F': white;

      // TEXT
      this.textCanvas.width = this.textCanvas.width;
      this.textCtx.fillStyle = backgroundColor;
      this.textCtx.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);
      this.textCtx.font = `bold ${GU}px schmalibre`;
      this.textCtx.textAlign = 'center';
      this.textCtx.fillStyle = foregroundColor;
      this.textCtx.fillText(text, GU * 8, GU * 4.5);

      this.textTexture.needsUpdate = true;

      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 9;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(0x373C3F));
      this.ps.render();
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
      this.textCanvas.width = 16 * GU;
      this.textCanvas.height = 9 * GU;
    }
  }

  global.bouncyGeometry = bouncyGeometry;
})(this);
