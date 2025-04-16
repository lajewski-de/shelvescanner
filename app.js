document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('camera');
    const scanButton = document.getElementById('scanButton');
    const resultsSection = document.getElementById('resultsSection');
    
    let stream = null;
    let isScanning = false;

    // Initialize camera when page loads
    initCamera();

    // Mock book data for prototype
    const mockBooks = [
        { id: 1, title: "The Great Gatsby", price: 15.99 },
        { id: 2, title: "To Kill a Mockingbird", price: 12.99 },
        { id: 3, title: "1984", price: 14.99 },
        { id: 4, title: "Pride and Prejudice", price: 11.99 },
        { id: 5, title: "The Catcher in the Rye", price: 13.99 },
        { id: 6, title: "The Hobbit", price: 9.99 },
        { id: 7, title: "Brave New World", price: 8.50 },
        { id: 8, title: "The Alchemist", price: 7.75 },
        { id: 9, title: "The Old Man and the Sea", price: 5.25 },
        { id: 10, title: "Fahrenheit 451", price: 6.50 }
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

    // Simulate book detection and show estimate
    function simulateBookDetection() {
        // Generate random estimate between €9.50 and €45.20
        const minEstimate = 9.50;
        const maxEstimate = 45.20;
        const estimate = (Math.random() * (maxEstimate - minEstimate) + minEstimate).toFixed(2);
        
        // Display the estimate
        document.getElementById('estimateValue').textContent = 
            `Your books value has been estimated as: €${estimate}`;
        
        // Update the estimated price in the call-to-action button
        document.getElementById('estimatedPrice').textContent = estimate;
        
        // Set the correct app store link based on device type
        setAppStoreLink();
        
        // Show results section
        resultsSection.style.display = 'block';
    }
    
    // Set the correct app store link based on device type
    function setAppStoreLink() {
        const sellButton = document.getElementById('sellOnMomoxButton');
        
        // Check if the device is iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Set the appropriate link
        if (isIOS) {
            sellButton.href = 'https://apps.apple.com/de/app/momox-second-hand-verkaufen/id414543719';
        } else {
            // Default to Android/Google Play
            sellButton.href = 'https://play.google.com/store/apps/details?id=de.momox';
        }
    }

    // Display detected books
    function displayBooks(books) {
        booksList.innerHTML = '';
        
        // Calculate total price of detected books
        const total = books.reduce((sum, book) => sum + book.price, 0);
        document.getElementById('detectedTotal').textContent = `Total: €${total.toFixed(2)}`;
        
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';
            bookElement.innerHTML = `
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="book-price">€${book.price.toFixed(2)}</p>
                </div>
                <button class="add-to-cart" onclick="addToCart(${book.id})">Add to Cart</button>
            `;
            booksList.appendChild(bookElement);
        });
        
        resultsSection.style.display = 'block';
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
                    <div class="book-price">€${book.price.toFixed(2)}</div>
                </div>
                <button class="remove-from-cart" data-book-id="${book.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
            total += book.price;
        });

        totalValue.textContent = `€${total.toFixed(2)}`;
        
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
            <div class="scanning-progress">
                <div class="progress-bar"></div>
            </div>
        `;
        return overlay;
    }

    // Start scanning animation
    function startScanningAnimation() {
        const scanningLine = document.querySelector('.scanning-line');
        const progressBar = document.querySelector('.progress-bar');
        
        if (scanningLine && progressBar) {
            // Reset animations
            scanningLine.style.transition = 'none';
            progressBar.style.transition = 'none';
            
            // Reset positions
            scanningLine.style.left = '0%';
            progressBar.style.width = '0%';
            
            // Force reflow
            scanningLine.offsetHeight;
            progressBar.offsetHeight;
            
            // Start animations
            scanningLine.style.transition = 'left 3s linear';
            progressBar.style.transition = 'width 3s linear';
            
            // Animate the scanning line from left to right
            setTimeout(() => {
                scanningLine.style.left = '100%';
            }, 50);
            
            // Animate the progress bar
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 50);
        }
    }

    // Start scanning process
    function startScanning() {
        if (isScanning) return;
        
        isScanning = true;
        scanButton.disabled = true;
        scanButton.textContent = 'Scanning...';
        
        // Hide bookshelf guide
        const bookshelfGuide = document.querySelector('.bookshelf-guide');
        if (bookshelfGuide) {
            bookshelfGuide.style.display = 'none';
        }
        
        // Create and show scanning overlay
        const scanningOverlay = createScanningOverlay();
        const cameraContainer = document.querySelector('.camera-container');
        cameraContainer.appendChild(scanningOverlay);
        
        // Start scanning animation
        startScanningAnimation();
        
        // Simulate scanning process
        setTimeout(() => {
            // Remove scanning overlay
            scanningOverlay.remove();
            
            // Show estimate
            simulateBookDetection();
            
            // Reset button
            scanButton.disabled = false;
            scanButton.textContent = 'Scan Bookshelf';
            isScanning = false;
            
            // Show the bookshelf guide again
            if (bookshelfGuide) {
                bookshelfGuide.style.display = 'flex';
            }
        }, 3000);
    }

    // Add all detected books to cart
    function addAllToCart() {
        detectedBooks.forEach(book => {
            if (!cart.find(item => item.id === book.id)) {
                cart.push(book);
            }
        });
        updateCartDisplay();
        
        // Save cart to local storage
        localStorage.setItem('shelveScannerCart', JSON.stringify(cart));
    }

    // Scan button click handler
    scanButton.addEventListener('click', startScanning);
    
    // Add all to cart button click handler
    addAllToCartButton.addEventListener('click', addAllToCart);

    // Initialize camera when page loads
    initCamera();
    
    // Load cart from local storage
    loadCart();

    // Momox button click handler
    document.getElementById('sellOnMomoxButton').addEventListener('click', function(e) {
        e.preventDefault();
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const momoxUrl = isIOS 
            ? 'https://apps.apple.com/de/app/momox-second-hand-verkaufen/id414543719'
            : 'https://play.google.com/store/apps/details?id=de.momox';
        window.open(momoxUrl, '_blank');
    });
}); 