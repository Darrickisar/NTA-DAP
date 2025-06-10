// 更新省份柱状图
function updateProvinceBarChart(regionCode) {
    // 获取该大区下的所有省份
    const provincesInRegion = regionMapping[regionCode] || [];
    
    // 使用真实数据
    const provinceData = [];
    provincesInRegion.forEach(province => {
        if (provinceTotalSpots.hasOwnProperty(province)) {
            provinceData.push({
                province: province,
                count: provinceTotalSpots[province]
            });
        }
    });
    
    // 按景区数量排序
    provinceData.sort((a, b) => b.count - a.count);
    
    const provinces = provinceData.map(item => item.province);
    const counts = provinceData.map(item => item.count);
    
    charts.provinceBarChart.setOption({
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
            data: provinces,
            axisLine: {
                lineStyle: { color: '#a0d2ff' }
            },
            axisLabel: {
                color: '#fff',
                rotate: 45,
                fontSize: 12
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
                    return provinces[params.dataIndex] === selectedProvince 
                        ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#ff9a76' },
                            { offset: 1, color: '#e86a46' }
                        ])
                        : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#a0d2ff' },
                            { offset: 1, color: '#4575b4' }
                        ]);
                }
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#40e0d0' },
                        { offset: 1, color: '#1a8a7d' }
                    ])
                }
            },
            label: {
                show: true,
                position: 'top',
                color: function(params) {
                    return provinces[params.dataIndex] === selectedProvince? '#ff9a76' : '#a0d2ff';
                },
                fontWeight: 'bold',
                fontSize: 12
            }
        }]
    });
    
    // 添加柱状图点击事件
    charts.provinceBarChart.off('click');
    charts.provinceBarChart.on('click', function(params) {
        selectedProvince = provinces[params.dataIndex];
        document.getElementById('selectedProvince').textContent = selectedProvince;
        document.getElementById('provinceInfo').style.display = 'block';
        
        // 高亮显示选中的省份
        updateProvinceBarChart(selectedRegion);
        
        // 更新景区等级分布饼图
        updateGradePieChart(selectedProvince);
        
        // 如果地图实例已加载，则移动地图到该省份
        if (bmapInstance && provinceCenters[selectedProvince]) {
            const center = provinceCenters[selectedProvince];
            const point = new BMap.Point(center[0], center[1]);
            bmapInstance.centerAndZoom(point, 8);
        }
    });
}