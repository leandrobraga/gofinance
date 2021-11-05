import React from 'react';
import { render } from '@testing-library/react-native'; 

import { Profile } from '../../screens/Profile';

describe('Profile', () => {
  it('should be  placeholder input user name', () => {
    const { getByPlaceholderText } = render(<Profile />);
    const inputName = getByPlaceholderText('Nome');
    
    //   expect(inputName.props.placeholder).toBeTruthy();
    expect(inputName).toBeTruthy();
  });
      
  it('should be user data has been loaded', () => {
    const { getByTestId } = render(<Profile />);
    
    expect(getByTestId('input-name').props.value).toEqual('Leandro');
    expect(getByTestId('input-surname').props.value).toEqual('Braga');
  });
  
  it('should be title render correctly', () => {
    const { getByTestId } = render(<Profile />);
    
    expect(getByTestId('text-title').props.children).toContain('Perfil');
  });
});

// Funciona Assim tb
// test('check if show correctly user input name placeholder', () => {
//   const { getByPlaceholderText } = render(<Profile />);
//   const inputName = getByPlaceholderText('Nome');

// //   expect(inputName.props.placeholder).toBeTruthy();
//   expect(inputName).toBeTruthy();
// });

// test('check if user data has been loaded', () => {
//     const { getByTestId } = render(<Profile />);
    
//     expect(getByTestId('input-name').props.value).toEqual('Leandro');
//     expect(getByTestId('input-surname').props.value).toEqual('Braga');
// });

// test('check if title render correctly', () => {
//     const { getByTestId } = render(<Profile />);
    
//     expect(getByTestId('text-title').props.children).toContain('Perfil');
// });