import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SettlementList from './SettlementList';
import type { Settlement } from '../types/settlement';

function settlement(overrides: Partial<Settlement>): Settlement {
  return {
    id: 'test-settlement',
    name: 'Test Settlement',
    administratorUrl: 'https://example-settlement-administrator.test/',
    deadline: '2099-01-01',
    summary: 'A test settlement.',
    eligibilityQuestions: [],
    claimFields: [],
    ...overrides,
  };
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('SettlementList', () => {
  it('shows a closing-soon badge for a settlement within the threshold', () => {
    render(
      <MemoryRouter>
        <SettlementList settlements={[settlement({ id: 'soon', deadline: daysFromNow(7) })]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/closing in \d+ days?/i)).toBeInTheDocument();
  });

  it('does not show a badge for a settlement far from its deadline', () => {
    render(
      <MemoryRouter>
        <SettlementList settlements={[settlement({ id: 'far', deadline: daysFromNow(60) })]} />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/closing in/i)).not.toBeInTheDocument();
  });

  it('renders the empty state when there are no settlements', () => {
    render(
      <MemoryRouter>
        <SettlementList settlements={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/no open settlements/i)).toBeInTheDocument();
  });
});
