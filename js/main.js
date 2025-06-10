// 图表实例容器
const charts = {};
let regionData = []; // 大区数据
let provinceData = []; // 省份数据
let geoData = []; // 保存地理数据
let selectedRegion = null; // 当前选中的大区
let selectedProvince = null; // 当前选中的省份
let bmapInstance = null; // 百度地图实例
let lazyLoadTimeout = null; // 懒加载定时器
let loadedPoints = 0; // 已加载的点数
const LAZY_LOAD_BATCH_SIZE = 200; // 每次加载的点数
const LAZY_LOAD_DELAY = 500; // 懒加载延迟（毫秒）
let allGeoData = []; // 所有地理数据

// 大区中心点坐标映射
const regionCenters = {
    'east': [120.15, 30.25], // 东部地区（杭州）
    'west': [103.82, 36.06], // 西部地区（兰州）
    'central': [112.97, 28.19], // 中部地区（长沙）
    'northeast': [125.32, 43.88] // 东北地区（长春）
};

// 大区与省份映射
const regionMapping = {
    'east': ['北京市', '天津市', '河北省', '上海市', '江苏省', '浙江省', '福建省', '山东省', '广东省', '海南省', '台湾省', '香港', '澳门'],
    'central': ['山西省', '安徽省', '江西省', '河南省', '湖北省', '湖南省'],
    'west': ['内蒙古自治区', '广西壮族自治区', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'],
    'northeast': ['辽宁省', '吉林省', '黑龙江省']
};

// 真实省份景点数量数据
const provinceTotalSpots = {
    '浙江省': 5010,
    '广东省': 5008,
    '四川省': 4106,
    '北京市': 5009,
    '江苏省': 5009,
    '山东省': 5007,
    '湖南省': 2316,
    '河北省': 3390,
    '安徽省': 2147,
    '云南省': 2234,
    '福建省': 2686,
    '辽宁省': 2845,
    '河南省': 2696,
    '山西省': 2025,
    '江西省': 1965,
    '上海市': 3097,
    '重庆市': 1828,
    '内蒙古自治区': 1474,
    '广西壮族自治区': 2014,
    '台湾省': 1393,
    '陕西省': 2225,
    '天津市': 1436,
    '海南省': 1547,
    '黑龙江省': 1547,
    '甘肃省': 921,
    '贵州省': 1408,
    '新疆维吾尔自治区': 1095,
    '香港': 603,
    '澳门': 388,
    '西藏自治区': 510,
    '青海省': 394
};

// 全国景点等级分布
const nationalGradeData = [
    {grade: '其他', count: 75023},
    {grade: '4A', count: 1362},
    {grade: '3A', count: 4057},
    {grade: '5A', count: 468}
];

// 省份等级分布数据（部分省份有详细数据）
const provinceGradeData = {
    '浙江省': [
        {grade: '5A', count: 18},
        {grade: '4A', count: 85},
        {grade: '3A', count: 120},
        {grade: '其他', count: 4787}
    ],
    '江苏省': [
        {grade: '5A', count: 25},
        {grade: '4A', count: 95},
        {grade: '3A', count: 110},
        {grade: '其他', count: 4779}
    ],
    '广东省': [
        {grade: '5A', count: 15},
        {grade: '4A', count: 80},
        {grade: '3A', count: 95},
        {grade: '其他', count: 4818}
    ],
    '四川省': [
        {grade: '5A', count: 12},
        {grade: '4A', count: 75},
        {grade: '3A', count: 90},
        {grade: '其他', count: 3929}
    ],
    '山东省': [
        {grade: '5A', count: 11},
        {grade: '4A', count: 70},
        {grade: '3A', count: 85},
        {grade: '其他', count: 4841}
    ],
    '北京市': [
        {grade: '5A', count: 8},
        {grade: '4A', count: 65},
        {grade: '3A', count: 40},
        {grade: '其他', count: 4896}
    ]
};

// 省份边界数据（简化版）
const provinceBoundaries = {
    '北京市': { minLng: 115.7, maxLng: 117.4, minLat: 39.4, maxLat: 41.6 },
    '天津市': { minLng: 116.8, maxLng: 118.0, minLat: 38.6, maxLat: 40.2 },
    '河北省': { minLng: 113.4, maxLng: 119.8, minLat: 36.0, maxLat: 42.6 },
    '山西省': { minLng: 110.2, maxLng: 114.6, minLat: 34.6, maxLat: 40.9 },
    '内蒙古自治区': { minLng: 97.2, maxLng: 126.0, minLat: 37.4, maxLat: 53.3 },
    '辽宁省': { minLng: 118.8, maxLng: 125.8, minLat: 38.4, maxLat: 43.5 },
    '吉林省': { minLng: 121.6, maxLng: 131.3, minLat: 40.8, maxLat: 46.3 },
    '黑龙江省': { minLng: 121.1, maxLng: 135.1, minLat: 43.4, maxLat: 53.6 },
    '上海市': { minLng: 120.8, maxLng: 122.2, minLat: 30.7, maxLat: 31.8 },
    '江苏省': { minLng: 116.2, maxLng: 121.9, minLat: 30.7, maxLat: 35.1 },
    '浙江省': { minLng: 118.0, maxLng: 123.0, minLat: 27.1, maxLat: 31.2 },
    '安徽省': { minLng: 114.9, maxLng: 119.8, minLat: 29.4, maxLat: 34.6 },
    '福建省': { minLng: 115.8, maxLng: 120.7, minLat: 23.5, maxLat: 28.4 },
    '江西省': { minLng: 113.5, maxLng: 118.5, minLat: 24.5, maxLat: 30.1 },
    '山东省': { minLng: 114.8, maxLng: 122.8, minLat: 34.2, maxLat: 38.7 },
    '河南省': { minLng: 110.3, maxLng: 116.6, minLat: 31.4, maxLat: 36.4 },
    '湖北省': { minLng: 108.2, maxLng: 116.1, minLat: 29.0, maxLat: 33.3 },
    '湖南省': { minLng: 108.8, maxLng: 114.3, minLat: 24.6, maxLat: 30.1 },
    '广东省': { minLng: 109.7, maxLng: 117.3, minLat: 20.1, maxLat: 25.5 },
    '广西壮族自治区': { minLng: 104.3, maxLng: 112.1, minLat: 20.5, maxLat: 26.6 },
    '海南省': { minLng: 108.3, maxLng: 111.0, minLat: 18.2, maxLat: 20.2 },
    '重庆市': { minLng: 105.2, maxLng: 110.2, minLat: 28.1, maxLat: 32.2 },
    '四川省': { minLng: 97.3, maxLng: 108.5, minLat: 26.0, maxLat: 34.3 },
    '贵州省': { minLng: 103.6, maxLng: 109.6, minLat: 24.6, maxLat: 29.4 },
    '云南省': { minLng: 97.3, maxLng: 106.2, minLat: 21.1, maxLat: 29.2 },
    '西藏自治区': { minLng: 78.4, maxLng: 99.1, minLat: 26.5, maxLat: 36.5 },
    '陕西省': { minLng: 105.5, maxLng: 111.2, minLat: 31.7, maxLat: 39.6 },
    '甘肃省': { minLng: 92.3, maxLng: 108.7, minLat: 32.6, maxLat: 42.8 },
    '青海省': { minLng: 89.3, maxLng: 103.0, minLat: 31.4, maxLat: 39.2 },
    '宁夏回族自治区': { minLng: 104.2, maxLng: 107.7, minLat: 35.1, maxLat: 39.5 },
    '新疆维吾尔自治区': { minLng: 73.4, maxLng: 96.4, minLat: 34.3, maxLat: 49.2 },
    '台湾省': { minLng: 119.2, maxLng: 124.3, minLat: 21.9, maxLat: 25.3 },
    '香港': { minLng: 113.8, maxLng: 114.3, minLat: 22.1, maxLat: 22.5 },
    '澳门': { minLng: 113.5, maxLng: 113.6, minLat: 22.1, maxLat: 22.2 }
};

// 省份中心点坐标（用于地图定位）
const provinceCenters = {
    '浙江省': [120.15, 30.25],
    '江苏省': [118.78, 32.04],
    '广东省': [113.23, 23.16],
    '四川省': [104.06, 30.67],
    '山东省': [117.00, 36.65],
    '北京市': [116.40, 39.90],
    // 其他省份...
};

// 更新数据加载状态
function updateDataStatus(message, isSuccess = false) {
    const statusElement = document.getElementById('dataStatus');
    statusElement.textContent = `数据加载状态: ${message}`;
    statusElement.className = isSuccess ? 'data-status success' : 'data-status';
}

// 初始化函数
function init() {
    updateDataStatus("正在初始化平台...");
    
    // 初始化粒子背景
    initParticles();
    
    // 初始化所有图表
    initCharts();
    
    // 设置筛选按钮事件
    document.getElementById('applyFilter').addEventListener('click', function() {
        simulateLoading();
        setTimeout(updateAllCharts, 1500);
    });
    
    document.getElementById('resetFilter').addEventListener('click', function() {
        document.getElementById('regionFilter').value = 'all';
        document.getElementById('categoryFilter').value = 'all';
        clearProvinceSelection();
        clearRegionSelection();
        simulateLoading();
        setTimeout(updateAllCharts, 1500);
    });
    
    // 窗口大小变化时重新绘制图表
    window.addEventListener('resize', function() {
        for (const chart in charts) {
            if (charts[chart]) {
                charts[chart].resize();
            }
        }
    });
    
    // 添加滚动事件监听器用于懒加载
    window.addEventListener('scroll', handleScroll);
    
    // 生成模拟数据
    generateMockData();
    updateAllCharts();
    
    updateDataStatus("初始化完成", true);
}

// 生成模拟地理数据
function generateMockData() {
    updateDataStatus("正在生成模拟数据...");
    
    // 生成全国范围内的随机景点
    allGeoData = [];
    const provinces = Object.keys(provinceTotalSpots);
    
    provinces.forEach(province => {
        const count = provinceTotalSpots[province];
        const boundary = provinceBoundaries[province];
        
        if (boundary) {
            for (let i = 0; i < count / 100; i++) { // 减少数据量
                const lng = boundary.minLng + Math.random() * (boundary.maxLng - boundary.minLng);
                const lat = boundary.minLat + Math.random() * (boundary.maxLat - boundary.minLat);
                
                allGeoData.push({
                    name: `${province}景区${i + 1}`,
                    lng: lng,
                    lat: lat,
                    province: province
                });
            }
        }
    });
    
    // 初始化展示前200条
    geoData = allGeoData.slice(0, 200);
    loadedPoints = geoData.length;
    
    updateDataStatus(`已加载 ${loadedPoints} 个景区数据点`, true);
}

// 根据坐标获取省份（使用边界数据）
function getProvinceByCoordinates(lng, lat) {
    for (const province in provinceBoundaries) {
        const boundary = provinceBoundaries[province];
        if (lng >= boundary.minLng && lng <= boundary.maxLng && 
            lat >= boundary.minLat && lat <= boundary.maxLat) {
            return province;
        }
    }
    return '未知省份';
}

// 滚动处理函数
function handleScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 当滚动到底部时触发懒加载
    if (scrollPosition + windowHeight >= documentHeight - 200) {
        lazyLoadMoreData();
    }
}

// 懒加载更多数据
function lazyLoadMoreData() {
    if (loadedPoints >= allGeoData.length) {
        // 所有数据已加载完毕
        document.getElementById('lazyLoadInfo').innerHTML = 
            '<i class="fas fa-check-circle"></i> 所有景区数据加载完成';
        return;
    }
    
    // 如果已经在加载中，则跳过
    if (lazyLoadTimeout) return;
    
    // 显示加载提示
    document.getElementById('lazyLoadInfo').style.display = 'flex';
    
    // 模拟延迟加载
    lazyLoadTimeout = setTimeout(() => {
        const nextBatch = allGeoData.slice(loadedPoints, loadedPoints + LAZY_LOAD_BATCH_SIZE);
        loadedPoints += nextBatch.length;
        
        // 更新地图数据
        if (nextBatch.length > 0) {
            updateMapWithLazyData(nextBatch);
        }
        
        // 隐藏加载提示
        document.getElementById('lazyLoadInfo').style.display = 'none';
        
        // 重置超时标识
        lazyLoadTimeout = null;
        
        updateDataStatus(`已加载 ${loadedPoints}/${allGeoData.length} 个景区数据点`, true);
    }, LAZY_LOAD_DELAY);
}

// 清除省份选择
function clearProvinceSelection() {
    selectedProvince = null;
    document.getElementById('provinceInfo').style.display = 'none';
    if (selectedRegion) {
        updateProvinceBarChart(selectedRegion);
    }
    updateMapChart(geoData);
}

// 清除大区选择
function clearRegionSelection() {
    selectedRegion = null;
    selectedProvince = null;
    document.getElementById('provinceInfo').style.display = 'none';
    
    // 重置省份柱状图
    document.getElementById('provinceBarChart').innerHTML = 
        '<div class="loading"><div class="spinner"></div><div>请选择一个大区</div></div>';
    
    // 重置等级饼图
    document.getElementById('gradePieChart').innerHTML = 
        '<div class="loading"><div class="spinner"></div><div>请选择一个省份</div></div>';
}

// 模拟加载效果
function simulateLoading() {
    updateDataStatus("应用筛选条件中...");
    
    // 显示加载动画
    document.querySelectorAll('.chart, .half-chart').forEach(chart => {
        chart.innerHTML = '<div class="loading"><div class="spinner"></div><div>正在加载数据...</div><div class="progress-bar"><div class="progress"></div></div></div>';
    });
    
    // 模拟进度条
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        
        document.querySelectorAll('.progress').forEach(bar => {
            bar.style.width = `${progress}%`;
        });
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
}

// 初始化图表
function initCharts() {
    // 初始化图表实例
    charts.regionBarChart = echarts.init(document.getElementById('regionBarChart'));
    charts.mapChart = echarts.init(document.getElementById('mapChart'));
    charts.provinceBarChart = echarts.init(document.getElementById('provinceBarChart'));
    charts.gradePieChart = echarts.init(document.getElementById('gradePieChart'));
    
    // 初始化大区数据
    regionData = [
        { region: '东部地区', count: 45127, code: 'east' },
        { region: '西部地区', count: 18824, code: 'west' },
        { region: '中部地区', count: 12080, code: 'central' },
        { region: '东北地区', count: 5993, code: 'northeast' }
    ];
    
    updateDataStatus("图表初始化完成", true);
}

// 更新所有图表数据
function updateAllCharts() {
    // 更新大区景区数量柱状图
    updateRegionBarChart();
    
    // 更新地图热力图
    updateMapChart(geoData);
    
    // 更新时间
    updateTime();
    
    updateDataStatus("图表更新完成", true);
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