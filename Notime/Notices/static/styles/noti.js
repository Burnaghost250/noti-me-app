  document.addEventListener('DOMContentLoaded', () => {
            const addNoticeForm = document.getElementById('addNoticeForm');
            const noticeTitleInput = document.getElementById('noticeTitle');
            const noticeContentInput = document.getElementById('noticeContent');
            const noticeImportantCheckbox = document.getElementById('noticeImportant');
            const noticesContainer = document.getElementById('noticesContainer');
            const searchInput = document.getElementById('searchInput');
            const noNoticesMessage = document.getElementById('noNoticesMessage');

            // Load notices from Local Storage or initialize an empty array
            // Changed localStorage key to 'notime_notices_whatsapp' for distinctness
            let notices = JSON.parse(localStorage.getItem('notime_notices_whatsapp')) || [];

            // Function to render notices
            const renderNotices = (filteredNotices = notices) => {
                noticesContainer.innerHTML = ''; // Clear existing notices

                if (filteredNotices.length === 0 && searchInput.value.trim() === '') {
                    // Show "no notices" message only if no search term is entered
                    noNoticesMessage.style.display = 'block';
                    noNoticesMessage.innerHTML = '<p>No notices here yet! Start by adding your first one below.</p><p><i class="fas fa-arrow-down" style="color: var(--whatsapp-green-light); margin-top: 10px;"></i></p>';
                    noticesContainer.style.display = 'none'; // Hide grid
                    document.querySelector('.notices-list-section h2').style.display = 'none'; // Hide "Your Notices" heading
                } else if (filteredNotices.length === 0 && searchInput.value.trim() !== '') {
                    // Show message for no search results
                    noNoticesMessage.style.display = 'block';
                    noNoticesMessage.innerHTML = '<p>No notices found matching your search. Try a different keyword!</p>';
                    noticesContainer.style.display = 'none';
                    document.querySelector('.notices-list-section h2').style.display = 'none';
                }
                else {
                    noNoticesMessage.style.display = 'none';
                    noticesContainer.style.display = 'grid'; // Ensure grid is visible
                    document.querySelector('.notices-list-section h2').style.display = 'block'; // Show heading

                    filteredNotices.forEach(notice => {
                        const noticeCard = document.createElement('div');
                        noticeCard.classList.add('notice-card');
                        if (notice.important) {
                            noticeCard.classList.add('important');
                        }
                        noticeCard.dataset.id = notice.id; // Store ID for easy access

                        noticeCard.innerHTML = `
                            <h3>${notice.title}</h3>
                            <p>${notice.content}</p>
                            <div class="notice-actions">
                                <button class="btn btn-toggle-important ${notice.important ? 'active' : ''}" data-action="toggleImportant">
                                    <i class="fas fa-exclamation-circle"></i> ${notice.important ? 'Unmark' : 'Mark'} Important
                                </button>
                                <button class="btn btn-danger" data-action="delete">
                                    <i class="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        `;
                        noticesContainer.appendChild(noticeCard);
                    });
                }
            };

            // Function to save notices to Local Storage
            const saveNotices = () => {
                localStorage.setItem('notime_notices_whatsapp', JSON.stringify(notices));
            };

            // Add new notice
            addNoticeForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Prevent default form submission

                const newNotice = {
                    id: Date.now(), // Unique ID based on timestamp
                    title: noticeTitleInput.value.trim(),
                    content: noticeContentInput.value.trim(),
                    important: noticeImportantCheckbox.checked
                };

                if (newNotice.title && newNotice.content) {
                    notices.unshift(newNotice); // Add to the beginning of the array
                    saveNotices();
                    renderNotices(); // Re-render all notices
                    addNoticeForm.reset(); // Clear the form
                    noticeTitleInput.focus(); // Focus back on title input
                    // Optional: Provide a subtle visual feedback like a brief animation
                } else {
                    alert('Please enter both title and content for the notice.');
                }
            });

            // Handle notice card actions (toggle important, delete) using event delegation
            noticesContainer.addEventListener('click', (e) => {
                const targetButton = e.target.closest('button');
                if (!targetButton) return; // Not a button click

                const noticeCard = targetButton.closest('.notice-card');
                if (!noticeCard) return; // Not inside a notice card

                const noticeId = parseInt(noticeCard.dataset.id);
                const noticeIndex = notices.findIndex(notice => notice.id === noticeId);

                if (noticeIndex === -1) return; // Notice not found (shouldn't happen)

                const action = targetButton.dataset.action;

                if (action === 'toggleImportant') {
                    notices[noticeIndex].important = !notices[noticeIndex].important;
                    saveNotices();
                    renderNotices(notices.filter(notice =>
                        notice.title.toLowerCase().includes(searchInput.value.toLowerCase().trim()) ||
                        notice.content.toLowerCase().includes(searchInput.value.toLowerCase().trim())
                    )); // Re-render with current search filter applied
                } else if (action === 'delete') {
                    if (confirm('Are you sure you want to delete this notice?')) {
                        notices.splice(noticeIndex, 1); // Remove from array
                        saveNotices();
                        renderNotices(notices.filter(notice =>
                            notice.title.toLowerCase().includes(searchInput.value.toLowerCase().trim()) ||
                            notice.content.toLowerCase().includes(searchInput.value.toLowerCase().trim())
                        )); // Re-render with current search filter applied
                    }
                }
            });

            // Search/Filter functionality
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const filteredNotices = notices.filter(notice =>
                    notice.title.toLowerCase().includes(searchTerm) ||
                    notice.content.toLowerCase().includes(searchTerm)
                );
                renderNotices(filteredNotices);
            });

            // Initial render when the page loads
            renderNotices();
        });