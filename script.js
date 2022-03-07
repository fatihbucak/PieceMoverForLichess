var zoom_flag = true;

function movePieceTo(piece, x, y, step_size) {
    var new_val = 'translate(' + (x * step_size) + 'px, ' + (y * step_size) + 'px)';
    piece.style.transform = new_val;
}


function getPieceFromLocation(x, y, step_size, pieces) {    
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i];
        var num_str = piece.style.transform.replace("translate(","");
        var num_str_list = num_str.split(",");
        var p_x = parseFloat(num_str_list[0]) + 0.4;
        var p_y = parseFloat(num_str_list[1]) + 0.4;
        var l_x = Math.floor(p_x / step_size);
        var l_y = Math.floor(p_y / step_size);
        if (x == l_x && y == l_y && piece.style.display != 'none'){
            return piece;
        }
    
    }
    return null;
}

var arrows = document.getElementsByTagName("g")[0];
var current_arrows = [];

var observer = new MutationObserver(function(mutations) {
    var arrow_list = arrows.children;
    var temp_arrows = [];
    for (var i = 0; i < arrow_list.length; i++) {
        var arrow = arrow_list[i];
        if (arrow.attributes.opacity.value != 1){
            continue;
        }
        var start_x = Math.floor(parseFloat(arrow.attributes.x1.value) + 4);
        var start_y = Math.floor(parseFloat(arrow.attributes.y1.value) + 4);
        var end_x = Math.floor(parseFloat(arrow.attributes.x2.value) + 4);
        var end_y = Math.floor(parseFloat(arrow.attributes.y2.value) + 4);
        temp_arrows.push(start_x + "," + start_y + "," + end_x + "," + end_y);
    }

    var new_arrows = temp_arrows.filter(x => !current_arrows.includes(x));
    var deleted_arrows = current_arrows.filter(x => !temp_arrows.includes(x));
    console.log("news ");
    console.log(new_arrows);
    if (new_arrows.length > 0) {
        var container = document.getElementsByTagName("cg-container")[0];
        var board = container.getElementsByTagName("cg-board")[0];
        var step_size = parseInt(container.style.width) / 8;
        var pieces = board.getElementsByTagName("piece");
        var l_str = new_arrows[0].split(",");
        var x1 = parseInt(l_str[0]);
        var y1 = parseInt(l_str[1]);
        var x2 = parseInt(l_str[2]);
        var y2 = parseInt(l_str[3]);
        var p = getPieceFromLocation(x1, y1, step_size, pieces);
        var t = getPieceFromLocation(x2, y2, step_size, pieces);
        console.log("p ");
        console.log(p);
        console.log("t ");
        console.log(t)
        var move_flag = true;
        if (p != null) {
            var source_color = p.classList[0];
            if (t != null) {
                var dest_color = t.classList[0];
                if (source_color == dest_color) {
                    move_flag = false;
                }else {
                    t.style.display = 'none';
                }
            }
            if (move_flag) {
                movePieceTo(p, x2, y2, step_size);
            }
        } 
    }
    if (temp_arrows.length == 0 && deleted_arrows.length > 0) {
        var pieces = document.getElementsByTagName("piece");
        for (var i = 0; i < pieces.length; i++) {
            var piece = pieces[i];
            if (piece.style.display == 'none') {
                piece.style.display = '';
            }
        }
        var body = document.getElementsByTagName("body")[0];
        var zoom_val = parseInt(body.attributes.style.value.replace("--zoom:",""));
        if (zoom_flag) {
            zoom_val += 1;
        }else {
            zoom_val -= 1;
        }
        zoom_flag = !zoom_flag;
        body.attributes.style.value = '--zoom:' + zoom_val;
    }
    current_arrows = temp_arrows;
});

observer.observe(arrows, {
    attributes:    true,
    childList:     true,
    characterData: true
});
