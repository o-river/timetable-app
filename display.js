
//平日休日切り替え

function switchDay() {
  if(DAY == "Weekday"){
    DAY = "Holiday";
    document.getElementById('tdayname').innerHTML = "休日";
    return;
  }
  if(DAY == "Holiday"){
    DAY = "Weekday";
    document.getElementById('tdayname').innerHTML = "平日";
    return;
  }
}


//表示行数関連(Rowsグループ関数)
function changeRows(id, num) {
  var i = 0
  for (; i < num; i++) {
    detail.Train[id][i].style.display = "grid";
  }
  for (; i < detail.Train[id].length; i++){
    detail.Train[id][i].style.display = "none";
  }
  localStorage["Default" + id + "DisplayRows"] = String(num);
}

function countRows(id) {
  var visible = 0;
  for(var i = 0; i < detail.Train[id].length; i++){
    if(detail.Train[id][i].style.display != "none") visible++;
  }
  console.log(visible);
  return visible;
}

function plusRows(id, alpha) {
  changeRows(id, countRows(id) + alpha);
}

function addRows(id, add) {
  plusRows(id, add);
  var cnt = countRows(id);
  if(cnt == 1) detail.Num[id][0].onclick = function(){addRows(id, 1);};
  else         detail.Num[id][0].onclick = function(){addRows(id,-1);};
}

function setRows(id, num) {
  if(num < 1) num = 1;
  changeRows(id, num);
  if(num == 1) detail.Num[id][0].onclick = function(){addRows(id, 1);};
  else         detail.Num[id][0].onclick = function(){addRows(id,-1);};
}

function switchRow(id) {
  trains[id].style.display = trains[id].style.display == "none" ? "grid" : "none";
  localStorage["Default" + id + "IsDisplayed"] = localStorage["Default" + id + "IsDisplayed"] == "true" ? "false" : "true";
}
