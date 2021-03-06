// Listeners when circuit is embedded
// Refer listeners.js

function startListeners() {
    window.addEventListener('keyup', function(e) {
        scheduleUpdate(1);
        if (e.keyCode == 16) {
            simulationArea.shiftDown = false;
        }
        if (e.key == "Meta" || e.key == "Control") {
            simulationArea.controlDown = false;
        }
    });

    document.getElementById("simulationArea").addEventListener('mousedown', function(e) {
        errorDetected = false;
        updateSimulation = true;
        updatePosition = true;
        updateCanvas = true;

        simulationArea.lastSelected = undefined;
        simulationArea.selected = false;
        simulationArea.hover = undefined;
        var rect = simulationArea.canvas.getBoundingClientRect();
        simulationArea.mouseDownRawX = (e.clientX - rect.left) * DPR;
        simulationArea.mouseDownRawY = (e.clientY - rect.top) * DPR;
        simulationArea.mouseDownX = Math.round(((simulationArea.mouseDownRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
        simulationArea.mouseDownY = Math.round(((simulationArea.mouseDownRawY - globalScope.oy) / globalScope.scale) / unit) * unit;
        simulationArea.mouseDown = true;
        simulationArea.oldx = globalScope.ox;
        simulationArea.oldy = globalScope.oy;


        e.preventDefault();
        scheduleUpdate(1);
    });
    window.addEventListener('mousemove', function(e) {

        var rect = simulationArea.canvas.getBoundingClientRect();
        simulationArea.mouseRawX = (e.clientX - rect.left) * DPR;
        simulationArea.mouseRawY = (e.clientY - rect.top) * DPR;
        simulationArea.mouseX = Math.round(((simulationArea.mouseRawX - globalScope.ox) / globalScope.scale) / unit) * unit;
        simulationArea.mouseY = Math.round(((simulationArea.mouseRawY - globalScope.oy) / globalScope.scale) / unit) * unit;

        updateCanvas = true;
        if (simulationArea.lastSelected == globalScope.root) {
            updateCanvas = true;
            var fn;
            fn = function() {
                updateSelectionsAndPane();
            }
            scheduleUpdate(0, 20, fn);

        } else {
            scheduleUpdate(0, 200);
        }


    });
    window.addEventListener('keydown', function(e) {

        errorDetected = false;
        updateSimulation = true;
        updatePosition = true;

        // zoom in (+)
        if (e.key == "Meta" || e.key == "Control") {
            simulationArea.controlDown = true;
        }

        if (simulationArea.controlDown && e.keyCode == 187) {
            e.preventDefault();
            if (globalScope.scale < 4 * DPR)
                changeScale(.1 * DPR);
        }

        // zoom out (-)
        if (simulationArea.controlDown && e.keyCode == 189) {
            e.preventDefault();
            if (globalScope.scale > 0.5 * DPR)
                changeScale(-.1 * DPR);
        }


        if (simulationArea.mouseRawX < 0 || simulationArea.mouseRawY < 0 || simulationArea.mouseRawX > width || simulationArea.mouseRawY > height) return;

        scheduleUpdate(1);
        updateCanvas = true;

        if (simulationArea.lastSelected && simulationArea.lastSelected.keyDown) {
            if (e.key.toString().length == 1 || e.key.toString() == "Backspace") {
                simulationArea.lastSelected.keyDown(e.key.toString());
                return;
            }

        }

        if (e.key == "T" || e.key == "t") {
            simulationArea.changeClockTime(prompt("Enter Time:"));
        }

    })
    document.getElementById("simulationArea").addEventListener('dblclick', function(e) {
        scheduleUpdate(2);
        if (simulationArea.lastSelected && simulationArea.lastSelected.dblclick !== undefined) {
            simulationArea.lastSelected.dblclick();
        }
    });


    window.addEventListener('mouseup', function(e) {

        simulationArea.mouseDown = false;
        errorDetected = false;
        updateSimulation = true;
        updatePosition = true;
        updateCanvas = true;
        gridUpdate = true;
        wireToBeChecked = true;

        scheduleUpdate(1);
    });
    document.addEventListener('cut', function(e) {
        simulationArea.copyList = simulationArea.multipleObjectSelections.slice();
        if (simulationArea.lastSelected && simulationArea.lastSelected !== simulationArea.root && !simulationArea.copyList.contains(simulationArea.lastSelected)) {
            simulationArea.copyList.push(simulationArea.lastSelected);
        }

        var textToPutOnClipboard = cut(simulationArea.copyList);
        if (isIe) {
            window.clipboardData.setData('Text', textToPutOnClipboard);
        } else {
            e.clipboardData.setData('text/plain', textToPutOnClipboard);
        }
        e.preventDefault();
    });
    document.addEventListener('copy', function(e) {
        simulationArea.copyList = simulationArea.multipleObjectSelections.slice();
        if (simulationArea.lastSelected && simulationArea.lastSelected !== simulationArea.root && !simulationArea.copyList.contains(simulationArea.lastSelected)) {
            simulationArea.copyList.push(simulationArea.lastSelected);
        }

        var textToPutOnClipboard = copy(simulationArea.copyList);
        if (isIe) {
            window.clipboardData.setData('Text', textToPutOnClipboard);
        } else {
            e.clipboardData.setData('text/plain', textToPutOnClipboard);
        }
        e.preventDefault();
    });

    document.addEventListener('paste', function(e) {
        var data;
        if (isIe) {
            data = window.clipboardData.getData('Text');
        } else {
            data = e.clipboardData.getData('text/plain');
        }

        paste(data);
        e.preventDefault();
    });
}


var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 ||
    navigator.userAgent.toLowerCase().indexOf("trident") != -1);
