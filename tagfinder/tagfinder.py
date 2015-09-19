#!/usr/bin/python3

from clarifai.client import ClarifaiApi
clarifai_api = ClarifaiApi()  # assumes environment variables are set.

tags = []

try:
    for i in range(10):
        print(i)
        result = clarifai_api.tag_image_urls('http://lorempixel.com/1280/1080/')
        tags.extend(result['results'][0]['result']['tag']['classes'])
except KeyboardInterrupt:
    pass

sorted_tags = sorted(set(tags))
output_file = open("output1.txt", 'w')
for tag in sorted_tags:
    output_file.write('%s\n' % tag)

output_file.close()
