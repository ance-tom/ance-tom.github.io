import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders App without crashing', () => {
  render(<App />);
});

test('renders Header component', () => {
  const { getByTestId } = render(<App />);
  const headerElement = getByTestId('header');
  expect(headerElement).toBeInTheDocument();
});

test('renders SchedulePage component', () => {
  const { getByTestId } = render(<App />);
  const schedulePageElement = getByTestId('schedule-page');
  expect(schedulePageElement).toBeInTheDocument();
});

test('renders Footer component', () => {
  const { getByTestId } = render(<App />);
  const footerElement = getByTestId('footer');
  expect(footerElement).toBeInTheDocument();
});