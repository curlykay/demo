$(function() {
    var x, y, Lx, Ly, timer, timer1, timer2, timer3, timer4;
    var direction; //方向
    var length = 7; //贪吃蛇初始长度
    var l = 20 //蛇头尺寸
    var d = 18 //实物的直径
    var d0 = (l - d) / 2; //初始位置
    var size = [l * 15, l * 20]; //边框尺寸
    var speed = 350; //初始速度
    var speeds = [300, 275, 250, 200, 150] //变速
    var ss = [5, 15, 20, 30, 40]
    var leftF = [];
    var topF = [];
    var xF, yF;
    var PH = 1; //是否存活

    $("#main").css("width", size[0] + 4);
    $("#rail").css({
        "width": size[0],
        "height": size[1],
        "border": "2px solid black"
    })
    for (var i = 0; i < length; i++) { //设置蛇的初始长度
        $("<div>").css({
            "width": l,
            "height": l,
            "left": l * (length - i - 1) + "px",
        }).addClass("ss").appendTo($("#rail"));
    }
    $($(".ss")[0]).attr("id", "s0");
    for (var i = d0; i < size[0]; i = i + l) { //食物出现位置数组
        leftF.push(i);
    }
    for (var i = d0; i < size[1]; i = i + l) {
        topF.push(i);
    }

    function food() { //出现食物
        xF = leftF[parseInt(Math.random() * leftF.length)];
        yF = topF[parseInt(Math.random() * topF.length)];
        do { //避免食物出现在蛇身位置
            var ff = false;
            for (var i = 0; i < $(".ss").length; i++) {
                while (xF - d0 == parseInt($($(".ss")[i]).css("left")) && yF - d0 == parseInt($($(".ss")[i]).css("top"))) {
                    xF = leftF[parseInt(Math.random() * leftF.length)];
                    yF = topF[parseInt(Math.random() * topF.length)];
                    ff = true;
                }
                if (ff) {
                    break;
                }
            }
        } while (ff);
        $("<div>").css({
            "width": d,
            "height": d,
            "left": xF,
            "top": yF
        }).attr("id", "f0").appendTo($("#rail"));
    }
    food();

    function beLong() { //吃到食物变长
        if (parseInt($("#s0").css("left")) == xF - d0 && parseInt($("#s0").css("top")) == yF - d0) {
            $("#f0").remove();
            $("<div>").css({
                "width": l,
                "height": l,
                "left": parseInt($($(".ss")[$(".ss").length - 1]).css("left")),
                "top": parseInt($($(".ss")[$(".ss").length - 1]).css("top"))
            }).addClass("ss").appendTo($("#rail"));

            for (var i = 0; i < ss.length; i++) {
                if ($(".ss").length - length == ss[i]) {
                    speed = speeds[i];
                }
            }
            food();
        }
    }

    // function clear() { //清除计时器
    //     clearTimeout(timer1);
    //     clearTimeout(timer2);
    //     clearTimeout(timer3);
    //     clearTimeout(timer4);
    // }

    function end() { //结束游戏
        PH = 0;
        clearTimeout(timer); //clear();
        alert($(".ss").length - (size[0] * size[1] / l / l) == 0 ? "无敌是多么寂寞~~~" : "Game Over" + "\n\nScore: " + ($(".ss").length - length));
        $(document).unbind("keydown");
    }

    function feedback() { //游戏反馈
        // if(x<0||y<0||x>size[0]-l||y>size[1]-l){//撞墙死
        //  end();
        //  return;
        // }
        x = x < 0 ? size[0] - l : x > size[0] - l ? 0 : x; //可穿墙
        y = y < 0 ? size[1] - l : y > size[1] - l ? 0 : y;

        for (i = 1; i < $(".ss").length; i++) { //吃到自己死
            if (x + "px" == $($(".ss")[i - 1]).css("left") && y + "px" == $($(".ss")[i - 1]).css("top")) {
                end();
                return;
            }
        }

        for (i = $(".ss").length - 1; i > 0; i--) { //蛇节跟随蛇头运动
            $($(".ss")[i]).css({
                "left": parseInt($($(".ss")[i - 1]).css("left")),
                "top": parseInt($($(".ss")[i - 1]).css("top"))
            })
        }
    }


    $(document).keydown(function(event) {
        x = parseInt($("#s0").css("left"));
        y = parseInt($("#s0").css("top"));
        var e = event || window.event;
        var keyC = e.keyCode;
        if (keyC == 32) { //空格键暂停
            clearTimeout(timer); //clear();
        }
        if (keyC == 37 || keyC == 65 || keyC == 39 || keyC == 68 || keyC == 38 || keyC == 87 || keyC == 40 || keyC == 83) { //简化代码版
            var Lx0 = (keyC == 38 || keyC == 87 || keyC == 40 || keyC == 83) ? 0 : (keyC == 37 || keyC == 65) ? -l : l;
            var Ly0 = (keyC == 37 || keyC == 65 || keyC == 39 || keyC == 68) ? 0 : (keyC == 38 || keyC == 87) ? -l : l;
            if (Lx0 * Lx < 0 || Ly0 * Ly < 0) { //优化操作体验
                return;
            }
            clearTimeout(timer);
            Lx = (keyC == 38 || keyC == 87 || keyC == 40 || keyC == 83) ? 0 : (keyC == 37 || keyC == 65) ? -l : l;
            Ly = (keyC == 37 || keyC == 65 || keyC == 39 || keyC == 68) ? 0 : (keyC == 38 || keyC == 87) ? -l : l;

            function dirve() {
                if ($(".ss").length - (size[0] * size[1] / l / l) == 0) {
                    end();
                    return;
                }
                x = x + Lx;
                y = y + Ly;
                feedback();
                if (PH == 0) {
                    return;
                }
                $("#s0").css({
                    "left": x + "px",
                    "top": y + "px"
                });
                beLong();
                timer = setTimeout(dirve, speed);
            }
            dirve() //为了加速
        }
        //最初思路
        // if (keyC == 37 || keyC == 65) {
        //     if (direction == "right") {
        //         return;
        //     }
        //     direction = "left";
        //     clear();

        //     function goLeft() {
        //         x = x - l;
        //         feedback();
        //         if(PH==0){
        //          return;
        //         }

        //         $("#s0").css({
        //             "left": x + "px"
        //         });
        //         beLong();
        //         timer1 = setTimeout(goLeft, speed);
        //     }
        //     goLeft() //为了加速
        // }

        // if (keyC == 38 || keyC == 87) {
        //     if (direction == "down") {
        //         return;
        //     }
        //     direction = "up";
        //     clear();

        //     function goUp() {
        //         y = y - l;
        //         feedback();
        //         if(PH==0){
        //          return;
        //         }
        //         $("#s0").css({
        //             "top": y + "px"
        //         });
        //         beLong();
        //         timer2 = setTimeout(goUp, speed);
        //     }
        //     goUp();
        // }

        // if (keyC == 39 || keyC == 68) {
        //     if (direction == "left") {
        //         return;
        //     }
        //     direction = "right";
        //     clear();

        //     function goRight() {
        //         x = x + l;
        //         feedback();
        //         if(PH==0){
        //          return;
        //         }
        //         $("#s0").css({
        //             "left": x + "px"
        //         });
        //         beLong();
        //         timer3 = setTimeout(goRight, speed);
        //     }
        //     goRight();
        // }


        // if (keyC == 40 || keyC == 83) {
        //     if (direction == "up") {
        //         return;
        //     }
        //     direction = "down";
        //     clear();
        //     function goDown() {
        //         y = y + l;
        //         feedback();
        //         if(PH==0){
        //          return;
        //         }
        //         $("#s0").css({
        //             "top": y + "px"
        //         });
        //         beLong();
        //      timer4 = setTimeout(goDown, speed);
        //     };
        //     goDown();
        // }
    });
});