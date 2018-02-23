#!/usr/bin/python3

import json

jsonData = """{
    "ISBN-13": "9781502395221",
    "Title": "Beginning Android Development",
    "Authors": [
        "PawPrints Learning Technologies"
    ],
    "Publisher": "CreateSpace",
    "Year": "2014",
    "Language": "en"
}"""


d = json.loads(jsonData)

print(d['Title'], d['Year'])

# s = '{
#     "ISBN-13": "9781502395221",
#     "Title": "Beginning Android Development",
#     "Authors": [
#         "PawPrints Learning Technologies"
#     ],
#     "Publisher": "CreateSpace",
#     "Year": "2014",
#     "Language": "en"
# }'

