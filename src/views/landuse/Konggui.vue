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
        <div style="font: bold 18px '微软雅黑'; marginBottom: 15px">控规</div>
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
      propsData: [],
      legendItems: [
        {
          index: 1,
          text: "商务用地",
          style: "backgroundColor:#FF0000",
        },
        {
          index: 2,
          text: "行政办公用地",
          style: "backgroundColor:#FF00FF",
        },
        {
          index: 3,
          text: "商业金融业用地",
          style: "backgroundColor:#FF0000",
        },
        { index: 4, text: "文化娱乐用地", style: "backgroundColor:#FF7F9F" },
        { index: 5, text: "体育用地", style: "backgroundColor:#9FFF7F" },
        { index: 6, text: "医疗卫生用地", style: "backgroundColor:#9FFF7F" },
        {
          index: 7,
          text: "教育科研设计用地",
          style: "backgroundColor:#FF7FDF",
        },
        { index: 8, text: "文物古迹用地", style: "backgroundColor:#A50052" },
        { index: 9, text: "军事用地", style: "backgroundColor:#BABABA" },
        { index: 10, text: "公共绿地", style: "backgroundColor:#3FFF00" },
        { index: 11, text: "军事用地", style: "backgroundColor:#A87000" },
        {
          index: 12,
          text: "一类工业用地",
          style: "backgroundColor:#A56752",
        },
        { index: 13, text: "一类居住用地", style: "backgroundColor:#FFFF7F" },
        { index: 14, text: "二类居住用地", style: "backgroundColor:#FFFF00" },
        { index: 15, text: "中小学用地", style: "backgroundColor:#FFFF00" },
        {
          index: 16,
          text: "广场用地",
          style: "backgroundColor:#E1E1E1",
        },
        {
          index: 17,
          text: "社会停车场库用地",
          style: "backgroundColor:#E1E1E1",
        },
        { index: 18, text: "交通场站用地", style: "backgroundColor:#E1E1E1" },
        { index: 19, text: "供应设施用地", style: "backgroundColor:#0052A5" },
        { index: 20, text: "供电用地", style: "backgroundColor:#0052A5" },
        { index: 21, text: "交通设施用地", style: "backgroundColor:#5252A5" },
        { index: 22, text: "公共交通用地", style: "backgroundColor:#5252A5" },
        {
          index: 23,
          text: "雨水、污水处理用地",
          style: "backgroundColor:#26264C",
        },
      ],
    };
  },
  components: {
    Popup,
    Legend,
  },
  mounted() {
    init_map(window.MAP, [113.297084, 23.140441], 14);
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
          ["get", "land_code"],
          "B2",
          "#FF0000",
          "C1",
          "#FF00FF",
          "C2",
          "#FF0000",
          "C3",
          "#FF7F9F",
          "C4",
          "#9FFF7F",
          "C5",
          "#9FFF7F",
          "C6",
          "#FF7FDF",
          "C7",
          "#A50052",
          "D1",
          "#BABABA",
          "G1",
          "#3FFF00",
          "H41",
          "#A87000",
          "M1",
          "#A56752",
          "R1",
          "#FFFF7F",
          "R2",
          "#FFFF00",
          "R22",
          "#FFFF00",
          "S2",
          "#E1E1E1",
          "S3",
          "#E1E1E1",
          "S4",
          "#E1E1E1",
          "U1",
          "#0052A5",
          "U12",
          "#0052A5",
          "U2",
          "#5252A5",
          "U21",
          "#5252A5",
          "U41",
          "#26264C",
          "#26264C",
        ],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0.9,
        ],
      };
      add_tms(window.MAP, "hhg-konggui", "fill", industry);

      window.MAP.addLayer({
        id: "hhg-konggui-hl",
        type: "line",
        source: "hhg-konggui",
        "source-layer": "hhg-konggui",
        paint: {
          "line-color": "#18ffff",
          "line-width": 3,
        },
        filter: ["in", "objectid", ""],
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
      if (features[0].layer.id == "hhg-konggui") {
        var props = features[0].properties;
        console.log(props);
        window.MAP.setFilter("hhg-konggui-hl",[
          "in",
          "objectid",
          features[0].properties.objectid
        ])
        _this.propsData = [
          {
            prop: "用地性质",
            value: props["land_name"],
          },
          {
            prop: "面积",
            value: props["land_area"],
          },
          {
            prop: "建筑面积",
            value: props["build_area"],
          },
          {
            prop: "建筑退距",
            value: props["build_den"],
          },
          {
            prop: "建筑限高",
            value: props["build_hght"],
          },
          {
            prop: "容纳人口",
            value: props["people_cap"],
          },
          {
            prop: "规划依据",
            value: props["according"],
          },
          {
            prop: "规划建议",
            value: props["advise"],
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
    removeLayers(window.MAP, ["hhg-konggui-hl","hhg-konggui"]);
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






















































