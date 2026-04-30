import { render, screen, fireEvent, act } from '@testing-library/react';
import NoteForm from './NoteForm';
import { NoteContext } from '../../context/NoteContext';

describe('NoteForm', () => {
  const mockAddNote = jest.fn();
  const mockUpdateNote = jest.fn();
  const mockClearCurrent = jest.fn();

  const renderWithContext = (current = null) => {
    return render(
      <NoteContext.Provider value={{
        addNote: mockAddNote,
        updateNote: mockUpdateNote,
        current,
        clearCurrent: mockClearCurrent,
        folders: []
      }}>
        <NoteForm />
      </NoteContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for adding a note', () => {
    renderWithContext();
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: /Add Note/i })).toBeDefined();
  });

  it('renders correctly for updating a note', () => {
    const currentNote = { _id: '1', title: 'Test Title', content: 'Test Content', color: '#ffffff' };
    renderWithContext(currentNote);
    
    expect(screen.getByDisplayValue('Test Title')).toBeDefined();
    expect(screen.getByRole('button', { name: /Update Note/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDefined();
  });

  it('handles form submission for adding', async () => {
    renderWithContext();
    
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'New Note' } });
    fireEvent.change(textboxes[1], { target: { value: 'Content here' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Add Note/i }));
    });
    
    expect(mockAddNote).toHaveBeenCalledTimes(1);
    expect(mockAddNote).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Note',
      description: 'Content here'
    }));
  });

  it('clears form when clear button is clicked', () => {
    const currentNote = { _id: '1', title: 'Test Title', content: 'Test Content', color: '#ffffff' };
    renderWithContext(currentNote);
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    expect(mockClearCurrent).toHaveBeenCalledTimes(1);
  });
});
