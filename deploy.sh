cd ./html
s3cmd sync . s3://www.veganfact.com --delete-removed --acl-public --skip-existing