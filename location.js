
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
