# node-inline-svg
Replace img tag SVGs with inline SVGs, for use with Express

# Example Usage

```$xslt
inlineSVG ( request , html , function ( parsedHtml ) {
    res.send ( parsedHtml );
} );
```

# Parameters

1. request - Node request object
2. html - The html containg ``<img>`` tags
3. callback, with the parsed HTML with inline SVG as the single parameter