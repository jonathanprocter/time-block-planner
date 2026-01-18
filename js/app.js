/**
 * Time-Block Planner - Main Application Logic
 * UI Management and Event Handlers
 */

// Access TimeBlockPlanner utilities
function getTBP() {
    return window.TimeBlockPlanner || {};
}

// ============================================
// Application Instance
// ============================================

class TimeBlockPlannerApp {
    constructor() {
        const TBP = getTBP();
        this.state = new TBP.AppState();
        this.currentView = 'daily';
        this.currentDate = new Date();
        this.selectedBlock = null;
        this.draggedItem = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCurrentView();
        
        // Show onboarding if first time
        if (!this.state.onboardingComplete) {
            setTimeout(() => this.showOnboarding(), 500);
        }
    }

    // ============================================
    // Event Listeners Setup
    // ============================================

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Date navigation
        document.getElementById('prevDay')?.addEventListener('click', () => this.navigateDay(-1));
        document.getElementById('nextDay')?.addEventListener('click', () => this.navigateDay(1));
        document.getElementById('todayBtn')?.addEventListener('click', () => this.goToToday());
        document.getElementById('currentDate')?.addEventListener('change', (e) => {
            this.currentDate = new Date(e.target.value + 'T00:00:00');
            this.renderDailyView();
            this.importGoogleCalendarEvents();
        });

        // Week navigation
        document.getElementById('prevWeek')?.addEventListener('click', () => this.navigateWeek(-1));
        document.getElementById('nextWeek')?.addEventListener('click', () => this.navigateWeek(1));
        document.getElementById('thisWeekBtn')?.addEventListener('click', () => this.goToThisWeek());

        // Month navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.navigateMonth(1));
        document.getElementById('thisMonthBtn')?.addEventListener('click', () => this.goToThisMonth());

        // Collection items
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.addTask());
        document.getElementById('taskInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('addIdeaBtn')?.addEventListener('click', () => this.addIdea());
        document.getElementById('ideaInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addIdea();
        });

        // Time-block grid
        document.getElementById('addColumnBtn')?.addEventListener('click', () => this.addRepairColumn());

        // Metrics
        document.getElementById('shutdownComplete')?.addEventListener('change', (e) => {
            this.toggleShutdown(e.target.checked);
        });

        // Modals
        document.getElementById('helpBtn')?.addEventListener('click', () => this.showHelp());
        document.getElementById('closeHelpModal')?.addEventListener('click', () => this.closeModal('helpModal'));
        document.getElementById('closeBlockEditor')?.addEventListener('click', () => this.closeModal('blockEditorModal'));
        document.getElementById('cancelBlockEdit')?.addEventListener('click', () => this.closeModal('blockEditorModal'));
        document.getElementById('saveBlockBtn')?.addEventListener('click', () => this.saveBlock());
        document.getElementById('deleteBlockBtn')?.addEventListener('click', () => this.deleteBlock());

        // Settings
        document.getElementById('workStartTime')?.addEventListener('change', (e) => {
            this.state.settings.workingHoursStart = e.target.value;
            this.state.saveSettings();
            this.renderDailyView();
        });
        document.getElementById('workEndTime')?.addEventListener('change', (e) => {
            this.state.settings.workingHoursEnd = e.target.value;
            this.state.saveSettings();
            this.renderDailyView();
        });
        document.getElementById('exportDataBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn')?.addEventListener('click', () => {
            document.getElementById('importDataFile').click();
        });
        document.getElementById('importDataFile')?.addEventListener('change', (e) => this.importData(e));
        document.getElementById('clearDataBtn')?.addEventListener('click', () => this.clearData());
        document.getElementById('showOnboardingBtn')?.addEventListener('click', () => this.showOnboarding());
        document.getElementById('showMethodologyBtn')?.addEventListener('click', () => this.showHelp());

        // Export
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportToPDF());

        // Help triggers
        document.querySelectorAll('.help-trigger').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const topic = e.currentTarget.dataset.topic;
                this.showHelpTopic(topic);
            });
        });

        // Onboarding
        document.getElementById('nextOnboarding')?.addEventListener('click', () => this.nextOnboardingStep());
        document.getElementById('skipOnboarding')?.addEventListener('click', () => this.skipOnboarding());

        // Weekly notes
        document.getElementById('weeklyNotes')?.addEventListener('input', (e) => {
            const TBP = getTBP();
            const weekKey = TBP.getWeekNumber(this.currentDate);
            const plan = this.state.getWeeklyPlan(weekKey);
            plan.planningNotes = e.target.value;
            this.state.saveData();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // ============================================
    // View Management
    // ============================================

    switchView(viewName) {
        this.currentView = viewName;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });
        
        // Update view containers
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${viewName}View`)?.classList.add('active');
        
        // Render the view
        this.renderCurrentView();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'daily':
                this.renderDailyView();
                break;
            case 'weekly':
                this.renderWeeklyView();
                break;
            case 'monthly':
                this.renderMonthlyView();
                break;
            case 'settings':
                this.renderSettingsView();
                break;
        }
    }

    // ============================================
    // Daily View
    // ============================================

    renderDailyView() {
        const TBP = getTBP();
        const dayData = this.state.getDayData(this.currentDate);
        
        // Update date picker
        const datePicker = document.getElementById('currentDate');
        if (datePicker) {
            datePicker.value = TBP.formatDate(this.currentDate);
        }
        
        // Update title
        const title = document.getElementById('dailyViewTitle');
        if (title) {
            title.textContent = TBP.formatDateLong(this.currentDate);
        }
        
        // Render components
        this.renderTimeBlockGrid(dayData);
        this.renderCollectionColumns(dayData);
        this.renderMetrics(dayData);
    }

    renderTimeBlockGrid(dayData) {
        const TBP = getTBP();
        const container = document.getElementById('timeblockGrid');
        if (!container) return;
        
        const generator = new TBP.TimeGridGenerator(
            this.state.settings.workingHoursStart,
            this.state.settings.workingHoursEnd
        );
        const timeSlots = generator.generateTimeSlots();
        
        // Set column count
        container.style.setProperty('--column-count', dayData.repairColumns);
        
        // Clear and rebuild grid
        container.innerHTML = '';
        
        // Create grid structure
        timeSlots.forEach((slot) => {
            // Time label
            if (slot.isHour) {
                const label = document.createElement('div');
                label.className = 'time-label';
                label.textContent = slot.time;
                container.appendChild(label);
            } else {
                const label = document.createElement('div');
                label.className = 'time-label';
                container.appendChild(label);
            }
            
            // Time cells for each column
            for (let col = 0; col < dayData.repairColumns; col++) {
                const cell = document.createElement('div');
                cell.className = 'time-cell';
                if (!slot.isHour) {
                    cell.classList.add('half-hour');
                }
                cell.dataset.time = slot.time;
                cell.dataset.column = col;
                
                // Add click handler for creating blocks
                cell.addEventListener('click', (e) => {
                    if (e.target === cell) {
                        this.createBlockAtTime(slot.time, col);
                    }
                });
                
                container.appendChild(cell);
            }
        });
        
        // Render existing blocks
        this.renderTimeBlocks(dayData, container);
    }

    renderTimeBlocks(dayData, container) {
        const TBP = getTBP();
        const generator = new TBP.TimeGridGenerator(
            this.state.settings.workingHoursStart,
            this.state.settings.workingHoursEnd
        );
        
        dayData.timeBlocks.forEach(block => {
            const blockEl = document.createElement('div');
            blockEl.className = `time-block ${block.type}`;
            blockEl.dataset.blockId = block.id;
            
            if (block.completed) {
                blockEl.classList.add('completed');
            }
            if (block.crossedOut) {
                blockEl.classList.add('crossed-out');
            }
            if (this.selectedBlock === block.id) {
                blockEl.classList.add('selected');
            }
            
            const { top, height } = generator.calculateBlockPosition(block.startTime, block.endTime);
            blockEl.style.top = `${top}px`;
            blockEl.style.height = `${height}px`;
            
            blockEl.innerHTML = `
                <div class="block-title">${this.escapeHtml(block.title)}</div>
                <div class="block-time">${block.startTime} - ${block.endTime}</div>
            `;
            
            blockEl.addEventListener('click', () => this.editBlock(block.id));
            
            // Find the appropriate cell to append to
            const cells = container.querySelectorAll('.time-cell');
            const columnCells = Array.from(cells).filter(cell => 
                parseInt(cell.dataset.column) === block.column
            );
            
            if (columnCells.length > 0) {
                columnCells[0].style.position = 'relative';
                columnCells[0].appendChild(blockEl);
            }
        });
    }

    createBlockAtTime(time, column) {
        const TBP = getTBP();
        const dayData = this.state.getDayData(this.currentDate);
        
        // Calculate end time (default 1 hour)
        const startMinutes = TBP.timeToMinutes(time);
        const endMinutes = startMinutes + 60;
        const endTime = TBP.minutesToTime(endMinutes);
        
        const newBlock = {
            startTime: time,
            endTime: endTime,
            column: column,
            title: 'New Block',
            type: 'admin'
        };
        
        dayData.addTimeBlock(newBlock);
        this.state.saveData();
        this.renderDailyView();
        
        // Open editor for the new block
        const addedBlock = dayData.timeBlocks[dayData.timeBlocks.length - 1];
        this.editBlock(addedBlock.id);
    }

    editBlock(blockId) {
        const dayData = this.state.getDayData(this.currentDate);
        const block = dayData.getTimeBlock(blockId);
        
        if (!block) return;
        
        this.selectedBlock = blockId;
        
        // Populate form
        document.getElementById('blockTitle').value = block.title;
        document.getElementById('blockType').value = block.type;
        document.getElementById('blockStartTime').value = block.startTime;
        document.getElementById('blockEndTime').value = block.endTime;
        document.getElementById('blockCompleted').checked = block.completed;
        
        this.openModal('blockEditorModal');
    }

    saveBlock() {
        if (!this.selectedBlock) return;
        
        const TBP = getTBP();
        const dayData = this.state.getDayData(this.currentDate);
        const title = document.getElementById('blockTitle').value.trim();
        const type = document.getElementById('blockType').value;
        const startTime = document.getElementById('blockStartTime').value;
        const endTime = document.getElementById('blockEndTime').value;
        const completed = document.getElementById('blockCompleted').checked;
        
        // Validation
        if (!title) {
            alert('Please enter a title for the block');
            return;
        }
        
        if (TBP.timeToMinutes(startTime) >= TBP.timeToMinutes(endTime)) {
            alert('End time must be after start time');
            return;
        }
        
        dayData.updateTimeBlock(this.selectedBlock, {
            title,
            type,
            startTime,
            endTime,
            completed
        });
        
        dayData.calculateMetrics();
        this.state.saveData();
        this.closeModal('blockEditorModal');
        this.selectedBlock = null;
        this.renderDailyView();
    }

    deleteBlock() {
        if (!this.selectedBlock) return;
        
        if (confirm('Are you sure you want to delete this block?')) {
            const dayData = this.state.getDayData(this.currentDate);
            dayData.removeTimeBlock(this.selectedBlock);
            dayData.calculateMetrics();
            this.state.saveData();
            this.closeModal('blockEditorModal');
            this.selectedBlock = null;
            this.renderDailyView();
        }
    }

    addRepairColumn() {
        const dayData = this.state.getDayData(this.currentDate);
        if (dayData.repairColumns < 4) {
            dayData.repairColumns++;
            this.state.saveData();
            this.renderDailyView();
        } else {
            alert('Maximum 4 repair columns allowed');
        }
    }

    // ============================================
    // Collection Columns
    // ============================================

    renderCollectionColumns(dayData) {
        this.renderTasksList(dayData);
        this.renderIdeasList(dayData);
    }

    renderTasksList(dayData) {
        const list = document.getElementById('tasksList');
        if (!list) return;
        
        list.innerHTML = '';
        
        dayData.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'collection-item';
            if (task.processed) {
                li.classList.add('processed');
            }
            li.dataset.itemId = task.id;
            
            li.innerHTML = `
                <span class="collection-item-text">${this.escapeHtml(task.text)}</span>
                <div class="collection-item-actions">
                    <button class="item-action-btn" onclick="app.toggleTaskProcessed('${task.id}')" title="Mark as processed">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    <button class="item-action-btn" onclick="app.deleteTask('${task.id}')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
            
            list.appendChild(li);
        });
    }

    renderIdeasList(dayData) {
        const list = document.getElementById('ideasList');
        if (!list) return;
        
        list.innerHTML = '';
        
        dayData.ideas.forEach(idea => {
            const li = document.createElement('li');
            li.className = 'collection-item';
            if (idea.processed) {
                li.classList.add('processed');
            }
            li.dataset.itemId = idea.id;
            
            li.innerHTML = `
                <span class="collection-item-text">${this.escapeHtml(idea.text)}</span>
                <div class="collection-item-actions">
                    <button class="item-action-btn" onclick="app.toggleIdeaProcessed('${idea.id}')" title="Mark as processed">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    <button class="item-action-btn" onclick="app.deleteIdea('${idea.id}')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
            
            list.appendChild(li);
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (text) {
            const dayData = this.state.getDayData(this.currentDate);
            dayData.addTask(text);
            this.state.saveData();
            input.value = '';
            this.renderTasksList(dayData);
        }
    }

    addIdea() {
        const input = document.getElementById('ideaInput');
        const text = input.value.trim();
        
        if (text) {
            const dayData = this.state.getDayData(this.currentDate);
            dayData.addIdea(text);
            this.state.saveData();
            input.value = '';
            this.renderIdeasList(dayData);
        }
    }

    toggleTaskProcessed(taskId) {
        const dayData = this.state.getDayData(this.currentDate);
        dayData.toggleTaskProcessed(taskId);
        this.state.saveData();
        this.renderTasksList(dayData);
    }

    toggleIdeaProcessed(ideaId) {
        const dayData = this.state.getDayData(this.currentDate);
        dayData.toggleIdeaProcessed(ideaId);
        this.state.saveData();
        this.renderIdeasList(dayData);
    }

    deleteTask(taskId) {
        const dayData = this.state.getDayData(this.currentDate);
        dayData.removeTask(taskId);
        this.state.saveData();
        this.renderTasksList(dayData);
    }

    deleteIdea(ideaId) {
        const dayData = this.state.getDayData(this.currentDate);
        dayData.removeIdea(ideaId);
        this.state.saveData();
        this.renderIdeasList(dayData);
    }

    // ============================================
    // Metrics
    // ============================================

    renderMetrics(dayData) {
        const container = document.getElementById('metricsList');
        if (!container) return;
        
        dayData.calculateMetrics();
        
        container.innerHTML = '';
        
        this.state.metrics.forEach(metric => {
            const value = dayData.metricValues[metric.id] || metric.defaultValue;
            
            const metricEl = document.createElement('div');
            metricEl.className = 'metric-item';
            
            if (metric.type === 'number' || metric.type === 'time') {
                metricEl.innerHTML = `
                    <label class="metric-label">${this.escapeHtml(metric.name)}</label>
                    <div class="metric-value">
                        <input type="number" 
                               class="metric-input" 
                               value="${value}" 
                               step="0.5"
                               min="0"
                               data-metric-id="${metric.id}"
                               onchange="app.updateMetric('${metric.id}', this.value)">
                        <span class="metric-unit">${metric.unit || ''}</span>
                    </div>
                `;
            } else if (metric.type === 'checkbox') {
                metricEl.innerHTML = `
                    <label class="checkbox-label">
                        <input type="checkbox" 
                               ${value ? 'checked' : ''}
                               data-metric-id="${metric.id}"
                               onchange="app.updateMetric('${metric.id}', this.checked)">
                        <span>${this.escapeHtml(metric.name)}</span>
                    </label>
                `;
            }
            
            container.appendChild(metricEl);
        });
        
        // Update shutdown checkbox
        const shutdownCheckbox = document.getElementById('shutdownComplete');
        if (shutdownCheckbox) {
            shutdownCheckbox.checked = dayData.shutdownComplete;
        }
    }

    updateMetric(metricId, value) {
        const dayData = this.state.getDayData(this.currentDate);
        dayData.metricValues[metricId] = parseFloat(value) || 0;
        this.state.saveData();
    }

    toggleShutdown(checked) {
        const dayData = this.state.getDayData(this.currentDate);
        
        if (checked) {
            // Show shutdown ritual checklist
            const confirmed = confirm(
                'Shutdown Ritual Checklist:\n\n' +
                '✓ Have you reviewed your collection columns?\n' +
                '✓ Have you checked your calendar for tomorrow?\n' +
                '✓ Have you updated your weekly plan if needed?\n\n' +
                'Mark shutdown as complete?'
            );
            
            if (confirmed) {
                dayData.shutdownComplete = true;
                this.state.saveData();
            } else {
                document.getElementById('shutdownComplete').checked = false;
            }
        } else {
            dayData.shutdownComplete = false;
            this.state.saveData();
        }
    }

    // ============================================
    // Weekly View
    // ============================================

    renderWeeklyView() {
        const TBP = getTBP();
        const weekKey = TBP.getWeekNumber(this.currentDate);
        const weekDates = TBP.getWeekDates(weekKey);
        const weeklyPlan = this.state.getWeeklyPlan(weekKey);
        
        // Update title
        const title = document.getElementById('weeklyViewTitle');
        if (title) {
            const startDate = TBP.formatDateShort(weekDates[0]);
            const endDate = TBP.formatDateShort(weekDates[6]);
            title.textContent = `Week of ${startDate} - ${endDate}`;
        }
        
        // Update notes
        const notesTextarea = document.getElementById('weeklyNotes');
        if (notesTextarea) {
            notesTextarea.value = weeklyPlan.planningNotes;
        }
        
        // Render week overview
        this.renderWeekOverview(weekDates);
        
        // Calculate and display summary
        this.renderWeeklySummary(weekDates);
    }

    renderWeekOverview(weekDates) {
        const TBP = getTBP();
        const container = document.getElementById('weekOverview');
        if (!container) return;
        
        container.innerHTML = '';
        
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        weekDates.forEach((date, dayIndex) => {
            const dayData = this.state.getDayData(date);
            const card = document.createElement('div');
            card.className = 'day-card';
            
            card.innerHTML = `
                <div class="day-card-header">
                    <div class="day-name">${dayNames[dayIndex]}</div>
                    <div class="day-date">${date.getDate()}</div>
                </div>
                <div class="day-blocks" id="dayBlocks${dayIndex}"></div>
            `;
            
            card.addEventListener('click', () => {
                this.currentDate = date;
                this.switchView('daily');
            });
            
            container.appendChild(card);
            
            // Render mini blocks
            const blocksContainer = card.querySelector(`#dayBlocks${dayIndex}`);
            dayData.timeBlocks.slice(0, 6).forEach(block => {
                const miniBlock = document.createElement('div');
                miniBlock.className = `day-block-mini ${block.type}`;
                miniBlock.textContent = block.title;
                miniBlock.style.backgroundColor = TBP.BLOCK_TYPES[block.type].color;
                miniBlock.style.color = TBP.BLOCK_TYPES[block.type].textColor;
                blocksContainer.appendChild(miniBlock);
            });
        });
    }

    renderWeeklySummary(weekDates) {
        let totalDeepWork = 0;
        let totalBlocks = 0;
        
        weekDates.forEach(date => {
            const dayData = this.state.getDayData(date);
            dayData.calculateMetrics();
            totalDeepWork += dayData.metricValues.deepWorkHours || 0;
            totalBlocks += dayData.metricValues.blocksCompleted || 0;
        });
        
        const deepWorkEl = document.getElementById('weeklyDeepWork');
        const blocksEl = document.getElementById('weeklyBlocks');
        
        if (deepWorkEl) deepWorkEl.textContent = totalDeepWork.toFixed(1);
        if (blocksEl) blocksEl.textContent = totalBlocks;
    }

    // ============================================
    // Monthly View
    // ============================================

    renderMonthlyView() {
        const TBP = getTBP();
        const title = document.getElementById('monthlyViewTitle');
        if (title) {
            title.textContent = TBP.getMonthName(this.currentDate);
        }
        
        this.renderMonthlyCalendar();
    }

    renderMonthlyCalendar() {
        const TBP = getTBP();
        const container = document.getElementById('monthlyCalendar');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'calendar-header';
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(name => {
            const dayName = document.createElement('div');
            dayName.className = 'calendar-day-name';
            dayName.textContent = name;
            header.appendChild(dayName);
        });
        container.appendChild(header);
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const today = new Date();
        const todayStr = TBP.formatDate(today);
        
        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const dayEl = this.createCalendarDay(day, true);
            grid.appendChild(dayEl);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = TBP.formatDate(date);
            const isToday = dateStr === todayStr;
            const dayData = this.state.getDayData(date);
            
            const dayEl = this.createCalendarDay(day, false, isToday, dayData.timeBlocks.length);
            dayEl.addEventListener('click', () => {
                this.currentDate = date;
                this.switchView('daily');
            });
            
            grid.appendChild(dayEl);
        }
        
        // Next month days
        const remainingDays = 42 - (startDay + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
            const dayEl = this.createCalendarDay(day, true);
            grid.appendChild(dayEl);
        }
        
        container.appendChild(grid);
    }

    createCalendarDay(day, otherMonth, isToday = false, blockCount = 0) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        if (otherMonth) {
            dayEl.classList.add('other-month');
        }
        if (isToday) {
            dayEl.classList.add('today');
        }
        
        dayEl.innerHTML = `
            <div class="calendar-day-number">${day}</div>
            <div class="calendar-day-dots">
                ${Array(Math.min(blockCount, 5)).fill('<div class="calendar-dot"></div>').join('')}
            </div>
        `;
        
        return dayEl;
    }

    // ============================================
    // Settings View
    // ============================================

    renderSettingsView() {
        // Update working hours
        document.getElementById('workStartTime').value = this.state.settings.workingHoursStart;
        document.getElementById('workEndTime').value = this.state.settings.workingHoursEnd;
        
        // Render metrics config
        this.renderMetricsConfig();
    }

    renderMetricsConfig() {
        const container = document.getElementById('metricsConfig');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.state.metrics.forEach(metric => {
            const metricEl = document.createElement('div');
            metricEl.className = 'settings-group';
            metricEl.innerHTML = `
                <label>${this.escapeHtml(metric.name)} (${metric.type})</label>
                <p style="font-size: 0.875rem; color: var(--text-secondary);">
                    ${metric.id === 'deepWorkHours' || metric.id === 'blocksCompleted' ? 'Auto-calculated' : 'Custom metric'}
                </p>
            `;
            container.appendChild(metricEl);
        });
    }

    // ============================================
    // Navigation
    // ============================================

    navigateDay(delta) {
        this.currentDate.setDate(this.currentDate.getDate() + delta);
        this.renderDailyView();
        this.importGoogleCalendarEvents();
    }

    navigateWeek(delta) {
        this.currentDate.setDate(this.currentDate.getDate() + (delta * 7));
        this.renderWeeklyView();
    }

    navigateMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderMonthlyView();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderDailyView();
        this.importGoogleCalendarEvents();
    }

    goToThisWeek() {
        this.currentDate = new Date();
        this.renderWeeklyView();
    }

    goToThisMonth() {
        this.currentDate = new Date();
        this.renderMonthlyView();
    }

    // ============================================
    // Modals
    // ============================================

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    showHelp() {
        const TBP = getTBP();
        const body = document.getElementById('helpModalBody');
        
        if (!body) return;
        
        body.innerHTML = '<div class="help-content">';
        
        Object.keys(TBP.METHODOLOGY).forEach(key => {
            const topic = TBP.METHODOLOGY[key];
            body.innerHTML += `
                <div class="help-section">
                    <h3>${topic.title}</h3>
                    <p>${topic.full}</p>
                    <p class="source">— ${topic.source}</p>
                </div>
            `;
        });
        
        body.innerHTML += '</div>';
        
        this.openModal('helpModal');
    }

    showHelpTopic(topicKey) {
        const TBP = getTBP();
        const topic = TBP.METHODOLOGY[topicKey];
        if (!topic) return;
        
        const body = document.getElementById('helpModalBody');
        
        if (!body) return;
        
        body.innerHTML = `
            <div class="help-content">
                <div class="help-section">
                    <h3>${topic.title}</h3>
                    <p>${topic.full}</p>
                    <p class="source">— ${topic.source}</p>
                </div>
            </div>
        `;
        
        this.openModal('helpModal');
    }

    // ============================================
    // Onboarding
    // ============================================

    showOnboarding() {
        const steps = [
            {
                title: 'Welcome to Time-Block Planner',
                content: `
                    <p>This planner implements Cal Newport's time-blocking methodology—a powerful system for managing your time and attention.</p>
                    <p><strong>Key Principle:</strong> Instead of trying to cross things off a task list, you'll partition your time into blocks and assign specific work to them.</p>
                `
            },
            {
                title: 'The Time-Block Grid',
                content: `
                    <p>The center of your daily view shows your time-block schedule. Click on any time slot to create a new block.</p>
                    <p>You can create different types of blocks: Deep Work, Admin, Priority, Growth, and Breaks.</p>
                `
            },
            {
                title: 'Collection Columns',
                content: `
                    <p>Use the Tasks and Ideas columns on the left to capture cognitive intrusions—things that come up while you're working.</p>
                    <p>Write them down and return to your current block. You can process them later.</p>
                `
            },
            {
                title: 'Schedule Repairs',
                content: `
                    <p>When circumstances upend your schedule, don't abandon it—fix it! Click "Add Repair Column" to create a revised plan for the remaining time.</p>
                    <p>This isn't failure; it's an expected part of the strategy.</p>
                `
            },
            {
                title: 'Shutdown Ritual',
                content: `
                    <p>At the end of each day, complete your shutdown ritual. Review your collections, check tomorrow's calendar, and mark "Shutdown Complete."</p>
                    <p>This helps your mind fully disengage from work.</p>
                `
            }
        ];
        
        let currentStep = 0;
        
        const title = document.getElementById('onboardingTitle');
        const body = document.getElementById('onboardingBody');
        const nextBtn = document.getElementById('nextOnboarding');
        
        const showStep = () => {
            const step = steps[currentStep];
            if (title) title.textContent = step.title;
            if (body) body.innerHTML = step.content;
            
            if (nextBtn) {
                if (currentStep === steps.length - 1) {
                    nextBtn.textContent = 'Get Started';
                } else {
                    nextBtn.textContent = 'Next';
                }
            }
        };
        
        if (nextBtn) {
            nextBtn.onclick = () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep();
                } else {
                    this.state.completeOnboarding();
                    this.closeModal('onboardingModal');
                }
            };
        }
        
        showStep();
        this.openModal('onboardingModal');
    }

    nextOnboardingStep() {
        // Handled in showOnboarding
    }

    skipOnboarding() {
        this.state.completeOnboarding();
        this.closeModal('onboardingModal');
    }

    // ============================================
    // Data Management
    // ============================================

    exportData() {
        const TBP = getTBP();
        const data = this.state.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeblock-planner-${TBP.formatDate(new Date())}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const success = this.state.importData(e.target.result);
            if (success) {
                alert('Data imported successfully!');
                this.renderCurrentView();
            } else {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    clearData() {
        if (this.state.clearAllData()) {
            alert('All data cleared.');
            this.renderCurrentView();
        }
    }

    exportToPDF() {
        alert('PDF export functionality requires a PDF library. For now, use your browser\'s Print function (Ctrl/Cmd + P) to save as PDF.');
        window.print();
    }

    // ============================================
    // Keyboard Shortcuts
    // ============================================

    handleKeyboardShortcuts(e) {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowLeft':
                if (this.currentView === 'daily') this.navigateDay(-1);
                break;
            case 'ArrowRight':
                if (this.currentView === 'daily') this.navigateDay(1);
                break;
            case 'w':
                this.switchView('weekly');
                break;
            case 'd':
                this.switchView('daily');
                break;
            case 'm':
                this.switchView('monthly');
                break;
            case '?':
                this.showHelp();
                break;
        }
    }

    // ============================================
    // Google Calendar Integration
    // ============================================

    importGoogleCalendarEvents() {
        // Call Google Calendar import if connected
        if (window.GoogleCalendarIntegration && typeof window.GoogleCalendarIntegration.importEvents === 'function') {
            window.GoogleCalendarIntegration.importEvents();
        }
    }

    // ============================================
    // Utilities
    // ============================================

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// Initialize Application
// ============================================

let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new TimeBlockPlannerApp();
    window.app = app; // Make available globally for inline event handlers
});
