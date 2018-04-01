(function (global) {
  class SceneSwitcherNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          _00_silence: new NIN.TextureInput(),
          _01_pre_intro_with_car_rev_sounds: new NIN.TextureInput(),
          _02_intro_1: new NIN.TextureInput(),
          _03_intro_2: new NIN.TextureInput(),
          _04_car_rev_interstitial: new NIN.TextureInput(),
          _05_first_A_theme_1: new NIN.TextureInput(),
          _05_first_A_theme_1_2: new NIN.TextureInput(),
          _06_first_A_theme_2: new NIN.TextureInput(),
          _06_first_A_theme_2_2: new NIN.TextureInput(),
          _07_first_B_theme_1: new NIN.TextureInput(),
          _08_first_B_theme_2: new NIN.TextureInput(),
          _09_second_A_theme_1: new NIN.TextureInput(),
          _10_second_A_theme_2: new NIN.TextureInput(),
          _11_illuminati_confirmed: new NIN.TextureInput(),
          _12_first_C_theme_1: new NIN.TextureInput(),
          _13_first_C_theme_2: new NIN.TextureInput(),
          _14_second_C_theme_1: new NIN.TextureInput(),
          _15_second_C_theme_2: new NIN.TextureInput(),
          _16_low_down_B_theme_1: new NIN.TextureInput(),
          _17_low_down_B_theme_piano_snippet: new NIN.TextureInput(),
          _18_low_down_B_theme_2: new NIN.TextureInput(),
          _19_groovy_B_theme: new NIN.TextureInput(),
          _20_A_theme_breakdown_1: new NIN.TextureInput(),
          _20_A_theme_breakdown_2: new NIN.TextureInput(),
          _21_third_B_theme_1: new NIN.TextureInput(),
          _22_third_B_theme_2: new NIN.TextureInput(),
          _22_third_B_theme_3: new NIN.TextureInput(),
          _22_third_B_theme_4: new NIN.TextureInput(),
          _22_third_B_theme_5: new NIN.TextureInput(),
          _23_final_A_theme_rolldown: new NIN.TextureInput(),
          _24_outro: new NIN.TextureInput(),
          _25_outro_2: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });
    }

    beforeUpdate() {
      if (demo && demo.music) {
        demo.music.setPlaybackRate(1.25);
      }
      this.inputs._00_silence.enabled = false;
      this.inputs._01_pre_intro_with_car_rev_sounds.enabled = false;
      this.inputs._02_intro_1.enabled = false;
      this.inputs._03_intro_2.enabled = false;
      this.inputs._04_car_rev_interstitial.enabled = false;
      this.inputs._05_first_A_theme_1.enabled = false;
      this.inputs._05_first_A_theme_1_2.enabled = false;
      this.inputs._06_first_A_theme_2.enabled = false;
      this.inputs._06_first_A_theme_2_2.enabled = false;
      this.inputs._07_first_B_theme_1.enabled = false;
      this.inputs._08_first_B_theme_2.enabled = false;
      this.inputs._09_second_A_theme_1.enabled = false;
      this.inputs._10_second_A_theme_2.enabled = false;
      this.inputs._11_illuminati_confirmed.enabled = false;
      this.inputs._12_first_C_theme_1.enabled = false;
      this.inputs._13_first_C_theme_2.enabled = false;
      this.inputs._14_second_C_theme_1.enabled = false;
      this.inputs._15_second_C_theme_2.enabled = false;
      this.inputs._16_low_down_B_theme_1.enabled = false;
      this.inputs._17_low_down_B_theme_piano_snippet.enabled = false;
      this.inputs._18_low_down_B_theme_2.enabled = false;
      this.inputs._19_groovy_B_theme.enabled = false;
      this.inputs._20_A_theme_breakdown_1.enabled = false;
      this.inputs._20_A_theme_breakdown_2.enabled = false;
      this.inputs._21_third_B_theme_1.enabled = false;
      this.inputs._22_third_B_theme_2.enabled = false;
      this.inputs._22_third_B_theme_3.enabled = false;
      this.inputs._22_third_B_theme_4.enabled = false;
      this.inputs._22_third_B_theme_5.enabled = false;
      this.inputs._23_final_A_theme_rolldown.enabled = false;
      this.inputs._24_outro.enabled = false;
      this.inputs._25_outro_2.enabled = false;

      let selectedScene;
      if (BEAN < 48 * 1) {
        selectedScene = this.inputs._00_silence;
        demo.nm.nodes.yolooverlayer.text = 'NO INVITATION...';
      } else if (BEAN < 48 * 5) {
        selectedScene = this.inputs._01_pre_intro_with_car_rev_sounds;
        demo.nm.nodes.yolooverlayer.text = 'HOW IT\'S MADE!';
      } else if (BEAN < 48 * 9) {
        selectedScene = this.inputs._02_intro_1;
        demo.nm.nodes.yolooverlayer.text = 'RAYMARCHED';
      } else if (BEAN < 48 * 13) {
        selectedScene = this.inputs._03_intro_2;
        demo.nm.nodes.yolooverlayer.text = 'CANVAS PATHS';
      } else if (BEAN < 48 * 14) {
        selectedScene = this.inputs._04_car_rev_interstitial;
        demo.nm.nodes.yolooverlayer.text = 'BLENDED CANVASES';
      } else if (BEAN < 48 * 16) {
        selectedScene = this.inputs._05_first_A_theme_1;
        demo.nm.nodes.yolooverlayer.text = 'SLICED PNG IMAGE';
      } else if (BEAN < 48 * 18) {
        selectedScene = this.inputs._05_first_A_theme_1_2;
        demo.nm.nodes.yolooverlayer.text = '3D + STACKED SHADER';
      } else if (BEAN < 48 * 21.5) {
        selectedScene = this.inputs._06_first_A_theme_2;
        demo.nm.nodes.yolooverlayer.text = '3D SCENE, CANVAS BG';
      } else if (BEAN < 48 * 22) {
        selectedScene = this.inputs._06_first_A_theme_2_2;
        demo.nm.nodes.yolooverlayer.text = 'SHADER TRANSISH';
      } else if (BEAN < 48 * 26) {
        selectedScene = this.inputs._07_first_B_theme_1;
        demo.nm.nodes.yolooverlayer.text = 'SOFTWARE RENDERER';
      } else if (BEAN < 48 * 30 + 1) {
        // We add one bean here to handle the transition to the next scene
        // properly as it ends slightly into the next one.
        selectedScene = this.inputs._08_first_B_theme_2;
        demo.nm.nodes.yolooverlayer.text = 'SOFTWARE RENDERER';
      } else if (BEAN < 48 * 34) {
        selectedScene = this.inputs._09_second_A_theme_1;
        demo.nm.nodes.yolooverlayer.text = 'SHADER BG + CANVAS';
      } else if (BEAN < 48 * 36) {
        selectedScene = this.inputs._10_second_A_theme_2;
        demo.nm.nodes.yolooverlayer.text = '3D + COPIOUS SHAKE';
      } else if (BEAN < 48 * 38) {
        selectedScene = this.inputs._11_illuminati_confirmed;
        demo.nm.nodes.yolooverlayer.text = 'HAND-DRAWN TRANSISH';
      } else if (BEAN < 48 * 42) {
        selectedScene = this.inputs._12_first_C_theme_1;
        demo.nm.nodes.yolooverlayer.text = 'CANVAS BG + RAYMARCH';
      } else if (BEAN < 48 * 46) {
        selectedScene = this.inputs._13_first_C_theme_2;
        demo.nm.nodes.yolooverlayer.text = 'WITHOUT BLOOOOOM :D';
      } else if (BEAN < 48 * 50) {
        selectedScene = this.inputs._14_second_C_theme_1;
        demo.nm.nodes.yolooverlayer.text = '3D SCENE + OVERLAYS';
      } else if (BEAN < 48 * 54) {
        selectedScene = this.inputs._15_second_C_theme_2;
        demo.nm.nodes.yolooverlayer.text = '3D SCENE + OVERLAYS';
      } else if (BEAN < 48 * 57) {
        selectedScene = this.inputs._16_low_down_B_theme_1;
        demo.nm.nodes.yolooverlayer.text = '3D SCENE + OVERLAYS';
      } else if (BEAN < 48 * 58) {
        selectedScene = this.inputs._17_low_down_B_theme_piano_snippet;
        demo.nm.nodes.yolooverlayer.text = 'HARD-CODED SYNCS';
      } else if (BEAN < 48 * 62) {
        selectedScene = this.inputs._18_low_down_B_theme_2;
        demo.nm.nodes.yolooverlayer.text = 'STRICT COLOR SCHEME';
      } else if (BEAN < 48 * 70) {
        selectedScene = this.inputs._19_groovy_B_theme;
        demo.nm.nodes.yolooverlayer.text = 'AMIGAAAAA';
      } else if (BEAN < 48 * 72.5) {
        selectedScene = this.inputs._20_A_theme_breakdown_1;
        demo.nm.nodes.yolooverlayer.text = 'STACKED CANVASES';
      } else if (BEAN < 48 * 76.5) {
        selectedScene = this.inputs._20_A_theme_breakdown_2;
      } else if (BEAN < 48 * 78.5) {
        selectedScene = this.inputs._21_third_B_theme_1;
        demo.nm.nodes.yolooverlayer.text = 'FLOATING CANVASES';
      } else if (BEAN < 48 * 80) {
        selectedScene = this.inputs._22_third_B_theme_2;
        demo.nm.nodes.yolooverlayer.text = 'TOILET TUNNEL';
      } else if (BEAN < 48 * 80.5) {
        selectedScene = this.inputs._22_third_B_theme_3;
        demo.nm.nodes.yolooverlayer.text = 'OVERLAY PLACEMENTS';
      } else if (BEAN < 48 * 81.5) {
        selectedScene = this.inputs._22_third_B_theme_4;
        demo.nm.nodes.yolooverlayer.text = '3D + CANVAS';
      } else if (BEAN < 48 * 84.5 - 6) {
        selectedScene = this.inputs._22_third_B_theme_5;
        demo.nm.nodes.yolooverlayer.text = 'MORE CAMERA SHAKES';
      } else if (BEAN < 48 * 88.5 - 1) {
        selectedScene = this.inputs._23_final_A_theme_rolldown;
        demo.nm.nodes.yolooverlayer.text = '3D + SHADER BG';
      } else if (BEAN < 48 * 90.5 - 6) {
        selectedScene = this.inputs._24_outro;
        demo.nm.nodes.yolooverlayer.text = 'BAKED LIGHTING';
      } else {
        selectedScene = this.inputs._25_outro_2;
          demo.nm.nodes.yolooverlayer.text = 'THANK YOU <3';
        }
      selectedScene.enabled = true;
      this.outputs.render.setValue(selectedScene.getValue());
    }
  }

  global.SceneSwitcherNode = SceneSwitcherNode;
})(this);
