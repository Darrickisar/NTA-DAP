// 更新大区柱状图
function updateRegionBarChart() {
    const regions = regionData.map(item => item.region);
    const counts = regionData.map(item => item.count);
    
    // 根据屏幕宽度动态调整配置
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth < 768;
    
    charts.regionBarChart.setOption({
        tooltip: { 
            trigger: 'axis',
            formatter: '{b}: {c} 个景区'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: regions,
            axisLine: {
                lineStyle: { color: '#a0d2ff' }
            },
            axisLabel: {
                color: '#fff',
                fontSize: 14
            }
        },
        yAxis: { 
            type: 'value',
            axisLine: {
                lineStyle: { color: '#a0d2ff' }
            },
            axisLabel: {
                color: '#fff'
            },
            splitLine: {
                lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        },
        series: [{
            name: '景区数量',
            type: 'bar',
            data: counts,
            itemStyle: {
                color: function(params) {
                    return regionData[params.dataIndex].code === selectedRegion 
                        ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ff9a76' },
                            { offset: 1, color: '#e86a46' }
                        ])
                        : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#40e0d0' },
                            { offset: 1, color: '#1a8a7d' }
                        ]);
                }
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#a0d2ff' },
                        { offset: 1, color: '#4575b4' }
                    ])
                }
            },
            label: {
                show: true,
                position: 'top',
                color: function(params) {
                    return regionData[params.dataIndex].code === selectedRegion? '#ff9a76' : '#40e0d0';
                },
                fontWeight: 'bold',
                fontSize: isSmallScreen? 10 : 12
            }
        }]
    });
    
    // 添加柱状图点击事件
    charts.regionBarChart.off('click');
    charts.regionBarChart.on('click', function(params) {
        selectedRegion = regionData[params.dataIndex].code;
        selectedProvince = null;
        document.getElementById('provinceInfo').style.display = 'none';
        
        // 高亮显示选中的大区
        updateRegionBarChart();
        
        // 更新省份柱状图
        updateProvinceBarChart(selectedRegion);
        
        // 如果地图实例已加载，则移动地图到该大区
        if (bmapInstance && regionCenters[selectedRegion]) {
            const center = regionCenters[selectedRegion];
            const point = new BMap.Point(center[0], center[1]);
            bmapInstance.centerAndZoom(point, 6);
        }
    });
}