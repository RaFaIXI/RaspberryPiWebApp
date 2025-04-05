//css
import './ReloadButton.css';
// reloadParams is an array of parameters to pass to the function onReload when the button is clicked
function ButtonReload({ onReload, buttontext,reloadParams  }) {
  function handleClick() {
    //check if reloadParams exist
    if (reloadParams === undefined) {
      reloadParams = ["noParametersEnteredOnButtonReload"];
    }
    onReload(...reloadParams); // ... spread operator to pass the parameters as separate arguments
  };


  return <button onClick={handleClick}  className="button-reload">{buttontext + " button"}</button>;
}
  export default ButtonReload;