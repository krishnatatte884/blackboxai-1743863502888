// DOM Elements
const profileForm = document.getElementById('profileForm');
const profileImage = document.getElementById('profileImage');
const profilePreview = document.getElementById('profilePreview');
const searchInput = document.getElementById('searchInput');
const domainFilter = document.getElementById('domainFilter');
const resultsContainer = document.getElementById('resultsContainer');
const emptyState = document.getElementById('emptyState');

// API Base URL
const API_BASE = 'http://localhost:8000/api';

// Profile Image Preview
if (profileImage) {
    profileImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profilePreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Profile Form Submission
if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

        try {
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const bio = document.getElementById('bio').value.trim();
            const skills = document.getElementById('skills').value.split(',')
                .map(skill => skill.trim())
                .filter(skill => skill !== '');
            const domainCheckboxes = document.querySelectorAll('input[name="domains"]:checked');
            const domains = Array.from(domainCheckboxes).map(cb => cb.value);
            
            // Client-side validation
            if (!name || !email || !bio || skills.length === 0 || domains.length === 0) {
                throw new Error('Please fill all required fields');
            }
            
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                throw new Error('Please enter a valid email address');
            }

            const profile = {
                name,
                email,
                bio,
                skills,
                domains,
                profilePic: profilePreview.src
            };

            const response = await fetch(`${API_BASE}/profiles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create profile');
            }

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
            successMsg.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Profile created successfully!';
            document.body.appendChild(successMsg);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
                window.location.href = 'index.html';
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
            errorMsg.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i> ${error.message}`;
            document.body.appendChild(errorMsg);
            
            // Remove message after 5 seconds
            setTimeout(() => errorMsg.remove(), 5000);
            
            // Reset submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Profile';
        }
    });
}

// Search Functionality
if (searchInput) {
    searchInput.addEventListener('input', filterProfiles);
    domainFilter.addEventListener('change', filterProfiles);
}

async function filterProfiles() {
    const searchTerm = searchInput.value.toLowerCase();
    const domain = domainFilter.value;
    
    try {
        let url = `${API_BASE}/profiles/search?`;
        if (searchTerm) url += `q=${encodeURIComponent(searchTerm)}&`;
        if (domain) url += `domain=${encodeURIComponent(domain)}`;
        
        const response = await fetch(url);
        const profiles = await response.json();
        displayResults(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        displayResults([]);
    }
}

function displayResults(profiles) {
    resultsContainer.innerHTML = '';
    
    if (profiles.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.className = 'bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6';
        
        profileCard.innerHTML = `
            <div class="flex-shrink-0">
                <img src="${profile.profilePic}" alt="Profile" class="profile-pic rounded-full">
            </div>
            <div class="flex-grow">
                <h3 class="text-xl font-semibold">${profile.name}</h3>
                <p class="text-gray-600 mb-3">${profile.bio.substring(0, 60)}...</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${profile.skills.map(skill => 
                        `<span class="skill-tag bg-blue-100 text-blue-800">${skill}</span>`
                    ).join('')}
                </div>
                <p class="text-gray-700 mb-4">${profile.bio}</p>
            </div>
            <div class="flex-shrink-0 flex items-center">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    Connect
                </button>
            </div>
        `;
        
        resultsContainer.appendChild(profileCard);
    });
}

// Initialize the page
if (window.location.pathname.includes('search.html')) {
    filterProfiles();
}