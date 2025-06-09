// 更新柱状图1（各地区景区数量）
function updateBarChart1(data) {
    const regions = data.map(item => item.region);
    const counts = data.map(item => item.count);
    
    // 根据屏幕宽度动态调整配置
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth < 768;
    
    charts.barChart1.setOption({
        tooltip: { 
            trigger: 'axis',
            formatter: '{b}: {c} 个景区'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: isSmallScreen ? '35%' : '25%',
            containLabel: true
        },
        dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: 0,
            start: 0,
            end: isSmallScreen ? 50 : 70,
            bottom: 15,
            height: 20
        }],
        xAxis: {
            type: 'category',
            data: regions,
            axisLine: {
                lineStyle: { color: '#a0d2ff' }
            },
            axisLabel: {
                color: '#fff',
                interval: 0,
                rotate: isSmallScreen ? 90 : 45,
                fontSize: isSmallScreen ? 10 : 12,
                margin: isSmallScreen ? 40 : 15
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
                    return params.name === selectedProvince 
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
                    return params.name === selectedProvince ? '#ff9a76' : '#40e0d0';
                },
                fontWeight: 'bold',
                fontSize: isSmallScreen ? 10 : 12
            }
        }]
    });
    
    // 添加柱状图点击事件
    charts.barChart1.off('click');
    charts.barChart1.on('click', function(params) {
        selectedProvince = params.name;
        document.getElementById('selectedProvince').textContent = selectedProvince;
        document.getElementById('provinceInfo').style.display = 'block';
        
        // 高亮显示选中的省份
        updateBarChart1(data);
        
        // 如果地图实例已加载，则移动地图到该省份
        if (bmapInstance && provinceCenters[selectedProvince]) {
            const center = provinceCenters[selectedProvince];
            const point = new BMap.Point(center[0], center[1]);
            bmapInstance.centerAndZoom(point, 8);
        }
        
        // 更新地图点
        updateMapChart(geoData);
    });
}