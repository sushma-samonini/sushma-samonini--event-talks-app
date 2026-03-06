// talksData will be injected here by generate-site.js
// Example structure:
// const talksData = [
//   {
//     id: 'talk1',
//     title: 'Modern JavaScript Features',
//     speakers: ['Alice Johnson'],
//     category: ['JavaScript', 'Frontend'],
//     description: 'Dive into ES2023 features...',
//     startTime: '10:00 AM',
//     endTime: '11:00 AM',
//     duration: 60,
//     type: 'talk'
//   },
//   {
//     type: 'break',
//     title: 'Lunch Break',
//     startTime: '12:20 PM',
//     endTime: '01:20 PM',
//     duration: 60
//   }
// ];

document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchInput = document.getElementById('category-search');

    function renderSchedule(data) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        if (data.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found for this category.</p>';
            return;
        }

        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('schedule-item');
            if (item.type === 'break') {
                itemDiv.classList.add('break');
                itemDiv.innerHTML = `
                    <span class="time">${item.startTime} - ${item.endTime}</span>
                    <h2>${item.title}</h2>
                `;
            } else {
                itemDiv.innerHTML = `
                    <span class="time">${item.startTime} - ${item.endTime}</span>
                    <h2>${item.title}</h2>
                    <span class="speakers">Speaker(s): ${item.speakers.join(', ')}</span>
                    <p>${item.description}</p>
                    <div class="categories">
                        ${item.category.map(cat => `<span class="category">${cat}</span>`).join('')}
                    </div>
                `;
            }
            scheduleContainer.appendChild(itemDiv);
        });
    }

    // Initial render of the full schedule
    if (typeof talksData !== 'undefined' && talksData.length > 0) {
        renderSchedule(talksData);
    } else {
        scheduleContainer.innerHTML = '<p>Schedule data not available.</p>';
    }

    // Search functionality
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm === '') {
            renderSchedule(talksData); // Show all talks if search is empty
            return;
        }

        const filteredTalks = talksData.filter(item => {
            if (item.type === 'talk' && item.category) {
                return item.category.some(cat => cat.toLowerCase().includes(searchTerm));
            }
            return false;
        });

        renderSchedule(filteredTalks);
    });
});
