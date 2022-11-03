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
    <Legend v-model="showLegend" title="图例" class="legend-box">
      <div class="legendBody">
        <div style="font: bold 18px '微软雅黑'; marginbottom: 15px">控规</div>
        <template v-for="item in legendItems">
          <li :index="item.index" :key="item.key" class="legendItem">
            <div class="color" :style="item.style"></div>
            <div class="legendText">{{ item.text }}</div>
          </li>
        </template>
      </div>
    </Legend>
  </div>
</template>

<script>
import { init_map } from "utils/initMap.js";
import {
  add_tms,
  add_wms,
  addgeojson_S,
  addgeojson_L,
} from "utils/loadLayer.js";
import { removeLayers } from "utils/removeLayers.js";
import Popup from "@/components/Popup.vue";
import Legend from "@/components/Popup.vue";
export default {
  data() {
    return {
      visible: false,
      propsData: [],
      showLegend: true,
      legendItems: [
        {
          index: 1,
          text: "行政办公设施用地",
          style: "backgroundColor:#FF00C5",
        },
        {
          index: 2,
          text: "商务兼容商业用地",
          style: "backgroundColor:#E60000",
        },
        {
          index: 3,
          text: "行政办公设施用地",
          style: "backgroundColor:#FF00FF",
        },
        { index: 4, text: "商业金融业用地", style: "backgroundColor:#FF0000" },
        { index: 5, text: "文化娱乐用地", style: "backgroundColor:#FF7F9F" },
        { index: 6, text: "医疗卫生用地", style: "backgroundColor:#FF7FBF" },
        {
          index: 7,
          text: "教育科研设施用地",
          style: "backgroundColor:#FF7FDF",
        },
        { index: 8, text: "历史文化用地", style: "backgroundColor:#A50052" },
        { index: 9, text: "特殊用地", style: "backgroundColor:#BABABA" },
        { index: 10, text: "水域", style: "backgroundColor:#00FFFF" },
        { index: 11, text: "村安置用地", style: "backgroundColor:#A57C00" },
        {
          index: 12,
          text: "村经济（商业金融业）用地",
          style: "backgroundColor:#A59D00",
        },
        { index: 13, text: "公共绿地", style: "backgroundColor:#3FFF00" },
        { index: 14, text: "防护绿地", style: "backgroundColor:#007F1F" },
        { index: 15, text: "二类居住用地", style: "backgroundColor:#FFFF00" },
        {
          index: 16,
          text: "公共服务设施用地",
          style: "backgroundColor:#FFFF00",
        },
        { index: 17, text: "停车场用地", style: "backgroundColor:#FFFFFF" },
        { index: 18, text: "铁路用地", style: "backgroundColor:#BF00FF" },
        { index: 19, text: "港口用地", style: "backgroundColor:#3F3F7F" },
        { index: 20, text: "供应设施用地", style: "backgroundColor:#0052A5" },
        { index: 21, text: "交通设施用地", style: "backgroundColor:#5252A5" },
        { index: 22, text: "邮电设施用地", style: "backgroundColor:#005F7F" },
        { index: 23, text: "环卫设施用地", style: "backgroundColor:#26264C" },
        { index: 24, text: "普通仓储用地", style: "backgroundColor:#BF00FF" },
      ],
    };
  },
  components: {
    Popup,
    Legend,
  },
  mounted() {
    init_map(window.MAP, [113.450758, 23.097408], 14);
    this.initLayers();
    this.mouseEvent();
  },
  methods: {
    initLayers() {
      removeLayers(window.MAP, ["hhg-hongxian"]);
      add_wms(window.MAP, "hhg-hongxian");

      var industry = {
        "fill-outline-color": "#ea80fc",
        "fill-color": [
          "match",
          ["get", "LAND_CODE"],
          "A1",
          "#FF00C5",
          "B2",
          "#E60000",
          "C1",
          "#FF00FF",
          "C2",
          "#FF0000",
          "C3",
          "#FF7F9F",
          "C5",
          "#FF7FBF",
          "C6",
          "#FF7FDF",
          "C7",
          "#A50052",
          "D1",
          "#BABABA",
          "E1",
          "#00FFFF",
          "E61(R2)",
          "#A57C00",
          "E62(C2)",
          "#A59D00",
          "G1",
          "#3FFF00",
          "G2",
          "#007F1F",
          "R2",
          "#FFFF00",
          "R22",
          "#FFFF00",
          "S3",
          "#FFFFFF",
          "T1",
          "#BF00FF",
          "T4",
          "#3F3F7F",
          "U1",
          "#0052A5",
          "U2",
          "#5252A5",
          "U3",
          "#005F7F",
          "U4",
          "#26264C",
          "W1",
          "#BF00FF",
          "#ea80fc",
        ],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.9,
        ],
      };
      add_tms(window.MAP, "hhg-konggui", "fill", industry);
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
      if (features[0].layer.id == "hhg-konggui") {
        var props = features[0].properties;
        console.log(props, "props");
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
    removeLayers(window.MAP, ["hhg-konggui"]);
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

.legend-box {
  position: absolute;
  width: 200px;
  height: 300px;
  bottom: 10px;
  left: 10px;
}

.legendBody {
  width: 100%;
  height: 280px;
  overflow: hidden;
  overflow-y: scroll;
  padding: 10px;
}
::-webkit-scrollbar {
  display: none;
}

.legendItem {
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  .color {
    display: flex;
    flex: 1;
    height: 20px;
    margin: 0 10px;
    border-radius: 7px;
    // background: #17c5a5;
  }

  .legendText {
    display: flex;
    flex: 4;
    height: 30px;
    color: #fff;
    align-items: center;
    justify-content: center;
    line-height: 30px;
    font-size: 15px;
  }
}
.legendItem:last-child {
  margin-bottom: 0px;
}
</style>



















































