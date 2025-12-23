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

// Transport Tab Switching
const tabs = document.querySelectorAll('.transport-tab');
const forms = document.querySelectorAll('.transport-form');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active state from all tabs
        tabs.forEach(t => {
            t.classList.remove('active', 'bg-white', 'text-blue-700');
            t.classList.add('bg-white/20', 'text-white');
        });
        
        // Add active state to clicked tab
        this.classList.remove('bg-white/20', 'text-white');
        this.classList.add('active', 'bg-white', 'text-blue-700');
        
        // Hide all forms
        forms.forEach(form => form.classList.add('hidden'));
        
        // Show corresponding form
        const tabId = this.id;
        if (tabId === 'tab-flight') {
            document.getElementById('flight-form').classList.remove('hidden');
        } else if (tabId === 'tab-train') {
            document.getElementById('train-form').classList.remove('hidden');
        } else if (tabId === 'tab-bus') {
            document.getElementById('bus-form').classList.remove('hidden');
        } else if (tabId === 'tab-car') {
            document.getElementById('car-form').classList.remove('hidden');
        }
    });
});

// Transport card hover effects
document.querySelectorAll('.transport-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
    });
});

// Booking buttons functionality
document.querySelectorAll('button.bg-primary').forEach(btn => {
    if (btn.textContent.includes('Select') || btn.textContent.includes('Book')) {
        btn.addEventListener('click', function() {
            const card = this.closest('.transport-card');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.text-2xl').textContent;
            
            alert(`Adding ${title} to your booking for ${price}...`);
        });
    }
});

// Search functionality
document.querySelectorAll('button.bg-blue-600, button.bg-green-600').forEach(btn => {
    if (btn.textContent.includes('Search')) {
        btn.addEventListener('click', function() {
            const form = this.closest('.transport-form');
            const tab = document.querySelector('.transport-tab.active').textContent.trim();
            
            alert(`Searching ${tab}...\nThis would perform an actual search in a real application.`);
        });
    }
});

// Auto-fill popular routes
document.querySelectorAll('a.bg-white\\/10').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const route = this.textContent;
        const [from, to] = route.split(' → ');
        
        // Set flight form values
        document.getElementById('flight-from').value = from.trim();
        document.getElementById('flight-to').value = to.trim();
        
        // Switch to flight tab
        document.getElementById('tab-flight').click();
        
        alert(`Route "${route}" has been auto-filled in the search form.`);
    });
});

// Updated DatePicker class with validation (Copied from index.html and deal.html)
class DatePicker {
    constructor(inputId, calendarId, otherPicker = null) {
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
        this.otherPicker = otherPicker; // Reference to the other date picker (for car rental: pick-up vs drop-off)
        
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
            
            // Determine if date should be disabled
            let isDisabled = false;
            
            // Check if date is in the past (disable for departure/pick-up)
            if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                isDisabled = true;
            }
            
            // Additional validation logic for car rental pick-up and drop-off
            if (this.otherPicker && this.otherPicker.selectedDate) {
                if (this.input.id.includes('pickup')) {
                    // For pick-up: disable dates after selected drop-off date
                    if (date > this.otherPicker.selectedDate) {
                        isDisabled = true;
                    }
                } else if (this.input.id.includes('dropoff')) {
                    // For drop-off: disable dates before selected pick-up date
                    if (date < this.otherPicker.selectedDate) {
                        isDisabled = true;
                    }
                }
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
        
        // If we have an other picker reference, update its calendar to reflect new constraints
        if (this.otherPicker) {
            this.otherPicker.renderCalendar();
            
            // If this is pick-up and drop-off is before, clear drop-off
            if (this.input.id.includes('pickup') && this.otherPicker.selectedDate) {
                if (this.otherPicker.selectedDate <= date) {
                    this.otherPicker.clearSelection();
                    alert('Drop-off date has been cleared because it must be after pick-up date.');
                }
            }
            
            // If this is drop-off and pick-up is after, clear pick-up
            if (this.input.id.includes('dropoff') && this.otherPicker.selectedDate) {
                if (this.otherPicker.selectedDate >= date) {
                    this.otherPicker.clearSelection();
                    alert('Pick-up date has been cleared because it must be before drop-off date.');
                }
            }
        }
        
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
        
        // If we have an other picker, update its calendar to remove constraints
        if (this.otherPicker) {
            this.otherPicker.renderCalendar();
        }
    }
}

// Initialize date pickers for transport page
// Flight departure date picker (standalone)
const flightDeparturePicker = new DatePicker('flight-departure-input', 'flight-departure-calendar');

// Train departure date picker (standalone)
const trainDeparturePicker = new DatePicker('train-departure-input', 'train-departure-calendar');

// Bus departure date picker (standalone)
const busDeparturePicker = new DatePicker('bus-departure-input', 'bus-departure-calendar');

// Car rental date pickers (linked)
const carPickupPicker = new DatePicker('car-pickup-input', 'car-pickup-calendar');
const carDropoffPicker = new DatePicker('car-dropoff-input', 'car-dropoff-calendar');

// Set up cross-references for car rental pick-up and drop-off
carPickupPicker.otherPicker = carDropoffPicker;
carDropoffPicker.otherPicker = carPickupPicker;

// Add event listeners to search buttons for validation
document.getElementById('flight-search-btn').addEventListener('click', function() {
    const from = document.getElementById('flight-from').value;
    const to = document.getElementById('flight-to').value;
    const departure = flightDeparturePicker.input.value;
    
    if (!from || !to) {
        alert('Please enter both departure and destination locations.');
        return;
    }
    
    if (!departure) {
        alert('Please select a departure date.');
        flightDeparturePicker.input.focus();
        return;
    }
    
    alert(`Searching flights from ${from} to ${to} on ${departure}...`);
});

document.getElementById('train-search-btn').addEventListener('click', function() {
    const from = document.getElementById('train-from').value;
    const to = document.getElementById('train-to').value;
    const departure = trainDeparturePicker.input.value;
    
    if (!from || !to) {
        alert('Please enter both departure and destination locations.');
        return;
    }
    
    if (!departure) {
        alert('Please select a departure date.');
        trainDeparturePicker.input.focus();
        return;
    }
    
    alert(`Searching trains from ${from} to ${to} on ${departure}...`);
});

document.getElementById('bus-search-btn').addEventListener('click', function() {
    const from = document.getElementById('bus-from').value;
    const to = document.getElementById('bus-to').value;
    const departure = busDeparturePicker.input.value;
    
    if (!from || !to) {
        alert('Please enter both departure and destination locations.');
        return;
    }
    
    if (!departure) {
        alert('Please select a departure date.');
        busDeparturePicker.input.focus();
        return;
    }
    
    alert(`Searching buses from ${from} to ${to} on ${departure}...`);
});

document.getElementById('car-search-btn').addEventListener('click', function() {
    const pickupLocation = document.getElementById('car-pickup-location').value;
    const pickupDate = carPickupPicker.input.value;
    const dropoffDate = carDropoffPicker.input.value;
    
    if (!pickupLocation) {
        alert('Please enter a pick-up location.');
        return;
    }
    
    if (!pickupDate) {
        alert('Please select a pick-up date.');
        carPickupPicker.input.focus();
        return;
    }
    
    if (!dropoffDate) {
        alert('Please select a drop-off date.');
        carDropoffPicker.input.focus();
        return;
    }
    
    alert(`Searching car rentals at ${pickupLocation} from ${pickupDate} to ${dropoffDate}...`);
});