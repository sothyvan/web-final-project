tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: 'oklch(54.6% 0.245 262.881)',
                secondary: 'oklch(62.3% 0.214 259.815)',
            },
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            }
        }
    }
}

// Category card hover effect
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Activity card hover effect
document.querySelectorAll('.activity-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
    });
});

// "Book Now" button functionality
document.querySelectorAll('.view-activity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const activityTitle = this.closest('.activity-card').querySelector('h3').textContent;
        const activityPrice = this.closest('.activity-card').querySelector('.text-2xl').textContent;
        alert(`Booking "${activityTitle}" for ${activityPrice} per person...`);
    });
});

// Updated DatePicker class with validation (copied from other pages)
class DatePicker {
    constructor(inputId, calendarId) {
        this.input = document.getElementById(inputId);
        this.calendar = document.getElementById(calendarId);
        this.monthYearElement = document.getElementById(calendarId.replace('calendar', 'month-year'));
        this.datesContainer = document.getElementById(calendarId.replace('calendar', 'dates'));
        this.prevBtn = document.getElementById(calendarId.replace('calendar', 'prev-month'));
        this.nextBtn = document.getElementById(calendarId.replace('calendar', 'next-month'));
        this.todayBtn = document.getElementById(calendarId.replace('calendar', 'today'));
        this.clearBtn = document.getElementById(calendarId.replace('calendar', 'clear'));
        
        this.currentDate = new Date();
        this.selectedDate = null;
        
        this.init();
    }
    
    init() {
        // Open calendar when input is clicked
        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCalendar();
        });
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
        this.nextBtn.addEventListener('click', () => this.changeMonth(1));
        
        // Today button
        this.todayBtn.addEventListener('click', () => this.selectToday());
        
        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearSelection());
        
        // Close calendar when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.calendar.contains(e.target) && e.target !== this.input) {
                this.calendar.classList.add('hidden');
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.calendar.classList.add('hidden');
            }
        });
        
        // Initialize calendar
        this.renderCalendar();
    }
    
    toggleCalendar() {
        // Hide all other calendars first
        document.querySelectorAll('.calendar-container').forEach(cal => {
            cal.classList.add('hidden');
        });
        
        // Toggle this calendar
        this.calendar.classList.toggle('hidden');
        
        // Update calendar view
        this.renderCalendar();
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month/year display
        const monthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
        this.monthYearElement.textContent = `${monthNames[month]} ${year}`;
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        // Clear previous dates
        this.datesContainer.innerHTML = '';
        
        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'h-10';
            this.datesContainer.appendChild(emptyCell);
        }
        
        // Add date cells
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateCell = document.createElement('div');
            dateCell.className = 'h-10 flex items-center justify-center rounded-lg date-cell cursor-pointer';
            
            // Check if this is today
            if (date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear()) {
                dateCell.classList.add('today');
            }
            
            // Check if this is selected date
            if (this.selectedDate && 
                date.getDate() === this.selectedDate.getDate() && 
                date.getMonth() === this.selectedDate.getMonth() && 
                date.getFullYear() === this.selectedDate.getFullYear()) {
                dateCell.classList.add('selected-date', 'font-bold');
            } else {
                dateCell.classList.add('text-gray-800');
            }
            
            // Determine if date should be disabled (past dates)
            let isDisabled = false;
            
            // Check if date is in the past (disable for activity date)
            if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                isDisabled = true;
            }
            
            // Apply disabled styling if date should be disabled
            if (isDisabled) {
                dateCell.classList.add('disabled-date');
                dateCell.classList.remove('date-cell', 'cursor-pointer');
                dateCell.classList.add('text-gray-400', 'cursor-not-allowed');
            }
            
            dateCell.textContent = day;
            dateCell.dataset.date = date.toISOString().split('T')[0];
            
            // Add click event only if not disabled
            if (!isDisabled) {
                dateCell.addEventListener('click', () => {
                    this.selectDate(date);
                });
            }
            
            this.datesContainer.appendChild(dateCell);
        }
    }
    
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }
    
    selectDate(date) {
        this.selectedDate = date;
        
        // Format date for display
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        this.input.value = date.toLocaleDateString('en-US', options);
        
        // Update calendar display
        this.renderCalendar();
        
        // Auto-close calendar after selection
        setTimeout(() => {
            this.calendar.classList.add('hidden');
        }, 300);
    }
    
    selectToday() {
        const today = new Date();
        this.selectDate(today);
        this.currentDate = new Date(today); // Reset calendar view to today
    }
    
    clearSelection() {
        this.selectedDate = null;
        this.input.value = '';
        this.renderCalendar();
    }
}

// Initialize date picker for activities page
const activityDatePicker = new DatePicker('activity-date-input', 'activity-date-calendar');

// Get references to search inputs
const destinationInput = document.getElementById('activity-destination-input');
const travelersSelect = document.getElementById('activity-travelers-select');

// Add event listeners to show typed text
destinationInput.addEventListener('input', function(e) {
    console.log('Destination:', this.value);
});

// Add event listener to search button
document.getElementById('activity-search-btn').addEventListener('click', function() {
    const destination = destinationInput.value;
    const activityDate = activityDatePicker.input.value;
    const travelers = travelersSelect.value;
    
    if (!destination) {
        alert('Please enter a destination');
        destinationInput.focus();
        return;
    }
    
    if (!activityDate) {
        alert('Please select an activity date');
        activityDatePicker.input.focus();
        return;
    }
    
    // Show search results
    alert(`Searching activities in:\nDestination: ${destination}\nDate: ${activityDate}\nTravelers: ${travelers}`);
});