# upftp

Fast Update Remote Files

## Installation

```sh
npm install upftp
```


## Usage
Local Root Path create upftp.json
- main: section
- ftpData: ftp account
- files: uploaded files
```json
{
    "main":{
        "dir":"",
        "ftpData":{
            "host":"ftp.host",
            "port":"21",
            "user":"ftp.username",
            "pass":"ftp.password"
        },
        "files":[
            "controllers",
            "models",
            "views",
            "static",
            "system/staticpages",
            "system/helper",
            "system/class.php"
        ]
    }
}
```

License
----

MIT