import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''
    API управления секторами стадиона: чтение списка и обновление цен/мест/категорий.
    GET — публичный список секторов для страницы бронирования.
    PUT — обновление секторов (требует пароль админа в заголовке X-Admin-Password).
    '''
    method = event.get('httpMethod', 'GET')

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)

    if method == 'GET':
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id, label, tier, price, rows, seats FROM sectors ORDER BY sort_order ASC')
            rows = cur.fetchall()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'sectors': [dict(r) for r in rows]}, ensure_ascii=False),
        }

    if method == 'PUT':
        admin_pass = os.environ.get('ADMIN_PASSWORD', '')
        given = event.get('headers', {}).get('X-Admin-Password') or event.get('headers', {}).get('x-admin-password', '')
        if not admin_pass or given != admin_pass:
            conn.close()
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверный пароль'}, ensure_ascii=False),
            }

        body = json.loads(event.get('body') or '{}')
        sectors = body.get('sectors', [])
        allowed_tiers = {'platinum', 'bronze', 'standard', 'vip', 'corner', 'press'}

        with conn.cursor() as cur:
            for s in sectors:
                sid = str(s.get('id', ''))[:20]
                tier = str(s.get('tier', 'standard'))
                if tier not in allowed_tiers:
                    tier = 'standard'
                price = int(s.get('price', 0))
                rows_n = max(1, int(s.get('rows', 1)))
                seats_n = max(1, int(s.get('seats', 1)))
                label = str(s.get('label', sid))[:50]
                cur.execute(
                    "UPDATE sectors SET label=%s, tier=%s, price=%s, rows=%s, seats=%s, updated_at=CURRENT_TIMESTAMP WHERE id=%s",
                    (label, tier, price, rows_n, seats_n, sid),
                )
            conn.commit()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'updated': len(sectors)}, ensure_ascii=False),
        }

    conn.close()
    return {
        'statusCode': 405,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'}),
    }
