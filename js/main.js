$(document).ready(function ()
{
    let dialog, form, currentModal,
        name = $("#name"),
        description = $("#description"),
        term = $("#term"),
        allFields = $([]).add(name).add(description).add(term),
        tips = $(".validateTips");

    //добавление функционала боковых закладок
    $("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
    $("#tabs .tabs-list__item").removeClass("ui-corner-top").addClass("ui-corner-left");


    //чтение данных из localStorage
    function initTasksTable()
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
    }
    initTasksTable();

    //диалоговое окно для добавления Текущих задач
    function updateTips(t)
    {
        tips.text(t).addClass("ui-state-highlight");
        setTimeout(function ()
        {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max)
    {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Длина '" + n + "' должна быть между  " +
                min + "' и '" + max + "'.");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp( o, regexp, n ) {
        if ( !( regexp.test( o.val() ) ) ) {
            o.addClass( "ui-state-error" );
            updateTips( n );
            return false;
        } else {
            return true;
        }
    }

    function addTask()
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
    }

    //запись в LocalStorage
    function setLocalStorage(_name, _descr, _term)
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
    }

    //чтение из localStorage
    function getCurrentTasksLocalStorage()
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

    function choiceEditDelete(rowIndex){
        models.editDelete.classList.add('active');
        var headerTextSpan = models.editDelete.getElementsByTagName('span');
        headerTextSpan[0].innerText = rowIndex;
    }

    //очистка localStorage
    $(".current-panel__clearLocalStorage").click(function (e)
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
            form[ 0 ].reset();
            allFields.removeClass( "ui-state-error" );
        }
    });

    currentModal = $("#current-modal").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        buttons: {
            edit: function(){
                alert("Еще не написано, но я постараюсь это сделать");
            },
            done: function (){
                alert("Совсем не написано, и тут я тоже постараюсь сделать");
            },
            delete: function (){
                alert("еще тоже не написано");
            },
            close: function(){
                currentModal.dialog( "close" );
            }
        },

    });

    form = dialog.find( "form" ).on( "submit", function(e) {
        e.preventDefault();
        addTask();
    });

    $(".current-panel__addTaskButton" ).button().on( "click", function() {
        dialog.dialog( "open" );
    });

    $('#tableBodyId').on( "click", function (e) {
        $("#current-modal").dialog( "option", "title", "Действие для задания '" + $(e.target).closest("tr")[0].cells[0].innerText + "'" );
        $("#current-modal").dialog("open");
        // choiceEditDelete(target.parentElement.rowIndex);
    });
});
