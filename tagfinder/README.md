This script will feed random images into Clarifai, and write down unique tags.

Just set these two variables, then run it.
```
request_number = 10
output = "output1.txt"
```

The script will overwrite the output text file.  To append to a text file, just write to a new one.
Then, append them with `cat output2.txt >> output1.txt`, and sort/de-duplicate with `sort -u output1.txt > output100.txt`
