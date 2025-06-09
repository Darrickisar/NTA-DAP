// // 全局变量
// const charts = {};
// let regionData = [];
// let geoData = [];
// let allGeoData = [];
// let selectedProvince = null;
// let bmapInstance = null;
// let lazyLoadTimeout = null;
// let loadedPoints = 0;
// const LAZY_LOAD_BATCH_SIZE = 200;
// const LAZY_LOAD_DELAY = 500;

// // 省份中心点坐标映射
// const provinceCenters = {
//     '浙江省': [120.15, 30.25],
//     '广东省': [113.27, 23.13],
//     '四川省': [104.06, 30.67],
//     '北京市': [116.40, 39.90],
//     '江苏省': [118.78, 32.04],
//     '山东省': [117.00, 36.65],
//     '湖南省': [112.97, 28.19],
//     '河北省': [114.48, 38.03],
//     '安徽省': [117.28, 31.86],
//     '云南省': [102.71, 25.04],
//     '福建省': [119.30, 26.08],
//     '辽宁省': [123.43, 41.80],
//     '河南省': [113.65, 34.76],
//     '山西省': [112.55, 37.87],
//     '江西省': [115.90, 28.68],
//     '上海市': [121.47, 31.23],
//     '重庆市': [106.55, 29.56],
//     '内蒙古自治区': [111.73, 40.83],
//     '广西壮族自治区': [108.32, 22.82],
//     '台湾省': [121.50, 25.03],
//     '陕西省': [108.95, 34.27],
//     '天津市': [117.20, 39.12],
//     '海南省': [110.20, 20.02],
//     '黑龙江省': [126.53, 45.80],
//     '甘肃省': [103.82, 36.06],
//     '贵州省': [106.63, 26.65],
//     '新疆维吾尔自治区': [87.62, 43.82],
//     '香港': [114.16, 22.28],
//     '澳门': [113.54, 22.19],
//     '西藏自治区': [91.14, 29.64],
//     '青海省': [101.78, 36.62]
// };

// // 更新调试信息
// function updateDebugInfo(message) {
//     const debugInfo = document.getElementById('debugInfo');
//     debugInfo.textContent = `数据加载状态: ${message}`;
// }

// // 清除省份选择
// function clearProvinceSelection() {
//     selectedProvince = null;
//     document.getElementById('provinceInfo').style.display = 'none';
//     updateBarChart1(regionData);
//     updateMapChart(geoData);
// }

// // 模拟加载效果
// function simulateLoading() {
//     // 显示加载动画
//     document.querySelectorAll('.chart').forEach(chart => {
//         chart.innerHTML = '<div class="loading"><div class="spinner"></div><div>正在加载数据...</div><div class="progress-bar"><div class="progress"></div></div></div>';
//     });
    
//     // 模拟进度条
//     let progress = 0;
//     const interval = setInterval(() => {
//         progress += 5;
//         if (progress > 100) progress = 100;
        
//         document.querySelectorAll('.progress').forEach(bar => {
//             bar.style.width = `${progress}%`;
//         });
        
//         if (progress >= 100) {
//             clearInterval(interval);
//         }
//     }, 100);
// }

// // 更新时间
// function updateTime() {
//     const now = new Date();
//     const timeStr = now.toLocaleString('zh-CN', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit'
//     });
//     document.getElementById('updateTime').textContent = timeStr;
// }

// // 滚动处理函数
// function handleScroll() {
//     const scrollPosition = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const documentHeight = document.documentElement.scrollHeight;
    
//     // 当滚动到底部时触发懒加载
//     if (scrollPosition + windowHeight >= documentHeight - 200) {
//         lazyLoadMoreData();
//     }
// }

// // 懒加载更多数据
// function lazyLoadMoreData() {
//     // 如果已经在加载中，则跳过
//     if (lazyLoadTimeout) return;
    
//     // 显示加载提示
//     document.getElementById('lazyLoadInfo').style.display = 'flex';
    
//     // 模拟延迟加载
//     lazyLoadTimeout = setTimeout(() => {
//         const nextBatch = allGeoData.slice(loadedPoints, loadedPoints + LAZY_LOAD_BATCH_SIZE);
//         loadedPoints += nextBatch.length;
        
//         // 更新地图数据
//         if (nextBatch.length > 0) {
//             updateMapWithLazyData(nextBatch);
//         }
        
//         // 隐藏加载提示
//         document.getElementById('lazyLoadInfo').style.display = 'none';
        
//         // 重置超时标识
//         lazyLoadTimeout = null;
//     }, LAZY_LOAD_DELAY);
// }

// // 生成模拟数据
// function generateSimulatedData() {
//     // 模拟区域数据
//     regionData = [
//         {region: '浙江省', count: 69},
//         {region: '广东省', count: 64},
//         {region: '四川省', count: 64},
//         {region: '北京市', count: 62},
//         {region: '江苏省', count: 61},
//         {region: '山东省', count: 51},
//         {region: '湖南省', count: 42},
//         {region: '河北省', count: 40},
//         {region: '安徽省', count: 35},
//         {region: '云南省', count: 35},
//         {region: '福建省', count: 33},
//         {region: '辽宁省', count: 32},
//         {region: '河南省', count: 32},
//         {region: '山西省', count: 32},
//         {region: '江西省', count: 31},
//         {region: '上海市', count: 29},
//         {region: '重庆市', count: 26},
//         {region: '内蒙古自治区', count: 25},
//         {region: '广西壮族自治区', count: 25},
//         {region: '台湾省', count: 21},
//         {region: '陕西省', count: 18},
//         {region: '天津市', count: 15},
//         {region: '海南省', count: 13},
//         {region: '黑龙江省', count: 12},
//         {region: '甘肃省', count: 12},
//         {region: '贵州省', count: 11},
//         {region: '新疆维吾尔自治区', count: 10},
//         {region: '香港', count: 6},
//         {region: '澳门', count: 6},
//         {region: '西藏自治区', count: 5},
//         {region: '青海省', count: 4}
//     ];
    
//     // 模拟景区等级数据
//     const gradeData = [
//         {grade: '其他', count: 75023},
//         {grade: '4A', count: 1362},
//         {grade: '3A', count: 4057},
//         {grade: '5A', count: 468}
//     ];
    
//     // 生成模拟地图数据
//     allGeoData = [];
//     const provinces = Object.keys(provinceCenters);
    
//     provinces.forEach(province => {
//         const count = regionData.find(r => r.region === province)?.count || 10;
//         const center = provinceCenters[province];
        
//         for (let i = 0; i < count; i++) {
//             // 在省份中心点周围随机生成点
//             const lng = center[0] + (Math.random() - 0.5) * 5;
//             const lat = center[1] + (Math.random() - 0.5) * 3;
            
//             allGeoData.push({
//                 name: `${province}景区${i+1}`,
//                 lng: parseFloat(lng.toFixed(6)),
//                 lat: parseFloat(lat.toFixed(6))
//             });
//         }
//     });
    
//     geoData = allGeoData.slice(0, 1000);
//     loadedPoints = geoData.length;
// }

// // 加载外部数据
// function loadExternalData() {
//     updateDebugInfo("正在加载外部数据...");
    
//     // 模拟外部数据加载（在实际应用中替换为实际的数据加载逻辑）
//     setTimeout(() => {
//         // 检查是否已加载外部数据
//         if (typeof window.mapData !== 'undefined' && window.mapData.length > 0) {
//             updateDebugInfo("外部数据加载成功");
//             allGeoData = window.mapData;
//             geoData = allGeoData.slice(0, 1000);
//             loadedPoints = geoData.length;
//             updateAllCharts();
//         } else {
//             // 如果外部数据未加载成功，使用模拟数据
//             updateDebugInfo("外部数据未加载，使用模拟数据");
//             generateSimulatedData();
//             updateAllCharts();
//         }
//     }, 1000);
// }

// // 更新所有图表数据
// function updateAllCharts() {
//     // 更新各地区景区数量柱状图
//     updateBarChart1(regionData);
    
//     // 更新景区等级分布饼图
//     const gradeData = [
//         {grade: '其他', count: 935},
//         {grade: '4A', count: 41},
//         {grade: '3A', count: 20},
//         {grade: '5A', count: 4}
//     ];
//     updatePieChart(gradeData);
    
//     // 更新地图热力图
//     updateMapChart(geoData);
    
//     // 更新时间
//     updateTime();
// }


// 全局变量
const charts = {};
let regionData = [];
let geoData = [];
let allGeoData = [];
let selectedProvince = null;
let bmapInstance = null;
let lazyLoadTimeout = null;
let loadedPoints = 0;
const LAZY_LOAD_BATCH_SIZE = 200;
const LAZY_LOAD_DELAY = 500;

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

// 更新调试信息
function updateDebugInfo(message) {
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.textContent = `数据加载状态: ${message}`;
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
    }, LAZY_LOAD_DELAY);
}

// 使用真实数据替换模拟数据
function loadRealData() {
    // 真实地区数据
    regionData = [
        {region: '浙江省', count: 5010},
        {region: '广东省', count: 5008},
        {region: '四川省', count: 4106},
        {region: '北京市', count: 5009},
        {region: '江苏省', count: 5009},
        {region: '山东省', count: 5007},
        {region: '湖南省', count: 2316},
        {region: '河北省', count: 3390},
        {region: '安徽省', count: 2147},
        {region: '云南省', count: 2234},
        {region: '福建省', count: 2686},
        {region: '辽宁省', count: 2845},
        {region: '河南省', count: 2696},
        {region: '山西省', count: 2025},
        {region: '江西省', count: 1965},
        {region: '上海市', count: 3097},
        {region: '重庆市', count: 1828},
        {region: '内蒙古自治区', count: 1474},
        {region: '广西壮族自治区', count: 2014},
        {region: '台湾省', count: 1393},
        {region: '陕西省', count: 2225},
        {region: '天津市', count: 1436},
        {region: '海南省', count: 1547},
        {region: '黑龙江省', count: 1547},
        {region: '甘肃省', count: 921},
        {region: '贵州省', count: 1408},
        {region: '新疆维吾尔自治区', count: 1095},
        {region: '香港', count: 603},
        {region: '澳门', count: 388},
        {region: '西藏自治区', count: 510},
        {region: '青海省', count: 394}
    ];
    
    // 真实景区等级数据
    const gradeData = [
        {grade: '其他', count: 75023},
        {grade: '4A', count: 1362},
        {grade: '3A', count: 4057},
        {grade: '5A', count: 468}
    ];
    
    // 生成真实地图数据
    allGeoData = [];
    const provinces = Object.keys(provinceCenters);
    
    provinces.forEach(province => {
        const region = regionData.find(r => r.region === province);
        if (region) {
            const count = region.count;
            const center = provinceCenters[province];
            
            for (let i = 0; i < count; i++) {
                // 在省份中心点周围随机生成点
                const lng = center[0] + (Math.random() - 0.5) * 3;
                const lat = center[1] + (Math.random() - 0.5) * 2;
                
                allGeoData.push({
                    name: `${province}景区${i+1}`,
                    lng: parseFloat(lng.toFixed(6)),
                    lat: parseFloat(lat.toFixed(6))
                });
            }
        }
    });
    
    geoData = allGeoData.slice(0, 1000);
    loadedPoints = geoData.length;
    
    // 更新所有图表
    updateAllCharts(gradeData);
}

// 加载外部数据
function loadExternalData() {
    updateDebugInfo("正在加载数据...");
    
    // 直接使用真实数据
    setTimeout(() => {
        updateDebugInfo("真实数据加载成功");
        loadRealData();
    }, 1000);
}

// 更新所有图表数据
function updateAllCharts(gradeData) {
    // 更新各地区景区数量柱状图
    updateBarChart1(regionData);
    
    // 更新景区等级分布饼图
    updatePieChart(gradeData);
    
    // 更新地图热力图
    updateMapChart(geoData);
    
    // 更新时间
    updateTime();
}