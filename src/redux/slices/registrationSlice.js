import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registrationAPI } from '../../services/api';

export const exportRegistrations = createAsyncThunk(
  'registrations/export',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await registrationAPI.export(eventId);
      
      // Create blob and download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `registrations_${eventId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Export failed');
    }
  }
);

const registrationSlice = createSlice({
  name: 'registrations',
  initialState: {
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportRegistrations.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = registrationSlice.actions;
export default registrationSlice.reducer;
