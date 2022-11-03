export const mapStyle = {
    'lanhei':{
        version: 8,
        sources: {
          mapsource: {
            type: "raster",
            tiles: [
              "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "mapsource",
            type: "raster",
            source: "mapsource",
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      'lanhei':{
        version: 8,
        sources: {
          mapsource: {
            type: "raster",
            tiles: [
              "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "mapsource",
            type: "raster",
            source: "mapsource",
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      'huise':{
        version: 8,
        sources: {
          mapsource: {
            type: "raster",
            tiles: [
              "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "mapsource",
            type: "raster",
            source: "mapsource",
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      'caise':{
        version: 8,
        sources: {
          mapsource: {
            type: "raster",
            tiles: [
              "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "mapsource",
            type: "raster",
            source: "mapsource",
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
 } 