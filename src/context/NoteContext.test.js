import { renderHook, act } from '@testing-library/react';
import { NoteProvider, NoteContext } from './NoteContext';
import { useContext } from 'react';
import axios from 'axios';

jest.mock('axios');

jest.mock('socket.io-client', () => ({
  __esModule: true,
  io: jest.fn().mockReturnValue({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn()
  })
}));

describe('NoteContext', () => {
  it('should initialize with default state', () => {
    const wrapper = ({ children }) => <NoteProvider>{children}</NoteProvider>;
    const { result } = renderHook(() => useContext(NoteContext), { wrapper });

    expect(result.current.notes).toEqual([]);
    expect(result.current.folders).toEqual([]);
    expect(result.current.loading).toBeTruthy();
  });

  it('should fetch notes successfully', async () => {
    const wrapper = ({ children }) => <NoteProvider>{children}</NoteProvider>;
    const { result } = renderHook(() => useContext(NoteContext), { wrapper });

    const mockNotes = [{ _id: '1', title: 'Test Note' }];
    axios.get.mockResolvedValueOnce({ data: mockNotes });

    await act(async () => {
      await result.current.getNotes();
    });

    expect(result.current.notes).toEqual(mockNotes);
    expect(result.current.loading).toBeFalsy();
  });

  it('should filter notes correctly', async () => {
    const wrapper = ({ children }) => <NoteProvider>{children}</NoteProvider>;
    const { result } = renderHook(() => useContext(NoteContext), { wrapper });

    const mockNotes = [
      { _id: '1', title: 'React Hooks' },
      { _id: '2', title: 'NodeJS API' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockNotes });

    await act(async () => {
      await result.current.getNotes();
    });

    act(() => {
      result.current.filterNotes('React');
    });

    expect(result.current.filtered).toHaveLength(1);
    expect(result.current.filtered[0].title).toEqual('React Hooks');
  });

  it('should clear filter', async () => {
    const wrapper = ({ children }) => <NoteProvider>{children}</NoteProvider>;
    const { result } = renderHook(() => useContext(NoteContext), { wrapper });

    act(() => {
      result.current.clearFilter();
    });

    expect(result.current.filtered).toBeNull();
  });
});
