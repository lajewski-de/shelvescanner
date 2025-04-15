// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Shelve Scanner extension installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SCAN_COMPLETE') {
        // In a real implementation, this would handle the scan results
        console.log('Scan completed:', request.data);
    }
}); 