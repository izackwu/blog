from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.cdn.v20180606 import cdn_client, models
import json
import sys


def refresh_cdn(secret_id, secret_key, paths, flush_type="flush"):
    cred = credential.Credential(secret_id, secret_key)
    httpProfile = HttpProfile()
    httpProfile.endpoint = "cdn.tencentcloudapi.com"

    clientProfile = ClientProfile()
    clientProfile.httpProfile = httpProfile
    client = cdn_client.CdnClient(cred, "", clientProfile)

    req = models.PurgePathCacheRequest()
    params = {
        "Paths": paths,
        "FlushType": flush_type,
    }
    params = json.dumps(params)
    req.from_json_string(params)

    resp = client.PurgePathCache(req)
    return resp


if __name__ == '__main__':
    assert len(sys.argv) >= 1 + 3, "Not enough arguments"
    secret_id, secret_key = sys.argv[1:3]
    paths = sys.argv[3:]
    try:
        resp = refresh_cdn(secret_id, secret_key, paths)
        print("Success:", resp)
    except TencentCloudSDKException as err:
        print(err)
        exit(-1)
