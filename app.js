document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('camera');
    const scanButton = document.getElementById('scanButton');
    const resultsSection = document.getElementById('resultsSection');
    const booksList = document.getElementById('booksList');
    const cartItems = document.getElementById('cartItems');
    const totalValue = document.getElementById('totalValue');
    
    let stream = null;
    let cart = [];
    let isScanning = false;

    // Mock book data for prototype
    const mockBooks = [
        { id: 1, title: "The Great Gatsby", price: 15.99 },
        { id: 2, title: "To Kill a Mockingbird", price: 12.99 },
        { id: 3, title: "1984", price: 14.99 },
        { id: 4, title: "Pride and Prejudice", price: 11.99 },
        { id: 5, title: "The Catcher in the Rye", price: 13.99 }
    ];

    // Initialize camera with permission handling
    async function initCamera() {
        try {
            // For mobile devices, we need to use a different approach
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Try to use the back camera on mobile devices
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    } 
                });
                video.srcObject = stream;
                return true;
            } else {
                console.error('getUserMedia is not supported in this browser');
                showPermissionError();
                return false;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            
            // Check if the error is related to permissions
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                showPermissionRequest();
            } else {
                showPermissionError();
            }
            return false;
        }
    }

    // Show permission request UI
    function showPermissionRequest() {
        const cameraSection = document.querySelector('.camera-section');
        cameraSection.innerHTML = `
            <div class="permission-request">
                <p>Camera access is required to scan your bookshelf.</p>
                <p>Please click the button below to grant camera access:</p>
                <button id="requestPermission" class="primary-button">Grant Camera Access</button>
                <p class="permission-note">If the button doesn't work, you may need to manually enable camera access in your browser settings.</p>
            </div>
        `;
        
        document.getElementById('requestPermission').addEventListener('click', async () => {
            try {
                // Try to request permissions again
                const success = await initCamera();
                if (success) {
                    location.reload(); // Reload to reinitialize the camera
                } else {
                    showPermissionError();
                }
            } catch (err) {
                console.error('Error requesting permissions:', err);
                showPermissionError();
            }
        });
    }

    // Show permission error UI
    function showPermissionError() {
        const cameraSection = document.querySelector('.camera-section');
        cameraSection.innerHTML = `
            <div class="permission-error">
                <p>Unable to access camera. Please check your browser settings and ensure camera permissions are granted.</p>
                <p>You can manage permissions by:</p>
                <ol>
                    <li>Clicking the lock/info icon in the address bar</li>
                    <li>Selecting "Site Settings"</li>
                    <li>Enabling camera access</li>
                </ol>
                <p>After enabling permissions, please reload the page.</p>
                <button id="retryPermission" class="primary-button">Retry Camera Access</button>
            </div>
        `;
        
        document.getElementById('retryPermission').addEventListener('click', () => {
            location.reload();
        });
    }

    // Simulate book detection
    function simulateBookDetection() {
        const scanningOverlay = document.createElement('div');
        scanningOverlay.className = 'scanning-overlay';
        
        const scanningLine = document.createElement('div');
        scanningLine.className = 'scanning-line';
        
        const scanningText = document.createElement('div');
        scanningText.className = 'scanning-text';
        scanningText.textContent = 'Scanning books...';
        
        scanningOverlay.appendChild(scanningLine);
        scanningOverlay.appendChild(scanningText);
        cameraContainer.appendChild(scanningOverlay);
        
        // Simulate a bookshelf with up to 20 books
        const numBooks = Math.floor(Math.random() * 15) + 5; // 5-20 books
        const bookPositions = [];
        
        // Generate random positions for books (evenly distributed)
        for (let i = 0; i < numBooks; i++) {
            // Position books between 10% and 90% of the screen height
            const position = 10 + (i * 80 / numBooks);
            bookPositions.push(position);
            
            // Add visual indicator for each book
            const bookIndicator = document.createElement('div');
            bookIndicator.className = 'book-indicator';
            bookIndicator.style.top = `${position - 40}px`; // Center the book vertically
            bookIndicator.style.left = '20%'; // Position books on the left side
            scanningOverlay.appendChild(bookIndicator);
        }
        
        // Start the scanning animation
        setTimeout(() => {
            scanningLine.style.left = '100%';
            
            // Create price tags as the scanning line moves
            bookPositions.forEach((position, index) => {
                // Calculate when to show each price tag based on scanning progress
                const delay = 100 + (index * 5500 / numBooks);
                
                setTimeout(() => {
                    const price = generateRandomPrice();
                    const tag = createPriceTag(price, position);
                    scanningOverlay.appendChild(tag);
                }, delay);
            });
        }, 100);
        
        // After scanning completes, show the detected books
        setTimeout(() => {
            cameraContainer.removeChild(scanningOverlay);
            displayDetectedBooks();
        }, 6000);
    }

    // Display detected books
    function displayBooks(books) {
        booksList.innerHTML = '';
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';
            bookElement.innerHTML = `
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-price">$${book.price.toFixed(2)}</div>
                </div>
                <button class="add-to-cart" data-book-id="${book.id}">Add to Cart</button>
            `;
            booksList.appendChild(bookElement);
        });

        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const bookId = parseInt(this.getAttribute('data-book-id'));
                const book = books.find(b => b.id === bookId);
                addToCart(book);
            });
        });
    }

    // Add book to cart
    function addToCart(book) {
        if (!cart.find(item => item.id === book.id)) {
            cart.push(book);
            updateCartDisplay();
            
            // Save cart to local storage
            localStorage.setItem('shelveScannerCart', JSON.stringify(cart));
        }
    }

    // Update cart display
    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(book => {
            const cartItem = document.createElement('div');
            cartItem.className = 'book-item';
            cartItem.innerHTML = `
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-price">$${book.price.toFixed(2)}</div>
                </div>
                <button class="remove-from-cart" data-book-id="${book.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
            total += book.price;
        });

        totalValue.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to "Remove" buttons
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const bookId = parseInt(this.getAttribute('data-book-id'));
                cart = cart.filter(item => item.id !== bookId);
                updateCartDisplay();
                
                // Save cart to local storage
                localStorage.setItem('shelveScannerCart', JSON.stringify(cart));
            });
        });
    }

    // Load cart from local storage
    function loadCart() {
        const savedCart = localStorage.getItem('shelveScannerCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    }

    // Create scanning overlay
    function createScanningOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'scanning-overlay';
        overlay.innerHTML = `
            <div class="scanning-line"></div>
            <div class="scanning-text">Scanning bookshelf...</div>
        `;
        return overlay;
    }

    // Generate random price in EUR
    function generateRandomPrice() {
        return (Math.random() * 20).toFixed(2);
    }

    // Create price tag element
    function createPriceTag(price, top) {
        const tag = document.createElement('div');
        tag.className = 'price-tag';
        tag.textContent = price;
        tag.style.top = `${top}%`;
        tag.style.left = '60%'; // Position to the right of the scanning line
        return tag;
    }

    // Start scanning animation
    function startScanning() {
        if (isScanning) return;
        
        isScanning = true;
        scanButton.disabled = true;
        scanButton.textContent = 'Scanning...';
        
        // Create and add scanning overlay
        const overlay = createScanningOverlay();
        const cameraSection = document.querySelector('.camera-section');
        cameraSection.appendChild(overlay);
        
        // Animate the scanning line
        const scanningLine = overlay.querySelector('.scanning-line');
        
        // Animate the scanning line from left to right
        scanningLine.style.left = '0%';
        setTimeout(() => {
            scanningLine.style.left = '100%';
        }, 100);
        
        // Create and animate price tags
        const priceTags = [];
        const numPriceTags = 5;
        
        for (let i = 0; i < numPriceTags; i++) {
            const price = generateRandomPrice();
            const priceTag = createPriceTag(price, 20 + (i * 20));
            overlay.appendChild(priceTag);
            priceTags.push(priceTag);
            
            // Position price tags at random heights
            const randomTop = Math.random() * 80 + 10; // 10% to 90% from top
            priceTag.style.top = `${randomTop}%`;
            
            // Animate price tags to follow the scanning line
            setTimeout(() => {
                priceTag.style.left = '0%';
                setTimeout(() => {
                    priceTag.style.left = '100%';
                }, 100);
            }, i * 1000); // Stagger the appearance of price tags
        }
        
        // Simulate scanning time (6 seconds)
        setTimeout(() => {
            // Remove scanning overlay
            overlay.remove();
            
            // Show results
            const detectedBooks = simulateBookDetection();
            displayBooks(detectedBooks);
            resultsSection.style.display = 'block';
            
            // Reset button
            scanButton.disabled = false;
            scanButton.textContent = 'Scan Bookshelf';
            isScanning = false;
        }, 6000);
    }

    // Scan button click handler
    scanButton.addEventListener('click', startScanning);

    // Initialize camera when page loads
    initCamera();
    
    // Load cart from local storage
    loadCart();
}); 