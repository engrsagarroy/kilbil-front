import React from "react";

const Logo = () => {
    return (
        <div className="flex items-center ">
            {/* Play button icon */}

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22 22"
                fill="none"
                stroke="url(#gradientStroke)"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="w-10 h-10"
            >
                <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>

                {/* A triangle with slightly curved sides */}
                <path d="M9 6 Q8 12 9 18 L18 12 Q9 6 9 6z" />
            </svg>


            {/* Text */}
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-pink-400 to-blue-400 text-transparent bg-clip-text">
                kilbil<span className="text-blue-400">.tv</span>
            </h1>
        </div>
    );
};

export default Logo;
