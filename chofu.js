
// CSV -> 2次元配列 -> json

//DiaのCSVファイルを読み込んでjsonを返す関数getCSVDia()の定義

function CSVDia2json(day, dir) {
  rawdia[day][dir] = twoDimArray2json(CSV2Array(this.responseText));
  console.log("day=" + day +", dir=" + dir + "; rawdia:");
  console.log(rawdia[day][dir]);
}
function CSV2json() {
  stations = twoDimArray2json(CSV2Array(this.responseText));
  console.log("stations data:");
  console.log(stations);
}
function getCSVDia(filename, day, dir) {
  getCSV(filename, CSVDia2json, day, dir);
}
function getCSVSta(filename) {
  getCSV(filename, CSV2json);
}


function reqSuccess() {
    this.callback.apply(this, this.arguments);
}
function reqError() {
    console.error(this.statusText);
}
//CSVを受け取って２次元配列を返す関数
function getCSV(filename, callback){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.callback = callback;
  req.arguments = Array.prototype.slice.call(arguments, 2);
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
  req.onload = reqSuccess;
  req.onerror = reqError;
  req.open("get", filename, true); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行
}

// 読み込んだCSVデータを二次元配列に変換して返す関数convertCSVtoArray()の定義
function CSV2Array(str){ // 読み込んだCSVデータが文字列として渡される
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for(var i=0;i<tmp.length;++i){
    result[i] = tmp[i].split(','); //カンマで区切る
  }
  return result;
}

function twoDimArray2json(array){ //受け取るのは先頭行データ付き２次元配列
  var jsonArray = [];

  //受け取ったデータを表示
  console.log("2dArrtojson received array:");
  console.log(array);

  // 1行目から「項目名」の配列を生成する
  var items = array[0];　//項目名の配列items
  items[items.length-1] = items[items.length-1].replace("\r", ''); //最終要素の改行を取る

  // console.log("items[i]:");
  // for (var i = 0; i < items.length; i++) { console.log(items[i]); }

  // CSVデータの配列の各行をループ処理する
  //// 配列の先頭要素(行)は項目名のため処理対象外
  //// 配列の最終要素(行)は空のため処理対象外

  for (var i = 1; i < array.length - 1; i++) { //i:行数
    var a_line = new Object();
    // カンマで区切られた各データに分割する
    var arrayD = array[i];
    //// 各データをループ処理する
    console.log("i=" + i + ", items = " + items.length + "; arrayD = " + arrayD.length);
//    if(i > array.length - 5) {console.log(i); console.log(arrayD);}
//    if(items.length != arrayD.length) console.log(arrayD);
    for (var j = 0; j < items.length; j++) {
      // 要素名：items[j]
      // データ：arrayD[j]
      a_line[items[j]] = arrayD[j].replace("\r", '');
      // else console.log(arrayD[j]);
      //各lineに対応するobject a_lineの中に要素の数だけ要素名：データの構造を作る
    }
    jsonArray.push(a_line);
    //a_lineをjsonArrayの末尾に加える
  }
  //console.dir(jsonArray);
  return jsonArray;
}


//keioの駅探時刻表から平日・土休日を取得し返す関数
function getTrainDay(date) {
  var url = "https://ekitan.com/timetable/railway/line-station/262-0/d1?dt=";
  getCSV(url + date, setTrainDay)
}

function setTrainDay() {
  console.log(this.responseXML);
}


const SWintv = 2500;
const SWtimes = 2;
const DAYs = ["Weekday", "Holiday"];
const LineIDs = ["L1", "L2", "L3"];
const TrainDetails = ["num", "time", "cars", "dest", "dep", "csta", "kara", "cknd", "kind", "delay", "info"]
const HOLIDAYS = ["2019/10/14", "2019/10/22", "2019/11/03", "2019/11/04", "2019/11/23"];
//for (dt of HOLIDAYS) dt = new Date(dt);
if(localStorage.DefaultStaNum === undefined) localStorage.DefaultStaNum = "18";
for (const id of LineIDs) {
  if(localStorage["Default" + id + "IsDisplayed"] === undefined) localStorage["Default" + id + "IsDisplayed"] = "true";
  if(localStorage["Default" + id + "DisplayRows"] === undefined) localStorage["Default" + id + "DisplayRows"] = "3";
}

var DAY = "";
var STA = Number(localStorage.DefaultStaNum);
var LineIDDir = {L1:"",L2:"",L3:""};

//以下のl_は将来的にはいらない
l_time = [];
l_kind = [];
l_dest = [];
l_cars = [];
l_dep  = [];
l_info = [];
l_delay = [];

now_i = {L1:1, L2:1, L3:1};
t_cnt = 0;
kind_text = [];

d_tnum = {L1:[],L2:[],L3:[]};

trains = {L1:{},L2:{},L3:{}};
detail = {
  Train:{L1:[],L2:[],L3:[]},
  Num:  {L1:[],L2:[],L3:[]},
  Time: {L1:[],L2:[],L3:[]},
  Kind: {L1:[],L2:[],L3:[]},
  Dest: {L1:[],L2:[],L3:[]},
  Cars: {L1:[],L2:[],L3:[]},
  Dep:  {L1:[],L2:[],L3:[]},
  Info: {L1:[],L2:[],L3:[]},
  Delay:{L1:[],L2:[],L3:[]},
  CSta: {L1:[],L2:[],L3:[]},
  Kara: {L1:[],L2:[],L3:[]},
  CKnd: {L1:[],L2:[],L3:[]}
};
rawdia = {Weekday:{U:[],D:[]}, Holiday:{U:[],D:[]}};
dia = {Weekday:{L1:[],L2:[],L3:[]}, Holiday:{L1:[],L2:[],L3:[]}};

/*
stations = ["新線新宿","新宿","初台","幡ヶ谷","笹塚","代田橋","明大前","下高井戸","桜上水","上北沢","八幡山","芦花公園","千歳烏山","仙川","つつじヶ丘","柴崎","国領","布田","調布",
            "西調布","飛田給","武蔵野台","多磨霊園","東府中","府中","分倍河原","中河原","聖蹟桜ヶ丘","百草園","高幡不動","南平","平山城址公園","長沼","北野","京王八王子",
            "京王多摩川","京王稲田堤","京王よみうりランド","稲城","若葉台","京王永山","京王多摩センター","京王堀之内","南大沢","多摩境","橋本",
            "府中競馬正門前","多摩動物公園","京王片倉","山田","めじろ台","狭間","高尾","高尾山口"];
*/

getCSVSta("stations.csv");

getCSVDia("dia_w_u.csv", "Weekday", "U");
getCSVDia("dia_w_d.csv", "Weekday", "D");
getCSVDia("dia_h_u.csv", "Holiday", "U");
getCSVDia("dia_h_d.csv", "Holiday", "D");


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

function makeTimetable(id = "L1", day = DAY, ud, sta, dir = ""){
  if(ud != ""){
    dia[day][id] = [];
    for (var i = 0; i < rawdia[day][ud].length; i++){
      if(isTrainTime(rawdia[day][ud][i]["s" + sta + "d" + dir])){
        var diatrain = rawdia[day][ud][i];
        diatrain.Time = Number(rawdia[day][ud][i]["s" + sta + "d" + dir]);
        if(diatrain.Time < 300) diatrain.Time += 2400;
        if(diatrain.DepSta == sta) diatrain.IsDep = true;
        dia[day][id].push(diatrain);
      }
    }
    dia[day][id].sort( function(a,b){
      if(a.Time < b.Time) return -1;
      if(a.Time > b.Time) return  1;
      return 0;
    });
    console.log("made dia[DAY]['" + id + "']:");
    console.log(dia[day][id]);
  }
}

function setStationDev(id, day, ud, sta, dir = "") { //"L1"だけ変える
  STA = sta;
  makeTimetable(id, day, ud, sta, dir);
  document.getElementById("tstaname").innerHTML = stations[sta].name;
  document.getElementById("tdirname").innerHTML = dir;
}

function setStation(sta) { // 機能追加に応じて拡充のこと
  STA = sta;
  makeTimetable("L1", DAY, stations[sta].L1ud, sta, stations[sta].L1dir);
  makeTimetable("L2", DAY, stations[sta].L2ud, sta, stations[sta].L2dir);
  makeTimetable("L3", DAY, stations[sta].L3ud, sta, stations[sta].L3dir);
  document.getElementById("tstaname").innerHTML = stations[sta].name;
}

function setNearStation() {
  navigator.geolocation.getCurrentPosition(getPosition, UnableUse, {enableHighAccuracy : true});
  var latlng = getPosition();
  var nsta = getNearStation(latlng);
  setStation(nsta);
}
function UnableUse() {
  console.log("現在地を取得できません");
}
function getPosition(position) {
  pos = position.coords;
  console.log(pos);
  pos.timestamp = position.timestamp;
  console.log("pos:" + pos);
  var ll = {lat: pos.latitude, lng: pos.longitude};
  var nsta = getNearStation(ll);
  setStation(nsta);
}
function getNearStation(ll) {
  //latの最近値を探す
  var lv = Array(stations.length);
  for (var i = 0; i < stations.length; i++) {
    lv[i] = {sta:0,dlat:0,dlng:0,ddst:0};
    lv[i].sta = i;
    lv[i].dlat = Math.abs(ll.lat - stations[i].Lat);
    lv[i].dlng = Math.abs(ll.lng - stations[i].Lng);
    lv[i].ddst = lv[i].dlat ** 2 + lv[i].dlng ** 2;
  }
  console.log(ll);

  console.log(lv);
  lv.sort( function(a,b){
    if(a.ddst < b.ddst) return -1;
    if(a.ddst < b.ddst) return  1;
    return 0;
  });
  console.log(lv);
  console.log(lv[0]);
/*
  lv.sort( function(a,b){
    if(a.dlng < b.dlng) return -1;
    if(a.dlng < b.dlng) return  1;
    return 0;
  });
  console.log(lv);

  var lh = Array(5);
  for(var i = 0; i < 5; i++){
    lh[i] = lv[i];
  }
  console.log(lh);
  lh.sort( function(a,b){
    if(a.dlat < b.dlat) return -1;
    if(a.dlat < b.dlat) return  1;
    return 0;
  });
  console.log(lh);
  return lh[0];
  */
  return lv[0].sta;
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

function getDateStr(date) {
  return date.getFullYear + date.getMonth
}

window.onload = function(){
  var date = new Date();
  var dayname = document.getElementById('tdayname');
  var loading = document.getElementById('loading');
  date.setHours(date.getHours() - 3); //３時で曜日を切り替えるようにした
/*  if(date.getDay() == 0
     || (date.getDay() == 6 && date.getHours() > 3)
     || (date.getDay() == 1 && date.getHours() <= 3)) {
     */
  console.log("today: ");
  console.log(date);
  switch (date.getDay()) {
    case 0: //日曜
    case 6: //土曜
      DAY = "Holiday";
      dayname.innerHTML = "休日";
      break;
    default:
      DAY = "Weekday";
      dayname.innerHTML = "平日";
  }
  if(HOLIDAYS.includes(date.getFullYear() + "/" + String(date.getMonth() + 1) + "/" + date.getDate())){
    DAY = "Holiday";
    dayname.innerHTML = "休日";
  }
  console.log(DAY);
  //dateStr = date.getFullYear() + String(date.getMonth() + 1) + date.getDate();
  //getTrainDay(datestr);


  for (const id of LineIDs) {
  //  for (const dt of TrainDetails) {
    trains[id] = document.getElementById(id).getElementsByClassName('trains')[0];
      for (var i = 0; i < trains[id].getElementsByClassName('train').length; i++) {
        detail.Train[id][i] = trains[id].getElementsByClassName('train')[i];
        detail.Num[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('num')[0];
        detail.Time[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('time')[0];
        detail.Kind[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('kind')[0];
        detail.Dest[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('dest')[0];
        detail.Cars[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('cars')[0];
        detail.Dep[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('dep')[0];
        detail.Info[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('info')[0];
        detail.Delay[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('delay')[0];
        detail.CSta[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('csta')[0];
        detail.Kara[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('kara')[0];
        detail.CKnd[id][i] = trains[id].getElementsByClassName('train')[i].getElementsByClassName('cknd')[0];
        d_tnum[id][i] = null;
       if(i) detail.Num[id][i].onclick = function(){addRows(id, 1);};
       else  detail.Num[id][i].onclick = function(){addRows(id,-1);};
      }
  //  }
  }
  loading.innerHTML = "表示設定開始";
  setStation(Number(localStorage.DefaultStaNum));
  for (const id of LineIDs) {
    trains[id].style.display = localStorage["Default" + id + "IsDisplayed"] == "true" ? "grid" : "none";
    setRows(id, Number(localStorage["Default" + id + "DisplayRows"]));
  }
  loading.innerHTML = "表示設定完了ダイヤソート開始";

  for (const id of LineIDs) {
    dia[DAY][id].sort( function(a,b){
      if(a.Time < b.Time) return -1;
      if(a.Time < b.Time) return  1;
      return 0;
    });
  }
  console.log("sorted dia[DAY]:");
  console.log(dia[DAY]);
  loading.innerHTML = "読み込み完了";
}

function autoSwitch(){
  t_cnt++;
  //console.log(t_cnt);
  if(t_cnt >= SWtimes) t_cnt = 0;
  for (const id of LineIDs) {
    for (var j = 0; j < detail.Kind[id].length; j++){
      if(d_tnum[id][j] != null){
        if(dia[DAY][id][d_tnum[id][j]] !== undefined && dia[DAY][id][d_tnum[id][j]].CKind != ""){ //当該時刻の電車が種別変更するとき
          if(  (stations[STA][id + "ud"] == "U" && STA > dia[DAY][id][d_tnum[id][j]].CSta)    //上り
             ||(stations[STA][id + "ud"] == "D" && STA < dia[DAY][id][d_tnum[id][j]].CSta)) { //下り
               //種別変更駅と現在表示している駅とを比較して（上り下りで逆になるよ）まだ種別変更してない場合にのみ以下へ進む
            switch (t_cnt) {
              case 1:
                //console.log("case1");
                detail.Kind[id][j].style.display = "none";
                detail.CSta[id][j].style.display = "flex";
                detail.Kara[id][j].style.display = "flex";
                detail.CKnd[id][j].style.display = "flex";
                detail.CSta[id][j].innerHTML = PressWidth(stations[dia[DAY][id][d_tnum[id][j]].CSta].name, 6);
                detail.CKnd[id][j].innerHTML = KindStr(dia[DAY][id][d_tnum[id][j]].CKind, false);
                detail.CKnd[id][j].style.backgroundColor = KindBColor(dia[DAY][id][d_tnum[id][j]].CKind);
                break;
              default:
                detail.Kind[id][j].innerHTML = KindStr(dia[DAY][id][d_tnum[id][j]].Kind);
                detail.Kind[id][j].style.backgroundColor = KindBColor(dia[DAY][id][d_tnum[id][j]].Kind);
                detail.Kind[id][j].style.display = "flex";
                detail.CSta[id][j].style.display = "none";
                detail.Kara[id][j].style.display = "none";
                detail.CKnd[id][j].style.display = "none";
            }
          }
        }
      }
    }
  }
  return;
  //kd = setInterval("dispall(TimePlusAlpha(GetNowTimeStr(), g_alpha))", intv);
}

function GetNowTimeStr() {
  var nowtime = new Date();
  var hh = nowtime.getHours();
  var mm = nowtime.getMinutes();
  if(hh < 3){
    hh = hh + 24;
  }
  if(hh < 10){
    hh = ('00' + hh).slice(-2);
  }
  if(mm < 10){
    mm = ('00' + mm).slice(-2);
  }
//  alert('' + hh + mm);
  return '' + hh + mm;
}

function EditTime(d) {
  d = Number(d);
  if(d < 1000){
    return "&ensp;" + String(d).slice(0,1) + ":" + String(d).slice(1); //ex) _9:21
    // TODO: 0:00はどうなる？
  }
  else if (d < 2400) {
    return String(d).slice(0,2) + ":" + String(d).slice(2);
  }
  else {
    return "&ensp;" + ('000' + String(Number(d) - 2400)).slice(-3, -2) + ":" + String(d).slice(2);
  }
}

function KindStr(id, n = true) {
  id = Number(id);
  if(n){
    switch (id) {
      case 0:
        return "<span style=\"transform: scale(0.75, 1)\; white-space: nowrap\;\">各駅停車</span>";
      case 1:
        return "快 速";
      case 2:
        return "<span style=\"transform: scale(0.75, 1)\; white-space: nowrap\;\">区間急行</span>";
      case 3:
        return "急 行";
      case 4:
        return "準特急";
      case 5:
        return "特 急";
      case 6:
        return '<img src="https://www.keio.co.jp/zasekishitei/common/imgs/head_logo01.png" style="object-fit: cover; object-position: 0 50%; height: 2.5rem; width: 9rem;">';
      case 9:
        return "回 送";
      case -1:
        return "　";
      default:
        return "種別なし";
    }
  }
  else{
    switch (id) {
      case 0:
        return "各駅停車";
      case 1:
        return "快 速";
      case 2:
        return "区間急行";
      case 3:
        return "急 行";
      case 4:
        return "準特急";
      case 5:
        return "特 急";
      case 6:
        return "京王ﾗｲﾅｰ";
      case 9:
        return "回 送";
      case -1:
        return "　";
      default:
        return "種別なし";
    }
  }
}
function KindBColor(id) {
  id = Number(id);
  switch (id) {
    case 0:
      return "#555"; //各停
    case 1:
      return "#11F"; //快速
    case 2:
      return "#ab0"; //区急
    case 3:
      return "#0a0"; //急行
    case 4:
      return "#f80"; //準特急
    case 5:
      return "#f00"; //特急
    case 6:
      return "#FFF"; //Liner
    case -1:
      return "#222";
    default:
      return "#000";
  }
}

//列車と駅を与えるとその駅発時におけるその列車の種別を返す
function TrainKind(train, sta) {
  if(train.TrainNum.slice(0,4) % 2){
    return sta < train.CSta ? train.Kind : train.CKind;
  }else{
    return sta > train.CSta ? train.Kind : train.CKind;
  }
}

function PressWidth(d, n) {
  if(d.length > n){
    return "<span style=\"transform: scaleX(" + n / d.length + "); white-space: nowrap;\">" + d + "</span>";
  }
  else {
    if      (n >= 5) {
      if      (d.length == 3) return d.slice(0, 1) + ' ' + d.slice(1, 2) + ' ' + d.slice(2);
      else if (d.length == 2) return d.slice(0, 1) + '　' + d.slice(1);
    }
    else if (n == 4) {
      if(d.length == 2) return d.slice(0,1) + ' ' + d.slice(1);
    }
    return d;
  }
}

function JustifyWidth(d, n) {
  return '<span style="transform: scaleX(' + n / d.length + '); white-space: nowrap;">' + d + '</span>';
}


function KindChangingTrain(station, kind) {
  return '<span style="font-size: 0.8rem;"><span style="color: #ff0;">' + JustifyWidth(station, 7) + '</span><br>' + PressWidth("から" ,1) + '<span style="font-size: 1.0rem; background-color: ' + KindBColor(kind) + ';">' + JustifyWidth(KindStr(kind), 5) + '</span></span>'
}

function getDelay(train, n = true) {
//  console.log("trainnum = " + trainnum);
  for (trainnum of [train.TrainNum, train.CTrainNum]) {
    for(var gdk = 0; gdk < t_tstb.length; gdk++){
      for(var gdi = 0; gdi < t_tstb[gdk].length; gdi++){
        for(var gdj = 0; gdj < t_tstb[gdk][gdi]["ps"].length; gdj++){
          if (String(String(t_tstb[gdk][gdi]["ps"][gdj]["tr"]).trim()) == String(trainnum)){
            if (n) {
              if (t_tstb[gdk][gdi]["ps"][gdj]["dl"] == "00") {
                return "---";
              }
              else{
                return "+" + String(t_tstb[gdk][gdi]["ps"][gdj]["dl"]);
              }
            }else{
              return String(t_tstb[gdk][gdi]["ps"][gdj]["dl"]);
            }
          }
        }
      }
    }
  }
  if(n){
    return "+??";
  }
  return "0";
}
//今の所未使用↓
function DiaJsonize() {
  dia = JSON.parse(dia);
  kudari_dia = dia[DAY].L2;
  nobori_dia = dia[DAY].L1;
  sagami_dia = dia[DAY].L3;
}

function IsKindChanged(sta, id) {
//種別変更されたかを返す
  if(dia[DAY][id].CSta != ""){
    if(stations[sta][id] + "ud" == "U"){
      if(sta > dia[DAY][LineID][i+j].CSta) {
        detail.Kind[LineID][j].innerHTML = KindStr(dia[DAY][LineID][i+j].Kind);
        detail.Kind[LineID][j].style.backgroundColor = KindBColor(dia[DAY][LineID][i+j].Kind);
      } else {
        detail.Kind[LineID][j].innerHTML = KindStr(dia[DAY][LineID][i+j].CKind);
        detail.Kind[LineID][j].style.backgroundColor = KindBColor(dia[DAY][LineID][i+j].CKind);
      }
    }else{
      if(sta < dia[DAY][LineID][i+j].CSta) {
        detail.Kind[LineID][j].innerHTML = KindStr(dia[DAY][LineID][i+j].Kind);
        detail.Kind[LineID][j].style.backgroundColor = KindBColor(dia[DAY][LineID][i+j].Kind);
      } else {
        detail.Kind[LineID][j].innerHTML = KindStr(dia[DAY][LineID][i+j].CKind);
        detail.Kind[LineID][j].style.backgroundColor = KindBColor(dia[DAY][LineID][i+j].CKind);
      }
    }
  }else{
    detail.Kind[LineID][j].innerHTML = KindStr(dia[DAY][LineID][i+j].Kind);
    detail.Kind[LineID][j].style.backgroundColor = KindBColor(dia[DAY][LineID][i+j].Kind);
  }
}


function isDep(train){
  if(train.DepSta == STA) return "始発";
  return "";
}

function isTrainTime(time) {
  if(typeof time == "string" || typeof time == "number") return time.search(/^\d{3,4}$/) < 0 ? false : true;
  else return false;
}

function StopStations(train) {
  var str = "";
  var time = "";
  var snd = "";
  var sndlist = ["a", "ah", "as", "ay", "az", "d"];
  if ((train.TrainNum).slice(0,4) % 2) { //奇数: 下り
    for (var i = 0; i < stations.length; i++) {
      for (dir of sndlist) {
        if (train["s" + i + dir] !== undefined && train["s" + i + dir] != ""){
          time = train["s" + i + dir];
          break;
        }
      }
//      if(i>51) console.log("bef i=" + i + "; time=" + time + "bit=" + time.charCodeAt(0));
//      if(i>51) console.log("aft i=" + i + "; time=" + time);
      str += stations[i].Kind >= TrainKind(train, i) && isTrainTime(time) ? stations[i].OneLetter : "　";
      time = "";
    }
  } else { //偶数: 上り
    for (var i = stations.length - 1; i >= 0; i--) {
      for (dir of sndlist) {
        if (train["s" + i + dir] !== undefined && train["s" + i + dir] != ""){
          time = train["s" + i + dir];
          break;
        }
      }
      str += stations[i].Kind >= TrainKind(train, i) && isTrainTime(time) ? stations[i].OneLetter : "　";
      time = "";
    }
  }
  return str;
}


function display(LineID, nowtime, sta, DispNum = 3) {
  // 各項目の取得
  ntime = document.getElementById('ntime');

  if(LineID == "now"){
    ntime.innerHTML = EditTime(nowtime);
    return;
  }

// for (item of TrainDetails) {
//   for (var i = 0; i < DispNum[LineID]; i++){
//     l_data[item][i] = document.getElementById(LineID).getElementsByClassName('l' + (i+1) + ' ' + item)[0];
//   }
// }
  // for (var i = 0; i < 3; i++) {
  //   l_time[i]  = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('time')[0];
  //   l_kind[i]  = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('kind')[0];
  //   l_dest[i]  = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('dest')[0];
  //   l_cars[i]  = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('cars')[0];
  //   l_dep[i]   = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('dep')[0];
  //   l_info[i]  = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('info')[0];
  //   l_delay[i] = document.getElementById(LineID).getElementsByClassName('train')[i].getElementsByClassName('delay')[0];
  // }

  document.getElementById(LineID).getElementsByClassName('dir-name')[0].innerHTML = stations[sta][LineID + "name"];
  document.getElementById(LineID).getElementsByClassName('dir-sta')[0].innerHTML = stations[sta][LineID + "info"];

  console.log("変更: " + stations[sta][LineID + "name"] + ", " + stations[sta][LineID + "info"]);

  if(stations[sta][LineID + "ud"] == ""){
    document.getElementById(LineID).style.display = 'none';
  }else{
    document.getElementById(LineID).style.display = '';
  }

//次発データ探し
  //時刻と比較して一番近いものの行番号を取得
  //行番号から３つ分取得→分取得
  var i = 1;
  while (true) {
    now_i[LineID] = Number(i);
    if(i < dia[DAY][LineID].length){
      if(Number(dia[DAY][LineID][i].Time) + Number(getDelay(dia[DAY][LineID][i], false)) >= Number(nowtime)){
        //i番目が次発データなので
        now_i[LineID] = Number(i); //番目を保存

//
        for(var j = 0; j < detail.Train[LineID].length; j++){
          if(i+j < dia[DAY][LineID].length){
            console.log(j + ":" + EditTime(dia[DAY][LineID][i+j].Time));
            detail.Time[LineID][j].innerHTML = EditTime(dia[DAY][LineID][i+j].Time);
            //上りのとき表示駅が変更駅より大きいならまだなので変更前種別，小さいか同じなら過ぎたので変更後種別
            //下りのとき表示駅が変更駅より小さいならまだなので変更前種別，大きいか同じなら過ぎたので変更後種別

            //Kind
            var kindfrom = "Kind";
            if(dia[DAY][LineID][i+j].CKind != ""){
              if(stations[sta][LineID + "ud"] == "U"){
                if(sta <= dia[DAY][LineID][i+j].CSta) kindfrom = "CKind";
              }else{
                if(sta >= dia[DAY][LineID][i+j].CSta) kindfrom = "CKind";
              }
            }
            detail.Kind[LineID][j].innerHTML = KindStr(dia[DAY][LineID][i+j][kindfrom]);
            detail.Kind[LineID][j].style.backgroundColor = KindBColor(dia[DAY][LineID][i+j][kindfrom]);


            //Destination
            detail.Dest[LineID][j].innerHTML = PressWidth(dia[DAY][LineID][i+j].Destination, 5);
            detail.Cars[LineID][j].innerHTML = dia[DAY][LineID][i+j].Cars;
            detail.Dep[LineID][j].innerHTML = dia[DAY][LineID][i+j].IsDep == true ? "始発" : "";
            // l_info[j].innerHTML = dia[DAY][LineID][i+j].Info;
            detail.Info[LineID][j].innerHTML = (i+j) + "; " + dia[DAY][LineID][i+j].TrainNum + ": " + dia[DAY][LineID][i+j].Info;
            detail.Info[LineID][j].innerHTML += "<BR>" + StopStations(dia[DAY][LineID][i+j]);
            detail.Delay[LineID][j].innerHTML = getDelay(dia[DAY][LineID][i+j]);
            d_tnum[LineID][j] = i+j;
          } else {
            detail.Time[LineID][j].innerHTML = " "; detail.Kind[LineID][j].innerHTML = " "; detail.Kind[LineID][j].style.backgroundColor = "#222"; detail.Dest[LineID][j].innerHTML = " ";
            detail.Cars[LineID][j].innerHTML = ""; detail.Delay[LineID][j].innerHTML = ""; detail.Dep[LineID][j].innerHTML = "";
            detail.Info[LineID][j].innerHTML = "";
            d_tnum[LineID][1] = null;
          }
        }
//
/*
        if(i < dia[DAY][LineID].length){
          console.log("1st: " + EditTime(dia[DAY][LineID][i].Time));
          l_time[0].innerHTML = EditTime(dia[DAY][LineID][i].Time);
          l_kind[0].innerHTML = KindStr(dia[DAY][LineID][i].Kind);
          l_kind[0].style.backgroundColor = KindBColor(dia[DAY][LineID][i].Kind);
          l_dest[0].innerHTML = PressWidth(dia[DAY][LineID][i].Destination, 5);
          l_cars[0].innerHTML = dia[DAY][LineID][i].Cars;
          l_dep[0].innerHTML = dia[DAY][LineID][i].IsDep;
          // l_info[0].innerHTML = dia[DAY][LineID][i].Info;
          l_info[0].innerHTML = (i) + "; " + dia[DAY][LineID][i].TrainNum + ": " + dia[DAY][LineID][i].Info;
          l_delay[0].innerHTML = getDelay(dia[DAY][LineID][i].TrainNum);
          d_tnum[LineID][0] = i;
        }

        if(i+1 < dia[DAY][LineID].length){
          console.log("2nd: " + EditTime(dia[DAY][LineID][i+1].Time));
          l_time[1].innerHTML = EditTime(dia[DAY][LineID][i+1].Time);
          l_kind[1].innerHTML = KindStr(dia[DAY][LineID][i+1].Kind);
          l_kind[1].style.backgroundColor = KindBColor(dia[DAY][LineID][i+1].Kind);
          l_dest[1].innerHTML = PressWidth(dia[DAY][LineID][i+1].Destination, 5);
          l_cars[1].innerHTML = dia[DAY][LineID][i+1].Cars;
          l_dep[1].innerHTML = dia[DAY][LineID][i+1].IsDep;
          // l_info[1].innerHTML = dia[DAY][LineID][i+1].Info;
          l_info[1].innerHTML = (i+1) + "; " + dia[DAY][LineID][i+1].TrainNum + ": " + dia[DAY][LineID][i+1].Info;
          l_delay[1].innerHTML = getDelay(dia[DAY][LineID][i+1].TrainNum);
          d_tnum[LineID][1] = i+1;
        } else {
          l_time[1].innerHTML = " "; l_kind[1].innerHTML = " "; l_kind[1].style.backgroundColor = "#222"; l_dest[1].innerHTML = " ";
          l_cars[1].innerHTML = ""; l_delay[1].innerHTML = ""; l_dep[1].innerHTML = "";
          l_info[1].innerHTML = "";
          d_tnum[LineID][1] = null;
        }

        if(i+2 < dia[DAY][LineID].length){
          console.log("3rd: " + EditTime(dia[DAY][LineID][i+2].Time));
          l_time[2].innerHTML = EditTime(dia[DAY][LineID][i+2].Time);
          l_kind[2].innerHTML = KindStr(dia[DAY][LineID][i+2].Kind);
          l_kind[2].style.backgroundColor = KindBColor(dia[DAY][LineID][i+2].Kind);
          l_dest[2].innerHTML = PressWidth(dia[DAY][LineID][i+2].Destination, 5);
          l_cars[2].innerHTML = dia[DAY][LineID][i+2].Cars;
          l_dep[2].innerHTML = dia[DAY][LineID][i+2].IsDep;
          // l_info[2].innerHTML = dia[DAY][LineID][i+2].Info;
          l_info[2].innerHTML = (i+2) + "; " + dia[DAY][LineID][i+2].TrainNum + ": " + dia[DAY][LineID][i+2].Info;
          l_delay[2].innerHTML = getDelay(dia[DAY][LineID][i+2].TrainNum);
          d_tnum[LineID][2] = i+2;
        } else {
          l_time[2].innerHTML = ""; l_kind[2].innerHTML = ""; l_kind[2].style.backgroundColor = "#222"; l_dest[2].innerHTML = "";
          l_cars[2].innerHTML = ""; l_delay[2].innerHTML = ""; l_dep[2].innerHTML = "";
          l_info[2].innerHTML = "";
          d_tnum[LineID][2] = null;
        }
        i = 1;
*/
        break;
      }else {
        i++;
      }
    }else{
      console.log("else:");
      detail.Time[LineID][0].innerHTML = ""; detail.Kind[LineID][0].innerHTML = ""; detail.Kind[LineID][0].style.backgroundColor = "#222"; detail.Dest[LineID][0].innerHTML = "";
      detail.Cars[LineID][0].innerHTML = ""; detail.Delay[LineID][0].innerHTML = ""; detail.Dep[LineID][0].innerHTML = "";
      detail.Info[LineID][0].innerHTML = "<span style=\"color: yellow;\">本日の電車はすべて終了しました</span>";
      d_tnum[LineID][0] = null;

      detail.Time[LineID][1].innerHTML = " "; detail.Kind[LineID][1].innerHTML = ""; detail.Kind[LineID][1].style.backgroundColor = "#222"; detail.Dest[LineID][1].innerHTML = "";
      detail.Cars[LineID][1].innerHTML = ""; detail.Delay[LineID][1].innerHTML = ""; detail.Dep[LineID][1].innerHTML = "";
      detail.Info[LineID][1].innerHTML = "";
      d_tnum[LineID][1] = null;

      detail.Time[LineID][2].innerHTML = ""; detail.Kind[LineID][2].innerHTML = ""; detail.Kind[LineID][2].style.backgroundColor = "#222"; detail.Dest[LineID][2].innerHTML = "";
      detail.Cars[LineID][2].innerHTML = ""; detail.Delay[LineID][2].innerHTML = ""; detail.Dep[LineID][2].innerHTML = "";
      detail.Info[LineID][2].innerHTML = "";
      d_tnum[LineID][2] = null;

      i = 1;
      break;
    }
  }
}
function dispall(time, sta = 18) {
  if(typeof asw !== 'undefined'){
    clearInterval(asw);
    for (id of LineIDs) {
      for (var j = 0; j < detail.Kind[id].length; j++){
        detail.Kind[id][j].style.display = "flex";
        detail.CSta[id][j].style.display = "none";
        detail.Kara[id][j].style.display = "none";
        detail.CKnd[id][j].style.display = "none";
      }
    }
  }
  getTrafficInfo();
  display("L1", time, sta);
  display("L2", time, sta);
  display("L3", time, sta);
  display("now", time, sta);
  asw = setInterval("autoSwitch()", SWintv);
}

function TimePlusAlpha(ptime, palpha){
  var pmin = ptime % 100 + palpha;
  var phour = Math.floor(ptime / 100) * 100;
  while(true){
    if(pmin <= 0) break;
    phour += 100;
    pmin -= 60;
  }
  while(true){
    if(pmin >= 0) break;
    phour -= 100;
    pmin += 60;
  }
  return phour + pmin;
}

function autoRefreshOn(alpha = 0, intv = 10000){
  if(typeof iv !== 'undefined'){
    autoRefreshOff();
  }
  g_alpha = alpha;
  dispall(TimePlusAlpha(GetNowTimeStr(), g_alpha), STA);
  iv = setInterval("dispall(TimePlusAlpha(GetNowTimeStr(), g_alpha), STA)", intv);
  document.getElementById("autoref").innerHTML = "自動更新ON";
}

function autoRefreshOff(){
  clearInterval(iv);
  document.getElementById("autoref").innerHTML = "自動更新OFF";
}
function autoSwitchOff(){
  clearInterval(asw);
  document.getElementById("autoref").innerHTML = "自動表示切替OFF";
}
// fixedtodo 50分を超えたときalphaがex)1869などになって動かない不具合
// fixedTODO: 終電後の(値がないことによる)取得エラーデバッグ
// TODO: 遅延取得・表示
// TODO: 始発表示
