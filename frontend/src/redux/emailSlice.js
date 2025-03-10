import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showStatus: false,
  showStopButton: false,
  totalEmails: 0,
  sentCount: 0,
  failedCount: 0,
  statusMessage: "",
  remainingTime: 0,
  isSending: false, // Added to track sending state
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    startSending: (state) => {
      state.isSending = true;
    },
    updateProgress: (state, action) => {
      const { totalEmails, successCount, failedCount, message, status } = action.payload;
      state.showStatus = true;
      state.showStopButton = true;
      state.isSending = true; // Ensure the button stays disabled during sending

      if (totalEmails !== undefined) state.totalEmails = totalEmails;
      if (successCount !== undefined) state.sentCount = successCount;
      if (failedCount !== undefined) state.failedCount = failedCount;
      if (message) state.statusMessage = message;

      if (totalEmails !== undefined && successCount !== undefined) {
        state.remainingTime = (totalEmails - successCount) * 40;
      }

      if (status === "stopped" || status === "completed") {
        state.isSending = false; // Stop sending when completed
      }
    },
    decrementRemainingTime: (state) => {
      if (state.remainingTime > 0) {
        state.remainingTime = Math.max(state.remainingTime - 1, 0);
      }
    },
    stopProcess: (state) => {
      state.showStatus = false;
      state.showStopButton = false;
      state.remainingTime = 0;
      state.statusMessage = "Process Stopped";
      state.isSending = false;
    },
    resetEmailState: () => initialState,
  },
});

export const { startSending, updateProgress, decrementRemainingTime, stopProcess, resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;
