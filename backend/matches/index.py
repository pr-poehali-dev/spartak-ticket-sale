"""Управление матчами: получение, создание, обновление, удаление."""
import json
import os
import psycopg2

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    'Content-Type': 'application/json',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    match_id = params.get('id')

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute("SELECT id, opp, date, time, tour, home, status, price, tag FROM matches ORDER BY id")
            rows = cur.fetchall()
            matches = [
                {'id': r[0], 'opp': r[1], 'date': r[2], 'time': r[3],
                 'tour': r[4], 'home': r[5], 'status': r[6], 'price': r[7], 'tag': r[8]}
                for r in rows
            ]
            return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'matches': matches}, ensure_ascii=False)}

        body = json.loads(event.get('body') or '{}')

        if method == 'POST':
            cur.execute(
                "INSERT INTO matches (opp, date, time, tour, home, status, price, tag) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                (body['opp'], body['date'], body['time'], body['tour'],
                 body.get('home', True), body.get('status', 'В продаже'),
                 body.get('price', 1500), body.get('tag', ''))
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 201, 'headers': HEADERS, 'body': json.dumps({'id': new_id})}

        if method == 'PUT' and match_id:
            cur.execute(
                "UPDATE matches SET opp=%s, date=%s, time=%s, tour=%s, home=%s, status=%s, price=%s, tag=%s WHERE id=%s",
                (body['opp'], body['date'], body['time'], body['tour'],
                 body.get('home', True), body.get('status', 'В продаже'),
                 body.get('price', 1500), body.get('tag', ''), int(match_id))
            )
            conn.commit()
            return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True})}

        if method == 'DELETE' and match_id:
            cur.execute("DELETE FROM matches WHERE id=%s", (int(match_id),))
            conn.commit()
            return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True})}

        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Bad request'})}

    finally:
        cur.close()
        conn.close()
