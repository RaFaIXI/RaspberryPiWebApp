import React from 'react';
import Header from '../components/Header';
import { useState } from 'react';
import { useEffect } from 'react';
import ButtonReload from '../components/ReloadButton';

function ToDoList() {
    let [todolist, setTodolist] = React.useState(["do hello", "do world"]);
    let [returnedlist,setReturnedlist]=useState("");

    useEffect(() => {
        reloadlist();
    }, []); // reload list à la première fois que le composant est créer donc au reload de la page (ctrl + r) quand la page est affichée 





    function reloadlist() {

        // Reset the returnedlist before appending new items
        setReturnedlist("");

        let newReturnedList = [];

        // Loop through the todolist and create JSX elements for each task
        for (let i = 0; i < todolist.length; i++) {
            newReturnedList.push(
                <div key={i}>
                    {todolist[i]}
                    <br />
                </div>
            );
        }

        setReturnedlist(newReturnedList);

    }

    function appendlist() {
        let newReturnedList =[]
        todolist.forEach(element => {
            newReturnedList.push(element);
            
        });

        newReturnedList.push("do new task");
        setTodolist(newReturnedList);
    }
    

    return (
        <div>
            <Header />
            <h1>To-Do List</h1>
                {returnedlist}
                <br/>
                <ButtonReload buttontext="reload" onReload={reloadlist} />
                <ButtonReload buttontext="append" onReload={appendlist} />

        </div>
    );
};

export default ToDoList;