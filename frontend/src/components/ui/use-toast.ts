import React from 'react';
import hotToast from 'react-hot-toast';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

// Enhanced toast hook using react-hot-toast
export function useToast() {
  const toast = React.useCallback((toastConfig: Toast) => {
    const { title, description, variant = 'default', duration } = toastConfig;
    
    // Create message from title and description
    const message = [title, description].filter(Boolean).join(': ');
    
    let toastId: string;
    
    // Display appropriate toast based on variant
    switch (variant) {
      case 'destructive':
        toastId = hotToast.error(message, {
          duration: duration || 4000,
          style: {
            borderRadius: '8px',
            background: '#ef4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        });
        break;
        
      case 'success':
        toastId = hotToast.success(message, {
          duration: duration || 3000,
          style: {
            borderRadius: '8px',
            background: '#10b981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        });
        break;
        
      default:
        toastId = hotToast(message, {
          duration: duration || 3000,
          style: {
            borderRadius: '8px',
            background: '#374151',
            color: '#fff',
          },
        });
    }
    
    return {
      id: toastId,
      dismiss: () => hotToast.dismiss(toastId),
      update: (updatedToast: Toast) => {
        hotToast.dismiss(toastId);
        return toast(updatedToast);
      }
    };
  }, []);

  return { toast };
}

// Export a standalone toast function for direct usage
export const toast = (toastConfig: Toast) => {
  const { title, description, variant = 'default', duration } = toastConfig;
  
  // Create message from title and description
  const message = [title, description].filter(Boolean).join(': ');
  
  let toastId: string;
  
  // Display appropriate toast based on variant
  switch (variant) {
    case 'destructive':
      toastId = hotToast.error(message, {
        duration: duration || 4000,
        style: {
          borderRadius: '8px',
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      });
      break;
      
    case 'success':
      toastId = hotToast.success(message, {
        duration: duration || 3000,
        style: {
          borderRadius: '8px',
          background: '#10b981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      });
      break;
      
    default:
      toastId = hotToast(message, {
        duration: duration || 3000,
        style: {
          borderRadius: '8px',
          background: '#374151',
          color: '#fff',
        },
      });
  }
  
  return {
    id: toastId,
    dismiss: () => hotToast.dismiss(toastId),
  };
};
