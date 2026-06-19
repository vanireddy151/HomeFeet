import React from 'react';

const BrandName: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={className}>
    <span className="text-[#0AA6A6]">Lands</span>
    <span className="text-[#0877C9]">Develop</span>
  </span>
);

export default BrandName;
