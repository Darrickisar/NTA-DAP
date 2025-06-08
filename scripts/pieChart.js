// 更新饼图（景区等级分布）
function updatePieChart(data) {
    charts.pieChart.setOption({
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
                    fontSize: '16',
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
            data: data.map(item => ({
                value: item.count,
                name: item.grade
            })),
            color: ['#40e0d0', '#a0d2ff', '#ff9a76', '#b19cd9', '#7bd0c1']
        }]
    });
}