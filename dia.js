
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
//    console.log("i=" + i + ", items = " + items.length + "; arrayD = " + arrayD.length);
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

getCSVSta("stations.csv");

getCSVDia("dia_w_u.csv", "Weekday", "U");
getCSVDia("dia_w_d.csv", "Weekday", "D");
getCSVDia("dia_h_u.csv", "Holiday", "U");
getCSVDia("dia_h_d.csv", "Holiday", "D");


//keioの駅探時刻表から平日・土休日を取得し返す関数
function getTrainDay(date) {
  var url = "https://ekitan.com/timetable/railway/line-station/262-0/d1?dt=";
  getCSV(url + date, setTrainDay)
}

function setTrainDay() {
  console.log(this.responseXML);
}
