// 初始化函数
function init() {
    // 初始化粒子背景
    initParticles();
    
    // 初始化所有图表
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
    
    // 尝试加载外部数据
    loadExternalData();
    
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
    
    // 添加滚动事件监听器用于懒加载
    window.addEventListener('scroll', handleScroll);
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);