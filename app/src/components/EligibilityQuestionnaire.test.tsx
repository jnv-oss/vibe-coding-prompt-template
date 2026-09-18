import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import EligibilityQuestionnaire from './EligibilityQuestionnaire';

const questions = [
  { id: 'q1', text: 'Did you purchase the product?', required: true },
  { id: 'q2', text: 'Was it within the claim window?', required: true },
];

describe('EligibilityQuestionnaire', () => {
  it('blocks progression and never calls onEligible when a required question is answered no', async () => {
    const onEligible = vi.fn();
    const user = userEvent.setup();
    render(<EligibilityQuestionnaire questions={questions} onEligible={onEligible} />);

    await user.click(screen.getAllByRole('button', { name: 'No' })[0]);

    expect(screen.getByText(/don't appear to be eligible/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continue to claim form' })).not.toBeInTheDocument();
    expect(onEligible).not.toHaveBeenCalled();
  });

  it('enables continue only once every required question is answered yes', async () => {
    const onEligible = vi.fn();
    const user = userEvent.setup();
    render(<EligibilityQuestionnaire questions={questions} onEligible={onEligible} />);

    const continueButton = screen.getByRole('button', { name: 'Continue to claim form' });
    expect(continueButton).toBeDisabled();

    const yesButtons = screen.getAllByRole('button', { name: 'Yes' });
    await user.click(yesButtons[0]);
    expect(continueButton).toBeDisabled();
    await user.click(yesButtons[1]);
    expect(continueButton).toBeEnabled();

    await user.click(continueButton);
    expect(onEligible).toHaveBeenCalledTimes(1);
  });
});
