'use client';

import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeColors() {
  const [darkMode, setDarkMode] = useState(false);

  const colorGroups = {
    'Core Brand Colors': [
      { name: 'Primary', var: '--color-primary', desc: 'Main brand blue' },
      { name: 'Secondary', var: '--color-secondary', desc: 'Balanced teal' },
      { name: 'Accent', var: '--color-accent', desc: 'Harmonious blue accent' },
    ],
    'Backgrounds & Surfaces': [
      { name: 'Background', var: '--color-background', desc: 'Main background' },
      { name: 'Foreground', var: '--color-foreground', desc: 'Text color' },
      { name: 'Card', var: '--color-card', desc: 'Card surfaces' },
      { name: 'Popover', var: '--color-popover', desc: 'Modal backgrounds' },
    ],
    'Status Colors': [
      { name: 'Success', var: '--color-success', desc: 'Success states' },
      { name: 'Warning', var: '--color-warning', desc: 'Warning states' },
      { name: 'Error', var: '--color-error', desc: 'Error states' },
      { name: 'Info', var: '--color-info', desc: 'Information states' },
    ],
    'Neutral Scale': [
      { name: 'Muted', var: '--color-muted', desc: 'Subtle backgrounds' },
      { name: 'Muted Foreground', var: '--color-muted-foreground', desc: 'Secondary text' },
      { name: 'Border', var: '--color-border', desc: 'Border color' },
      { name: 'Input', var: '--color-input', desc: 'Input backgrounds' },
    ],
    'Interactive States': [
      { name: 'Primary Hover', var: '--color-primary-hover', desc: 'Primary hover state' },
      { name: 'Primary Active', var: '--color-primary-active', desc: 'Primary active state' },
      { name: 'Secondary Hover', var: '--color-secondary-hover', desc: 'Secondary hover' },
      { name: 'Accent Hover', var: '--color-accent-hover', desc: 'Accent hover' },
    ],
    'Utility Colors': [
      { name: 'Ring', var: '--color-ring', desc: 'Focus ring' },
      { name: 'Selection', var: '--color-selection', desc: 'Text selection' },
      { name: 'Destructive', var: '--color-destructive', desc: 'Destructive actions' },
      { name: 'Disabled', var: '--color-disabled', desc: 'Disabled state' },
    ],
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orienta&family=Palanquin+Dark:wght@400;500;600;700&display=swap');
        
        :root {
          --font-orienta: 'Orienta', sans-serif;
          --font-palanquin-dark: 'Palanquin Dark', sans-serif;
          
          --color-primary: hsl(230, 55%, 26%);
          --color-secondary: hsl(178, 100%, 21%);
          --color-accent: hsl(200, 65%, 45%);
          --color-background: hsl(230, 25%, 98%);
          --color-foreground: hsl(230, 55%, 15%);
          --color-card: hsl(230, 20%, 99%);
          --color-popover: hsl(230, 20%, 99%);
          --color-success: hsl(145, 60%, 42%);
          --color-warning: hsl(35, 85%, 55%);
          --color-error: hsl(355, 70%, 55%);
          --color-info: hsl(210, 75%, 50%);
          --color-muted: hsl(230, 20%, 96%);
          --color-muted-foreground: hsl(230, 15%, 55%);
          --color-border: hsl(230, 20%, 88%);
          --color-input: hsl(230, 25%, 24%);
          --color-primary-hover: hsl(230, 55%, 35%);
          --color-primary-active: hsl(230, 55%, 22%);
          --color-secondary-hover: hsl(230, 35%, 84%);
          --color-accent-hover: hsl(200, 65%, 53%);
          --color-ring: hsl(230, 55%, 26%);
          --color-selection: hsl(230, 55%, 85%);
          --color-destructive: hsl(355, 70%, 55%);
          --color-disabled: hsl(230, 15%, 75%);
        }
        
        .dark {
          --color-primary: hsl(230, 55%, 65%);
          --color-secondary: hsl(178, 100%, 31%);
          --color-accent: hsl(200, 65%, 60%);
          --color-background: hsl(230, 20%, 9%);
          --color-foreground: hsl(230, 15%, 92%);
          --color-card: hsl(230, 18%, 12%);
          --color-popover: hsl(230, 18%, 12%);
          --color-success: hsl(145, 60%, 50%);
          --color-warning: hsl(35, 85%, 65%);
          --color-error: hsl(355, 70%, 65%);
          --color-info: hsl(210, 75%, 60%);
          --color-muted: hsl(230, 18%, 15%);
          --color-muted-foreground: hsl(230, 15%, 65%);
          --color-border: hsl(230, 20%, 22%);
          --color-input: hsl(230, 20%, 68%);
          --color-primary-hover: hsl(230, 55%, 70%);
          --color-primary-active: hsl(230, 55%, 60%);
          --color-secondary-hover: hsl(230, 25%, 25%);
          --color-accent-hover: hsl(200, 65%, 65%);
          --color-ring: hsl(230, 55%, 65%);
          --color-selection: hsl(230, 55%, 25%);
          --color-destructive: hsl(355, 70%, 65%);
          --color-disabled: hsl(230, 15%, 35%);
        }
        
        body {
          font-family: var(--font-orienta);
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-palanquin-dark);
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-foreground)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '3rem'
          }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Theme Color Palette
              </h1>
              <p style={{ color: 'var(--color-muted-foreground)' }}>
                A comprehensive showcase of your design system colors
              </p>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>

          {/* Color Groups */}
          {Object.entries(colorGroups).map(([groupName, colors]) => (
            <div key={groupName} style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--color-border)'
              }}>
                {groupName}
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {colors.map(color => (
                  <div
                    key={color.var}
                    style={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '80px',
                        backgroundColor: `var(${color.var})`,
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        border: '1px solid var(--color-border)'
                      }}
                    />
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {color.name}
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--color-muted-foreground)',
                      marginBottom: '0.5rem'
                    }}>
                      {color.desc}
                    </p>
                    <code style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'var(--color-muted)',
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      fontFamily: 'monospace'
                    }}>
                      {color.var}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Interactive Demo */}
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--color-border)'
            }}>
              Interactive Demo
            </h2>
            
            <div style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
              padding: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Primary Button
              </button>
              
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Secondary Button
              </button>
              
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-success)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Success
              </button>
              
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-warning)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Warning
              </button>
              
              <button style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-error)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Error
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}