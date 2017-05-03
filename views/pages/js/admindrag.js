$('p').draggable({
    revert: true,
    helper: 'clone'
});

$("#id").droppable({
    drop: function (event, ui) {
        this.value = $(ui.draggable).attr('id');
    }
});
