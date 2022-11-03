<template>
  <div>
    <Legend v-model="showLegend" title="图例" class="legend-box">
      <div class="legendBody">
        <div style="font: bold 18px '微软雅黑'; marginBottom: 15px">
          建筑高度
        </div>
        <template v-for="item in legendItems">
          <li :index="item.index" :key="item.key" class="legendItem">
            <div class="color" :style="item.style"></div>
            <div class="legendText">{{ item.text }}</div>
          </li>
        </template>
      </div>
    </Legend>
    <ViewPop
      class="view720"
      title="720全景"
      v-model="showView"
      @onCancel="onCancel"
    >
      <div class="viewbody">
        <iframe src="" style="width:100%;height:100%" id="view-iframe"> </iframe>
      </div>
    </ViewPop>
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
import Legend from "@/components/Popup.vue";
import ViewPop from "@/components/Popup.vue";
export default {
  data() {
    return {
      showLegend: true,
      showView: false,
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
    };
  },
  components: {
    Legend,
    ViewPop,
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

      window.MAP.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          window.MAP.addImage("custom-marker", image);
          window.MAP.addSource("hhg-viewpoint", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [113.295, 23.14],
                  },
                  properties: {
                    id: "point1",
                    title: "720View",
                  },
                },
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [113.291, 23.142],
                  },
                  properties: {
                    id: "point2",
                    title: "720View",
                  },
                },
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [113.298, 23.14],
                  },
                  properties: {
                    id: "point3",
                    title: "720View",
                  },
                },
              ],
            },
          });

          window.MAP.addLayer({
            id: "hhg-viewpoint",
            type: "symbol",
            source: "hhg-viewpoint",
            layout: {
              "icon-image": "custom-marker",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
            paint: {
              "text-color": "#304ffe",
            },
          });
        }
      );
    },
    mouseEvent() {
      let _this = this;
      window.MAP.on("click", _this.getInfo);
    },
    getInfo(e) {
      var features = window.MAP.queryRenderedFeatures(e.point);
      let iframe = document.getElementById("view-iframe");
      console.log(features, "features");
      if (features[0].layer.id == "hhg-viewpoint") {
        this.showView = true;
        switch (features[0].properties.id) {
          case "point1":
            iframe.src = "https://720yun.com/t/94vkc91y72h?scene_id=61709592";
            break;
          case "point2":
            iframe.src = "https://720yun.com/t/8avkcwdm7dl?scene_id=63523940";
            break;
          case "point3":
            iframe.src = "https://720yun.com/t/b70jrztnza8?scene_id=27034251";
            break;
        }
      }
    },
    unshow() {
      this.showLegend = false;
    },
    onCancel() {
      this.showView = false;
    },
  },
  destroyed() {
    removeLayers(window.MAP, ["hhg-buildings", "hhg-viewpoint"]);
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
  padding: 10px;
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
.legendItem:last-child {
  margin-bottom: 0px;
}

.view720 {
  position: absolute;
  width: 70%;
  height: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  // background-color: aqua;

  .viewbody {
    width: 100%;
    height: 100%;
  }
}
</style>