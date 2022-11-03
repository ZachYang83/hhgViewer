<template>
  <div>
    <Popup
      id="infoBox"
      v-model="visible"
      title="属性"
      class="info-box"
      @onCancel="onCancel"
    >
      <el-table :data="propsData" border style="width: 100%" height="400">
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
  data() {
    return {
      visible: false,
      propsData: [],
    };
  },
  components: {
    Popup,
  },
  mounted() {
    init_map(window.MAP, [113.297084,23.140441], 14);
    this.initLayers();
    this.mouseEvent();
  },
  methods: {
    initLayers() {
      removeLayers(window.MAP, ["hhg-hongxian"]);
      add_wms(window.MAP, "hhg-hongxian")

      var xukezheng = {
        "fill-outline-color": "#ea80fc",
        "fill-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#ea80fc",
          "#fff",
        ],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.9,
        ],
      };
      add_tms(window.MAP, "hhg-xukezheng", "fill", xukezheng);

       window.MAP.addLayer({
        id: "hhg-xukezheng-hl",
        type: "line",
        source: "hhg-xukezheng",
        "source-layer": "hhg-xukezheng",
        paint: {
          "line-color": "#18ffff",
          "line-width": 3,
        },
        filter: ["in", "myid", ""],
      });
    },
    mouseEvent() {
      let _this = this;
      window.MAP.on("mousemove", _this.cursorMove);
      window.MAP.on("click", _this.getInfo);
    },
    cursorMove(e) {
      window.MAP.getCanvas().style.cursor = "pointer";
    },
    getInfo(e) {
      let _this = this;
      var features = window.MAP.queryRenderedFeatures(e.point);
      if (features[0].layer.id == "hhg-xukezheng") {
        var props = features[0].properties;
        console.log(features, "props");
        window.MAP.setFilter("hhg-xukezheng-hl",[
          "in",
          "myid",
          features[0].properties.myid
        ])
        _this.propsData = [
          {
            prop: "许可证号",
            value: props["许可证"],
          },
          {
            prop: "出案日期",
            value: props["出案日"],
          },
          {
            prop: "划拨部门",
            value: props["划拨部"],
          },
          {
            prop: "用地位置",
            value: props["用地位"],
          },
          {
            prop: "用地性质",
            value: props["用地性"],
          },
          {
            prop: "建设单位",
            value: props["建设单"],
          },
          {
            prop: "地块面积（㎡）",
            value: props["总面积"],
          },
          {
            prop: "总建筑面积",
            value: props["总建筑"],
          },
          {
            prop: "容积率",
            value: props["容积率"],
          },
          {
            prop: "建筑高度",
            value: props["建筑高"],
          },
          {
            prop: "建筑密度",
            value: props["建筑密"],
          },
          {
            prop: "绿地率",
            value: props["绿地率"],
          },
          {
            prop: "公服设施",
            value: props["公服设"],
          },
          {
            prop: "停车配套",
            value: props["停车配"],
          },
          {
            prop: "道路面积（㎡）",
            value: props["道路面"],
          },
          {
            prop: "河涌面积（㎡）",
            value: props["河涌面"],
          },
          {
            prop: "绿化面积（㎡）",
            value: props["绿化面"],
          },
          {
            prop: "图号",
            value: props["图号"],
          },
        ];
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
    removeLayers(window.MAP, ["hhg-xukezheng-hl","hhg-xukezheng"]);
    window.MAP.off("click", _this.getInfo);
    window.MAP.off("mousemove", _this.cursorMove);
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