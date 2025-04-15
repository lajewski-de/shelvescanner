document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('camera');
    const scanButton = document.getElementById('scanButton');
    const resultsSection = document.getElementById('resultsSection');
    const booksList = document.getElementById('booksList');
    const cartItems = document.getElementById('cartItems');
    const totalValue = document.getElementById('totalValue');
    
    let stream = null;
    let cart = [];

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
            // For Chrome extensions, we need to use a different approach
            // First, check if we can access the camera
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
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
                <p>After enabling permissions, please reload the extension.</p>
                <button id="retryPermission" class="primary-button">Retry Camera Access</button>
            </div>
        `;
        
        document.getElementById('retryPermission').addEventListener('click', () => {
            location.reload();
        });
    }

    // Simulate book detection
    function simulateBookDetection() {
        // Randomly select 2-4 books from our mock data
        const numBooks = Math.floor(Math.random() * 3) + 2;
        const detectedBooks = [];
        
        for (let i = 0; i < numBooks; i++) {
            const randomBook = mockBooks[Math.floor(Math.random() * mockBooks.length)];
            if (!detectedBooks.find(book => book.id === randomBook.id)) {
                detectedBooks.push(randomBook);
            }
        }
        
        return detectedBooks;
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
            `;
            cartItems.appendChild(cartItem);
            total += book.price;
        });

        totalValue.textContent = `$${total.toFixed(2)}`;
    }

    // Scan button click handler
    scanButton.addEventListener('click', function() {
        const detectedBooks = simulateBookDetection();
        displayBooks(detectedBooks);
        resultsSection.style.display = 'block';
    });

    // Initialize camera when popup opens
    initCamera();
}); 