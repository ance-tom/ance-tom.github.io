import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SchedulePage from './SchedulePage';

describe('SchedulePage component', () => {
  it('renders without crashing', () => {
    render(<SchedulePage />);
  });
});
