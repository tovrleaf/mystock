import json


def handler(event, context):
    body = {
        "message": "Returning a list of shares.",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response
