//css
import './ReloadButton.css';

function ButtonReload({ onReload, buttontext }) {
  


  return <button onClick={onReload}  className="button-reload">{buttontext + " button"}</button>;
}
  export default ButtonReload;