import React from 'react';
import Login from './Login';

const LoginModal: React.FC<{ onClose: () => void; onLoginSuccess: () => void; stayOnPage?: boolean }> = ({
  onClose,
  onLoginSuccess,
  stayOnPage = false
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto relative w-full max-w-md">
        <button
          className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-2xl font-bold text-white shadow-xl"
          onClick={onClose}
        >
          x
        </button>
        <Login stayOnPage={stayOnPage} onSuccess={() => {
          onLoginSuccess();
          onClose();
        }} />
      </div>
    </div>
  );
};

export default LoginModal;
