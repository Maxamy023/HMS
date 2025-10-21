// Advanced Anti-Cloning Protection System
class WebsiteProtection {
    constructor() {
        this.domain = 'hozarmarine.com'; // Change to your actual domain
        // keep default allowed hosts but allow common static preview hosts in runtime check
        this.allowedDomains = ['localhost', '127.0.0.1', this.domain, 'github.io', 'githubpreview.dev', 'pages.dev'];
        this.init();
    }

    init() {
        this.checkDomain();
        this.disableRightClick();
        this.disableTextSelection();
        this.disableDevTools();
        this.obfuscateContent();
        this.addWatermark();
        this.monitorInspector();
    }

    checkDomain() {
        const currentDomain = window.location.hostname;

        // Allow official domain, localhost, and common static preview domains (e.g., GitHub Pages / previews)
        const isOfficial = this.allowedDomains.includes(currentDomain);
        const isGithubPages = currentDomain.endsWith('.github.io');
        const isGithubPreview = currentDomain.endsWith('.githubpreview.dev');
        const isPagesDev = currentDomain.endsWith('.pages.dev');

        if (isOfficial || isGithubPages || isGithubPreview || isPagesDev) {
            return; // allowed
        }

        // Not allowed -> redirect
        this.redirectToOfficial();
    }

    redirectToOfficial() {
        window.location.href = `https://${this.domain}`;
    }

    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showProtectionMessage();
        });
    }

    disableTextSelection() {
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }

    disableDevTools() {
        const devToolsCheck = () => {
            const widthThreshold = window.outerWidth - window.innerWidth > 160;
            const heightThreshold = window.outerHeight - window.innerHeight > 160;
            
            if (widthThreshold || heightThreshold) {
                document.body.innerHTML = '<div style="padding: 50px; text-align: center;"><h1>Access Restricted</h1><p>Developer tools are disabled on this website.</p></div>';
                window.location.reload();
            }
        };

        setInterval(devToolsCheck, 1000);
    }

    obfuscateContent() {
        // Obfuscate critical content
        const elements = document.querySelectorAll('.product-price, .contact-info p');
        elements.forEach(el => {
            const original = el.innerHTML;
            el.setAttribute('data-original', btoa(original));
            el.innerHTML = this.rot13(original);
        });
    }

    rot13(str) {
        return str.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    addWatermark() {
        const watermark = document.createElement('div');
        watermark.innerHTML = '© Hozar Marine Services - Protected Content';
        watermark.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            opacity: 0.7;
        `;
        document.body.appendChild(watermark);
    }

    monitorInspector() {
        let lastLength = document.documentElement.outerHTML.length;
        
        setInterval(() => {
            const currentLength = document.documentElement.outerHTML.length;
            if (Math.abs(currentLength - lastLength) > 1000) {
                this.showProtectionMessage();
                window.location.reload();
            }
            lastLength = currentLength;
        }, 500);
    }

    showProtectionMessage() {
        const message = document.createElement('div');
        message.innerHTML = '⚠️ This content is protected and cannot be copied.';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }
}

// Initialize protection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteProtection();
});

// Additional protection against iframe embedding
if (window.top !== window.self) {
    window.top.location = window.self.location;
}

// Protection against source code viewing
Object.defineProperty(window, 'protectionEnabled', {
    value: true,
    writable: false,
    configurable: false
});
// Social Media App Integration
class SocialMediaIntegration {
    constructor() {
        this.initSocialLinks();
    }

    initSocialLinks() {
        // Update social media links to open apps
        const socialLinks = document.querySelectorAll('.social-links a, .social-links-footer a');
        
        socialLinks.forEach(link => {
            const href = link.getAttribute('href');
            const icon = link.querySelector('i');
            
            if (icon) {
                const platform = this.getPlatformFromIcon(icon.className);
                const appUrl = this.getAppDeepLink(platform);
                
                if (appUrl) {
                    link.setAttribute('data-app', appUrl);
                    link.setAttribute('data-web', href || `https://${platform}.com/hozarmarine`);
                    link.addEventListener('click', this.handleSocialClick.bind(this));
                }
            }
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
            'whatsapp': 'whatsapp://send?text=Hello%20Hozar%20Marine'
        };
        return deepLinks[platform] || null;
    }

    handleSocialClick(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const appUrl = link.getAttribute('data-app');
        const webUrl = link.getAttribute('data-web');

        // Try to open app first, fall back to web
        this.openAppOrWeb(appUrl, webUrl);
    }

    openAppOrWeb(appUrl, webUrl) {
        const startTime = Date.now();
        
        // Try to open app
        window.location = appUrl;
        
        // If app doesn't open within 500ms, redirect to web
        setTimeout(() => {
            if (Date.now() - startTime < 600) {
                window.location = webUrl;
            }
        }, 500);
    }
}

// Initialize social media integration
document.addEventListener('DOMContentLoaded', () => {
    new SocialMediaIntegration();
});
