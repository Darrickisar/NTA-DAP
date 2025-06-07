// 初始化 ECharts 实例
const regionsChart = echarts.init(document.getElementById('regions-chart'));
const ticketPricesChart = echarts.init(document.getElementById('ticket-prices-chart'));
const ratingsChart = echarts.init(document.getElementById('ratings-chart'));
const locationsMap = echarts.init(document.getElementById('locations-map'));

// 响应式图表大小调整
window.addEventListener('resize', function() {
    regionsChart.resize();
    ticketPricesChart.resize();
    ratingsChart.resize();
    locationsMap.resize();
});

// --- 区域景区概览图表 (柱状图) ---
function loadRegionsChart() {
    fetch('/api/regions')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                regionsChart.setOption({
                    title: {
                        text: '暂无数据',
                        left: 'center',
                        top: 'center',
                        textStyle: { color: '#999' }
                    }
                });
                return;
            }
            
            const regionNames = data.map(item => item.name);
            const regionValues = data.map(item => item.value);

            regionsChart.setOption({
                title: {
                    text: '各地区景区数量分布',
                    left: 'center',
                    textStyle: { color: '#eee' }
                },
                tooltip: { trigger: 'axis' },
                xAxis: {
                    type: 'category',
                    data: regionNames,
                    axisLabel: { 
                        rotate: 45,
                        color: '#ccc'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#ccc' }
                },
                series: [{
                    name: '景区数量',
                    type: 'bar',
                    data: regionValues,
                    itemStyle: { color: '#5470C6' }
                }],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                }
            });
        })
        .catch(error => {
            console.error('获取地区数据失败:', error);
            regionsChart.setOption({
                title: {
                    text: '数据加载失败',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#ff3333' }
                }
            });
        });
}

// --- 门票价格分布图表 (直方图模拟) ---
function loadTicketPricesChart() {
    fetch('/api/ticket_prices')
        .then(response => response.json())
        .then(data => {
            const prices = data.prices || [];
            const averagePrice = data.average || 0;

            // 简单分箱
            const bins = [0, 50, 100, 150, 200, 300, 500];
            const binnedData = new Array(bins.length - 1).fill(0);
            const binLabels = [];
            
            for (let i = 0; i < bins.length - 1; i++) {
                binLabels.push(`${bins[i]}-${bins[i+1]-1}`);
            }

            prices.forEach(price => {
                for (let i = 0; i < bins.length - 1; i++) {
                    if (price >= bins[i] && price < bins[i+1]) {
                        binnedData[i]++;
                        break;
                    }
                }
            });

            ticketPricesChart.setOption({
                title: {
                    text: '门票价格分布',
                    subtext: `平均价格: ${averagePrice.toFixed(2)} 元`,
                    left: 'center',
                    textStyle: { color: '#eee' },
                    subtextStyle: { color: '#aaa' }
                },
                tooltip: { trigger: 'axis' },
                xAxis: {
                    type: 'category',
                    data: binLabels,
                    axisLabel: {
                        rotate: 45,
                        color: '#ccc'
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#ccc' }
                },
                series: [{
                    name: '景区数量',
                    type: 'bar',
                    data: binnedData,
                    itemStyle: { color: '#91CC75' }
                }],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                }
            });
        })
        .catch(error => {
            console.error('获取门票价格数据失败:', error);
            ticketPricesChart.setOption({
                title: {
                    text: '数据加载失败',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#ff3333' }
                }
            });
        });
}

// --- 景区表现分析图表 (散点图) ---
function loadRatingsChart() {
    fetch('/api/ratings')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                ratingsChart.setOption({
                    title: {
                        text: '暂无数据',
                        left: 'center',
                        top: 'center',
                        textStyle: { color: '#999' }
                    }
                });
                return;
            }
            
            // 创建散点数据 [星级, 评分, 景点名称]
            const scatterData = data.map(item => [
                item.star || '0', 
                item.rating || 0, 
                item.name || '未知景点'
            ]);

            ratingsChart.setOption({
                title: {
                    text: '景区评分与星级关系',
                    left: 'center',
                    textStyle: { color: '#eee' }
                },
                tooltip: {
                    formatter: function(params) {
                        return `${params.data[2]}<br/>星级: ${params.data[0]}<br/>评分: ${params.data[1]}`;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: ['0', '1A', '2A', '3A', '4A', '5A'],
                    axisLabel: { color: '#ccc' }
                },
                yAxis: {
                    type: 'value',
                    name: '景区评分',
                    min: 0,
                    max: 5,
                    axisLabel: { color: '#ccc' }
                },
                series: [{
                    type: 'scatter',
                    symbolSize: function(data) {
                        return data[1] * 5 + 5; // 根据评分调整大小
                    },
                    data: scatterData,
                    itemStyle: { color: '#FAC858' }
                }],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            });
        })
        .catch(error => {
            console.error('获取评分数据失败:', error);
            ratingsChart.setOption({
                title: {
                    text: '数据加载失败',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#ff3333' }
                }
            });
        });
}

// --- 地理映射图表 (中国地图) ---
function loadLocationsMap() {
    // 直接使用内置的中国地图
    locationsMap.setOption({
        title: {
            text: '全国景区地理分布',
            left: 'center',
            textStyle: { color: '#eee' }
        },
        tooltip: { trigger: 'item' }
    });

    fetch('/api/locations')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                locationsMap.setOption({
                    title: {
                        subtext: '暂无地理位置数据',
                        subtextStyle: { color: '#999' }
                    }
                });
                return;
            }
            
            const scatterData = data.map(item => ({
                name: item.name || '未知景点',
                value: [item.lng, item.lat, item.rating || 0, item.price || 0]
            }));

            locationsMap.setOption({
                amap: {
                    viewMode: '3D',
                    center: [104.114129, 37.550339],
                    zoom: 4,
                    mapStyle: 'amap://styles/darkblue'
                },
                tooltip: {
                    formatter: function(params) {
                        return `${params.name}<br/>评分: ${params.value[2]}<br/>门票: ${params.value[3]}元`;
                    }
                },
                series: [{
                    type: 'scatter',
                    coordinateSystem: 'amap',
                    data: scatterData,
                    symbolSize: function(val) {
                        return Math.sqrt(val[3]) * 2 + 5; // 根据门票价格调整大小
                    },
                    itemStyle: {
                        color: function(params) {
                            // 根据评分改变颜色
                            const rating = params.value[2];
                            if (rating > 4.5) return '#ff3333';
                            if (rating > 4.0) return '#ff9933';
                            if (rating > 3.5) return '#ffff33';
                            return '#33ff33';
                        }
                    }
                }]
            });
        })
        .catch(error => {
            console.error('获取地理位置数据失败:', error);
            locationsMap.setOption({
                title: {
                    subtext: '数据加载失败',
                    subtextStyle: { color: '#ff3333' }
                }
            });
        });
}

// 页面加载完成后调用函数加载图表数据
document.addEventListener('DOMContentLoaded', () => {
    loadRegionsChart();
    loadTicketPricesChart();
    loadRatingsChart();
    loadLocationsMap();
});