<template>
<div>
  <Legend
      v-model="showLegend"
      title="图例"
      class="legend-box"
    >
      <div class="legendBody">
        <div style="font:bold 18px '微软雅黑';marginBottom:15px">建筑高度</div>
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
import { add_tms,add_wms, addgeojson_S, addgeojson_L } from "utils/loadLayer.js";
import { removeLayers } from "utils/removeLayers.js";
import Legend from "@/components/Popup.vue";
export default {
  data(){
    return{
      showLegend: true,
      legendItems: [
        {
          index: 1,
          text: "30米以下",
          style: "backgroundColor:#3388BA",
        },
        {
          index: 2,
          text: "30 - 60米",
          style: "backgroundColor:#7EB4BC",
        },
        {
          index: 3,
          text: "60 - 90米",
          style: "backgroundColor:#C9E0BE",
        },
        {
          index: 4,
          text: "90 - 120米",
          style: "backgroundColor:#C9E0BE",
        },
         {
          index: 5,
          text: "120 - 150米",
          style: "backgroundColor:#F3B98D",
        },
         {
          index: 6,
          text: "150米以上",
          style: "backgroundColor:#E35E4D",
        },
      ],
    }
  },
  components: {
    Legend,
  },
  mounted() {
    init_map(window.MAP, [113.450758, 23.097408], 14);
    this.initLayers();
  },
  methods: {
    initLayers() {
      removeLayers(window.MAP, ["hhg-hongxian"]);
      add_wms(window.MAP, "hhg-hongxian")

      var buildingPaint = {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "height"],
          0,
          "#3388BA",
          30,
          "#7EB4BC",
          60,
          "#C9E0BE",
          90,
          "#C9E0BE",
          120,
          "#F3B98D",
          150,
          "#E35E4D",
        ],
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-opacity": 0.9,
      };
    add_tms(window.MAP, "hhg-buildings", "fill-extrusion", buildingPaint);
    },
    unshow() {
      this.showLegend = false;
    },
  },
  destroyed() {
    removeLayers(window.MAP, ["hhg-buildings"]);
  },
};
</script>

<style lang="scss" scoped>
.legend-box {
  position: absolute;
  width: 200px;
  height: auto;
  bottom: 10px;
  left: 10px;
}

.legendBody {
  width: 100%;
  height: auto;
  overflow-y: scroll;
  padding:10px;
}
::-webkit-scrollbar {
  display: none;
}

.legendItem {
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  display: flex;

  .color {
    display: flex;
    flex: 1;
    height: 30px;
    margin: 0 10px;
    border-radius: 7px;
    // background: #17c5a5;
  }

  .legendText {
    display: flex;
    flex: 2;
    height: 30px;
    color: #fff;
    align-items: center;
    justify-content: center;
    line-height: 30px;
    font-size: 15px;
  }
}
.legendItem:last-child{
  margin-bottom: 0px;
}
</style>