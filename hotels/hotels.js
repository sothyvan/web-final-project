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

// Hotel card hover effect
document.querySelectorAll('.hotel-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
    });
});

// Filter button functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active', 'border-blue-600', 'bg-blue-600', 'hover:text-white');
            b.classList.add('border-gray-300', 'text-gray-700', 'bg-white');
        });
        
        // Add active class to clicked button
        this.classList.remove('border-gray-300', 'text-gray-700', 'bg-white');
        this.classList.add('active', 'border-blue-600', 'bg-blue-600', 'hover:text-white');
        
        // In a real app, this would filter the hotels
        console.log('Filtering by: ' + this.textContent.trim());
    });
});

// "View Deal" button functionality
document.querySelectorAll('.view-deal-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const hotelName = this.closest('.hotel-card').querySelector('h3').textContent;
        const price = this.closest('.hotel-card').querySelector('.text-2xl').textContent;
        
        // Get dates from search form
        const checkin = document.getElementById('hotel-checkin-input').value || 'Not selected';
        const checkout = document.getElementById('hotel-checkout-input').value || 'Not selected';
        const guests = document.getElementById('hotel-guests-select').value || 'Not selected';
        
        alert(`Booking hotel: ${hotelName}\nPrice: ${price} per night\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}`);
    });
});

// Updated DatePicker class with validation (copied from other pages)
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
        this.otherPicker = otherPicker; // Reference to the other date picker (checkin or checkout)
        
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
            
            // Check if date is in the past (disable for check-in)
            if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                isDisabled = true;
            }
            
            // Additional validation logic for check-in and check-out
            if (this.otherPicker && this.otherPicker.selectedDate) {
                if (this.input.id.includes('checkin')) {
                    // For check-in: disable dates after selected check-out date
                    if (date > this.otherPicker.selectedDate) {
                        isDisabled = true;
                    }
                } else if (this.input.id.includes('checkout')) {
                    // For check-out: disable dates before selected check-in date
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
            
            // If this is check-in and check-out is before, clear check-out
            if (this.input.id.includes('checkin') && this.otherPicker.selectedDate) {
                if (this.otherPicker.selectedDate <= date) {
                    this.otherPicker.clearSelection();
                    alert('Check-out date has been cleared because it must be after check-in date.');
                }
            }
            
            // If this is check-out and check-in is after, clear check-in
            if (this.input.id.includes('checkout') && this.otherPicker.selectedDate) {
                if (this.otherPicker.selectedDate >= date) {
                    this.otherPicker.clearSelection();
                    alert('Check-in date has been cleared because it must be before check-out date.');
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

// Initialize date pickers for hotels page with cross-references
const hotelCheckinPicker = new DatePicker('hotel-checkin-input', 'hotel-checkin-calendar');
const hotelCheckoutPicker = new DatePicker('hotel-checkout-input', 'hotel-checkout-calendar');

// Set up the cross-references AFTER both are created
hotelCheckinPicker.otherPicker = hotelCheckoutPicker;
hotelCheckoutPicker.otherPicker = hotelCheckinPicker;

// Get references to search inputs
const destinationInput = document.getElementById('hotel-destination-input');
const guestsSelect = document.getElementById('hotel-guests-select');

// Add event listeners to show typed text
destinationInput.addEventListener('input', function(e) {
    console.log('Destination:', this.value);
});

// Add event listener to search button
document.getElementById('hotel-search-btn').addEventListener('click', function() {
    const destination = destinationInput.value;
    const checkin = hotelCheckinPicker.input.value;
    const checkout = hotelCheckoutPicker.input.value;
    const guests = guestsSelect.value;
    
    if (!destination) {
        alert('Please enter a destination');
        destinationInput.focus();
        return;
    }
    
    if (!checkin) {
        alert('Please select a check-in date');
        hotelCheckinPicker.input.focus();
        return;
    }
    
    if (!checkout) {
        alert('Please select a check-out date');
        hotelCheckoutPicker.input.focus();
        return;
    }
    
    // Show search results
    alert(`Searching hotels in:\nDestination: ${destination}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}`);
    
    // In a real app, this would filter and show hotels
    const hotelCards = document.querySelectorAll('.hotel-card');
    hotelCards.forEach(card => {
        card.style.display = 'block';
    });
});

// Sort functionality
document.getElementById('hotel-sort-select').addEventListener('change', function() {
    const sortBy = this.value;
    console.log('Sorting by:', sortBy);
    
    // In a real app, this would sort the hotels
    alert(`Hotels sorted by: ${sortBy}`);
});

// Price range slider functionality (if you add one)
const priceRange = document.getElementById('price-range');
if (priceRange) {
    const priceValue = document.getElementById('price-value');
    priceRange.addEventListener('input', function() {
        priceValue.textContent = `$${this.value}`;
    });
}

// Room selection functionality
document.querySelectorAll('.select-room-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const roomType = this.closest('.room-type-card').querySelector('h4').textContent;
        const price = this.closest('.room-type-card').querySelector('.text-xl').textContent;
        const hotelName = this.closest('.hotel-details').querySelector('h2').textContent;
        
        alert(`Selected room: ${roomType}\nHotel: ${hotelName}\nPrice: ${price} per night`);
    });
});

// Show more amenities toggle
document.querySelectorAll('.show-more-amenities').forEach(btn => {
    btn.addEventListener('click', function() {
        const amenitiesList = this.previousElementSibling;
        const hiddenAmenities = amenitiesList.querySelectorAll('.hidden');
        
        hiddenAmenities.forEach(amenity => {
            amenity.classList.remove('hidden');
        });
        
        this.style.display = 'none';
    });
});