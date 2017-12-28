(function (global) {
  class hexafont extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          debug: new NIN.TextureOutput(),
        }
      });

      this.drawGridTranslations = [{
        x: 0,
        y: 0,
      }];

      this.numX = 96;
      this.numY = 65;
      this.drawNumX = 42;
      this.drawNumY = 25;
      this.drawOffsetX = (this.numX - this.drawNumX);
      this.drawOffsetY = (this.numY - this.drawNumY);

      this.risers = [];
      for(let i = 0; i < 50; i++) {
        this.risers[i] = {
          x: Math.random() * this.numX | 0,
          y: Math.random() * this.numY | 0,
          dy: (1 + Math.random()) * 0.5,
          color: 3,
        };
      }

      const WHITE = 1;

      this.lines = this.makeLines([{
        /* R */
        color: WHITE,
        from: {x: 2, y: 10},
        to: {x: 2, y: 18},
        startBean: 1632,
        endBean: 1632 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 3, y: 10},
        to: {x: 3, y: 17},
        startBean: 1632,
        endBean: 1632 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 2, y: 11},
        to: {x: 7, y: 8},
        startBean: 1632,
        endBean: 1632 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 3, y: 11},
        to: {x: 7, y: 9},
        startBean: 1632,
        endBean: 1632 + 6,
        easing: easeOut,

      /* E */
      }, {
        color: WHITE,
        from: {x: 8, y: 8},
        to: {x: 8, y: 14},
        startBean: 1632 + 9,
        endBean: 1632 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 9, y: 8},
        to: {x: 9, y: 14},
        startBean: 1632 + 9,
        endBean: 1632 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 8, y: 14},
        to: {x: 13, y: 12},
        startBean: 1632 + 9 + 2,
        endBean: 1632 + 9 + 6 + 2,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 8, y: 14},
        to: {x: 13, y: 11},
        startBean: 1632 + 9 + 2,
        endBean: 1632 + 9 + 6 + 2,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 8, y: 11},
        to: {x: 13, y: 9},
        startBean: 1632 + 9 + 1,
        endBean: 1632 + 9 + 6 + 1,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 8, y: 11},
        to: {x: 13, y: 8},
        startBean: 1632 + 9 + 1,
        endBean: 1632 + 9 + 6 + 1,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 8, y: 8},
        to: {x: 13, y: 6},
        startBean: 1632 + 9,
        endBean: 1632 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 8, y: 8},
        to: {x: 13, y: 5},
        startBean: 1632 + 9,
        endBean: 1632 + 9 + 6,
        easing: easeOut,

      /* V */
      }, {
        color: WHITE,
        from: {x: 15, y: 4},
        to: {x: 14, y: 10},
        startBean: 1632 + 24,
        endBean: 1632 + 24 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 15, y: 4},
        to: {x: 15, y: 10},
        startBean: 1632 + 24,
        endBean: 1632 + 24 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 16, y: 10},
        to: {x: 19, y: 9},
        startBean: 1632 + 24,
        endBean: 1632 + 24 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 17, y: 3},
        to: {x: 17, y: 9},
        startBean: 1632 + 24,
        endBean: 1632 + 24 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 18, y: 3},
        to: {x: 18, y: 9},
        startBean: 1632 + 24,
        endBean: 1632 + 24 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 18, y: 3},
        to: {x: 18, y: 3},
        startBean: 1632 + 24,
        endBean: 1632 + 24 + 6,
        easing: easeOut,

      /* I */
      }, {
        color: WHITE,
        from: {x: 20, y: 1},
        to: {x: 20, y: 9},
        startBean: 1632 + 24 + 9,
        endBean: 1632 + 24 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 21, y: 1},
        to: {x: 21, y: 8},
        startBean: 1632 + 24 + 9,
        endBean: 1632 + 24 + 9 + 6,
        easing: easeOut,

      /* S */
      }, {
        elFlippa: true,
        color: WHITE,
        from: {x: 16, y: 12},
        to: {x: 16, y: 16},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 17, y: 12},
        to: {x: 17, y: 16},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 16, y: 13},
        to: {x: 22, y: 10},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 16, y: 14},
        to: {x: 22, y: 10},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 18, y: 15},
        to: {x: 22, y: 13},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 16, y: 16},
        to: {x: 22, y: 13},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 16, y: 19},
        to: {x: 22, y: 16},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 16, y: 19},
        to: {x: 22, y: 17},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 21, y: 15},
        to: {x: 21, y: 16},
        startBean: 1632 + 24 + 18,
        endBean: 1632 + 24 + 18 + 6,
        easing: easeOut,

      /* I */
      }, {
        color: WHITE,
        from: {x: 24, y: 9},
        to: {x: 23, y: 16},
        startBean: 1632 + 48 + 12,
        endBean: 1632 + 48 + 12 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 24, y: 9},
        to: {x: 24, y: 16},
        startBean: 1632 + 48 + 12,
        endBean: 1632 + 48 + 12 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 24, y: 9},
        to: {x: 24, y: 8},
        startBean: 1632 + 48 + 12,
        endBean: 1632 + 48 + 12 + 6,
        easing: easeOut,

      /* O */
      }, {
        color: WHITE,
        from: {x: 27, y: 7},
        to: {x: 26, y: 14},
        startBean: 1632 + 48 + 12 + 9,
        endBean: 1632 + 48 + 12 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 27, y: 7},
        to: {x: 27, y: 14},
        startBean: 1632 + 48 + 12 + 9,
        endBean: 1632 + 48 + 12 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 27, y: 14},
        to: {x: 31, y: 12},
        startBean: 1632 + 48 + 12 + 9 + 2,
        endBean: 1632 + 48 + 12 + 9 + 2 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 27, y: 13},
        to: {x: 31, y: 11},
        startBean: 1632 + 48 + 12 + 9 + 2,
        endBean: 1632 + 48 + 12 + 9 + 2 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 30, y: 6},
        to: {x: 30, y: 11},
        startBean: 1632 + 48 + 12 + 9 + 1,
        endBean: 1632 + 48 + 12 + 9 + 1 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 29, y: 6},
        to: {x: 29, y: 11},
        startBean: 1632 + 48 + 12 + 9 + 1,
        endBean: 1632 + 48 + 12 + 9 + 1 + 6,
        easing: easeOut,

      /* N */
      }, {
        color: WHITE,
        from: {x: 32, y: 4},
        to: {x: 32, y: 12},
        startBean: 1632 + 48 + 12 + 18,
        endBean: 1632 + 48 + 12 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 33, y: 5},
        to: {x: 33, y: 11},
        startBean: 1632 + 48 + 12 + 18,
        endBean: 1632 + 48 + 12 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 32, y: 5},
        to: {x: 38, y: 7},
        startBean: 1632 + 48 + 12 + 18,
        endBean: 1632 + 48 + 12 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 32, y: 4},
        to: {x: 37, y: 8},
        startBean: 1632 + 48 + 12 + 18,
        endBean: 1632 + 48 + 12 + 18 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 37, y: 8},
        to: {x: 37, y: 2},
        startBean: 1632 + 48 + 12 + 18 + 9,
        endBean: 1632 + 48 + 12 + 18 + 9 + 6,
        easing: easeOut,
      }, {
        color: WHITE,
        from: {x: 38, y: 8},
        to: {x: 38, y: 1},
        startBean: 1632 + 48 + 12 + 18 + 9,
        endBean: 1632 + 48 + 12 + 18 + 9 + 6,
        easing: easeOut,

      /* lines */
      }, {
        color: 3,
        from: {x: 1, y: 20},
        to: {x: 15, y: 13},
        startBean: 1632 + 96,
        endBean: 1632 + 96 + 6,
        easing: easeOut,
      }, {
        color: 3,
        from: {x: 14, y: 14},
        to: {x: 14, y: 16},
        startBean: 1632 + 96 + 4,
        endBean: 1632 + 96 + 4 + 6,
        easing: easeOut,
      }, {
        color: 2,
        from: {x: 3, y: 20},
        to: {x: 14, y: 15},
        startBean: 1632 + 96,
        endBean: 1632 + 96 + 6,
        easing: easeOut,

      }, {
        color: 2,
        from: {x: 37, y: 0},
        to: {x: 23, y: 7},
        startBean: 1632 + 96 + 9,
        endBean: 1632 + 96 + 9 + 6,
        easing: easeOut,
      }, {
        color: 3,
        from: {x: 35, y: 0},
        to: {x: 23, y: 6},
        startBean: 1632 + 96 + 9,
        endBean: 1632 + 96 + 9 + 6,
        easing: easeOut,
      }, {
        color: 3,
        from: {x: 23, y: 6},
        to: {x: 25, y: 4},
        startBean: 1632 + 96 + 9 + 4,
        endBean: 1632 + 96 + 9 + 4 + 6,
        easing: easeOut,
      }, {
        color: 2,
        from: {x: 23, y: 6},
        to: {x: 24, y: 4},
        startBean: 1632 + 96 + 9 + 4,
        endBean: 1632 + 96 + 9 + 4 + 6,
        easing: easeOut,
      }]);

      this.easings = {
        lerp,
        smoothstep,
        easeIn,
        easeOut,
        step: (a, b, t) => (t >= 1 ? b : a),
      };


      this.scene.add(new THREE.AmbientLight(0x373c3f));

      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      this.cameraPositionPath = this.path([{
        bean: 1632 + 6 - 3,
        easing: 'step',
        value: {
          x: -6.394326333240326,
          y: 2.376763542579813,
          z: -10.855111388561976,
        },
      }, {
        bean: 1632 + 9,
        easing: 'easeIn',
        value: {
          x: -4.265797038404421,
          y: 1.165803336565878,
          z: -11.040591516034008,
        }

      }, {
        bean: 1632 + 24 - 3,
        easing: 'step',
        value: {
          x: -4.265797038404421,
          y: 1.165803336565878,
          z: -11.040591516034008,
        }
      }, {
        bean: 1632 + 24,
        easing: 'easeIn',
        value: {
          x: -1.644032866482636,
          y: -0.32576743460131813,
          z: -11.269052150327111,
        }

      }, {
        bean: 1632 + 24 + 9 - 3,
        easing: 'step',
        value: {
          x: -1.644032866482636,
          y: -0.32576743460131813,
          z: -11.269052150327111,
        }
      }, {
        bean: 1632 + 24 + 9,
        easing: 'easeIn',
        value: {
          x: 0.512861032781283,
          y: -1.7100065768586081,
          z: -10.388499424852757,
        }

      }, {
        bean: 1632 + 24 + 9 + 9 -3,
        easing: 'step',
        value: {
          x: 0.512861032781283,
          y: -1.7100065768586081,
          z: -10.388499424852757,
        }
      }, {
        bean: 1632 + 24 + 9 + 9,
        easing: 'easeIn',
        value: {
          x: 0.39945368193262465,
          y: 0.4353303335010363,
          z: -34.322423444873575,
        }
        /*
      }, {
        bean: 1632 + 48 + 12 + 9 - 3,
        easing: 'step',
      }, {
        bean: 1632 + 48 + 12 + 9,
        easing: 'easeIn',
        value: {
          x: 4.24376756319672,
          y: 1.6926310672481006,
          z: -5.977247282640662,
        }
      }, {
        bean: 1632 + 48 + 12 + 18 - 3,
        easing: 'step',
      }, {
        bean: 1632 + 48 + 12 + 18,
        easing: 'easeIn',
        value: {
          x: 6.320915736734447,
          y: 3.763425633245651,
          z: -10.722103829131264,
        }
        */
      }, {
        bean: 1632 + 48 + 12 + 9,
        easing: 'step',
      }, {
        bean: 1632 + 48 + 12 + 18 + 9,
        easing: 'smoothstep',
        value: {
          x: 0.008243744640454412,
          y: 0.05297766613836582,
          z: -28.2
        }
      }]);

      this.cameraQuaternionPath = this.path([{
        bean: 1632,
        easing: 'step',
        value: {
          x: -0.9651158828426852,
          y: 0.2566955191223321,
          z: 0.027531083486885613,
          w: 0.04359796542659594,
        }
      }, {
        bean: 1632 + 24 + 9 + 9 - 3,
        easing: 'step',
        value: {
          x: -0.9651158828426852,
          y: 0.2566955191223321,
          z: 0.027531083486885613,
          w: 0.04359796542659594,
        }
      }, {
        bean: 1632 + 24 + 9 + 9,
        easing: 'easeIn',
        value: {
          x: -0.9999325391421946,
          y: -0.005582654411508205,
          z: -0.007062990946289542,
          w: 0.007339297872259038,
        }
        /*
      }, {
        bean: 1632 + 48 + 12 + 9 - 3,
        easing: 'step',
      }, {
        bean: 1632 + 48 + 12 + 9,
        easing: 'easeIn',
        value: {
          x: -0.9519860017637142,
          y: 0.2586886002389007,
          z: -0.06784707393079398,
          w: 0.14899541976653255,
        }
      }, {
        bean: 1632 + 48 + 12 + 18 - 3,
        easing: 'step',
      }, {
        bean: 1632 + 48 + 12 + 18,
        easing: 'easeIn',
        value: {
          x: -0.9669952585535975,
          y: 0.15063583778312203,
          z: -0.05026992378017342,
          w: 0.1992534794511092,
        }
      }, {
        bean: 1632 + 48 + 12 + 18 + 9 - 3,
        easing: 'step',
        */
      }, {
        bean: 1632 + 48 + 12 + 18 + 9,
        easing: 'step',
        value: {
          x: 0.999998034533278,
          y: 0.0009166563098237442,
          z: 0.00048593238933187924,
          w: 0.00014569792018316813,
        }
      }]);

      const whiteColor = 0xffffff;
      const grayColor = 0x373c3f;
      const greenColor = 0x77e15d;
      const pinkColor = 0xff4982;

      this.directionalLight = new THREE.DirectionalLight();
      this.directionalLight.intensity = 1;
      this.directionalLight.position.z = 1;
      this.directionalLight.position.x = 1;
      this.directionalLight.position.y = 1;
      this.scene.add(this.directionalLight);

      this.directionalLight2 = new THREE.DirectionalLight();
      this.directionalLight2.intensity = 1;
      this.directionalLight2.position.z = 1;
      this.directionalLight2.position.x = -1;
      this.directionalLight2.position.y = 1;
      this.scene.add(this.directionalLight2);

      this.directionalLight2 = new THREE.DirectionalLight();
      this.directionalLight2.position.set(1, 1, -1);
      this.scene.add(this.directionalLight2);

      this.colors = {
        0: new THREE.MeshStandardMaterial({
          emissive: grayColor,
          emissiveIntensity: 0.5,
          metalness: 0,
          roughness: 0.5,
          color: grayColor,
        }),
        1: new THREE.MeshStandardMaterial({
          emissive: whiteColor,
          emissiveIntensity: 0.5,
          metalness: 0,
          roughness: 0.5,
          color: grayColor,
        }),
        2: new THREE.MeshStandardMaterial({
          emissive: greenColor,
          emissiveIntensity: 0.5,
          metalness: 0,
          roughness: 0.5,
          color: grayColor,
        }),
        3: new THREE.MeshStandardMaterial({
          emissive: pinkColor,
          emissiveIntensity: 0.5,
          metalness: 0,
          roughness: 0.5,
          color: grayColor,
        }),
      };

      const cylinderRadius = 0.2;
      const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderRadius / 4, 6);
      const padding = 0.1;
      const distanceBetweenHexagonCores = (2 * Math.sqrt(3.0) / 2.0) * cylinderRadius + padding;
      const offsetX = Math.sin(Math.PI / 6.0) * distanceBetweenHexagonCores;
      const offsetY = Math.cos(Math.PI / 6.0) * distanceBetweenHexagonCores;

      this.boxes = new THREE.Object3D();
      this.grid = [];
      this.drawGrid = [];
      this.allgons = [];
      for (let y = -this.drawOffsetY; y < this.numY + this.drawOffsetY; y++) {
        if(y >= 0 && y < this.numY) {
          this.grid[y] = [];
          this.drawGrid[y] = [];
        }
        for (let x = -this.drawOffsetX; x < this.numX + this.drawOffsetX; x++) {
          const cylinder = new THREE.Mesh(
            cylinderGeometry,
            new THREE.MeshStandardMaterial({
              metalness: 0,
              roughness: 0.5,
              color: grayColor,
              emissiveIntensity: 0,
              emissive: 0,
            }));

          this.allgons.push(cylinder);

          cylinder.rotation.x = Math.PI / 2;
          cylinder.rotation.y = Math.PI / 2;
          cylinder.scale.x = 1.2;
          cylinder.scale.y = 1.2;
          cylinder.scale.z = 1.2;

          const offset = (x + 100) % 2 == 1 ? offsetX : 0;
          cylinder.position.x = x * offsetY;
          cylinder.position.y = 2 * y * offsetX + offset;
          cylinder.x = x;
          cylinder.y = y;
          cylinder.targetPosition = cylinder.position.clone();
          cylinder.startPosition = cylinder.position.clone();
          cylinder.startPosition.y -= 20;
          cylinder.startPosition.x -= 10;
          cylinder.beanOffset = x * .5 + Math.random() * 5;
          this.boxes.add(cylinder);
          if(y >= 0 && y < this.numY && x >= 0 && x < this.numX) {
            this.grid[y][x] = cylinder;
          }
          if(y >= 0 && y < this.drawNumY && x >= 0 && x < this.drawNumX) {
            this.drawGrid[y][x] = 0;
          }
        }
      }

      this.scene.add(this.boxes);
      this.boxes.position.x = -(this.numX - 1) * offsetY / 2;
      this.boxes.position.y = -(this.numY - 0.5) * offsetX;

      //this.camera = new THREE.OrthographicCamera(-8, 8, -4.5, 4.5, 1, 1000);

      this.camera.up = new THREE.Vector3(0, -1, 0);
      this.camera.position.z = -28;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();
    }

    makeLines(items) {
      for(let i = 0; i < items.length; i++) {
        const item = items[i];
        item.from.y++;
        item.to.y++;
        const length = Math.sqrt(
          Math.pow(item.from.x - item.to.x, 2) +
          Math.pow(item.from.y - item.to.y, 2));
        item.length = length;
        item.startFrame = FRAME_FOR_BEAN(item.startBean);
        item.endFrame = FRAME_FOR_BEAN(item.endBean);
        item.easingLength = item.endFrame - item.startFrame;
      }
      return items;
    }

    drawGridPushTranslation(x, y) {
      const current = this.drawGridTranslations[
        this.drawGridTranslations.length - 1];
      this.drawGridTranslations.push({
        x: current.x + x - (x % 2), //Keep x even, or you'll have alternating coordinate system
        y: current.y + y,
      });
    }

    drawGridPopTranslation() {
      this.drawGridTranslations.pop();
    }

    drawPixel(x, y, color) {
      const translation = this.drawGridTranslations[
        this.drawGridTranslations.length - 1];
      x = x + translation.x;
      y = y + translation.y;
      if(x >= 0 && x < this.numX && y >= 0 && y < this.numY) {
        this.drawGrid[y][x] = color;
      }
    }

    drawLine(line, frame) {
      if(BEAN < line.startBean) {
        return;
      }
      const iterations = 20;
      for(let i = 0; i < iterations; i++) {
        if(i > line.easing(0, iterations, (
              frame - line.startFrame) / line.easingLength)) {
          break;
        }
        const t = i / iterations;
        const x = lerp(line.from.x, line.to.x, t) | 0;
        const y = (lerp(line.from.y, line.to.y, t) - 0.5 * (x % 2)) | 0;
        this.drawPixel(x, y, line.color);
      }
    }

    warmup(renderer) {
      this.update(4273);
      this.render(renderer);
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 0;
      super.update(frame);
      this.frame = frame;


      for(let i = 0; i < this.allgons.length; i++) {
        const item = this.allgons[i];
        let t = (frame - FRAME_FOR_BEAN(1596 + item.beanOffset)) / (
          FRAME_FOR_BEAN(1632 + item.beanOffset) - FRAME_FOR_BEAN(1596 + item.beanOffset));
        item.position.x = easeOut(
          item.startPosition.x,
          item.targetPosition.x,
          t);
        item.position.y = easeOut(
          item.startPosition.y,
          item.targetPosition.y,
          t);
        item.position.z = easeOut(
          item.startPosition.z,
          item.targetPosition.z,
          t);
        item.rotation.x = easeOut(-Math.PI * 4, Math.PI / 2, Math.pow(0.75 + t - i / this.allgons.length, 2));

        if(t >= 0 && t < 0.5) {
          item.material.emissive = this.colors[0].emissive;
          //item.material.emissiveIntensity = 1;
        }

        if(frame >= 4460 && frame < 4483) {
          item.material.emissive = this.colors[3].emissive;
        }
        if(frame >= 4483 && frame < 4497) {
          item.material.emissive = this.colors[2].emissive;
        }

      }

      for(let i = 0; i < this.drawGrid.length; i++) {
        for(let j = 0; j < this.drawGrid[i].length; j++) {
          this.drawGrid[i][j] = 0;
        }
      }

      for(let i = 0; i < this.risers.length; i++) {
        const riser = this.risers[i];
        riser.y += riser.dy;
        if(riser.y >= this.numY) {
          riser.y = riser.y % this.numY;
          riser.x = Math.random() * 42 | 0;
        }
        if(BEAN >= 1680 + 12 + 9 &&
            BEAN < 1680 + 12 + 9 + 9) {
          this.drawPixel(riser.x, riser.y | 0, 2);
        }
        if(BEAN >= 1680 + 12 + 9 + 9 &&
            BEAN < 1680 + 12 + 9 + 9 + 9) {
          this.drawPixel(riser.x, riser.y | 0, 3);
        }
        if(BEAN >= 1680 + 12 + 9 + 9 + 9 &&
            BEAN < 1728) {
          this.drawPixel(riser.x, riser.y | 0, 2);
        }
      }


      const t2 = (frame - FRAME_FOR_BEAN(1728 + 24)) / (
          FRAME_FOR_BEAN(1728 + 24 + 24) - FRAME_FOR_BEAN(1728 + 24));
      this.drawGridPushTranslation(
          easeOut(0, -24, t2) | 0,
          easeOut(0, 12, t2) | 0);
      if(t2 > 0) {
        for(let x = 0; x < 42; x++) {
          for(let y = 0; y < 22.5 - x / 2; y++) {
            this.drawPixel(x + 24, y - 12, 3);
          }
        }
      }

      for(let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i];
        if(line.elFlippa) {
          this.drawGridPopTranslation();
          this.drawGridPushTranslation(
            easeOut(0, 28, t2) | 0,
            easeOut(0, -14, t2) | 0);
        }
        this.drawLine(line, frame);
      }
      if(t2 > 0) {
        for(let x = 0; x < 42; x++) {
          for(let y = 0; y < x / 2; y++) {
            this.drawPixel(x - 28, (21 - y) + 14, 2);
          }
        }
      }
      this.drawGridPopTranslation();

      const baseBean = 1632;
      if(BEAT) {
        switch(BEAN) {
        case baseBean:
        case baseBean + 9:
        case baseBean + 24:
        case baseBean + 24 + 9:
        case baseBean + 24 + 9 + 9:
        case baseBean + 48 + 12 + 9:
        case baseBean + 48 + 12 + 9 + 48:
          this.cameraShakeVelocity.x = (this.camera.position.x -
            this.cameraPreviousPosition.x) * 0.5;
          this.cameraShakeVelocity.y = (this.camera.position.y -
            this.cameraPreviousPosition.y) * 0.5;
          this.cameraShakeVelocity.z = (this.camera.position.z -
            this.cameraPreviousPosition.z) * 0.5;
          this.cameraShakeAngularVelocity.x = (Math.random() - 0.5) * 0.01;
          this.cameraShakeAngularVelocity.y = (Math.random() - 0.5) * 0.01;
          this.cameraShakeAngularVelocity.z = (Math.random() - 0.5) * 0.01;
        }
      }

      const cameraPosition = this.getPoint(this.cameraPositionPath, frame);
      const cameraQuaternion = this.getPoint(this.cameraQuaternionPath, frame);

      this.cameraShakeAcceleration.x = -this.cameraShakePosition.x * 0.05;
      this.cameraShakeAcceleration.y = -this.cameraShakePosition.y * 0.05;
      this.cameraShakeAcceleration.z = -this.cameraShakePosition.z * 0.05;
      this.cameraShakeAngularAcceleration.x = -this.cameraShakeRotation.x * 0.05;
      this.cameraShakeAngularAcceleration.y = -this.cameraShakeRotation.y * 0.05;
      this.cameraShakeAngularAcceleration.z = -this.cameraShakeRotation.z * 0.05;
      this.cameraShakeVelocity.add(this.cameraShakeAcceleration);
      this.cameraShakeAngularVelocity.add(this.cameraShakeAngularAcceleration);
      this.cameraShakeVelocity.multiplyScalar(0.85);
      this.cameraShakeAngularVelocity.multiplyScalar(0.85);
      this.cameraShakePosition.add(this.cameraShakeVelocity);
      this.cameraShakeRotation.add(this.cameraShakeAngularVelocity);

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.copy(cameraPosition);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.quaternion.copy(cameraQuaternion);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;
      if(BEAN >= 1680 - 24 + 18 && BEAN < (1680 + 6)) {
        this.camera.position.x += (Math.random() - 0.5) * 0.5;
        this.camera.position.y += (Math.random() - 0.5) * 0.5;
        this.camera.position.z += (Math.random() - 0.5) * 0.5;
      }
      if(BEAN >= 1680 + 12 + 9 && BEAN < (1680 + 12 + 9 + 9 - 3)) {
        this.camera.position.x += (Math.random() - 0.5) * 0.5;
        this.camera.position.y += (Math.random() - 0.5) * 0.5;
        this.camera.position.z += (Math.random() - 0.5) * 0.5;
      }
      if(BEAN >= 1680 + 12 + 9 + 9 && BEAN < (1680 + 12 + 9 + 9 + 9 - 3)) {
        this.camera.position.x += (Math.random() - 0.5) * 0.5;
        this.camera.position.y += (Math.random() - 0.5) * 0.5;
        this.camera.position.z += (Math.random() - 0.5) * 0.5;
      }
      if(BEAN >= 1680 + 12 + 9 + 9 + 9 && BEAN < 1728 - 3) {
        this.camera.position.x += (Math.random() - 0.5) * 0.5;
        this.camera.position.y += (Math.random() - 0.5) * 0.5;
        this.camera.position.z += (Math.random() - 0.5) * 0.5;
      }

      if(frame > 4500 && frame < 4600){
        this.camera.position.x = -11;
        this.camera.position.y = -8;
        this.camera.position.z = -50;
      }

      for(let i = 0; i < this.grid.length; i++) {
        for(let j = 0; j < this.grid[i].length; j++) {
          this.grid[i][j].material.emissiveIntensity *= 0.85;
          this.grid[i][j].rotation.z *= 0.9;
        }
      }

      for(let y = 0; y < this.drawGrid.length; y++) {
        for(let x = 0; x < this.drawGrid[y].length; x++) {
          if(this.drawGrid[y][x]) {
            if(BEAN >= 1632) {
                this.grid[y][x].material.emissive = this.colors[this.drawGrid[y][x]].emissive;
            }
          }
          if(this.drawGrid[y][x] > 0) {
            if(this.grid[y][x].material.emissiveIntensity < 0.25) {
              if(this.drawGrid[y][x] == 1) {
                this.grid[y][x].rotation.z = Math.PI;
              }
            }
            this.grid[y][x].material.emissiveIntensity = 1;
          }
        }
      }
    }

    render(renderer) {
      renderer.setClearColor(0x161718, 1.0);
      super.render(renderer);
    }

    path(points) {
      for(let i = 0; i < points.length; i++) {
        const point = points[i];
        if(!point.value) {
          point.value = points[i - 1].value;
        }
        point.frame = FRAME_FOR_BEAN(point.bean);
      }
      return points;
    }

    getPoint(path, frame) {
      let from = path[0];
      let to = path[0];
      for(let i = 0; i < path.length; i++) {
        const current = path[i];
        if(current.frame <= frame) {
          from = current; 
          if(path[i + 1]) {
            to = path[i + 1];
          } else {
            return to.value;
          }
        } else {
          break;
        }
      }
      const t = (frame - from.frame) / (to.frame - from.frame);
      const easing = this.easings[to.easing];
      return {
        x: easing(from.value.x, to.value.x, t),
        y: easing(from.value.y, to.value.y, t),
        z: easing(from.value.z, to.value.z, t),
        w: easing(from.value.w, to.value.w, t),
      };
    }
  }

  global.hexafont = hexafont;
})(this);
