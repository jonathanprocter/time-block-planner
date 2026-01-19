/**
 * Time-Block Planner - Core Time-Blocking Functionality
 * Implements Cal Newport's Time-Blocking Methodology
 */

// ============================================
// Constants and Configuration
// ============================================

const STORAGE_KEYS = {
    APP_DATA: 'timeblock_planner_data',
    SETTINGS: 'timeblock_planner_settings',
    CURRENT_DATE: 'timeblock_planner_current_date',
    ONBOARDING_COMPLETE: 'timeblock_planner_onboarding'
};

const DEFAULT_SETTINGS = {
    workingHoursStart: '06:00',
    workingHoursEnd: '21:00',
    defaultBlockDuration: 60,
    blockTypeColors: {
        deepWork: '#3D5A73',
        admin: '#E8E4DE',
        priority: '#D4896A',
        growth: '#6B8F71',
        break: '#F7F5F2'
    },
    paperSize: 'letter',
    showPsychoeducation: true
};

const DEFAULT_METRICS = [
    {
        id: 'deepWorkHours',
        name: 'Deep Work Hours',
        type: 'number',
        defaultValue: 0,
        showInSummary: true,
        unit: 'hours'
    },
    {
        id: 'blocksCompleted',
        name: 'Blocks Completed',
        type: 'number',
        defaultValue: 0,
        showInSummary: true,
        unit: 'blocks'
    }
];

const BLOCK_TYPES = {
    deepWork: { label: 'Deep Work', color: '#3D5A73', textColor: '#ffffff' },
    admin: { label: 'Admin/Shallow', color: '#E8E4DE', textColor: '#2C3E44' },
    priority: { label: 'Priority', color: '#D4896A', textColor: '#ffffff' },
    growth: { label: 'Growth/Learning', color: '#6B8F71', textColor: '#ffffff' },
    break: { label: 'Break', color: '#F7F5F2', textColor: '#2C3E44' }
};

// Cal Newport's Methodology Content
const METHODOLOGY = {
    timeBlocking: {
        title: "The Power of Time Blocking",
        short: "Partition your time into blocks and assign specific work to each.",
        full: `Most people approach their workday by trying to cross things off a task list in the small slivers of time that remain between attending meetings and reacting to emails and instant messages. Time blocking, by contrast, requires you to figure out in advance how you want to spend every minute of your day. Instead of trying to generally "be productive," you partition your time into blocks and assign specific work to them. This critical shift from managing tasks to managing time can massively increase the amount of useful work you accomplish. It also provides an anxiety-reducing sense of control over your schedule.`,
        source: "Cal Newport, The Time-Block Planner"
    },
    scheduleRepair: {
        title: "Embrace Schedule Fixes",
        short: "When circumstances change, fix your schedule—don't abandon it.",
        full: `The goal of time blocking is not to stick to your original schedule no matter what. It's instead to try to always have an intentional plan for what to do with your time. If circumstances upend your schedule, this isn't a failure; it's an expected part of applying this strategy. When you next get a chance, simply fix the schedule for the time that remains in the day so that you remain intentional about where you direct your focus.`,
        source: "Cal Newport, The Time-Block Planner"
    },
    collection: {
        title: "Capture Cognitive Intrusions",
        short: "Write down interruptions to deal with later, then return to your current block.",
        full: `If while you're executing your time-block schedule you come across a new task or relevant idea, you can jot it down in these collection columns to deal with later, and then return immediately to executing the current block. By writing down these cognitive intrusions in a designated area, you avoid the need to divert your attention from the current time block to handle them in the moment. You can be confident you won't forget them.`,
        source: "Cal Newport, The Time-Block Planner"
    },
    metrics: {
        title: "Track What Matters",
        short: "Personal metrics nudge you toward behaviors that matter most.",
        full: `Some choices for what to schedule are obvious, like allocating blocks for appointments or urgent deadlines. But you'll often need to schedule discretionary, non-urgent endeavors. Personal metrics nudge you toward the long-term results that matter most. If something's important to you, track it. The knowledge that you'll be recording information about a key behavior at the end of the day can motivate you to dedicate time to that behavior when building your time-block schedule.`,
        source: "Cal Newport, The Time-Block Planner"
    },
    shutdown: {
        title: "The Shutdown Ritual",
        short: "End each day with a ritual that lets your mind fully disengage from work.",
        full: `At the end of each day's time-block schedule, your final step is to shut down work. Go through the tasks and ideas in your collection column, deciding for each what you want to do with it. Review any other potential sources of unresolved work obligations. The goal is to convince yourself that there's nothing being forgotten, or missed, or being kept track of only in your brain. Later in the evening, if work anxiety returns, remind yourself: "I wouldn't have checked the shutdown complete box if I hadn't completed the ritual."`,
        source: "Cal Newport, The Time-Block Planner"
    },
    weeklyPlan: {
        title: "Weekly/Daily Planning",
        short: "High-level weekly plans combine with detailed daily schedules.",
        full: `It's this combination of high-level weekly plans with detailed daily time-block schedules that unlocks the full potential of this productivity system. The weekly/daily approach allows you to move around obligations like pieces on a chessboard and construct configurations of your schedule that enable you to accomplish head-turning amounts of work, all while staying on top of the various small requests and tasks pulling at your time and attention.`,
        source: "Cal Newport, The Time-Block Planner"
    }
};

// ============================================
// Utility Functions
// ============================================

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function formatTime(hours, minutes) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

function timeToMinutes(timeString) {
    const { hours, minutes } = parseTime(timeString);
    return hours * 60 + minutes;
}

function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return formatTime(hours, mins);
}

function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getWeekDates(weekKey) {
    const [year, week] = weekKey.split('-W').map(Number);
    const jan4 = new Date(year, 0, 4);
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1 + (week - 1) * 7);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        dates.push(date);
    }
    return dates;
}

function formatDateLong(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateShort(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getMonthName(date) {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ============================================
// Storage Management
// ============================================

class StorageManager {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            if (error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please export and clear old data.');
            }
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
}

// ============================================
// Data Models
// ============================================

class TimeBlock {
    constructor(data = {}) {
        this.id = data.id || generateUUID();
        this.column = data.column || 0;
        this.startTime = data.startTime || '09:00';
        this.endTime = data.endTime || '10:00';
        this.title = data.title || 'Untitled Block';
        this.type = data.type || 'admin';
        this.completed = data.completed || false;
        this.crossedOut = data.crossedOut || false;
    }

    getDuration() {
        const start = timeToMinutes(this.startTime);
        const end = timeToMinutes(this.endTime);
        return (end - start) / 60; // Return hours
    }

    toJSON() {
        return {
            id: this.id,
            column: this.column,
            startTime: this.startTime,
            endTime: this.endTime,
            title: this.title,
            type: this.type,
            completed: this.completed,
            crossedOut: this.crossedOut
        };
    }
}

class CollectionItem {
    constructor(data = {}) {
        this.id = data.id || generateUUID();
        this.text = data.text || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.processed = data.processed || false;
        this.scheduledBlockId = data.scheduledBlockId || null;
    }

    toJSON() {
        return {
            id: this.id,
            text: this.text,
            createdAt: this.createdAt,
            processed: this.processed,
            scheduledBlockId: this.scheduledBlockId
        };
    }
}

class DayData {
    constructor(date, data = {}) {
        this.date = date;
        this.timeBlocks = (data.timeBlocks || []).map(b => new TimeBlock(b));
        this.repairColumns = data.repairColumns || 1;
        this.tasks = (data.tasks || []).map(t => new CollectionItem(t));
        this.ideas = (data.ideas || []).map(i => new CollectionItem(i));
        this.metricValues = data.metricValues || {};
        this.shutdownComplete = data.shutdownComplete || false;
        this.notes = data.notes || '';
    }

    addTimeBlock(block) {
        this.timeBlocks.push(new TimeBlock(block));
    }

    removeTimeBlock(blockId) {
        this.timeBlocks = this.timeBlocks.filter(b => b.id !== blockId);
    }

    updateTimeBlock(blockId, updates) {
        const block = this.timeBlocks.find(b => b.id === blockId);
        if (block) {
            Object.assign(block, updates);
        }
    }

    getTimeBlock(blockId) {
        return this.timeBlocks.find(b => b.id === blockId);
    }

    addTask(text) {
        const task = new CollectionItem({ text });
        this.tasks.push(task);
        return task;
    }

    addIdea(text) {
        const idea = new CollectionItem({ text });
        this.ideas.push(idea);
        return idea;
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
    }

    removeIdea(ideaId) {
        this.ideas = this.ideas.filter(i => i.id !== ideaId);
    }

    toggleTaskProcessed(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.processed = !task.processed;
        }
    }

    toggleIdeaProcessed(ideaId) {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (idea) {
            idea.processed = !idea.processed;
        }
    }

    calculateMetrics() {
        // Auto-calculate Deep Work Hours
        const deepWorkHours = this.timeBlocks
            .filter(b => b.type === 'deepWork' && b.completed)
            .reduce((sum, b) => sum + b.getDuration(), 0);
        
        // Auto-calculate Blocks Completed
        const blocksCompleted = this.timeBlocks.filter(b => b.completed).length;
        
        this.metricValues.deepWorkHours = deepWorkHours;
        this.metricValues.blocksCompleted = blocksCompleted;
    }

    toJSON() {
        return {
            date: this.date,
            timeBlocks: this.timeBlocks.map(b => b.toJSON()),
            repairColumns: this.repairColumns,
            tasks: this.tasks.map(t => t.toJSON()),
            ideas: this.ideas.map(i => i.toJSON()),
            metricValues: this.metricValues,
            shutdownComplete: this.shutdownComplete,
            notes: this.notes
        };
    }
}

class WeeklyPlan {
    constructor(weekKey, data = {}) {
        this.weekKey = weekKey;
        this.planningNotes = data.planningNotes || '';
        this.goals = data.goals || [];
        this.heuristics = data.heuristics || [];
        this.reviewNotes = data.reviewNotes || '';
    }

    toJSON() {
        return {
            weekKey: this.weekKey,
            planningNotes: this.planningNotes,
            goals: this.goals,
            heuristics: this.heuristics,
            reviewNotes: this.reviewNotes
        };
    }
}

// ============================================
// Application State Manager
// ============================================

class AppState {
    constructor() {
        this.settings = StorageManager.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
        this.days = {};
        this.weeklyPlans = {};
        this.metrics = DEFAULT_METRICS;
        this.currentDate = new Date();
        this.onboardingComplete = StorageManager.get(STORAGE_KEYS.ONBOARDING_COMPLETE, false);
        
        this.loadData();
    }

    loadData() {
        const data = StorageManager.get(STORAGE_KEYS.APP_DATA, {});
        
        // Load days
        if (data.days) {
            Object.keys(data.days).forEach(dateKey => {
                this.days[dateKey] = new DayData(dateKey, data.days[dateKey]);
            });
        }
        
        // Load weekly plans
        if (data.weeklyPlans) {
            Object.keys(data.weeklyPlans).forEach(weekKey => {
                this.weeklyPlans[weekKey] = new WeeklyPlan(weekKey, data.weeklyPlans[weekKey]);
            });
        }
        
        // Load custom metrics
        if (data.metrics) {
            this.metrics = data.metrics;
        }
    }

    saveData() {
        const data = {
            version: '1.0.0',
            days: {},
            weeklyPlans: {},
            metrics: this.metrics
        };
        
        // Save days
        Object.keys(this.days).forEach(dateKey => {
            data.days[dateKey] = this.days[dateKey].toJSON();
        });
        
        // Save weekly plans
        Object.keys(this.weeklyPlans).forEach(weekKey => {
            data.weeklyPlans[weekKey] = this.weeklyPlans[weekKey].toJSON();
        });
        
        StorageManager.set(STORAGE_KEYS.APP_DATA, data);
    }

    saveSettings() {
        StorageManager.set(STORAGE_KEYS.SETTINGS, this.settings);
    }

    getDayData(date) {
        const dateKey = formatDate(date);
        if (!this.days[dateKey]) {
            this.days[dateKey] = new DayData(dateKey);
        }
        return this.days[dateKey];
    }

    getWeeklyPlan(weekKey) {
        if (!this.weeklyPlans[weekKey]) {
            this.weeklyPlans[weekKey] = new WeeklyPlan(weekKey);
        }
        return this.weeklyPlans[weekKey];
    }

    exportData() {
        const data = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            settings: this.settings,
            days: {},
            weeklyPlans: {},
            metrics: this.metrics
        };
        
        Object.keys(this.days).forEach(dateKey => {
            data.days[dateKey] = this.days[dateKey].toJSON();
        });
        
        Object.keys(this.weeklyPlans).forEach(weekKey => {
            data.weeklyPlans[weekKey] = this.weeklyPlans[weekKey].toJSON();
        });
        
        return JSON.stringify(data, null, 2);
    }

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.settings) {
                this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
                this.saveSettings();
            }
            
            if (data.days) {
                Object.keys(data.days).forEach(dateKey => {
                    this.days[dateKey] = new DayData(dateKey, data.days[dateKey]);
                });
            }
            
            if (data.weeklyPlans) {
                Object.keys(data.weeklyPlans).forEach(weekKey => {
                    this.weeklyPlans[weekKey] = new WeeklyPlan(weekKey, data.weeklyPlans[weekKey]);
                });
            }
            
            if (data.metrics) {
                this.metrics = data.metrics;
            }
            
            this.saveData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.days = {};
            this.weeklyPlans = {};
            this.metrics = DEFAULT_METRICS;
            this.settings = DEFAULT_SETTINGS;
            StorageManager.clear();
            return true;
        }
        return false;
    }

    completeOnboarding() {
        this.onboardingComplete = true;
        StorageManager.set(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    }

    resetOnboarding() {
        this.onboardingComplete = false;
        StorageManager.set(STORAGE_KEYS.ONBOARDING_COMPLETE, false);
    }
}

// ============================================
// Time Grid Generator
// ============================================

class TimeGridGenerator {
    constructor(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    generateTimeSlots() {
        const slots = [];
        const start = timeToMinutes(this.startTime);
        const end = timeToMinutes(this.endTime);
        
        for (let minutes = start; minutes < end; minutes += 30) {
            const time = minutesToTime(minutes);
            const isHour = minutes % 60 === 0;
            slots.push({
                time,
                minutes,
                isHour,
                label: isHour ? time : ''
            });
        }
        
        return slots;
    }

    snapToGrid(timeString, snapMinutes = 15) {
        const minutes = timeToMinutes(timeString);
        const snapped = Math.round(minutes / snapMinutes) * snapMinutes;
        return minutesToTime(snapped);
    }

    calculateBlockPosition(startTime, endTime) {
        const gridStart = timeToMinutes(this.startTime);
        const blockStart = timeToMinutes(startTime);
        const blockEnd = timeToMinutes(endTime);

        // Grid has 30-minute slots, each 60px tall = 120px per hour
        const pixelsPerHour = 120;
        const top = ((blockStart - gridStart) / 60) * pixelsPerHour;
        const height = ((blockEnd - blockStart) / 60) * pixelsPerHour;

        return { top, height };
    }
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.TimeBlockPlanner = {
        StorageManager,
        TimeBlock,
        CollectionItem,
        DayData,
        WeeklyPlan,
        AppState,
        TimeGridGenerator,
        METHODOLOGY,
        BLOCK_TYPES,
        DEFAULT_SETTINGS,
        DEFAULT_METRICS,
        formatDate,
        parseDate,
        formatTime,
        parseTime,
        timeToMinutes,
        minutesToTime,
        getWeekNumber,
        getWeekDates,
        formatDateLong,
        formatDateShort,
        getMonthName,
        generateUUID
    };
}
