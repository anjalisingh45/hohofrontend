import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventAPI } from '../../services/api';

/* ────── CREATE EVENT (supports FormData) ────── */
export const createEvent = createAsyncThunk(
  'events/create',
  async (eventData, { rejectWithValue }) => {
    try {
      // eventData can be FormData (for logo + speaker photos) or regular object
      const response = await eventAPI.create(eventData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create event';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── FETCH ALL EVENTS ────── */
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getAll();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch events';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── FETCH SINGLE EVENT ────── */
export const fetchEvent = createAsyncThunk(
  'events/fetchOne',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getById(eventId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch event';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── FETCH PUBLIC EVENT (for registration page) ────── */
export const fetchPublicEvent = createAsyncThunk(
  'events/fetchPublic',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getPublicById(eventId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Event not found';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── FETCH EVENT REGISTRATIONS ────── */
export const fetchEventRegistrations = createAsyncThunk(
  'events/fetchRegistrations',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventAPI.getRegistrations(eventId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch registrations';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── UPDATE EVENT ────── */
export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await eventAPI.update(eventId, eventData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update event';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── DELETE EVENT ────── */
export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await eventAPI.delete(eventId);
      return { eventId, ...response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete event';
      return rejectWithValue(errorMessage);
    }
  }
);

/* ────── EVENT SLICE ────── */
const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    currentEvent: null,
    registrations: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
    totalEvents: 0,
    hasMore: true,
  },
  reducers: {
    // Clear all errors
    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    
    // Clear specific errors
    clearCreateError: (state) => {
      state.createError = null;
    },
    
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    
    // Clear current event
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    
    // Clear registrations
    clearRegistrations: (state) => {
      state.registrations = [];
    },
    
    // Reset entire events state
    resetEventsState: (state) => {
      state.events = [];
      state.currentEvent = null;
      state.registrations = [];
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.totalEvents = 0;
      state.hasMore = true;
    },
    
    // Set current event (manual)
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    
    // Add new registration to current registrations
    addRegistration: (state, action) => {
      state.registrations.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ═══════ CREATE EVENT ═══════
      .addCase(createEvent.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isCreating = false;
        state.events.unshift(action.payload.event);
        state.currentEvent = action.payload.event;
        state.totalEvents += 1;
        state.createError = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload;
      })
      
      // ═══════ FETCH ALL EVENTS ═══════
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events || [];
        state.totalEvents = action.payload.total || action.payload.events?.length || 0;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.events = [];
      })
      
      // ═══════ FETCH SINGLE EVENT ═══════
      .addCase(fetchEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload.event;
        state.error = null;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentEvent = null;
      })
      
      // ═══════ FETCH PUBLIC EVENT ═══════
      .addCase(fetchPublicEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload.event;
        state.error = null;
      })
      .addCase(fetchPublicEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentEvent = null;
      })
      
      // ═══════ FETCH REGISTRATIONS ═══════
      .addCase(fetchEventRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrations = action.payload.registrations || [];
        state.error = null;
      })
      .addCase(fetchEventRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrations = [];
      })
      
      // ═══════ UPDATE EVENT ═══════
      .addCase(updateEvent.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updatedEvent = action.payload.event;
        const index = state.events.findIndex(event => event._id === updatedEvent._id);
        if (index !== -1) {
          state.events[index] = updatedEvent;
        }
        if (state.currentEvent?._id === updatedEvent._id) {
          state.currentEvent = updatedEvent;
        }
        state.updateError = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // ═══════ DELETE EVENT ═══════
      .addCase(deleteEvent.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isDeleting = false;
        const deletedEventId = action.payload.eventId;
        state.events = state.events.filter(event => event._id !== deletedEventId);
        if (state.currentEvent?._id === deletedEventId) {
          state.currentEvent = null;
        }
        state.totalEvents = Math.max(0, state.totalEvents - 1);
        state.deleteError = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
      });
  },
});

export const {
  clearError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearCurrentEvent,
  clearRegistrations,
  resetEventsState,
  setCurrentEvent,
  addRegistration,
} = eventSlice.actions;

export default eventSlice.reducer;
