# Manifest Manager
## Description

## Installation
Install with npm on your console:
```
npm install --save manifest-manager
```

## How to use

#### Require the module in node and create a new manifest object
```
var Manifest = require("manifest-manager");
var manifest = new Manifest();
```

#### Add resources to manifest

```
manifest.cache("/path/to/cached/resource");
manifest.network("/path/to/only/online/resource");
manifest.fallback("/path/to/original/resource", "/path/to/fallback/resource");
manifest.fallback("*.html", "/offlineFallback.html");
```

#### Remove resources from manifest (in this case all above defined resources)

```
manifest.removeCache("/path/to/cached/resource");
manifest.removeNetwork("/path/to/only/online/resource");
manifest.removeFallback("/path/to/original/resource");
manifest.removeFallback("*.html");
```

## Persistent Mode
If you want to save all manifested routes, to prevent loosing routes on kill or term signal, use the persistent mode the following way:

```
var Manifest = require("manifest-manager");
var manifest = new Manifest({persistent: true});
```

The data will be saved and restored from ``._storedData.json`` in the module folder