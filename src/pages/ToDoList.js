import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ButtonReload from '../components/ReloadButton';
import Footer from "../components/Footer";        
import "./ToDoList.css"; 
function ToDoList() {
    let [todolist, setTodolist] = useState(["do hello", "do world"]);
    let [returnedlist, setReturnedlist] = useState("");
    let [todolistitemadded, settodolistitemadded] = useState("");
    let [contentHeight, setContentHeight] = useState(0); // State to store content height

    // Function to update the content height
    const updateContentHeight = () => {
        const content = document.getElementById('content'); // Get the content div
        if (content) {
            setContentHeight(content.offsetHeight); // Update content height state
        }
    };



    // Initial list load and append list
    useEffect(() => {
        reloadlist();
    }, [todolist]); // Reload the list only when todolist changes

    function handleinputchange(event) {
        let inputValue = event.target.value;
        settodolistitemadded(inputValue);
    }

    function createDeleteHandler(index) {
        return function () {
            deleteItem(index);
        };
    }

    function deleteItem(i) {
        let newReturnedList = [...todolist];
        newReturnedList.splice(i, 1); // Remove the item at index i
        setTodolist(newReturnedList); 
    }

    function reloadlist() {
        // Reset the returnedlist before appending new items
        setReturnedlist("");

        let newReturnedList = [];

        // Loop through the todolist and create JSX elements for each task
        for (let i = 0; i < todolist.length; i++) {
            newReturnedList.push(
                <div key={i}>
                    {todolist[i]} <input type="checkbox" /> <button   className="delete-button"  onClick={createDeleteHandler(i)}>Delete</button>
                    <br />
                </div>
            );
        }

        setReturnedlist(newReturnedList);
        updateContentHeight();
    }

    function appendlist(text) {
        let newReturnedList = [...todolist]; // Use spread to copy the array
        newReturnedList.push(text);
        setTodolist(newReturnedList);
    }

    return (
        <div style={{ paddingTop: `${Math.max(contentHeight - 400, 0)}px`, paddingBottom: '110px', textAlign: 'center' }}> {/* Dynamic padding-top */}
            <Header />
            <div id="content">
                <h1>To-Do List</h1>
                {returnedlist}
                <br />
                <ButtonReload buttontext="append" reloadParams={[todolistitemadded]} onReload={appendlist} />
                <input type="text" id="lineedit" placeholder="Enter a new task" onChange={handleinputchange} />
            </div>
            <Footer />
        </div>
    );
};

export default ToDoList;
