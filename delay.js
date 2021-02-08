function getTrafficInfo(){
  t_dt = [];
  t_tstb = [];

	$("#status").text("遅延データ取得中");
	// 送信先のURL
  const url = "//i.opentidkeio.jp/data/traffic_info.json";
	// 1. $.getJSONメソッドで通信を行う
  $.ajaxSetup({async: false});
	$.getJSON(url)
		// 2. doneは、通信に成功した時に実行される
		//  引数のdata1は、通信で取得したデータ
		.done(function(traffic_raw,textStatus,jqXHR) {
			// 3. キーを指定して値を表示
      t_dt = traffic_raw["up"][0]["dt"][0];
	//		$("#span3").text(t_dt["yy"] + t_dt["mt"] + t_dt["dy"] + "_" + t_dt["hh"] + t_dt["mm"] + t_dt["ss"]);
      if("TS" in traffic_raw) t_tstb[0] = traffic_raw["TS"];
      else t_tstb[0] = [];
      if("TB" in traffic_raw) t_tstb[1] = traffic_raw["TB"];
      else t_tstb[1] = [];

			// 4. JavaScriptオブジェクトをJSONに変換
			const traffic_data = JSON.stringify(traffic_raw);
      console.log("traffic_data:");
			console.log(traffic_data); //コンソールにJSONが表示される

		})
		// 5. failは、通信に失敗した時に実行される
		.fail(function(jqXHR, textStatus, errorThrown ) {
//			$("#span1").text(jqXHR.status); //例：404
//			$("#span2").text(textStatus); //例：error
      $("#status").text("遅延：取得失敗");
//			$("#span3").text(errorThrown); //例：NOT FOUND
		})
		// 6. alwaysは、成功/失敗に関わらず実行される
		.always(function() {
			$("#status").text("遅延：" + t_dt.hh + ":" + t_dt.mm + ":" + t_dt.ss + "現在");
		});
  $.ajaxSetup({async: true});
}
