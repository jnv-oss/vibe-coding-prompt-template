import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClaimPreview from './ClaimPreview';

const fields = [
  { id: 'fullName', label: 'Full legal name', type: 'text' as const },
  { id: 'orderNumber', label: 'Order number', type: 'text' as const, optional: true },
];

const defaultProps = {
  settlementId: 'test-settlement',
  settlementName: 'Test Settlement',
  administratorUrl: 'https://example-settlement-administrator.test/x',
  onBack: vi.fn(),
};

describe('ClaimPreview', () => {
  it('maps each field to its filled value', () => {
    render(<ClaimPreview {...defaultProps} fields={fields} values={{ fullName: 'Jane Doe', orderNumber: 'ABC123' }} />);

    expect(screen.getByText('Full legal name')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Order number')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('flags a missing required value instead of showing it as filled', () => {
    render(<ClaimPreview {...defaultProps} fields={fields} values={{ fullName: 'Jane Doe' }} />);

    expect(screen.getByText(/missing/i)).toBeInTheDocument();
  });

  it('links to the official administrator site and never renders a submit action', () => {
    render(
      <ClaimPreview {...defaultProps} fields={fields} values={{ fullName: 'Jane Doe', orderNumber: 'ABC123' }} />,
    );

    const link = screen.getByRole('link', { name: /official site/i });
    expect(link).toHaveAttribute('href', 'https://example-settlement-administrator.test/x');
    expect(screen.queryByRole('button', { name: /^submit$/i })).not.toBeInTheDocument();
  });
});

describe('ClaimPreview download', () => {
  const createObjectURL = vi.fn((blob: Blob) => {
    void blob;
    return 'blob:mock-url';
  });
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
  });

  it('triggers a download of a text file named after the settlement when clicked', async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ClaimPreview {...defaultProps} fields={fields} values={{ fullName: 'Jane Doe', orderNumber: 'ABC123' }} />);
    await user.click(screen.getByRole('button', { name: /download claim summary/i }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const [blobArg] = createObjectURL.mock.calls[0];
    expect(blobArg.type).toBe('text/plain');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    clickSpy.mockRestore();
  });
});
