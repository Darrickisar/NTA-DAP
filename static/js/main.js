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

// 新增：景区等级数据变量
let provinceGradeData = {}; // 各省份的等级数据
let nationalGradeData = []; // 全国的等级数据
let provinceTotalSpots = {}; // 省份总景区数

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
    '北京市': [116.40, 39.90],
    '天津市': [117.20, 39.12],
    '河北省': [114.48, 38.03],
    '山西省': [112.53, 37.87],
    '内蒙古自治区': [111.65, 40.82],
    '辽宁省': [123.43, 41.80],
    '吉林省': [125.32, 43.88],
    '黑龙江省': [126.53, 45.80],
    '上海市': [121.47, 31.23],
    '江苏省': [118.78, 32.04],
    '浙江省': [120.15, 30.25],
    '安徽省': [117.27, 31.86],
    '福建省': [119.30, 26.08],
    '江西省': [115.89, 28.68],
    '山东省': [117.00, 36.65],
    '河南省': [113.65, 34.76],
    '湖北省': [114.30, 30.60],
    '湖南省': [112.97, 28.19],
    '广东省': [113.23, 23.16],
    '重庆市': [106.50, 29.53],
    '四川省': [104.06, 30.67],
    '贵州省': [106.71, 26.57],
    '云南省': [102.71, 25.04],
    '西藏自治区': [91.11, 29.97],
    '陕西省': [108.93, 34.27],
    '甘肃省': [103.82, 36.06],
    '青海省': [101.74, 36.62],
    '宁夏回族自治区': [106.27, 38.47],
    '新疆维吾尔自治区': [87.62, 43.82],
    '台湾省': [121.50, 25.03],
    '香港': [114.17, 22.28],
    '澳门': [113.54, 22.19]
};

// 更新数据加载状态
function updateDataStatus(message, isSuccess = false) {
    const statusElement = document.getElementById('dataStatus');
    statusElement.textContent = `数据加载状态: ${message}`;
    statusElement.className = isSuccess ? 'data-status success' : 'data-status';
}

// 修改后的初始化函数
async function init() {
    updateDataStatus("正在初始化平台...");
    
    // 1. 初始化粒子背景
    initParticles();
    
    // 2. 初始化图表容器
    initCharts();
    
    // 3. 设置事件监听器
    setupEventListeners();
    
    // 4. 获取数据
    await fetchData();
    
    // 5. 更新图表
    await updateAllCharts();
    
    updateDataStatus("初始化完成", true);
}

// 设置事件监听器
function setupEventListeners() {
    // 设置筛选按钮事件
    document.getElementById('applyFilter').addEventListener('click', async function() {
        simulateLoading();
        setTimeout(async () => {
            await updateAllCharts();
        }, 1500);
    });

    document.getElementById('resetFilter').addEventListener('click', function() {
        document.getElementById('regionFilter').value = 'all';
        document.getElementById('categoryFilter').value = 'all';
        clearProvinceSelection();
        clearRegionSelection();
        simulateLoading();
        setTimeout(async () => {
            await updateAllCharts();
        }, 1500);
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
}

// 修改后的数据获取函数
async function fetchData() {
    updateDataStatus("正在从数据库加载数据...");
    try {
        // 1. 获取大区数据
        const regionResponse = await fetch('/api/regions');
        if (!regionResponse.ok) {
            throw new Error('获取大区数据失败');
        }
        regionData = (await regionResponse.json()).filter(item => item.region && item.code);

        // 2. 获取景点地理数据
        const geoResponse = await fetch('/api/spots');
        if (!geoResponse.ok) throw new Error('获取景点数据失败');
        
        const rawGeoData = await geoResponse.json();
        allGeoData = rawGeoData.map(item => ({
            name: item.name,
            lng: parseFloat(item.lng) || 0,
            lat: parseFloat(item.lat) || 0,
            province: item.province,
            price: item.price,
            rating: parseFloat(item.rating) || 0
        })).filter(item => item.lng !== 0 && item.lat !== 0);

        // 3. 获取省份统计数据
        const provinceResponse = await fetch('/api/province-stats');
        if (!provinceResponse.ok) {
            throw new Error('获取省份数据失败');
        }

        const provinceStats = await provinceResponse.json();
        provinceStats.forEach(stat => {
            provinceTotalSpots[stat.province] = stat.count;
        });

        // 4. 新增：获取景区等级数据
        try {
            const gradeResponse = await fetch('/api/grade-stats');
            if (gradeResponse.ok) {
                const gradeStats = await gradeResponse.json();
                nationalGradeData = gradeStats.national || [];
                provinceGradeData = gradeStats.provinces || {};
            } else {
                // 如果没有等级数据API，创建默认数据
                nationalGradeData = [
                    { grade: '5A', count: 468 },
                    { grade: '4A', count: 1362 },
                    { grade: '3A', count: 4057 },
                    { grade: '其他', count: 75023 }
                ];
                provinceGradeData = {};
            }
        } catch (error) {
            console.warn('获取等级数据失败，使用默认数据:', error);
            nationalGradeData = [
                { grade: '5A', count: 300 },
                { grade: '4A', count: 1200 },
                { grade: '3A', count: 2000 },
                { grade: '2A', count: 1500 },
                { grade: '其他', count: 1000 }
            ];
            provinceGradeData = {};
        }

        // 初始化展示前200条
        geoData = allGeoData.slice(0, 200);
        loadedPoints = geoData.length;
        updateDataStatus(`已加载 ${loadedPoints} 个景区数据点`, true);

        // 5. 更新统计信息
        updateStatistics();
    } catch (error) {
        console.error('Error fetching data:', error);
        updateDataStatus("数据加载失败: " + error.message, false);
    }
}

// 更新统计数据
function updateStatistics() {
    // 更新景区总数
    document.getElementById('totalSpots').textContent = allGeoData.length.toLocaleString(); [1]

    // 计算平均票价（保持不变）
    let totalPrice = 0;
    let pricedSpots = 0;
    allGeoData.forEach(spot => {
        if (spot.price && spot.price !== '免费') {
            const priceStr = spot.price.replace('¥', '');
            const priceNum = parseFloat(priceStr);
            if (!isNaN(priceNum)) {
                totalPrice += priceNum;
                pricedSpots++;
            }
        }
    });
    const avgPrice = pricedSpots > 0 ? totalPrice / pricedSpots : 0;
    document.getElementById('avgPrice').textContent = `¥${avgPrice.toFixed(2)}`; [2]

    // 过滤掉评分为 0 的景区
    const validRatings = allGeoData
        .map(spot => spot.rating || 0)
        .filter(r => r > 0); [1]

    // 计算平均评分
    const totalRating = validRatings.reduce((sum, r) => sum + r, 0); [2]
    const avgRating = validRatings.length > 0
        ? totalRating / validRatings.length
        : 0;
    document.getElementById('avgRating').textContent = avgRating.toFixed(2); [2]
}


// 初始化图表
function initCharts() {
    // 初始化图表实例
    charts.regionBarChart = echarts.init(document.getElementById('regionBarChart'));
    charts.mapChart = echarts.init(document.getElementById('mapChart'));
    charts.provinceBarChart = echarts.init(document.getElementById('provinceBarChart'));
    charts.gradePieChart = echarts.init(document.getElementById('gradePieChart'));
    updateDataStatus("图表初始化完成", true);
}

// 修改后的图表更新函数
async function updateAllCharts() {
    try {
        // 验证数据是否已加载
        if (!regionData.length || !allGeoData.length) {
            updateDataStatus("数据未完全加载，等待中...", false);
            return;
        }

        updateRegionBarChart();
        updateMapChart(geoData);
        updateTime();
        
        // 确保在有选中大区时更新省份图表
        if (selectedRegion && regionMapping[selectedRegion]) {
            updateProvinceBarChart(selectedRegion);
        }
        
        // 确保在有数据时才更新等级饼图
        if (nationalGradeData.length > 0) {
            updateGradePieChart(selectedProvince || null);
        }

        updateDataStatus("图表更新完成", true);
    } catch (error) {
        console.error('图表更新错误:', error);
        updateDataStatus(`图表错误: ${error.message}`, false);
    }
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

// 清除省份选择
function clearProvinceSelection() {
    selectedProvince = null;
    const provinceInfo = document.getElementById('provinceInfo');
    if (provinceInfo) {
        provinceInfo.style.display = 'none';
    }
}

// 清除大区选择
function clearRegionSelection() {
    selectedRegion = null;
    clearProvinceSelection();
}

// 模拟加载效果
function simulateLoading() {
    updateDataStatus("正在更新图表...");
}

// 懒加载处理函数
function handleScroll() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollPosition >= documentHeight - 1000 && loadedPoints < allGeoData.length) {
        loadMoreData();
    }
}

// 加载更多数据
function loadMoreData() {
    if (lazyLoadTimeout) return;
    
    lazyLoadTimeout = setTimeout(() => {
        const nextBatch = allGeoData.slice(loadedPoints, loadedPoints + LAZY_LOAD_BATCH_SIZE);
        geoData = [...geoData, ...nextBatch];
        loadedPoints += nextBatch.length;
        
        updateMapChart(geoData);
        updateDataStatus(`已加载 ${loadedPoints}/${allGeoData.length} 个景区数据点`, true);
        
        lazyLoadTimeout = null;
    }, LAZY_LOAD_DELAY);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);