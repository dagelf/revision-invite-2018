(function(global) {
  class metatron extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });



      var zoom = 5.8;
      this.camera = new THREE.OrthographicCamera( -zoom * 16, zoom * 16 , zoom * 9, -zoom * 9, 1, 100000 );
      this.camera.position.z = 100;


      this.cube = new THREE.Mesh(new THREE.BoxGeometry(196, 109, 0.1),
                                 new THREE.MeshBasicMaterial({ color: 0x070809 }));
      this.cube.position.set(0,0,-10);
      this.scene.add(this.cube);

      var radius   = 30,
      segments = 64,
      material = new THREE.LineDashedMaterial( { color: 0x222222 } ),
      geometry = new THREE.CircleGeometry( radius, segments );

      // Remove center vertex
      geometry.vertices.shift();
      geometry.computeLineDistances();

      //this.scene.add( new THREE.Line( geometry, material ) );

      var radius2  = 36,
      segments2 = 6,
      material2 = new THREE.LineBasicMaterial( { color: 0x222222 } ),
      geometry2 = new THREE.CircleGeometry( radius2, segments2 );

      geometry2.vertices.shift();
      geometry2.computeLineDistances();

      //this.scene.add( new THREE.Line( geometry2, material2 ) );

      var radius3  = 10,
      segments3 = 6,
      material3 = new THREE.LineBasicMaterial( { color: 0x222222 } ),
      geometry3 = new THREE.CircleGeometry( radius3, segments3 );

      geometry3.vertices.shift();
      geometry3.computeLineDistances();

      var hex1 = new THREE.Line( geometry3, material3 );
      var hex2 = new THREE.Line( geometry3, material3 );
      var hex3 = new THREE.Line( geometry3, material3 );
      var hex4 = new THREE.Line( geometry3, material3 );

      hex1.position.set(10,0,0);
      hex2.position.set(-10,0,0);
      hex3.position.set(0,12,0);
      hex4.position.set(0,-12,0);

      /*this.scene.add( hex1 );
      this.scene.add( hex2 );
      this.scene.add( hex3 );
      this.scene.add( hex4 );*/

 
      var line_material = new THREE.LineBasicMaterial( { color: 0x999999 } );
      var small_radius  = 10;
      var hex_segments = 6;
      var small_geometry = new THREE.CircleGeometry( small_radius, hex_segments );

      small_geometry.vertices.shift();
      small_geometry.computeLineDistances();

      this.center_rotation_container = new THREE.Object3D();

      this.small_center_hex = new THREE.Line( small_geometry, line_material );
      this.center_rotation_container.add(this.small_center_hex);
      this.small_center_hex.rotation.set(0, 0, Math.PI / 6);

      this.level1_hex1 = new THREE.Line( small_geometry, line_material );
      this.level1_hex2 = new THREE.Line( small_geometry, line_material );
      this.level1_hex3 = new THREE.Line( small_geometry, line_material );
      this.center_rotation_container.add(this.level1_hex1);
      this.center_rotation_container.add(this.level1_hex2);
      this.center_rotation_container.add(this.level1_hex3);

      this.level1_hex1.rotation.set(0, 0, Math.PI/6);
      this.level1_hex2.rotation.set(0, 0, -Math.PI/6);
      this.level1_hex3.rotation.set(0, 0, Math.PI/6);

      this.scene.add(this.center_rotation_container);

      var line_geometry = new THREE.Geometry();
      line_geometry.vertices.push(new THREE.Vector3(0, -15, 0));
      line_geometry.vertices.push(new THREE.Vector3(0, 15, 0));

      this.center_line1 = new THREE.Line( line_geometry, line_material );
      this.center_line2 = new THREE.Line( line_geometry, line_material );
      this.center_line3 = new THREE.Line( line_geometry, line_material );

      this.scene.add(this.center_line1);
      this.scene.add(this.center_line2);
      this.scene.add(this.center_line3);
      
      var circle_geometry = new THREE.CircleGeometry( 10, 128 );
      circle_geometry.vertices.shift();
      circle_geometry.computeLineDistances();
      this.center_circle = new THREE.Line( circle_geometry, line_material );
      this.scene.add(this.center_circle);

      this.middle_center_hex = new THREE.Line( small_geometry, line_material );
      this.outer_center_hex = new THREE.Line( small_geometry, line_material );
      this.middle_center_hex.rotation.set(0, 0, Math.PI / 6);
      this.outer_center_hex.rotation.set(0, 0, Math.PI / 6);
      this.scene.add(this.middle_center_hex);
      this.scene.add(this.outer_center_hex);
      
      // Square root of three divided by two. For a hex of diameter 1 this is the distance from the center to the edge.
      var r32 = 0.86602540378;

      var inner_distance = 5;
      var outer_distance = 15;
      var line_geometry = new THREE.Geometry();
          line_geometry.vertices.push(new THREE.Vector3(0, outer_distance, 0));
          line_geometry.vertices.push(new THREE.Vector3(-inner_distance * r32, inner_distance / 2, 0));
          line_geometry.vertices.push(new THREE.Vector3(-outer_distance * r32, -outer_distance / 2, 0));
          line_geometry.vertices.push(new THREE.Vector3(0, -inner_distance, 0));
          line_geometry.vertices.push(new THREE.Vector3(outer_distance * r32, -outer_distance / 2, 0));
          line_geometry.vertices.push(new THREE.Vector3(inner_distance * r32, inner_distance / 2, 0));
          line_geometry.vertices.push(new THREE.Vector3(0, outer_distance, 0));

      this.three_point_star = new THREE.Line( line_geometry, line_material );
      this.scene.add(this.three_point_star);

      var darker_line_material = new THREE.LineBasicMaterial( { color: 0x444444 } );
      var darker_line_material2 = new THREE.LineBasicMaterial( { color: 0x444444 } );
      var darker_line_material3 = new THREE.LineBasicMaterial( { color: 0x444444 } );
      var darker_line_material4 = new THREE.LineBasicMaterial( { color: 0x444444 } );

      var horizontal_distance1 = 15;
      var horizontal_distance2 = 10;
      var horizontal_distance3 = 15;

      var small_claw_geometry = new THREE.Geometry();
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance1 * r32 + horizontal_distance3, horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance2 * r32, horizontal_distance1 + horizontal_distance2 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(-horizontal_distance1 * r32, horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(-horizontal_distance1 * r32, -horizontal_distance1 / 2, 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance2 * r32, -(horizontal_distance1 + horizontal_distance2 / 2), 0));
      small_claw_geometry.vertices.push(new THREE.Vector3(horizontal_distance1 * r32 + horizontal_distance3, -horizontal_distance1 / 2, 0));

      this.small_claw_r = new THREE.Line( small_claw_geometry, darker_line_material );
      this.small_claw_l = new THREE.Line( small_claw_geometry, darker_line_material2 );
      this.small_claw_r.position.set(30 * r32, 0, -1);
      this.small_claw_l.position.set(-30 * r32, 0, -1);
      this.small_claw_l.scale.set(-1, 1, 1);
      this.scene.add(this.small_claw_r);
      this.scene.add(this.small_claw_l);

      var claw_inner_distance = 5;
      var claw_outer_distance = 50;

      var large_claw_geometry = new THREE.Geometry();
      large_claw_geometry.vertices.push(new THREE.Vector3(claw_outer_distance * r32, claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(0, claw_outer_distance, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(-claw_outer_distance * r32, claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(-claw_outer_distance * r32, -claw_outer_distance / 2, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(0, -claw_outer_distance, 0));
      large_claw_geometry.vertices.push(new THREE.Vector3(claw_outer_distance * r32, -claw_outer_distance / 2, 0));
      

      this.large_claw_r = new THREE.Line( large_claw_geometry, darker_line_material3 );
      this.large_claw_l = new THREE.Line( large_claw_geometry, darker_line_material4 );
      this.large_claw_r.position.set(claw_outer_distance * r32, 0, -1);
      this.large_claw_l.position.set(-claw_outer_distance * r32, 0, -1);
      this.large_claw_l.scale.set(-1, 1, 1);
      this.scene.add(this.large_claw_r);
      this.scene.add(this.large_claw_l);

      console.log(this.large_claw_l);
    }

    update(frame) {
      super.update(frame);

      var asmoothstep = function (start_frame, duration, frame) {
        return smoothstep(0, 1, (frame - start_frame) / duration);
      }

      // Square root of three divided by two. For a hex of diameter 1 this is the distance from the center to the edge.
      var r32 = 0.86602540378;

      this.level1_hex1.position.set(200, 0, 0);
      this.level1_hex2.position.set(200, 0, 0);
      this.level1_hex3.position.set(200, 0, 0);
      this.level1_hex1.scale.set(1, 1, 1);
      this.level1_hex2.scale.set(1, 1, 1);
      this.level1_hex3.scale.set(1, 1, 1);
      this.center_rotation_container.rotation.set(0, 0, Math.PI/3);
      this.center_line1.scale.set(0, 0, 0);
      this.center_line2.scale.set(0, 0, 0);
      this.center_line3.scale.set(0, 0, 0);
      this.center_circle.scale.set(0, 0, 0);
      this.middle_center_hex.position.set(200, 0, 0);
      this.outer_center_hex.position.set(200, 0, 0);
      this.level1_hex1.scale.set(1, 1, 1);
      this.level1_hex2.scale.set(1, 1, 1);
      this.level1_hex3.scale.set(1, 1, 1);
      this.three_point_star.geometry.vertices[1].x = 0;
      this.three_point_star.geometry.vertices[1].y = 0;
      this.three_point_star.geometry.vertices[3].y = 0;
      this.three_point_star.geometry.vertices[5].x = 0;
      this.three_point_star.geometry.vertices[5].y = 0;
      this.three_point_star.rotation.set(0, 0, 0);
      this.three_point_star.position.set(200, 0, 0);

      if ( frame > FRAME_FOR_BEAN(22 * 48)) {
        var scale = asmoothstep(FRAME_FOR_BEAN(22 * 48), FRAME_FOR_BEAN(48), frame)
        this.small_center_hex.scale.set(scale, scale, scale);
      } 
      if (frame > FRAME_FOR_BEAN(23 * 48)) {
        var progress = asmoothstep(FRAME_FOR_BEAN(23 * 48), FRAME_FOR_BEAN(48), frame);
        this.level1_hex1.position.set(10 * r32 * progress, 10 / 2 * progress, 0);
        this.level1_hex2.position.set(-10 * r32 * progress, 10 / 2 * progress, 0);
        this.level1_hex3.position.set(0, -10 * progress, 0);

        var progress2 = asmoothstep(FRAME_FOR_BEAN(23 * 48), FRAME_FOR_BEAN(24), frame);
        this.center_line1.scale.set(progress2, progress2, progress2);
        this.center_line2.scale.set(progress2, progress2, progress2);
        this.center_line3.scale.set(progress2, progress2, progress2);

        var progress3 = asmoothstep(FRAME_FOR_BEAN(23.5 * 48), FRAME_FOR_BEAN(24), frame);
        this.center_line2.rotation.set(0, 0, progress3 * 2 * Math.PI / 3);
        this.center_line3.rotation.set(0, 0, -progress3 * 2 * Math.PI / 3);

        this.center_circle.scale.set(progress3 * 1.5, progress3 * 1.5, progress3 * 1.5);
      }
      if (frame > FRAME_FOR_BEAN(24 * 48)) {
        this.center_rotation_container.rotation.set(0, 0, Math.PI / 3 - 3 * Math.PI / 3 *asmoothstep(FRAME_FOR_BEAN(24*48), FRAME_FOR_BEAN(12), frame));


        var scale = 1 + 0.5 * asmoothstep(FRAME_FOR_BEAN(24.25 * 48), FRAME_FOR_BEAN(12), frame);
        this.small_center_hex.scale.set(scale, scale, scale);


        var scale2 = 1.5 + 1.95 * asmoothstep(FRAME_FOR_BEAN(24.5 * 48), FRAME_FOR_BEAN(12), frame);
        this.center_circle.scale.set(scale2, scale2, scale2);
      }
      if (frame > FRAME_FOR_BEAN(24.5 * 48)) {
        this.middle_center_hex.position.set(0, 0, 0);
        this.outer_center_hex.position.set(0, 0, 0);

        var scale = 2 + 0.5 * asmoothstep(FRAME_FOR_BEAN(24.5 * 48), FRAME_FOR_BEAN(12), frame);
        var scale2 = 2 + 2 * asmoothstep(FRAME_FOR_BEAN(24.5 * 48), FRAME_FOR_BEAN(12), frame);

        this.middle_center_hex.scale.set(scale, scale, scale);
        this.outer_center_hex.scale.set(scale2, scale2, scale2);

        scale *= 1.065;
        this.center_line1.scale.set(scale, scale, scale);
        this.center_line2.scale.set(scale, scale, scale);
        this.center_line3.scale.set(scale, scale, scale);
      }
      if (frame > FRAME_FOR_BEAN(24.5 * 48)) {
        // Distance from main center to center of the level 1 hexes.
        var distance3 = 10 + 5 * asmoothstep(FRAME_FOR_BEAN(24.75 * 48), FRAME_FOR_BEAN(12), frame); 
        var distance2 = 10 + 5 * asmoothstep(FRAME_FOR_BEAN(24.875 * 48), FRAME_FOR_BEAN(12), frame); 
        var distance1 = 10 + 5 * asmoothstep(FRAME_FOR_BEAN(25 * 48), FRAME_FOR_BEAN(12), frame); 
        this.level1_hex1.position.set(distance1 * r32, distance1 / 2, 0);
        this.level1_hex2.position.set(-distance2 * r32, distance2 / 2, 0);
        this.level1_hex3.position.set(0, -distance3, 0);

        this.three_point_star.position.set(0, 0, 0);

        this.three_point_star.geometry.vertices[1].x = -(distance3 - 10) * r32;
        this.three_point_star.geometry.vertices[1].y = (distance3 - 10) / 2;
        this.three_point_star.geometry.vertices[3].y = -(distance2 - 10);
        this.three_point_star.geometry.vertices[5].x = (distance1 - 10) * r32;
        this.three_point_star.geometry.vertices[5].y = (distance1 - 10) / 2;

        this.three_point_star.rotation.set(0, 0, - 3 * Math.PI / 3 * asmoothstep(FRAME_FOR_BEAN(25.25 * 48), FRAME_FOR_BEAN(12), frame));

        // Scale of the level 1 hexes.
        var scale3 = 1 + 0.5 * asmoothstep(FRAME_FOR_BEAN(25.375 * 48), FRAME_FOR_BEAN(12), frame);
        var scale2 = 1 + 0.5 * asmoothstep(FRAME_FOR_BEAN(25.5 * 48), FRAME_FOR_BEAN(12), frame);
        var scale1 = 1 + 0.5 * asmoothstep(FRAME_FOR_BEAN(25.625 * 48), FRAME_FOR_BEAN(12), frame); 
        this.level1_hex1.scale.set(scale1, scale1, scale1);
        this.level1_hex2.scale.set(scale2, scale2, scale2);
        this.level1_hex3.scale.set(scale3, scale3, scale3);
      }
      if (frame > FRAME_FOR_BEAN(25.75)) {
        var scale = 1 + 0.67 * asmoothstep(FRAME_FOR_BEAN(25.75 * 48), FRAME_FOR_BEAN(36), frame);        
        this.three_point_star.scale.set(scale, scale, scale);

        var claw_progress1 = asmoothstep(FRAME_FOR_BEAN(25.75 * 48), FRAME_FOR_BEAN(12), frame);
        var claw_progress2 = asmoothstep(FRAME_FOR_BEAN(25.875 * 48), FRAME_FOR_BEAN(12), frame);
        var claw_progress3 = asmoothstep(FRAME_FOR_BEAN(26 * 48), FRAME_FOR_BEAN(12), frame);
        var claw_progress4 = asmoothstep(FRAME_FOR_BEAN(26.125 * 48), FRAME_FOR_BEAN(12), frame);

        this.small_claw_r.material.color.r = this.cube.material.color.r + 0.15 * claw_progress1;
        this.small_claw_r.material.color.g = this.cube.material.color.r + 0.15 * claw_progress1;
        this.small_claw_r.material.color.b = this.cube.material.color.r + 0.15 * claw_progress1;

        this.small_claw_l.material.color.r = this.cube.material.color.r + 0.15 * claw_progress2;
        this.small_claw_l.material.color.g = this.cube.material.color.r + 0.15 * claw_progress2;
        this.small_claw_l.material.color.b = this.cube.material.color.r + 0.15 * claw_progress2;

        this.large_claw_r.material.color.r = this.cube.material.color.r + 0.15 * claw_progress3;
        this.large_claw_r.material.color.g = this.cube.material.color.r + 0.15 * claw_progress3;
        this.large_claw_r.material.color.b = this.cube.material.color.r + 0.15 * claw_progress3;

        this.large_claw_l.material.color.r = this.cube.material.color.r + 0.15 * claw_progress4;
        this.large_claw_l.material.color.g = this.cube.material.color.r + 0.15 * claw_progress4;
        this.large_claw_l.material.color.b = this.cube.material.color.r + 0.15 * claw_progress4;
        
        this.small_claw_r.position.set(30 * r32 - 8 * (1 - claw_progress1), 0, -1);
        this.small_claw_l.position.set(-30 * r32 + 8 * (1 - claw_progress2), 0, -1);
        this.large_claw_r.position.set(50 * r32 - 8 * (1 - claw_progress3), 0, -1);
        this.large_claw_l.position.set(-50 * r32 + 8 * (1 - claw_progress4), 0, -1);
      }


      this.three_point_star.geometry.verticesNeedUpdate = true;
    }
  }

  global.metatron = metatron;
})(this);
