'use client';

import { Toaster } from 'sonner';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'toast-custom',
          title: 'toast-title',
          description: 'toast-description',
          success: 'toast-success',
          error: 'toast-error',
          warning: 'toast-warning',
          info: 'toast-info',
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
      }}
      className="toast-container"
    />
  );
}
