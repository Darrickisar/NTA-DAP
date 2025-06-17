from flask import Flask, jsonify, make_response, send_from_directory
from flask_cors import CORS
import mysql.connector
import json
from decimal import Decimal

app = Flask(__name__, static_folder='static', static_url_path='')

app.config['JSON_AS_ASCII'] = False
app.config['JSONIFY_MIMETYPE'] = 'application/json; charset=utf-8'
CORS(app)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "tickets",
    "charset": "utf8mb4"
}
PROVINCES = [ '北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省',
    '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省',
    '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省',
    '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省',
    '香港', '澳门']


@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route(r'/static/index.html')
def catch_all(path):
    return send_from_directory(app.static_folder, 'index.html')

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)


def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


@app.route('/api/regions', methods=['GET'])
def get_regions():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
                       SELECT CASE
                                  WHEN 地区 IN
                                       ('北京市', '天津市', '河北省', '上海市', '江苏省', '浙江省', '福建省', '山东省',
                                        '广东省', '海南省', '台湾省', '香港', '澳门') THEN '东部地区'
                                  WHEN 地区 IN ('山西省', '安徽省', '江西省', '河南省', '湖北省', '湖南省') THEN '中部地区'
                                  WHEN 地区 IN
                                       ('内蒙古自治区', '广西壮族自治区', '重庆市', '四川省', '贵州省', '云南省',
                                        '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区',
                                        '新疆维吾尔自治区') THEN '西部地区'
                                  WHEN 地区 IN ('辽宁省', '吉林省', '黑龙江省') THEN '东北地区'
                                  END AS region_name,
                              COUNT(*) as count,
            CASE
                WHEN 地区 IN ('北京市','天津市','河北省','上海市','江苏省','浙江省','福建省','山东省','广东省','海南省','台湾省','香港','澳门') THEN 'east'
                WHEN 地区 IN ('山西省','安徽省','江西省','河南省','湖北省','湖南省') THEN 'central'
                WHEN 地区 IN ('内蒙古自治区','广西壮族自治区','重庆市','四川省','贵州省','云南省','西藏自治区','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区') THEN 'west'
                WHEN 地区 IN ('辽宁省','吉林省','黑龙江省') THEN 'northeast'
                       END
                       AS code
            FROM tickets
            GROUP BY region_name, code
                       """)

        regions = cursor.fetchall()
        cursor.close()
        conn.close()

        formatted = []
        for r in regions:
            formatted.append({
                "region": r["region_name"],
                "count": int(r["count"]),
                "code": r["code"]
            })

        # 使用自定义编码器
        response = make_response(json.dumps(formatted, cls=DecimalEncoder, ensure_ascii=False))
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response
    except Exception as e:
        error_resp = make_response(json.dumps({"error": str(e)}, ensure_ascii=False))
        error_resp.headers['Content-Type'] = 'application/json; charset=utf-8'
        return error_resp, 500


@app.route('/api/spots', methods=['GET'])
def get_spots():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
                       SELECT 景点名称 as name,
                              经度     as lng,
                              纬度     as lat,
                              地区     as province,
                              门票     as price,
                              景区评分 as rating
                       FROM tickets
                       """)

        spots = cursor.fetchall()

        for spot in spots:
            spot['lng'] = float(spot['lng']) if isinstance(spot['lng'], Decimal) else spot['lng']
            spot['lat'] = float(spot['lat']) if isinstance(spot['lat'], Decimal) else spot['lat']
            spot['rating'] = float(spot['rating']) if isinstance(spot['rating'], Decimal) else spot['rating']

            price = spot['price']
            if price == 0 or price is None:
                spot['price'] = "免费"
            elif isinstance(price, (int, float, Decimal)):
                price_val = float(price)
                spot['price'] = f"¥{int(price_val)}" if price_val.is_integer() else f"¥{price_val:.2f}"

        cursor.close()
        conn.close()

        response = make_response(json.dumps(spots, cls=DecimalEncoder, ensure_ascii=False))
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response
    except Exception as e:
        error_resp = make_response(json.dumps({"error": str(e)}, ensure_ascii=False))
        error_resp.headers['Content-Type'] = 'application/json; charset=utf-8'
        return error_resp, 500


@app.route('/api/province-stats', methods=['GET'])
def get_province_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        placeholders = ', '.join(['%s'] * len(PROVINCES))
        query = f"""
            SELECT 地区 as province, COUNT(*) as count
            FROM tickets
            WHERE 地区 IN ({placeholders})
            GROUP BY 地区
            ORDER BY count DESC
        """
        cursor.execute(query, PROVINCES)

        stats = cursor.fetchall()
        cursor.close()
        conn.close()

        response = make_response(json.dumps(stats, ensure_ascii=False))
        response.headers['Content-Type'] = 'application/json; charset=utf-8'
        return response

    except Exception as e:
        error_resp = make_response(json.dumps({"error": str(e)}, ensure_ascii=False))
        error_resp.headers['Content-Type'] = 'application/json; charset=utf-8'
        return error_resp, 500


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)