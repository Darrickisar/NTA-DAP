# 全国景区数据可视化平台

## 项目概述  
全国景区数据可视化平台基于 Flask 后端和现代前端技术，实现全国 34 个省级行政区 8w余 个景区的多维度数据展示与互动分析.  

## 核心功能  
- 大区景区数量柱状图，支持点击切换省份数据.  
- 全国景区地理分布热力图，支持地图懒加载和智能定位.  
- 省份景区数量柱状图和景区等级分布饼图动态联动.  
- 自定义粒子背景动画和响应式界面设计.  
- 多维度筛选（区域范围、景区类型）及实时数据更新.  

## 技术架构  
- 后端：Flask 提供 RESTful API，连接 MySQL 数据库，返回 JSON 接口.  
- 前端：原生 JavaScript + ECharts 4.9.0 渲染交互式可视化组件.  
- 地图：百度地图 API (BMap) 实现景区点位展示与智能定位.  
- 动画：Particles.js 驱动炫酷粒子背景效果.  
- 样式：CSS3 响应式布局与渐变文本效果.  

## 环境与依赖  
- Python 3.8+，Flask 2.x，mysql-connector-python  
- MySQL 5.7+ 或以上数据库  
- 前端：ECharts 4.9.0，Particles.js，百度地图 API  
- 浏览器：Chrome 90+，Firefox 88+，Safari 14+  

## 安装与运行  

```bash
# 克隆仓库
git clone https://github.com/yourusername/tourism-dashboard.git  
cd tourism-dashboard  

# 后端依赖安装
pip install -r requirements.txt  

# 数据库配置
# 修改 server.py 中 DB_CONFIG 为实际 MySQL 连接信息

# 启动后端服务
python server.py  

# 访问前端页面
# 打开浏览器访问 http://127.0.0.1:5000/  
```

## 项目结构  

```
project-root/
├─ server.py                 # Flask 后端主程序
├─ static/                   
│  ├─ index.html             # 前端主页面
│  ├─ css/                   
│  │  ├─ particles.css       # 粒子背景样式定义
│  │  └─ styles.css          # 全局样式表
│  └─ js/                    
│     ├─ main.js             # 前端核心脚本
│     ├─ particles-config.js # 粒子动画参数配置
│     ├─ chart-map.js        # 地图渲染与懒加载功能
│     ├─ chart-region-bar.js # 大区柱状图渲染与事件联动
│     ├─ chart-province-bar.js # 省份柱状图渲染与点击交互
│     └─ chart-grade-pie.js  # 景区等级分布饼图渲染
└─ README.md                 # 项目说明文档  
```

## API 接口  

| 接口                   | 方法  | 说明                             |
|-----------------------|------|----------------------------------|
| `/api/regions`        | GET  | 返回大区名称、编码与景区数量     |
| `/api/spots`          | GET  | 返回景区名称、坐标、价格、评分   |
| `/api/province-stats` | GET  | 返回各省份景区数量统计           |
| `/api/grade-stats`    | GET  | 返回全国及各省份景区等级分布     |

所有接口均返回 JSON，字符编码 UTF-8.  

## 数据来源  
- 景区数据采集自去哪儿网和百度地图行政区划 API，通过 Python 分布式爬虫存入 MySQL.  
- 地理坐标、门票价格、评分等信息来源于官方开放 API 与第三方平台.  

## 自定义配置  
- **DB_CONFIG**：修改 `server.py` 中数据库连接信息.  
- **Particles**：可在 `particles-config.js` 中调整粒子数量、颜色与运动参数.  
- **懒加载**：可在 `main.js` 中修改 `LAZY_LOAD_BATCH_SIZE` 与 `LAZY_LOAD_DELAY`.  

## 许可证  
本项目基于 MIT 协议开源，见 [LICENSE](LICENSE).  
---
