import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClaimForm from './ClaimForm';
import { loadSavedProfile, saveProfile } from '../lib/savedProfile';

const fields = [
  { id: 'fullName', label: 'Full legal name', type: 'text' as const },
  { id: 'email', label: 'Email address', type: 'email' as const },
  { id: 'vin', label: 'Vehicle Identification Number (VIN)', type: 'text' as const },
];

beforeEach(() => {
  localStorage.clear();
});

describe('ClaimForm saved profile', () => {
  it('does not show the clear-saved-info action when nothing is saved', () => {
    render(<ClaimForm fields={fields} onSubmit={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /clear saved info/i })).not.toBeInTheDocument();
  });

  it('pre-fills only the reusable profile fields from a saved profile, never settlement-specific ones', () => {
    saveProfile({ fullName: 'Jane Doe', email: 'jane@example.com' });
    render(<ClaimForm fields={fields} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Full legal name')).toHaveValue('Jane Doe');
    expect(screen.getByLabelText('Email address')).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/VIN/)).toHaveValue('');
  });

  it('saves the reusable fields on submit when "remember" is checked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ClaimForm fields={fields} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Full legal name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText(/VIN/), 'SOME-VIN-1');
    await user.click(screen.getByRole('checkbox', { name: /remember my name/i }));
    await user.click(screen.getByRole('button', { name: /preview my claim/i }));

    expect(onSubmit).toHaveBeenCalledWith({ fullName: 'Jane Doe', email: 'jane@example.com', vin: 'SOME-VIN-1' });
    expect(loadSavedProfile()).toEqual({ fullName: 'Jane Doe', email: 'jane@example.com' });
  });

  it('does not save anything when "remember" is left unchecked', async () => {
    const user = userEvent.setup();
    render(<ClaimForm fields={fields} onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText('Full legal name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email address'), 'jane@example.com');
    await user.type(screen.getByLabelText(/VIN/), 'SOME-VIN-1');
    await user.click(screen.getByRole('button', { name: /preview my claim/i }));

    expect(loadSavedProfile()).toEqual({});
  });

  it('clears the saved profile when "Clear saved info" is clicked', async () => {
    saveProfile({ fullName: 'Jane Doe', email: 'jane@example.com' });
    const user = userEvent.setup();
    render(<ClaimForm fields={fields} onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /clear saved info/i }));

    expect(loadSavedProfile()).toEqual({});
    expect(screen.queryByRole('button', { name: /clear saved info/i })).not.toBeInTheDocument();
  });
});
