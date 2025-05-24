/* Order Management, Filter, Breadcrumb, and Navigation Highlight Functionality */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize orders from localStorage or create empty array
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Save orders to localStorage
    const saveOrders = () => {
        localStorage.setItem('orders', JSON.stringify(orders));
    };

    // Place order function
    const placeOrder = (product) => {
        // Create a modal for contact info
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Order: ${product.name}</h3>
                <p>Price: BWP ${product.price}</p>
                <form id="order-form">
                    <input type="text" id="order-name" placeholder="Your Name" required>
                    <input type="email" id="order-email" placeholder="Your Email" required>
                    <input type="tel" id="order-phone" placeholder="Your Phone" required>
                    <textarea id="order-notes" placeholder="Additional Notes (e.g., delivery address)"></textarea>
                    <button type="submit" class="btn">Submit Order</button>
                    <button type="button" class="btn cancel">Cancel</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#order-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const order = {
                id: Date.now(), // Unique ID based on timestamp
                product: product,
                contact: {
                    name: form.querySelector('#order-name').value,
                    email: form.querySelector('#order-email').value,
                    phone: form.querySelector('#order-phone').value,
                    notes: form.querySelector('#order-notes').value
                },
                timestamp: new Date().toISOString()
            };
            orders.push(order);
            saveOrders();
            modal.remove();
            alert(`Order for ${product.name} placed successfully! We will contact you at ${order.contact.email}.`);
        });

        // Handle cancel
        modal.querySelector('.cancel').addEventListener('click', () => {
            modal.remove();
        });
    };

    // Filter products by category and price
    const filterProducts = () => {
        const category = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
        const priceRange = document.querySelector('#price-filter').value;
        const products = document.querySelectorAll('.product-card');

        products.forEach(product => {
            const productCategory = product.dataset.category;
            const price = parseFloat(product.dataset.price);

            // Category filter
            const categoryMatch = category === 'all' || category === productCategory;

            // Price filter
            let priceMatch = true;
            if (priceRange === 'low') priceMatch = price <= 1000;
            else if (priceRange === 'mid') priceMatch = price > 1000 && price <= 2000;
            else if (priceRange === 'high') priceMatch = price > 2000;

            // Show/hide product
            product.style.display = categoryMatch && priceMatch ? 'block' : 'none';
        });
    };

    // Generate breadcrumbs
    const generateBreadcrumbs = () => {
        const breadcrumbList = document.querySelector('#breadcrumb-list');
        if (!breadcrumbList) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageMap = {
            'index.html': 'Home',
            'about.html': 'About',
            'products.html': 'Orders',
            'services.html': 'Services',
            'faq.html': 'FAQ',
            'feedback.html': 'Feedback'
        };

        const breadcrumbs = [
            { name: 'Home', url: 'index.html' },
            currentPage !== 'index.html' ? { name: pageMap[currentPage], url: currentPage } : null
        ].filter(item => item);

        breadcrumbList.innerHTML = breadcrumbs.map((item, index) => {
            if (index === breadcrumbs.length - 1) {
                return `<li><span class="current">${item.name}</span></li>`;
            }
            return `<li><a href="${item.url}">${item.name}</a></li>`;
        }).join('');
    };

    // Highlight active navigation link
    const highlightActiveNav = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    };

    // Event delegation for place-order buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('place-order')) {
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price),
                category: e.target.dataset.category
            };
            placeOrder(product);
        }
    });

    // Event delegation for filter buttons
    document.querySelector('.filter-bar')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterProducts();
        }
    });

    // Event for price filter dropdown
    document.querySelector('#price-filter')?.addEventListener('change', filterProducts);

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question')?.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // Initialize filter, breadcrumbs, and navigation highlight
    filterProducts();
    generateBreadcrumbs();
    highlightActiveNav();
});