import React, { useEffect, useState } from 'react';
import './popup.css';

function ContactPopUp({ email, setPopup }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const overlay = document.querySelector('#overlay');
    console.log(overlay);
    overlay.style.display = 'block';
    return () => {
      overlay.style.display = 'none';
    };
  }, []);

  return (
    <div className="popup">
      <div className="cPop">
        <p onClick={() => setPopup(false)} className="cut">
          X
        </p>
        <div style={{ display: show ? 'block' : 'none' }} className="email">
          {email}
        </div>
        <button onClick={() => setShow(!show)} className="button btn-primary">
          {show ? 'Hide' : 'Reveal Email'}
        </button>
      </div>
    </div>
  );
}

export default ContactPopUp;
