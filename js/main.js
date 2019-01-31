$(document).ready(function ()
{
    let dialog, formCurrent, formEdit, currentModalChoice, currentModalEdit, currentModalDelete,
        name = $("#name"),
        description = $("#description"),
        term = $("#term"),
        nameEdit = $("#name-edit"),
        descriptionEdit = $("#description-edit"),
        termEdit = $("#term-edit"),
        allFields = $([]).add(name).add(description).add(term),
        allFieldsEdit = $([]).add(nameEdit).add(descriptionEdit).add(termEdit),
        rowIndexForEdit,
        tbl = $("#tableBodyId"),
        tips = $(".validateTips");
    let tblBody = document.querySelector("#tableBodyId");
    //добавление функционала боковых закладок
    $("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#tabs .tabs-list__item").removeClass("ui-corner-top").addClass("ui-corner-left");


    //чтение данных из localStorage
    const initTasksTable = () =>
    {
        if ( getCurrentTasksLocalStorage() )
        {
            let massObj = getCurrentTasksLocalStorage();
            for (let i = 0; i < massObj.length; i++)
            {
                $( ".current-panel__table-body" ).append( "<tr>" +
                    "<td>" + massObj[i].name + "</td>" +
                    "<td>" + massObj[i].description + "</td>" +
                    "<td>" + massObj[i].term + "</td>" +
                    "</tr>" );
            }
        }
    };
    initTasksTable();

    //диалоговое окно для добавления Текущих задач
    const updateTips = (t) =>
    {
        tips.text(t).addClass("ui-state-highlight");
        setTimeout(function ()
        {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    };

    const checkLength = (o, n, min, max) =>
    {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Длина '" + n + "' должна быть между  " +
                min + "' и '" + max + "'.");
            return false;
        } else {
            return true;
        }
    };

    // const checkRegexp = ( o, regexp, n ) =>
    // {
    //     if ( !( regexp.test( o.val() ) ) ) {
    //         o.addClass( "ui-state-error" );
    //         updateTips( n );
    //         return false;
    //     } else {
    //         return true;
    //     }
    // };

    const addTask = () =>
    {
        let valid = true;
        allFields.removeClass( "ui-state-error" );
        valid = valid && checkLength( name, "Название задания", 3, 16 );
        //valid = valid && checkLength( description, "Описание задания", 6, 30 );
        //valid = valid && checkLength( term, "Срок", 1, 3 );
        //valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
        if ( valid ) {
            $( ".current-panel__table-body" ).append( "<tr>" +
                "<td>" + name.val() + "</td>" +
                "<td>" + description.val() + "</td>" +
                "<td>" + term.val() + "</td>" +
                "</tr>" );
            setLocalStorage(name.val(), description.val(), term.val());
            dialog.dialog( "close" );
        }
        return valid;
    };

    const editTask = () =>
    {
        let input = $(".current-modal-edit__dialog-form__fields input");
        tblBody.rows[rowIndexForEdit - 1].cells[0].innerHTML = input[0].value;
        tblBody.rows[rowIndexForEdit - 1].cells[1].innerHTML = input[1].value;
        tblBody.rows[rowIndexForEdit - 1].cells[2].innerHTML = input[2].value;
        editLocalStorage(rowIndexForEdit - 1, input[0].value, input[1].value, input[2].value);
        currentModalEdit.dialog("close");
    };

    const deleteTask = () =>
    {
        tblBody.deleteRow(rowIndexForEdit - 1);
        deleteLocalStorage(rowIndexForEdit);
        currentModalDelete.dialog("close");
    };
    //запись в LocalStorage
    const setLocalStorage = (_name, _descr, _term) =>
    {
        let obj = {
            name: _name,
            description: _descr,
            term: _term
        };
        let massObj = getCurrentTasksLocalStorage() ? getCurrentTasksLocalStorage() : [];
        massObj.push(obj);
        let serialObj = JSON.stringify(massObj);
        localStorage.setItem("current", serialObj);
    };

    const editLocalStorage = (index, ...obj) =>
    {
        let massObj = getCurrentTasksLocalStorage();
        massObj[index].name = obj[0];
        massObj[index].description = obj[1];
        massObj[index].term = obj[2];
        let serialObj = JSON.stringify(massObj);
        localStorage.setItem("current", serialObj);
    };

    const deleteLocalStorage = (index) =>
    {
        let massObj = getCurrentTasksLocalStorage();
        massObj.splice(index - 1, 1);
        let serialObj = JSON.stringify(massObj);
        localStorage.setItem("current", serialObj);
    };

    //чтение из localStorage
    function getCurrentTasksLocalStorage ()
    {
        return JSON.parse(localStorage.getItem("current"));
    }
    function getDoneTasksLocalStorage()
    {
        return JSON.parse(localStorage.getItem("current"));
    }
    function getDeletedTasksLocalStorage()
    {
        return JSON.parse(localStorage.getItem("current"));
    }

    //очистка localStorage
    $(".current-panel__clearLocalStorage").click(() =>
    {
        localStorage.clear();
    });

    dialog = $( "#current-content__dialog-form" ).dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 600,
        buttons: {
            "Добавить задание": addTask,
            Cancel: function() {
                dialog.dialog( "close" );
            }
        },
        close: function() {
            formCurrent[ 0 ].reset();
            allFields.removeClass( "ui-state-error" );
        }
    });

    currentModalChoice = $("#current-modal-choice").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        buttons: {
            edit: function(){
                currentModalEdit.dialog("open");
                currentModalChoice.dialog("close");
                currentModalEdit.dialog("option", "title", "Введите изменения для задания №'" + (rowIndexForEdit + 1) + "'" );
                beforeEdit(rowIndexForEdit);
            },
            done: function (){
                alert("Совсем не написано, и тут я тоже постараюсь сделать");
            },
            delete: function (){
                currentModalDelete.dialog("open");
                currentModalChoice.dialog("close");
            },
            close: function(){
                currentModalChoice.dialog( "close" );
            }
        },
    });

    currentModalEdit = $("#current-modal-edit").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        minWidth: 600,
        buttons: {
            "Изменить задание": editTask,
            Cancel: function() {
                currentModalEdit.dialog( "close" );
            }
        },
        close: function() {
            formEdit[ 0 ].reset();
            allFieldsEdit.removeClass( "ui-state-error" );
        }
    });

    currentModalDelete = $("#current-modal-dialogDelete-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete task": deleteTask,
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    formCurrent = dialog.find( "form" ).on( "submit", (e) => {
        e.preventDefault();
        addTask();
    });

    formEdit = currentModalEdit.find( "form" ).on( "submit", (e) => {
        e.preventDefault();
        editTask();
    });

    $(".current-panel__addTaskButton" ).button().on( "click", () => {
        dialog.dialog( "open" );
    });

    tbl.on( "click", (e) => {
        let target = e.target;
        currentModalChoice.dialog( "option", "title", "Действие для задания №'" + target.parentElement.rowIndex + "'" );
        currentModalChoice.dialog("open");
        rowIndexForEdit = target.parentElement.rowIndex;

    });

    let beforeEdit = (rowIndex) =>{
        nameEdit.val(tblBody.rows[rowIndex - 1].cells[0].innerHTML);
        descriptionEdit.val(tblBody.rows[rowIndex - 1].cells[1].innerHTML);
        termEdit.val(tblBody.rows[rowIndex - 1].cells[2].innerHTML);
    }


});
