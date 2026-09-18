import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HomePage from './HomePage';

describe('HomePage filtering', () => {
  it('shows all open settlements with no filters applied', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /Lands' End Data Breach/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Deere Repair Services/ })).toBeInTheDocument();
  });

  it('narrows the list to one category when a category pill is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Antitrust' }));

    expect(screen.getByRole('link', { name: /Deere Repair Services/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Lands' End Data Breach/ })).not.toBeInTheDocument();
  });

  it('filters by search query across name and summary', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await user.type(screen.getByRole('searchbox'), 'airbag');

    expect(screen.getByRole('link', { name: /Hyundai and Kia/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Deere Repair Services/ })).not.toBeInTheDocument();
  });

  it('shows a no-match message when filters exclude everything', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    await user.type(screen.getByRole('searchbox'), 'not a real settlement keyword');

    expect(screen.getByText(/no settlements match/i)).toBeInTheDocument();
  });
});
