// 全局变量
const charts = {};
let regionData = [];
let geoData = [];
let selectedProvince = null;
let bmapInstance = null;

// 省份中心点坐标映射
const provinceCenters = {
    '浙江省': [120.15, 30.25],
    '广东省': [113.27, 23.13],
    '四川省': [104.06, 30.67],
    '北京市': [116.40, 39.90],
    '江苏省': [118.78, 32.04],
    '山东省': [117.00, 36.65],
    '湖南省': [112.97, 28.19],
    '河北省': [114.48, 38.03],
    '安徽省': [117.28, 31.86],
    '云南省': [102.71, 25.04],
    '福建省': [119.30, 26.08],
    '辽宁省': [123.43, 41.80],
    '河南省': [113.65, 34.76],
    '山西省': [112.55, 37.87],
    '江西省': [115.90, 28.68],
    '上海市': [121.47, 31.23],
    '重庆市': [106.55, 29.56],
    '内蒙古自治区': [111.73, 40.83],
    '广西壮族自治区': [108.32, 22.82],
    '台湾省': [121.50, 25.03],
    '陕西省': [108.95, 34.27],
    '天津市': [117.20, 39.12],
    '海南省': [110.20, 20.02],
    '黑龙江省': [126.53, 45.80],
    '甘肃省': [103.82, 36.06],
    '贵州省': [106.63, 26.65],
    '新疆维吾尔自治区': [87.62, 43.82],
    '香港': [114.16, 22.28],
    '澳门': [113.54, 22.19],
    '西藏自治区': [91.14, 29.64],
    '青海省': [101.78, 36.62]
};

// 初始化函数
function init() {
    // 初始化图表
    initCharts();
    
    // 初始数据更新
    updateAllCharts();
    
    // 设置筛选按钮事件
    document.getElementById('applyFilter').addEventListener('click', function() {
        simulateLoading();
        setTimeout(updateAllCharts, 1500);
    });
    
    document.getElementById('resetFilter').addEventListener('click', function() {
        document.getElementById('regionFilter').value = 'all';
        document.getElementById('categoryFilter').value = 'all';
        clearProvinceSelection();
        simulateLoading();
        setTimeout(updateAllCharts, 1500);
    });
    
    // 窗口大小变化时重新绘制柱状图
    window.addEventListener('resize', function() {
        if (regionData.length > 0) {
            updateBarChart1(regionData);
        }
    });
}

// 清除省份选择
function clearProvinceSelection() {
    selectedProvince = null;
    document.getElementById('provinceInfo').style.display = 'none';
    updateBarChart1(regionData);
    updateMapChart(geoData);
}

// 模拟加载效果
function simulateLoading() {
    // 显示加载动画
    document.querySelectorAll('.chart').forEach(chart => {
        chart.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    });
}

// 初始化图表
function initCharts() {
    // 初始化图表实例
    charts.barChart1 = echarts.init(document.getElementById('barChart1'));
    charts.pieChart = echarts.init(document.getElementById('pieChart'));
    charts.mapChart = echarts.init(document.getElementById('mapChart'));
    
    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', function() {
        for (const chart in charts) {
            if (charts[chart]) {
                charts[chart].resize();
            }
        }
    });
}

// 更新所有图表数据
function updateAllCharts() {
    // 各地区景区分布数据
    regionData = [
        {region: '浙江省', count: 69},
        {region: '广东省', count: 64},
        {region: '四川省', count: 64},
        {region: '北京市', count: 62},
        {region: '江苏省', count: 61},
        {region: '山东省', count: 51},
        {region: '湖南省', count: 42},
        {region: '河北省', count: 40},
        {region: '安徽省', count: 35},
        {region: '云南省', count: 35},
        {region: '福建省', count: 33},
        {region: '辽宁省', count: 32},
        {region: '河南省', count: 32},
        {region: '山西省', count: 32},
        {region: '江西省', count: 31},
        {region: '上海市', count: 29},
        {region: '重庆市', count: 26},
        {region: '内蒙古自治区', count: 25},
        {region: '广西壮族自治区', count: 25},
        {region: '台湾省', count: 21},
        {region: '陕西省', count: 18},
        {region: '天津市', count: 15},
        {region: '海南省', count: 13},
        {region: '黑龙江省', count: 12},
        {region: '甘肃省', count: 12},
        {region: '贵州省', count: 11},
        {region: '新疆维吾尔自治区', count: 10},
        {region: '香港', count: 6},
        {region: '澳门', count: 6},
        {region: '西藏自治区', count: 5},
        {region: '青海省', count: 4}
    ];
    
    // 景区等级分布数据
    const gradeData = [
        {grade: '其他', count: 935},
        {grade: '4A', count: 41},
        {grade: '3A', count: 20},
        {grade: '5A', count: 4}
    ];
    
    // 景区地理分布数据
    geoData = [
        {name: '西湖', province: '浙江省', lng: 120.15, lat: 30.25},
        {name: '长城', province: '北京市', lng: 116.39, lat: 40.22},
        {name: '九寨沟', province: '四川省', lng: 103.92, lat: 33.17},
        {name: '张家界', province: '湖南省', lng: 110.47, lat: 29.13},
        {name: '黄山', province: '安徽省', lng: 118.17, lat: 30.13},
        {name: '丽江古城', province: '云南省', lng: 100.23, lat: 26.87},
        {name: '桂林山水', province: '广西壮族自治区', lng: 110.28, lat: 25.28},
        {name: '三亚', province: '海南省', lng: 109.51, lat: 18.25},
        {name: '鼓浪屿', province: '福建省', lng: 118.06, lat: 24.45},
        {name: '布达拉宫', province: '西藏自治区', lng: 91.12, lat: 29.65},
        {name: '峨眉山', province: '四川省', lng: 103.48, lat: 29.59},
        {name: '泰山', province: '山东省', lng: 117.11, lat: 36.20},
        {name: '华山', province: '陕西省', lng: 110.09, lat: 34.48},
        {name: '乌镇', province: '浙江省', lng: 120.49, lat: 30.75},
        {name: '周庄', province: '江苏省', lng: 120.84, lat: 31.12},
        {name: '千岛湖', province: '浙江省', lng: 119.04, lat: 29.61},
        {name: '都江堰', province: '四川省', lng: 103.61, lat: 31.00},
        {name: '乐山大佛', province: '四川省', lng: 103.77, lat: 29.54},
        {name: '黄果树瀑布', province: '贵州省', lng: 105.67, lat: 25.99},
        {name: '呼伦贝尔草原', province: '内蒙古自治区', lng: 119.76, lat: 49.21},
        {name: '长白山', province: '吉林省', lng: 128.05, lat: 42.01},
        {name: '壶口瀑布', province: '山西省', lng: 110.48, lat: 36.14},
        {name: '莫高窟', province: '甘肃省', lng: 94.81, lat: 40.13},
        {name: '兵马俑', province: '陕西省', lng: 109.27, lat: 34.38},
        {name: '洱海', province: '云南省', lng: 100.18, lat: 25.86},
        {name: '香格里拉', province: '云南省', lng: 99.70, lat: 27.83},
        {name: '稻城亚丁', province: '四川省', lng: 100.30, lat: 28.44},
        {name: '西双版纳', province: '云南省', lng: 100.80, lat: 22.01},
        {name: '天山天池', province: '新疆维吾尔自治区', lng: 88.13, lat: 43.88},
        {name: '喀纳斯湖', province: '新疆维吾尔自治区', lng: 87.02, lat: 48.71},
        {name: '青海湖', province: '青海省', lng: 100.21, lat: 36.89},
        {name: '纳木错', province: '西藏自治区', lng: 90.89, lat: 30.77},
        {name: '外滩', province: '上海市', lng: 121.49, lat: 31.24},
        {name: '故宫', province: '北京市', lng: 116.40, lat: 39.92},
        {name: '颐和园', province: '北京市', lng: 116.27, lat: 39.99},
        {name: '天坛', province: '北京市', lng: 116.41, lat: 39.88},
        {name: '拙政园', province: '江苏省', lng: 120.62, lat: 31.32},
        {name: '寒山寺', province: '江苏省', lng: 120.57, lat: 31.31},
        {name: '中山陵', province: '江苏省', lng: 118.85, lat: 32.06},
        {name: '平遥古城', province: '山西省', lng: 112.18, lat: 37.20},
        {name: '云冈石窟', province: '山西省', lng: 113.15, lat: 40.11},
        {name: '龙门石窟', province: '河南省', lng: 112.47, lat: 34.56},
        {name: '少林寺', province: '河南省', lng: 112.95, lat: 34.51},
        {name: '黄鹤楼', province: '湖北省', lng: 114.30, lat: 30.55},
        {name: '武当山', province: '湖北省', lng: 111.00, lat: 32.40},
        {name: '凤凰古城', province: '湖南省', lng: 109.60, lat: 27.95},
        {name: '衡山', province: '湖南省', lng: 112.70, lat: 27.25},
        {name: '崂山', province: '山东省', lng: 120.67, lat: 36.20},
        {name: '武夷山', province: '福建省', lng: 118.03, lat: 27.76},
        {name: '庐山', province: '江西省', lng: 115.98, lat: 29.52},
        {name: '滕王阁', province: '江西省', lng: 115.88, lat: 28.68},
        {name: '趵突泉', province: '山东省', lng: 117.01, lat: 36.66},
        {name: '峨眉山', province: '四川省', lng: 103.48, lat: 29.59},
        {name: '青城山', province: '四川省', lng: 103.57, lat: 30.90},
        {name: '石林', province: '云南省', lng: 103.30, lat: 24.82},
        {name: '大理古城', province: '云南省', lng: 100.22, lat: 25.70},
        {name: '玉龙雪山', province: '云南省', lng: 100.24, lat: 27.10}
    ];
    
    // 更新各地区景区数量柱状图
    updateBarChart1(regionData);
    
    // 更新景区等级分布饼图
    updatePieChart(gradeData);
    
    // 更新地图热力图
    updateMapChart(geoData);
    
    // 更新时间
    updateTime();
}

// 更新时间
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('updateTime').textContent = timeStr;
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);