<template>
  <div>
    <div class="drawGroup">
      <div
        v-for="(item, index) in drawItems"
        :key="index"
        class="drawItem"
        @click.stop="addpolygon(index, item.val)"
        :class="{ isActive: position === index }"
      >
        <img
          :src="item.src"
          style="width: 25px; height: 25px; margin: 0 auto"
        />
      </div>
    </div>
    <MulDataPan
      v-show="showDataPan"
      :tabItems="tabItems"
      :activeName="activeName"
      class="mulDataPan"
    >
      <div id="dataBody"></div>
    </MulDataPan>
  </div>
</template>
<script>
import * as turf from "@turf/turf";
import { init_map } from "utils/initMap.js";
import {
  add_tms,
  add_wms,
  addgeojson_S,
  addgeojson_L,
} from "utils/loadLayer.js";
import { removeLayers, removeLayers2 } from "utils/removeLayers.js";
import { circleEvt } from "utils/draw/circle.js";
import { polygonEvt } from "utils/draw/polygon.js";
import { rectangleEvt } from "utils/draw/rectangle.js";
import { deleteEvt } from "utils/draw/delete.js";
import MulDataPan from "./MulDataPan.vue";
import { postHjNlData } from "api/population/census.js";
let dataChart;
let hjnlData;

export default {
  data() {
    return {
      drawItems: [
        {
          index: 1,
          val: "circle",
          src: require("assets/drawControl/circle.png"),
        },
        {
          index: 2,
          val: "rectangle",
          src: require("assets/drawControl/rectangle.png"),
        },
        {
          index: 3,
          val: "polygon",
          src: require("assets/drawControl/polygon.png"),
        },
        {
          index: 4,
          val: "delete",
          src: require("assets/drawControl/delete.png"),
        },
      ],
      tabItems: [
        {
          name: "huji",
          label: "户籍",
          text: "户 籍",
        },
        {
          name: "nianling",
          label: "年龄",
          text: "年 龄",
        },
      ],
      activeName: "huji",
      position: "",
      showDataPan: false,
    };
  },
  components: {
    MulDataPan,
  },
  mounted() {
    this.init();
    this.initLayers();
  },
  methods: {
    init() {
      init_map(window.MAP, [113.297084, 23.140441], 14);
      // postHjNlData("/pop_perceive/qipu/getPop", {
      //   ids: JSON.stringify(ids),
      // }).then((res) => {
      //   hjnlData = res.data.data;
      //   _this.setHjData();
      // });
    },
    initLayers() {
      removeLayers(window.MAP, ["hhg-hongxian"]);
      add_wms(window.MAP, "hhg-hongxian");
      window.MAP.addSource("hhg-pop-heatmap", {
        type: "raster",
        tiles: [
          "http://39.108.85.19:8181/geoserver/hhg/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=TRUE&STYLES&LAYERS=gpzi:hhg-pop-heatmap&exceptions=application/vnd.ogc.se_inimage&SRS=EPSG:3857&WIDTH=769&HEIGHT=750&BBOX={bbox-epsg-3857}",
        ],
        tileSize: 512,
      });
      window.MAP.addLayer({
        id: "hhg-pop-heatmap",
        type: "raster",
        source: "hhg-pop-heatmap",
        paint: {
          "raster-opacity": 0.3,
        },
      });
    },
    addpolygon(index, val) {
      let _this = this;
      this.position = index;
      var features = [];
      window.MAP.getCanvas().style.cursor = "crosshair";
      switch (val) {
        case "circle":
          circleEvt(function () {
            var circle = window.MAP.getSource("circle");
            features = circle._data.geometry.coordinates[0];
            features.push(features[0]);
            _this.loadWFS(features);
          }, window.MAP);
          break;
        case "rectangle":
          rectangleEvt(function () {
            var rectangle = window.MAP.getSource("rectangle");
            features = rectangle._data.features[0].geometry.coordinates[0];
            features.push(features[0]);
            _this.loadWFS(features);
          }, window.MAP);
          break;
        case "polygon":
          polygonEvt(function () {
            var points_area = window.MAP.getSource("points-area");
            points_area._data.features.forEach((element) => {
              if (!features.includes(element.geometry.coordinates)) {
                features.push(element.geometry.coordinates);
              }
            });
            features.push(features[0]);
            _this.loadWFS(features);
          }, window.MAP);
          break;
        case "delete":
          deleteEvt(window.MAP);
          break;
      }
    },
    loadWFS(features) {
      let _this = this;
      let ids = [];
      let ptsWithin;
      var searchWithin = turf.polygon([features]);
      this.axios
        .get("http://8.134.70.156:8181/geoserver/wfs", {
          params: {
            service: "WFS",
            version: "1.1.0",
            request: "GetFeature",
            typeName: "gpzi:hhg-qipu",
            outputFormat: "application/json",
            srsName: "EPSG:4326",
          },
        })
        .then((res) => {
          var stations = res.data.features;
          stations.forEach((item) => {
            let pt = turf.point(item.geometry.coordinates);
            if (turf.booleanPointInPolygon(pt, searchWithin)) {
              ids.push(item.properties.wgid);
            }
          });
          console.log(ids,'ids');
          if (ids.length == 0) {
            _this.$message.error("查询超出黄花岗范围");
            return;
          } else {
            _this.showDataPan = true;
            var dataDom = document.getElementById("dataBody");
            dataChart = echarts.init(dataDom);
            postHjNlData("/pop_perceive/qipu/getPop", {
              ids: JSON.stringify(ids),
            }).then((res) => {
              _this.$message.success("获取数据成功");
              hjnlData = res.data.data;
              _this.setHjData();
            });
          }
        });
    },
    setHjData() {
      this.$nextTick(() => {
        var getName = {
          shanghai: "上海",
          yunnan: "云南",
          neimenggu: "内蒙古",
          beijing: "北京",
          jilin: "吉林",
          sichuan: "四川",
          tianjin: "天津",
          ningxia: "宁夏",
          anhui: "安徽",
          shandong: "山东",
          shanxi: "山西",
          guangdong: "广东",
          guangxi: "广西",
          xinjiang: "新疆",
          jiangsu: "江苏",
          jiangxi: "江西",
          hebei: "河北",
          henan: "河南",
          zhejiang: "浙江",
          hainan: "海南",
          hubei: "湖北",
          hunan: "湖南",
          gansu: "甘肃",
          fujian: "福建",
          xizang: "西藏",
          guizhou: "贵州",
          liaoning: "辽宁",
          chongqing: "重庆",
          shaanxi: "陕西",
          qinghai: "青海",
          helongjiang: "黑龙江",
        };
        console.log(hjnlData[0]);
        var hj = hjnlData[0];
        var sortable = [];
        for (var key in hj) {
          if (hj[key] != null && key.indexOf("groupid") == -1 && key.indexOf("znl") == -1)
            sortable.push([key, hj[key]]);
        }
        sortable.sort(function (a, b) {
          return a[1] - b[1];
        });
        let datax = [];
        let datay = [];
        for (let i = 0; i < sortable.length; i++) {
          datax.push(sortable[i][1]);
          datay.push(getName[sortable[i][0]]);
        }
        var bar_option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}:{c}",
          },
          grid: {
            x: 80,
            y: 40,
            y2: 5,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.02],
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "category",
            data: datay,
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#00FFFF",
              },
              interval: 0,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#00FFFF",
              },
            },
          },
          color: "#00FFFF",
          series: [
            {
              type: "bar",
              data: datax,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "right", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#00FFFF",
                      fontSize: 10,
                    },
                  },
                },
              },
            },
          ],
        };
        dataChart.setOption(bar_option, true);
      });
    },
    setNlData() {
      this.$nextTick(() => {
        var getName = {
          znl60: "60以上",
          znl4559: "45-59",
          znl3044: "30-44",
          znl1629: "16-29",
          znl015: "0-15",
        };
        var nl = hjnlData[0];
        var sortable = [];
        for (var key in nl) {
          if (nl[key] != null && key.indexOf("groupid") == -1 && key.indexOf("znl") != -1 ) {
            sortable.push([key, nl[key]]);
          }
        }
        let datax = [];
        let datay = [];
        for (let i = 0; i < sortable.length; i++) {
          datax.push(sortable[i][1]);
          datay.push(getName[sortable[i][0]]);
        }
        var bar_option = {
          tooltip: {
            trigger: "item",
            formatter: "{b}:{c}",
          },
          grid: {
            x: 80,
            y: 50,
            y2: 400,
          },
          xAxis: {
            type: "value",
            boundaryGap: [0, 0.02],
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "category",
            data: datay,
            splitLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#00FFFF",
              },
              interval: 0,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#00FFFF",
              },
            },
          },
          color: "#00FFFF",
          series: [
            {
              type: "bar",
              data: datax,
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "right", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#00FFFF",
                      fontSize: 10,
                    },
                  },
                },
              },
            },
          ],
        };
        dataChart.setOption(bar_option, true);
      });
    },
  },
  destroyed() {
    removeLayers(window.MAP, ["hhg-pop-heatmap"]);
    deleteEvt(window.MAP);
  },
};
</script>
<style lang='scss' scoped>
.drawGroup {
  position: absolute;
  top: 40px;
  left: 10px;
  width: fit-content;
  height: auto;
  cursor: pointer;
  z-index: 999;
  // padding:3px;
  border-radius: 5px;
  background-color: aliceblue;

  .drawItem {
    width: 42px;
    height: 42px;
    // background-color: aquamarine;
    padding: 1px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    // border-bottom: solid 2px darkgrey;
  }

  .drawItem:hover {
    background-color: rgba(102, 102, 102, 0.2);
  }

  div:not(:last-child) {
    border-bottom: solid 2px darkgrey;
  }

  .isActive {
    background-color: rgba(102, 102, 102, 0.4);
  }
}

#dataBody {
  width: 350px;
  height: 680px;
  // padding: 5px;
  box-sizing: border-box;
  z-index: 999;
}

.mulDataPan {
  top: 40px;
  right: 10px;
  width: 350px;
  height: calc(100% - 50px);
}
</style>