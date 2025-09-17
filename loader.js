(function() {
    console.log('Featured Product Selector v2 - Loader starting...');

    function loadScript(src, callback, errorCallback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = errorCallback;
        document.head.appendChild(script);
    }

    function loadMainScript() {
        var timestamp = Date.now();
        var mainUrl = 'https://apclark31.github.io/featuredProductSelector/featuredProductSelector-v2.js?t=' + timestamp;

        console.log('Loading main script from:', mainUrl);

        loadScript(mainUrl,
            function() {
                console.log('Featured Product Selector v2 loaded successfully!');
            },
            function() {
                console.error('Failed to load from GitHub Pages, trying raw GitHub...');
                var fallbackUrl = 'https://raw.githubusercontent.com/apclark31/featuredProductSelector/main/featuredProductSelector-v2.js?t=' + timestamp;

                loadScript(fallbackUrl,
                    function() {
                        console.log('Featured Product Selector v2 loaded from raw GitHub!');
                    },
                    function() {
                        console.error('All loading attempts failed');
                        alert('Could not load Featured Product Selector. Please check your internet connection and try again.');
                    }
                );
            }
        );
    }

    // Check for jQuery and load if needed
    if (typeof jQuery === 'undefined') {
        console.log('Loading jQuery...');
        loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
            function() {
                console.log('jQuery loaded successfully');
                loadMainScript();
            },
            function() {
                console.error('Failed to load jQuery');
                alert('Failed to load jQuery. Please check your internet connection.');
            }
        );
    } else {
        console.log('jQuery already available');
        loadMainScript();
    }
})();
