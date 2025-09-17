(function() {
    // Configuration object for the Featured Product Selector
    const CONFIG = {
        gridSelector: ".row.product-grid",
        productSelector: ".col-6.col-lg-4.col-xl-3.js-grid-tile",
        productIdAttribute: "data-pid",
        pageSize: 72
    };

    // Global state variables
    let selectedProducts = [];
    let isSelecting = false;
    let arloActive = false;
    let arloContainer = null;
    let arlo = null;
    let arloStyles = null;

    // Arlo-related variables
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let direction = 'right';
    let lastPawPrintTime = 0;

    // Arlo messages
    const clickMessages = [
        "Nice choice! Beary good!",
        "That's paw-some!",
        "You've got great taste!",
        "I'm bear-y impressed!",
        "That's snow joke, great pick!",
        "Polar-izing selection!",
        "You're on the right track!",
        "I'd give that two paws up!",
        "That fits like the perfect pair of snow boots!",
        "Ice work picking that out!",
        "You're really stepping up your game!",
        "That's un-bear-ably good!",
        "Walking in the right direction!",
        "Bear necessities? Check!",
        "That's toe-tally awesome!",
        "Shoe-perb choice!",
        "That's a walk in the park!",
        "Treading on greatness!",
        "Putting your best paw forward!",
        "That's fur-tastic!"
    ];

    // SVG Assets
    const arloSVG = `
      <svg width="84" height="42" viewBox="0 0 84 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.10272 36.9932C1.10272 37.1414 2.35446 40.7577 4.05325 41.973H11.9511C11.9511 41.2171 11.8617 40.0018 11.4594 39.4238C10.8484 38.5346 9.11982 37.2896 9.11982 35.5112C9.11982 35.1851 9.31354 34.5923 9.49236 34.1032C9.01551 33.5696 8.47905 32.7841 7.94259 31.8801C6.69085 29.7904 5.46891 27.1226 5.14107 25.7591C5.12617 25.6998 5.11127 25.6406 5.08147 25.6257C4.12776 26.5446 1.44546 29.1975 1.25174 30.1609C1.14743 30.65 0 35.2592 0 36.8895C0 37.1414 1.11762 36.8302 1.11762 37.0081" fill="white" stroke="#222222" stroke-width="1.5"/>
        <path d="M56.3813 22.8965C53.2966 25.7865 48.3791 28.8544 44.8176 31.6111C44.445 32.278 43.6999 34.0417 44.0725 36.5167C44.1023 36.739 45.0709 36.4871 45.2199 36.6205C45.5477 36.9021 45.8011 38.6954 46.0097 38.7695C46.3375 38.8732 47.3061 38.6361 47.4254 38.8732C47.5148 39.0955 48.394 41.3631 49.0198 41.9856H59.7043C59.6 41.3928 58.7357 39.2586 57.7373 38.7843C57.0816 38.4731 52.9092 36.8873 52.9092 32.4559C52.9092 29.6251 55.7554 25.4457 55.9342 24.9417C56.0683 24.5564 56.3813 23.5041 56.3664 22.9113" fill="white" stroke="#222222" stroke-width="1.5"/>
        <path d="M76.562 8.75906C77.6051 8.56639 78.0223 9.85579 77.8286 10.1522C77.7094 10.3449 76.4576 10.3301 76.0255 9.60384C75.7871 9.18886 76.2937 8.80352 76.562 8.75906ZM3.7226 20.2896C3.78221 20.423 3.7375 20.5564 3.7375 20.838C3.7375 21.1047 3.76731 21.4901 3.94613 22.157C4.21436 23.1203 4.48259 23.9503 4.6167 23.9948C4.89983 24.0689 5.67472 23.1648 5.73433 23.3723C6.56882 26.2031 8.35702 30.0861 9.57896 31.8794C9.9664 32.4426 10.2942 32.7835 10.5178 32.8428C10.8009 32.9169 11.233 32.0424 11.3225 32.2203C12.7381 35.4957 15.1671 39.8381 17.3427 41.9575H26.5669C26.5371 41.5129 26.3433 39.6307 25.7771 39.023C25.1363 38.3264 22.5434 37.4668 22.5434 33.8654C22.5434 33.0947 22.7073 32.4278 22.9607 31.8646C23.5865 30.5011 24.7936 29.5822 25.6728 28.441C28.37 24.9433 27.759 24.3356 28.1166 24.0837C28.4594 23.8466 29.2343 24.4246 31.7079 21.5642C31.7079 21.5642 32.1699 21.8458 32.5573 22.0236C32.8256 22.1422 33.2875 22.3497 33.2279 22.4238C30.9778 25.0767 29.5472 25.2249 29.3386 25.3583C29.0405 25.551 29.6813 26.292 24.8979 31.7905C24.8681 31.8201 24.8681 31.8498 24.8979 31.8646C24.9575 31.8942 25.1214 31.8942 25.3598 31.8646C26.4327 31.746 28.9511 31.1384 29.2194 31.0346C29.2194 31.0346 32.1997 26.4402 32.304 26.3661C32.3487 26.3365 32.8703 26.4698 33.3322 26.5143C33.824 26.5439 34.3455 26.4106 34.4349 26.5291C34.5392 26.6625 32.1252 28.856 30.6648 31.8646C30.5605 32.0869 30.4562 32.3092 30.3668 32.5315C30.2327 32.8576 31.3652 32.4278 31.3354 32.6204C31.2609 33.0947 29.0256 36.1922 29.0256 37.8225C29.0256 38.0893 30.1433 37.7781 30.1433 37.9559C30.1433 38.1041 30.8287 40.7867 32.4828 41.9575H42.0497C42.0497 41.2165 41.7666 40.0753 41.3642 39.4973C40.947 38.8896 39.0992 38.282 39.0992 36.9629C39.0992 35.4216 40.6042 33.7024 42.7352 31.8646C46.9374 28.2928 53.6283 24.3653 56.3404 20.8231C56.6831 20.3785 56.9514 19.9487 57.1451 19.5189C57.1898 19.4152 57.6368 19.4152 58.0541 19.3707C58.5756 19.3114 59.1419 19.1484 59.1121 19.2077C58.9333 19.7264 58.6353 20.2748 58.2329 20.8231C58.0243 21.1195 57.771 21.4011 57.5176 21.7124C57.9051 21.4901 58.4266 21.164 58.978 20.8231C60.0211 20.1858 61.0642 19.5486 61.1089 19.6671C61.1685 19.8301 60.8854 20.5415 60.9003 20.8231C60.9003 20.8824 60.9152 20.9269 60.9599 20.9269C60.9897 20.9269 61.094 20.8972 61.2579 20.8231C62.4054 20.2748 66.3841 17.9035 66.5778 18.0368C66.7865 18.1702 66.4139 19.1632 66.7567 19.2818C66.861 19.3114 70.0052 17.0883 74.4608 17.2365C75.042 17.3254 76.2192 17.3106 79.3188 17.4144C80.2576 17.444 81.1815 17.1328 81.703 16.703C82.2544 16.2583 82.4332 15.9175 82.8505 15.4136C83.1634 15.0282 83.6999 14.3761 83.8936 14.1686C84.0277 14.0204 84.0426 13.8129 83.8936 13.6351C83.3124 12.9237 81.4199 10.8784 79.5423 9.78168C79.1847 9.55937 79.1549 8.46264 78.6482 7.97356C78.2906 7.63268 76.9792 6.81754 74.6098 5.91348C74.1926 5.76527 73.4773 5.61706 72.7024 5.51332C71.6593 4.0757 70.2287 4.38694 69.7966 5.02423C69.4241 5.5726 69.5582 6.26917 70.0201 6.81754C70.1691 6.98056 69.9903 7.06949 69.886 7.06949C68.6492 6.89164 68.5598 5.26136 68.4554 5.26136C62.6885 4.95012 54.8949 4.92049 52.0785 5.20208C51.0354 5.30583 49.9178 6.03204 48.1892 6.31364C46.9076 6.52113 35.0757 0 23.5418 0C19.8015 0 15.9867 0.904065 14.2581 1.73403C12.0377 2.80112 8.32722 5.97276 5.52571 9.81133C3.12654 13.1015 1.39794 16.866 1.8748 20.1858C1.9195 20.5267 3.55868 20.008 3.7077 20.3044" fill="white" stroke="#222222" stroke-width="1.5"/>
      </svg>
    `;

    const pawPrintSVG = `
      <svg width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path fill="white" stroke="#222222" stroke-width="3" d="M27.5,93.2c-5.9-6.1-5.7-15.8,0.2-21.5c2.6-2.5,5.9-3.8,9.5-3.8c3.9,0,7.7,1.5,10.5,4.3c5.7,5.9,5.1,15.5-0.9,21.1
        C40.9,98.6,33.2,99,27.5,93.2z"/>
        <path fill="white" stroke="#222222" stroke-width="3" d="M52.3,65.1c-5.8-6-5.7-15.6,0.1-21.4c5.8-5.7,15.4-5.7,21.1,0c5.8,6,5.7,15.6-0.1,21.4C67.4,70.9,58.1,71.1,52.3,65.1z"/>
        <path fill="white" stroke="#222222" stroke-width="3" d="M72.5,31c0,6.9-5.6,12.5-12.5,12.5S47.5,37.9,47.5,31c0-6.9,5.6-12.5,12.5-12.5S72.5,24.1,72.5,31z"/>
        <path fill="white" stroke="#222222" stroke-width="3" d="M25,31c0,6.9,5.6,12.5,12.5,12.5S50,37.9,50,31c0-6.9-5.6-12.5-12.5-12.5S25,24.1,25,31z"/>
      </svg>
    `;

    // Product Selection Functions
    function getProductId(element) {
        const directAttr = element.attr(CONFIG.productIdAttribute);
        const childAttr = element.find(`[${CONFIG.productIdAttribute}]`).attr(CONFIG.productIdAttribute);
        return directAttr || childAttr;
    }

    function toggleProductSelection(element, productId) {
        const index = selectedProducts.indexOf(productId);
        if (index > -1) {
            selectedProducts.splice(index, 1);
            element.removeClass('fps-selected');
            element.find('.fps-selection-number').remove();
        } else {
            selectedProducts.push(productId);
            element.addClass('fps-selected');
            element.append($(`<div class="fps-selection-number">${selectedProducts.length}</div>`));
        }
        updateUI();
    }

    function updateUI() {
        $('#fps-counter').text(`Selected: ${selectedProducts.length}`);
        const urlDisplay = $('#fps-url-display');
        if (selectedProducts.length > 0) {
            urlDisplay.val(`${window.location.origin}${window.location.pathname}?featured=${selectedProducts.join(',')}&pagesize=${CONFIG.pageSize}`);
        } else {
            urlDisplay.val('');
        }
    }

    function copyToClipboard() {
        const urlDisplay = $('#fps-url-display');
        urlDisplay.select();
        document.execCommand('copy');

        const copyBtn = $('#fps-copy-btn');
        const originalText = copyBtn.text();
        copyBtn.text('Copied!');
        setTimeout(() => copyBtn.text(originalText), 2000);
    }

    function clearSelection() {
        selectedProducts = [];
        $('.fps-selected').removeClass('fps-selected');
        $('.fps-selection-number').remove();
        updateUI();
    }

    function navigateToURL() {
        if (selectedProducts.length > 0) {
            window.location.href = `${window.location.origin}${window.location.pathname}?featured=${selectedProducts.join(',')}&pagesize=${CONFIG.pageSize}`;
        }
    }

    // Arlo Functions
    function createArloStyles() {
        if (arloStyles) return;

        arloStyles = document.createElement('style');
        arloStyles.textContent = `
          .paw-print {
            position: absolute;
            width: 20px;
            height: 20px;
            pointer-events: none;
            opacity: 0.8;
            z-index: 9998;
            animation: fade-out 2s forwards;
            filter: drop-shadow(0 0 1px rgba(0,0,0,0.3));
          }

          @keyframes fade-out {
            0% { opacity: 0.8; }
            100% { opacity: 0; }
          }

          .speech-bubble {
            position: absolute;
            background-color: white;
            border: 2px solid #333;
            border-radius: 15px;
            padding: 10px 15px;
            font-family: 'SOREL Frontier',sans-serif;
            font-size: 14px;
            text-transform: lowercase;
            color: #333;
            max-width: 200px;
            z-index: 10001;
            animation: bubble-appear 0.3s forwards, bubble-disappear 0.3s 3s forwards;
            pointer-events: none;
            box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
          }

          .speech-bubble:after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            width: 20px;
            height: 10px;
            background-color: white;
            border-right: 2px solid #333;
            border-bottom: 2px solid #333;
            transform: translateX(-50%) rotate(45deg);
          }

          @keyframes bubble-appear {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes bubble-disappear {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
          }

          #arlo-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
          }

          #arlo {
            position: absolute;
            width: 50px;
            height: 50px;
            transform-origin: center;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease;
            filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
          }

          #arlo svg {
            width: 100%;
            height: 100%;
          }
        `;
        document.head.appendChild(arloStyles);
    }

    function createSpeechBubble(text, x, y) {
        const existingBubble = document.querySelector('.speech-bubble');
        if (existingBubble) {
            existingBubble.remove();
        }

        const bubble = document.createElement('div');
        bubble.className = 'speech-bubble';
        bubble.textContent = text;
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y - 80}px`;
        arloContainer.appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 3500);
    }

    function createPawPrint(x, y) {
        const now = Date.now();
        if (now - lastPawPrintTime < 100) return;

        lastPawPrintTime = now;

        const pawPrint = document.createElement('div');
        pawPrint.className = 'paw-print';
        pawPrint.innerHTML = pawPrintSVG;
        pawPrint.style.left = `${x - 10}px`;
        pawPrint.style.top = `${y - 10}px`;

        let rotation = 0;
        switch(direction) {
            case 'up': rotation = -90; break;
            case 'down': rotation = 90; break;
            case 'left': rotation = 180; break;
            case 'right': rotation = 0; break;
        }
        pawPrint.style.transform = `rotate(${rotation}deg)`;

        arloContainer.appendChild(pawPrint);

        setTimeout(() => {
            if (pawPrint.parentNode) {
                pawPrint.parentNode.removeChild(pawPrint);
            }
        }, 2000);
    }

    function updateArlo(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        arlo.style.left = `${mouseX - 25}px`;
        arlo.style.top = `${mouseY - 25}px`;

        if (Math.abs(mouseX - lastMouseX) > Math.abs(mouseY - lastMouseY)) {
            direction = mouseX > lastMouseX ? 'right' : 'left';
        } else {
            direction = mouseY > lastMouseY ? 'down' : 'up';
        }

        switch(direction) {
            case 'up':
                arlo.style.transform = 'rotate(-90deg)';
                break;
            case 'down':
                arlo.style.transform = 'rotate(90deg)';
                break;
            case 'left':
                arlo.style.transform = 'scaleX(-1)';
                break;
            case 'right':
                arlo.style.transform = 'scaleX(1)';
                break;
        }

        createPawPrint(mouseX, mouseY);

        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }

    function handleArloClick(e) {
        const randomIndex = Math.floor(Math.random() * clickMessages.length);
        createSpeechBubble(clickMessages[randomIndex], mouseX, mouseY);
    }

    function enableArlo() {
        if (arloActive) return;

        createArloStyles();

        arloContainer = document.createElement('div');
        arloContainer.id = 'arlo-container';
        document.body.appendChild(arloContainer);

        arlo = document.createElement('div');
        arlo.id = 'arlo';
        arlo.innerHTML = arloSVG;
        arloContainer.appendChild(arlo);

        document.body.style.cursor = 'none';

        const initialX = lastMouseX || window.innerWidth / 2;
        const initialY = lastMouseY || window.innerHeight / 2;

        arlo.style.left = `${initialX - 25}px`;
        arlo.style.top = `${initialY - 25}px`;

        setTimeout(() => {
            createSpeechBubble("Hi! I'm Arlo. What are we shopping for today?", initialX, initialY);
        }, 500);

        document.addEventListener('mousemove', updateArlo);
        document.addEventListener('click', handleArloClick);

        arloActive = true;
    }

    function disableArlo() {
        if (!arloActive) return;

        document.body.style.cursor = '';
        document.removeEventListener('mousemove', updateArlo);
        document.removeEventListener('click', handleArloClick);

        if (arloContainer) {
            arloContainer.remove();
            arloContainer = null;
        }

        if (arloStyles) {
            arloStyles.remove();
            arloStyles = null;
        }

        arlo = null;
        arloActive = false;
    }

    function toggleArlo() {
        if (arloActive) {
            disableArlo();
        } else {
            enableArlo();
        }
    }

    // UI Creation
    function createUI() {
        $('body').append(`
            <style>
                #fps-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 400px;
                    background: #fff;
                    border: 2px solid #333;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,.3);
                    z-index: 999999;
                    font-family: Arial, sans-serif;
                }
                #fps-header {
                    background: #333;
                    color: #fff;
                    padding: 10px 15px;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #fps-header h3 {
                    margin: 0;
                    font-size: 16px;
                }
                #fps-close {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                }
                #fps-content {
                    padding: 15px;
                }
                #fps-counter {
                    font-size: 14px;
                    margin-bottom: 10px;
                    font-weight: bold;
                }
                #fps-arlo-toggle {
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                #fps-arlo-checkbox {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }
                #fps-arlo-label {
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                #fps-url-display {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    font-size: 12px;
                }
                #fps-buttons {
                    display: flex;
                    gap: 10px;
                }
                #fps-buttons button {
                    flex: 1;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.2s;
                }
                #fps-copy-btn {
                    background: #4caf50;
                    color: #fff;
                }
                #fps-copy-btn:hover {
                    background: #45a049;
                }
                #fps-clear-btn {
                    background: #f44336;
                    color: #fff;
                }
                #fps-clear-btn:hover {
                    background: #da190b;
                }
                #fps-navigate-btn {
                    background: #2196f3;
                    color: #fff;
                }
                #fps-navigate-btn:hover {
                    background: #0b7dda;
                }
                .fps-selected {
                    outline: 3px solid #4caf50 !important;
                    position: relative !important;
                }
                .fps-selection-number {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #4caf50;
                    color: #fff;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                    z-index: 999998;
                }
                ${CONFIG.productSelector} {
                    cursor: pointer !important;
                    transition: transform 0.2s;
                }
                ${CONFIG.productSelector}:hover {
                    transform: scale(1.02);
                }
            </style>
            <div id="fps-container">
                <div id="fps-header">
                    <h3>Featured Product Selector v2</h3>
                    <button id="fps-close">×</button>
                </div>
                <div id="fps-content">
                    <div id="fps-counter">Selected: 0</div>
                    <div id="fps-arlo-toggle">
                        <input type="checkbox" id="fps-arlo-checkbox">
                        <label for="fps-arlo-checkbox" id="fps-arlo-label">
                            🐻‍❄️ Activate Arlo (Polar Bear Cursor)
                        </label>
                    </div>
                    <input type="text" id="fps-url-display" readonly>
                    <div id="fps-buttons">
                        <button id="fps-copy-btn">Copy URL</button>
                        <button id="fps-clear-btn">Clear All</button>
                        <button id="fps-navigate-btn">Navigate to URL</button>
                    </div>
                </div>
            </div>
        `);
    }

    // Event Binding
    function bindEvents() {
        $('#fps-close').on('click', destroy);
        $('#fps-copy-btn').on('click', copyToClipboard);
        $('#fps-clear-btn').on('click', clearSelection);
        $('#fps-navigate-btn').on('click', navigateToURL);
        $('#fps-arlo-checkbox').on('change', function() {
            toggleArlo();
        });

        $(CONFIG.productSelector).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const element = $(this);
            const productId = getProductId(element);
            if (productId) {
                toggleProductSelection(element, productId);
            }
        });
    }

    // Main Functions
    function destroy() {
        disableArlo();
        $('#fps-container').remove();
        $('style:contains("#fps-container")').remove();
        $(CONFIG.productSelector).off('click');
        $('.fps-selected').removeClass('fps-selected');
        $('.fps-selection-number').remove();
        isSelecting = false;

        // Remove escape key listener
        document.removeEventListener('keydown', handleEscape);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') {
            if (arloActive) {
                disableArlo();
                $('#fps-arlo-checkbox').prop('checked', false);
            } else {
                destroy();
            }
        }
    }

    function init() {
        if (isSelecting) {
            destroy();
        } else {
            isSelecting = true;
            createUI();
            bindEvents();
            updateUI();

            // Add escape key listener
            document.addEventListener('keydown', handleEscape);
        }
    }

    // Cleanup existing instances
    if (window.FPS && window.FPS.destroy) {
        window.FPS.destroy();
    }

    // Export API
    window.FPS = {
        init: init,
        destroy: destroy,
        toggleArlo: toggleArlo
    };

    // Auto-initialize
    init();
})();
