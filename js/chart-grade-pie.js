// 更新景区等级分布饼图
function updateGradePieChart(province) {
    // 获取该省份的等级分布数据
    let gradeData = provinceGradeData[province];
    
    // 如果省份没有单独数据，使用全国数据
    if (!gradeData) {
        gradeData = nationalGradeData;
    }
    
    charts.gradePieChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            bottom: 0,
            textStyle: { color: '#fff' },
            itemWidth: 15,
            itemHeight: 10
        },
        series: [{
            name: '景区等级',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#1a2a6c',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {d}%',
                color: '#fff',
                fontWeight: 'bold'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '14',
                    fontWeight: 'bold'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)' 
                }
            },
            labelLine: {
                show: true
            },
            data: gradeData.map(item => ({
                value: item.count,
                name: item.grade
            })),
            color: ['#ff9a76', '#a0d2ff', '#40e0d0', '#b19cd9', '#7bd0c1']
        }]
    });
}