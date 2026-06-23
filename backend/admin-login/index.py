import json
import os

def handler(event: dict, context) -> dict:
    '''
    Проверка пароля для входа в админ-панель.
    POST с телом {"password": "..."} — возвращает {ok: true} при верном пароле.
    '''
    method = event.get('httpMethod', 'POST')
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    given = str(body.get('password', ''))
    admin_pass = os.environ.get('ADMIN_PASSWORD', '')

    ok = bool(admin_pass) and given == admin_pass
    return {
        'statusCode': 200 if ok else 401,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': ok}, ensure_ascii=False),
    }
