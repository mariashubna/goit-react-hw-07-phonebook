import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchContacts = createAsyncThunk('contacts/fetchAll', async () => {
  const response = await fetch('https://657da5c43e3f5b189462e242.mockapi.io/contacts');
  const data = await response.json();
  return data;
});

export const addContact = createAsyncThunk('contacts/addContact', async (newContact) => {
  const response = await fetch('https://657da5c43e3f5b189462e242.mockapi.io/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newContact),
  });
  const data = await response.json();
  return data;
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (contactId) => {
  await fetch(`https://657da5c43e3f5b189462e242.mockapi.io/contacts/${contactId}`, {
    method: 'DELETE',
  });
  return contactId;
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        const newContact = action.payload;
        // Check if the name already exists before adding
        if (!state.items.some((contact) => contact.name.toLowerCase() === newContact.name.toLowerCase())) {
          state.items.push(newContact);
        }
        state.isLoading = false;
      })
      .addCase(addContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((contact) => contact.id !== action.payload);
      });
  },
});

export const contactsReducer = contactsSlice.reducer;

