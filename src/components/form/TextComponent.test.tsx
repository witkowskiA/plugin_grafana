import React, { useState as useStateMock } from 'react';
import { TextComponent } from './TextComponent';
import { fireEvent, render, screen } from '@testing-library/react';
import { data } from '../../mock/data';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('TextComponent', () => {
  const setState = jest.fn();
  beforeEach(() => {
    (useStateMock as jest.Mock).mockImplementation((init) => [init, setState]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render the component correctly', () => {
    const rows = '{"name": "John Doe"}';

    render(<TextComponent rows={rows} data={data} />);

    expect(screen.getByText('json content')).toBeInTheDocument();
    expect(screen.getByRole('textarea')).toBeInTheDocument();
    jest.clearAllMocks();
  });

  it('should update the post state when the user types in the textarea', () => {
    const rows = '{"name": "John Doe"}';

    render(<TextComponent rows={rows} data={data} />);

    const textarea = screen.getByRole('textarea');

    fireEvent.change(textarea, { target: { value: 'test' } });

    expect(textarea).toHaveValue('test');
  });

  // it('should disable the `fetchJson` button when the `checkInput` state is false', () => {
  //   const rows = '{"name": "John Doe"}';

  //   const button = screen.getByText('send Json');

  //   expect(button).toBeDisabled();
  // });

  // it('should enable the `fetchJson` button when the `checkInput` state is true', () => {
  //   const rows = '{"name": "John Doe"}';

  //   const component = render(<TextComponent rows={rows} data={data} />);
  //   expect(component).toBeTruthy();

  //   const textarea = screen.getByRole('textarea');

  //   fireEvent.change(textarea, { target: { value: '{"name": "Jane Doe"}' } });

  //   const button = screen.getByText('send Json');

  //   expect(button).toBeEnabled();
  // });

  // it('should call the `fetchJson` function when the `fetchJson` button is clicked', () => {
  //   const rows = '{"name": "John Doe"}';

  //   // const mockFetchJson = jest.fn();

  //   render(<TextComponent rows={rows} data={data} />);

  //   const button = screen.getByRole('button', { name: 'delete' });

  //   expect(button).toBeInTheDocument();
  //   // fireEvent.click(button);

  //   // expect(mockFetchJson).toHaveBeenCalledTimes(1);
  //   // expect(mockFetchJson).toHaveBeenCalledWith(data, '{"name": "Jane Doe"}');
  // });
});
