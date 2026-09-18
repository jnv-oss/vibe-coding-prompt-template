import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ClaimPreview from './ClaimPreview';

const fields = [
  { id: 'fullName', label: 'Full legal name', type: 'text' as const },
  { id: 'orderNumber', label: 'Order number', type: 'text' as const, optional: true },
];

describe('ClaimPreview', () => {
  it('maps each field to its filled value', () => {
    render(
      <ClaimPreview
        fields={fields}
        values={{ fullName: 'Jane Doe', orderNumber: 'ABC123' }}
        administratorUrl="https://example-settlement-administrator.test/x"
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByText('Full legal name')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Order number')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('flags a missing required value instead of showing it as filled', () => {
    render(
      <ClaimPreview
        fields={fields}
        values={{ fullName: 'Jane Doe' }}
        administratorUrl="https://example-settlement-administrator.test/x"
        onBack={vi.fn()}
      />,
    );

    expect(screen.getByText(/missing/i)).toBeInTheDocument();
  });

  it('links to the official administrator site and never renders a submit action', () => {
    render(
      <ClaimPreview
        fields={fields}
        values={{ fullName: 'Jane Doe', orderNumber: 'ABC123' }}
        administratorUrl="https://example-settlement-administrator.test/x"
        onBack={vi.fn()}
      />,
    );

    const link = screen.getByRole('link', { name: /official site/i });
    expect(link).toHaveAttribute('href', 'https://example-settlement-administrator.test/x');
    expect(screen.queryByRole('button', { name: /^submit$/i })).not.toBeInTheDocument();
  });
});
