/**
 * components-loader.js
 * 
 * Demonstrates how to dynamically fetch and inject header, footer, and sidebar components
 * when running on a web server (http:// or https://).
 * 
 * Note: When running directly from the local file system (file:// protocol),
 * browser security restrictions (CORS) prevent fetching local files. In that scenario,
 * the pre-integrated HTML blocks inside index.html will be used automatically.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are running on a server or locally via file://
    const isLocalFile = window.location.protocol === 'file:';
    
    if (isLocalFile) {
        console.info("eDetailing: Running via file:// protocol. Utilizing embedded components for CORS compatibility.");
        return;
    }
    
    // Dynamic loading implementation (optional use)
    const loadComponent = async (placeholderId, componentPath) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;
        
        try {
            const response = await fetch(componentPath);
            if (response.ok) {
                placeholder.innerHTML = await response.text();
                console.log(`Loaded component: ${componentPath}`);
            } else {
                console.error(`Failed to load component ${componentPath}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
        }
    };

    // To use dynamic loading, uncomment the lines below and ensure placeholders exist in index.html:
    // loadComponent('header-placeholder', 'header.html');
    // loadComponent('sidebar-placeholder', 'sidebar.html');
    // loadComponent('footer-placeholder', 'footer.html');
});
