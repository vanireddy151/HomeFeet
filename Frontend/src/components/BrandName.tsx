import React from 'react';

const BrandName: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={className}>
    <span className="text-[#0AA6A6]">Home</span>
    <span className="text-[#0877C9]">Feet</span>
  </span>
);

export default BrandName;
