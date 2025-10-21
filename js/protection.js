// Hozar Marine Protection System - Fixed Version
class WebsiteProtection {
    constructor() {
        this.domain = 'hms-7e1m.onrender.com';
        this.allowedDomains = [
            'localhost', 
            '127.0.0.1', 
            'hms-7e1m.onrender.com',
            'www.hms-7e1m.onrender.com',
            '192.168.1.1',
            '0.0.0.0'
        ];
        this.isDevelopment = this.checkEnvironment();
        this.init();
    }

    checkEnvironment() {
        // Check if we're in development/local environment
        const hostname = window.location.hostname;
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' ||
               hostname === '0.0.0.0' ||
               hostname === '192.168.1.1' ||
               window.location.protocol === 'file:' ||
               hostname.includes('test') ||
               hostname.includes('local');
    }

    init() {
        console.log('Hozar Marine Protection System Initialized');
        console.log('Current domain:', window.location.hostname);
        console.log('Development mode:', this.isDevelopment);
        
        if (this.isDevelopment) {
            this.developmentMode();
        } else {
            this.productionMode();
        }
        
        this.initSocialLinks();
    }

    developmentMode() {
        console.log('Running in development mode - light protection');
        this.disableRightClick();
        this.addWatermark();
        // No domain checking in development
    }

    productionMode() {
        console.log('Running in production mode - full protection');
        this.checkDomain();
        this.disableRightClick();
        this.disableTextSelection();
        this.obfuscateContent();
        this.addWatermark();
        this.monitorInspector();
        this.preventIframeEmbedding();
    }

    checkDomain() {
        const currentDomain = window.location.hostname;
        console.log('Domain check - Current:', currentDomain, 'Allowed:', this.allowedDomains);
        
        if (!this.allowedDomains.includes(currentDomain)) {
            console.warn('Domain not authorized, but allowing for testing');
            // Don't redirect - just show warning
            this.showTemporaryMessage('⚠️ Domain not authorized - Running in demo mode');
        }
    }

    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showTemporaryMessage('🔒 Right-click disabled for content protection');
        });
    }

    disableTextSelection() {
        if (!this.isDevelopment) {
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
            });
            
            // Additional selection prevention
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        }
    }

    obfuscateContent() {
        // Obfuscate sensitive content like prices and contact info
        const sensitiveElements = document.querySelectorAll('.product-price, .contact-info p, .app-link');
        sensitiveElements.forEach(el => {
            const original = el.textContent || el.innerHTML;
            el.setAttribute('data-original', btoa(original));
            
            if (!this.isDevelopment && original.length > 5) {
                // Only obfuscate in production
                el.style.setProperty('filter', 'blur(2px)', 'important');
                el.addEventListener('mouseenter', () => {
                    el.style.filter = 'none';
                });
                el.addEventListener('mouseleave', () => {
                    el.style.filter = 'blur(2px)';
                });
            }
        });
    }

    addWatermark() {
        const watermark = document.createElement('div');
        watermark.innerHTML = this.isDevelopment ? 
            '🛡️ Hozar Marine - Development Mode' : 
            '© Hozar Marine Services - Protected Content';
        watermark.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(10, 44, 94, 0.9);
            color: #4db4e7;
            padding: 8px 12px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            opacity: 0.8;
            border-radius: 4px;
            border-left: 3px solid #4db4e7;
            font-weight: 600;
        `;
        document.body.appendChild(watermark);
    }

    monitorInspector() {
        if (this.isDevelopment) return; // Skip in development
        
        let lastLength = document.documentElement.outerHTML.length;
        
        setInterval(() => {
            const currentLength = document.documentElement.outerHTML.length;
            if (Math.abs(currentLength - lastLength) > 1000) {
                console.warn('DOM modification detected');
                this.showTemporaryMessage('⚠️ Unauthorized modification detected');
            }
            lastLength = currentLength;
        }, 1000);
    }

    preventIframeEmbedding() {
        if (window.top !== window.self) {
            console.warn('Blocked iframe embedding attempt');
            window.top.location = window.self.location;
        }
    }

    showTemporaryMessage(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0a2c5e, #4db4e7);
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid #ff4444;
        `;
        document.body.appendChild(msg);
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.5s';
            setTimeout(() => msg.remove(), 500);
        }, 3000);
    }

    // Social Media App Integration
    initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-links a, .social-links-footer a');
        
        socialLinks.forEach(link => {
            const href = link.getAttribute('href');
            const icon = link.querySelector('i');
            
            if (icon) {
                const platform = this.getPlatformFromIcon(icon.className);
                const appUrl = this.getAppDeepLink(platform);
                
                if (appUrl && href) {
                    link.setAttribute('data-app', appUrl);
                    link.setAttribute('data-web', href);
                    link.addEventListener('click', this.handleSocialClick.bind(this));
                }
            }
        });

        // Phone and email links
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Phone link clicked:', link.href);
                // Allow default behavior
            });
        });

        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Email link clicked:', link.href);
                // Allow default behavior
            });
        });
    }

    getPlatformFromIcon(className) {
        if (className.includes('fa-facebook')) return 'facebook';
        if (className.includes('fa-twitter')) return 'twitter';
        if (className.includes('fa-instagram')) return 'instagram';
        if (className.includes('fa-linkedin')) return 'linkedin';
        if (className.includes('fa-youtube')) return 'youtube';
        if (className.includes('fa-whatsapp')) return 'whatsapp';
        return null;
    }

    getAppDeepLink(platform) {
        const deepLinks = {
            'facebook': 'fb://page/hozarmarine',
            'twitter': 'twitter://user?screen_name=hozarmarine',
            'instagram': 'instagram://user?username=hozarmarine',
            'linkedin': 'linkedin://company/hozarmarine',
            'youtube': 'vnd.youtube://channel/UC_HOZAR_MARINE',
            'whatsapp': 'whatsapp://send?text=Hello%20Hozar%20Marine%20Services'
        };
        return deepLinks[platform] || null;
    }

    handleSocialClick(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const appUrl = link.getAttribute('data-app');
        const webUrl = link.getAttribute('data-web');

        if (appUrl) {
            this.openAppOrWeb(appUrl, webUrl);
        } else {
            window.open(webUrl, '_blank');
        }
    }

    openAppOrWeb(appUrl, webUrl) {
        const startTime = Date.now();
        
        // Try to open app
        window.location = appUrl;
        
        // If app doesn't open within 500ms, redirect to web
        setTimeout(() => {
            if (Date.now() - startTime < 600) {
                window.open(webUrl, '_blank');
            }
        }, 500);
    }
}

// Advanced Anti-Cloning Protection
class AntiCloneProtection {
    constructor() {
        this.init();
    }

    init() {
        this.disableDevTools();
        this.protectSourceCode();
        this.detectCloning();
    }

    disableDevTools() {
        // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                console.log('Developer tools disabled');
                return false;
            }
        });

        // Right-click disable already handled in main class
    }

    protectSourceCode() {
        // Make source code harder to read
        Object.defineProperty(window, 'protectionEnabled', {
            value: true,
            writable: false,
            configurable: false
        });

        // Disable console methods in production
        if (!window.location.hostname.includes('localhost') && 
            !window.location.hostname.includes('127.0.0.1')) {
            console.log = function() {};
            console.warn = function() {};
            console.error = function() {};
        }
    }

    detectCloning() {
        // Check if site is being loaded in suspicious ways
        const originalTitle = document.title;
        
        setInterval(() => {
            if (document.title !== originalTitle) {
                document.title = originalTitle;
            }
            
            // Check for cloned domain patterns
            const currentUrl = window.location.href;
            if (currentUrl.includes('clone') || 
                currentUrl.includes('copy') || 
                currentUrl.includes('mirror')) {
                window.location.href = 'https://hms-7e1m.onrender.com';
            }
        }, 5000);
    }
}

// Initialize all protection systems
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Main protection system
        const mainProtection = new WebsiteProtection();
        
        // Advanced anti-cloning (only in production)
        if (!mainProtection.isDevelopment) {
            new AntiCloneProtection();
        }

        // Add global error handler
        window.addEventListener('error', (e) => {
            console.error('Protection system error:', e.error);
        });

        console.log('✅ Hozar Marine Protection Systems Active');

    } catch (error) {
        console.error('❌ Protection system failed to initialize:', error);
        // Don't break the site if protection fails
    }
});

// Additional security measures
(function() {
    // Prevent leaving site with unsaved changes (optional)
    window.addEventListener('beforeunload', (e) => {
        // You can add conditions here if needed
        // e.returnValue = 'Are you sure you want to leave?';
    });

    // Detect if site is being framed
    if (window.location !== window.parent.location) {
        window.parent.location = window.location;
    }

    // Content Security Policy helper
    const cspViolation = (e) => {
        console.warn('CSP Violation:', e);
    };
    document.addEventListener('securitypolicyviolation', cspViolation);
})();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebsiteProtection, AntiCloneProtection };
}
