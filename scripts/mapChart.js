// 更新地图热力图
function updateMapChart(data) {
    // 转换数据格式
    const mapData = data.map(item => ({
        name: item.name,
        value: [item.lng, item.lat, 1]
    }));
    
    // 配置百度地图AK
    const ak = 'shMcR5luvatxcVQubIIpSkTT8iugO89x';
    
    charts.mapChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return params.data.name;
            }
        },
        bmap: {
            center: [104.114129, 37.550339],
            zoom: selectedProvince ? 8 : 5,
            roam: true,
            ak: ak,
            mapStyle: {
                styleJson: [{
                    'featureType': 'water',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#044161'
                    }
                }, {
                    'featureType': 'land',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#004981'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#064f85'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#004981'
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#005b96',
                        'lightness': 1
                    }
                }, {
                    'featureType': 'highway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#004981'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#00508b'
                    }
                }, {
                    'featureType': 'poi',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#056197',
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'geometry.fill',
                    'stylers': {
                        'color': '#029fd4'
                    }
                }, {
                    'featureType': 'building',
                    'elementType': 'all',
                    'stylers': {
                        'color': '#1a5787'
                    }
                }, {
                    'featureType': 'label',
                    'elementType': 'all',
                    'stylers': {
                        'visibility': 'off'
                    }
                }]
            }
        },
        series: [{
            name: '景区分布',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: mapData,
            symbolSize: function(val) {
                return selectedProvince ? 15 : 10;
            },
            itemStyle: {
                color: selectedProvince ? '#ff9a76' : '#40e0d0'
            },
            emphasis: {
                itemStyle: {
                    color: '#ff0000',
                    shadowBlur: 20,
                    shadowColor: 'rgba(255, 154, 118, 0.8)'
                }
            }
        }]
    });
    
    // 获取百度地图实例
    setTimeout(() => {
        if (charts.mapChart) {
            const bmap = charts.mapChart.getModel().getComponent('bmap');
            if (bmap) {
                bmapInstance = bmap.getBMap();
                
                // 如果选择了省份，则移动地图到该省份
                if (selectedProvince && provinceCenters[selectedProvince]) {
                    const center = provinceCenters[selectedProvince];
                    const point = new BMap.Point(center[0], center[1]);
                    bmapInstance.centerAndZoom(point, 8);
                }
            }
        }
    }, 500);
}

// 使用懒加载数据更新地图
function updateMapWithLazyData(newData) {
    const currentOption = charts.mapChart.getOption();
    const currentSeries = currentOption.series[0];
    const currentData = currentSeries.data || [];
    
    // 转换新数据格式
    const newMapData = newData.map(item => ({
        name: item.name,
        value: [item.lng, item.lat, 1]
    }));
    
    // 合并新数据
    const mergedData = [...currentData, ...newMapData];
    
    // 更新地图
    charts.mapChart.setOption({
        series: [{
            data: mergedData
        }]
    });
}