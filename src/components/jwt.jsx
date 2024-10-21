// src/Jwt.js
import React from "react";

const Jwt = ({ token, decodedToken }) => {
  return (
    <div className="mt-5 p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-bold">JWT Token</h2>
      <p className="break-words">{token ? token : "No token available"}</p>
      {decodedToken && (
        <div>
          <h3 className="mt-4 text-lg font-bold">Decoded Token</h3>
          <pre className="break-words whitespace-pre-wrap">
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Jwt;
