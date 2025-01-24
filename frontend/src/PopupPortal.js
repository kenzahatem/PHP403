import React from 'react';
import ReactDOM from 'react-dom';
import './interface.css';

function PopupPortal({ children, onClose }) {
    return ReactDOM.createPortal(
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.getElementById('portal-root')
    );
}

export default PopupPortal;
