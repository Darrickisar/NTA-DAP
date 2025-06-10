全国景区数据分析平台 - 多文件拆分方案
一、项目背景

本项目旨在将原来的单一 HTML 文件拆分为多个文件，同时保持所有功能不变。通过这种拆分，提高代码的可维护性和可扩展性，方便后续的开发和维护工作。该平台实时监测全国景区数据，提供多维度可视化分析，助力旅游决策与管理。

二、项目结构
项目结构：
├── index.html
├── css/
│   ├── styles.css
│   └── particles.css
├── js/
│   ├── main.js
│   ├── particles-config.js
│   ├── chart-region-bar.js
│   ├── chart-map.js
│   ├── chart-province-bar.js
│   └── chart-grade-pie.js
└── assets/
    └── logo.png

三、文件功能
1. index.html
功能：作为项目的主页面，包含了整个平台的 HTML 结构。它引入了各种外部资源，如 CSS 样式表、JavaScript 库和 API，同时定义了页面的布局和元素，包括头部信息、数据筛选控件、统计信息、图表展示区域和页脚等。
代码片段：
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>全国景区数据分析平台</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
    <link rel="stylesheet" href="css/styles.css"/>
    <link rel="stylesheet" href="css/particles.css"/>
    <script src="https://api.map.baidu.com/api?v=3.0&ak=shMcR5luvatxcVQubIIpSkTT8iugO89x"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/extension/bmap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
2. css 文件夹
styles.css
功能：定义了整个平台的主样式，包括页面的背景、字体、布局、控件样式、图表容器样式等。通过媒体查询，实现了不同屏幕尺寸下的响应式布局。
代码片段：
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

body {
    background: linear-gradient(135deg, #0d1b3a, #152642);
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
}
particles.css
功能：专门用于设置粒子背景的样式，将粒子背景固定在页面的底层。
代码片段：
#particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
3. js 文件夹
main.js
功能：是整个项目的核心逻辑文件，负责初始化平台，包括初始化粒子背景、图表，设置筛选按钮事件，处理窗口大小变化和滚动事件，生成模拟数据，更新所有图表数据和时间等。
代码片段：
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
    // 其他逻辑...
}
particles-config.js
功能：用于初始化粒子背景，配置粒子的数量、颜色、形状、运动等属性。
代码片段：
// 初始化粒子背景
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 120 },
            color: { value: ["#40e0d0", "#a0d2ff", "#ff9a76"] },
            shape: { type: "circle" },
            // 其他属性...
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            // 其他属性...
        },
        retina_detect: true
    });
}
chart-region-bar.js
功能：负责更新大区景区数量的柱状图，包括设置图表的选项、添加点击事件等。
代码片段：
// 更新大区柱状图
function updateRegionBarChart() {
    const regions = regionData.map(item => item.region);
    const counts = regionData.map(item => item.count);
    // 设置图表选项
    charts.regionBarChart.setOption({
        tooltip: { 
            trigger: 'axis',
            formatter: '{b}: {c} 个景区'
        },
        // 其他选项...
    });
    // 添加柱状图点击事件
    charts.regionBarChart.off('click');
    charts.regionBarChart.on('click', function(params) {
        selectedRegion = regionData[params.dataIndex].code;
        // 其他逻辑...
    });
}
chart-map.js
功能：更新地图热力图，将景区数据转换为适合地图展示的格式，并设置地图的样式和交互效果。
代码片段：
// 更新地图热力图
function updateMapChart(data) {
    // 转换数据格式
    const mapData = data.map(item => ({
        name: item.name,
        value: [item.lng, item.lat, 1],
        province: item.province
    }));
    charts.mapChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return `${params.data.name}<br>${params.data.province}`;
            }
        },
        // 其他选项...
    });
    // 获取百度地图实例
    setTimeout(() => {
        if (charts.mapChart) {
            const bmap = charts.mapChart.getModel().getComponent('bmap');
            if (bmap) {
                bmapInstance = bmap.getBMap();
                // 移动地图到指定位置...
            }
        }
    }, 500);
}
chart-province-bar.js
功能：更新省份景区数量的柱状图，根据选中的大区筛选省份数据，并添加点击事件。
代码片段：
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
    // 设置图表选项
    charts.provinceBarChart.setOption({
        tooltip: { 
            trigger: 'axis',
            formatter: '{b}: {c} 个景区'
        },
        // 其他选项...
    });
    // 添加柱状图点击事件
    charts.provinceBarChart.off('click');
    charts.provinceBarChart.on('click', function(params) {
        selectedProvince = provinces[params.dataIndex];
        // 其他逻辑...
    });
}
chart-grade-pie.js
功能：更新景区等级分布的饼图，根据选中的省份获取相应的等级分布数据。
代码片段：
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
        // 其他选项...
    });
}
4. assets 文件夹
logo.png：项目的 logo 图片，用于在页面中展示。
四、使用方法
1. 打开项目

将项目文件下载到本地，确保所有文件的目录结构保持不变。

2. 运行项目

在浏览器中打开 index.html 文件，即可看到全国景区数据分析平台的界面。

3. 数据筛选
在页面的筛选区域，可以选择区域范围和景区类型进行数据筛选。
点击“应用筛选”按钮，平台会模拟加载效果，并更新所有图表数据。
点击“重置”按钮，可以恢复默认的筛选条件。
4. 图表交互
点击大区柱状图的柱子，可以选中相应的大区，同时更新省份柱状图和地图的显示。
点击省份柱状图的柱子，可以选中相应的省份，同时更新景区等级分布饼图和地图的显示。
五、安装依赖

本项目使用了一些外部的 JavaScript 库和 API，这些依赖通过 CDN 引入，无需额外安装。具体依赖如下：

Font Awesome：用于显示图标，引入地址：https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css
百度地图 API：用于展示地图，引入地址：https://api.map.baidu.com/api?v=3.0&ak= 自己的ak
ECharts：用于绘制图表，引入地址：https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js 和 https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/extension/bmap.min.js
Particles.js：用于创建粒子背景，引入地址：https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js
六、注意事项
请确保网络连接正常，以便正确加载外部资源。
建议使用 Chrome 浏览器获得最佳体验。
百度地图 API 的 ak 可能需要根据实际情况进行替换。
