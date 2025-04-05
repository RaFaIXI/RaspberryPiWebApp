//css
import './ReloadButton.css';

function ButtonReload({ onReload, buttontext,reloadParams  }) {
  function handleClick() {
    onReload(...reloadParams); // ... spread operator to pass the parameters as separate arguments
  };


  return <button onClick={handleClick}  className="button-reload">{buttontext + " button"}</button>;
}
  export default ButtonReload;