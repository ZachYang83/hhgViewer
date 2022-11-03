<template>
  <div>
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
import { init_map } from "utils/initMap.js";
import { add_tms,add_wms, addgeojson_S, addgeojson_L } from "utils/loadLayer.js";
import { removeLayers } from "utils/removeLayers.js";
import Popup from "@/components/Popup.vue";
export default {
  data(){
    return{
      visible: false,
      propsData: [],
    }
  },
  components: {
    Popup,
  },
  mounted() {
    init_map(window.MAP, [113.450758, 23.097408], 14);
    this.initLayers();
    this.mouseEvent();
  },
  methods: {
    initLayers() {
      removeLayers(window.MAP, ["hhg-hongxian"]);
      add_wms(window.MAP, "hhg-hongxian")

      var industry = {
        "fill-outline-color": "#ea80fc",
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#ea80fc",
          "#ff6e40",
        ],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.9,
        ],
      };
      add_tms(window.MAP, "hhg-industry", "fill", industry);
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
        if(features[0].layer.id == 'hhg-industry'){
          var props = features[0].properties;
          console.log(props,'props');
          _this.propsData = [
        {
            prop: "地块名称",
            value: props['地块名称']
        },
        {
            prop: "地块编号",
            value: props['地块编号']
        },
        {
            prop: "地块位置",
            value: props['地块位置']
        },
        {
            prop: "所属平台",
            value: props['所属平台（']
        },
        {
            prop: "地块面积（公顷）",
            value: props['地块面积（']
        },
        {
            prop: "现状建设情况",
            value: props['现状建设情']
        },
        {
            prop: "国土空间规划",
            value: props['国土空间总']
        },
        {
            prop: "土规情况",
            value: props['土规情况']
        },
        {
            prop: "规划情况核查",
            value: props['规划情况核']
        },
        {
            prop: "产业平台",
            value: props['产业平台（']
        },
        {
            prop: "拟发展产业",
            value: props['拟发展产业']
        },
        {
            prop: "优先发展产业",
            value: props['优先发展产']
        },
        {
            prop: "大类分析",
            value: props['大类分析']
        },
        {
            prop: "中类分析",
            value: props['中类分析']
        },
        {
            prop: "总体分析",
            value: props['总体分析']
        },
    ]
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
    removeLayers(window.MAP, ["hhg-industry"]);
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