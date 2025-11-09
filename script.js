document.addEventListener('DOMContentLoaded', () => {
    // Dish categories defined here
    const categories = [
        { id: 'all', name: 'All' },
        { id: 'starters', name: 'Starters' },
        { id: 'soups', name: 'Soups' },
        { id: 'tandoori', name: 'Tandoori' }, // <-- ADDED THIS CATEGORY
        { id: 'main-course', name: 'Main Course' },
        { id: 'biryani', name: 'Biryani' },
        { id: 'chinese', name: 'Chinese' },
        { id: 'snacks', name: 'Snacks' },
        { id: 'breads', name: 'Breads' },
        { id: 'beverages', name: 'Beverages' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'specials', name: 'Specials ✨' },
    ];

    const sidebarContainer = document.getElementById('sidebar-category-list');
    const typeButtons = document.querySelectorAll('.type-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const mobileSelect = document.getElementById('mobile-category-select'); 
    const searchInput = document.getElementById('search-input'); // NEW Search Input

    // --- Style Definitions (for JS toggling) ---
    
    const btnBase = 'font-medium text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors duration-300';
    const sNavBtnBase = `${btnBase} w-full text-left px-4 py-2 rounded-lg`;
    const sNavBtnInactive = 'text-gray-700 hover:bg-gray-100';
    const sNavBtnActive = 'bg-amber-500 text-white shadow-md hover:bg-amber-600';

    const typeBtnBase = 'px-6 py-2 rounded-full font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-colors duration-300';
    const typeBtnInactive = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    const typeBtnActive = 'bg-amber-500 text-white shadow-md';

    // --- Filter State & Logic ---
    
    let currentCategoryFilter = 'all';
    let currentTypeFilter = 'all';
    let currentSearchTerm = ''; // NEW Search state
    let allCategoryButtons; 

    // Function to update menu visibility based on ALL filters
    const updateMenuVisibility = () => {
        const searchTermLower = currentSearchTerm.toLowerCase().trim();
        const hasSearchTerm = searchTermLower !== '';

        menuItems.forEach(item => {
            const categories = item.dataset.category.split(' ');
            const itemType = item.dataset.type;
            const itemKeywords = item.dataset.keywords.toLowerCase(); // Use data-keywords for search
            
            // 1. Check all conditions
            const categoryMatch = currentCategoryFilter === 'all' || categories.includes(currentCategoryFilter);
            const typeMatch = currentTypeFilter === 'all' || itemType === currentTypeFilter;
            const searchMatch = hasSearchTerm && itemKeywords.includes(searchTermLower);

            // 2. Show/Hide Item
            let showItem = false;
            if (hasSearchTerm) {
                // If user is searching, IGNORE category. 
                // Show if search AND type match.
                if (searchMatch && typeMatch) {
                    showItem = true;
                }
            } else {
                // If user is NOT searching, use category AND type.
                if (categoryMatch && typeMatch) {
                    showItem = true;
                }
            }

            if (showItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    // Common Handler for Category Buttons (Desktop)
    const handleCategoryClick = (event) => {
        const clickedButton = event.currentTarget;
        currentCategoryFilter = clickedButton.dataset.filter;

        // 1. Update styles for ALL desktop buttons
        allCategoryButtons.forEach(btn => {
            const isActive = btn.dataset.filter === currentCategoryFilter;
            btn.className = isActive ? `${sNavBtnBase} ${sNavBtnActive}` : `${sNavBtnBase} ${sNavBtnInactive}`;
        });
        
        // 2. Sync the mobile dropdown value
        mobileSelect.value = currentCategoryFilter;

        // --- BUG FIX: Clear search when a category is clicked ---
        if (currentSearchTerm !== '') {
            currentSearchTerm = '';
            searchInput.value = '';
        }
        // --- END OF FIX ---

        // 3. Re-filter menu
        updateMenuVisibility();
    };

    // --- Dynamic Element Generation ---

    // Creates the button for the desktop sidebar
    const createCategoryButton = (category) => {
        const btn = document.createElement('button');
        btn.classList.add('category-btn'); 
        btn.dataset.filter = category.id;
        btn.textContent = category.name;

        btn.className = (category.id === 'all') 
            ? `${sNavBtnBase} ${sNavBtnActive}` 
            : `${sNavBtnBase} ${sNavBtnInactive}`;

        btn.addEventListener('click', handleCategoryClick);
        return btn;
    };

    // Creates the option for the mobile dropdown
    const createCategoryOption = (category) => { 
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        return option;
    };

    // Populate navigation
    categories.forEach(category => {
        sidebarContainer.appendChild(createCategoryButton(category));
        mobileSelect.appendChild(createCategoryOption(category));
    });

    // Fetch all category buttons now that they exist in the DOM
    allCategoryButtons = document.querySelectorAll('#sidebar-category-list .category-btn');

    // --- Filter Event Listeners ---

    // NEW: Search Input Listener
    searchInput.addEventListener('input', (event) => {
        currentSearchTerm = event.target.value;
        const searchTermLower = currentSearchTerm.toLowerCase().trim();

        // If the user is typing a search, reset the category filter to 'all'
        // to ensure search spans all categories.
        if (searchTermLower !== '') {
            if (currentCategoryFilter !== 'all') {
                currentCategoryFilter = 'all';
                // Visually reset the dropdown and sidebar buttons
                mobileSelect.value = 'all';
                allCategoryButtons.forEach(btn => {
                    const isActive = btn.dataset.filter === 'all';
                    btn.className = isActive ? `${sNavBtnBase} ${sNavBtnActive}` : `${sNavBtnBase} ${sNavBtnInactive}`;
                });
            }
        }
        
        updateMenuVisibility();
    });

    // Mobile Select Listener
    mobileSelect.addEventListener('change', (event) => {
        currentCategoryFilter = event.target.value;
        allCategoryButtons.forEach(btn => {
            const isActive = btn.dataset.filter === currentCategoryFilter;
            btn.className = isActive ? `${sNavBtnBase} ${sNavBtnActive}` : `${sNavBtnBase} ${sNavBtnInactive}`;
        });

        // --- BUG FIX: Clear search when a category is selected ---
        if (currentSearchTerm !== '') {
            currentSearchTerm = '';
            searchInput.value = '';
        }
        // --- END OF FIX ---

        updateMenuVisibility();
    });

    // Veg/Non-Veg Filter Listener
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentTypeFilter = btn.dataset.typeFilter;
            typeButtons.forEach(b => {
                b.className = (b.dataset.typeFilter === currentTypeFilter) 
                    ? `${typeBtnBase} ${typeBtnActive}` 
                    : `${typeBtnBase} ${typeBtnInactive}`;
            });
            updateMenuVisibility();
        });
    });

    // --- NEW FUNCTION to set icons just once on page load ---
    const initializeMenuIcons = () => {
        menuItems.forEach(item => {
            const iconElement = item.querySelector('.veg-non-veg-icon');
            const itemType = item.dataset.type;
            
            if (iconElement) {
                // No need to remove classes, they aren't added yet
                if (itemType === 'veg') {
                    iconElement.classList.add('veg');
                } else if (itemType === 'non-veg') {
                    iconElement.classList.add('non-veg');
                }
            }
        });
    };


    // --- Initialize Menu on Load ---
    
    // Set initial active states: 'all' category and 'all' type
    const allTypeButton = document.querySelector('.type-btn[data-type-filter="all"]');
    if (allTypeButton) {
        allTypeButton.className = `${typeBtnBase} ${typeBtnActive}`;
    }
    
    initializeMenuIcons(); // <-- Call the new function here
    updateMenuVisibility(); // Show the correct items on load

});