// main.js

import { geoData } from './map_j.js';

// 全局变量
const charts = {};
let regionData = [];
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