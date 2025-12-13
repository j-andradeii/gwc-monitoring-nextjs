'use client';

import React from 'react';

const FormError: React.FC<{ error?: string }> = ({ error }) => {
    if (!error) return null;

    return (
      <small className="p-error block mt-2">{error}</small>
    );
};

export default FormError;
