import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center justify-between cursor-pointer">
      <img
        className="flex items-center justify-start object-contain w-52"
        src="/LenspostAlphaLogo.png"
        alt="lenspost"
      />
    </div>
  );
};

export default Logo;
