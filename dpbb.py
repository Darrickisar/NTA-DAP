import pandas as pd
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from mysql.connector.pooling import MySQLConnectionPool
import logging

# 初始化日志
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

# 数据库连接池配置
dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": "123456",  # 生产环境建议使用环境变量
    "database": "tickets"
}

try:
    cnxpool = MySQLConnectionPool(pool_size=5, pool_name="mypool", **dbconfig)
    logging.info("数据库连接池创建成功")
except Exception as e:
    logging.error(f"数据库连接失败: {e}")

def load_data():
    """加载并预处理数据"""
    try:
        conn = cnxpool.get_connection()
        query = "SELECT * FROM tickets"
        df = pd.read_sql(query, conn)
        numeric_cols = ['门票', '景区评分', '经度', '纬度']
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        logging.info("景区数据加载成功")
        return df
    except Exception as e:
        logging.error(f"加载数据失败: {e}")
        return pd.DataFrame()

df = load_data()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/regions')
def get_regions():
    region_counts = df['所属省份'].value_counts().to_dict()
    return jsonify(region_counts)

@app.route('/api/ticket-price-range')
def get_ticket_price_range():
    price_bins = [0, 50, 100, 200, float('inf')]
    labels = ['0-50', '50-100', '100-200', '200+']
    df['价格区间'] = pd.cut(df['门票'], bins=price_bins, labels=labels, include_lowest=True)
    price_distribution = df['价格区间'].value_counts().reindex(labels, fill_value=0).to_dict()
    return jsonify(price_distribution)

@app.route('/api/highest-rated')
def get_highest_rated():
    top_5 = df.sort_values(by='景区评分', ascending=False).head(5)
    result = top_5[['景区名称', '景区评分']].to_dict(orient='records')
    return jsonify(result)

@app.route('/api/map-data')
def get_map_data():
    map_data = df[['景区名称', '经度', '纬度', '景区评分']].dropna().to_dict(orient='records')
    return jsonify(map_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)