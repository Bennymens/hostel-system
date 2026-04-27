/* ============================================
   Admin Dashboard Logic (Multi-page Support)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Security Check: Redirect if not an admin
    const user = Auth.getUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'admin_login.html';
        return;
    }

    // Sidebar Toggle for Mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // --- MOCK DATA ---
    const MOCK_BOOKINGS = [
        { id: 1, student: 'Kwame Mensah', hostel: 'MB3 Hostel', phone: '024 123 4567', date: 'Oct 24, 2026', status: 'confirmed' },
        { id: 2, student: 'Akosua Boateng', hostel: 'E.N Schroder', phone: '055 987 6543', date: 'Oct 23, 2026', status: 'pending' },
        { id: 3, student: 'Kofi Appiah', hostel: 'Precious Hostel', phone: '020 444 5555', date: 'Oct 22, 2026', status: 'confirmed' },
        { id: 4, student: 'Ama Serwaa', hostel: 'MB3 Hostel', phone: '027 111 2222', date: 'Oct 22, 2026', status: 'cancelled' },
        { id: 5, student: 'Yaw Adu-Gyamfi', hostel: 'Pent Hostel', phone: '024 555 6666', date: 'Oct 21, 2026', status: 'confirmed' }
    ];

    let MOCK_HOSTELS = (typeof HOSTELS !== 'undefined' ? HOSTELS : [
        { id: 1, name: 'MB3 Hostel', location: 'UPSA Area', rooms: 20, status: 'Active', category: 'hot', price: 2700 },
        { id: 2, name: 'E.N Schroder', location: 'UPSA Area', rooms: 15, status: 'Active', category: 'popular', price: 4500 },
        { id: 3, name: 'Precious Hostel', location: 'Madina', rooms: 10, status: 'Active', category: 'affordable', price: 4500 }
    ]).map(h => ({
        ...h,
        location: h.location.includes('Legon') ? 'UPSA Area' : h.location,
        rooms: h.rooms || 20,
        status: 'Active',
        category: h.tags ? h.tags[0].toLowerCase() : 'hot'
    }));

    const MOCK_USERS = [
        { id: 1, name: 'Kwame Mensah', role: 'Student', joined: 'Oct 20, 2026', status: 'Active' },
        { id: 2, name: 'Akosua Boateng', role: 'Student', joined: 'Oct 15, 2026', status: 'Active' },
        { id: 3, name: 'Kofi Appiah', role: 'Student', joined: 'Oct 10, 2026', status: 'Inactive' }
    ];

    // --- PAGE INITIALIZATION ---
    const populateTables = () => {
        // Update Stats
        const stats = document.querySelectorAll('.stat-info h3');
        if (stats.length >= 3) {
            stats[0].textContent = MOCK_HOSTELS.length;
            stats[1].textContent = MOCK_BOOKINGS.length;
            stats[2].textContent = MOCK_USERS.length;
        }

        // Overview Page
        const recentList = document.getElementById('recent-bookings-list');
        if (recentList) {
            recentList.innerHTML = MOCK_BOOKINGS.slice(0, 5).map(b => `
                <tr>
                    <td>${b.student}</td>
                    <td>${b.hostel}</td>
                    <td>${b.date}</td>
                    <td><span class="status-badge status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                </tr>
            `).join('');
        }

        // Latest Hostels Widget on Overview
        const latestHostelsContainer = document.querySelector('.card:has(#recent-bookings-list) + .card .flex-col');
        // If the selector above is too complex, let's just find the Latest Hostels card
        const latestHostelsHeader = Array.from(document.querySelectorAll('.card-header h3')).find(h => h.textContent === 'Latest Hostels');
        if (latestHostelsHeader) {
            const container = latestHostelsHeader.closest('.card').querySelector('.flex-col');
            if (container) {
                container.innerHTML = MOCK_HOSTELS.slice(0, 3).map(h => `
                    <div class="flex items-center gap-3">
                        <div class="admin-avatar" style="border-radius: var(--radius); background: #eee;"><i class="fas fa-building text-muted"></i></div>
                        <div><h5 class="mb-0">${h.name}</h5><p class="text-xs text-muted">${h.location}</p></div>
                        <div class="mt-auto ml-auto text-right"><span class="tag tag-${h.category || 'hot'}">${h.category ? h.category.charAt(0).toUpperCase() + h.category.slice(1) : 'Active'}</span></div>
                    </div>
                    <hr style="border: 0; border-top: 1px solid var(--gray-100); margin: 8px 0;">
                `).join('');
            }
        }

        // Bookings Page
        const allList = document.getElementById('all-bookings-list');
        if (allList) {
            allList.innerHTML = MOCK_BOOKINGS.map(b => `
                <tr>
                    <td>${b.student}</td>
                    <td>${b.hostel}</td>
                    <td>${b.phone}</td>
                    <td>${b.date}</td>
                    <td><span class="status-badge status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                    <td>
                        ${b.status !== 'cancelled' ? `<button class="btn btn-sm btn-outline text-danger" onclick="revokeBooking(${b.id})">Revoke</button>` : '-'}
                    </td>
                </tr>
            `).join('');
        }

        // Hostels Page
        const hostelListTable = document.getElementById('hostels-list-table');
        if (hostelListTable) {
            hostelListTable.innerHTML = MOCK_HOSTELS.map(h => `
                <tr>
                    <td>${h.name}</td>
                    <td>${h.location}</td>
                    <td>${h.rooms} Rooms</td>
                    <td><span class="tag tag-${h.category}">${h.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="editHostel(${h.id})">Edit</button>
                        <button class="btn btn-sm btn-outline text-danger" onclick="deleteHostel(${h.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }

        // Users Page
        const userListTable = document.getElementById('users-list-table');
        if (userListTable) {
            userListTable.innerHTML = MOCK_USERS.map(u => `
                <tr>
                    <td>${u.name}</td>
                    <td>${u.role}</td>
                    <td>${u.joined}</td>
                    <td><span class="status-badge status-${u.status.toLowerCase() === 'active' ? 'confirmed' : 'cancelled'}">${u.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="viewUser(${u.id})">View</button>
                        <button class="btn btn-sm btn-outline text-danger" onclick="deleteUser(${u.id})">Remove</button>
                    </td>
                </tr>
            `).join('');
        }
    };

    // --- MODAL LOGIC ---
    window.openModal = (modalId) => {
        const overlay = document.getElementById('modal-overlay');
        if (!overlay) return;
        overlay.classList.add('active');
        document.querySelectorAll('.modal-card').forEach(m => m.style.display = 'none');
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
    };

    window.closeModal = (modalId) => {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) overlay.classList.remove('active');
    };

    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') closeModal();
        });
    }

    // --- HOSTEL ACTIONS ---
    window.openHostelModal = (hostel = null) => {
        const form = document.getElementById('hostel-form');
        const title = document.getElementById('hostel-modal-title');
        if (!form) return;
        form.reset();
        
        if (hostel) {
            title.textContent = 'Edit Hostel';
            document.getElementById('hostel-id').value = hostel.id;
            document.getElementById('hostel-name').value = hostel.name;
            document.getElementById('hostel-location').value = hostel.location;
            document.getElementById('hostel-rooms').value = hostel.rooms;
            document.getElementById('hostel-price').value = hostel.price;
            document.getElementById('hostel-category').value = hostel.category;
            if (document.getElementById('hostel-roomsize')) 
                document.getElementById('hostel-roomsize').value = hostel.roomsize || '';
            if (document.getElementById('hostel-amenities'))
                document.getElementById('hostel-amenities').value = hostel.amenities ? hostel.amenities.join(', ') : '';
        } else {
            title.textContent = 'Add New Hostel';
            document.getElementById('hostel-id').value = '';
        }
        openModal('hostel-modal');
    };

    window.editHostel = (id) => {
        const hostel = MOCK_HOSTELS.find(h => h.id === id);
        if (hostel) openHostelModal(hostel);
    };

    window.deleteHostel = (id) => {
        if (confirm('Are you sure you want to delete this hostel?')) {
            MOCK_HOSTELS = MOCK_HOSTELS.filter(h => h.id !== id);
            populateTables();
            showToast('Hostel deleted successfully', 'info');
        }
    };

    const hostelForm = document.getElementById('hostel-form');
    if (hostelForm) {
        hostelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('hostel-id').value;
            const amenitiesInput = document.getElementById('hostel-amenities');
            const data = {
                id: id ? parseInt(id) : Date.now(),
                name: document.getElementById('hostel-name').value,
                location: document.getElementById('hostel-location').value,
                rooms: document.getElementById('hostel-rooms').value,
                price: document.getElementById('hostel-price').value,
                category: document.getElementById('hostel-category').value,
                roomsize: document.getElementById('hostel-roomsize') ? document.getElementById('hostel-roomsize').value : '',
                amenities: amenitiesInput ? amenitiesInput.value.split(',').map(s => s.trim()) : [],
                status: 'Active'
            };

            if (id) {
                const index = MOCK_HOSTELS.findIndex(h => h.id === parseInt(id));
                MOCK_HOSTELS[index] = data;
                showToast('Hostel updated successfully', 'success');
            } else {
                MOCK_HOSTELS.push(data);
                showToast('Hostel added successfully', 'success');
            }

            populateTables();
            closeModal('hostel-modal');
        });
    }

    // --- USER ACTIONS ---
    window.viewUser = (id) => {
        const user = MOCK_USERS.find(u => u.id === id);
        const detailContent = document.getElementById('user-detail-content');
        if (user && detailContent) {
            detailContent.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    <div class="admin-avatar" style="width: 60px; height: 60px; font-size: 1.5rem;">${user.name.charAt(0)}</div>
                    <div>
                        <h3>${user.name}</h3>
                        <p class="text-muted">${user.role}</p>
                    </div>
                </div>
                <div class="p-3 bg-gray-50 rounded" style="background: #f8fafc; border-radius: 8px;">
                    <p class="mb-2"><strong>Email:</strong> ${user.name.toLowerCase().replace(' ', '.')}@example.com</p>
                    <p class="mb-2"><strong>Joined:</strong> ${user.joined}</p>
                    <p class="mb-2"><strong>Status:</strong> <span class="status-badge status-${user.status.toLowerCase() === 'active' ? 'confirmed' : 'cancelled'}">${user.status}</span></p>
                </div>
                <div class="mt-4 flex gap-2">
                    <button class="btn btn-outline btn-block" onclick="closeModal('user-modal')">Close</button>
                    <button class="btn btn-primary btn-block" onclick="showToast('User status updated', 'success')">Toggle Status</button>
                </div>
            `;
            openModal('user-modal');
        }
    };

    // --- SEARCH ---
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = MOCK_BOOKINGS.filter(b => 
                b.student.toLowerCase().includes(term) || b.hostel.toLowerCase().includes(term)
            );
            const allList = document.getElementById('all-bookings-list');
            if (allList) {
                allList.innerHTML = filtered.map(b => `
                    <tr>
                        <td>${b.student}</td>
                        <td>${b.hostel}</td>
                        <td>${b.phone}</td>
                        <td>${b.date}</td>
                        <td><span class="status-badge status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                    </tr>
                `).join('');
            }
        });
    }

    window.revokeBooking = (id) => {
        const modal = document.getElementById('revoke-modal');
        if (modal) {
            document.getElementById('revoke-booking-id').value = id;
            openModal('revoke-modal');
        } else {
            if (confirm('Are you sure you want to revoke this application?')) {
                const booking = MOCK_BOOKINGS.find(b => b.id === id);
                if (booking) {
                    booking.status = 'cancelled';
                    populateTables();
                    showToast('Application revoked', 'info');
                }
            }
        }
    };

    window.confirmRevoke = () => {
        const id = parseInt(document.getElementById('revoke-booking-id').value);
        const booking = MOCK_BOOKINGS.find(b => b.id === id);
        if (booking) {
            booking.status = 'cancelled';
            populateTables();
            showToast('Application revoked successfully', 'info');
        }
        closeModal('revoke-modal');
    };

    window.deleteUser = (id) => {
        const modal = document.getElementById('delete-user-modal');
        if (modal) {
            document.getElementById('delete-user-id-input').value = id;
            openModal('delete-user-modal');
        } else {
            if (confirm('Are you sure you want to remove this user?')) {
                const index = MOCK_USERS.findIndex(u => u.id === id);
                if (index !== -1) {
                    MOCK_USERS.splice(index, 1);
                    populateTables();
                    showToast('User removed successfully', 'info');
                }
            }
        }
    };

    window.confirmDeleteUser = () => {
        const id = parseInt(document.getElementById('delete-user-id-input').value);
        const index = MOCK_USERS.findIndex(u => u.id === id);
        if (index !== -1) {
            MOCK_USERS.splice(index, 1);
            populateTables();
            showToast('User account removed', 'info');
        }
        closeModal('delete-user-modal');
    };

    window.openUserFormModal = (user = null) => {
        const form = document.getElementById('user-form');
        const title = document.getElementById('user-form-title');
        if (!form) return;
        form.reset();
        if (user) {
            title.textContent = 'Edit User';
            document.getElementById('edit-user-id').value = user.id;
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-role').value = user.role;
            document.getElementById('user-status').value = user.status;
        } else {
            title.textContent = 'Add Student';
            document.getElementById('edit-user-id').value = '';
        }
        openModal('user-form-modal');
    };

    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-user-id').value;
            const data = {
                id: id ? parseInt(id) : Date.now(),
                name: document.getElementById('user-name').value,
                role: document.getElementById('user-role').value,
                status: document.getElementById('user-status').value,
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };
            if (id) {
                const index = MOCK_USERS.findIndex(u => u.id === parseInt(id));
                MOCK_USERS[index] = data;
                showToast('User updated', 'success');
            } else {
                MOCK_USERS.push(data);
                showToast('User added', 'success');
            }
            populateTables();
            closeModal('user-form-modal');
        });
    }

    window.generateReport = () => {
        openModal('report-modal');
    };

    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('report-type').value;
            showToast(`Generating ${type} report...`, 'info');
            setTimeout(() => {
                showToast('Report downloaded successfully!', 'success');
                closeModal('report-modal');
            }, 2000);
        });
    }

    // --- SETTINGS ---
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Saving configuration...', 'info');
            setTimeout(() => showToast('Settings saved successfully!', 'success'), 1000);
        });
    }

    // Initial Load
    populateTables();

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) Auth.logout();
        });
    }
});
