(function() {
    // Loader script for Featured Product Selector v2
    // This script loads the main functionality from GitHub

    console.log('Featured Product Selector v2 - Loader starting...');

    // Check if jQuery is available, load if needed
    if (typeof jQuery === 'undefined') {
        console.log('Loading jQuery...');
        var jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
        jqueryScript.onload = function() {
            console.log('jQuery loaded, loading main script...');
            loadMainScript();
        };
        jqueryScript.onerror = function() {
            console.error('Failed to load jQuery');
            alert('Failed to load jQuery. Please check your internet connection.');
        };
        document.head.appendChild(jqueryScript);
    } else {
        console.log('jQuery already available, loading main script...');
        loadMainScript();
    }

    function loadMainScript() {
        // Load the main Featured Product Selector script
        var mainScript = document.createElement('script');

        // Use cache-busting to ensure we always get the latest version
        var timestamp = Date.now();
        mainScript.src = 'https://apclark31.github.io/featuredProductSelector/featuredProductSelector-v2.js?t=' + timestamp;

        mainScript.onload = function() {
            console.log('Featured Product Selector v2 loaded successfully!');
        };

        mainScript.onerror = function() {
            console.error('Failed to load Featured Product Selector main script');

            // Fallback: try to load from raw GitHub content
            console.log('Trying fallback URL...');
            var fallbackScript = document.createElement('script');
            fallbackScript.src = 'https://raw.githubusercontent.com/apclark31/featuredProductSelector/main/featuredProductSelector-v2.js?t=' + timestamp;

            fallbackScript.onload = function() {
                console.log('Featured Product Selector v2 loaded successfully via fallback!');
            };

            fallbackScript.onerror = function() {
                console.error('All loading attempts failed');
                alert('Failed to load Featured Product Selector. Please check:\n1. Your internet connection\n2. That the GitHub repository is accessible\n3. Try again in a few moments');
            };

            document.head.appendChild(fallbackScript);
        };

        document.head.appendChild(mainScript);
    }
})();
