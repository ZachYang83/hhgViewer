<template>
  <div>
    <leftPan :subItems="subItems" @changeWMS="changeWMS"></leftPan>
    <Popup
      id="infoBox"
      v-model="visible"
      title="属性"
      class="info-box"
      @onCancel="onCancel"
    >
      <el-table
        :data="propsData"
        border
        style="width: 100%"
        height="400"
      >
        <el-table-column align="center" prop="prop" label="属性" width="100">
        </el-table-column>
        <el-table-column align="center" prop="value" label="值" width="195">
        </el-table-column>
      </el-table>
    </Popup>
  </div>
</template>

<script>
import leftPan from "@/components/common/leftPan.vue";
import { init_map } from "utils/initMap.js";
import { add_tms, add_wms,addgeojson_S, addgeojson_L } from "utils/loadLayer.js";
import { removeLayers } from "utils/removeLayers.js";
import {getCiv,getMed,getEdu,getPal} from "@/api/gzg/pubInfo.js"
import Popup from "@/components/Popup.vue";
export default {
  data() {
    return {
      visible: false,
      propsData: [],
      subItems: [
        {
          id: 1,
          title: "教育设施",
          src: require("assets/publicInfo/eduInfo.png"),
        },
        {
          id: 2,
          title: "医疗设施",
          src: require("assets/publicInfo/medInfo.png"),
        },
        {
          id: 3,
          title: "民政设施",
          src: require("assets/publicInfo/civInfo.png"),
        },
        {
          id: 4,
          title: "政法设施",
          src: require("assets/publicInfo/palInfo.png"),
        },
      ],
    };
  },
  components: {
    leftPan,
    Popup,
  },
  mounted() {
    init_map(window.MAP, [113.450758, 23.097408], 14);
    this.initLayers();
    this.mouseEvent();
  },
  methods: {
    initLayers() {
      removeLayers(window.MAP, ["gzg-hongxian"]);
      add_wms(window.MAP, "gzg-hongxian")
    },
    changeWMS(item) {
      console.log(item.title);
      var circle = {
        "circle-color": "#ffa726",
        "circle-radius": 6,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      };
      switch (item.title) {
        case "教育设施":
          removeLayers(window.MAP, [
            "gzg-jcss-pal",
            "gzg-jcss-med",
            "gzg-jcss-civ",
          ]);
          circle["circle-color"] = "#84ffff";
          add_tms(window.MAP, "gzg-jcss-edu", "circle", circle);
          break;
        case "医疗设施":
          removeLayers(window.MAP, [
            "gzg-jcss-pal",
            "gzg-jcss-edu",
            "gzg-jcss-civ",
          ]);
          circle["circle-color"] = "#ffee58";
          add_tms(window.MAP, "gzg-jcss-med", "circle", circle);
          break;
        case "民政设施":
          removeLayers(window.MAP, [
            "gzg-jcss-pal",
            "gzg-jcss-med",
            "gzg-jcss-pal",
          ]);
          circle["circle-color"] = "#9ccc65";
          add_tms(window.MAP, "gzg-jcss-civ", "circle", circle);
          break;
        case "政法设施":
          removeLayers(window.MAP, [
            "gzg-jcss-pal",
            "gzg-jcss-med",
            "gzg-jcss-civ",
          ]);
          circle["circle-color"] = "#ba68c8";
          add_tms(window.MAP, "gzg-jcss-pal", "circle", circle);
          break;
      }
    },
    mouseEvent(){
      let _this = this;
      window.MAP.on("mousemove",_this.cursorMove)
      window.MAP.on("click", _this.getInfo)
    },
    cursorMove(e){
      window.MAP.getCanvas().style.cursor = "pointer";
    },
    getInfo(e) {
      let _this = this;
      console.log(event,'ddsfsdf');
        var features = window.MAP.queryRenderedFeatures(e.point);
        if(features[0].layer.id.substring(0,8) == 'gzg-jcss'){
          var props = features[0].properties;
          console.log(props,'props');
          switch(features[0].layer.id.substring(9,12)){
            case 'civ':
              _this.propsData = getCiv(props);
              break;
            case 'edu':
            _this.propsData = getEdu(props);
            break;
              case 'med':
            _this.propsData =getMed(props);
            break;
              case 'pal':
            _this.propsData = getPal(props);
            break;
          }
        }
        _this.visible = true;
        var infoBox = document.getElementById("infoBox");
         infoBox.style.top = e.originalEvent.clientY - 120 + "px";
         infoBox.style.left = e.originalEvent.clientX + 40 + "px";
      },
    onCancel() {
      this.visible = false;
    },
  },
  destroyed() {
    let _this = this;
    removeLayers(window.MAP, ["gzg-jcss-med","gzg-jcss-pal", "gzg-jcss-edu", "gzg-jcss-civ"]);
    window.MAP.off("click",_this.getInfo);
    window.MAP.off("mousemove",_this.cursorMove);
  },
};
</script>

<style lang="scss" scoped>
.info-box {
  position: absolute;
  width: 300px;
  height: auto;
}
</style>