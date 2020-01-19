import React, { useState } from 'react';

export default function App() {
    const [state, setState] = useState(0);
    const plus = () => {
        setState((prev) => prev + 1)
    }
    return (
        <div className="article">
            <h2 class="h2">{state}</h2>
            <div align="center">
                <button onClick={plus} className="plus-button">Click + 1</button>
            </div>
        </div>
    );
}