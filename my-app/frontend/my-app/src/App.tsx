"use client";
import * as React from 'react';
import './App.css'; // or './index.css' if that’s where you included Tailwind directives

import Page from './container/Page';

export default function App() {
  return (
    <div className="App">
      <Page />
    </div>
  );
}
