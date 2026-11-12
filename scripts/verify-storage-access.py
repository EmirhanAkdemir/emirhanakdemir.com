"""Live Storage regression against disposable fixtures; never prints credentials.

Usage: python3 scripts/verify-storage-access.py /tmp/.../state.json
State contains url and disposable users with email/password/role.
Fixtures must exist before running. Only test-run objects are created/removed.
"""
import base64
import json
import sys
from pathlib import Path
from urllib.parse import quote

import requests

state = json.loads(Path(sys.argv[1]).read_text())
url = state["url"]
import os
key = os.environ["SUPABASE_PUBLISHABLE_KEY"]
headers = {"apikey": key}
sessions = {}
for user in state["users"]:
    response = requests.post(url + "/auth/v1/token?grant_type=password", headers=headers,
                             json={"email": user["email"], "password": user["password"]}, timeout=30)
    response.raise_for_status()
    sessions[user["role"]] = {**headers, "Authorization": "Bearer " + response.json()["access_token"]}

prefix = "storage-check-" + state["run"][:8]
paths = {
    "published": prefix + "-public/published.png",
    "unpublished": prefix + "-public/unpublished.png",
    "draft": prefix + "-draft/draft.png",
    "unregistered": prefix + "-public/unregistered.png",
    "collision": prefix + "-public/name-collision.png",
}
image = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII=")
root = url + "/storage/v1"
created = []
checks = []

def check(label, condition):
    assert condition, label
    checks.append(label)
    print("PASS:", label)

try:
    for label, path in paths.items():
        response = requests.post(root + "/object/project-images/" + quote(path),
                                 headers={**sessions["admin"], "Content-Type": "image/png"}, data=image, timeout=30)
        check("admin upload " + label, response.status_code == 200)
        created.append(path)

    # Exact original-policy counterexample: one published path matches the project name,
    # but the object below is neither registered nor in any project folder.
    orphan = prefix + "-unregistered-outside.png"
    service = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    response = requests.post(root + "/object/project-images/" + quote(orphan),
                             headers={"apikey": service, "Authorization": "Bearer " + service,
                                      "Content-Type": "image/png"}, data=image, timeout=30)
    check("create isolated outside-folder object", response.status_code == 200)
    created.append(orphan)
    paths["outside-folder"] = orphan

    for audience, auth in [("anonymous", headers), ("member", sessions["member"]), ("admin", sessions["admin"])]:
        for label, path in paths.items():
            allowed = audience == "admin" or label in ("published", "collision")
            response = requests.get(root + "/object/project-images/" + quote(path), headers=auth, timeout=30)
            check(audience + " download " + label, (response.status_code == 200 and response.content == image)
                  if allowed else response.status_code in (400, 401, 403, 404))
            response = requests.post(root + "/object/sign/project-images/" + quote(path),
                                     headers=auth, json={"expiresIn": 30}, timeout=30)
            check(audience + " sign " + label, response.status_code == 200 if allowed
                  else response.status_code in (400, 401, 403, 404))
            if allowed:
                signed = response.json()["signedURL"]
                response = requests.get(root + signed, timeout=30)
                check(audience + " signed download " + label, response.status_code == 200 and response.content == image)
            response = requests.get(root + "/object/public/project-images/" + quote(path), timeout=30)
            check("private bucket public-URL denial " + audience + " " + label, response.status_code != 200)

        response = requests.post(root + "/object/list/project-images", headers=auth,
                                 json={"prefix": prefix + "-public", "limit": 100}, timeout=30)
        response.raise_for_status()
        names = {row["name"] for row in response.json() if row.get("id")}
        expected = {"published.png", "name-collision.png"} if audience != "admin" else {
            "published.png", "name-collision.png", "unpublished.png", "unregistered.png"}
        check(audience + " exact listing", names == expected)

    for audience in ["anonymous", "member"]:
        auth = headers if audience == "anonymous" else sessions[audience]
        response = requests.post(root + "/object/project-images/" + quote(prefix + "-public/denied-" + audience + ".png"),
                                 headers={**auth, "Content-Type": "image/png"}, data=image, timeout=30)
        check(audience + " cannot upload", response.status_code in (400, 401, 403))
        response = requests.put(root + "/object/project-images/" + quote(paths["published"]),
                                headers={**auth, "Content-Type": "image/png"}, data=image, timeout=30)
        check(audience + " cannot replace", response.status_code in (400, 401, 403, 404))
        response = requests.delete(root + "/object/project-images", headers=auth,
                                   json={"prefixes": [paths["published"]]}, timeout=30)
        response = requests.get(root + "/object/project-images/" + quote(paths["published"]), headers=headers, timeout=30)
        check(audience + " cannot delete published image", response.status_code == 200 and response.content == image)

    response = requests.put(root + "/object/project-images/" + quote(paths["unpublished"]),
                            headers={**sessions["admin"], "Content-Type": "image/png"}, data=image, timeout=30)
    check("admin can replace valid-folder image", response.status_code == 200)
    response = requests.post(root + "/object/project-images/" + quote(prefix + "-missing/no.png"),
                             headers={**sessions["admin"], "Content-Type": "image/png"}, data=image, timeout=30)
    check("admin upload requires existing project folder", response.status_code in (400, 401, 403))
finally:
    response = requests.delete(root + "/object/project-images", headers=sessions["admin"],
                               json={"prefixes": created}, timeout=30)
    response.raise_for_status()
    for path in created:
        response = requests.get(root + "/object/project-images/" + quote(path), headers=sessions["admin"], timeout=30)
        check("admin deletion verified " + path, response.status_code != 200)

print("Verified", len(checks), "live Storage checks.")